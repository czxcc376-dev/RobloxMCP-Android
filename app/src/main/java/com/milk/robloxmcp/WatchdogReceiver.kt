package com.milk.robloxmcp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class WatchdogReceiver : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent?) {
        if (!McpService.isRunning) McpService.start(ctx)
        if (!FloatingService.isRunning) FloatingService.start(ctx)
    }
}
