import type { Brand } from "./brand.js";
/** A connected executor connection. Stable for modern connector reconnects. */
export type ClientId = Brand<string, "ClientId">;
/** One AI conversation/session driving the bridge. */
export type SessionId = Brand<string, "SessionId">;
/** A Roblox account id — stable across reconnects, used for sticky selection. */
export type UserId = Brand<number, "UserId">;
/** Correlates a bridge request with its response. */
export type RequestId = Brand<string, "RequestId">;
export declare const ClientId: (value: string) => ClientId;
export declare const SessionId: (value: string) => SessionId;
export declare const UserId: (value: number) => UserId;
export declare const RequestId: (value: string) => RequestId;
//# sourceMappingURL=ids.d.ts.map