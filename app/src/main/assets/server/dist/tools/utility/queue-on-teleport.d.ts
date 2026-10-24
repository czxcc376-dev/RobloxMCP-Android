/**
 * Queue Luau source to run automatically after the next teleport via
 * queueonteleport(code). The queued code persists across the teleport boundary
 * and executes in the destination place.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    code: string;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=queue-on-teleport.d.ts.map