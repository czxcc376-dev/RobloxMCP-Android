import { type CobaltOperation, type CobaltSpyOptions } from "./cobalt-spy-source.js";
export type SpyEngine = "cobalt" | "ketamine";
/** Serializes lifecycle changes in the selected Roblox client's environment. */
export declare function buildRemoteSpySource(engine: SpyEngine, operation: CobaltOperation, options?: CobaltSpyOptions): string;
//# sourceMappingURL=remote-spy-source.d.ts.map