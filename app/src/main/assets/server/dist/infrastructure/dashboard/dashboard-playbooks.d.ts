import type { ClientDirectory } from "../../application/ports/client-directory.js";
import type { AppConfig } from "../../application/ports/config.js";
import type { ExecutionGateway } from "../../application/ports/execution-gateway.js";
import type { SavedScript, SavedScriptsStore } from "../../application/ports/saved-scripts.js";
import type { ScriptBridge } from "../../application/services/script-bridge.js";
import type { ToolRegistry } from "../../application/tool/registry.js";
/**
 * Backs the dashboard Playbooks tab. Lists/loads/saves/deletes via the
 * SavedScriptsStore, and runs a playbook against a chosen client by mirroring
 * the script tool's bind/execute path (mint scriptToken, ${param} substitution,
 * preflight, runLuau, dispose).
 */
export declare class PlaybookService {
    private readonly store;
    private readonly gateway;
    private readonly clients;
    private readonly scriptBridge;
    private readonly registry;
    private readonly config;
    constructor(store: SavedScriptsStore, gateway: ExecutionGateway, clients: ClientDirectory, scriptBridge: ScriptBridge, registry: ToolRegistry, config: AppConfig);
    list(): Promise<readonly SavedScript[]>;
    get(name: string): Promise<SavedScript | null>;
    save(input: SavedScript): Promise<SavedScript>;
    delete(name: string): Promise<boolean>;
    run(name: string, clientId: string, params: Record<string, string> | undefined, options?: {
        persistent?: boolean;
        timeoutMs?: number;
        rpcBudget?: number;
    }): Promise<unknown>;
    /** REPL-style runner: any source, no save. Same scripting bridge as run(). */
    runSource(source: string, clientId: string, options?: {
        persistent?: boolean;
        timeoutMs?: number;
        rpcBudget?: number;
    }, sessionTag?: string): Promise<unknown>;
}
//# sourceMappingURL=dashboard-playbooks.d.ts.map