import { z } from "zod";
import type { ToolContract } from "./tool.js";
interface ContractInput {
    readonly name: string;
    readonly title?: string;
    readonly description?: string;
    readonly category: string;
    readonly input?: z.ZodTypeAny;
    readonly requiresClient?: boolean;
    readonly mutatesState?: boolean;
}
/** Conservative but complete defaults keep every tool useful to an AI without hand-authored metadata. */
export declare function inferToolContract(tool: ContractInput): ToolContract;
/** Merge author hints additively so an empty override cannot erase essential safety/recovery metadata. */
export declare function mergeToolContract(inferred: ToolContract, override: Partial<ToolContract> | undefined): ToolContract;
export {};
//# sourceMappingURL=tool-contract.d.ts.map