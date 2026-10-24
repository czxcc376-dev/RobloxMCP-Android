package com.milk.robloxmcp

import android.content.Context
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.atomic.AtomicBoolean
import java.util.zip.GZIPInputStream

object ServerCore {
    private val extracting = AtomicBoolean(false)

    fun serverDir(ctx: Context) = File(ctx.filesDir, "server")
    fun nodeBin(ctx: Context) = File(ctx.applicationInfo.nativeLibraryDir, "libnode.so")
    fun libDir(ctx: Context) = File(ctx.applicationInfo.nativeLibraryDir)

    fun ensureInstalled(ctx: Context, onLog: (String) -> Unit = {}): File {
        val dir = serverDir(ctx)
        val marker = File(dir, ".installed_v2")
        if (marker.exists() && File(dir, "dist/interface/launcher.js").exists()) return dir
        if (!extracting.compareAndSet(false, true)) {
            while (extracting.get()) Thread.sleep(120)
            return dir
        }
        try {
            onLog("正在解压服务端…")
            dir.deleteRecursively()
            dir.mkdirs()
            ctx.assets.open("server.tar.gz").use { raw ->
                GZIPInputStream(raw, 65536).use { gz -> extractTar(gz, dir) }
            }
            marker.writeText("ok")
            onLog("服务端解压完成")
            return dir
        } finally {
            extracting.set(false)
        }
    }

    /** Node 按 soname 找依赖（libcrypto.so.3 等），jniLibs 只能放 lib*.so，故建软链 */
    fun prepareSonames(ctx: Context, onLog: (String) -> Unit = {}): File {
        val libs = libDir(ctx)
        val pairs = listOf(
            "libcrypto.so.3" to "libcrypto.so",
            "libssl.so.3" to "libssl.so",
            "libz.so.1" to "libz.so",
            "libicuuc.so.78" to "libicuuc.so",
            "libicui18n.so.78" to "libicui18n.so",
            "libicudata.so.78" to "libicudata.so",
            "libsqlite3.so.0" to "libsqlite3.so"
        )
        for ((link, target) in pairs) {
            try {
                val lf = File(libs, link)
                if (lf.exists()) continue
                ProcessBuilder("ln", "-sf", target, lf.absolutePath).start().waitFor()
            } catch (_: Throwable) {}
        }
        onLog("运行时库就绪")
        return libs
    }

    private fun extractTar(input: java.io.InputStream, dest: File) {
        val header = ByteArray(512)
        var pending: File? = null
        var pendingLeft = 0L
        val buf = ByteArray(32768)

        fun readN(n: Int): Int {
            var off = 0
            while (off < n) {
                val r = input.read(header, off, n - off)
                if (r < 0) break
                off += r
            }
            return off
        }

        while (true) {
            if (pendingLeft > 0 && pending != null) {
                val want = minOf(pendingLeft, buf.size.toLong()).toInt()
                val got = input.read(buf, 0, want)
                if (got <= 0) break
                FileOutputStream(pending, true).use { it.write(buf, 0, got) }
                pendingLeft -= got
                if (pendingLeft <= 0) pending = null
                if (got < want) break
                continue
            }
            if (readN(512) < 512) break
            if (header[0].toInt() == 0) break
            val name = String(header, 0, 100).substringBefore('\u0000')
            val sizeStr = String(header, 124, 12).substringBefore('\u0000').trim()
            val size = try {
                if (sizeStr.isBlank()) 0L else sizeStr.toLong(8)
            } catch (_: Exception) { 0L }
            val type = header[156].toInt().toChar()
            val rel = name.removePrefix("./").removePrefix("server/")
            if (rel.isBlank()) continue
            val out = File(dest, rel)
            val cp = out.canonicalPath
            if (!cp.startsWith(dest.canonicalPath)) continue
            when (type) {
                '5' -> out.mkdirs()
                '0', '\u0000', '7' -> {
                    out.parentFile?.mkdirs()
                    out.writeBytes(ByteArray(0))
                    if (size > 0) { pending = out; pendingLeft = size }
                }
            }
        }
    }
}
