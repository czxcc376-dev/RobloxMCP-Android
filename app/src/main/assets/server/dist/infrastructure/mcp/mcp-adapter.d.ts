import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ActivityLog } from "../../application/ports/activity-log.js";
import type { AppConfig } from "../../application/ports/config.js";
import type { Logger } from "../../application/ports/logger.js";
import type { ToolInvoker } from "../../application/services/tool-invoker.js";
import type { ToolRegistry } from "../../application/tool/registry.js";
import type { SessionId } from "../../domain/shared/ids.js";
export interface McpAdapterDeps {
    readonly registry: ToolRegistry;
    readonly invoker: ToolInvoker;
    readonly config: AppConfig;
    readonly logger: Logger;
    readonly activity: ActivityLog;
}
export interface McpSessionIdentity {
    readonly id: SessionId;
    readonly label: string;
}
/**
 * Exposes the {@link ToolRegistry} over the Model Context Protocol stdio
 * transport. This is the only place that knows about the MCP SDK: it translates
 * each registered {@link Tool} into an SDK tool registration, routes every call
 * through the {@link ToolInvoker}, and maps domain results/errors onto MCP
 * content. Nothing below the interface layer touches the SDK.
 */
export declare class McpAdapter {
    private readonly deps;
    private stdioServer?;
    constructor(deps: McpAdapterDeps);
    /** Build the MCP server and register every catalog tool plus `list-tools`. */
    buildServer(identity?: McpSessionIdentity): McpServer;
    /** Connect the built server over the stdio transport. */
    connectStdio(): Promise<void>;
    /**
     * Server-level guidance returned at initialize. It tells the model the real
     * breadth of the toolset (so it doesn't default to a handful of tools) and
     * points it at `list-tools` for discovery and `script` for orchestration.
     */
    private buildInstructions;
    private registerTool;
    /**
     * The built-in discovery tool. It lives here (not in src/tools) because it
     * needs read access to the {@link ToolRegistry}, which tools are deliberately
     * never given. With no args it returns category counts + total; with
     * `{ category }` it lists that category's tools; with `{ search }` it
     * keyword-matches across name/title/description.
     */
    private registerListTools;
    private runListTools;
    /**
     * `suggest-tools` ranks tools matching a keyword by past success — a tiny
     * lifetime co-occurrence score that nudges the AI toward known-good chains
     * without an embedding pipeline. Tools the server has never run yet still
     * appear (no history => no penalty) but are ranked below proven ones.
     */
    private registerSuggestTools;
    private runSuggestTools;
}
//# sourceMappingURL=mcp-adapter.d.ts.map