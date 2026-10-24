import type { EmbeddingsProvider } from "../../application/ports/embeddings-provider.js";
/**
 * Wraps another {@link EmbeddingsProvider} with a sha256-keyed on-disk cache so
 * a place's script bodies only have to be embedded once. A 5,000-script place
 * that took ~2 minutes to warm up on first connect re-warms in under a second
 * on subsequent runs — only the *new* scripts hit the underlying provider.
 *
 * The cache is partitioned by model name, so switching from `local-hash` to
 * `embeddinggemma` doesn't poison cached vectors of incompatible dimension.
 * Writes are batched (one fsync per embed() call), not per-entry.
 */
export declare class CachedEmbeddingsProvider implements EmbeddingsProvider {
    #private;
    readonly model: string;
    /** Lifetime counters surfaced via stats() for diagnostics. */
    private hits;
    private misses;
    constructor(inner: EmbeddingsProvider, cachePath?: string);
    get dimensions(): number | null;
    embed(texts: readonly string[]): Promise<number[][]>;
    /** Returns cache hit/miss counters and on-disk size for diagnostics. */
    stats(): {
        hits: number;
        misses: number;
        entries: number;
        bytesOnDisk: number;
    };
    /** Drop all cached vectors for the current model. Writes through to disk. */
    clearCurrentModel(): void;
    private modelTable;
    private ensureLoaded;
    private flush;
}
//# sourceMappingURL=cached-embeddings-provider.d.ts.map