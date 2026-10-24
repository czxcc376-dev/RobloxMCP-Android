declare const _default: import("../../application/tool/tool.js").Tool<{
    action: "get" | "setCFrame" | "setFov";
    position?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
    lookAt?: {
        x: number;
        y: number;
        z: number;
    } | undefined;
    rotation?: {
        pitch: number;
        yaw: number;
        roll: number;
    } | undefined;
    fov?: number | undefined;
    cameraType?: "Fixed" | "Attach" | "Watch" | "Track" | "Follow" | "Custom" | "Scriptable" | "Orbital" | undefined;
    threadContext?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=camera-control.d.ts.map