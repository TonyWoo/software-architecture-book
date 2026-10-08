#!/usr/bin/env python3
"""Export the bookwriter-format book to a single manuscript.md.

Follows unclebob/bookwriter's bookwriter-spec.md export rules:
- Walk manuscript/ in numeric-prefix tree order.
- Chapters get "<p class=\" chapter-number \">Chapter N</p>" + "# Title".
- Sections get "## Title" (depth-shifted headings in body).
- Text-unit nodes keep the title on the current page (no page break div).
- Part/chapter/section nodes are preceded by a page-break div (except the
  very first node of the manuscript).
- Front-matter headings get Pandoc's unnumbered marker " {-}".
- Footnote labels are prefixed with the section id.
- Body "#" headings are shifted by node depth + 1 (so a section file's "#"
  becomes "###", a proper subsection of its "##" section title).
"""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
# 手稿目录与输出文件可覆盖：python3 export_manuscript.py [手稿目录] [输出md]
# 默认读 manuscript/（中文 C# 版装配产物），写 manuscript.md
MS = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "manuscript"
OUT = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "manuscript.md"


def parse_header(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise ValueError(f"bad header: {path}")
    hdr, body = m.group(1), m.group(2)
    meta = {}
    for line in hdr.split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"')
    return meta, body


def ordered_children(d):
    return sorted(
        [p for p in d.iterdir() if p.name != ".DS_Store"],
        key=lambda p: p.name,
    )


def shift_headings(body, depth):
    out = []
    in_fence = False
    for line in body.split("\n"):
        if line.startswith("```"):
            in_fence = not in_fence
            out.append(line)
            continue
        if not in_fence:
            m = re.match(r"^(#{1,6})\s", line)
            if m:
                level = min(6, len(m.group(1)) + depth)
                line = "#" * level + line[len(m.group(1)):]
        out.append(line)
    return "\n".join(out)


def make_cover(title, subtitle, author, contact):
    B = chr(92)  # 反斜杠，避开多层转义
    # 水墨整页封面：jpg 自带书名/副标题/作者，tex 只放整页图，不再排文字标题页
    # Java 版由 workflow 的 sed 把 cover-csharp.jpg 换成 cover-java.jpg
    L = [
        B + "begin{titlepage}",
        B + "centering",
        B + "includegraphics[width=" + B + "paperwidth,height=" + B + "paperheight,keepaspectratio]{images/cover-csharp.jpg}",
        B + "end{titlepage}",
        "",
    ]
    return "\n".join(L)


def main():
    book_title = "白话软件架构设计"
    book_subtitle = ""
    book_author = ""
    book_contact = ""
    # 优先用装配产物里的 book.yaml（带技术栈后缀），回退到仓库根
    for yf in (MS / "book.yaml", ROOT / "book.yaml"):
        if yf.exists():
            for line in yf.read_text(encoding="utf-8").split("\n"):
                if line.startswith("title:"):
                    book_title = line.split(":", 1)[1].strip()
                elif line.startswith("subtitle:"):
                    book_subtitle = line.split(":", 1)[1].strip()
                elif line.startswith("author:"):
                    book_author = line.split(":", 1)[1].strip()
                elif line.startswith("contact:"):
                    book_contact = line.split(":", 1)[1].strip()
            break

    parts = []
    chapter_no = 0
    first_node = True

    def emit_node(path, meta, body, depth, is_group_index):
        nonlocal chapter_no, first_node
        unit = meta.get("unit", "section" if is_group_index else "text")
        role = meta.get("role", "body")
        title = meta.get("title", "")
        sid = meta.get("id", "")

        # footnote label prefixing
        def refx(m):
            return f"[^{sid}-{m.group(1)}]"
        body = re.sub(r"\[\^(\w[\w-]*)\]", refx, body)
        # image paths: source files reference ../../images/ relative to
        # manuscript/<chapter>/; the single-file manuscript.md lives at the
        # repo root, so rewrite to images/ for the export only.
        body = body.replace("](../../images/", "](images/")
        # Hairline interactive figures: for PDF export, replace the iframe
        # embed with the static PNG. Maps figure name -> chapter image.
        _fig_to_ch = {
            "footings": "ch01", "scales": "ch02", "dividers": "ch03",
            "layers": "ch04", "fence": "ch05", "drawers": "ch06",
            "ballot": "ch07", "net": "ch08", "breaker": "ch09",
            "locks": "ch10", "drafting": "ch11",
        }
        def _iframe_to_img(m):
            fig = m.group(1)
            ch = _fig_to_ch.get(fig, None)
            if not ch:
                return m.group(0)
            # Remove the following hint paragraph too (matched separately)
            return f"![本章插画](images/{ch}-abstract.png)"
        body = re.sub(
            r'<iframe src="/software-architecture-book/figures/hairline-([a-z]+)\.html"[^>]*></iframe>\s*',
            _iframe_to_img, body)
        # Remove the "hover to interact" hint (web-only)
        body = re.sub(
            r'<p style="text-align:center;"><small>💡 鼠标悬停可交互</small></p>\s*',
            "", body)
        body = shift_headings(body, depth + 1)

        if not first_node and unit in ("part", "chapter", "section"):
            parts.append('\n<div class=" page-break "></div>\n')
        first_node = False

        if unit == "chapter" and role == "body":
            chapter_no += 1
            parts.append(f'\n<p class=" chapter-number ">Chapter {chapter_no}</p>\n')
            parts.append(f"\n# {title}\n")
        elif unit == "section":
            un = " {-}" if role == "front" else ""
            parts.append(f"\n{'#' * (depth + 1)} {title}{un}\n")
        else:  # text
            un = " {-}" if role == "front" else ""
            parts.append(f"\n{'#' * (depth + 1)} {title}{un}\n")
        parts.append("\n" + body.rstrip() + "\n")

    def walk(d, depth):
        for child in ordered_children(d):
            if child.is_dir():
                idx = child / "_index.md"
                if idx.exists():
                    meta, body = parse_header(idx)
                    emit_node(idx, meta, body, depth, True)
                walk(child, depth + 1)
            elif child.suffix == ".md" and child.name != "_index.md":
                meta, body = parse_header(child)
                emit_node(child, meta, body, depth, False)

    walk(MS, 0)
    OUT.write_text("".join(parts), encoding="utf-8")
    cover_tex = OUT.parent / "cover.tex"
    cover_tex.write_text(make_cover(book_title, book_subtitle, book_author, book_contact),
                         encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {chapter_no} chapters)")


if __name__ == "__main__":
    main()
