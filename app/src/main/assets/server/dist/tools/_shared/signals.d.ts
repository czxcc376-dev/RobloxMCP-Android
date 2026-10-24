/**
 * Shared helpers for the signal/connection toolkit.
 *
 * Every tool in this folder builds a Luau snippet that runs in the Roblox client
 * and returns a serializable table. To stay consistent and robust they all
 * prepend SIGNAL_PRELUDE, which defines a small library of guarded helpers:
 *
 *   __resolveInstance(expr)        -> inst | nil, err
 *   __resolveSignal(expr, name)    -> sig, inst | nil, err   (name "" => expr IS the signal)
 *   __getConns(sig)                -> conns | nil, err
 *   __describeFunction(fn)         -> { Name, Source, ShortSource, LineDefined, NumParams, IsVararg, What, Pointer }
 *   __connInfo(conn, index, withFn)-> info, fn
 *   __encVal(v)                    -> serializable scalar/string
 *
 * The function-description logic mirrors the proven approach in
 * trace-connection-function (debug.info "nSlu" table form, then a
 * field-by-field fallback) so behaviour matches the existing tools.
 */
import { q } from "./luau.js";
export { q };
export declare const SIGNAL_PRELUDE = "\nlocal __getconnectionsFn = getconnections\nlocal __hasDebug = type(debug) == \"table\"\nlocal __debugInfoFn = __hasDebug and (debug.info or debug.getinfo) or nil\n\nlocal function __encVal(v)\n  local t = typeof(v)\n  if t == \"Instance\" then local ok,n = pcall(function() return v:GetFullName() end); return ok and n or \"<Instance>\" end\n  if t == \"string\" or t == \"number\" or t == \"boolean\" then return v end\n  if t == \"nil\" then return \"nil\" end\n  local ok, s = pcall(tostring, v); return ok and (t .. \": \" .. tostring(s)) or (\"<\" .. t .. \">\")\nend\n\nlocal function __describeFunction(f)\n  if type(f) ~= \"function\" then return nil end\n  local result = { Name = \"<anonymous>\", Source = \"\", ShortSource = \"\", LineDefined = -1, NumParams = -1, IsVararg = false, What = \"?\", Pointer = tostring(f) }\n  if type(__debugInfoFn) ~= \"function\" then return result end\n  local okTbl, infoTbl = pcall(__debugInfoFn, f, \"nSlu\")\n  if okTbl and type(infoTbl) == \"table\" then\n    result.Name = infoTbl.name or result.Name\n    result.Source = infoTbl.source or result.Source\n    result.ShortSource = infoTbl.short_src or result.ShortSource\n    result.LineDefined = infoTbl.linedefined or result.LineDefined\n    result.NumParams = infoTbl.nparams or result.NumParams\n    result.IsVararg = infoTbl.isvararg == true\n    result.What = infoTbl.what or result.What\n    return result\n  end\n  local okN, n = pcall(__debugInfoFn, f, \"n\"); if okN and type(n) ~= \"table\" and n ~= nil then result.Name = tostring(n) end\n  local okS, s = pcall(__debugInfoFn, f, \"s\"); if okS and type(s) ~= \"table\" and s ~= nil then result.Source = tostring(s) end\n  local okL, l = pcall(__debugInfoFn, f, \"l\"); if okL and type(l) == \"number\" then result.LineDefined = l end\n  local okA, a = pcall(__debugInfoFn, f, \"a\"); if okA and type(a) == \"number\" then result.NumParams = a end\n  return result\nend\n\nlocal function __resolveInstance(expr)\n  local ok, inst = pcall(function() return (loadstring(\"return \" .. expr))() end)\n  if not ok then return nil, \"Failed to evaluate path: \" .. tostring(inst) end\n  if typeof(inst) ~= \"Instance\" then return nil, \"Path did not resolve to an Instance (got \" .. typeof(inst) .. \"): \" .. expr end\n  return inst, nil\nend\n\n-- Resolve a signal. If signalName is nil/\"\" the expr itself must be the RBXScriptSignal.\nlocal function __resolveSignal(expr, signalName)\n  if signalName == nil or signalName == \"\" then\n    local ok, sig = pcall(function() return (loadstring(\"return \" .. expr))() end)\n    if not ok then return nil, nil, \"Failed to evaluate signal expression: \" .. tostring(sig) end\n    if typeof(sig) ~= \"RBXScriptSignal\" then return nil, nil, \"Expression is not an RBXScriptSignal (got \" .. typeof(sig) .. \"): \" .. expr end\n    return sig, nil, nil\n  end\n  local inst, err = __resolveInstance(expr)\n  if not inst then return nil, nil, err end\n  local okSig, sig = pcall(function() return inst[signalName] end)\n  if not okSig then return nil, inst, \"Failed to access member '\" .. signalName .. \"' on \" .. inst:GetFullName() .. \": \" .. tostring(sig) end\n  if typeof(sig) ~= \"RBXScriptSignal\" then return nil, inst, \"Member '\" .. signalName .. \"' is not an RBXScriptSignal (got \" .. typeof(sig) .. \").\" end\n  return sig, inst, nil\nend\n\nlocal function __getConns(sig)\n  if type(__getconnectionsFn) ~= \"function\" then return nil, \"getconnections is not available in this executor.\" end\n  local ok, conns = pcall(__getconnectionsFn, sig)\n  if not ok or type(conns) ~= \"table\" then return nil, \"getconnections failed: \" .. tostring(conns) end\n  return conns, nil\nend\n\nlocal function __connInfo(conn, index, withFn)\n  local info = { Index = index }\n  local function g(k) local ok, v = pcall(function() return conn[k] end); if ok then return v end return nil end\n  info.Enabled = g(\"Enabled\")\n  info.LuaConnection = g(\"LuaConnection\")\n  info.ForeignState = g(\"ForeignState\")\n  local fn = g(\"Function\")\n  info.HasFunction = type(fn) == \"function\"\n  local th = g(\"Thread\")\n  info.HasThread = th ~= nil\n  if th ~= nil then\n    local okS, st = pcall(function() return coroutine.status(th) end)\n    if okS then info.ThreadStatus = st end\n  end\n  if withFn and type(fn) == \"function\" then\n    info.Function = __describeFunction(fn)\n  end\n  return info, fn\nend\n";
/**
 * Build a Luau literal arg-list from a structured arguments array, for the
 * firing tools (fire-signal / replicate-signal / fire-connection).
 * Each element is one of:
 *   { kind: "string"|"number"|"boolean", value }
 *   { kind: "nil" }
 *   { kind: "instance", value: "game.Workspace.Part" }   (resolved at runtime)
 *   { kind: "raw", value: "Vector3.new(1,2,3)" }          (raw Luau expression)
 * Returns a string like `arg1, arg2, ...` plus the preamble that defines them,
 * so callers can splice it into a firesignal(...) call.
 */
export interface SignalArg {
    kind: "string" | "number" | "boolean" | "nil" | "instance" | "raw";
    value?: string | number | boolean;
}
export declare function buildArgList(args: SignalArg[] | undefined): {
    preamble: string;
    argExpr: string;
};
//# sourceMappingURL=signals.d.ts.map