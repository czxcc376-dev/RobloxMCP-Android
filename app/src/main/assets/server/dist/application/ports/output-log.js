/**
 * A live feed of everything a client's game prints. The connector taps
 * `LogService.MessageOut` (which captures every print/warn/error in the game,
 * including from `script`-tool runs) and streams batches over the bridge's
 * `event` channel; the transport records them here. The dashboard's Output
 * console and the `get-output` tool read from it.
 */
export {};
//# sourceMappingURL=output-log.js.map