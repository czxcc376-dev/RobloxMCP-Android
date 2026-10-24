/**
 * Read a Roblox FastFlag value via the executor's getfflag(name). FastFlags are
 * the engine's runtime feature toggles; the executor exposes the current value
 * as a string (or nil when the flag is unknown).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    name: string;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=get-fast-flag.d.ts.map