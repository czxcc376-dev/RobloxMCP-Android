import type { SavedScript, SavedScriptsStore } from "../../application/ports/saved-scripts.js";
/**
 * Files under `~/.executor-mcp/playbooks/<name>.json`. One JSON document per
 * playbook keeps the format greppable and easy to share — no DB to manage.
 * Filenames are validated so a `name` can never escape the playbook dir.
 */
export declare class FsSavedScriptsStore implements SavedScriptsStore {
    private readonly dir;
    constructor(dir?: string);
    private pathFor;
    save(script: SavedScript): Promise<SavedScript>;
    get(name: string): Promise<SavedScript | null>;
    list(filter?: {
        tag?: string;
    }): Promise<readonly SavedScript[]>;
    delete(name: string): Promise<boolean>;
    private readOne;
}
//# sourceMappingURL=fs-saved-scripts.d.ts.map