export interface PreflightFinding {
    /** The tool name as it would be invoked on the server (kebab-case). */
    readonly name: string;
    /** How the AI wrote it in source (e.g. "getPlayers" or "get-players"). */
    readonly written: string;
    /** Times this exact identifier appears in the source. */
    readonly occurrences: number;
    /** Best alternative tool names by edit distance, when the call is unknown. */
    readonly suggestions: readonly string[];
}
export interface PreflightReport {
    readonly errors: readonly PreflightFinding[];
    readonly callCount: number;
}
/**
 * Scan a script's Luau source for `mcp.<name>(` and `mcp.call("kebab")` calls.
 * Returns a list of statically-detectable unknown tools with edit-distance
 * suggestions. Dynamic lookups (`mcp[name]`) are intentionally not scanned —
 * we only flag what the AI almost certainly meant statically.
 */
export declare function preflightScript(source: string, knownTools: readonly string[]): PreflightReport;
//# sourceMappingURL=script-preflight.d.ts.map