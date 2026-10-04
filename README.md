# 软件架构 — 学会做出经得起变化、团队与规模考验的决策

一本写给想成长为架构师的开发者的软件架构书。正文为简体中文（技术术语白名单
保留英文缩写：API、SOLID、DDD、gRPC 等），代码标识符英文、注释中文。

两个技术栈版本，正文同源，代码各写：

| 版本 | 代码目录 | 说明 |
|---|---|---|
| 中文 C# 版 | `code/csharp/` | .NET 8+ 风格：Minimal API、record、依赖注入 |
| 中文 Java 版 | `code/java/` | Java 21 + Spring Boot 3：Spring MVC、record、依赖注入 |

英文版（C# / Java）已预留结构，尚未翻译。

## 目录结构

```
software-architecture-book/
  book.yaml                 # 书名（语言级：中文标题；装配时自动加技术栈后缀）
  content/
    zh/                     # 中文正文唯一来源（bookwriter 磁盘格式）
    en/                     # 英文版预留（README 说明翻译方式）
  code/
    csharp/                 # 69 个 C# 示例，按 manifest id 组织
    java/                   # 69 个 Java 示例，一一对应（stubs/ 为第三方 API 编译桩）
    manifest.json           # 正文 {{code:id}} ↔ 代码文件的对照表
  tools/
    assemble.py             # 按（语言，技术栈）装配 manuscript/
    extract_code.py         # 已用过：从旧手稿抽取代码块（历史工具）
  manuscript/               # 装配产物（默认中文 C# 版），下游构建的输入
  export_manuscript.py      # manuscript/ → manuscript.md（单文件）
  site/                     # Nimbus 文档站（双版本）
  images/                   # 每章黑白抽象插画
```

正文里的 `{{code:<id>}}` 标记在装配时被替换为对应技术栈的代码块；
`{{stack:C#版文案|Java版文案}}` 内联标记处理技术栈专属叙述
（如 Polly/Resilience4j、ASP.NET Core/Spring Boot）。

## 构建

```bash
cd ~/workspace/software-architecture-book

# 装配手稿（默认中文 C# 版 → manuscript/）
python3 tools/assemble.py --lang zh --stack csharp
python3 tools/assemble.py --lang zh --stack java --out /tmp/manuscript-java

# 导出单文件手稿
export LC_ALL=C.UTF-8 LANG=C.UTF-8   # locale 须为 UTF-8，否则中文参数会被吞成 U+FFFD
python3 export_manuscript.py                          # manuscript/ → manuscript.md
python3 export_manuscript.py /tmp/manuscript-java /tmp/manuscript-java.md

# 打 PDF（export 会顺手生成 cover.tex 封页，用 --include-before-body 挂到目录前面）
pandoc manuscript.md -o software-architecture-zh-csharp.pdf \
  --toc --toc-depth=3 -V toc-title="目录" \
  --include-before-body=cover.tex \
  --pdf-engine=xelatex \
  -V CJKmainfont="Noto Sans CJK SC" -V CJKmonofont="Noto Sans Mono CJK SC"
pandoc /tmp/manuscript-java.md -o software-architecture-zh-java-spring-boot.pdf \
  --toc --toc-depth=3 -V toc-title="目录" \
  --include-before-body=/tmp/cover.tex \
  --pdf-engine=xelatex \
  -V CJKmainfont="Noto Sans CJK SC" -V CJKmonofont="Noto Sans Mono CJK SC"
```

Java 示例编译验证（纯 JDK 部分；Spring/Resilience4j 等用 `stubs/` 下的
编译桩，桩文件注明了对应的真实 Maven 坐标）：

```bash
cd code/java
javac -d /tmp/java-classes $(find . -name '*.java')
```

## Nimbus 文档站

`site/` 是用 Cloudflare Nimbus（Astro 文档站脚手架）搭的在线文档站，
双版本：`book/`（中文 C# 版）与 `book-java/`（中文 Java 版）。
构建前会自动从最新装配手稿重新导入。

```bash
cd site
npm install          # 首次
npm run dev          # 本地预览 http://localhost:4321
npm run build        # 构建：先自动跑 scripts/import-book.mjs 再 astro build，产物在 site/dist/
```

导入脚本 `site/scripts/import-book.mjs`（环境变量 `BOOK_SRC` / `BOOK_DEST`
可切换版本，默认导入中文 C# 版）：

- 把手稿转成 `src/content/docs/<版本>/` 下 82 个页面
  （前言 1 + 10 章 × 8：导读、5 节、本章要点、战争故事 + 落地页 1）
- 把 `images/ch01-abstract.png` … `ch10-abstract.png` 拷到 `public/images/`
  并改写引用路径；页数不对会直接报错中断构建
- 由 `prebuild` 自动调用，`npm run build` 前无需手动跑

CI：`.github/workflows/nimbus.yml` 在 push 到 `main`（且改动涉及书稿、
插画或 `site/`）时自动构建并部署到 GitHub Pages：
<https://tonywoo.github.io/software-architecture-book/>。
注意：仓库须保持公开，改回私有后 Pages 会下线（免费账号限制）。

## 内容清单

10 章 × 每章 5 节 = 50 节，外加每章导读与要点总结、前言；
贯穿案例"好食光"、每节反模式、10 个战争故事、每章 3 道 Kata。
