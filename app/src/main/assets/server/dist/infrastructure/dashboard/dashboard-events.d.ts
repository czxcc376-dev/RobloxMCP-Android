import type { ActivityRecord } from "../../application/ports/activity-log.js";
import type { OutputEntry } from "../../application/ports/output-log.js";
/**
 * In-process event bus that the dashboard's WebSocket adapter subscribes to.
 *
 * Sources (ActivityLog, OutputLog, BridgeServer) call `emit*` when state
 * changes; subscribers receive typed payloads and forward them to connected
 * dashboard clients as JSON frames. Coalescing/throttling is the subscriber's
 * responsibility — the bus itself is fire-and-forget.
 */
export type DashboardEvent = {
    readonly type: "output";
    readonly entries: readonly OutputEntry[];
} | {
    readonly type: "activity";
    readonly record: ActivityRecord;
} | {
    readonly type: "client-change";
    readonly action: "connect" | "disconnect";
    readonly clientId: string;
};
export declare class DashboardEventBus {
    private readonly emitter;
    constructor();
    emitOutput(entries: readonly OutputEntry[]): void;
    emitActivity(record: ActivityRecord): void;
    emitClientChange(action: "connect" | "disconnect", clientId: string): void;
    subscribe(listener: (event: DashboardEvent) => void): () => void;
}
//# sourceMappingURL=dashboard-events.d.ts.map