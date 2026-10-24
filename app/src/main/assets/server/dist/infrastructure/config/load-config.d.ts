import type { AppConfig } from "../../application/ports/config.js";
/**
 * Build the fully-resolved {@link AppConfig} from CLI flags and environment
 * variables. CLI flags take precedence over env, which takes precedence over the
 * built-in defaults. Throws {@link ConfigError} when the result is invalid.
 */
export declare function loadConfig(argv: string[], env: NodeJS.ProcessEnv): AppConfig;
//# sourceMappingURL=load-config.d.ts.map