import { ClientNotFoundError, ValidationError } from "../../domain/errors/errors.js";
import { ClientId, SessionId } from "../../domain/shared/ids.js";
import { preflightScript } from "../../application/services/script-preflight.js";
const NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
/**
 * Backs the dashboard Playbooks tab. Lists/loads/saves/deletes via the
 * SavedScriptsStore, and runs a playbook against a chosen client by mirroring
 * the script tool's bind/execute path (mint scriptToken, ${param} substitution,
 * preflight, runLuau, dispose).
 */
export class PlaybookService {
    store;
    gateway;
    clients;
    scriptBridge;
    registry;
    config;
    constructor(store, gateway, clients, scriptBridge, registry, config) {
        this.store = store;
        this.gateway = gateway;
        this.clients = clients;
        this.scriptBridge = scriptBridge;
        this.registry = registry;
        this.config = config;
    }
    list() {
        return this.store.list();
    }
    get(name) {
        return this.store.get(name);
    }
    save(input) {
        if (!NAME_RE.test(input.name)) {
            return Promise.reject(new ValidationError(`Invalid playbook name "${input.name}". Use letters, digits, _ and -; 1–64 chars.`));
        }
        return this.store.save(input);
    }
    delete(name) {
        return this.store.delete(name);
    }
    async run(name, clientId, params, options = {}) {
        const playbook = await this.store.get(name);
        if (!playbook) {
            return { error: `No playbook named "${name}".` };
        }
        const substituted = playbook.source.replace(/\$\$|\$\{([^}]+)\}/g, (m, key) => {
            if (m === "$$")
                return "$";
            if (params && key !== undefined && Object.hasOwn(params, key)) {
                return String(params[key]);
            }
            return m;
        });
        return this.runSource(substituted, clientId, options, `dashboard-playbook-${name}`);
    }
    /** REPL-style runner: any source, no save. Same scripting bridge as run(). */
    async runSource(source, clientId, options = {}, sessionTag = "dashboard-repl") {
        const cid = ClientId(clientId);
        if (!this.clients.get(cid)) {
            throw new ClientNotFoundError(`Client "${clientId}" is not connected.`);
        }
        const knownTools = this.registry.list().map((t) => t.name);
        const preflight = preflightScript(source, knownTools);
        if (preflight.errors.length > 0) {
            return {
                error: `preflight: ${preflight.errors.length} unknown mcp.* tool${preflight.errors.length === 1 ? "" : "s"}.`,
                unknownTools: preflight.errors.map((f) => ({
                    name: f.name,
                    writtenAs: f.written,
                    occurrences: f.occurrences,
                    didYouMean: f.suggestions,
                })),
            };
        }
        const sessionId = SessionId(sessionTag);
        const { token, dispose } = this.scriptBridge.mint(sessionId, sessionTag, cid, undefined, options.rpcBudget);
        try {
            return await this.gateway.eval(cid, {
                source,
                threadContext: this.config.execution.defaultThreadContext,
                timeoutMs: options.timeoutMs ?? 120000,
                vmScope: sessionId,
                env: options.persistent === false ? "fresh" : "vm",
                scriptToken: token,
            });
        }
        finally {
            dispose();
        }
    }
}
//# sourceMappingURL=dashboard-playbooks.js.map