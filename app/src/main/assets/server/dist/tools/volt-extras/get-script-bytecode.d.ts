/**
 * Dump the compiled Luau bytecode of a script via the executor's getscriptbytecode.
 * The target script is resolved from a Luau expression (e.g. a path to a
 * LuaSourceContainer) through loadstring("return " .. expr); the raw bytecode string
 * is then returned as a byte count plus a short hex preview of its leading bytes —
 * the full blob is intentionally not shipped across the bridge.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    scriptPath: string;
    previewBytes: number;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=get-script-bytecode.d.ts.map