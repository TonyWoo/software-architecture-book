# Software Architecture — Learn to make decisions that survive change, teams & scale.

一本写给想成长为架构师的开发者的软件架构书。正文为简体中文，章节标题保留英文原文，
C# / .NET 8+ 代码示例（标识符英文、注释中文）。

## 格式

本书使用 [unclebob/bookwriter](https://github.com/unclebob/bookwriter)（Robert C. Martin
的开源写作工具）的磁盘格式：一本书就是一个 Markdown 文件夹。

```
software-architecture-book/
  book.yaml                 # 书名
  images/                   # 图片（如有）
  manuscript/
    010-front-matter/       # 前言（role: front，不编号）
      _index.md
      010-preface.md
    020-foundations-and-role/   # 第 1 章（group，unit: chapter）
      _index.md             # 章节导读
      010-....md            # 5 节（unit: section）
      ...
      060-key-takeaways.md  # 本章要点总结（unit: text）
    030-architectural-thinking/ # 第 2 章
    ...
    110-practice-and-communication/ # 第 10 章
  export_manuscript.py      # 导出脚本（按 bookwriter-spec.md 规则生成 manuscript.md）
  manuscript.md             # 导出产物：全书单个 Markdown 手稿
```

每个 `.md` 文件以 YAML 头开始（字段顺序固定：id / title / synopsis / status / role / unit），
正文为 Pandoc Markdown：不重复标题，`#` 表示小节，代码块用 `csharp` 标签且前后空行。

## 阅读

- 直接读 `manuscript.md`（全书单文件，约 28 万字节）。
- 或用 bookwriter 应用打开本目录：`bw ~/workspace/software-architecture-book`
  （bookwriter 是 Tauri 桌面应用，需按其 README 自行构建）。

## 构建 PDF / EPUB

bookwriter 的导出止于 Markdown；PDF/EPUB 是 Pandoc 的工作：

```bash
cd ~/workspace/software-architecture-book
export LC_ALL=C.UTF-8 LANG=C.UTF-8   # 环境 locale 须为 UTF-8，否则中文参数会被吞成 U+FFFD
python3 export_manuscript.py
pandoc manuscript.md -o software-architecture.pdf \
  --toc --toc-depth=3 -V toc-title="目录" \
  --pdf-engine=xelatex \
  -V CJKmainfont="Noto Sans CJK SC" -V CJKmonofont="Noto Sans Mono CJK SC"
```
产物：153 页 PDF，含"目录"页与 34 个 PDF 书签；零缺字警告。

本机未安装 pandoc（也无 dotnet 用于编译 C# 示例），故只交付源码与 Markdown 手稿，
未做 PDF 构建与代码编译验证。

## 内容清单

10 章 × 每章 5 节 = 50 节，外加每章导读与要点总结、前言。章节标题严格按既定结构，
一字未改。

## Nimbus 文档站

`site/` 是用 Cloudflare Nimbus（Astro 文档站脚手架）搭的在线文档站，
书稿的在线阅读版。构建前会自动从最新书稿重新导入，所以站点永远和
`manuscript/` 保持一致（含纯中文标题与每章黑白插画）。

```bash
cd site
npm install          # 首次
npm run dev          # 本地预览 http://localhost:4321
npm run build        # 构建：先自动跑 scripts/import-book.mjs 再 astro build，产物在 site/dist/
```

导入脚本 `site/scripts/import-book.mjs`：

- 把 `manuscript/` 转成 `src/content/docs/book/` 下 82 个页面
  （卷首 1 + 前言 1 + 10 章 × 8：导读、本章 5 节、本章要点、战争故事）
- 把 `images/ch01-abstract.png` … `ch10-abstract.png` 拷到 `public/images/`
  并改写引用路径；页数不对会直接报错中断构建
- 由 `prebuild` 自动调用，`npm run build` 前无需手动跑

CI：`.github/workflows/nimbus.yml` 在 push 到 `main`（且改动涉及书稿、
插画或 `site/`）时自动构建，把 `site/dist/` 上传为 artifact（保留 30 天）。
只构建、不部署——部署到 Cloudflare 或 GitHub Pages 等主人选定目标后再接。
