function keyOf(name, tags) {
    if (!tags)
        return name;
    const entries = Object.keys(tags)
        .sort()
        .map((k) => `${k}=${tags[k] ?? ""}`);
    if (entries.length === 0)
        return name;
    return `${name}{${entries.join(",")}}`;
}
/**
 * Dependency-free, process-local {@link Metrics} implementation. Aggregates
 * counters, gauges and observation distributions in plain Maps. Intended for the
 * dashboard / `/health` endpoint, not for high-cardinality production export.
 */
export class InMemoryMetrics {
    counters = new Map();
    gauges = new Map();
    observations = new Map();
    increment(name, value = 1, tags) {
        const key = keyOf(name, tags);
        this.counters.set(key, (this.counters.get(key) ?? 0) + value);
    }
    observe(name, value, tags) {
        const key = keyOf(name, tags);
        const existing = this.observations.get(key);
        if (existing) {
            existing.count += 1;
            existing.sum += value;
            existing.min = Math.min(existing.min, value);
            existing.max = Math.max(existing.max, value);
        }
        else {
            this.observations.set(key, { count: 1, sum: value, min: value, max: value });
        }
    }
    gauge(name, value, tags) {
        this.gauges.set(keyOf(name, tags), value);
    }
    /** Materialize a plain-object snapshot of every metric for reporting. */
    snapshot() {
        const counters = {};
        for (const [key, value] of this.counters)
            counters[key] = value;
        const gauges = {};
        for (const [key, value] of this.gauges)
            gauges[key] = value;
        const observations = {};
        for (const [key, agg] of this.observations) {
            observations[key] = {
                count: agg.count,
                sum: agg.sum,
                min: agg.min,
                max: agg.max,
            };
        }
        return { counters, gauges, observations };
    }
}
/** Construct the default in-memory {@link Metrics} adapter. */
export function createMetrics() {
    return new InMemoryMetrics();
}
//# sourceMappingURL=metrics.js.map