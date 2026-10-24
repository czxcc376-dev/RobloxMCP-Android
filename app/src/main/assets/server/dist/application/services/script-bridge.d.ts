import type { ClientId, SessionId } from "../../domain/shared/ids.js";
import type { ToolInvoker } from "./tool-invoker.js";
/** Per-script RPC budget cap (configurable per mint call). */
export declare const DEFAULT_SCRIPT_RPC_BUDGET = 500;
export type ScriptRunResult = {
    readonly ok: true;
    readonly data: unknown;
} | {
    readonly ok: false;
    readonly error: string;
    readonly code?: string;
};
/**
 * Backs the in-game `mcp.<tool>()` bridge. The `script` tool mints a short-lived
 * token bound to its own session/client; the running Luau then calls the
 * token-gated `/api/exec-tool` endpoint, which routes here to run any tool through
 * the normal {@link ToolInvoker}. Tokens gate the endpoint so arbitrary game code
 * can't drive the tool surface — only a script the operator launched can.
 */
export declare class ScriptBridge {
    private invoker;
    private readonly grants;
    /** Wired after construction to break the invoker <-> bridge cycle. */
    attach(invoker: ToolInvoker): void;
    /** Issue a token for one script run. Call `dispose()` when the run finishes. */
    mint(sessionId: SessionId, sessionLabel: string, clientId?: ClientId, agentLane?: string, budget?: number): {
        token: string;
        dispose: () => void;
    };
    /** Run a tool on behalf of a token. Never throws — failures come back as data. */
    run(token: string, toolName: string, args: unknown): Promise<ScriptRunResult>;
}
//# sourceMappingURL=script-bridge.d.ts.map