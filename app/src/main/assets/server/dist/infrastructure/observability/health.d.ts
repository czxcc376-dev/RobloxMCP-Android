import type { Clock } from "../../application/ports/clock.js";
import type { ClientDirectory } from "../../application/ports/client-directory.js";
import type { BridgeLoadSnapshot } from "../../application/ports/client-directory.js";
/** The payload returned by the `/health` endpoint. */
export interface HealthReport {
    readonly service: "executor-mcp-roblox";
    readonly status: "ok";
    readonly uptimeMs: number;
    readonly startedAt: number;
    readonly connectedClients: number;
    readonly version: string;
    readonly bridgeLoad?: Omit<BridgeLoadSnapshot, "clients">;
}
export interface HealthReporterDeps {
    readonly clock: Clock;
    readonly clients: ClientDirectory;
    readonly version: string;
}
/**
 * Produces liveness/readiness snapshots for the dashboard and `/health`. Captures
 * the process start time from the injected {@link Clock} at construction so uptime
 * is measured against the same time source used everywhere else.
 */
export declare class HealthReporter {
    private readonly clock;
    private readonly clients;
    private readonly version;
    private readonly startedAt;
    constructor(deps: HealthReporterDeps);
    report(): HealthReport;
}
//# sourceMappingURL=health.d.ts.map