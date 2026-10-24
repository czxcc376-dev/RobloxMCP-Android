import type { ClientId } from "../../domain/shared/ids.js";
import type { EmbeddingsProvider } from "../../application/ports/embeddings-provider.js";
import type { SemanticDocument, SemanticHit, SemanticIndex, SemanticStats } from "../../application/ports/semantic-index.js";
/**
 * Process-scoped {@link SemanticIndex}. Holds, per client, a cache of embedded
 * documents keyed by content hash, so re-searching an unchanged set of scripts
 * never re-embeds them. Embedding is delegated to the injected
 * {@link EmbeddingsProvider}; scoring is cosine similarity over the cached vectors.
 *
 * The caller supplies the current document set on every search: documents new to
 * the cache are embedded (batched), documents that have disappeared are evicted,
 * and the query is embedded once to rank everything that remains.
 */
export declare class InMemorySemanticIndex implements SemanticIndex {
    #private;
    constructor(deps: {
        embeddings: EmbeddingsProvider;
    });
    search(clientId: ClientId, query: string, limit: number, documents: readonly SemanticDocument[]): Promise<readonly SemanticHit[]>;
    stats(clientId: ClientId): SemanticStats;
    clear(clientId: ClientId): void;
}
//# sourceMappingURL=in-memory-semantic-index.d.ts.map