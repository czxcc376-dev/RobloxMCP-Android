import { Hono } from "hono";
import type { RobloxClient } from "../../domain/client/client.js";
import { ClientId } from "../../domain/shared/ids.js";
import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import type { ClientAdmin } from "../../application/ports/client-admin.js";
import type { BridgeLoadSnapshot, ClientDirectory } from "../../application/ports/client-directory.js";
import type { Clock } from "../../application/ports/clock.js";
import type { AppConfig } from "../../application/ports/config.js";
import type { EvalRequest, ExecutionGateway } from "../../application/ports/execution-gateway.js";
import type { Logger } from "../../application/ports/logger.js";
import type { Metrics } from "../../application/ports/metrics.js";
import type { OutputLog } from "../../application/ports/output-log.js";
import type { ScriptBridge } from "../../application/services/script-bridge.js";
interface BridgeDeps {
    readonly config: AppConfig;
    readonly logger: Logger;
    readonly clock: Clock;
    readonly metrics: Metrics;
    /** Optional sink for game output streamed over the `event` channel. */
    readonly output?: OutputLog;
}
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
export declare class BridgeServer implements ExecutionGateway, ClientDirectory, ClientAdmin {
    readonly http: Hono;
    private readonly config;
    private readonly logger;
    private readonly clock;
    private readonly metrics;
    private readonly output?;
    private scriptBridge;
    /** Optional sink for client connect/disconnect events (used by the dashboard WS). */
    private onClientChange;
    /** Channel name -> set of subscribed clientIds for cross-game pub/sub. */
    private readonly pubsubByChannel;
    /** Subscribe to client connect/disconnect events. Pass null to unsubscribe. */
    setOnClientChange(fn: ((action: "connect" | "disconnect", id: string) => void) | null): void;
    private readonly connections;
    private readonly wss;
    private httpServer;
    private heartbeat;
    private started;
    private totalRejectedEvals;
    /** Extra WebSocket paths the composition root has registered (e.g. /ws/dashboard). */
    private readonly extraUpgrades;
    constructor(deps: BridgeDeps);
    /**
     * Let the composition root register additional routes before `start()`.
     * Returns `this.http` so callers can also chain on it directly.
     */
    addRoutes(fn: (app: Hono) => void): Hono;
    start(): Promise<void>;
    stop(): Promise<void>;
    list(): readonly RobloxClient[];
    get(clientId: ClientId): RobloxClient | undefined;
    loadSnapshot(): BridgeLoadSnapshot;
    /**
     * Register an additional WebSocket upgrade handler at a specific path on the
     * same HTTP server. Used by the dashboard to mount `/ws/dashboard` for live
     * push without spinning up a second port.
     */
    addUpgrade(path: string, handler: (request: IncomingMessage, socket: Duplex, head: Buffer) => void): void;
    /** Wire the bridge's RPC routing after construction (breaks the dep cycle). */
    attachScripting(scriptBridge: ScriptBridge): void;
    disconnect(clientId: ClientId, reason?: string): boolean;
    eval(clientId: ClientId, request: EvalRequest, signal?: AbortSignal): Promise<unknown>;
    /** Dispatch as much queued work as the game-safe lanes permit. */
    private pumpEvalQueue;
    /** Nested work wins; a script parent runs alone while retaining one reserved nested lane. */
    private nextEvalIndex;
    private settleEval;
    private onConnection;
    private registerConnection;
    private handleMessage;
    /**
     * In-game `mcp.<tool>(args)` calls arrive as `rpc-call` frames over this same
     * socket. Route them through the {@link ScriptBridge} (token-gated) and reply
     * with `rpc-result`. Errors are reported back, not thrown, so a flaky tool
     * never breaks the connection.
     */
    private enqueueRpcFrame;
    private pumpRpcFrames;
    private handleRpcCall;
    /**
     * Parallel sibling of `handleRpcCall`. A script's `mcp.all({...})` arrives as
     * one `rpc-batch` frame; we run entries through a bounded worker pool
     * (each entry counts against the per-script budget) and reply with a single
     * `rpc-batch-result`. One frame in, one frame out — no per-call latency stacking.
     */
    private handleRpcBatch;
    private sendRpcResult;
    /**
     * Cross-game pub/sub fanout: deliver a `pubsub-message` to every connection
     * subscribed to `channel` except the sender itself. Best-effort per receiver
     * so one bad socket can't poison the rest.
     */
    private routePubSub;
    /** Record a batch of game-output lines streamed on the `output` event channel. */
    private recordOutput;
    /**
     * Remove a connection from the directory, reject every in-flight request with
     * {@link ClientDisconnectedError}, and close the socket. Idempotent.
     */
    private dropConnection;
    private rejectAllEvalWork;
    private startHeartbeat;
    private send;
    private maxConcurrentEvals;
    private maxQueuedEvals;
    private maxQueuedSourceBytes;
    private rpcBatchConcurrency;
    private maxRpcBatchCalls;
    private maxConcurrentRpcFrames;
    private maxQueuedRpcFrames;
    private overloadedError;
    private updateLoadMetrics;
    private abortError;
}
export {};
//# sourceMappingURL=bridge-server.d.ts.map