/**
 * Show a native host message box via messagebox(text, caption, flags). The flags
 * map to the OS dialog's button/icon style; the call returns the numeric code of
 * the button the user pressed.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    text: string;
    caption: string;
    flags: number;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=message-box.d.ts.map