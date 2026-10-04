// ============================================================
// prebuild.mjs —— 双版本书稿导入（npm run build / dev 前自动执行）
//   1. 中文 C# 版：../manuscript/（已装配，提交在仓库里）→ book/
//   2. 中文 Java 版：现场装配到临时目录 → book-java/
// ============================================================
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(ROOT, '..');

const run = (cmd, args, env = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', cwd: ROOT, env: { ...process.env, ...env } });

// 1. C# 版（默认）
run('node', ['scripts/import-book.mjs']);

// 2. Java 版：先装配，再导入
const javaSrc = mkdtempSync(join(tmpdir(), 'manuscript-java-'));
try {
  execFileSync('python3', ['tools/assemble.py', '--lang', 'zh', '--stack', 'java', '--out', javaSrc],
    { stdio: 'inherit', cwd: REPO });
  run('node', ['scripts/import-book.mjs'], { BOOK_SRC: javaSrc, BOOK_DEST: 'book-java' });
} finally {
  rmSync(javaSrc, { recursive: true, force: true });
}

console.log('prebuild: 双版本导入完成 (book/ + book-java/)');
