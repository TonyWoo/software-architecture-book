#!/usr/bin/env python3
"""把 content/zh/ 里的 ```csharp 代码块抽取到 code/csharp/，正文留 {{code:<id>}} 标记。

id 规则：<group>/<file-stem>-<nn>，如 070-data-and-persistence/030-outbox-pattern-01
manifest 写到 code/manifest.json：id -> {source, index, first_line, lines}
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "manuscript"          # 旧手稿（只读，作为抽取来源）
DST = ROOT / "content" / "zh"      # 新中文正文（含标记）
CODE = ROOT / "code" / "csharp"

FENCE_RE = re.compile(r"^```csharp\s*$")
CLOSE_RE = re.compile(r"^```\s*$")
MARKER_TMPL = "{{{{code:{id}}}}}"


def main() -> None:
    if DST.exists():
        print(f"content/zh 已存在，先删除再跑：rm -rf {DST}", file=sys.stderr)
        sys.exit(1)
    shutil.copytree(SRC, DST)
    manifest: dict = {}
    total = 0

    for md in sorted(DST.rglob("*.md")):
        rel = md.relative_to(DST)
        group = rel.parts[0]
        stem = md.stem  # 如 030-outbox-pattern（含数字前缀）
        lines = md.read_text(encoding="utf-8").split("\n")
        out: list[str] = []
        i = 0
        n = 0
        changed = False
        while i < len(lines):
            if FENCE_RE.match(lines[i]):
                n += 1
                total += 1
                cid = f"{group}/{stem}-{n:02d}"
                # 收集代码块
                j = i + 1
                code_lines: list[str] = []
                while j < len(lines) and not CLOSE_RE.match(lines[j]):
                    code_lines.append(lines[j])
                    j += 1
                if j >= len(lines):
                    print(f"警告：{rel} 第 {n} 个代码块未闭合", file=sys.stderr)
                    out.extend(lines[i:])
                    break
                code_text = "\n".join(code_lines).rstrip("\n") + "\n"
                code_path = CODE / f"{cid}.cs"
                code_path.parent.mkdir(parents=True, exist_ok=True)
                code_path.write_text(code_text, encoding="utf-8")
                first = next((l.strip() for l in code_lines if l.strip()), "")
                manifest[cid] = {
                    "source": str(rel),
                    "index": n,
                    "first_line": first[:80],
                    "lines": len(code_lines),
                }
                out.append(MARKER_TMPL.format(id=cid))
                changed = True
                i = j + 1  # 跳过闭合 ```
            else:
                out.append(lines[i])
                i += 1
        if changed:
            md.write_text("\n".join(out), encoding="utf-8")

    (ROOT / "code" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"抽取完成：{total} 个 csharp 代码块 -> code/csharp/")
    print(f"manifest：code/manifest.json（{len(manifest)} 条）")


if __name__ == "__main__":
    main()
