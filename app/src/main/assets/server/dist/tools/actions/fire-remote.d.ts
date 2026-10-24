declare const _default: import("../../application/tool/tool.js").Tool<{
    remotePath: string;
    mode: "Fire" | "FireServer" | "InvokeServer" | "FireAllClients" | "FireClient";
    args?: {
        kind: "string" | "number" | "boolean" | "nil" | "raw";
        value?: string | number | boolean | undefined;
    }[] | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=fire-remote.d.ts.map