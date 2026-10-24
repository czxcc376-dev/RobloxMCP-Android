import type { SessionLogger, SessionTraceRecord, SessionTraceSummary } from "../../application/ports/session-logger.js";
/**
 * One JSONL file per session, named `<sessionId>.jsonl`. Append is
 * synchronous so a tool's recorded entry is on-disk before the call's caller
 * sees a reply — a crash mid-run still leaves a complete trace up to the
 * crash point. A small label-cache writes a `# session: <label>` header line
 * the first time we touch a file so `list()` can show human names.
 */
export declare class FsSessionLogger implements SessionLogger {
    private readonly dir;
    private readonly seenSessions;
    constructor(dir?: string);
    private pathFor;
    append(record: SessionTraceRecord, sessionLabel: string): void;
    list(): Promise<readonly SessionTraceSummary[]>;
    read(sessionId: string, opts?: {
        from?: number;
        to?: number;
    }): Promise<readonly SessionTraceRecord[]>;
    /** Cheap scan: read just the first line (label) + record count from line count. */
    private summarize;
}
//# sourceMappingURL=fs-session-logger.d.ts.map