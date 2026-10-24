import { TOOL_CATEGORIES } from "../../domain/tool/category.js";
/**
 * In-memory catalog of registered tools. Built once at startup from the tool
 * modules and queried by the MCP adapter and the `list-tools` discovery tool.
 * Rejects duplicate names so a copy-paste mistake fails loudly at boot.
 */
export class ToolRegistry {
    byName = new Map();
    register(tool) {
        if (this.byName.has(tool.name)) {
            throw new Error(`Duplicate tool registration: "${tool.name}"`);
        }
        this.byName.set(tool.name, tool);
    }
    registerAll(tools) {
        for (const tool of tools)
            this.register(tool);
    }
    get(name) {
        return this.byName.get(name);
    }
    has(name) {
        return this.byName.has(name);
    }
    list() {
        return [...this.byName.values()];
    }
    byCategory(category) {
        return this.list().filter((tool) => tool.category === category);
    }
    /** Count of tools per category, in canonical category order. */
    categoryCounts() {
        return TOOL_CATEGORIES.map((category) => ({
            category,
            count: this.byCategory(category).length,
        })).filter((entry) => entry.count > 0);
    }
    get size() {
        return this.byName.size;
    }
}
//# sourceMappingURL=registry.js.map