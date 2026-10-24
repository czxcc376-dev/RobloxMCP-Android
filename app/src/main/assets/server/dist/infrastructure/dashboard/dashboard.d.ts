import type { Hono } from "hono";
import { type DashboardDeps } from "./dashboard-data.js";
/**
 * Serves the web dashboard and its JSON API on the bridge's HTTP server. The
 * read-only endpoints pull from the application ports (client directory, tool
 * registry, activity log, health). The Explorer endpoints run guarded, bounded
 * Luau on a chosen client to fetch its live tree and inspect script closures.
 */
export declare class Dashboard {
    private readonly deps;
    private readonly explorer;
    private readonly brief;
    private readonly spy;
    private readonly playbookSvc;
    private classIcons;
    constructor(deps: DashboardDeps);
    mount(app: Hono): void;
    /**
     * Mount /auth (POST) and /login (GET) BEFORE the gate so the login flow
     * itself doesn't 401. POST /auth validates the supplied token, sets an
     * HttpOnly cookie, then 302s back to /.
     */
    private mountAuth;
}
//# sourceMappingURL=dashboard.d.ts.map