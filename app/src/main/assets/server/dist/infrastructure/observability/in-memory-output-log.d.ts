import type { OutputEntry, OutputLog } from "../../application/ports/output-log.js";
/**
 * Fixed-capacity ring buffer of recent game output across all clients. Old lines
 * are overwritten once the buffer is full, so memory is bounded no matter how
 * chatty a game is. `recent()` returns newest-first.
 */
export declare class InMemoryOutputLog implements OutputLog {
    private readonly buffer;
    private readonly capacity;
    private head;
    private size;
    /** Optional sink called after every record (used by the live dashboard WS). */
    private onRecord;
    constructor(capacity?: number);
    /** Subscribe to records as they happen. Pass null to unsubscribe. */
    setOnRecord(fn: ((entry: OutputEntry) => void) | null): void;
    record(entry: OutputEntry): void;
    recent(limit: number, clientId?: string): readonly OutputEntry[];
    clear(clientId?: string): void;
}
//# sourceMappingURL=in-memory-output-log.d.ts.map