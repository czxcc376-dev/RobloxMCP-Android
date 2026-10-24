/**
 * Open a real WebSocket from inside the game client via the sUNC `WebSocket.connect`
 * API. The live socket can't cross the bridge, so it is parked in a getgenv registry
 * (`getgenv().__mcp_ws`) keyed by an integer id; ws-send / ws-receive / ws-close /
 * ws-list operate on that id across later tool calls. On connect we wire ws.OnMessage
 * into a capped (200) ring buffer and ws.OnClose into an `open=false` flag, so received
 * frames accumulate server-side until fetched.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    url: string;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=ws-connect.d.ts.map