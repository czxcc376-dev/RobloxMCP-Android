/**
 * Domain error hierarchy. Every failure that crosses a layer boundary is one of
 * these typed errors, so the interface layer can map them to stable, predictable
 * responses (an MCP error, an HTTP status) without leaking stack traces or
 * stringly-typed guesswork. Infrastructure exceptions are wrapped before they
 * escape their adapter.
 */
export class DomainError extends Error {
    details;
    /** True when the caller could plausibly succeed by changing their input/state. */
    retryable = false;
    constructor(message, details, options) {
        super(message, options);
        this.details = details;
        this.name = new.target.name;
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            ...(this.details ? { details: { ...this.details } } : {}),
        };
    }
}
/** Input failed schema validation. */
export class ValidationError extends DomainError {
    code = "VALIDATION";
}
/** No tool is registered under the requested name. */
export class ToolNotFoundError extends DomainError {
    code = "TOOL_NOT_FOUND";
    constructor(toolName) {
        super(`No tool named "${toolName}" is registered.`, { toolName });
    }
}
/** A session that owns no client tried to run a client-bound tool. */
export class NoClientSelectedError extends DomainError {
    code = "NO_CLIENT_SELECTED";
}
/** Several distinct accounts are connected and the session has not chosen one. */
export class AmbiguousClientError extends DomainError {
    code = "AMBIGUOUS_CLIENT";
}
/** The selected/targeted client id is not (or no longer) connected. */
export class ClientNotFoundError extends DomainError {
    code = "CLIENT_NOT_FOUND";
}
/** The client's connection dropped while a request was in flight. */
export class ClientDisconnectedError extends DomainError {
    code = "CLIENT_DISCONNECTED";
    retryable = true;
}
/** The bridge or connector is at its bounded concurrency/queue capacity. */
export class BridgeOverloadedError extends DomainError {
    code = "BRIDGE_OVERLOADED";
    retryable = true;
}
/** The connector reported a runtime error while executing the request. */
export class ExecutionFailedError extends DomainError {
    code = "EXECUTION_FAILED";
}
/** The connector did not answer within the deadline. */
export class ExecutionTimeoutError extends DomainError {
    code = "EXECUTION_TIMEOUT";
    retryable = true;
}
/** A malformed or unexpected protocol message was received. */
export class ProtocolError extends DomainError {
    code = "PROTOCOL";
}
/** Server configuration is invalid. */
export class ConfigError extends DomainError {
    code = "CONFIG";
}
/** Unexpected internal failure (a bug). Wrap unknown throwables in this. */
export class InternalError extends DomainError {
    code = "INTERNAL";
}
/** Coerce any thrown value into a DomainError, preserving the cause. */
export function toDomainError(thrown) {
    if (thrown instanceof DomainError)
        return thrown;
    const message = thrown instanceof Error ? thrown.message : String(thrown);
    return new InternalError(message, undefined, { cause: thrown });
}
//# sourceMappingURL=errors.js.map