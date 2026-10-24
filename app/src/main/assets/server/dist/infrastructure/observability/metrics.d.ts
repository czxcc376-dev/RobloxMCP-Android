import type { Metrics } from "../../application/ports/metrics.js";
/** A single observed distribution's running aggregate. */
export interface ObservationSummary {
    readonly count: number;
    readonly sum: number;
    readonly min: number;
    readonly max: number;
}
/** Point-in-time view of all collected metrics, suitable for /health. */
export interface MetricsSnapshot {
    readonly counters: Readonly<Record<string, number>>;
    readonly gauges: Readonly<Record<string, number>>;
    readonly observations: Readonly<Record<string, ObservationSummary>>;
}
/**
 * Dependency-free, process-local {@link Metrics} implementation. Aggregates
 * counters, gauges and observation distributions in plain Maps. Intended for the
 * dashboard / `/health` endpoint, not for high-cardinality production export.
 */
export declare class InMemoryMetrics implements Metrics {
    private readonly counters;
    private readonly gauges;
    private readonly observations;
    increment(name: string, value?: number, tags?: Readonly<Record<string, string>>): void;
    observe(name: string, value: number, tags?: Readonly<Record<string, string>>): void;
    gauge(name: string, value: number, tags?: Readonly<Record<string, string>>): void;
    /** Materialize a plain-object snapshot of every metric for reporting. */
    snapshot(): MetricsSnapshot;
}
/** Construct the default in-memory {@link Metrics} adapter. */
export declare function createMetrics(): Metrics;
//# sourceMappingURL=metrics.d.ts.map