import { z } from "zod";
/**
 * Walks a Zod input schema and surfaces per-field metadata — the field name,
 * its Luau-flavoured type, whether it is optional, and its `.describe()` text.
 *
 * Used in three places:
 *   - the `tool-schema` tool, so a script can introspect any other tool's
 *     argument shape at runtime (`mcp.toolSchema("get-players")`),
 *   - the dashboard's `mcp.d.luau` emitter, to embed per-field doc comments so
 *     editor hover shows the description on each argument,
 *   - the script preflight, when an unknown `mcp.<tool>` has a near-miss it
 *     can surface the suggestion's signature inline.
 *
 * Only top-level fields are walked; nested objects are emitted as compact Luau
 * type expressions via {@link zodToLuauType}.
 */
export interface InputField {
    /** Top-level key on the input object. */
    readonly name: string;
    /** Compact Luau type expression (suffix `?` indicates optional). */
    readonly type: string;
    /** True when the key may be omitted because it is `.optional()` or has a `.default()`. */
    readonly optional: boolean;
    /** True when the field explicitly accepts `nil`/JSON null. */
    readonly nullable: boolean;
    /** Explicit `.describe()` text or a deterministic field-name/type fallback. */
    readonly description: string;
    /** Whether the author supplied the description or the library inferred it. */
    readonly descriptionSource: "explicit" | "inferred";
    /** Schema default when it is safely serializable. */
    readonly defaultValue?: unknown;
    /** Human-readable numeric/string/enum constraints discovered from the schema. */
    readonly constraints: readonly string[];
    /** Deterministic example value used by tool help and validation recovery. */
    readonly example: unknown;
}
export declare function describeInputFields(schema: z.ZodTypeAny): readonly InputField[];
/**
 * Return the original object shape with effective descriptions attached to the
 * outermost field schemas. Zod metadata is immutable, so this does not mutate
 * the validation schema used by the tool. MCP clients therefore see the same
 * inferred help that `tool-schema`, generated Luau types, and validation errors
 * expose, while all defaults/refinements/optional wrappers remain intact.
 */
export declare function documentedInputShape(schema: z.ZodTypeAny): z.ZodRawShape;
/**
 * Produce a one-line Luau-style signature for an input object, e.g.
 * `{ limit: number?, includeBots: boolean? }`. Suitable for inline help or
 * error messages where multi-line per-field detail would be too much.
 */
export declare function inputSignature(schema: z.ZodTypeAny): string;
//# sourceMappingURL=schema-introspect.d.ts.map