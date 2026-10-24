import type { ClientDirectory } from "../../application/ports/client-directory.js";
import type { ExecutionGateway } from "../../application/ports/execution-gateway.js";
import { type SpyEngine } from "../../application/services/remote-spy-source.js";
/** Dashboard and MCP read/control the same Cobalt adapter. */
export declare class SpyService {
    private readonly gateway;
    private readonly clients;
    constructor(gateway: ExecutionGateway, clients: ClientDirectory);
    private run;
    logs(clientId: string, limit: number, engine?: SpyEngine): Promise<unknown>;
    clear(clientId: string, engine?: SpyEngine): Promise<unknown>;
    start(clientId: string, mode: "auto" | "luau" | "raknet", engine?: SpyEngine): Promise<unknown>;
}
//# sourceMappingURL=dashboard-spy.d.ts.map