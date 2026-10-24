package com.milk.robloxmcp

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        instance = this
        createChannel()
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(NotificationManager::class.java)
            val ch = NotificationChannel(
                CHANNEL_ID, "MCP 服务器", NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "保持 MCP 服务器常驻运行"
                setShowBadge(false)
                enableVibration(false)
                setSound(null, null)
            }
            nm.createNotificationChannel(ch)
        }
    }

    companion object {
        const val CHANNEL_ID = "roblox_mcp_service"
        const val PORT = 16384
        lateinit var instance: App
            private set
    }
}
