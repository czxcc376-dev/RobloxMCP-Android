declare const _default: import("../../application/tool/tool.js").Tool<{
    goal: string;
    mode: "plan" | "preview" | "execute";
    fallbacks: {
        id: string;
        when: "any" | "tool-error" | "assertion-failed" | "blocked";
        steps: {
            type: "tool";
            id: string;
            tool: string;
            input: Record<string, unknown>;
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
            recoverWith: string[];
            onFailure: "stop" | "continue";
            phase?: "observe" | "act" | "verify" | undefined;
        }[];
        resolvesAssertions: string[];
        resume: "stop" | "next";
    }[];
    successAssertions: ({
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
    finalRecoverWith: string[];
    allowMutations: boolean;
    budgets: {
        maxSteps: number;
        maxToolCalls: number;
        timeoutMs: number;
    };
    steps?: {
        type: "tool";
        id: string;
        tool: string;
        input: Record<string, unknown>;
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
        recoverWith: string[];
        onFailure: "stop" | "continue";
        phase?: "observe" | "act" | "verify" | undefined;
    }[] | undefined;
}>;
export default _default;
//# sourceMappingURL=smart-task.d.ts.map