import type { AppConfig } from "../../application/ports/config.js";
import type { EmbeddingsProvider } from "../../application/ports/embeddings-provider.js";
/**
 * Default {@link EmbeddingsProvider}. When `embeddingsUrl` is configured it POSTs
 * to an external embeddings service (Ollama or OpenAI-compatible) via global
 * `fetch`. When no URL is configured it falls back to a deterministic, dependency-
 * free local embedding so semantic search degrades gracefully instead of failing.
 *
 * The local embedding hashes each lowercased word token of a text into a fixed
 * {@link LOCAL_DIMENSIONS}-wide vector and L2-normalizes it, which makes cosine
 * similarity between two texts meaningful (shared tokens raise the dot product).
 */
export declare class HttpEmbeddingsProvider implements EmbeddingsProvider {
    #private;
    readonly model: string;
    constructor(config: AppConfig["semantic"]);
    get dimensions(): number | null;
    embed(texts: readonly string[]): Promise<number[][]>;
}
//# sourceMappingURL=http-embeddings-provider.d.ts.map