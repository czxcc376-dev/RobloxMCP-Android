import type { ClientDirectory } from "../../application/ports/client-directory.js";
import type { ExecutionGateway } from "../../application/ports/execution-gateway.js";
/**
 * Game Brief queries: a small one-shot read of the active place's identity +
 * top-level shape, and a wrapper around the discover-player-values tool's Luau
 * so the dashboard can trigger value discovery without going through the MCP
 * client.
 */
export declare class BriefService {
    private readonly gateway;
    private readonly clients;
    constructor(gateway: ExecutionGateway, clients: ClientDirectory);
    private run;
    /** Place identity + a count of services that commonly host game logic. */
    summary(clientId: string): Promise<unknown>;
    /** Ranked candidate value paths — mirrors discover-player-values' heuristic. */
    values(clientId: string, limit: number): Promise<unknown>;
}
//# sourceMappingURL=dashboard-brief.d.ts.map