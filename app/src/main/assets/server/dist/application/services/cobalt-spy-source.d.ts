export type CobaltOperation = "start" | "restart" | "stop" | "status" | "logs" | "list" | "clear" | "control" | "configure" | "pause" | "resume" | "controls" | "reset-controls" | "view-start" | "view-fetch" | "view-stop" | "code";
export interface CobaltSpyOptions {
    mode?: "auto" | "luau" | "raknet";
    max?: number;
    limit?: number;
    afterId?: number;
    direction?: "Incoming" | "Outgoing" | "Both";
    remotePath?: string;
    remoteId?: string;
    nameFilter?: string;
    method?: string;
    raknetOnly?: boolean;
    summaryOnly?: boolean;
    control?: "block" | "ignore";
    enabled?: boolean;
    view?: string;
    callId?: number;
    classFilter?: "RemoteEvent" | "UnreliableRemoteEvent" | "RemoteFunction";
    blockedOnly?: boolean;
    offset?: number;
    resetControl?: "block" | "ignore" | "Both";
    capture?: {
        enabled?: boolean;
        direction?: "Incoming" | "Outgoing" | "Both";
        nameFilter?: string;
        method?: string;
        classFilter?: "RemoteEvent" | "UnreliableRemoteEvent" | "RemoteFunction";
        blockedOnly?: boolean;
    };
    resetFilters?: boolean;
    guiVisible?: boolean;
    guiLogging?: boolean;
}
/** Shared bounded recorder; each backend owns its game hooks. */
export declare function buildCobaltSpySource(operation: CobaltOperation, options?: CobaltSpyOptions): string;
/** Both backends expose capture observers, controls, code generation, and unload. */
export declare function buildCaptureSpySource(operation: CobaltOperation, options: CobaltSpyOptions, engineName: "Cobalt" | "Ketamine", bundle: string, version: string): string;
export declare const COBALT_ADAPTER: string;
//# sourceMappingURL=cobalt-spy-source.d.ts.map