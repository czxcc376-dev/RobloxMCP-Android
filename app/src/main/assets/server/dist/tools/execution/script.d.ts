/**
 * Runs a Luau program in the active client with a built-in `mcp` table that can
 * call any other tool inline — but the bridge is the existing WebSocket, not an
 * executor HTTP request. The connector pre-binds `mcp` and captures print/warn
 * from inside the run, returning `{ result, output }` (or `{ error, output }`).
 *
 * Compared to the previous design this:
 *   - eliminates the executor `request()` call from the hot path,
 *   - eliminates HttpService:JSONEncode/Decode in the script wrapper,
 *   - eliminates the giant Luau preamble that used to be prepended at compile time.
 * The token still gates server-side access through {@link ScriptBridge}.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    source: string;
    client?: string | undefined;
    agent?: string | undefined;
    persistent?: boolean | undefined;
    timeoutMs?: number | undefined;
    rpcBudget?: number | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=script.d.ts.map