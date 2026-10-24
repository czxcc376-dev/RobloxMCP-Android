/**
 * The bridge wire protocol (server <-> in-game connector). This is a clean-slate
 * redesign: a small, explicit, versioned, JSON message envelope. Both sides speak
 * these exact shapes; the connector serializes results as JSON (no bespoke Lua
 * encoding), which keeps the contract symmetric and debuggable.
 *
 * These are pure data shapes. Runtime validation (zod) lives in the transport
 * adapter so the domain stays dependency-free.
 */
/** Bump on any breaking change to the envelope. The connector sends its version in `hello`. */
export const PROTOCOL_VERSION = 1;
//# sourceMappingURL=messages.js.map