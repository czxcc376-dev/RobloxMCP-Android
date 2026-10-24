/** Project a domain {@link RobloxClient} to the AI-facing {@link ClientView}. */
export function toClientView(client) {
    return {
        clientId: client.id,
        username: client.username,
        displayName: client.displayName,
        userId: client.userId,
        placeId: client.placeId,
        executor: client.executor,
        connectedAt: new Date(client.connectedAt).toISOString(),
    };
}
/** Project a domain {@link SelectionResolution} to a JSON-friendly view. */
export function toResolutionView(resolution) {
    switch (resolution.status) {
        case "resolved":
            return { status: "resolved", client: toClientView(resolution.client) };
        case "none":
            return { status: "none", reason: resolution.reason };
        case "ambiguous":
            return { status: "ambiguous", candidates: resolution.candidates.map(toClientView) };
    }
}
//# sourceMappingURL=client-view.js.map