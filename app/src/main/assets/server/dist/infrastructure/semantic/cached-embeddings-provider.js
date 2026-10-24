import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
const CACHE_VERSION = 1;
function hashText(text) {
    return createHash("sha256").update(text, "utf8").digest("hex");
}
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
export class CachedEmbeddingsProvider {
    model;
    #inner;
    #path;
    #file;
    #loaded = false;
    /** Lifetime counters surfaced via stats() for diagnostics. */
    hits = 0;
    misses = 0;
    constructor(inner, cachePath) {
        this.#inner = inner;
        this.model = inner.model;
        this.#path = resolve(cachePath ?? join(homedir(), ".executor-mcp", "embeddings.json"));
        this.#file = { version: CACHE_VERSION, byModel: {} };
    }
    get dimensions() {
        return this.#inner.dimensions;
    }
    async embed(texts) {
        if (texts.length === 0)
            return [];
        this.ensureLoaded();
        const modelCache = this.modelTable();
        const out = new Array(texts.length);
        const missIndices = [];
        const missTexts = [];
        const missHashes = [];
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            const key = hashText(text);
            const hit = modelCache[key];
            if (hit) {
                out[i] = hit;
                this.hits += 1;
            }
            else {
                missIndices.push(i);
                missTexts.push(text);
                missHashes.push(key);
            }
        }
        if (missTexts.length > 0) {
            const fresh = await this.#inner.embed(missTexts);
            for (let i = 0; i < missTexts.length; i++) {
                const vec = fresh[i];
                modelCache[missHashes[i]] = vec;
                out[missIndices[i]] = vec;
            }
            this.misses += missTexts.length;
            this.flush();
        }
        return out;
    }
    /** Returns cache hit/miss counters and on-disk size for diagnostics. */
    stats() {
        this.ensureLoaded();
        const entries = Object.keys(this.modelTable()).length;
        let bytesOnDisk = 0;
        try {
            bytesOnDisk = readFileSync(this.#path).byteLength;
        }
        catch {
            // ENOENT or unreadable; bytesOnDisk stays 0
        }
        return { hits: this.hits, misses: this.misses, entries, bytesOnDisk };
    }
    /** Drop all cached vectors for the current model. Writes through to disk. */
    clearCurrentModel() {
        this.ensureLoaded();
        this.#file.byModel[this.model] = {};
        this.flush();
    }
    modelTable() {
        const table = this.#file.byModel[this.model];
        if (table)
            return table;
        const fresh = {};
        this.#file.byModel[this.model] = fresh;
        return fresh;
    }
    ensureLoaded() {
        if (this.#loaded)
            return;
        this.#loaded = true;
        try {
            const raw = readFileSync(this.#path, "utf8");
            const parsed = JSON.parse(raw);
            if (parsed.version === CACHE_VERSION && parsed.byModel && typeof parsed.byModel === "object") {
                this.#file = parsed;
            }
        }
        catch {
            // ENOENT / parse-error: start with an empty cache. Don't propagate.
        }
    }
    flush() {
        try {
            mkdirSync(dirname(this.#path), { recursive: true });
            writeFileSync(this.#path, JSON.stringify(this.#file), "utf8");
        }
        catch {
            // Best-effort; in-memory cache still works. Don't propagate.
        }
    }
}
//# sourceMappingURL=cached-embeddings-provider.js.map