import type { HostFileSystem } from "../../application/ports/host-file-system.js";
/**
 * Filesystem adapter that confines every read to an allow-list of roots. Each
 * input path is resolved to an absolute, symlink-free real path and rejected
 * (with a {@link ConfigError}) unless it is equal to, or nested under, one of the
 * configured roots.
 *
 * The realpath step is what defends against symlink escape: a symlink planted
 * inside an allowed root that points elsewhere resolves to its true target
 * before the containment check, so it can never read outside the allow-list.
 * Roots are canonicalized per call too, so a symlinked root still matches.
 */
export declare class SandboxedHostFileSystem implements HostFileSystem {
    /** The roots as configured (absolute, normalized) for diagnostics + matching. */
    private readonly roots;
    constructor(allowedRoots: readonly string[]);
    get allowedRoots(): readonly string[];
    readText(path: string): Promise<string>;
    list(path: string): Promise<readonly string[]>;
    exists(path: string): Promise<boolean>;
    /**
     * Resolve an input path to an absolute real path and assert it lies inside one
     * of the allowed roots. Throws {@link ConfigError} on any rejection: a path
     * that does not exist, a symlink that escapes, or a path outside the allow-list.
     */
    private resolveWithinRoots;
    /** Canonicalize each configured root; a missing root falls back to its absolute form. */
    private canonicalRoots;
}
//# sourceMappingURL=sandboxed-file-system.d.ts.map