package com.milk.robloxmcp

import android.content.Context
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.atomic.AtomicBoolean
import java.util.zip.GZIPInputStream

object ServerCore {
    private val extracting = AtomicBoolean(false)
    @Volatile var installed: File? = null
        private set

    fun serverDir(ctx: Context) = File(ctx.filesDir, "server")
    fun nodeBin(ctx: Context) = File(ctx.applicationInfo.nativeLibraryDir, "libnode.so")

    /** 首次启动解压 assets/server.tar.gz 到 filesDir/server */
    fun ensureInstalled(ctx: Context, onLog: (String) -> Unit = {}): File {
        val dir = serverDir(ctx)
        val marker = File(dir, ".installed_v1")
        if (marker.exists() && File(dir, "dist/interface/launcher.js").exists()) {
            installed = dir
            return dir
        }
        if (!extracting.compareAndSet(false, true)) {
            while (extracting.get()) Thread.sleep(100)
            return dir
        }
        try {
            onLog("正在解压服务端…")
            dir.deleteRecursively()
            dir.mkdirs()
            ctx.assets.open("server.tar.gz").use { raw ->
                GZIPInputStream(raw).use { gz ->
                    extractTar(gz, dir)
                }
            }
            marker.writeText("ok")
            onLog("服务端解压完成")
            installed = dir
            return dir
        } finally {
            extracting.set(false)
        }
    }

    /** 极简 tar 解包（支持 ustar，够用） */
    private fun extractTar(input: java.io.InputStream, dest: File) {
        val buf = ByteArray(512)
        var remaining = 0
        var current: File? = null
        var remainingBytes = 0L

        fun readFully(n: Int): Int {
            var off = 0
            while (off < n) {
                val r = input.read(buf, off, n - off)
                if (r < 0) break
                off += r
            }
            return off
        }

        while (true) {
            if (remainingBytes > 0 && current != null) {
                val toRead = minOf(remainingBytes, buf.size.toLong()).toInt()
                val got = readFully(toRead)
                if (got <= 0) break
                FileOutputStream(current, true).use { it.write(buf, 0, got) }
                remainingBytes -= got
                if (remainingBytes == 0L) current = null
                if (got < toRead) break
                continue
            }
            if (readFully(512) < 512) break
            if (buf.all { it == 0.toByte() }) continue
            val name = String(buf, 0, 100).trimEnd('\u0000')
            if (name.isEmpty()) break
            val sizeStr = String(buf, 124, 12).trimEnd('\u0000').trim()
            val size = if (sizeStr.isEmpty()) 0L else sizeStr.toLong(8)
            val type = buf[156].toInt().toChar()
            val cleanName = name.removePrefix("./").removePrefix("server/")
            if (cleanName.isEmpty() || cleanName == "/") continue
            val out = File(dest, cleanName)
            if (!out.canonicalPath.startsWith(dest.canonicalPath)) continue
            when (type) {
                '5' -> out.mkdirs()
                '0', '\u0000' -> {
                    out.parentFile?.mkdirs()
                    current = out
                    remainingBytes = size
                }
            }
            remaining += 0
        }
    }

    fun copyConnector(ctx: Context): File {
        val f = File(ctx.filesDir, "connector.luau")
        ctx.assets.open("connector.luau").use { i ->
            FileOutputStream(f).use { o -> i.copyTo(o) }
        }
        return f
    }
}
