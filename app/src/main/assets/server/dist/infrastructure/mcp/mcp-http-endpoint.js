import { randomUUID } from "node:crypto";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { SessionId } from "../../domain/shared/ids.js";
const DEFAULT_MAX_SESSIONS = 256;
const DEFAULT_IDLE_TTL_MS = 30 * 60 * 1000;
/**
 * Stateful MCP-over-HTTP endpoint used by the launcher when another stdio
 * server already owns the configured bridge port. Each HTTP client gets its
 * own MCP server/transport session, while all sessions share the same Roblox
 * bridge and tool implementation.
 */
export class McpHttpEndpoint {
    deps;
    sessions = new Map();
    initializing = 0;
    constructor(deps) {
        this.deps = deps;
    }
    async handle(request) {
        const sessionId = request.headers.get("mcp-session-id");
        if (sessionId) {
            const session = this.sessions.get(sessionId);
            if (!session) {
                void this.sweepIdleSessions();
                return new Response(JSON.stringify({ error: "Unknown MCP session." }), {
                    status: 404,
                    headers: { "content-type": "application/json" },
                });
            }
            // Refresh BEFORE sweeping so an active request can never evict its own
            // session (which used to 404 and tear down the whole proxy). Sweep others
            // opportunistically in the background, excluding this session.
            session.lastUsedAt = Date.now();
            void this.sweepIdleSessions(sessionId);
            return session.transport.handleRequest(request);
        }
        // No session id: this is an initialization POST (or an invalid session-less
        // request). Sweep idle sessions to reclaim capacity before creating a new one.
        await this.sweepIdleSessions();
        // Only an initialization POST may create a new stateful session. Let the
        // SDK produce the standards-compliant error for a session-less GET/DELETE.
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "MCP session is required." }), {
                status: 400,
                headers: { "content-type": "application/json" },
            });
        }
        if (this.sessions.size + this.initializing >= this.maxSessions()) {
            return new Response(JSON.stringify({
                error: "MCP agent session capacity reached.",
                retryable: true,
                activeSessions: this.sessions.size,
                limit: this.maxSessions(),
            }), {
                status: 503,
                headers: { "content-type": "application/json", "retry-after": "1" },
            });
        }
        const sessionRef = {};
        const logicalId = SessionId(randomUUID());
        const identity = {
            id: logicalId,
            label: `${this.deps.sessionLabelPrefix ?? "agent"}-${logicalId.replace(/-/g, "").slice(0, 8)}`,
        };
        const transport = new WebStandardStreamableHTTPServerTransport({
            sessionIdGenerator: randomUUID,
            enableJsonResponse: true,
            onsessioninitialized: (id) => {
                if (sessionRef.current)
                    this.sessions.set(id, sessionRef.current);
            },
            onsessionclosed: (id) => {
                const existing = this.sessions.get(id);
                this.sessions.delete(id);
                if (existing)
                    void existing.server.close().catch(() => undefined);
            },
        });
        const server = this.deps.createServer(identity);
        sessionRef.current = { server, transport, identity, lastUsedAt: Date.now() };
        this.initializing += 1;
        try {
            await server.connect(transport);
            return await transport.handleRequest(request);
        }
        catch (error) {
            await transport.close().catch(() => undefined);
            await server.close().catch(() => undefined);
            throw error;
        }
        finally {
            this.initializing = Math.max(0, this.initializing - 1);
        }
    }
    async close() {
        const sessions = [...this.sessions.values()];
        this.sessions.clear();
        await Promise.all(sessions.map(async ({ server, transport }) => {
            await transport.close().catch(() => undefined);
            await server.close().catch(() => undefined);
        }));
    }
    maxSessions() {
        return Math.max(1, this.deps.maxSessions ?? DEFAULT_MAX_SESSIONS);
    }
    idleTtlMs() {
        return Math.max(60_000, this.deps.idleTtlMs ?? DEFAULT_IDLE_TTL_MS);
    }
    async sweepIdleSessions(exceptId) {
        const cutoff = Date.now() - this.idleTtlMs();
        const expired = [];
        for (const [id, session] of this.sessions) {
            if (id === exceptId)
                continue;
            if (session.lastUsedAt >= cutoff)
                continue;
            this.sessions.delete(id);
            expired.push(session);
        }
        await Promise.all(expired.map(async ({ server, transport }) => {
            await transport.close().catch(() => undefined);
            await server.close().catch(() => undefined);
        }));
    }
}
//# sourceMappingURL=mcp-http-endpoint.js.map