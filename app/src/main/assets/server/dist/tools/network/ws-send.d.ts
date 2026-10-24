/**
 * Send a text frame over a WebSocket opened by ws-connect, addressed by its registry
 * id (`getgenv().__mcp_ws[id]`). Guards that the entry exists and is still open before
 * calling socket:Send(message).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    id: number;
    message: string;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=ws-send.d.ts.map