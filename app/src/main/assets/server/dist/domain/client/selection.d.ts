import type { ClientId, UserId } from "../shared/ids.js";
import { type RobloxClient } from "./client.js";
/**
 * What a session has chosen to target. All fields optional: a session may pin an
 * exact connection (`clientId`), an account (`userId`/`username`, sticky across
 * reconnects), or nothing at all (let the resolver decide when unambiguous).
 */
export interface ClientSelection {
    readonly clientId?: ClientId;
    readonly userId?: UserId;
    readonly username?: string;
}
export type SelectionResolution = {
    readonly status: "resolved";
    readonly client: RobloxClient;
}
/** Nothing connected, or the pinned account/connection is gone. */
 | {
    readonly status: "none";
    readonly reason: "no-clients" | "selection-offline";
}
/** Multiple distinct accounts connected and the session has not chosen one. */
 | {
    readonly status: "ambiguous";
    readonly candidates: readonly RobloxClient[];
};
/**
 * Pure resolution of a session's selection against the live client set. This is
 * the heart of multi-session isolation, kept side-effect-free so it is trivially
 * testable.
 *
 * Order of preference:
 *   1. Exact `clientId`, if still connected.
 *   2. Account match (`userId`/`username`) — sticky across reconnects (new clientId).
 *   3. No selection + exactly one connected account -> that client (convenience).
 *   4. No selection + multiple distinct accounts -> ambiguous.
 *   5. Nothing connected -> none.
 */
export declare function resolveSelection(selection: ClientSelection, clients: readonly RobloxClient[]): SelectionResolution;
//# sourceMappingURL=selection.d.ts.map