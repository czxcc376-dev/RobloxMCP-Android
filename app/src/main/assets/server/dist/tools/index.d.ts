import type { Tool } from "../application/tool/tool.js";
/**
 * The single, ordered list of every built-in tool, one array per category. The
 * composition root passes this straight to {@link ToolRegistry.registerAll}.
 * Adding a category = import its array and spread it here; the registry rejects
 * duplicate names at boot.
 */
export declare function allTools(): Tool[];
//# sourceMappingURL=index.d.ts.map