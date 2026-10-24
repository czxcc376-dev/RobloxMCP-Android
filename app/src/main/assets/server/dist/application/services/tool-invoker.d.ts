import type { SessionId } from "../../domain/shared/ids.js";
import type { ActivityLog } from "../ports/activity-log.js";
import type { AppConfig } from "../ports/config.js";
import type { Clock } from "../ports/clock.js";
import type { ClientDirectory } from "../ports/client-directory.js";
import type { ExecutionGateway } from "../ports/execution-gateway.js";
import type { EvalPriority } from "../ports/execution-gateway.js";
import type { Logger } from "../ports/logger.js";
import type { Metrics } from "../ports/metrics.js";
import type { SavedScriptsStore } from "../ports/saved-scripts.js";
import type { SemanticIndex } from "../ports/semantic-index.js";
import type { SessionLogger } from "../ports/session-logger.js";
import type { HostServices, ToolResult } from "../tool/tool.js";
import type { ToolRegistry } from "../tool/registry.js";
import type { ScriptBridge } from "./script-bridge.js";
import type { SessionManager } from "./session-manager.js";
export interface ToolInvokerDeps {
    readonly registry: ToolRegistry;
    readonly sessions: SessionManager;
    readonly gateway: ExecutionGateway;
    readonly clients: ClientDirectory;
    readonly logger: Logger;
    readonly metrics: Metrics;
    readonly clock: Clock;
    readonly config: AppConfig;
    readonly host: HostServices;
    readonly semantic: SemanticIndex;
    readonly activity: ActivityLog;
    readonly scriptBridge: ScriptBridge;
    readonly playbooks: SavedScriptsStore;
    readonly sessionLogger: SessionLogger;
}
export interface InvocationRequest {
    readonly toolName: string;
    readonly input: unknown;
    readonly sessionId: SessionId;
    readonly sessionLabel: string;
    /** Internal lane used by tools invoked from a parent in-game script. */
    readonly priority?: EvalPriority;
}
/**
 * The single use-case that runs a tool. It is the only place that knows the full
 * lifecycle of a call — validate, resolve the target client, build the sandboxed
 * context, time it, record metrics, and normalize every failure into a
 * {@link DomainError}. Tools stay tiny because all of this lives here.
 */
export declare class ToolInvoker {
    private readonly deps;
    private readonly seqBySession;
    constructor(deps: ToolInvokerDeps);
    /** Loopback URL the executor's HTTP client can reach this server at. */
    private scriptBaseUrl;
    /** Adapter: present the live registry as a read-only ToolDirectory port. */
    private toolDirectory;
    invoke(request: InvocationRequest): Promise<ToolResult>;
}
//# sourceMappingURL=tool-invoker.d.ts.map