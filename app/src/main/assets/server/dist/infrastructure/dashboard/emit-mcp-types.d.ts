import type { ToolRegistry } from "../../application/tool/registry.js";
/**
 * Emit a full `mcp.d.luau` declaration from the live tool registry. The result
 * is consumable by Luau LSP — operators can drop it next to their scripts and
 * get autocomplete + hover on `mcp.<tool>(args)` everywhere, not just in the
 * in-browser REPL.
 *
 * Each tool's input Zod schema is converted to a Luau type alias; the `mcp`
 * table is then declared as a record of `(args: <Input>?) -> any` callables.
 */
export declare function emitMcpLuauTypes(registry: ToolRegistry): string;
//# sourceMappingURL=emit-mcp-types.d.ts.map