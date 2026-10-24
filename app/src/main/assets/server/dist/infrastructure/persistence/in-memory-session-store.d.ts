import type { Session } from "../../domain/client/session.js";
import type { SessionId } from "../../domain/shared/ids.js";
import type { SessionStore } from "../../application/ports/session-store.js";
/**
 * Process-scoped {@link SessionStore}. Selection state lives only as long as the
 * server process; restarting the server forgets every session's selection. A
 * durable store can replace this without touching the application layer.
 */
export declare class InMemorySessionStore implements SessionStore {
    private readonly sessions;
    get(sessionId: SessionId): Session | undefined;
    getOrCreate(sessionId: SessionId, label: string): Session;
    save(session: Session): void;
    list(): readonly Session[];
}
//# sourceMappingURL=in-memory-session-store.d.ts.map