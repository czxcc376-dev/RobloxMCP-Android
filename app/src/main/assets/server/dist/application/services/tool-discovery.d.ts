interface DiscoveryTool {
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly mutatesState?: boolean;
    readonly requiresClient?: boolean;
}
export interface RankedTool<T extends DiscoveryTool = DiscoveryTool> {
    readonly tool: T;
    readonly score: number;
    readonly matchedTerms: readonly string[];
    readonly why: string;
}
export interface WorkflowStep {
    readonly tool: string;
    readonly why: string;
    readonly phase: "discover" | "act" | "verify" | "recover";
}
export interface WorkflowMatch {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly steps: readonly WorkflowStep[];
}
/**
 * Rank tools against a natural-language goal. Exact tool-name hits dominate,
 * while the small alias vocabulary makes requests such as "find my cash" land
 * on player-value discovery tools instead of requiring the word "currency".
 */
export declare function rankTools<T extends DiscoveryTool>(query: string, tools: readonly T[], limit?: number): readonly RankedTool<T>[];
export declare function matchWorkflows(goal: string, availableTools: ReadonlySet<string>): readonly WorkflowMatch[];
export declare function matchWorkflow(goal: string, availableTools: ReadonlySet<string>): WorkflowMatch | null;
export {};
//# sourceMappingURL=tool-discovery.d.ts.map