// ============================================================
// import-book.mjs —— 把 ../manuscript/ 的书稿导入为 nimbus 站点页面
// 用法：node scripts/import-book.mjs   （site/ 目录下）
// 输出：src/content/docs/book/ 下 72 个 .md 页面（前言+10章×7页）
// 由 `prebuild` 自动调用，保证构建永远用最新书稿
// ============================================================
import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANUSCRIPT_DIR = join(ROOT, '..', 'manuscript');
const OUT_DIR = join(ROOT, 'src', 'content', 'docs', 'book');

// ---- 极简 YAML 头解析（字段都是单行 key: value，值可能带引号） ----
function parseHead(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { head: {}, body: text };
  const head = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    head[line.slice(0, i).trim()] = v;
  }
  return { head, body: text.slice(m[0].length) };
}

const stripNum = (name) => name.replace(/^\d+-/, '');
const sortKey = (name) => (name === '_index.md' ? '000' : name);

function readBookMeta() {
  const meta = {};
  for (const line of readFileSync(join(ROOT, '..', 'book.yaml'), 'utf8').split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return meta;
}

// 正文标题移位：bookwriter 用 `#` 写小节，nimbus 页面标题来自 frontmatter，
// 把一级标题降为二级，避免一页两个 H1
const demoteH1 = (body) => body.replace(/^(#{1}) /gm, '## ');

function frontmatter({ title, description, order, label, group }) {
  const esc = (s) => `"${String(s ?? '').replace(/"/g, '\\"')}"`;
  return [
    '---',
    `title: ${esc(title)}`,
    `description: ${esc(description)}`,
    'sidebar:',
    `  order: ${order}`,
    `  label: ${esc(label || title)}`,
    '  group:',
    `    label: ${esc(group)}`,
    '---',
    '',
  ].join('\n');
}

function main() {
  const book = readBookMeta();
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const groups = readdirSync(MANUSCRIPT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  let order = 0;
  let pages = 0;
  const chapters = []; // 给落地页的章节索引 [{slug, title}]

  const write = (relPath, fm, body) => {
    const full = join(OUT_DIR, relPath);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, fm + demoteH1(body).replace(/\s+$/, '') + '\n');
    pages++;
  };

  for (const g of groups) {
    const gslug = stripNum(g);
    const files = readdirSync(join(MANUSCRIPT_DIR, g))
      .filter((f) => f.endsWith('.md'))
      .sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : 1));

    if (g === '010-front-matter') {
      // 前言组：_index.md 为空壳（role: front），跳过；preface 单独成页
      for (const f of files) {
        const { head, body } = parseHead(readFileSync(join(MANUSCRIPT_DIR, g, f), 'utf8'));
        if (!body.trim()) {
          console.log(`skip 空页面: ${g}/${f}`);
          continue;
        }
        write(
          'preface.md',
          frontmatter({ title: head.title, description: head.synopsis, order: order += 10, group: '开篇' }),
          body,
        );
      }
      continue;
    }

    // 章节组
    const idxFile = files.find((f) => f === '_index.md');
    const { head: chHead } = parseHead(readFileSync(join(MANUSCRIPT_DIR, g, idxFile), 'utf8'));
    const chNum = chapters.length + 1;
    const chSlug = gslug;
    const groupLabel = `第${chNum}章 · ${chHead.title}`;
    chapters.push({ slug: chSlug, title: chHead.title });

    for (const f of files) {
      const { head, body } = parseHead(readFileSync(join(MANUSCRIPT_DIR, g, f), 'utf8'));
      const fslug = f === '_index.md' ? 'index' : stripNum(f).replace(/\.md$/, '');
      write(
        `${chSlug}/${fslug}.md`,
        frontmatter({
          title: f === '_index.md' ? `${chHead.title} · 本章导读` : head.title,
          description: head.synopsis,
          order: order += 10,
          group: groupLabel,
        }),
        body,
      );
    }
  }

  // 落地页 book/index.md（order 最小，排最前）
  const links = chapters.map((c, i) => `- [第${i + 1}章 · ${c.title}](./${c.slug}/)`).join('\n');
  write(
    'index.md',
    frontmatter({
      title: book.title || 'Software Architecture',
      description: book.subtitle || '',
      order: -100,
      label: '全书导读',
      group: '开篇',
    }),
    `${book.subtitle || ''}\n\n## 章节\n\n${links}\n\n[前言](./preface/)\n`,
  );

  console.log(`import-book: 生成 ${pages} 页`);
  if (pages !== 72) {
    console.error(`页数不对：期望 72，实际 ${pages}`);
    process.exit(1);
  }
}

main();
