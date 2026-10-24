import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpSessionIdentity } from "./mcp-adapter.js";
export interface McpHttpEndpointDeps {
    readonly createServer: (identity: McpSessionIdentity) => McpServer;
    readonly sessionLabelPrefix?: string;
    readonly maxSessions?: number;
    readonly idleTtlMs?: number;
}
/**
 * Stateful MCP-over-HTTP endpoint used by the launcher when another stdio
 * server already owns the configured bridge port. Each HTTP client gets its
 * own MCP server/transport session, while all sessions share the same Roblox
 * bridge and tool implementation.
 */
export declare class McpHttpEndpoint {
    private readonly deps;
    private readonly sessions;
    private initializing;
    constructor(deps: McpHttpEndpointDeps);
    handle(request: Request): Promise<Response>;
    close(): Promise<void>;
    private maxSessions;
    private idleTtlMs;
    private sweepIdleSessions;
}
//# sourceMappingURL=mcp-http-endpoint.d.ts.map