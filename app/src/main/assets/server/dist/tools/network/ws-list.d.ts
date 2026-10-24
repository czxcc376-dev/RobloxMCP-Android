/**
 * Enumerate the WebSocket registry built by ws-connect. Reports every parked entry
 * in getgenv().__mcp_ws as { id, url, open, messageCount } so callers can see which
 * sockets are live and how many inbound frames are buffered on each. Read-only.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=ws-list.d.ts.map