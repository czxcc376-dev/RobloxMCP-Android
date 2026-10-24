declare const _default: import("../../application/tool/tool.js").Tool<{
    engine: "cobalt" | "ketamine";
    limit: number;
    direction: "Incoming" | "Outgoing" | "Both";
    afterId?: number | undefined;
    remotePath?: string | undefined;
    remoteId?: string | undefined;
    nameFilter?: string | undefined;
    method?: string | undefined;
    classFilter?: "RemoteEvent" | "UnreliableRemoteEvent" | "RemoteFunction" | undefined;
    blockedOnly?: boolean | undefined;
    raknetOnly?: boolean | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=get-remote-spy-logs.d.ts.map