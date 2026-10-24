/**
 * Shared helpers for the metatable / closure / environment toolkit.
 *
 * These tools operate BY REFERENCE: you give a Luau expression that evaluates to
 * the target (a table/instance/userdata for metatable tools, a function for
 * closure tools), and the tool inspects or mutates it directly. This complements
 * the gc-scan tools (which find functions across the whole GC).
 *
 * Every tool prepends REFLECT_PRELUDE, which defines guarded helpers:
 *   __eval(expr)        -> value | nil, err     (evaluates `return <expr>`)
 *   __evalFn(expr)      -> fn | nil, err         (must resolve to a function)
 *   __encVal(v)         -> serializable scalar/string
 *   __fnInfo(fn)        -> { IsLua, IsC, Name, Source, ShortSource, LineDefined,
 *                            NumParams, IsVararg, NumUpvalues, Pointer }
 * plus localized capability handles (__getrawmt, __getconstants, …) that are nil
 * when the executor lacks them, so tools can report a clean { error }.
 */
import { z } from "zod";
import { q } from "./luau.js";
export { q };
export declare const REFLECT_PRELUDE = "\nlocal __hasDebug = type(debug) == \"table\"\nlocal __d = __hasDebug and debug or {}\nlocal __getrawmt = getrawmetatable\nlocal __getinfo = (type(getinfo) == \"function\" and getinfo) or __d.getinfo or __d.info\nlocal __getconstants = getconstants or __d.getconstants\nlocal __getupvalues = getupvalues or __d.getupvalues\nlocal __getprotos = getprotos or __d.getprotos\nlocal __islclosure = islclosure\nlocal __iscclosure = iscclosure\n\nlocal function __encVal(v)\n  local t = typeof(v)\n  if t == \"Instance\" then local ok,n = pcall(function() return v:GetFullName() end); return ok and (\"Instance: \" .. n) or \"<Instance>\" end\n  if t == \"string\" or t == \"number\" or t == \"boolean\" then return v end\n  if t == \"nil\" then return \"nil\" end\n  if t == \"function\" then return \"function: \" .. tostring(v) end\n  if t == \"table\" then return \"table: \" .. tostring(v) end\n  local ok, s = pcall(tostring, v); return ok and (t .. \": \" .. tostring(s)) or (\"<\" .. t .. \">\")\nend\n\nlocal function __eval(expr)\n  local fn, cerr = loadstring(\"return \" .. expr)\n  if not fn then return nil, \"compile error in expression: \" .. tostring(cerr) end\n  local ok, val = pcall(fn)\n  if not ok then return nil, \"error evaluating expression: \" .. tostring(val) end\n  return val, nil\nend\n\nlocal function __evalFn(expr)\n  local val, err = __eval(expr)\n  if err then return nil, err end\n  if type(val) ~= \"function\" then return nil, \"expression did not resolve to a function (got \" .. typeof(val) .. \"): \" .. expr end\n  return val, nil\nend\n\nlocal function __fnInfo(f)\n  if type(f) ~= \"function\" then return nil end\n  local r = {\n    Pointer = tostring(f),\n    IsLua = (type(__islclosure) == \"function\") and (pcall(__islclosure, f) and __islclosure(f)) or nil,\n    IsC = (type(__iscclosure) == \"function\") and (pcall(__iscclosure, f) and __iscclosure(f)) or nil,\n    Name = \"\", Source = \"\", ShortSource = \"\", LineDefined = -1, NumParams = -1, IsVararg = false, NumUpvalues = -1,\n  }\n  if type(__getinfo) == \"function\" then\n    local okT, info = pcall(__getinfo, f, \"nSlu\")\n    if okT and type(info) == \"table\" then\n      r.Name = info.name or r.Name\n      r.Source = info.source or r.Source\n      r.ShortSource = info.short_src or r.ShortSource\n      r.LineDefined = info.linedefined or r.LineDefined\n      r.NumParams = info.nparams or r.NumParams\n      r.IsVararg = info.isvararg == true\n      r.NumUpvalues = info.nups or r.NumUpvalues\n    else\n      local okS, s = pcall(__getinfo, f, \"s\"); if okS and type(s) ~= \"table\" and s ~= nil then r.Source = tostring(s) end\n      local okL, l = pcall(__getinfo, f, \"l\"); if okL and type(l) == \"number\" then r.LineDefined = l end\n      local okA, a = pcall(__getinfo, f, \"a\"); if okA and type(a) == \"number\" then r.NumParams = a end\n      local okN, n = pcall(__getinfo, f, \"n\"); if okN and type(n) ~= \"table\" and n ~= nil then r.Name = tostring(n) end\n    end\n  end\n  return r\nend\n";
/**
 * Build a single Luau value expression from a structured argument used by the
 * mutating tools (set-closure-upvalue / set-closure-constant / set-rawmetatable).
 *   { kind: "string"|"number"|"boolean", value }
 *   { kind: "nil" }
 *   { kind: "raw", value: "<Luau expression>" }   (e.g. "true", "Vector3.new(0,0,0)", "game.Workspace")
 */
export interface ValueArg {
    kind: "string" | "number" | "boolean" | "nil" | "raw";
    value?: string | number | boolean;
}
export declare function buildValueExpr(arg: ValueArg): string;
/**
 * Zod schema for a typed value argument accepted by the mutating reflection
 * tools. Mirrors {@link ValueArg}: a discriminator `kind` plus an optional
 * `value` (string/number/boolean) interpreted per kind by {@link buildValueExpr}.
 */
export declare const valueArgSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        nil: "nil";
        raw: "raw";
    }>;
    value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
}, z.core.$strip>;
//# sourceMappingURL=reflection.d.ts.map