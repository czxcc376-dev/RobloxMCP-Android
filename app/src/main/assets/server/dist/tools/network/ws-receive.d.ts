/**
 * Drain the inbound-frame ring buffer for a WebSocket opened by ws-connect. The
 * OnMessage handler installed by ws-connect appends { text, t } records into
 * getgenv().__mcp_ws[id].messages; this returns them newest-first, capped at `limit`,
 * and optionally clears the ring afterwards. Read-only with respect to game state
 * (it only reads, or empties, the server-side buffer).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    id: number;
    limit: number;
    clear: boolean;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=ws-receive.d.ts.map