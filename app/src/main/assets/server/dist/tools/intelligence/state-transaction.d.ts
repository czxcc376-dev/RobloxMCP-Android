declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "rollback" | "status" | "capture" | "begin" | "commit" | "cleanup";
    targets: {
        path: string;
        properties: string[];
        attributes: string[];
    }[];
    captureCamera: boolean;
    cleanupItems: ({
        kind: "drawing";
        id: number;
    } | {
        kind: "virtual-input";
        inputType: "key" | "touch" | "mouse-button" | "gamepad-button";
        button: "Left" | "Right" | "Middle";
        touchId: number;
        gamepad: "Gamepad1" | "Gamepad2" | "Gamepad3" | "Gamepad4";
        key?: string | undefined;
        x?: number | undefined;
        y?: number | undefined;
    } | {
        kind: "connection";
        expression: string;
        rollbackAction: "disconnect" | "restore-state";
    } | {
        kind: "hook";
        key: string;
    })[];
    limit: number;
    cleanupMode: "rollback" | "discard";
    includeOrphans: boolean;
    transactionId?: string | undefined;
    name?: string | undefined;
    maxItems?: number | undefined;
    expirySeconds?: number | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=state-transaction.d.ts.map