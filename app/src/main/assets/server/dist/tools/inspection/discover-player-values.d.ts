/**
 * Walks the usual hiding spots for "what's my money/xp/score?" — LocalPlayer
 * (esp. leaderstats), PlayerGui, ReplicatedStorage, ReplicatedFirst — and
 * surfaces every Value-class instance with a heuristic score. The AI gets a
 * single ranked list of candidate paths instead of grinding through the tree.
 *
 * The scoring is intentionally simple and explainable:
 *   - Name keyword (money/coin/cash/gold/score/xp/level/...) is the strongest signal.
 *   - leaderstats lives are weighted heavily — it's the canonical Roblox display.
 *   - Numeric kinds (Int/Number) beat String/Bool when keywords match.
 *   - Larger magnitudes get a small bias (scores tend to be big numbers).
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    limit?: number | undefined;
    minScore?: number | undefined;
    extraRoots?: string[] | undefined;
}>;
export default _default;
//# sourceMappingURL=discover-player-values.d.ts.map