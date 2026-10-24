/**
 * Tiny, pure string helpers for building Luau source from a tool. Tools that
 * interpolate user-supplied strings into a chunk MUST funnel them through
 * {@link q} so a stray quote, newline, or control character can never break the
 * chunk (or worse, inject Luau). These are deliberately dependency-free and
 * trivially unit-testable.
 */
/**
 * Quote an arbitrary string as a Luau string literal.
 *
 * `JSON.stringify` already produces a double-quoted literal with the exact escape
 * set Luau understands (`\"`, `\\`, `\n`, `\t`, `\r`, `\b`, `\f`), so it is a
 * sound base. The one mismatch is control characters, which JSON escapes as
 * `\uXXXX` (four hex digits, no braces) — a form Luau does NOT accept. Luau spells
 * the same code point `\u{XXXX}` (braced). We rewrite every `\uXXXX` to `\u{XXXX}`
 * so control chars survive intact instead of producing a malformed chunk.
 *
 * @example q('a"b\n')  // => "\"a\\\"b\\n\""  (a valid Luau literal)
 */
export declare function q(value: string): string;
/**
 * Shared Luau prelude exposing a single safe helper, `__encode`, that turns any
 * Luau value into a stable, JSON-friendly form before it is returned. The bridge
 * JSON-encodes the first returned value, but raw Roblox types (Instance, Vector3,
 * CFrame, functions, …) are not JSON-serializable; `__encode` flattens them to
 * strings / plain tables so results never silently drop fields. Every read is
 * pcall-guarded, so a misbehaving __tostring metamethod can't abort the chunk.
 *
 * Prepend this to a chunk, then call `__encode(value)` on anything you return.
 */
export declare const PRELUDE = "\nlocal function __encode(value, depth)\n  depth = depth or 0\n  local t = typeof(value)\n  if t == \"nil\" or t == \"boolean\" or t == \"number\" or t == \"string\" then\n    return value\n  elseif t == \"Instance\" then\n    local ok, full = pcall(function() return value:GetFullName() end)\n    return { __type = \"Instance\", className = value.ClassName, path = ok and full or tostring(value) }\n  elseif t == \"EnumItem\" then\n    return { __type = \"EnumItem\", value = tostring(value) }\n  elseif t == \"table\" then\n    if depth >= 5 then return \"<table:max-depth>\" end\n    local out = {}\n    local okIter = pcall(function()\n      for k, v in pairs(value) do\n        out[tostring(k)] = __encode(v, depth + 1)\n      end\n    end)\n    if not okIter then return \"<table:unreadable>\" end\n    return out\n  else\n    local ok, s = pcall(function() return tostring(value) end)\n    return { __type = t, value = ok and s or \"<unprintable>\" }\n  end\nend\n";
/**
 * Resolver prelude: defines `__resolve(path)` which walks a dotted instance path
 * (e.g. `game.Workspace.Part`) from a sensible root (game / workspace / a service)
 * and returns `(instance, err)`. Every hop is pcall-guarded and falls back to
 * `FindFirstChild`, so a missing segment yields a precise error string instead of
 * throwing. Used by the inspection tools. Depends on nothing else.
 */
export declare const RESOLVE_PRELUDE = "\nlocal function __resolve(p)\n  local segments = {}\n  for seg in string.gmatch(p, \"[^%.]+\") do\n    segments[#segments + 1] = seg\n  end\n  if #segments == 0 then return nil, \"Empty path\" end\n\n  local first = segments[1]\n  local current\n  if first == \"game\" or first == \"Game\" then\n    current = game\n  elseif first == \"workspace\" or first == \"Workspace\" then\n    current = workspace\n  else\n    local ok, svc = pcall(function() return game:GetService(first) end)\n    if ok and svc then\n      current = svc\n    else\n      local ok2, child = pcall(function() return game:FindFirstChild(first) end)\n      if ok2 and child then current = child end\n    end\n  end\n  if not current then\n    return nil, \"Could not resolve root segment '\" .. tostring(first) .. \"'\"\n  end\n\n  for i = 2, #segments do\n    local name = segments[i]\n    local ok, nxt = pcall(function() return (current :: any)[name] end)\n    if not ok or nxt == nil then\n      local ok2, child = pcall(function() return current:FindFirstChild(name) end)\n      if ok2 and child then\n        nxt = child\n      else\n        return nil, \"Path segment '\" .. tostring(name) .. \"' not found under '\" .. tostring(current) .. \"'\"\n      end\n    end\n    current = nxt\n  end\n  return current\nend\n";
//# sourceMappingURL=luau.d.ts.map