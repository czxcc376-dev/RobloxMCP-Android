/**
 * Return the content hash of a script via the executor's getscripthash. The target
 * is resolved from a Luau expression (a path to a LuaSourceContainer) through
 * loadstring("return " .. expr), then hashed — useful to detect when a script's
 * bytecode/source has changed between two observations.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    scriptPath: string;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=get-script-hash.d.ts.map