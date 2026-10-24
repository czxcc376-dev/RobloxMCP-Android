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
        val marker = File(dir, ".installed_v3")
        if (marker.exists() && File(dir, "dist/interface/launcher.js").exists()) return dir
        if (!extracting.compareAndSet(false, true)) {
            while (extracting.get()) Thread.sleep(120)
            return dir
        }
        try {
            onLog("正在解压服务端…")
            dir.deleteRecursively()
            dir.mkdirs()
            val t0 = System.currentTimeMillis()
            var files = 0
            ctx.assets.open("server.tar.gz").use { raw ->
                GZIPInputStream(raw, 1 shl 16).use { gz ->
                    files = extractTar(gz, dir) { n -> if (n % 500 == 0) onLog("已解压 $n 个文件…") }
                }
            }
            val ms = System.currentTimeMillis() - t0
            if (!File(dir, "dist/interface/launcher.js").exists())
                throw IllegalStateException("解压不完整：launcher.js 缺失")
            marker.writeText("ok")
            onLog("服务端就绪：$files 文件 / ${ms}ms")
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

    private fun extractTar(
        input: java.io.InputStream,
        dest: File,
        progress: (Int) -> Unit = {}
    ): Int {
        var files = 0
        val hdr = ByteArray(512)
        val buf = ByteArray(64 * 1024)
        val destCanon = dest.canonicalPath

        fun readBlock(): Int {
            var off = 0
            while (off < 512) {
                val r = input.read(hdr, off, 512 - off)
                if (r < 0) return off
                off += r
            }
            return 512
        }

        while (true) {
            if (readBlock() != 512) return files
            if (hdr[0].toInt() == 0) return files

            val rawName = String(hdr, 0, 100, Charsets.UTF_8).substringBefore('\u0000')
            val sizeField = String(hdr, 124, 12, Charsets.US_ASCII).substringBefore('\u0000').trim()
            var size = 0L
            try { if (sizeField.isNotEmpty()) size = sizeField.toLong(8) } catch (_: Exception) { size = 0L }
            val type = hdr[156].toInt().toChar()

            val rel = rawName.removePrefix("./").removePrefix("server/").trimEnd('/')
            if (rel.isNotEmpty()) {
                val out = File(dest, rel)
                if (out.canonicalPath.startsWith(destCanon)) {
                    when (type) {
                        '5' -> out.mkdirs()
                        else -> {
                            out.parentFile?.mkdirs()
                            java.io.FileOutputStream(out).use { fos ->
                                var left = size
                                while (left > 0) {
                                    val want = if (left > buf.size) buf.size else left.toInt()
                                    val got = input.read(buf, 0, want)
                                    if (got <= 0) break
                                    fos.write(buf, 0, got)
                                    left -= got
                                }
                            }
                            files++
                            progress(files)
                        }
                    }
                } else {
                    var left = size
                    while (left > 0) {
                        val want = if (left > buf.size) buf.size else left.toInt()
                        val got = input.read(buf, 0, want)
                        if (got <= 0) break
                        left -= got
                    }
                }
            } else {
                var left = size
                while (left > 0) {
                    val want = if (left > buf.size) buf.size else left.toInt()
                    val got = input.read(buf, 0, want)
                    if (got <= 0) break
                    left -= got
                }
            }

            val pad = ((512 - (size % 512)) % 512).toInt()
            var skipped = 0
            while (skipped < pad) {
                val r = input.read(buf, 0, minOf(pad - skipped, buf.size))
                if (r <= 0) return files
                skipped += r
            }
        }
    }
}
