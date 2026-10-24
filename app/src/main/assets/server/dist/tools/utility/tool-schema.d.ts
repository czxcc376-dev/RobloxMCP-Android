/**
 * Returns the full input schema and a compact Luau-flavored signature for one
 * (or every) tool on this server. The point is in-script introspection: from
 * inside a `script` body the agent (or the user) can run
 * `mcp.toolSchema({ name = "get-players" })` and see exactly what arguments
 * the tool accepts, with the same shape the dashboard's `/api/tools/schema`
 * endpoint returns plus a one-line signature for prompts/errors.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    name?: string | undefined;
    search?: string | undefined;
    category?: string | undefined;
}>;
export default _default;
//# sourceMappingURL=tool-schema.d.ts.map