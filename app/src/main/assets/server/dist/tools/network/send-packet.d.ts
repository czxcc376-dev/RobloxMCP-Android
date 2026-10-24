/**
 * Send a custom outgoing RakNet packet (raknet.send). The payload is given as a
 * hex string and converted to a byte array in-client. Priority / reliability /
 * ordering channel map directly to RakNet's send parameters.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    dataHex: string;
    priority: number;
    reliability: number;
    orderingChannel: number;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=send-packet.d.ts.map