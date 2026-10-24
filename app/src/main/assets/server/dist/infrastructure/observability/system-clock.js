import { performance } from "node:perf_hooks";
/**
 * The production {@link Clock}: wall-clock time from `Date.now()` and monotonic
 * time from `performance.now()` (which never runs backwards, even across NTP
 * adjustments). Tests inject a fake clock instead.
 */
export const systemClock = {
    now() {
        return Date.now();
    },
    monotonic() {
        return performance.now();
    },
};
//# sourceMappingURL=system-clock.js.map