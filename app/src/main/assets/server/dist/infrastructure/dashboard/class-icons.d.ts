/**
 * Real Roblox Studio explorer icons, keyed by ClassName -> sprite index.
 *
 * Built from Roblox Studio's `ReflectionMetadata.xml` (`ExplorerImageIndex` per
 * class) and the API dump's class hierarchy: each class resolves to the nearest
 * ancestor that defines an icon. Classes not listed here fall back to icon 0
 * (Studio's generic default) in the dashboard, so every instance gets a real
 * Studio icon. The matching sprite strip ships at `assets/class-icons.png` and
 * is served at `/assets/class-icons.png` (16px-tall row of 16x16 icons; a
 * class's icon is the sub-rect at `x = index * 16`).
 */
export declare const CLASS_ICON_SIZE = 16;
export declare const CLASS_ICON_INDEX: Record<string, number>;
//# sourceMappingURL=class-icons.d.ts.map