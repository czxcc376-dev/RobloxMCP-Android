package com.milk.robloxmcp

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.util.Log
import java.io.PrintWriter
import java.io.StringWriter

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        instance = this
        createChannel()
        installCrashGuard()
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

    private fun installCrashGuard() {
        val prev = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { t, e ->
            try {
                val sw = StringWriter()
                e.printStackTrace(PrintWriter(sw))
                val log = java.io.File(filesDir, "crash_last.txt")
                log.writeText("thread=${t.name}\n\n" + sw.toString())
                Log.e("RobloxMCP", "uncaught", e)
            } catch (_: Throwable) {}
            // 悬浮窗相关异常不拖垮主进程
            if (e is android.view.WindowManager.BadTokenException) {
                FloatingService.overlayMissing = true
                return@setDefaultUncaughtExceptionHandler
            }
            prev?.uncaughtException(t, e)
        }
    }

    companion object {
        const val CHANNEL_ID = "roblox_mcp_service"
        const val PORT = 16384
        lateinit var instance: App
            private set
    }
}
