import type { ActivityLog, IntelligenceActivity } from "../../application/ports/activity-log.js";
import type { ClientAdmin } from "../../application/ports/client-admin.js";
import type { ClientDirectory } from "../../application/ports/client-directory.js";
import type { AppConfig } from "../../application/ports/config.js";
import type { ExecutionGateway } from "../../application/ports/execution-gateway.js";
import type { OutputLog } from "../../application/ports/output-log.js";
import type { SavedScriptsStore } from "../../application/ports/saved-scripts.js";
import type { ScriptBridge } from "../../application/services/script-bridge.js";
import type { ToolRegistry } from "../../application/tool/registry.js";
import type { ToolDefinitionQuality, ToolContract } from "../../application/tool/tool.js";
import type { HealthReporter } from "../observability/health.js";
export interface DashboardDeps {
    readonly config: AppConfig;
    readonly clients: ClientDirectory;
    readonly registry: ToolRegistry;
    readonly activity: ActivityLog;
    readonly health: HealthReporter;
    readonly gateway: ExecutionGateway;
    readonly output: OutputLog;
    readonly admin: ClientAdmin;
    readonly playbooks: SavedScriptsStore;
    readonly scriptBridge: ScriptBridge;
}
/** The JSON the dashboard polls. Kept flat and presentational. */
export interface DashboardState {
    readonly server: {
        readonly version: string;
        readonly label: string;
        readonly host: string;
        readonly port: number;
        readonly uptimeMs: number;
        readonly startedAt: number;
    };
    readonly clients: readonly {
        readonly clientId: string;
        readonly username: string | null;
        readonly displayName: string | null;
        readonly gameName: string | null;
        readonly userId: number | null;
        readonly placeId: number | null;
        readonly jobId: string | null;
        readonly executor: string | null;
        readonly capabilities: number;
        readonly connectedAt: number;
    }[];
    readonly catalog: {
        readonly total: number;
        readonly categories: readonly {
            readonly category: string;
            readonly count: number;
        }[];
    };
    readonly activity: {
        readonly total: number;
        readonly errors: number;
        readonly recent: readonly {
            readonly toolName: string;
            readonly category: string;
            readonly sessionId: string;
            readonly outcome: "ok" | "error";
            readonly durationMs: number;
            readonly errorCode?: string;
            readonly clientName?: string | null;
            readonly intelligence?: IntelligenceActivity;
            readonly at: number;
        }[];
    };
}
export interface ToolCatalogEntry {
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly mutatesState: boolean;
    readonly requiresClient: boolean;
    readonly phase: ToolContract["phase"];
    readonly quality?: ToolDefinitionQuality;
}
export declare function buildDashboardState(deps: DashboardDeps): DashboardState;
export declare function buildToolCatalog(registry: ToolRegistry): ToolCatalogEntry[];
//# sourceMappingURL=dashboard-data.d.ts.map