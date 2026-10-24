/**
 * Write a Roblox FastFlag value via the executor's setfflag(name, value).
 * Overrides an engine feature toggle for the running client; the value is passed
 * as a string (the executor coerces it to the flag's native type).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    name: string;
    value: string;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=set-fast-flag.d.ts.map