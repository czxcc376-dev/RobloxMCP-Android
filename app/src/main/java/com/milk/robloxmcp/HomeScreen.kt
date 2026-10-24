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
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

@Composable
fun HomeScreen(activity: MainActivity) {
    val ctx = activity
    var info by remember { mutableStateOf(BridgeInfo()) }
    var status by remember { mutableStateOf("未启动") }
    var overlayOk by remember { mutableStateOf(canOverlay(ctx)) }

    LaunchedEffect(Unit) {
        McpService.start(ctx)
        if (overlayOk) FloatingService.start(ctx)
        while (true) {
            val i = withContext(Dispatchers.IO) { BridgeClient.fetchInfo() }
            info = i
            status = McpService.statusText
            overlayOk = canOverlay(ctx)
            delay(1500)
        }
    }

    Column(
        Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFF0B0F14), Color(0xFF0E1520))))
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier.size(10.dp)
                    .background(
                        if (info.healthy) Color(0xFF4ADE80) else Color(0xFFFF5252),
                        RoundedCornerShape(50)
                    )
            )
            Spacer(Modifier.width(8.dp))
            Text("Roblox MCP", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFFEAF2FF))
            Spacer(Modifier.weight(1f))
            Text(if (info.healthy) "在线" else "离线", fontSize = 12.sp,
                color = if (info.healthy) Color(0xFF4ADE80) else Color(0xFFFF8A80))
        }

        Card(colors = CardDefaults.cardColors(Color(0xFF121A23)), shape = RoundedCornerShape(16.dp)) {
            Column(Modifier.padding(14.dp)) {
                Text("服务地址", fontSize = 11.sp, color = Color(0xFF8FA3B8))
                Spacer(Modifier.height(4.dp))
                Text("http://127.0.0.1:${App.PORT}", fontSize = 16.sp,
                    fontFamily = FontFamily.Monospace, color = Color(0xFF63A8FF))
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { copy(ctx, "http://127.0.0.1:${App.PORT}") },
                        modifier = Modifier.weight(1f)) { Text("复制地址", fontSize = 12.sp) }
                    OutlinedButton(onClick = {
                        ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("http://127.0.0.1:${App.PORT}/")))
                    }, modifier = Modifier.weight(1f)) { Text("打开面板", fontSize = 12.sp) }
                }
            }
        }

        Card(colors = CardDefaults.cardColors(Color(0xFF121A23)), shape = RoundedCornerShape(16.dp)) {
            Column(Modifier.padding(14.dp)) {
                Text("注入脚本（复制到执行器运行）", fontSize = 11.sp, color = Color(0xFF8FA3B8))
                Spacer(Modifier.height(6.dp))
                Text(
                    BridgeClient.loaderScript(),
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    color = Color(0xFFB9C7D8)
                )
                Spacer(Modifier.height(8.dp))
                Button(onClick = { copy(ctx, BridgeClient.loaderScript()) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(Color(0xFF3D8BFF))) {
                    Text("一键复制注入脚本", fontSize = 13.sp)
                }
            }
        }

        Card(colors = CardDefaults.cardColors(Color(0xFF121A23)), shape = RoundedCornerShape(16.dp)) {
            Column(Modifier.padding(14.dp)) {
                Text("运行信息", fontSize = 11.sp, color = Color(0xFF8FA3B8))
                Spacer(Modifier.height(6.dp))
                InfoRow("状态", status)
                InfoRow("当前地图", info.game.ifBlank { "—" })
                InfoRow("PlaceId", info.placeId.ifBlank { "—" })
                InfoRow("在线客户端", info.clients.toString())
                InfoRow("工具总数", info.tools.toString())
            }
        }

        Card(colors = CardDefaults.cardColors(Color(0xFF121A23)), shape = RoundedCornerShape(16.dp)) {
            Column(Modifier.padding(14.dp)) {
                Text("保活与权限", fontSize = 11.sp, color = Color(0xFF8FA3B8))
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = {
                        if (!canOverlay(ctx)) requestOverlay(ctx) else FloatingService.start(ctx)
                    }, modifier = Modifier.weight(1f)) {
                        Text(if (overlayOk) "悬浮窗已开" else "开悬浮窗", fontSize = 12.sp)
                    }
                    OutlinedButton(onClick = { requestBattery(ctx) }, modifier = Modifier.weight(1f)) {
                        Text("电池白名单", fontSize = 12.sp)
                    }
                }
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(onClick = { McpService.restart(ctx) }, modifier = Modifier.weight(1f)) {
                        Text("重启服务", fontSize = 12.sp)
                    }
                    OutlinedButton(onClick = { McpService.stop(ctx); FloatingService.stop(ctx) },
                        modifier = Modifier.weight(1f)) {
                        Text("停止全部", fontSize = 12.sp)
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun InfoRow(k: String, v: String) {
    Row(Modifier.fillMaxWidth().padding(vertical = 3.dp)) {
        Text(k, fontSize = 12.sp, color = Color(0xFF8FA3B8))
        Spacer(Modifier.weight(1f))
        Text(v, fontSize = 12.sp, color = Color(0xFFEAF2FF), fontFamily = FontFamily.Monospace)
    }
}

private fun copy(ctx: Context, text: String) {
    val cm = ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    cm.setPrimaryClip(ClipData.newPlainText("mcp", text))
    Toast.makeText(ctx, "已复制", Toast.LENGTH_SHORT).show()
}

private fun canOverlay(ctx: Context): Boolean =
    if (Build.VERSION.SDK_INT >= 23) Settings.canDrawOverlays(ctx) else true

private fun requestOverlay(ctx: Context) {
    if (Build.VERSION.SDK_INT >= 23) {
        ctx.startActivity(
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + ctx.packageName))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        )
    }
}

private fun requestBattery(ctx: Context) {
    try {
        val pm = ctx.getSystemService(Context.POWER_SERVICE) as PowerManager
        if (!pm.isIgnoringBatteryOptimizations(ctx.packageName)) {
            ctx.startActivity(
                Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                    Uri.parse("package:" + ctx.packageName)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            )
        } else Toast.makeText(ctx, "已在白名单", Toast.LENGTH_SHORT).show()
    } catch (_: Exception) {}
}
