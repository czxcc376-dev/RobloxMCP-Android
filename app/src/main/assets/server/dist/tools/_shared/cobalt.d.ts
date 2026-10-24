import { z } from "zod";
import type { ToolContext, ToolResult } from "../../application/tool/tool.js";
import { type CobaltOperation, type CobaltSpyOptions } from "../../application/services/cobalt-spy-source.js";
import { type SpyEngine } from "../../application/services/remote-spy-source.js";
export declare const spyEngine: z.ZodDefault<z.ZodEnum<{
    cobalt: "cobalt";
    ketamine: "ketamine";
}>>;
export declare const cobaltDirection: z.ZodEnum<{
    Incoming: "Incoming";
    Outgoing: "Outgoing";
    Both: "Both";
}>;
export declare const cobaltMode: z.ZodEnum<{
    auto: "auto";
    luau: "luau";
    raknet: "raknet";
}>;
export declare const remoteClass: z.ZodEnum<{
    RemoteEvent: "RemoteEvent";
    UnreliableRemoteEvent: "UnreliableRemoteEvent";
    RemoteFunction: "RemoteFunction";
}>;
export declare const remoteMethod: z.ZodEnum<{
    OnClientEvent: "OnClientEvent";
    FireServer: "FireServer";
    InvokeServer: "InvokeServer";
    OnClientInvoke: "OnClientInvoke";
}>;
export declare const spyConfiguration: z.ZodObject<{
    max: z.ZodOptional<z.ZodNumber>;
    capture: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        direction: z.ZodOptional<z.ZodEnum<{
            Incoming: "Incoming";
            Outgoing: "Outgoing";
            Both: "Both";
        }>>;
        nameFilter: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodEnum<{
            OnClientEvent: "OnClientEvent";
            FireServer: "FireServer";
            InvokeServer: "InvokeServer";
            OnClientInvoke: "OnClientInvoke";
        }>>;
        classFilter: z.ZodOptional<z.ZodEnum<{
            RemoteEvent: "RemoteEvent";
            UnreliableRemoteEvent: "UnreliableRemoteEvent";
            RemoteFunction: "RemoteFunction";
        }>>;
        blockedOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    resetFilters: z.ZodOptional<z.ZodBoolean>;
    guiVisible: z.ZodOptional<z.ZodBoolean>;
    guiLogging: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare function runRemoteSpy(ctx: ToolContext, operation: CobaltOperation, options?: CobaltSpyOptions & {
    engine?: SpyEngine;
}, threadContext?: number): Promise<ToolResult>;
//# sourceMappingURL=cobalt.d.ts.map