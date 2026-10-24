/**
 * Domain error hierarchy. Every failure that crosses a layer boundary is one of
 * these typed errors, so the interface layer can map them to stable, predictable
 * responses (an MCP error, an HTTP status) without leaking stack traces or
 * stringly-typed guesswork. Infrastructure exceptions are wrapped before they
 * escape their adapter.
 */
/** Stable, machine-readable failure codes (mirrored in the API docs). */
export type ErrorCode = "VALIDATION" | "TOOL_NOT_FOUND" | "NO_CLIENT_SELECTED" | "AMBIGUOUS_CLIENT" | "CLIENT_NOT_FOUND" | "CLIENT_DISCONNECTED" | "BRIDGE_OVERLOADED" | "EXECUTION_FAILED" | "EXECUTION_TIMEOUT" | "PROTOCOL" | "CONFIG" | "INTERNAL";
export declare abstract class DomainError extends Error {
    readonly details?: Readonly<Record<string, unknown>> | undefined;
    abstract readonly code: ErrorCode;
    /** True when the caller could plausibly succeed by changing their input/state. */
    readonly retryable: boolean;
    constructor(message: string, details?: Readonly<Record<string, unknown>> | undefined, options?: {
        cause?: unknown;
    });
    toJSON(): {
        code: ErrorCode;
        message: string;
        details?: Record<string, unknown>;
    };
}
/** Input failed schema validation. */
export declare class ValidationError extends DomainError {
    readonly code: "VALIDATION";
}
/** No tool is registered under the requested name. */
export declare class ToolNotFoundError extends DomainError {
    readonly code: "TOOL_NOT_FOUND";
    constructor(toolName: string);
}
/** A session that owns no client tried to run a client-bound tool. */
export declare class NoClientSelectedError extends DomainError {
    readonly code: "NO_CLIENT_SELECTED";
}
/** Several distinct accounts are connected and the session has not chosen one. */
export declare class AmbiguousClientError extends DomainError {
    readonly code: "AMBIGUOUS_CLIENT";
}
/** The selected/targeted client id is not (or no longer) connected. */
export declare class ClientNotFoundError extends DomainError {
    readonly code: "CLIENT_NOT_FOUND";
}
/** The client's connection dropped while a request was in flight. */
export declare class ClientDisconnectedError extends DomainError {
    readonly code: "CLIENT_DISCONNECTED";
    readonly retryable = true;
}
/** The bridge or connector is at its bounded concurrency/queue capacity. */
export declare class BridgeOverloadedError extends DomainError {
    readonly code: "BRIDGE_OVERLOADED";
    readonly retryable = true;
}
/** The connector reported a runtime error while executing the request. */
export declare class ExecutionFailedError extends DomainError {
    readonly code: "EXECUTION_FAILED";
}
/** The connector did not answer within the deadline. */
export declare class ExecutionTimeoutError extends DomainError {
    readonly code: "EXECUTION_TIMEOUT";
    readonly retryable = true;
}
/** A malformed or unexpected protocol message was received. */
export declare class ProtocolError extends DomainError {
    readonly code: "PROTOCOL";
}
/** Server configuration is invalid. */
export declare class ConfigError extends DomainError {
    readonly code: "CONFIG";
}
/** Unexpected internal failure (a bug). Wrap unknown throwables in this. */
export declare class InternalError extends DomainError {
    readonly code: "INTERNAL";
}
/** Coerce any thrown value into a DomainError, preserving the cause. */
export declare function toDomainError(thrown: unknown): DomainError;
//# sourceMappingURL=errors.d.ts.map