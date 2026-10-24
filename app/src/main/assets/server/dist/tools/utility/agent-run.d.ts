declare const _default: import("../../application/tool/tool.js").Tool<{
    goal: string;
    dryRun: boolean;
    allowMutations: boolean;
    retryMutations: boolean;
    verify: boolean;
    stopOnError: boolean;
    maxSteps: number;
    steps?: {
        id: string;
        tool: string;
        input: Record<string, unknown>;
        retries: number;
        verifyWith?: string | undefined;
        verifyInput?: Record<string, unknown> | undefined;
    }[] | undefined;
}>;
export default _default;
//# sourceMappingURL=agent-run.d.ts.map