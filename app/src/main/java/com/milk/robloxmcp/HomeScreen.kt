package com.milk.robloxmcp

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

private val Bg0 = Color(0xFF070A0F)
private val Bg1 = Color(0xFF0D131C)
private val CardBg = Color(0xFF141C27)
private val Line = Color(0xFF22303F)
private val TxtHi = Color(0xFFF2F6FC)
private val TxtLo = Color(0xFF8FA3BB)
private val Accent = Color(0xFF4C8DFF)
private val Green = Color(0xFF35D07F)
private val Red = Color(0xFFFF5C5C)
private val Amber = Color(0xFFFFB648)

@Composable
fun HomeScreen(activity: MainActivity) {
    val ctx = activity
    var info by remember { mutableStateOf(BridgeInfo()) }
    var status by remember { mutableStateOf("未启动") }
    var overlayOk by remember { mutableStateOf(canOverlay(ctx)) }
    var showLog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        McpService.start(ctx)
        if (canOverlay(ctx)) FloatingService.start(ctx)
        var autoStarted = false
        while (true) {
            info = withContext(Dispatchers.IO) { BridgeClient.fetchInfo() }
            status = McpService.statusText
            val ok = canOverlay(ctx)
            if (ok && !autoStarted && !FloatingService.isRunning) {
                FloatingService.start(ctx); autoStarted = true
            }
            overlayOk = ok
            delay(1500)
        }
    }

    Box(
        Modifier.fillMaxSize().background(
            Brush.verticalGradient(listOf(Bg0, Bg1, Color(0xFF0A1017)))
        )
    ) {
        Column(
            Modifier.fillMaxSize().verticalScroll(rememberScrollState())
                .padding(horizontal = 18.dp)
                .padding(top = 44.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Header(info.healthy)
            if (!overlayOk) OverlayCard { openOverlaySettings(ctx) }
            AddressCard(ctx, info)
            ScriptCard(ctx)
            InfoCard(info, status)
            ActionCard(ctx, overlayOk)
            LogCard(showLog) { showLog = !showLog }
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
private fun Header(online: Boolean) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier.size(44.dp).clip(RoundedCornerShape(14.dp))
                .background(Brush.linearGradient(listOf(Accent, Color(0xFF7A5BFF)))),
            contentAlignment = Alignment.Center
        ) {
            Text("R", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text("Roblox MCP", fontSize = 19.sp, fontWeight = FontWeight.Bold, color = TxtHi)
            Text("289 tools · 本地桥接", fontSize = 11.sp, color = TxtLo)
        }
        Pill(if (online) "在线" else "离线", if (online) Green else Red)
    }
}

@Composable
private fun Pill(text: String, color: Color) {
    Box(
        Modifier.clip(CircleShape).background(color.copy(alpha = 0.14f))
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(7.dp).clip(CircleShape).background(color))
            Spacer(Modifier.width(6.dp))
            Text(text, fontSize = 11.sp, color = color, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun OverlayCard(onClick: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(Color(0xFF2A1E0C)),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Amber.copy(alpha = 0.45f))
    ) {
        Column(Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.size(8.dp).clip(CircleShape).background(Amber))
                Spacer(Modifier.width(8.dp))
                Text("需要悬浮窗权限", fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold, color = Amber)
            }
            Spacer(Modifier.height(8.dp))
            Text(
                "授予后悬浮窗可在后台常驻，划掉 App 服务也不会断。",
                fontSize = 12.sp, color = Color(0xFFE2C9A2), lineHeight = 18.sp
            )
            Spacer(Modifier.height(14.dp))
            Button(
                onClick = onClick,
                modifier = Modifier.fillMaxWidth().height(46.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Amber)
            ) {
                Text("去授权", fontSize = 14.sp, fontWeight = FontWeight.Bold,
                    color = Color(0xFF1C1206))
            }
        }
    }
}

@Composable
private fun AddressCard(ctx: Context, info: BridgeInfo) {
    Card(
        colors = CardDefaults.cardColors(CardBg),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Line)
    ) {
        Column(Modifier.padding(18.dp)) {
            Text("服务地址", fontSize = 11.sp, color = TxtLo)
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "127.0.0.1:${App.PORT}",
                    fontSize = 20.sp, fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Medium, color = TxtHi,
                    modifier = Modifier.weight(1f)
                )
                Box(
                    Modifier.size(10.dp).clip(CircleShape)
                        .background(if (info.healthy) Green else Red)
                )
            }
            Spacer(Modifier.height(14.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                SoftButton("复制地址", Modifier.weight(1f)) {
                    copy(ctx, "http://127.0.0.1:${App.PORT}")
                }
                SoftButton("打开面板", Modifier.weight(1f)) {
                    try {
                        ctx.startActivity(
                            Intent(Intent.ACTION_VIEW, Uri.parse("http://127.0.0.1:${App.PORT}/"))
                        )
                    } catch (_: Exception) {}
                }
            }
        }
    }
}

@Composable
private fun SoftButton(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.height(42.dp),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, Line),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = TxtHi)
    ) {
        Text(text, fontSize = 13.sp)
    }
}

@Composable
private fun ScriptCard(ctx: Context) {
    Card(
        colors = CardDefaults.cardColors(CardBg),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Line)
    ) {
        Column(Modifier.padding(18.dp)) {
            Text("注入脚本", fontSize = 11.sp, color = TxtLo)
            Spacer(Modifier.height(4.dp))
            Text("复制后到执行器里运行", fontSize = 11.sp, color = TxtLo.copy(alpha = 0.7f))
            Spacer(Modifier.height(12.dp))
            Box(
                Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF0A1017)).padding(12.dp)
            ) {
                Text(
                    BridgeClient.loaderScript(),
                    fontSize = 11.sp, fontFamily = FontFamily.Monospace,
                    color = Color(0xFF9FD3B0), lineHeight = 17.sp
                )
            }
            Spacer(Modifier.height(14.dp))
            Button(
                onClick = { copy(ctx, BridgeClient.loaderScript()) },
                modifier = Modifier.fillMaxWidth().height(46.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Accent)
            ) {
                Text("一键复制", fontSize = 14.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun InfoCard(info: BridgeInfo, status: String) {
    Card(
        colors = CardDefaults.cardColors(CardBg),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Line)
    ) {
        Column(Modifier.padding(18.dp)) {
            Text("运行信息", fontSize = 11.sp, color = TxtLo)
            Spacer(Modifier.height(12.dp))
            MetricRow("状态", status)
            MetricRow("当前地图", info.game.ifBlank { "—" })
            MetricRow("PlaceId", info.placeId.ifBlank { "—" })
            MetricRow("在线客户端", info.clients.toString())
            MetricRow("工具总数", info.tools.toString())
        }
    }
}

@Composable
private fun MetricRow(k: String, v: String) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 7.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(k, fontSize = 13.sp, color = TxtLo)
        Spacer(Modifier.weight(1f))
        Text(
            v, fontSize = 13.sp, color = TxtHi,
            fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun ActionCard(ctx: Context, overlayOk: Boolean) {
    Card(
        colors = CardDefaults.cardColors(CardBg),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Line)
    ) {
        Column(Modifier.padding(18.dp)) {
            Text("保活", fontSize = 11.sp, color = TxtLo)
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                SoftButton(
                    when {
                        !overlayOk -> "授权悬浮窗"
                        FloatingService.isRunning -> "悬浮窗已开"
                        else -> "开悬浮窗"
                    }, Modifier.weight(1f)
                ) {
                    if (!overlayOk) openOverlaySettings(ctx) else FloatingService.start(ctx)
                }
                SoftButton("电池白名单", Modifier.weight(1f)) { requestBattery(ctx) }
            }
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                SoftButton("重启服务", Modifier.weight(1f)) { McpService.restart(ctx) }
                SoftButton("停止全部", Modifier.weight(1f)) {
                    McpService.stop(ctx); FloatingService.stop(ctx)
                }
            }
        }
    }
}

@Composable
private fun LogCard(expanded: Boolean, toggle: () -> Unit) {
    var tick by remember { mutableStateOf(0) }
    LaunchedEffect(expanded) {
        while (expanded) { delay(1000); tick++ }
    }
    Card(
        colors = CardDefaults.cardColors(CardBg),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Line)
    ) {
        Column(Modifier.padding(18.dp)) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Text("运行日志", fontSize = 11.sp, color = TxtLo)
                Spacer(Modifier.weight(1f))
                TextButton(onClick = toggle) {
                    Text(if (expanded) "收起" else "展开", fontSize = 12.sp, color = Accent)
                }
            }
            if (expanded) {
                val lines = remember(tick, expanded) { Logs.snapshot().takeLast(60) }
                Box(
                    Modifier.fillMaxWidth().height(220.dp).clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF080C12)).padding(10.dp)
                ) {
                    Column(Modifier.verticalScroll(rememberScrollState())) {
                        if (lines.isEmpty()) {
                            Text("暂无日志", fontSize = 11.sp, color = TxtLo)
                        } else {
                            lines.forEach {
                                Text(
                                    it, fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = Color(0xFF9FD3B0),
                                    lineHeight = 15.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun copy(ctx: Context, text: String) {
    val cm = ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    cm.setPrimaryClip(ClipData.newPlainText("mcp", text))
    Toast.makeText(ctx, "已复制", Toast.LENGTH_SHORT).show()
}

fun canOverlay(ctx: Context): Boolean =
    if (Build.VERSION.SDK_INT >= 23) Settings.canDrawOverlays(ctx) else true

fun openOverlaySettings(ctx: Context) {
    if (Build.VERSION.SDK_INT < 23) return
    val pkgUri = Uri.parse("package:" + ctx.packageName)
    val list = mutableListOf<Intent>()
    list += Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, pkgUri)
    list += Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
    list += Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, pkgUri)
    list += Intent().setClassName("com.coloros.safecenter",
        "com.coloros.safecenter.permission.floatwindow.FloatWindowListActivity")
    list += Intent().setClassName("com.oplus.safecenter",
        "com.oplus.safecenter.permission.floatwindow.FloatWindowListActivity")
    for (i in list) {
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { ctx.startActivity(i); return } catch (_: Exception) {}
    }
    Toast.makeText(ctx, "请到 设置→应用→特殊权限→显示在其他应用上层 手动开启",
        Toast.LENGTH_LONG).show()
}

private fun requestBattery(ctx: Context) {
    try {
        val pm = ctx.getSystemService(Context.POWER_SERVICE) as PowerManager
        if (!pm.isIgnoringBatteryOptimizations(ctx.packageName)) {
            ctx.startActivity(
                Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                    Uri.parse("package:" + ctx.packageName))
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        } else Toast.makeText(ctx, "已在白名单", Toast.LENGTH_SHORT).show()
    } catch (_: Exception) {}
}
