export function buildDashboardState(deps) {
    const health = deps.health.report();
    const summary = deps.activity.summary();
    return {
        server: {
            version: health.version,
            label: deps.config.session.label,
            host: deps.config.server.host,
            port: deps.config.server.port,
            uptimeMs: health.uptimeMs,
            startedAt: health.startedAt,
        },
        clients: deps.clients.list().map((c) => ({
            clientId: c.id,
            username: c.username,
            displayName: c.displayName,
            gameName: c.gameName ?? null,
            userId: c.userId,
            placeId: c.placeId,
            jobId: c.jobId,
            executor: c.executor,
            capabilities: c.capabilities.length,
            connectedAt: c.connectedAt,
        })),
        catalog: {
            total: deps.registry.size,
            categories: deps.registry.categoryCounts().map((e) => ({ ...e })),
        },
        activity: {
            total: summary.total,
            errors: summary.errors,
            recent: deps.activity.recent(40).map((r) => ({
                toolName: r.toolName,
                category: r.category,
                sessionId: r.sessionId,
                outcome: r.outcome,
                durationMs: r.durationMs,
                clientName: r.clientName ?? null,
                at: r.at,
                ...(r.errorCode ? { errorCode: r.errorCode } : {}),
                ...(r.intelligence ? { intelligence: { ...r.intelligence } } : {}),
            })),
        },
    };
}
export function buildToolCatalog(registry) {
    return registry.list().map((t) => ({
        name: t.name,
        title: t.title,
        description: t.description,
        category: t.category,
        mutatesState: t.mutatesState ?? false,
        requiresClient: t.requiresClient !== false,
        phase: t.ai?.phase ?? (t.mutatesState ? "act" : "observe"),
        quality: t.quality,
    }));
}
//# sourceMappingURL=dashboard-data.js.map