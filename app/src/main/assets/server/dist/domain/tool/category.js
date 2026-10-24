/**
 * The fixed set of tool categories. Categories are a domain concept: they define
 * how the toolkit is organized and searched, independent of any UI or transport.
 */
export const TOOL_CATEGORIES = [
    "Diagnostics",
    "Session & Client",
    "Execution",
    "Inspection",
    "Actions",
    "Reverse Engineering",
    "Disassembly & Xrefs",
    "Signals & Connections",
    "Metatables & Closures",
    "Remote Spy",
    "Actors & Hidden",
    "Memory Scan",
    "Instrumentation",
    "GUI",
    "Filesystem",
    "Crypt",
    "Drawing",
    "Network",
    "Utility",
    "Intelligence",
    "Semantic Search",
    "Windows",
];
export function isToolCategory(value) {
    return TOOL_CATEGORIES.includes(value);
}
//# sourceMappingURL=category.js.map