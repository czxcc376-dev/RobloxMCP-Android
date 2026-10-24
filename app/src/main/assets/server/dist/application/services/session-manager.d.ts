import type { RobloxClient } from "../../domain/client/client.js";
import { type ClientSelection, type SelectionResolution } from "../../domain/client/selection.js";
import { type Session } from "../../domain/client/session.js";
import type { SessionId } from "../../domain/shared/ids.js";
import type { ClientDirectory } from "../ports/client-directory.js";
import type { SessionStore } from "../ports/session-store.js";
import type { SessionContext } from "../tool/tool.js";
/**
 * Owns per-session selection and turns it into a concrete target client. This is
 * where multi-session isolation is enforced: every resolution is scoped to one
 * session id and goes through the pure {@link resolveSelection} domain rule.
 */
export declare class SessionManager {
    private readonly store;
    private readonly clients;
    constructor(store: SessionStore, clients: ClientDirectory);
    getOrCreate(sessionId: SessionId, label: string): Session;
    select(sessionId: SessionId, label: string, selection: ClientSelection): Session;
    clear(sessionId: SessionId, label: string): Session;
    resolve(sessionId: SessionId, label: string): SelectionResolution;
    /**
     * Resolve to a concrete client or throw the precise domain error. Client-bound
     * tools call this before running, so an ambiguous/empty state is reported
     * clearly instead of silently guessing.
     */
    requireActiveClient(sessionId: SessionId, label: string): RobloxClient;
    /** Build the {@link SessionContext} a tool sees for one invocation. */
    createContext(sessionId: SessionId, label: string): SessionContext;
}
//# sourceMappingURL=session-manager.d.ts.map