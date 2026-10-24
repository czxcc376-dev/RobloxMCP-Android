/** True when both clients are the same Roblox account (stable identity). */
export function isSameAccount(a, b) {
    if (a.userId !== null && b.userId !== null)
        return a.userId === b.userId;
    if (a.username !== null && b.username !== null) {
        return a.username.toLowerCase() === b.username.toLowerCase();
    }
    return a.id === b.id;
}
//# sourceMappingURL=client.js.map