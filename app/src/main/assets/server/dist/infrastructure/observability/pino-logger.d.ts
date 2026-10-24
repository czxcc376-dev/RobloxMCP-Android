import type { AppConfig } from "../../application/ports/config.js";
import type { Logger } from "../../application/ports/logger.js";
/**
 * Create a {@link Logger} backed by pino. CRITICAL: all output goes to STDERR
 * (fd 2) so STDOUT stays exclusively reserved for the MCP stdio protocol. When
 * `pretty` is enabled the pino-pretty transport is used (also writing to stderr).
 */
export declare function createLogger(options: AppConfig["logging"]): Logger;
//# sourceMappingURL=pino-logger.d.ts.map