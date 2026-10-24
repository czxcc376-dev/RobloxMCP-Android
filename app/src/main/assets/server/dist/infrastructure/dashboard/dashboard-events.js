import { EventEmitter } from "node:events";
export class DashboardEventBus {
    emitter = new EventEmitter();
    constructor() {
        // Per-event-name listener cap is plenty for the dashboard fan-out; the
        // default of 10 fires a warning we don't need.
        this.emitter.setMaxListeners(64);
    }
    emitOutput(entries) {
        if (entries.length === 0)
            return;
        this.emitter.emit("dashboard", { type: "output", entries });
    }
    emitActivity(record) {
        this.emitter.emit("dashboard", { type: "activity", record });
    }
    emitClientChange(action, clientId) {
        this.emitter.emit("dashboard", { type: "client-change", action, clientId });
    }
    subscribe(listener) {
        this.emitter.on("dashboard", listener);
        return () => this.emitter.off("dashboard", listener);
    }
}
//# sourceMappingURL=dashboard-events.js.map