import { randomUUID } from "node:crypto";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer } from "ws";
import { BridgeOverloadedError, ClientDisconnectedError, ClientNotFoundError, ExecutionFailedError, ExecutionTimeoutError, toDomainError, } from "../../domain/errors/errors.js";
import { PROTOCOL_VERSION } from "../../domain/protocol/messages.js";
import { ClientId, RequestId, UserId } from "../../domain/shared/ids.js";
import { decodeClientMessage, encodeServerMessage } from "./protocol-codec.js";
const OUTPUT_KINDS = new Set(["print", "info", "warn", "error", "system"]);
function asOutputKind(value) {
    return typeof value === "string" && OUTPUT_KINDS.has(value) ? value : "print";
}
/** Normalize a ws frame to UTF-8 text. ws may deliver a Buffer, ArrayBuffer, or Buffer[]. */
function rawDataToString(data) {
    if (typeof data === "string")
        return data;
    if (Array.isArray(data))
        return Buffer.concat(data).toString("utf8");
    if (Buffer.isBuffer(data))
        return data.toString("utf8");
    return Buffer.from(data).toString("utf8");
}
/** Server identity reported to connectors in the `welcome` frame. */
const SERVER_VERSION = "2.0.0";
const MAX_BRIDGE_FRAME_BYTES = 8 * 1024 * 1024;
const MAX_SOCKET_BUFFERED_BYTES = 2 * 1024 * 1024;
const DEFAULT_MAX_CONCURRENT_EVALS = 2;
const DEFAULT_MAX_QUEUED_EVALS = 128;
const DEFAULT_MAX_QUEUED_SOURCE_BYTES = 4 * 1024 * 1024;
const DEFAULT_RPC_BATCH_CONCURRENCY = 8;
const DEFAULT_MAX_RPC_BATCH_CALLS = 128;
const DEFAULT_MAX_CONCURRENT_RPC_FRAMES = 2;
const DEFAULT_MAX_QUEUED_RPC_FRAMES = 32;
/** Per-connection cap on distinct pub/sub channel subscriptions. */
const MAX_PUBSUB_CHANNELS = 64;
/**
 * The bridge transport. Owns the HTTP server (health + extensible routes) and a
 * WebSocket endpoint at `/bridge` where in-game connectors attach. Implements the
 * {@link ExecutionGateway} (run code on a client, await its result) and the
 * {@link ClientDirectory} (the live read model of connected clients) ports.
 *
 * Lifecycle: construct -> optionally `addRoutes(...)` -> `start()` -> ... ->
 * `stop()`. The composition root may also mount more routes on {@link http}
 * before `start()`.
 */
export class BridgeServer {
    http;
    config;
    logger;
    clock;
    metrics;
    output;
    scriptBridge = null;
    /** Optional sink for client connect/disconnect events (used by the dashboard WS). */
    onClientChange = null;
    /** Channel name -> set of subscribed clientIds for cross-game pub/sub. */
    pubsubByChannel = new Map();
    /** Subscribe to client connect/disconnect events. Pass null to unsubscribe. */
    setOnClientChange(fn) {
        this.onClientChange = fn;
    }
    connections = new Map();
    wss;
    httpServer = null;
    heartbeat = null;
    started = false;
    totalRejectedEvals = 0;
    /** Extra WebSocket paths the composition root has registered (e.g. /ws/dashboard). */
    extraUpgrades = new Map();
    constructor(deps) {
        this.config = deps.config;
        this.logger = deps.logger.child({ component: "bridge" });
        this.clock = deps.clock;
        this.metrics = deps.metrics;
        this.output = deps.output;
        this.http = new Hono();
        this.http.get("/health", (c) => c.json({ status: "ok" }));
        // `/` is left for the composition root to claim (the dashboard, or a fallback).
        // Created in `noServer` mode; we route the HTTP `upgrade` event to it so the
        // same port serves both Hono routes and the `/bridge` WebSocket.
        this.wss = new WebSocketServer({ noServer: true, maxPayload: MAX_BRIDGE_FRAME_BYTES });
        this.wss.on("connection", (socket) => this.onConnection(socket));
        this.wss.on("error", (error) => {
            this.logger.error({ err: toDomainError(error).toJSON() }, "websocket server error");
        });
    }
    /**
     * Let the composition root register additional routes before `start()`.
     * Returns `this.http` so callers can also chain on it directly.
     */
    addRoutes(fn) {
        fn(this.http);
        return this.http;
    }
    // ── lifecycle ──────────────────────────────────────────────────────────────
    async start() {
        if (this.started)
            return;
        this.started = true;
        const { host, port } = this.config.server;
        await new Promise((resolve, reject) => {
            const server = serve({
                fetch: this.http.fetch,
                hostname: host,
                port,
            }, () => resolve());
            this.httpServer = server;
            server.on("error", (error) => {
                // Surface bind failures (e.g. EADDRINUSE) to the caller of start().
                reject(toDomainError(error));
            });
            server.on("upgrade", (request, socket, head) => {
                const { url } = request;
                if (!url) {
                    socket.destroy();
                    return;
                }
                const pathname = new URL(url, `http://${request.headers.host ?? "localhost"}`).pathname;
                if (pathname === "/bridge") {
                    this.wss.handleUpgrade(request, socket, head, (ws) => {
                        this.wss.emit("connection", ws, request);
                    });
                    return;
                }
                const extra = this.extraUpgrades.get(pathname);
                if (extra) {
                    extra(request, socket, head);
                    return;
                }
                socket.destroy();
            });
        });
        this.startHeartbeat();
        this.logger.info({ host, port }, "bridge listening");
    }
    async stop() {
        if (!this.started)
            return;
        this.started = false;
        if (this.heartbeat) {
            clearInterval(this.heartbeat);
            this.heartbeat = null;
        }
        // Tear down every connection: reject in-flight work and close the socket.
        for (const connection of [...this.connections.values()]) {
            this.dropConnection(connection, "server is shutting down");
        }
        await new Promise((resolve) => this.wss.close(() => resolve()));
        const server = this.httpServer;
        this.httpServer = null;
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => (error ? reject(toDomainError(error)) : resolve()));
            });
        }
        this.logger.info("bridge stopped");
    }
    // ── ClientDirectory ──────────────────────────────────────────────────────────
    list() {
        return [...this.connections.values()].map((c) => c.client);
    }
    get(clientId) {
        return this.connections.get(clientId)?.client;
    }
    loadSnapshot() {
        const now = this.clock.monotonic();
        const concurrentLimit = this.maxConcurrentEvals();
        const queuedLimit = this.maxQueuedEvals();
        const sourceLimit = this.maxQueuedSourceBytes();
        const rpcConcurrentLimit = this.maxConcurrentRpcFrames();
        const rpcQueuedLimit = this.maxQueuedRpcFrames();
        const clients = [...this.connections.values()].map((connection) => {
            const oldest = connection.evalQueue.reduce((value, ticket) => Math.min(value, ticket.enqueuedAt), Number.POSITIVE_INFINITY);
            let activeScriptParents = 0;
            for (const ticket of connection.pending.values()) {
                if (ticket.request.scriptToken && ticket.request.priority !== "nested") {
                    activeScriptParents += 1;
                }
            }
            return {
                clientId: connection.id,
                activeEvals: connection.pending.size,
                queuedEvals: connection.evalQueue.length,
                queuedSourceBytes: connection.queuedSourceBytes,
                activeScriptParents,
                queuedNestedEvals: connection.evalQueue.filter((ticket) => ticket.request.priority === "nested").length,
                queuedAgents: new Set(connection.evalQueue.map((ticket) => ticket.request.schedulerKey ?? "anonymous")).size,
                activeRpcFrames: connection.activeRpcFrames,
                queuedRpcFrames: connection.rpcQueue.length,
                rejectedEvals: connection.rejectedEvals,
                oldestQueuedMs: Number.isFinite(oldest) ? Math.max(0, now - oldest) : 0,
                limits: {
                    concurrentEvals: concurrentLimit,
                    queuedEvals: queuedLimit,
                    queuedSourceBytes: sourceLimit,
                    concurrentRpcFrames: rpcConcurrentLimit,
                    queuedRpcFrames: rpcQueuedLimit,
                },
            };
        });
        return {
            activeEvals: clients.reduce((sum, client) => sum + client.activeEvals, 0),
            queuedEvals: clients.reduce((sum, client) => sum + client.queuedEvals, 0),
            queuedSourceBytes: clients.reduce((sum, client) => sum + client.queuedSourceBytes, 0),
            activeRpcFrames: clients.reduce((sum, client) => sum + client.activeRpcFrames, 0),
            queuedRpcFrames: clients.reduce((sum, client) => sum + client.queuedRpcFrames, 0),
            rejectedEvals: this.totalRejectedEvals,
            saturatedClients: clients.filter((client) => client.queuedEvals > 0 &&
                (client.activeEvals >= concurrentLimit || client.queuedEvals >= queuedLimit * 0.8)).length,
            clients,
        };
    }
    /**
     * Register an additional WebSocket upgrade handler at a specific path on the
     * same HTTP server. Used by the dashboard to mount `/ws/dashboard` for live
     * push without spinning up a second port.
     */
    addUpgrade(path, handler) {
        this.extraUpgrades.set(path, handler);
    }
    /** Wire the bridge's RPC routing after construction (breaks the dep cycle). */
    attachScripting(scriptBridge) {
        if (this.scriptBridge && this.scriptBridge !== scriptBridge) {
            this.logger.warn("attachScripting called twice; replacing previous script bridge");
        }
        this.scriptBridge = scriptBridge;
    }
    // ── ClientAdmin ──────────────────────────────────────────────────────────────
    disconnect(clientId, reason = "disconnected from dashboard") {
        const connection = this.connections.get(clientId);
        if (!connection)
            return false;
        this.dropConnection(connection, reason);
        return true;
    }
    // ── ExecutionGateway ─────────────────────────────────────────────────────────
    eval(clientId, request, signal) {
        const connection = this.connections.get(clientId);
        if (!connection) {
            return Promise.reject(new ClientNotFoundError(`Client "${clientId}" is not connected.`, { clientId }));
        }
        if (signal?.aborted) {
            return Promise.reject(this.abortError(signal));
        }
        const timeoutMs = request.timeoutMs ?? this.config.execution.defaultTimeoutMs;
        const threadContext = request.threadContext ?? this.config.execution.defaultThreadContext;
        const priority = request.priority ?? "normal";
        const sourceBytes = Buffer.byteLength(request.source, "utf8");
        const maxQueue = this.maxQueuedEvals();
        const nestedReserve = Math.min(8, Math.max(1, Math.floor(maxQueue / 10)));
        const normalQueueLimit = Math.max(1, maxQueue - nestedReserve);
        const maxSourceBytes = this.maxQueuedSourceBytes();
        const normalSourceLimit = Math.floor(maxSourceBytes * 0.75);
        const queueLimit = priority === "nested" ? maxQueue : normalQueueLimit;
        const sourceLimit = priority === "nested" ? maxSourceBytes : normalSourceLimit;
        const schedulerKey = request.schedulerKey ?? "anonymous";
        const ownerQueued = connection.evalQueue.filter((ticket) => (ticket.request.schedulerKey ?? "anonymous") === schedulerKey).length;
        const ownerQueueLimit = Math.max(1, Math.floor(normalQueueLimit * 0.9));
        if (connection.evalQueue.length >= queueLimit ||
            connection.queuedSourceBytes + sourceBytes > sourceLimit ||
            (priority !== "nested" && maxQueue >= 32 && ownerQueued >= ownerQueueLimit)) {
            connection.rejectedEvals += 1;
            this.totalRejectedEvals += 1;
            this.metrics.increment("bridge.eval.rejected", 1, { reason: "overloaded" });
            this.updateLoadMetrics();
            return Promise.reject(this.overloadedError(connection, {
                sourceBytes,
                priority,
                queueLimit,
                sourceLimit,
                schedulerKey,
                ownerQueued,
                ownerQueueLimit,
            }));
        }
        const requestId = RequestId(randomUUID());
        return new Promise((resolve, reject) => {
            const ticket = {
                id: requestId,
                request: { ...request, priority },
                resolve,
                reject,
                timeoutMs,
                threadContext,
                enqueuedAt: this.clock.monotonic(),
                sourceBytes,
                timer: null,
            };
            ticket.timer = setTimeout(() => {
                const wasQueued = connection.evalQueue.includes(ticket);
                this.settleEval(connection, ticket, () => reject(new ExecutionTimeoutError(wasQueued
                    ? `Eval expired after waiting ${timeoutMs}ms in the bounded client queue.`
                    : `Client did not respond within the ${timeoutMs}ms total eval deadline.`, {
                    clientId,
                    requestId,
                    timeoutMs,
                    phase: wasQueued ? "queue" : "execution",
                })));
            }, timeoutMs);
            ticket.timer.unref?.();
            if (signal) {
                const onAbort = () => this.settleEval(connection, ticket, () => reject(this.abortError(signal)));
                signal.addEventListener("abort", onAbort, { once: true });
                ticket.disposeAbort = () => signal.removeEventListener("abort", onAbort);
            }
            connection.evalQueue.push(ticket);
            connection.queuedSourceBytes += sourceBytes;
            this.metrics.increment("bridge.eval.enqueued");
            this.updateLoadMetrics();
            this.pumpEvalQueue(connection);
        });
    }
    /** Dispatch as much queued work as the game-safe lanes permit. */
    pumpEvalQueue(connection) {
        if (connection.pumpingEvals || this.connections.get(connection.id) !== connection) {
            return;
        }
        connection.pumpingEvals = true;
        // While the socket write buffer is full, nothing else re-triggers the pump, so
        // poll until it drains rather than stalling (or failing) the queued backlog.
        const rescheduleIfIdle = () => {
            if (connection.pending.size === 0 && connection.evalQueue.length > 0) {
                const timer = setTimeout(() => this.pumpEvalQueue(connection), 50);
                timer.unref?.();
            }
        };
        try {
            while (connection.pending.size < this.maxConcurrentEvals()) {
                // Transient write backpressure: leave queued work queued (it is NOT a
                // failure) instead of dispatching into a saturated socket.
                if (connection.socket.bufferedAmount > MAX_SOCKET_BUFFERED_BYTES) {
                    rescheduleIfIdle();
                    break;
                }
                const index = this.nextEvalIndex(connection);
                if (index < 0)
                    break;
                const [ticket] = connection.evalQueue.splice(index, 1);
                if (!ticket)
                    break;
                connection.queuedSourceBytes = Math.max(0, connection.queuedSourceBytes - ticket.sourceBytes);
                ticket.dispatchedAt = this.clock.monotonic();
                connection.pending.set(ticket.id, ticket);
                if (ticket.request.priority !== "nested" && !ticket.request.scriptToken) {
                    connection.lastNormalSchedulerKey = ticket.request.schedulerKey ?? "anonymous";
                }
                this.metrics.observe("bridge.eval_queue_ms", ticket.dispatchedAt - ticket.enqueuedAt);
                this.updateLoadMetrics();
                const elapsed = Math.max(0, ticket.dispatchedAt - ticket.enqueuedAt);
                const remainingTimeoutMs = Math.max(1, Math.floor(ticket.timeoutMs - elapsed));
                try {
                    this.send(connection, {
                        type: "op",
                        id: ticket.id,
                        op: {
                            kind: "eval",
                            source: ticket.request.source,
                            threadContext: ticket.threadContext,
                            timeoutMs: remainingTimeoutMs,
                            ...(ticket.request.env ? { env: ticket.request.env } : {}),
                            ...(ticket.request.scriptToken ? { scriptToken: ticket.request.scriptToken } : {}),
                            priority: ticket.request.priority ?? "normal",
                            ...(ticket.request.vmScope ? { vmScope: ticket.request.vmScope } : {}),
                        },
                    });
                }
                catch (error) {
                    if (error instanceof BridgeOverloadedError) {
                        // Socket saturated mid-dispatch but still open: put the ticket back and
                        // stop pumping — don't fail live work over transient backpressure.
                        connection.pending.delete(ticket.id);
                        ticket.dispatchedAt = undefined;
                        connection.evalQueue.unshift(ticket);
                        connection.queuedSourceBytes += ticket.sourceBytes;
                        this.updateLoadMetrics();
                        rescheduleIfIdle();
                        break;
                    }
                    this.settleEval(connection, ticket, () => ticket.reject(toDomainError(error)));
                }
            }
        }
        finally {
            connection.pumpingEvals = false;
            this.updateLoadMetrics();
        }
    }
    /** Nested work wins; a script parent runs alone while retaining one reserved nested lane. */
    nextEvalIndex(connection) {
        if (connection.pending.size >= this.maxConcurrentEvals())
            return -1;
        const nestedIndex = connection.evalQueue.findIndex((ticket) => ticket.request.priority === "nested");
        if (nestedIndex >= 0)
            return nestedIndex;
        const hasActiveScriptParent = [...connection.pending.values()].some((ticket) => ticket.request.scriptToken && ticket.request.priority !== "nested");
        if (hasActiveScriptParent)
            return -1;
        const parentIndex = connection.evalQueue.findIndex((ticket) => ticket.request.scriptToken && ticket.request.priority !== "nested");
        if (parentIndex >= 0) {
            return connection.pending.size <= this.maxConcurrentEvals() - 2 ? parentIndex : -1;
        }
        const fairIndex = connection.evalQueue.findIndex((ticket) => (ticket.request.schedulerKey ?? "anonymous") !== connection.lastNormalSchedulerKey);
        return fairIndex >= 0 ? fairIndex : connection.evalQueue.length > 0 ? 0 : -1;
    }
    settleEval(connection, ticket, settle) {
        const wasPending = connection.pending.delete(ticket.id);
        const queuedIndex = connection.evalQueue.indexOf(ticket);
        if (!wasPending && queuedIndex < 0)
            return;
        if (queuedIndex >= 0) {
            connection.evalQueue.splice(queuedIndex, 1);
            connection.queuedSourceBytes = Math.max(0, connection.queuedSourceBytes - ticket.sourceBytes);
        }
        if (ticket.timer)
            clearTimeout(ticket.timer);
        ticket.timer = null;
        ticket.disposeAbort?.();
        const now = this.clock.monotonic();
        this.metrics.observe("bridge.eval_ms", now - ticket.enqueuedAt);
        if (ticket.dispatchedAt !== undefined) {
            this.metrics.observe("bridge.eval_execution_ms", now - ticket.dispatchedAt);
        }
        settle();
        this.updateLoadMetrics();
        this.pumpEvalQueue(connection);
    }
    // ── connection handling ──────────────────────────────────────────────────────
    onConnection(socket) {
        // A socket is anonymous until it sends a valid `hello`. Until then it has no
        // ClientId and is not part of the directory; a bad/absent handshake is dropped.
        let registered = null;
        // Give the handshake a generous window independent of the (possibly fast)
        // heartbeat, so a brief network hiccup on connect doesn't drop a real connector.
        const handshakeTimeoutMs = Math.max(this.config.bridge.heartbeatIntervalMs, 10000);
        const handshakeDeadline = setTimeout(() => {
            if (!registered) {
                this.logger.warn("connector failed to handshake in time; closing");
                socket.close();
            }
        }, handshakeTimeoutMs);
        handshakeDeadline.unref?.();
        socket.on("message", (data) => {
            let message;
            try {
                message = decodeClientMessage(rawDataToString(data));
            }
            catch (error) {
                this.logger.warn({ err: toDomainError(error).toJSON() }, "dropping malformed bridge message");
                return;
            }
            if (registered) {
                this.handleMessage(registered, message);
                return;
            }
            if (message.type !== "hello") {
                this.logger.warn({ type: message.type }, "expected hello before any other message");
                return;
            }
            const expected = this.config.bridge.authToken;
            if (expected) {
                const provided = message.client.token ?? null;
                if (provided !== expected) {
                    this.logger.warn({ hasToken: provided !== null, executor: message.client.executor }, "bridge auth token mismatch; closing connection");
                    this.metrics.increment("bridge.auth.rejected");
                    try {
                        socket.close(1008, "bad bridge token");
                    }
                    catch {
                        // socket may already be torn down; nothing actionable.
                    }
                    return;
                }
            }
            clearTimeout(handshakeDeadline);
            registered = this.registerConnection(socket, message.protocolVersion, message.client);
        });
        socket.on("close", () => {
            clearTimeout(handshakeDeadline);
            if (registered)
                this.dropConnection(registered, "socket closed");
        });
        socket.on("error", (error) => {
            this.logger.warn({ err: toDomainError(error).toJSON(), clientId: registered?.id }, "socket error");
        });
    }
    registerConnection(socket, protocolVersion, handshake) {
        if (protocolVersion !== PROTOCOL_VERSION) {
            this.logger.warn({ received: protocolVersion, expected: PROTOCOL_VERSION }, "connector protocol version mismatch");
        }
        // Prefer the connector-provided stable identity. New connectors preserve
        // it across WebSocket retries, which keeps MCP selections and dashboard
        // client overrides valid while the socket is being replaced. Older or
        // malformed connectors still get a server-generated ID for compatibility.
        const requestedId = handshake.clientId.trim();
        const id = requestedId.length > 0 && requestedId.length <= 256
            ? ClientId(requestedId)
            : ClientId(randomUUID());
        // A reconnect can arrive before the old socket's close event. Replace that
        // stale socket deterministically instead of exposing two entries with the
        // same logical connector or routing work into the old connection.
        const previous = this.connections.get(id);
        if (previous) {
            this.logger.info({ clientId: id }, "replacing stale connector connection");
            this.dropConnection(previous, "replaced by connector reconnect");
        }
        const client = {
            id,
            userId: handshake.userId === null ? null : UserId(handshake.userId),
            username: handshake.username,
            displayName: handshake.displayName,
            gameName: handshake.gameName ?? null,
            placeId: handshake.placeId,
            jobId: handshake.jobId,
            executor: handshake.executor,
            capabilities: handshake.capabilities,
            connectedAt: this.clock.now(),
        };
        const connection = {
            id,
            socket,
            client,
            pending: new Map(),
            evalQueue: [],
            queuedSourceBytes: 0,
            rejectedEvals: 0,
            pumpingEvals: false,
            rpcQueue: [],
            activeRpcFrames: 0,
            lastNormalSchedulerKey: null,
            missedPongs: 0,
            subscribedChannels: new Set(),
        };
        this.connections.set(id, connection);
        this.metrics.increment("bridge.clients.connected");
        this.metrics.gauge("bridge.clients", this.connections.size);
        this.updateLoadMetrics();
        if (this.onClientChange)
            this.onClientChange("connect", id);
        this.logger.info({ clientId: id, username: client.username, executor: client.executor }, "connector registered");
        try {
            this.send(connection, {
                type: "welcome",
                serverVersion: SERVER_VERSION,
                heartbeatIntervalMs: this.config.bridge.heartbeatIntervalMs,
            });
        }
        catch (error) {
            this.logger.error({ err: toDomainError(error).toJSON(), clientId: id }, "failed to send welcome");
        }
        return connection;
    }
    handleMessage(connection, message) {
        // Any inbound frame proves the connector is alive. Reset the heartbeat strike
        // counter here (not only on `pong`) so a busy connector that is actively
        // streaming results/output/rpc frames is never reaped for a late pong.
        connection.missedPongs = 0;
        switch (message.type) {
            case "result": {
                const ticket = connection.pending.get(message.id);
                if (!ticket) {
                    // Late/duplicate result (already timed out or aborted). Ignore.
                    this.logger.debug({ clientId: connection.id, requestId: message.id }, "result for unknown/settled request");
                    return;
                }
                const { result } = message;
                if (result.ok) {
                    this.settleEval(connection, ticket, () => ticket.resolve(result.value));
                }
                else if (result.kind === "timeout") {
                    this.settleEval(connection, ticket, () => ticket.reject(new ExecutionTimeoutError(result.error, {
                        clientId: connection.id,
                        requestId: message.id,
                    })));
                }
                else if (result.kind === "overloaded") {
                    connection.rejectedEvals += 1;
                    this.totalRejectedEvals += 1;
                    this.metrics.increment("bridge.eval.rejected", 1, { reason: "connector-overloaded" });
                    this.settleEval(connection, ticket, () => ticket.reject(new BridgeOverloadedError(result.error, {
                        clientId: connection.id,
                        requestId: message.id,
                        source: "connector",
                    })));
                }
                else {
                    this.settleEval(connection, ticket, () => ticket.reject(new ExecutionFailedError(result.error, {
                        clientId: connection.id,
                        requestId: message.id,
                    })));
                }
                return;
            }
            case "pong": {
                connection.missedPongs = 0;
                return;
            }
            case "event": {
                if (message.channel === "output") {
                    this.recordOutput(connection, message.data);
                }
                else {
                    this.logger.debug({ clientId: connection.id, channel: message.channel }, "connector event");
                }
                return;
            }
            case "hello": {
                // A second hello on an already-registered socket is unexpected; ignore it
                // rather than re-keying a live connection.
                this.logger.warn({ clientId: connection.id }, "duplicate hello ignored");
                return;
            }
            case "rpc-call": {
                this.enqueueRpcFrame(connection, message);
                return;
            }
            case "rpc-batch": {
                this.enqueueRpcFrame(connection, message);
                return;
            }
            case "pubsub-subscribe": {
                // Cap distinct channels per connection so one connector can't grow the
                // pub/sub map without bound.
                if (!connection.subscribedChannels.has(message.channel) &&
                    connection.subscribedChannels.size >= MAX_PUBSUB_CHANNELS) {
                    this.logger.warn({ clientId: connection.id, limit: MAX_PUBSUB_CHANNELS }, "pubsub subscribe rejected: per-connection channel cap reached");
                    return;
                }
                let set = this.pubsubByChannel.get(message.channel);
                if (!set) {
                    set = new Set();
                    this.pubsubByChannel.set(message.channel, set);
                }
                set.add(connection.id);
                connection.subscribedChannels.add(message.channel);
                return;
            }
            case "pubsub-unsubscribe": {
                connection.subscribedChannels.delete(message.channel);
                const set = this.pubsubByChannel.get(message.channel);
                if (set) {
                    set.delete(connection.id);
                    if (set.size === 0)
                        this.pubsubByChannel.delete(message.channel);
                }
                return;
            }
            case "pubsub-publish": {
                this.routePubSub(connection.id, message.channel, message.payload);
                return;
            }
            default: {
                const exhaustive = message;
                void exhaustive;
                return;
            }
        }
    }
    /**
     * In-game `mcp.<tool>(args)` calls arrive as `rpc-call` frames over this same
     * socket. Route them through the {@link ScriptBridge} (token-gated) and reply
     * with `rpc-result`. Errors are reported back, not thrown, so a flaky tool
     * never breaks the connection.
     */
    enqueueRpcFrame(connection, frame) {
        if (connection.rpcQueue.length >= this.maxQueuedRpcFrames()) {
            this.metrics.increment("bridge.rpc.rejected", 1, { reason: "queue-full" });
            const result = {
                ok: false,
                error: "Bridge RPC queue is full. Reduce mcp.parallel width and retry after bridge-status reports that the queue drained.",
                code: "BRIDGE_OVERLOADED",
            };
            if (frame.type === "rpc-call") {
                this.sendRpcResult(connection, frame.id, result);
            }
            else {
                const results = frame.calls.map((call) => ({ key: call.key, ...result }));
                try {
                    this.send(connection, { type: "rpc-batch-result", id: frame.id, results });
                }
                catch (error) {
                    this.logger.warn({ err: toDomainError(error).toJSON(), clientId: connection.id, rpcId: frame.id }, "failed to send overloaded rpc-batch-result");
                }
            }
            return;
        }
        connection.rpcQueue.push(frame);
        this.updateLoadMetrics();
        this.pumpRpcFrames(connection);
    }
    pumpRpcFrames(connection) {
        if (this.connections.get(connection.id) !== connection)
            return;
        while (connection.activeRpcFrames < this.maxConcurrentRpcFrames() &&
            connection.rpcQueue.length > 0) {
            const frame = connection.rpcQueue.shift();
            if (!frame)
                break;
            connection.activeRpcFrames += 1;
            this.updateLoadMetrics();
            const run = frame.type === "rpc-call"
                ? this.handleRpcCall(connection, frame)
                : this.handleRpcBatch(connection, frame);
            void run
                .catch((error) => {
                this.logger.warn({ err: toDomainError(error).toJSON(), clientId: connection.id, rpcId: frame.id }, "guarded RPC frame failed");
            })
                .finally(() => {
                connection.activeRpcFrames = Math.max(0, connection.activeRpcFrames - 1);
                this.updateLoadMetrics();
                this.pumpRpcFrames(connection);
            });
        }
    }
    async handleRpcCall(connection, msg) {
        const bridge = this.scriptBridge;
        if (!bridge) {
            this.sendRpcResult(connection, msg.id, {
                ok: false,
                error: "scripting bridge not attached",
            });
            return;
        }
        const result = await bridge.run(msg.token, msg.tool, msg.args);
        this.sendRpcResult(connection, msg.id, result);
    }
    /**
     * Parallel sibling of `handleRpcCall`. A script's `mcp.all({...})` arrives as
     * one `rpc-batch` frame; we run entries through a bounded worker pool
     * (each entry counts against the per-script budget) and reply with a single
     * `rpc-batch-result`. One frame in, one frame out — no per-call latency stacking.
     */
    async handleRpcBatch(connection, msg) {
        const bridge = this.scriptBridge;
        const results = new Array(msg.calls.length);
        const accepted = Math.min(msg.calls.length, this.maxRpcBatchCalls());
        if (bridge) {
            let cursor = 0;
            const worker = async () => {
                while (cursor < accepted) {
                    const index = cursor;
                    cursor += 1;
                    const call = msg.calls[index];
                    if (!call)
                        continue;
                    const r = await bridge.run(msg.token, call.tool, call.args);
                    results[index] = r.ok
                        ? { key: call.key, ok: true, data: r.data }
                        : {
                            key: call.key,
                            ok: false,
                            error: r.error,
                            ...(r.code ? { code: r.code } : {}),
                        };
                }
            };
            await Promise.all(Array.from({ length: Math.min(this.rpcBatchConcurrency(), accepted) }, async () => worker()));
        }
        else {
            for (let index = 0; index < accepted; index += 1) {
                const call = msg.calls[index];
                if (call) {
                    results[index] = {
                        key: call.key,
                        ok: false,
                        error: "scripting bridge not attached",
                    };
                }
            }
        }
        for (let index = accepted; index < msg.calls.length; index += 1) {
            const call = msg.calls[index];
            if (call) {
                results[index] = {
                    key: call.key,
                    ok: false,
                    error: `RPC batch exceeds the ${this.maxRpcBatchCalls()}-call safety cap; split it into smaller batches.`,
                    code: "BATCH_LIMIT_EXCEEDED",
                };
            }
        }
        try {
            this.send(connection, { type: "rpc-batch-result", id: msg.id, results });
        }
        catch (error) {
            this.logger.warn({ err: toDomainError(error).toJSON(), clientId: connection.id, rpcId: msg.id }, "failed to send rpc-batch-result");
        }
    }
    sendRpcResult(connection, id, result) {
        try {
            this.send(connection, { type: "rpc-result", id, result });
        }
        catch (error) {
            this.logger.warn({ err: toDomainError(error).toJSON(), clientId: connection.id, rpcId: id }, "failed to send rpc-result");
        }
    }
    /**
     * Cross-game pub/sub fanout: deliver a `pubsub-message` to every connection
     * subscribed to `channel` except the sender itself. Best-effort per receiver
     * so one bad socket can't poison the rest.
     */
    routePubSub(senderId, channel, payload) {
        const subs = this.pubsubByChannel.get(channel);
        if (!subs)
            return;
        for (const targetId of subs) {
            if (targetId === senderId)
                continue;
            const target = this.connections.get(targetId);
            if (!target) {
                subs.delete(targetId);
                continue;
            }
            try {
                this.send(target, {
                    type: "pubsub-message",
                    frame: { channel, payload, fromClientId: senderId },
                });
            }
            catch (error) {
                this.logger.warn({ err: toDomainError(error).toJSON(), clientId: targetId, channel }, "failed to deliver pubsub-message");
            }
        }
        this.metrics.increment("bridge.pubsub.published", 1, { channel });
    }
    /** Record a batch of game-output lines streamed on the `output` event channel. */
    recordOutput(connection, data) {
        const sink = this.output;
        if (!sink || typeof data !== "object" || data === null)
            return;
        const entries = data.entries;
        if (!Array.isArray(entries))
            return;
        const now = this.clock.now();
        const droppedValue = data.dropped;
        const reportedDropped = typeof droppedValue === "number" && Number.isFinite(droppedValue)
            ? Math.max(0, Math.floor(droppedValue))
            : 0;
        const dropped = reportedDropped + Math.max(0, entries.length - 200);
        if (dropped > 0) {
            sink.record({
                clientId: connection.id,
                clientName: connection.client.username,
                kind: "system",
                message: `[connector] ${dropped} game-output line(s) were dropped by the bounded stream buffer.`,
                at: now,
                source: "game",
            });
            this.metrics.increment("bridge.output.dropped", dropped);
        }
        for (const raw of entries.slice(0, 200)) {
            if (typeof raw !== "object" || raw === null)
                continue;
            const e = raw;
            const message = typeof e.message === "string" ? e.message.slice(0, 8192) : "";
            const source = e.source === "script" ? "script" : "game";
            sink.record({
                clientId: connection.id,
                clientName: connection.client.username,
                kind: asOutputKind(e.kind),
                message,
                at: typeof e.at === "number" && e.at > 0 ? e.at : now,
                source,
                ...(source === "script" && typeof e.scriptToken === "string"
                    ? { scriptToken: e.scriptToken }
                    : {}),
            });
        }
    }
    /**
     * Remove a connection from the directory, reject every in-flight request with
     * {@link ClientDisconnectedError}, and close the socket. Idempotent.
     */
    dropConnection(connection, reason) {
        if (!this.connections.has(connection.id)) {
            // Already dropped; still ensure pending are cleared for safety.
            this.rejectAllEvalWork(connection, reason);
            return;
        }
        this.connections.delete(connection.id);
        // Drop any pub/sub subscriptions this client held so we don't route to a
        // dead socket on the next publish.
        for (const [channel, subs] of this.pubsubByChannel) {
            if (subs.delete(connection.id) && subs.size === 0) {
                this.pubsubByChannel.delete(channel);
            }
        }
        if (this.onClientChange)
            this.onClientChange("disconnect", connection.id);
        this.rejectAllEvalWork(connection, reason);
        connection.rpcQueue.length = 0;
        try {
            connection.socket.removeAllListeners();
            // Terminate rather than close(): we've already decided to drop this client,
            // and a graceful close handshake to a dead/unresponsive peer never completes,
            // leaving the underlying socket lingering (up to ws's 30s closeTimeout) and
            // blocking a clean server shutdown. An immediate teardown is what we want.
            connection.socket.terminate();
        }
        catch {
            // socket may already be closed; nothing actionable.
        }
        this.metrics.increment("bridge.clients.disconnected");
        this.metrics.gauge("bridge.clients", this.connections.size);
        this.updateLoadMetrics();
        this.logger.info({ clientId: connection.id, reason }, "connector disconnected");
    }
    rejectAllEvalWork(connection, reason) {
        const tickets = [...connection.pending.values(), ...connection.evalQueue];
        for (const ticket of tickets) {
            this.settleEval(connection, ticket, () => ticket.reject(new ClientDisconnectedError(`Client disconnected: ${reason}.`, {
                clientId: connection.id,
                requestId: ticket.id,
            })));
        }
    }
    // ── heartbeat ────────────────────────────────────────────────────────────────
    startHeartbeat() {
        const interval = this.config.bridge.heartbeatIntervalMs;
        this.heartbeat = setInterval(() => {
            for (const connection of [...this.connections.values()]) {
                // A connection with an in-flight eval is provably busy on our behalf — a
                // CPU-bound, non-yielding eval can block the connector's single Luau VM so
                // it cannot answer pings. Its own per-eval deadline is authoritative
                // (ExecutionTimeoutError), so treat it as alive rather than reaping it and
                // rejecting its work with a spurious ClientDisconnectedError.
                const busy = connection.pending.size > 0;
                if (busy) {
                    connection.missedPongs = 0;
                }
                else if (connection.missedPongs >= 2) {
                    this.dropConnection(connection, "missed two heartbeats");
                    continue;
                }
                else {
                    connection.missedPongs += 1;
                }
                try {
                    this.send(connection, { type: "ping", id: randomUUID() });
                }
                catch (error) {
                    // A saturated write buffer means the socket is OPEN but backpressured:
                    // the client is alive, just draining slowly. Skip this ping (undoing the
                    // strike, since a skipped ping yields no pong) instead of force-closing a
                    // healthy client. Only a genuinely failed/closed socket is a real drop.
                    if (error instanceof BridgeOverloadedError) {
                        connection.missedPongs = Math.max(0, connection.missedPongs - 1);
                        this.metrics.increment("bridge.heartbeat.skipped_saturated");
                    }
                    else {
                        this.logger.warn({ err: toDomainError(error).toJSON(), clientId: connection.id }, "heartbeat send failed");
                        this.dropConnection(connection, "heartbeat send failed");
                    }
                }
            }
        }, interval);
        this.heartbeat.unref?.();
    }
    // ── helpers ──────────────────────────────────────────────────────────────────
    send(connection, message) {
        if (connection.socket.readyState !== connection.socket.OPEN) {
            throw new ClientDisconnectedError("Connector socket is not open.", {
                clientId: connection.id,
            });
        }
        if (connection.socket.bufferedAmount > MAX_SOCKET_BUFFERED_BYTES) {
            throw new BridgeOverloadedError("Connector socket write buffer is saturated.", {
                clientId: connection.id,
                bufferedBytes: connection.socket.bufferedAmount,
                limitBytes: MAX_SOCKET_BUFFERED_BYTES,
            });
        }
        connection.socket.send(encodeServerMessage(message));
    }
    maxConcurrentEvals() {
        return this.config.bridge.maxConcurrentEvals ?? DEFAULT_MAX_CONCURRENT_EVALS;
    }
    maxQueuedEvals() {
        return this.config.bridge.maxQueuedEvals ?? DEFAULT_MAX_QUEUED_EVALS;
    }
    maxQueuedSourceBytes() {
        return this.config.bridge.maxQueuedSourceBytes ?? DEFAULT_MAX_QUEUED_SOURCE_BYTES;
    }
    rpcBatchConcurrency() {
        return this.config.bridge.rpcBatchConcurrency ?? DEFAULT_RPC_BATCH_CONCURRENCY;
    }
    maxRpcBatchCalls() {
        return this.config.bridge.maxRpcBatchCalls ?? DEFAULT_MAX_RPC_BATCH_CALLS;
    }
    maxConcurrentRpcFrames() {
        return this.config.bridge.maxConcurrentRpcFrames ?? DEFAULT_MAX_CONCURRENT_RPC_FRAMES;
    }
    maxQueuedRpcFrames() {
        return this.config.bridge.maxQueuedRpcFrames ?? DEFAULT_MAX_QUEUED_RPC_FRAMES;
    }
    overloadedError(connection, extra) {
        return new BridgeOverloadedError("The Roblox client queue is at its safety limit. Work was rejected before reaching the game.", {
            clientId: connection.id,
            activeEvals: connection.pending.size,
            queuedEvals: connection.evalQueue.length,
            queuedSourceBytes: connection.queuedSourceBytes,
            retryAfterMs: 250,
            recovery: "Wait for bridge-status to show a drained queue, lower parallel fan-out, then retry once with jitter.",
            ...extra,
        });
    }
    updateLoadMetrics() {
        let activeEvals = 0;
        let queuedEvals = 0;
        let queuedBytes = 0;
        let activeRpcFrames = 0;
        let queuedRpcFrames = 0;
        let saturatedClients = 0;
        for (const connection of this.connections.values()) {
            activeEvals += connection.pending.size;
            queuedEvals += connection.evalQueue.length;
            queuedBytes += connection.queuedSourceBytes;
            activeRpcFrames += connection.activeRpcFrames;
            queuedRpcFrames += connection.rpcQueue.length;
            if (connection.evalQueue.length > 0 &&
                (connection.pending.size >= this.maxConcurrentEvals() ||
                    connection.evalQueue.length >= this.maxQueuedEvals() * 0.8)) {
                saturatedClients += 1;
            }
        }
        this.metrics.gauge("bridge.eval.active", activeEvals);
        this.metrics.gauge("bridge.eval.queued", queuedEvals);
        this.metrics.gauge("bridge.eval.queued_bytes", queuedBytes);
        this.metrics.gauge("bridge.rpc.active", activeRpcFrames);
        this.metrics.gauge("bridge.rpc.queued", queuedRpcFrames);
        this.metrics.gauge("bridge.clients.saturated", saturatedClients);
    }
    abortError(signal) {
        const reason = signal.reason;
        if (reason instanceof Error) {
            return new ExecutionTimeoutError("Eval aborted by caller.", undefined, { cause: reason });
        }
        return new ExecutionTimeoutError("Eval aborted by caller.");
    }
}
//# sourceMappingURL=bridge-server.js.map