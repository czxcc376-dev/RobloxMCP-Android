import { type ToolCategory } from "../../domain/tool/category.js";
import type { Tool } from "./tool.js";
/**
 * In-memory catalog of registered tools. Built once at startup from the tool
 * modules and queried by the MCP adapter and the `list-tools` discovery tool.
 * Rejects duplicate names so a copy-paste mistake fails loudly at boot.
 */
export declare class ToolRegistry {
    private readonly byName;
    register(tool: Tool): void;
    registerAll(tools: Iterable<Tool>): void;
    get(name: string): Tool | undefined;
    has(name: string): boolean;
    list(): readonly Tool[];
    byCategory(category: ToolCategory): readonly Tool[];
    /** Count of tools per category, in canonical category order. */
    categoryCounts(): readonly {
        category: ToolCategory;
        count: number;
    }[];
    get size(): number;
}
//# sourceMappingURL=registry.d.ts.map