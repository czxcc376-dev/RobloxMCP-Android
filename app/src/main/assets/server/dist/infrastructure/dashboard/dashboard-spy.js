import { ClientNotFoundError } from "../../domain/errors/errors.js";
import { ClientId } from "../../domain/shared/ids.js";
import {} from "../../application/services/cobalt-spy-source.js";
import { buildRemoteSpySource, } from "../../application/services/remote-spy-source.js";
/** Dashboard and MCP read/control the same Cobalt adapter. */
export class SpyService {
    gateway;
    clients;
    constructor(gateway, clients) {
        this.gateway = gateway;
        this.clients = clients;
    }
    run(clientId, operation, options = {}, engine = "cobalt") {
        const id = ClientId(clientId);
        if (!this.clients.get(id))
            return Promise.reject(new ClientNotFoundError(`Client "${clientId}" is not connected.`));
        return this.gateway.eval(id, {
            source: buildRemoteSpySource(engine, operation, options),
            threadContext: 8,
            timeoutMs: operation === "start" ? 60000 : 15000,
        });
    }
    logs(clientId, limit, engine = "cobalt") {
        return this.run(clientId, "logs", { limit }, engine);
    }
    clear(clientId, engine = "cobalt") {
        return this.run(clientId, "clear", {}, engine);
    }
    start(clientId, mode, engine = "cobalt") {
        return this.run(clientId, "start", { mode }, engine);
    }
}
//# sourceMappingURL=dashboard-spy.js.map