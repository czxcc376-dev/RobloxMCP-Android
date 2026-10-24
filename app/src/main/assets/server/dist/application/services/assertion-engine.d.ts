export type AssertionScalar = string | number | boolean;
interface AssertionBase {
    readonly id: string;
}
export interface PathExistsAssertion extends AssertionBase {
    readonly kind: "path-exists" | "path-not-exists";
    readonly path: string;
}
export interface PropertyValueAssertion extends AssertionBase {
    readonly kind: "property-equals" | "property-not-equals";
    readonly path: string;
    readonly property: string;
    readonly expected: AssertionScalar;
}
export interface PropertyContainsAssertion extends AssertionBase {
    readonly kind: "property-contains";
    readonly path: string;
    readonly property: string;
    readonly expected: string;
    readonly caseSensitive?: boolean;
}
export interface PropertyNumericAssertion extends AssertionBase {
    readonly kind: "property-greater" | "property-less";
    readonly path: string;
    readonly property: string;
    readonly expected: number;
}
export interface AttributeEqualsAssertion extends AssertionBase {
    readonly kind: "attribute-equals";
    readonly path: string;
    readonly attribute: string;
    readonly expected: AssertionScalar;
}
export interface GuiStateAssertion extends AssertionBase {
    readonly kind: "gui-visible" | "gui-enabled";
    readonly path: string;
    readonly expected?: boolean;
    readonly effective?: boolean;
}
export interface ClassSelector {
    readonly by: "class";
    readonly value: string;
}
export interface TextSelector {
    readonly by: "name" | "text";
    readonly value: string;
    readonly match?: "equals" | "contains";
    readonly caseSensitive?: boolean;
}
export type DescendantSelector = ClassSelector | TextSelector;
export interface DescendantExistsAssertion extends AssertionBase {
    readonly kind: "descendant-exists";
    readonly path: string;
    readonly selector: DescendantSelector;
    readonly expected?: boolean;
}
export interface CharacterDistanceAssertion extends AssertionBase {
    readonly kind: "character-distance";
    readonly targetPath: string;
    readonly operator: "at-most" | "at-least";
    readonly distance: number;
    readonly playerName?: string;
    readonly characterPath?: string;
    readonly rootPath?: string;
}
export interface CameraFacingAssertion extends AssertionBase {
    readonly kind: "camera-facing";
    readonly targetPath: string;
    readonly maxAngleDegrees: number;
    readonly cameraPath?: string;
}
export interface CollectionCountAssertion extends AssertionBase {
    readonly kind: "collection-count";
    readonly path: string;
    readonly scope?: "children" | "descendants";
    readonly operator: "equals" | "not-equals" | "greater" | "less" | "at-least" | "at-most";
    readonly count: number;
    readonly selector?: DescendantSelector;
}
export type LiveAssertion = PathExistsAssertion | PropertyValueAssertion | PropertyContainsAssertion | PropertyNumericAssertion | AttributeEqualsAssertion | GuiStateAssertion | DescendantExistsAssertion | CharacterDistanceAssertion | CameraFacingAssertion | CollectionCountAssertion;
export interface AssertionEngineLimits {
    readonly scanLimit: number;
    readonly readBudget: number;
}
export interface AssertionEvidence {
    readonly readSucceeded: boolean;
    readonly confidence?: number;
    readonly [key: string]: unknown;
}
export interface AssertionResult {
    readonly id: string;
    readonly kind: LiveAssertion["kind"];
    readonly status: "passed" | "failed";
    readonly passed: boolean;
    readonly expected: unknown;
    readonly actual: unknown;
    readonly evidence: AssertionEvidence;
    readonly errors: readonly string[];
    readonly confidence: number;
}
export interface AssertionAggregate {
    readonly passed: boolean;
    readonly total: number;
    readonly passedCount: number;
    readonly failedCount: number;
    readonly readFailureCount: number;
    readonly passRatio: number;
    readonly confidence: number;
}
export interface AssertionReport {
    readonly results: readonly AssertionResult[];
    readonly aggregate: AssertionAggregate;
    readonly passed: boolean;
    readonly passRatio: number;
    readonly confidence: number;
}
/** A result only passes when the predicate passed and every required live read completed. */
export declare function assertionResultPassed(result: Pick<AssertionResult, "passed" | "errors" | "evidence">): boolean;
/** Alias with conventional predicate naming for orchestrators. */
export declare const isAssertionResultPassed: typeof assertionResultPassed;
/** Pure aggregation shared by assert-state and higher-level goal runners. */
export declare function aggregateAssertionResults(results: readonly AssertionResult[]): AssertionAggregate;
/** Check an aggregate without trusting a caller-provided `passed` flag. */
export declare function assertionAggregatePassed(aggregate: AssertionAggregate, minimumPassRatio?: number): boolean;
/** Aggregate and gate results in one pure call for smart-task style consumers. */
export declare function assertionResultsPassed(results: readonly AssertionResult[], minimumPassRatio?: number): boolean;
/**
 * Convert the untrusted bridge payload into strict results. Missing/malformed data and
 * any incomplete read are forced to failure, even if the payload claims `passed=true`.
 */
export declare function normalizeAssertionReport(raw: unknown, assertions: readonly LiveAssertion[]): AssertionReport;
/** Build one bounded Luau chunk containing every requested live assertion. */
export declare function buildAssertionLuau(assertions: readonly LiveAssertion[], limits: AssertionEngineLimits): string;
export {};
//# sourceMappingURL=assertion-engine.d.ts.map