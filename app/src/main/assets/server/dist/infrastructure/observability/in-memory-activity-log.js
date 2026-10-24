/**
 * Bounded in-memory activity feed: a ring buffer of the most recent records plus
 * lifetime counters. Cheap and allocation-stable; the dashboard polls `recent`.
 */
export class InMemoryActivityLog {
    capacity;
    buffer = [];
    total = 0;
    errors = 0;
    /** Per-tool lifetime counters (runs, errors). Unbounded by ring capacity. */
    perTool = new Map();
    /** Optional sink called after every record (used by the live dashboard WS). */
    onRecord = null;
    constructor(capacity = 250) {
        this.capacity = capacity;
    }
    /** Subscribe to records as they happen. Pass null to unsubscribe. */
    setOnRecord(fn) {
        this.onRecord = fn;
    }
    record(record) {
        this.total += 1;
        if (record.outcome === "error")
            this.errors += 1;
        this.buffer.push(record);
        if (this.buffer.length > this.capacity)
            this.buffer.shift();
        const stats = this.perTool.get(record.toolName) ?? { runs: 0, errors: 0 };
        stats.runs += 1;
        if (record.outcome === "error")
            stats.errors += 1;
        this.perTool.set(record.toolName, stats);
        if (this.onRecord)
            this.onRecord(record);
    }
    recent(limit) {
        const n = Math.max(0, Math.min(limit, this.buffer.length));
        return this.buffer.slice(this.buffer.length - n).reverse();
    }
    summary() {
        return { total: this.total, errors: this.errors };
    }
    perToolStats() {
        const out = [];
        for (const [tool, s] of this.perTool)
            out.push({ tool, runs: s.runs, errors: s.errors });
        return out;
    }
}
//# sourceMappingURL=in-memory-activity-log.js.map