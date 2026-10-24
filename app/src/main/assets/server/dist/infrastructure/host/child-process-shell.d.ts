import type { HostShell, ShellResult } from "../../application/ports/host-shell.js";
import type { Logger } from "../../application/ports/logger.js";
/**
 * The production {@link HostShell}: runs a command via `node:child_process.spawn`
 * with the args passed as an array and `shell: false`, so arguments are never
 * re-parsed by a shell and cannot be injected. stdout/stderr are collected as
 * UTF-8; a non-zero (or null, on signal) exit is returned in `code` rather than
 * thrown. When `timeoutMs` elapses the child is killed and the partial output is
 * returned with `code: null`.
 */
export declare class ChildProcessShell implements HostShell {
    private readonly logger;
    constructor(options?: {
        logger?: Logger;
    });
    run(command: string, args: readonly string[], options?: {
        timeoutMs?: number;
    }): Promise<ShellResult>;
}
//# sourceMappingURL=child-process-shell.d.ts.map