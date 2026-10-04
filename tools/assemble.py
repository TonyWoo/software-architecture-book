#!/usr/bin/env python3
"""按（语言，技术栈）装配 bookwriter 手稿。

把 content/<lang>/ 里的 {{code:<id>}} 标记替换为 code/<stack>/<id>.<ext> 的代码块，
输出到仓库根的 manuscript/（bookwriter 磁盘格式），下游的 export_manuscript.py、
PDF 构建、站点导入、CI 都不用改。

用法：
    python3 tools/assemble.py --lang zh --stack csharp   # 默认：中文 C# 版
    python3 tools/assemble.py --lang zh --stack java     # 中文 Java 版
    python3 tools/assemble.py --lang en --stack csharp   # 英文版（预留）

STACKS = {"csharp": ("cs", "csharp"), "java": ("java", "java")}
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STACKS = {
    "csharp": ("cs", "csharp"),
    "java": ("java", "java"),
}
# 技术栈在标题里的中文名
STACK_LABELS = {
    "csharp": "C#",
    "java": "Java",
}
MARKER_RE = re.compile(r"\{\{code:([^}]+)\}\}")
# 技术栈内联标记：{{stack:C#版文案|Java版文案}}，按 --stack 二选一
STACK_RE = re.compile(r"\{\{stack:([^}|]+)\|([^}]+)\}\}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", default="zh")
    ap.add_argument("--stack", default="csharp", choices=list(STACKS))
    ap.add_argument("--out", default=None, help="输出目录（默认：仓库根 manuscript/）")
    args = ap.parse_args()

    src = ROOT / "content" / args.lang
    if not src.is_dir():
        sys.exit(f"错误：content/{args.lang}/ 不存在（英文版尚未翻译）")
    ext, fence = STACKS[args.stack]
    code_dir = ROOT / "code" / args.stack
    out = Path(args.out) if args.out else ROOT / "manuscript"

    used: set[str] = set()
    missing: list[str] = []
    total = 0
    current_file = ""

    def repl(m: re.Match) -> str:
        cid = m.group(1)
        p = code_dir / f"{cid}.{ext}"
        if not p.is_file():
            missing.append(f"{cid}（见 {current_file}）")
            return m.group(0)  # 保留标记，稍后报错
        used.add(cid)
        code = p.read_text(encoding="utf-8").rstrip("\n")
        return f"```{fence}\n{code}\n```"

    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(src, out)

    # 书名：语言级 book.yaml + 技术栈后缀，写进输出目录供下游（PDF/站点）使用
    book_meta = {}
    for line in (ROOT / "book.yaml").read_text(encoding="utf-8").splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            book_meta[k.strip()] = v.strip()
    label = STACK_LABELS[args.stack]
    book_lines = [
        f"title: {book_meta.get('title', '')}（{label}版）",
        f"subtitle: {book_meta.get('subtitle', '')}",
    ]
    (out / "book.yaml").write_text("\n".join(book_lines) + "\n", encoding="utf-8")

    for md in sorted(out.rglob("*.md")):
        current_file = str(md.relative_to(out))
        text = md.read_text(encoding="utf-8")
        new_text, n = MARKER_RE.subn(repl, text)
        if n:
            total += n
        # 技术栈内联标记：csharp 取 | 前，java 取 | 后
        new_text, ns = STACK_RE.subn(
            lambda m: m.group(1) if args.stack == "csharp" else m.group(2), new_text
        )
        if n or ns:
            md.write_text(new_text, encoding="utf-8")

    if missing:
        print("错误：以下标记找不到对应代码文件：", file=sys.stderr)
        for x in missing:
            print(f"  - {x}", file=sys.stderr)
        sys.exit(1)

    # 残留的 stack 标记说明格式写错了（如缺 |）
    leftover = [
        str(md.relative_to(out))
        for md in sorted(out.rglob("*.md"))
        if "{{stack:" in md.read_text(encoding="utf-8")
    ]
    if leftover:
        print(f"错误：{len(leftover)} 个文件有未解析的 {{{{stack:}}}} 标记：", file=sys.stderr)
        for x in leftover:
            print(f"  - {x}", file=sys.stderr)
        sys.exit(1)

    # 覆盖率检查：code/<stack>/ 下每个文件都应被引用（stubs 除外）
    all_ids = {
        str(p.relative_to(code_dir)).removesuffix(f".{ext}")
        for p in code_dir.rglob(f"*.{ext}")
        if "stubs" not in p.parts
    }
    unused = all_ids - used
    if unused:
        print(f"警告：{len(unused)} 个代码文件未被正文引用：", file=sys.stderr)
        for x in sorted(unused)[:10]:
            print(f"  - {x}", file=sys.stderr)

    print(f"assemble: lang={args.lang} stack={args.stack}，注入 {total} 个代码块 -> manuscript/")


if __name__ == "__main__":
    main()
