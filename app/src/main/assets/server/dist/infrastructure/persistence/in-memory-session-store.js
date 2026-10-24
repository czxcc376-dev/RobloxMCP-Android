import { createSession } from "../../domain/client/session.js";
/**
 * Process-scoped {@link SessionStore}. Selection state lives only as long as the
 * server process; restarting the server forgets every session's selection. A
 * durable store can replace this without touching the application layer.
 */
export class InMemorySessionStore {
    sessions = new Map();
    get(sessionId) {
        return this.sessions.get(sessionId);
    }
    getOrCreate(sessionId, label) {
        const existing = this.sessions.get(sessionId);
        if (existing)
            return existing;
        const session = createSession(sessionId, label);
        this.sessions.set(sessionId, session);
        return session;
    }
    save(session) {
        this.sessions.set(session.id, session);
    }
    list() {
        return [...this.sessions.values()];
    }
}
//# sourceMappingURL=in-memory-session-store.js.map