import type { Clock } from "../../application/ports/clock.js";
/**
 * The production {@link Clock}: wall-clock time from `Date.now()` and monotonic
 * time from `performance.now()` (which never runs backwards, even across NTP
 * adjustments). Tests inject a fake clock instead.
 */
export declare const systemClock: Clock;
//# sourceMappingURL=system-clock.d.ts.map