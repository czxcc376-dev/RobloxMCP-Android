import { appendFileSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
const SESSION_FILE_RE = /^([0-9a-f-]{8,})\.jsonl$/i;
/**
 * One JSONL file per session, named `<sessionId>.jsonl`. Append is
 * synchronous so a tool's recorded entry is on-disk before the call's caller
 * sees a reply — a crash mid-run still leaves a complete trace up to the
 * crash point. A small label-cache writes a `# session: <label>` header line
 * the first time we touch a file so `list()` can show human names.
 */
export class FsSessionLogger {
    dir;
    seenSessions = new Set();
    constructor(dir) {
        this.dir = resolve(dir ?? join(homedir(), ".executor-mcp", "sessions"));
        try {
            mkdirSync(this.dir, { recursive: true });
        }
        catch {
            // best-effort; append will error explicitly if the dir is unwritable
        }
    }
    pathFor(sessionId) {
        // Defensive: only allow filename-safe characters; sessions come from
        // randomUUID so this never matters in practice, but it's the right shape.
        const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
        return join(this.dir, safe + ".jsonl");
    }
    append(record, sessionLabel) {
        const path = this.pathFor(record.sessionId);
        try {
            if (!this.seenSessions.has(record.sessionId)) {
                // Sentinel line so list() can recover the human label even after restart.
                // Goes in the file body as a JSON record with `_label`; the parser drops it.
                appendFileSync(path, JSON.stringify({ _label: sessionLabel, _startedAt: record.at }) + "\n", "utf8");
                this.seenSessions.add(record.sessionId);
            }
            appendFileSync(path, JSON.stringify(record) + "\n", "utf8");
        }
        catch {
            // Bookkeeping must never break a tool call. Swallow.
        }
    }
    async list() {
        let names;
        try {
            names = readdirSync(this.dir);
        }
        catch {
            return [];
        }
        const out = [];
        for (const name of names) {
            const m = SESSION_FILE_RE.exec(name);
            if (!m)
                continue;
            const path = join(this.dir, name);
            try {
                const st = statSync(path);
                const summary = await this.summarize(m[1], path, st.size);
                if (summary)
                    out.push(summary);
            }
            catch {
                // skip unreadable files
            }
        }
        out.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));
        return out;
    }
    async read(sessionId, opts = {}) {
        const path = this.pathFor(sessionId);
        let raw;
        try {
            raw = readFileSync(path, "utf8");
        }
        catch {
            return [];
        }
        const out = [];
        const from = opts.from ?? 1;
        const to = opts.to;
        for (const line of raw.split("\n")) {
            if (!line)
                continue;
            let parsed;
            try {
                parsed = JSON.parse(line);
            }
            catch {
                continue;
            }
            if (!parsed || typeof parsed !== "object" || !("seq" in parsed))
                continue;
            const rec = parsed;
            if (rec.seq < from)
                continue;
            if (to !== undefined && rec.seq > to)
                continue;
            out.push(rec);
        }
        return Promise.resolve(out);
    }
    /** Cheap scan: read just the first line (label) + record count from line count. */
    async summarize(sessionId, path, bytes) {
        const raw = readFileSync(path, "utf8");
        let label = null;
        let startedAt = null;
        let endedAt = null;
        let count = 0;
        for (const line of raw.split("\n")) {
            if (!line)
                continue;
            let parsed;
            try {
                parsed = JSON.parse(line);
            }
            catch {
                continue;
            }
            if (!parsed || typeof parsed !== "object")
                continue;
            const obj = parsed;
            const labelVal = obj["_label"];
            if (typeof labelVal === "string") {
                label = labelVal;
                const startedVal = obj["_startedAt"];
                if (typeof startedVal === "number")
                    startedAt = startedVal;
                continue;
            }
            const seqVal = obj["seq"];
            if (typeof seqVal === "number") {
                count += 1;
                const atVal = obj["at"];
                if (typeof atVal === "number") {
                    endedAt = atVal;
                    startedAt ??= atVal;
                }
            }
        }
        return Promise.resolve({ sessionId, sessionLabel: label, startedAt, endedAt, count, bytes });
    }
}
//# sourceMappingURL=fs-session-logger.js.map