export function createSession(id, label) {
    return { id, label, selection: {} };
}
export function withSelection(session, selection) {
    return { ...session, selection };
}
export function clearSelection(session) {
    return { ...session, selection: {} };
}
//# sourceMappingURL=session.js.map