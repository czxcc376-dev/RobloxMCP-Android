declare const _default: import("../../application/tool/tool.js").Tool<{
    limit: number;
    direction: "Incoming" | "Outgoing" | "Both";
    summaryOnly: boolean;
    engine: "cobalt" | "ketamine";
    operation: "code" | "stop" | "resume" | "status" | "start" | "restart" | "logs" | "list" | "clear" | "configure" | "pause" | "controls" | "reset-controls" | "block" | "ignore" | "unblock" | "unignore";
    mode: "auto" | "luau" | "raknet";
    offset?: number | undefined;
    resetControl?: "Both" | "block" | "ignore" | undefined;
    remotePath?: string | undefined;
    remoteId?: string | undefined;
    nameFilter?: string | undefined;
    method?: "OnClientEvent" | "FireServer" | "InvokeServer" | "OnClientInvoke" | undefined;
    classFilter?: "RemoteEvent" | "UnreliableRemoteEvent" | "RemoteFunction" | undefined;
    blockedOnly?: boolean | undefined;
    afterId?: number | undefined;
    callId?: number | undefined;
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
//# sourceMappingURL=remote-spy.d.ts.map