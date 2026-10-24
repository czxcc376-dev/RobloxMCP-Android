/**
 * Load a saved playbook, substitute its `${param}` placeholders, and run it
 * through the same scripting bridge `script` uses (so `mcp.*`, `mcp.all()`,
 * the persistent VM, the per-script RPC budget, output capture, and pre-flight
 * all apply identically).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    name: string;
    params?: Record<string, string> | undefined;
    persistent?: boolean | undefined;
    timeoutMs?: number | undefined;
    rpcBudget?: number | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=playbook-run.d.ts.map