package com.milk.robloxmcp

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicBoolean

class McpService : Service() {

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var process: Process? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private val running = AtomicBoolean(false)
    private var restartDelay = 1000L
    private var startedAt = 0L
    @Volatile var healthy = false
    @Volatile var lastError: String? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        instance = this
        startForeground(NOTIF_ID, buildNotification("正在启动…"))
        acquireWakeLock()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> { stopEverything(); return START_NOT_STICKY }
            ACTION_RESTART -> { restartServer(); return START_STICKY }
        }
        if (!running.get()) startServer()
        if (!FloatingService.isRunning && Settings.canDrawOverlays(this)) {
            FloatingService.start(this)
        }
        return START_STICKY
    }

    private fun log(line: String) {
        android.util.Log.i(TAG, line)
        Logs.append(line)
    }

    private fun acquireWakeLock() {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "RobloxMCP::server").apply {
            setReferenceCounted(false)
            acquire()
        }
    }

    private fun startServer() {
        if (!running.compareAndSet(false, true)) return
        scope.launch {
            try {
                val dir = ServerCore.ensureInstalled(this@McpService) { msg -> updateNotification(msg); log(msg) }
                ServerCore.prepareSonames(this@McpService) { log(it) }
                val node = ServerCore.nodeBin(this@McpService)
                log("node=" + node.absolutePath + " exists=" + node.exists())
                log("libs=" + ServerCore.libDir(this@McpService).absolutePath)
                if (!node.exists()) {
                    lastError = "缺少 Node 运行时：${node.absolutePath}"
                    updateNotification(lastError!!); running.set(false); process = null; return@launch
                }
                node.setExecutable(true)
                updateNotification("正在启动 Node…")
                val pb = ProcessBuilder(
                    node.absolutePath,
                    File(dir, "dist/interface/launcher.js").absolutePath
                )
                pb.directory(dir)
                pb.redirectErrorStream(true)
                pb.environment()["HOME"] = filesDir.absolutePath
                pb.environment()["TMPDIR"] = cacheDir.absolutePath
                pb.environment()["NODE_ENV"] = "production"
                pb.environment()["LD_LIBRARY_PATH"] = ServerCore.libDir(this@McpService).absolutePath
                pb.environment()["TZ"] = java.util.TimeZone.getDefault().id
                val p = pb.start()
                process = p
                startedAt = System.currentTimeMillis()
                consumeOutput(p)
                waitHealthy()
                if (healthy) {
                    restartDelay = 1000L
                    updateNotification("运行中 · 端口 ${App.PORT}")
                } else {
                    lastError = "健康检查失败"
                    updateNotification(lastError!!)
                    running.set(false); process = null
                    scheduleRestart()
                }
            } catch (t: Throwable) {
                lastError = t.message ?: t.toString()
                Log.e(TAG, "start failed", t)
                updateNotification("启动失败：$lastError")
                running.set(false); process = null
                scheduleRestart()
            }
        }
    }

    private fun consumeOutput(p: Process) {
        scope.launch {
            try {
                p.inputStream.bufferedReader().useLines { lines ->
                    lines.forEach { line ->
                        log(line)
                        if (line.contains("\"tools\"")) updateNotification("已就绪 · 工具已加载")
                    }
                }
            } catch (_: Exception) {}
            if (running.get() && process === p) {
                healthy = false
                running.set(false); process = null
                scheduleRestart()
            }
        }
    }

    private suspend fun waitHealthy() {
        repeat(60) {
            delay(500)
            if (probe()) { healthy = true; return }
        }
        healthy = false
    }

    private fun probe(): Boolean = try {
        val c = URL("http://127.0.0.1:${App.PORT}/api/tools/schema").openConnection() as HttpURLConnection
        c.connectTimeout = 1200
        c.readTimeout = 1200
        c.requestMethod = "GET"
        val code = c.responseCode
        c.disconnect()
        code == 200
    } catch (_: Exception) { false }

    private fun scheduleRestart() {
        scope.launch {
            delay(restartDelay)
            restartDelay = (restartDelay * 2).coerceAtMost(30_000L)
            if (!running.get() && process == null) startServer()
        }
    }

    private fun restartServer() {
        scope.launch {
            try { process?.destroy() } catch (_: Exception) {}
            process = null
            running.set(false)
            healthy = false
            delay(800)
            startServer()
        }
    }

    private fun stopEverything() {
        running.set(false)
        healthy = false
        try { process?.destroy() } catch (_: Exception) {}
        process = null
        stopSelf()
    }

    private fun buildNotification(text: String): Notification {
        val open = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, App.CHANNEL_ID)
            .setContentTitle("Roblox MCP 运行中")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.stat_sys_download_done)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setContentIntent(open)
            .build()
    }

    private fun updateNotification(text: String) {
        statusText = text
        try {
            val nm = getSystemService(NotificationManager::class.java)
            nm.notify(NOTIF_ID, buildNotification(text))
        } catch (_: Exception) {}
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        try {
            startService(Intent(this, McpService::class.java))
            if (Settings.canDrawOverlays(this)) FloatingService.start(this)
        } catch (e: Exception) { Log.w(TAG, "revive failed: ${e.message}") }
        super.onTaskRemoved(rootIntent)
    }

    override fun onDestroy() {
        try { wakeLock?.release() } catch (_: Exception) {}
        scope.cancel()
        instance = null
        super.onDestroy()
    }

    companion object {
        const val TAG = "McpService"
        const val NOTIF_ID = 1001
        const val ACTION_STOP = "com.milk.robloxmcp.STOP"
        const val ACTION_RESTART = "com.milk.robloxmcp.RESTART"
        @Volatile var instance: McpService? = null
            private set
        @Volatile var statusText: String = "未启动"
        @Volatile var gameLabel: String = ""
        @Volatile var placeId: String = ""
        @Volatile var clientCount: Int = 0
        @Volatile var toolCount: Int = 289
        fun start(ctx: Context) {
            val i = Intent(ctx, McpService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ctx.startForegroundService(i)
            else ctx.startService(i)
        }
        fun stop(ctx: Context) {
            ctx.startService(Intent(ctx, McpService::class.java).setAction(ACTION_STOP))
        }
        fun restart(ctx: Context) {
            ctx.startService(Intent(ctx, McpService::class.java).setAction(ACTION_RESTART))
        }
        val isRunning: Boolean get() = instance != null
    }
}
