declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "stop" | "status" | "start" | "poll";
    cursor: number;
    limit: number;
    maxEvents: number;
    ttlSeconds: number;
    throttleMs: number;
    coalesceWindowMs: number;
    filters: {
        sources?: ("camera" | "character" | "workspace" | "playerGui" | "backpack" | "watched")[] | undefined;
        eventKinds?: ("workspace-descendant-added" | "workspace-descendant-removing" | "player-gui-descendant-added" | "player-gui-descendant-removing" | "player-gui-replaced" | "character-added" | "character-removing" | "character-tool-added" | "character-tool-removing" | "camera-replaced" | "camera-property-changed" | "backpack-replaced" | "backpack-tool-added" | "backpack-tool-removing" | "watched-property-changed")[] | undefined;
        classes?: string[] | undefined;
        nameContains?: string | undefined;
        pathContains?: string | undefined;
    };
    cameraProperties: string[];
    watchedProperties: {
        instancePath: string;
        properties: string[];
    }[];
    observerId?: string | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=world-delta.d.ts.map