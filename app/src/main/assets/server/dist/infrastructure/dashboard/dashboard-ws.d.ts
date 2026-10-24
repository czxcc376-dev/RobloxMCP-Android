import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import type { Logger } from "../../application/ports/logger.js";
import type { DashboardEventBus } from "./dashboard-events.js";
/**
 * `/ws/dashboard` push channel. Every connected dashboard tab subscribes to the
 * shared {@link DashboardEventBus} and receives JSON frames as state changes:
 *
 *   { type: "output",        entries: [...] }
 *   { type: "activity",      record: {...}  }
 *   { type: "client-change", action, clientId }
 *
 * Output is the chattiest channel — we coalesce per-tick so a flood of game
 * prints can't stall a slow tab.
 */
export declare class DashboardWebSocketServer {
    private readonly wss;
    private readonly logger;
    private readonly bus;
    private readonly expectedToken;
    constructor(deps: {
        logger: Logger;
        bus: DashboardEventBus;
        expectedToken?: string | null;
    });
    /** Called by the bridge's HTTP upgrade router for `/ws/dashboard`. */
    handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer): void;
    private authorize;
}
//# sourceMappingURL=dashboard-ws.d.ts.map