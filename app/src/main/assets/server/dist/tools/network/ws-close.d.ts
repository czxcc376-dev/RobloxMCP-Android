/**
 * Close a WebSocket opened by ws-connect and drop its registry slot. Calls
 * socket:Close() (guarded), flips the entry's open flag to false, and removes
 * getgenv().__mcp_ws[id] so the id is no longer listed.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    id: number;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=ws-close.d.ts.map