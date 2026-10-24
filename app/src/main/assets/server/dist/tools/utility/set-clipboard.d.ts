/**
 * Copy text to the host OS clipboard via setclipboard(text) (falling back to
 * toclipboard(text) on executors that spell it differently).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    text: string;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=set-clipboard.d.ts.map