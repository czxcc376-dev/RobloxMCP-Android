/**
 * Block outgoing RakNet packets that match criteria, via a send hook that calls
 * RakNetPacket:Block(). Match by minimum size and/or a hex substring in the
 * payload. Stateful start/stop.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "stop" | "start";
    minSize?: number | undefined;
    containsHex?: string | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=block-packets.d.ts.map