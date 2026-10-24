declare const _default: import("../../application/tool/tool.js").Tool<{
    engine: "cobalt" | "ketamine";
    threadContext?: number | undefined;
    max?: number | undefined;
    capture?: {
        enabled?: boolean | undefined;
        direction?: "Incoming" | "Outgoing" | "Both" | undefined;
        nameFilter?: string | undefined;
        method?: "OnClientEvent" | "FireServer" | "InvokeServer" | "OnClientInvoke" | undefined;
        classFilter?: "RemoteEvent" | "UnreliableRemoteEvent" | "RemoteFunction" | undefined;
        blockedOnly?: boolean | undefined;
    } | undefined;
    resetFilters?: boolean | undefined;
    guiVisible?: boolean | undefined;
    guiLogging?: boolean | undefined;
}>;
export default _default;
//# sourceMappingURL=configure-remote-spy.d.ts.map