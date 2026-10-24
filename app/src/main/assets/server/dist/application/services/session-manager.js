import { resolveSelection, } from "../../domain/client/selection.js";
import { clearSelection, withSelection } from "../../domain/client/session.js";
import { AmbiguousClientError, NoClientSelectedError } from "../../domain/errors/errors.js";
/**
 * Owns per-session selection and turns it into a concrete target client. This is
 * where multi-session isolation is enforced: every resolution is scoped to one
 * session id and goes through the pure {@link resolveSelection} domain rule.
 */
export class SessionManager {
    store;
    clients;
    constructor(store, clients) {
        this.store = store;
        this.clients = clients;
    }
    getOrCreate(sessionId, label) {
        return this.store.getOrCreate(sessionId, label);
    }
    select(sessionId, label, selection) {
        const updated = withSelection(this.store.getOrCreate(sessionId, label), selection);
        this.store.save(updated);
        return updated;
    }
    clear(sessionId, label) {
        const updated = clearSelection(this.store.getOrCreate(sessionId, label));
        this.store.save(updated);
        return updated;
    }
    resolve(sessionId, label) {
        const session = this.store.getOrCreate(sessionId, label);
        return resolveSelection(session.selection, this.clients.list());
    }
    /**
     * Resolve to a concrete client or throw the precise domain error. Client-bound
     * tools call this before running, so an ambiguous/empty state is reported
     * clearly instead of silently guessing.
     */
    requireActiveClient(sessionId, label) {
        const resolution = this.resolve(sessionId, label);
        switch (resolution.status) {
            case "resolved":
                return resolution.client;
            case "ambiguous":
                throw new AmbiguousClientError("Multiple accounts are connected — choose one with select-client (by username or clientId).", {
                    candidates: resolution.candidates.map((c) => ({
                        clientId: c.id,
                        username: c.username,
                    })),
                });
            case "none":
                throw new NoClientSelectedError(resolution.reason === "no-clients"
                    ? "No Roblox client is connected. Run the loader in your executor first."
                    : "Your selected client is not connected. Re-run the loader or pick another with select-client.", { reason: resolution.reason });
        }
    }
    /** Build the {@link SessionContext} a tool sees for one invocation. */
    createContext(sessionId, label) {
        const session = this.store.getOrCreate(sessionId, label);
        return {
            id: sessionId,
            label,
            selection: session.selection,
            select: (selection) => void this.select(sessionId, label, selection),
            clear: () => void this.clear(sessionId, label),
            resolve: () => this.resolve(sessionId, label),
        };
    }
}
//# sourceMappingURL=session-manager.js.map