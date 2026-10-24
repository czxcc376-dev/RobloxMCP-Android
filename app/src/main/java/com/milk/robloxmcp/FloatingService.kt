package com.milk.robloxmcp

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.*
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.view.*
import android.widget.*
import kotlinx.coroutines.*
import java.net.HttpURLConnection
import java.net.URL

class FloatingService : Service() {

    private var wm: WindowManager? = null
    private var card: View? = null
    private var bubble: View? = null
    private lateinit var lp: WindowManager.LayoutParams
    private lateinit var blp: WindowManager.LayoutParams
    private val handler = Handler(Looper.getMainLooper())
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private lateinit var tvStatus: TextView
    private lateinit var tvAddr: TextView
    private lateinit var tvGame: TextView
    private lateinit var tvStats: TextView
    private lateinit var dot: View
    private lateinit var bubbleDot: View

    private var collapsed = false
    private var downX = 0f
    private var downY = 0f
    private var startX = 0
    private var startY = 0
    private var downTime = 0L

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        if (!Settings.canDrawOverlays(this)) {
            overlayMissing = true
            stopSelf()
            return
        }
        overlayMissing = false
        instance = this
        wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        try {
            createPanel()
            startTicker()
        } catch (t: Throwable) {
            overlayMissing = true
            clearViews()
            stopSelf()
        }
    }

    private fun clearViews() {
        try { card?.let { wm?.removeView(it) } } catch (_: Exception) {}
        try { bubble?.let { wm?.removeView(it) } } catch (_: Exception) {}
        card = null
        bubble = null
    }

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()

    private fun smallButton(label: String): TextView = TextView(this).apply {
        text = label
        setTextColor(Color.parseColor("#8FA3B8"))
        textSize = 12f
        gravity = Gravity.CENTER
        width = dp(24); height = dp(24)
    }

    private fun createPanel() {
        val ctx = this
        val panel = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(14), dp(10), dp(14), dp(12))
            background = GradientDrawable().apply {
                cornerRadius = dp(18).toFloat()
                setColor(Color.parseColor("#E60F151C"))
                setStroke(dp(1), Color.parseColor("#2A3F55"))
            }
        }

        val header = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        dot = View(ctx).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.parseColor("#FF5252"))
            }
        }
        header.addView(dot, LinearLayout.LayoutParams(dp(9), dp(9)).apply { marginEnd = dp(7) })
        val title = TextView(ctx).apply {
            text = "Roblox MCP"
            setTextColor(Color.parseColor("#EAF2FF"))
            textSize = 13f
            setTypeface(typeface, Typeface.BOLD)
        }
        header.addView(title, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        val btnMin = smallButton("—")
        val btnClose = smallButton("✕")
        header.addView(btnMin)
        header.addView(btnClose)
        panel.addView(header)

        tvStatus = TextView(ctx).apply {
            text = "未启动"; setTextColor(Color.parseColor("#7FE3A1")); textSize = 11f
            setPadding(0, dp(5), 0, 0)
        }
        panel.addView(tvStatus)

        tvAddr = TextView(ctx).apply {
            text = "127.0.0.1:${App.PORT}"; setTextColor(Color.parseColor("#63A8FF"))
            textSize = 12f; setTypeface(Typeface.MONOSPACE)
            setPadding(0, dp(3), 0, 0)
        }
        panel.addView(tvAddr)

        tvGame = TextView(ctx).apply {
            text = "地图：—"; setTextColor(Color.parseColor("#B9C7D8")); textSize = 11f
            setPadding(0, dp(3), 0, 0); maxLines = 2
        }
        panel.addView(tvGame)

        tvStats = TextView(ctx).apply {
            text = "客户端 0 · 工具 289"; setTextColor(Color.parseColor("#8FA3B8")); textSize = 10f
            setPadding(0, dp(3), 0, 0)
        }
        panel.addView(tvStats)

        card = panel
        lp = WindowManager.LayoutParams(
            dp(190), WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= 26) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = dp(12); y = dp(120)
        }
        try {
            wm?.addView(panel, lp)
        } catch (t: Throwable) {
            overlayMissing = true
            stopSelf()
            return
        }

        btnMin.setOnClickListener { toggleCollapse() }
        btnClose.setOnClickListener { stopSelf() }
        panel.setOnTouchListener(dragListener)
        buildBubble()
    }

    private fun buildBubble() {
        val ctx = this
        val wrap = FrameLayout(ctx).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.parseColor("#E6101822"))
                setStroke(dp(2), Color.parseColor("#3D8BFF"))
            }
        }
        bubbleDot = View(ctx).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.parseColor("#FF5252"))
            }
        }
        wrap.addView(bubbleDot, FrameLayout.LayoutParams(dp(14), dp(14), Gravity.CENTER))
        bubble = wrap
        blp = WindowManager.LayoutParams(
            dp(46), dp(46),
            if (Build.VERSION.SDK_INT >= 26) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = dp(12); y = dp(120)
        }
        wrap.setOnTouchListener(dragListener)
        wrap.setOnClickListener { expand() }
    }

    private val dragListener = View.OnTouchListener { _, ev ->
        when (ev.action) {
            MotionEvent.ACTION_DOWN -> {
                downX = ev.rawX; downY = ev.rawY
                downTime = System.currentTimeMillis()
                true
            }
            MotionEvent.ACTION_MOVE -> {
                val dx = (ev.rawX - downX).toInt()
                val dy = (ev.rawY - downY).toInt()
                val target = if (collapsed) blp else lp
                target.x = startX + dx
                target.y = startY + dy
                val v = if (collapsed) bubble else card
                try { wm?.updateViewLayout(v, target) } catch (_: Exception) {}
                true
            }
            MotionEvent.ACTION_UP -> {
                val target = if (collapsed) blp else lp
                startX = target.x; startY = target.y
                true
            }
            else -> false
        }
    }

    private fun toggleCollapse() {
        collapsed = true
        try { wm?.removeView(card) } catch (_: Exception) {}
        try { wm?.addView(bubble, blp) } catch (_: Exception) {}
    }

    private fun expand() {
        collapsed = false
        try { wm?.removeView(bubble) } catch (_: Exception) {}
        try { wm?.addView(card, lp) } catch (_: Exception) {}
    }

    private fun startTicker() {
        handler.post(object : Runnable {
            override fun run() {
                scope.launch { refresh() }
                handler.postDelayed(this, 2000)
            }
        })
    }

    private suspend fun refresh() {
        val info = BridgeClient.fetchInfo()
        handler.post {
            val ok = info.healthy
            try {
                dot.background = GradientDrawable().apply {
                    shape = GradientDrawable.OVAL
                    setColor(Color.parseColor(if (ok) "#4ADE80" else "#FF5252"))
                }
                bubbleDot.background = GradientDrawable().apply {
                    shape = GradientDrawable.OVAL
                    setColor(Color.parseColor(if (ok) "#4ADE80" else "#FF5252"))
                }
            } catch (_: Exception) {}
            tvStatus.text = if (ok) "服务运行中" else (McpService.instance?.lastError ?: "未连接")
            tvStatus.setTextColor(Color.parseColor(if (ok) "#7FE3A1" else "#FF8A80"))
            tvGame.text = if (info.game.isNotBlank()) "地图：${info.game}" else "地图：未连接客户端"
            tvStats.text = "客户端 ${info.clients} · 工具 ${info.tools}"
        }
    }

    override fun onDestroy() {
        instance = null
        scope.cancel()
        handler.removeCallbacksAndMessages(null)
        clearViews()
        super.onDestroy()
    }

    companion object {
        @Volatile var instance: FloatingService? = null
            private set
        @Volatile var overlayMissing: Boolean = false
        val isRunning: Boolean get() = instance != null
        fun start(ctx: Context) {
            if (!Settings.canDrawOverlays(ctx)) { overlayMissing = true; return }
            overlayMissing = false
            try { ctx.startService(Intent(ctx, FloatingService::class.java)) } catch (_: Exception) {}
        }
        fun stop(ctx: Context) {
            try { ctx.stopService(Intent(ctx, FloatingService::class.java)) } catch (_: Exception) {}
        }
    }
}
