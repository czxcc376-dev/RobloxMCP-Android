import pino from "pino";
/**
 * Adapt a pino instance to the {@link Logger} port. pino's call signatures already
 * match the port's `(obj, msg?)` / `(msg)` overloads, so the wrapper mainly exists
 * to (a) narrow the surface to exactly the port and (b) keep `child()` returning a
 * wrapped logger rather than a raw pino instance.
 */
class PinoLoggerAdapter {
    pino;
    constructor(pino) {
        this.pino = pino;
    }
    trace(obj, msg) {
        this.log("trace", obj, msg);
    }
    debug(obj, msg) {
        this.log("debug", obj, msg);
    }
    info(obj, msg) {
        this.log("info", obj, msg);
    }
    warn(obj, msg) {
        this.log("warn", obj, msg);
    }
    error(obj, msg) {
        this.log("error", obj, msg);
    }
    fatal(obj, msg) {
        this.log("fatal", obj, msg);
    }
    child(bindings) {
        return new PinoLoggerAdapter(this.pino.child(bindings));
    }
    log(level, obj, msg) {
        if (typeof obj === "string") {
            this.pino[level](obj);
        }
        else {
            this.pino[level](obj, msg);
        }
    }
}
/**
 * Create a {@link Logger} backed by pino. CRITICAL: all output goes to STDERR
 * (fd 2) so STDOUT stays exclusively reserved for the MCP stdio protocol. When
 * `pretty` is enabled the pino-pretty transport is used (also writing to stderr).
 */
export function createLogger(options) {
    const base = { level: options.level };
    if (options.pretty) {
        const instance = pino({
            ...base,
            transport: {
                target: "pino-pretty",
                options: {
                    destination: 2,
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            },
        });
        return new PinoLoggerAdapter(instance);
    }
    const instance = pino(base, pino.destination(2));
    return new PinoLoggerAdapter(instance);
}
//# sourceMappingURL=pino-logger.js.map