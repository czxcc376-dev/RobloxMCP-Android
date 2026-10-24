package com.milk.robloxmcp

import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class BridgeInfo(
    val healthy: Boolean = false,
    val clients: Int = 0,
    val tools: Int = 289,
    val game: String = "",
    val placeId: String = ""
)

object BridgeClient {
    private const val BASE = "http://127.0.0.1:16384"

    private fun get(path: String, timeout: Int = 1500): String? = try {
        val c = URL(BASE + path).openConnection() as HttpURLConnection
        c.connectTimeout = timeout
        c.readTimeout = timeout
        c.requestMethod = "GET"
        if (c.responseCode == 200) c.inputStream.bufferedReader().readText() else null
    } catch (_: Exception) { null }

    fun fetchInfo(): BridgeInfo {
        val schema = get("/api/tools/schema") ?: return BridgeInfo(healthy = false)
        var tools = 289
        try {
            val arr: JSONArray = JSONArray(schema)
            tools = arr.length()
        } catch (_: Exception) {}

        var clients = 0
        var game = ""
        var placeId = ""
        try {
            val st = get("/api/clients")
            if (st != null) {
                val obj = JSONObject(st)
                val arr = obj.optJSONArray("clients") ?: obj.optJSONArray("items")
                if (arr != null) {
                    clients = arr.length()
                    if (clients > 0) {
                        val c0 = arr.optJSONObject(0)
                        game = c0?.optString("gameName", "") ?: ""
                        if (game.isBlank()) game = c0?.optString("placeName", "") ?: ""
                        placeId = c0?.optString("placeId", "") ?: ""
                    }
                }
            }
        } catch (_: Exception) {}
        return BridgeInfo(true, clients, tools, game, placeId)
    }

    fun loaderScript(): String = """
        |getgenv().BridgeURL = "127.0.0.1:${App.PORT}"
        |getgenv().DisableWebSocket = true
        |pcall(function()
        |    loadstring(game:HttpGet("http://127.0.0.1:${App.PORT}/connector.luau"))()
        |end)
    """.trimMargin()
}
