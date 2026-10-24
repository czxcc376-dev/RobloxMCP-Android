declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "touch" | "keyDown" | "keyUp" | "keyPress" | "mouseMove" | "mouseButton" | "mouseWheel" | "gamepadButton" | "gamepadAxis";
    relative: boolean;
    button: "Left" | "Right" | "Middle";
    buttonAction: "click" | "down" | "up";
    delta: number;
    holdSec: number;
    touchId: number;
    touchState: "Begin" | "Change" | "End";
    gamepad: "Gamepad1" | "Gamepad2" | "Gamepad3" | "Gamepad4";
    gamepadDown: boolean;
    axisX: number;
    axisY: number;
    axisZ: number;
    key?: string | undefined;
    x?: number | undefined;
    y?: number | undefined;
    gamepadButton?: string | undefined;
    axis?: string | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=virtual-input.d.ts.map