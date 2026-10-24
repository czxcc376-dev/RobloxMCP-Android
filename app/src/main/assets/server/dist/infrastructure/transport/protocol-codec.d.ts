import type { ClientMessage, ServerMessage } from "../../domain/protocol/messages.js";
/**
 * Parse a raw socket frame into a typed {@link ClientMessage}. Throws a
 * {@link ProtocolError} on invalid JSON, a non-object root, an unknown `type`,
 * or any field that fails the schema.
 */
export declare function decodeClientMessage(raw: string): ClientMessage;
/** Serialize a {@link ServerMessage} for the wire. */
export declare function encodeServerMessage(msg: ServerMessage): string;
//# sourceMappingURL=protocol-codec.d.ts.map