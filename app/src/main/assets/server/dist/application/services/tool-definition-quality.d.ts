import type { z } from "zod";
import type { Tool, ToolContract, ToolDefinitionQuality, ToolResult } from "../tool/tool.js";
import { type InputField } from "./schema-introspect.js";
export interface QualityToolLike {
    readonly name: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly mutatesState?: boolean;
    readonly requiresClient?: boolean;
    readonly ai?: ToolContract;
    readonly quality?: ToolDefinitionQuality;
    readonly input: z.ZodTypeAny;
}
export interface ToolUsageGuidance {
    readonly signature: string;
    readonly requiredInputs: readonly string[];
    readonly optionalInputs: readonly string[];
    readonly fields: readonly InputField[];
    readonly exampleInput: Readonly<Record<string, unknown>>;
    readonly example: string;
    readonly callWhen: readonly string[];
    readonly avoidWhen: readonly string[];
    readonly safety: {
        readonly readOnly: boolean;
        readonly mutatesState: boolean;
        readonly requiresClient: boolean;
        readonly sideEffects: readonly string[];
    };
    readonly execution: {
        readonly phase: ToolContract["phase"];
        readonly estimatedCost: "low" | "medium" | "high";
        readonly idempotency: "read-only" | "idempotent-write" | "contextual-write";
        readonly prerequisites: readonly string[];
        readonly capabilities: readonly string[];
    };
    readonly success: {
        readonly produces: readonly string[];
        readonly verifiesWith: readonly string[];
    };
    readonly alternatives: readonly string[];
    readonly recovery: readonly string[];
    readonly quality: ToolDefinitionQuality;
}
export declare function assessToolDefinition(tool: QualityToolLike): ToolDefinitionQuality;
export declare function buildToolExampleInput(schema: z.ZodTypeAny, fields: readonly InputField[]): Readonly<Record<string, unknown>>;
export declare function buildToolExample(name: string, schema: z.ZodTypeAny, fields: readonly InputField[]): string;
export declare function buildToolGuidance(tool: QualityToolLike): ToolUsageGuidance;
export declare function formatToolDescription(tool: QualityToolLike): string;
/** Supply a compact summary for legacy tools without changing their structured data shape. */
export declare function defaultToolSummary(tool: Pick<Tool, "title">, result: ToolResult): string;
//# sourceMappingURL=tool-definition-quality.d.ts.map