/**
 * Make a real outbound HTTP request from the game client via the executor's
 * request({ Url, Method, Headers, Body }) function (falling back to http_request,
 * then syn.request). Returns the standard response shape.
 */
declare const _default: import("../../application/tool/tool.js").Tool<{
    url: string;
    method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH" | "HEAD";
    headers?: Record<string, string> | undefined;
    body?: string | undefined;
    threadContext?: number | undefined;
    timeoutMs?: number | undefined;
}>;
export default _default;
//# sourceMappingURL=http-request.d.ts.map