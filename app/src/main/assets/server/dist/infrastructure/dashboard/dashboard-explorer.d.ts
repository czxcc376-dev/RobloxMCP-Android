import type { ClientDirectory } from "../../application/ports/client-directory.js";
import type { ExecutionGateway } from "../../application/ports/execution-gateway.js";
/**
 * Decompile one script and build a bounded, static proto tree around its main
 * closure. The source and reflection payload are capped before crossing the
 * bridge so a large script cannot freeze the dashboard or executor.
 */
export declare function scriptInspectionLuau(path: string): string;
/** Build a bounded reverse-reference scan for one stable proto id. */
export declare function functionReferencesLuau(path: string, functionId: string, maxScanned: number): string;
/**
 * Runs live game-tree and bounded script-analysis queries on a chosen connected
 * client via the execution gateway. Used by the dashboard Explorer.
 */
export declare class ExplorerService {
    private readonly gateway;
    private readonly clients;
    constructor(gateway: ExecutionGateway, clients: ClientDirectory);
    private run;
    children(clientId: string, path: string, opts?: {
        offset?: number;
        limit?: number;
    }): Promise<unknown>;
    properties(clientId: string, path: string): Promise<unknown>;
    connections(clientId: string, path: string): Promise<unknown>;
    script(clientId: string, path: string): Promise<unknown>;
    references(clientId: string, path: string, functionId: string, opts?: {
        maxScanned?: number;
    }): Promise<unknown>;
}
//# sourceMappingURL=dashboard-explorer.d.ts.map