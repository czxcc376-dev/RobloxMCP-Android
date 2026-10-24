/**
 * Capture outgoing RakNet packets via raknet.add_send_hook. The RakNet library
 * only exposes a SEND hook (outgoing traffic), so this logs what the client emits:
 * size, priority, reliability, ordering channel, and a hex preview of the payload.
 * Stateful start/fetch/stop, keyed in getgenv so it survives across tool calls.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "stop" | "start" | "fetch";
    limit: number;
    previewBytes: number;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=packet-spy.d.ts.map