import type { ActivityLog, ActivityRecord, ActivitySummary, ToolStats } from "../../application/ports/activity-log.js";
/**
 * Bounded in-memory activity feed: a ring buffer of the most recent records plus
 * lifetime counters. Cheap and allocation-stable; the dashboard polls `recent`.
 */
export declare class InMemoryActivityLog implements ActivityLog {
    private readonly capacity;
    private readonly buffer;
    private total;
    private errors;
    /** Per-tool lifetime counters (runs, errors). Unbounded by ring capacity. */
    private readonly perTool;
    /** Optional sink called after every record (used by the live dashboard WS). */
    private onRecord;
    constructor(capacity?: number);
    /** Subscribe to records as they happen. Pass null to unsubscribe. */
    setOnRecord(fn: ((record: ActivityRecord) => void) | null): void;
    record(record: ActivityRecord): void;
    recent(limit: number): readonly ActivityRecord[];
    summary(): ActivitySummary;
    perToolStats(): readonly ToolStats[];
}
//# sourceMappingURL=in-memory-activity-log.d.ts.map