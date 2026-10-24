import type { ToolDescriptor, ToolDirectory } from "../ports/tool-directory.js";
export declare const RECOVERY_CAUSES: readonly ["transport-disconnected", "no-client-selection", "ambiguous-client-selection", "stale-or-missing-instance-path", "missing-executor-capability", "custom-character-hierarchy", "bridge-overloaded", "timeout", "invalid-schema-or-input", "permission-or-mutation-blocked", "lua-runtime-error", "unsupported-operation", "unknown"];
export type RecoveryCause = (typeof RECOVERY_CAUSES)[number];
export interface FailureClassificationInput {
    readonly toolName: string;
    readonly error?: unknown;
    readonly result?: unknown;
    readonly attemptedInput?: unknown;
    readonly context?: Readonly<Record<string, unknown>>;
}
export interface RecoveryRetryPolicy {
    readonly strategy: "after-recovery" | "with-corrected-input" | "after-state-check" | "manual-review" | "do-not-retry";
    readonly maxAttempts: number;
    readonly retrySameInput: boolean;
    readonly conditions: readonly string[];
}
export interface RecoveryFallbackTool {
    readonly name: string;
    readonly title: string;
    readonly score: number;
    readonly reason: string;
    readonly mutatesState: boolean;
    readonly requiresClient: boolean;
    readonly requiresCapabilities: readonly string[];
}
export interface RecoveryEnvelope {
    readonly cause: RecoveryCause;
    readonly message: string;
    readonly evidence: readonly string[];
    readonly confidence: number;
    readonly recoverable: boolean;
    readonly retryPolicy: RecoveryRetryPolicy;
    readonly correctedInput?: unknown;
    readonly fallbackTools: readonly RecoveryFallbackTool[];
    readonly recoveryScript?: string;
    readonly nextActions: readonly string[];
}
/**
 * Deterministically explain one failed tool call using its evidence plus the
 * live tool registry. This helper performs no I/O and never invokes a fallback.
 */
export declare function classifyFailure(input: FailureClassificationInput, directory?: ToolDirectory | readonly ToolDescriptor[]): RecoveryEnvelope;
//# sourceMappingURL=recovery-intelligence.d.ts.map