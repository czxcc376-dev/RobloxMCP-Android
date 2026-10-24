import type { Tool } from "../../application/tool/tool.js";
/**
 * UNC "extras" that fold into existing categories: high-value executor
 * functions (filtergc, debug.getstack, gethui, getrendered, the cache library)
 * exposed as focused tools. Each tool sets its own category explicitly and guards
 * its executor function, so the set degrades cleanly on executors that lack them.
 */
export declare const voltExtrasTools: Tool[];
//# sourceMappingURL=index.d.ts.map