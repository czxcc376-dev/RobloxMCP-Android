declare const _default: import("../../application/tool/tool.js").Tool<{
    filterType: "function" | "table";
    options: {
        Name?: string | undefined;
        Hash?: string | undefined;
        IgnoreExecutor?: boolean | undefined;
        Constants?: (string | number | boolean)[] | undefined;
        Upvalues?: (string | number | boolean)[] | undefined;
        Keys?: (string | number | boolean)[] | undefined;
        Values?: (string | number | boolean)[] | undefined;
        KeyValuePairs?: Record<string, string | number | boolean> | undefined;
        Metatable?: string | number | boolean | undefined;
    };
    limit: number;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=filter-gc.d.ts.map