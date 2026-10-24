/**
 * Run one Luau program across multiple connected clients in parallel and
 * aggregate per-client results. Each client gets its own scriptToken (and
 * therefore its own RPC budget), and the same `mcp` table is bound inside —
 * so a fanout body can still call `mcp.*` and `mcp.all()`.
 *
 * The active session's client selection is ignored — explicit targeting only.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    clients: string[] | "all";
    source: string;
    persistent?: boolean | undefined;
    timeoutMs?: number | undefined;
    rpcBudget?: number | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=script-fanout.d.ts.map