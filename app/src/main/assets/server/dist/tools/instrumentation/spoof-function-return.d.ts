declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "stop" | "start";
    functionPath?: string | undefined;
    returnValue?: {
        kind: "string" | "number" | "boolean" | "nil" | "raw";
        value?: string | number | boolean | undefined;
    } | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=spoof-function-return.d.ts.map