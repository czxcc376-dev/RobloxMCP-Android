import type { RobloxClient } from "../../domain/client/client.js";
import type { SelectionResolution } from "../../domain/client/selection.js";
/** The stable, AI-facing shape of a connected client. One place defines it. */
export interface ClientView {
    readonly clientId: string;
    readonly username: string | null;
    readonly displayName: string | null;
    readonly userId: number | null;
    readonly placeId: number | null;
    readonly executor: string | null;
    readonly connectedAt: string;
}
/** Project a domain {@link RobloxClient} to the AI-facing {@link ClientView}. */
export declare function toClientView(client: RobloxClient): ClientView;
/** The AI-facing shape of a selection resolution (which client a session targets). */
export type ResolutionView = {
    readonly status: "resolved";
    readonly client: ClientView;
} | {
    readonly status: "none";
    readonly reason: "no-clients" | "selection-offline";
} | {
    readonly status: "ambiguous";
    readonly candidates: readonly ClientView[];
};
/** Project a domain {@link SelectionResolution} to a JSON-friendly view. */
export declare function toResolutionView(resolution: SelectionResolution): ResolutionView;
//# sourceMappingURL=client-view.d.ts.map