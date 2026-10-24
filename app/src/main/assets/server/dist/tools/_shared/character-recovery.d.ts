/**
 * Reusable guidance for games whose player avatar is custom, delayed, hidden,
 * or not represented by the standard LocalPlayer.Character hierarchy.
 */
export declare const CHARACTER_RECOVERY_SCRIPT = "\nlocal Players = game:GetService(\"Players\")\nlocal localPlayer = Players.LocalPlayer\nlocal character = localPlayer and localPlayer.Character\nlocal function pathOf(instance)\n  local ok, value = pcall(function() return instance:GetFullName() end)\n  return ok and value or tostring(instance)\nend\nlocal function first(root, names)\n  if not root then return nil end\n  for _, name in ipairs(names) do\n    local found = root:FindFirstChild(name, true)\n    if found then return found end\n  end\n  return nil\nend\nlocal humanoid = character and character:FindFirstChildOfClass(\"Humanoid\")\nlocal root = first(character, { \"HumanoidRootPart\", \"RootPart\", \"LowerTorso\", \"Torso\" })\nif not root and character and character:IsA(\"Model\") then root = character.PrimaryPart end\nreturn {\n  player = localPlayer and localPlayer.Name or nil,\n  character = character and pathOf(character) or nil,\n  humanoid = humanoid and pathOf(humanoid) or nil,\n  humanoidRootPart = root and pathOf(root) or nil,\n  customCharacter = character ~= nil and (humanoid == nil or root == nil) or false,\n}\n";
export interface CharacterRecoveryNotice {
    readonly status: "missing-or-custom";
    readonly message: string;
    readonly missing: readonly string[];
    readonly nextTools: readonly string[];
    readonly recommendedScript: string;
}
export declare function characterRecoveryNotice(missing: readonly string[]): CharacterRecoveryNotice;
//# sourceMappingURL=character-recovery.d.ts.map