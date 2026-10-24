import { assessToolDefinition } from "../services/tool-definition-quality.js";
import { inferToolContract, mergeToolContract } from "./tool-contract.js";
/**
 * Authoring helper that infers a tool's input type from its zod schema, so a tool
 * file never restates its argument types. This is the one and only way tools are
 * declared, which keeps every tool uniform.
 *
 * @example
 * export default defineTool({
 *   name: "get-health",
 *   category: "Inspection",
 *   input: z.object({ path: z.string() }),
 *   async execute({ path }, ctx) {
 *     const hp = await ctx.runLuau(`return ${path}.Health`);
 *     return { data: { hp } };
 *   },
 * });
 */
export function defineTool(definition) {
    const base = {
        name: definition.name,
        title: definition.title ?? definition.name,
        description: definition.description,
        category: definition.category,
        // zod v4's ZodType is invariant in its internals; the schema's output is
        // z.infer<S> by construction, so this narrowing is sound.
        input: definition.input,
        requiresClient: definition.requiresClient ?? true,
        mutatesState: definition.mutatesState ?? false,
        execute: definition.execute,
    };
    const inferred = inferToolContract({
        ...base,
        input: base.input,
    });
    const ai = mergeToolContract(inferred, definition.ai);
    const quality = assessToolDefinition({
        ...base,
        input: base.input,
        ai,
    });
    return {
        ...base,
        ai,
        quality,
    };
}
//# sourceMappingURL=define-tool.js.map