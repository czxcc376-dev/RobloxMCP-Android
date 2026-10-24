package com.milk.robloxmcp

import android.content.Context
import android.content.res.AssetManager
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.atomic.AtomicBoolean

object ServerCore {
    private val installing = AtomicBoolean(false)
    private const val MARKER = ".installed_v4"

    fun serverDir(ctx: Context) = File(ctx.filesDir, "server")
    fun nodeBin(ctx: Context) = File(ctx.applicationInfo.nativeLibraryDir, "libnode.so")
    fun libDir(ctx: Context) = File(ctx.applicationInfo.nativeLibraryDir)

    /** assets/server 直接拷到 filesDir/server，无解压 */
    fun ensureInstalled(ctx: Context, onLog: (String) -> Unit = {}): File {
        val dir = serverDir(ctx)
        if (File(dir, MARKER).exists() && File(dir, "dist/interface/launcher.js").exists()) {
            return dir
        }
        if (!installing.compareAndSet(false, true)) {
            var waited = 0
            while (installing.get() && waited < 300_000) { Thread.sleep(150); waited += 150 }
            return dir
        }
        try {
            onLog("首次启动：复制服务端…")
            dir.deleteRecursively()
            dir.mkdirs()
            val t0 = System.currentTimeMillis()
            val am = ctx.assets
            var count = copyDir(am, "server", dir) { n ->
                if (n % 500 == 0) onLog("已复制 $n 个文件…")
            }
            val ms = System.currentTimeMillis() - t0
            if (!File(dir, "dist/interface/launcher.js").exists()) {
                throw IllegalStateException("复制不完整：launcher.js 缺失（$count 文件）")
            }
            File(dir, MARKER).writeText("ok")
            onLog("服务端就绪：$count 文件 / ${ms}ms")
            return dir
        } catch (t: Throwable) {
            onLog("复制失败：" + (t.message ?: t.toString()))
            throw t
        } finally {
            installing.set(false)
        }
    }

    private fun copyDir(
        am: AssetManager,
        assetPath: String,
        target: File,
        progress: (Int) -> Unit
    ): Int {
        var total = 0
        val children = try { am.list(assetPath) } catch (_: Exception) { null } ?: return 0
        if (children.isEmpty()) {
            // 是文件
            target.parentFile?.mkdirs()
            am.open(assetPath).use { ins ->
                FileOutputStream(target).use { out -> ins.copyTo(out, 64 * 1024) }
            }
            return 1
        }
        target.mkdirs()
        for (child in children) {
            val cPath = "$assetPath/$child"
            val cTarget = File(target, child)
            val sub = try { am.list(cPath) } catch (_: Exception) { emptyArray() }
            if (sub != null && sub.isNotEmpty()) {
                total += copyDir(am, cPath, cTarget, progress)
            } else {
                cTarget.parentFile?.mkdirs()
                am.open(cPath).use { ins ->
                    FileOutputStream(cTarget).use { out -> ins.copyTo(out, 64 * 1024) }
                }
                total++
                progress(total)
            }
        }
        return total
    }

    /** Node 按 soname 找依赖，jniLibs 只能放 lib*.so，故建软链 */
    fun prepareSonames(ctx: Context, onLog: (String) -> Unit = {}) {
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
    }
}
