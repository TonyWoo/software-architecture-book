#!/usr/bin/env python3
"""把 Astro 构建产物中的绝对 base 路径改写为相对路径。

用法: python3 relativize.py site/dist /software-architecture-book/
处理后 dist 可放在任意目录/网站子路径下直接打开。
"""
import os
import re
import sys

def main():
    dist = sys.argv[1]
    base = sys.argv[2].rstrip("/") + "/"  # /software-architecture-book/
    # 匹配 href/src/action 等属性中的绝对路径，以及 CSS url()
    attr_pat = re.compile(
        r'((?:href|src|action|poster)=["\'])' + re.escape(base) + r'(.*?)["\']'
    )
    css_pat = re.compile(r'(url\(["\']?)' + re.escape(base) + r'(.*?)["\']?\)')
    # JS 中的 "/software-architecture-book/" 字符串
    js_pat = re.compile(r'(["\'])' + re.escape(base) + r'(.*?)\1')

    count = 0
    for root, _, files in os.walk(dist):
        for fn in files:
            if not fn.endswith((".html", ".css", ".js", ".xml", ".txt", ".json")):
                continue
            fp = os.path.join(root, fn)
            rel = os.path.relpath(fp, dist)
            depth = rel.count(os.sep)  # index.html -> 0, book/x/index.html -> 2
            prefix = "./" if depth == 0 else "../" * depth
            with open(fp, encoding="utf-8", errors="replace") as f:
                text = f.read()
            orig = text
            # HTML 属性
            text = attr_pat.sub(
                lambda m: f'{m.group(1)}{prefix}{m.group(2)}"', text)
            # CSS url()
            text = css_pat.sub(
                lambda m: f'{m.group(1)}{prefix}{m.group(2)})', text)
            if text != orig:
                with open(fp, "w", encoding="utf-8") as f:
                    f.write(text)
                count += 1
    print(f"relativized {count} files")

if __name__ == "__main__":
    main()
