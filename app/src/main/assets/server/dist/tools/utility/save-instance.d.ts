/**
 * Dump the game (or a subtree) to a .rbxm/.rbxmx file in the executor workspace
 * via saveinstance. Executors vary wildly in the signature they accept, so we try
 * several best-effort forms: saveinstance({ FilePath = name }), then
 * saveinstance(instance, name) / saveinstance(instance), then saveinstance().
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    fileName?: string | undefined;
    instancePath?: string | undefined;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=save-instance.d.ts.map