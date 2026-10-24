import { z } from "zod";
export declare const liveAssertionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"path-exists">;
    path: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"path-not-exists">;
    path: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"property-equals">;
    path: z.ZodString;
    property: z.ZodString;
    expected: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"property-not-equals">;
    path: z.ZodString;
    property: z.ZodString;
    expected: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"property-contains">;
    path: z.ZodString;
    property: z.ZodString;
    expected: z.ZodString;
    caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"property-greater">;
    path: z.ZodString;
    property: z.ZodString;
    expected: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"property-less">;
    path: z.ZodString;
    property: z.ZodString;
    expected: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"attribute-equals">;
    path: z.ZodString;
    attribute: z.ZodString;
    expected: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"gui-visible">;
    path: z.ZodString;
    expected: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    effective: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"gui-enabled">;
    path: z.ZodString;
    expected: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"descendant-exists">;
    path: z.ZodString;
    selector: z.ZodDiscriminatedUnion<[z.ZodObject<{
        by: z.ZodLiteral<"class">;
        value: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        by: z.ZodLiteral<"name">;
        value: z.ZodString;
        match: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            equals: "equals";
            contains: "contains";
        }>>>;
        caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>, z.ZodObject<{
        by: z.ZodLiteral<"text">;
        value: z.ZodString;
        match: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            equals: "equals";
            contains: "contains";
        }>>>;
        caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>], "by">;
    expected: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"character-distance">;
    targetPath: z.ZodString;
    operator: z.ZodEnum<{
        "at-most": "at-most";
        "at-least": "at-least";
    }>;
    distance: z.ZodNumber;
    playerName: z.ZodOptional<z.ZodString>;
    characterPath: z.ZodOptional<z.ZodString>;
    rootPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"camera-facing">;
    targetPath: z.ZodString;
    maxAngleDegrees: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    cameraPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodLiteral<"collection-count">;
    path: z.ZodString;
    scope: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        children: "children";
        descendants: "descendants";
    }>>>;
    operator: z.ZodEnum<{
        equals: "equals";
        "at-most": "at-most";
        "at-least": "at-least";
        "not-equals": "not-equals";
        greater: "greater";
        less: "less";
    }>;
    count: z.ZodNumber;
    selector: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        by: z.ZodLiteral<"class">;
        value: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        by: z.ZodLiteral<"name">;
        value: z.ZodString;
        match: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            equals: "equals";
            contains: "contains";
        }>>>;
        caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>, z.ZodObject<{
        by: z.ZodLiteral<"text">;
        value: z.ZodString;
        match: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            equals: "equals";
            contains: "contains";
        }>>>;
        caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>], "by">>;
}, z.core.$strip>], "kind">;
declare const _default: import("../../application/tool/tool.js").Tool<{
    assertions: ({
        id: string;
        kind: "path-exists";
        path: string;
    } | {
        id: string;
        kind: "path-not-exists";
        path: string;
    } | {
        id: string;
        kind: "property-equals";
        path: string;
        property: string;
        expected: string | number | boolean;
    } | {
        id: string;
        kind: "property-not-equals";
        path: string;
        property: string;
        expected: string | number | boolean;
    } | {
        id: string;
        kind: "property-contains";
        path: string;
        property: string;
        expected: string;
        caseSensitive: boolean;
    } | {
        id: string;
        kind: "property-greater";
        path: string;
        property: string;
        expected: number;
    } | {
        id: string;
        kind: "property-less";
        path: string;
        property: string;
        expected: number;
    } | {
        id: string;
        kind: "attribute-equals";
        path: string;
        attribute: string;
        expected: string | number | boolean;
    } | {
        id: string;
        kind: "gui-visible";
        path: string;
        expected: boolean;
        effective: boolean;
    } | {
        id: string;
        kind: "gui-enabled";
        path: string;
        expected: boolean;
    } | {
        id: string;
        kind: "descendant-exists";
        path: string;
        selector: {
            by: "class";
            value: string;
        } | {
            by: "name";
            value: string;
            match: "equals" | "contains";
            caseSensitive: boolean;
        } | {
            by: "text";
            value: string;
            match: "equals" | "contains";
            caseSensitive: boolean;
        };
        expected: boolean;
    } | {
        id: string;
        kind: "character-distance";
        targetPath: string;
        operator: "at-most" | "at-least";
        distance: number;
        playerName?: string | undefined;
        characterPath?: string | undefined;
        rootPath?: string | undefined;
    } | {
        id: string;
        kind: "camera-facing";
        targetPath: string;
        maxAngleDegrees: number;
        cameraPath?: string | undefined;
    } | {
        id: string;
        kind: "collection-count";
        path: string;
        scope: "children" | "descendants";
        operator: "equals" | "at-most" | "at-least" | "not-equals" | "greater" | "less";
        count: number;
        selector?: {
            by: "class";
            value: string;
        } | {
            by: "name";
            value: string;
            match: "equals" | "contains";
            caseSensitive: boolean;
        } | {
            by: "text";
            value: string;
            match: "equals" | "contains";
            caseSensitive: boolean;
        } | undefined;
    })[];
    scanLimit: number;
    readBudget: number;
    timeoutMs: number;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=assert-state.d.ts.map