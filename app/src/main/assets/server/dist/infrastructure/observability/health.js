/**
 * Produces liveness/readiness snapshots for the dashboard and `/health`. Captures
 * the process start time from the injected {@link Clock} at construction so uptime
 * is measured against the same time source used everywhere else.
 */
export class HealthReporter {
    clock;
    clients;
    version;
    startedAt;
    constructor(deps) {
        this.clock = deps.clock;
        this.clients = deps.clients;
        this.version = deps.version;
        this.startedAt = deps.clock.now();
    }
    report() {
        const bridgeLoad = this.clients.loadSnapshot?.();
        return {
            service: "executor-mcp-roblox",
            status: "ok",
            uptimeMs: this.clock.now() - this.startedAt,
            startedAt: this.startedAt,
            connectedClients: this.clients.list().length,
            version: this.version,
            ...(bridgeLoad
                ? {
                    bridgeLoad: {
                        activeEvals: bridgeLoad.activeEvals,
                        queuedEvals: bridgeLoad.queuedEvals,
                        queuedSourceBytes: bridgeLoad.queuedSourceBytes,
                        activeRpcFrames: bridgeLoad.activeRpcFrames,
                        queuedRpcFrames: bridgeLoad.queuedRpcFrames,
                        rejectedEvals: bridgeLoad.rejectedEvals,
                        saturatedClients: bridgeLoad.saturatedClients,
                    },
                }
                : {}),
        };
    }
}
//# sourceMappingURL=health.js.map