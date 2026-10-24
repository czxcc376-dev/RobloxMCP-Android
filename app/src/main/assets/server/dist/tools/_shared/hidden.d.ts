/**
 * Shared helpers for the "Actors & Hidden" toolkit — tools that surface things
 * which try to hide: scripts running inside Actors (parallel Luau VMs), instances
 * parented to nil, scripts detached from the game tree, hidden GUIs, etc.
 *
 * Every tool builds a Luau snippet (run via ctx.runLuau) and prepends
 * HIDDEN_PRELUDE. All helpers are fully pcall-guarded so a single weird instance
 * never aborts a whole-game scan. The canonical {@link q} (JSON-quote a string
 * into a Luau-legal literal) lives in ./luau.js and is re-exported here for
 * convenience, so consumers of this prelude have a single import.
 */
import { q } from "./luau.js";
export { q };
export declare const HIDDEN_PRELUDE = "\nlocal __H = game:GetService(\"HttpService\")\n\nlocal function __name(inst)\n  local ok, n = pcall(function() return inst.Name end)\n  return ok and tostring(n) or \"?\"\nend\nlocal function __class(inst)\n  local ok, c = pcall(function() return inst.ClassName end)\n  return ok and c or \"?\"\nend\nlocal function __parent(inst)\n  local ok, p = pcall(function() return inst.Parent end)\n  if ok then return p end\n  return nil\nend\nlocal function __fullName(inst)\n  local ok, n = pcall(function() return inst:GetFullName() end)\n  if ok then return n end\n  return \"<\" .. __class(inst) .. \" \" .. __name(inst) .. \">\"\nend\n-- Reachable from the DataModel (game)? If not, it is detached / hidden.\nlocal function __inTree(inst)\n  local cur = inst\n  for _ = 1, 128 do\n    if cur == game then return true end\n    local p = __parent(cur)\n    if p == nil then return false end\n    cur = p\n  end\n  return false\nend\nlocal function __isA(inst, cls)\n  local ok, r = pcall(function() return inst:IsA(cls) end)\n  return ok and r\nend\nlocal function __ancestorActor(inst)\n  local ok, a = pcall(function() return inst:FindFirstAncestorOfClass(\"Actor\") end)\n  if ok and a then return a end\n  return nil\nend\n-- Where does this instance \"live\"? Used to explain how something is hidden.\nlocal function __location(inst)\n  local par = __parent(inst)\n  if par == nil then return \"nil-parented\" end\n  if not __inTree(inst) then return \"detached (not under game)\" end\n  local actor = __ancestorActor(inst)\n  if actor then return \"inside Actor: \" .. __fullName(actor) end\n  local okCore, cg = pcall(function() return game:GetService(\"CoreGui\") end)\n  if okCore and cg and __isA(inst, \"Instance\") then\n    local cur = inst\n    for _ = 1, 64 do if cur == cg then return \"CoreGui\" end; cur = __parent(cur); if cur == nil then break end end\n  end\n  return \"in tree\"\nend\n";
//# sourceMappingURL=hidden.d.ts.map