import { z } from "zod";
import type { ToolContext, ToolResult } from "../tool/tool.js";
/** Kept wire-compatible with the live read-only assert-state tool. */
export declare const semanticAssertionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
export declare const adaptiveStepSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"tool">>>;
    id: z.ZodString;
    phase: z.ZodOptional<z.ZodEnum<{
        observe: "observe";
        act: "act";
        verify: "verify";
    }>>;
    tool: z.ZodString;
    input: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    assertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strip>], "kind">>>>;
    recoverWith: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    onFailure: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        stop: "stop";
        continue: "continue";
    }>>>;
}, z.core.$strip>;
export declare const fallbackBranchSchema: z.ZodObject<{
    id: z.ZodString;
    when: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        any: "any";
        "tool-error": "tool-error";
        "assertion-failed": "assertion-failed";
        blocked: "blocked";
    }>>>;
    steps: z.ZodArray<z.ZodObject<{
        type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"tool">>>;
        id: z.ZodString;
        phase: z.ZodOptional<z.ZodEnum<{
            observe: "observe";
            act: "act";
            verify: "verify";
        }>>;
        tool: z.ZodString;
        input: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        assertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strip>], "kind">>>>;
        recoverWith: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        onFailure: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            stop: "stop";
            continue: "continue";
        }>>>;
    }, z.core.$strip>>;
    resolvesAssertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    resume: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        stop: "stop";
        next: "next";
    }>>>;
}, z.core.$strip>;
export declare const adaptiveBudgetsSchema: z.ZodObject<{
    maxSteps: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    maxToolCalls: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const adaptiveWorkflowInputSchema: z.ZodObject<{
    goal: z.ZodString;
    mode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        plan: "plan";
        preview: "preview";
        execute: "execute";
    }>>>;
    steps: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"tool">>>;
        id: z.ZodString;
        phase: z.ZodOptional<z.ZodEnum<{
            observe: "observe";
            act: "act";
            verify: "verify";
        }>>;
        tool: z.ZodString;
        input: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        assertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strip>], "kind">>>>;
        recoverWith: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        onFailure: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            stop: "stop";
            continue: "continue";
        }>>>;
    }, z.core.$strip>>>;
    fallbacks: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        when: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            any: "any";
            "tool-error": "tool-error";
            "assertion-failed": "assertion-failed";
            blocked: "blocked";
        }>>>;
        steps: z.ZodArray<z.ZodObject<{
            type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"tool">>>;
            id: z.ZodString;
            phase: z.ZodOptional<z.ZodEnum<{
                observe: "observe";
                act: "act";
                verify: "verify";
            }>>;
            tool: z.ZodString;
            input: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            assertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
            }, z.core.$strip>], "kind">>>>;
            recoverWith: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            onFailure: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                stop: "stop";
                continue: "continue";
            }>>>;
        }, z.core.$strip>>;
        resolvesAssertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        resume: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            stop: "stop";
            next: "next";
        }>>>;
    }, z.core.$strip>>>>;
    successAssertions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strip>], "kind">>>>;
    finalRecoverWith: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    allowMutations: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    budgets: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        maxSteps: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        maxToolCalls: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type SemanticAssertion = z.infer<typeof semanticAssertionSchema>;
export type AdaptiveStep = z.infer<typeof adaptiveStepSchema>;
export type FallbackBranch = z.infer<typeof fallbackBranchSchema>;
export type AdaptiveWorkflowInput = z.infer<typeof adaptiveWorkflowInputSchema>;
export declare function resolveStepReferences(value: unknown, outputs: ReadonlyMap<string, unknown>): unknown;
export declare function runAdaptiveWorkflow(input: AdaptiveWorkflowInput, ctx: ToolContext): Promise<ToolResult>;
//# sourceMappingURL=adaptive-workflow.d.ts.map