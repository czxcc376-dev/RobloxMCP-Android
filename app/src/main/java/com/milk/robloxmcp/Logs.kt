package com.milk.robloxmcp

import android.util.Log
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object Logs {
    private const val MAX = 400
    private val lines = ArrayDeque<String>()
    private val fmt = SimpleDateFormat("HH:mm:ss", Locale.US)

    @Synchronized
    fun append(line: String) {
        val t = fmt.format(Date())
        lines.addLast("$t  $line")
        while (lines.size > MAX) lines.removeFirst()
    }

    @Synchronized
    fun snapshot(): List<String> = lines.toList()

    @Synchronized
    fun clear() = lines.clear()

    fun dump(): String = snapshot().joinToString("\n")
}
