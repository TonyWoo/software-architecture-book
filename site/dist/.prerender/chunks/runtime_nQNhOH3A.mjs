import { n as entryRouteUrl, t as entryRouteKey } from "./astro-slug-Dibmp5Qt_B7BM6MvU.mjs";
import { a as toBrowserHref, l as withoutHtmlExtension, n as safeDecode, o as toDocumentHref, r as setLinkPolicy, s as toRouteKey, t as isAbsoluteUrl } from "./url-DyuBs32r_CvQlmwi9.mjs";
import { t as runtimeWarn } from "./runtime-warn-etLzYhwu_SxrSKdg7.mjs";
import { transformerStyleToClass } from "@shikijs/transformers";
//#region node_modules/@cloudflare/nimbus-docs/dist/collection-mount-Cqm0RaUl.js
/**
* Tiny Levenshtein distance + "did you mean" suggester.
*
* Used by the MDX PascalCase validator and any framework diagnostic that
* wants to suggest a near-match on a misspelled name. Kept internal — user
* code that wants the same hint duplicates ~10 lines rather than depending
* on a framework wrapper — we avoid shipping thin wrappers as public API.
*/
function levenshtein(a, b) {
	if (a === b) return 0;
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;
	const v0 = new Array(b.length + 1);
	const v1 = new Array(b.length + 1);
	for (let i = 0; i <= b.length; i++) v0[i] = i;
	for (let i = 0; i < a.length; i++) {
		v1[0] = i + 1;
		for (let j = 0; j < b.length; j++) {
			const cost = a[i] === b[j] ? 0 : 1;
			v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
		}
		for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
	}
	return v1[b.length];
}
/**
* Return the closest candidate within `maxDist`, or null.
*
* Comparison is case-insensitive (so "tabs" suggests "Tabs"), but the
* returned name keeps its original casing.
*/
function suggest(target, candidates, maxDist = 3) {
	const targetLower = target.toLowerCase();
	let best = null;
	for (const c of candidates) {
		const dist = levenshtein(targetLower, c.toLowerCase());
		if (dist <= maxDist && (!best || dist < best.dist)) best = {
			name: c,
			dist
		};
	}
	return best?.name ?? null;
}
/**
* Collection-mount conventions — one source of truth for "what URL prefix
* does collection X serve at?".
*
* Shared between `index.ts` (which uses it for `getIndexedEntries`,
* `getDocsPageProps`, etc.) and `lint/site-model.ts` (where
* `findDuplicateRoutes` needs it to detect cross-collection URL
* collisions). Keeping the function here prevents the duplicate-slug
* validator from drifting out of sync with the actual routing.
*/
/** Primary collection name — mounted at the site root with no prefix. */
var PRIMARY_COLLECTION$1 = "docs";
/**
* Resolve the URL-prefix segment for a given collection name.
*
*   1. Primary `docs` collection mounts at root → returns `""`.
*   2. With `versions` configured, a `docs-<slug>` collection whose slug
*      appears in `versions.others` mounts under `/<slug>` (the version
*      label, not the collection id).
*   3. Any other collection (`api`, `blog`, …) mounts at `/<collection>`.
*
* Returned shape: empty string OR `/<segment>` with leading slash, no
* trailing slash. Callers append `/<entryId>` or `/index.md`.
*/
function collectionMountPrefix(collection, versions) {
	if (collection === "docs") return "";
	if (versions && collection.startsWith("docs-")) {
		const slug = collection.slice(5);
		if (versions.others.includes(slug)) return `/${slug}`;
	}
	return `/${collection}`;
}
transformerStyleToClass({ classPrefix: "nb-shiki-" });
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/api-projector-CnQErXEX.js
var STATE_KEY = Symbol.for("@cloudflare/nimbus-docs/api-projector/v1");
var stateGlobal = globalThis;
var state = stateGlobal[STATE_KEY] ??= { version: 1 };
function configuredProjectors() {
	if (!state.projectors) throw new Error("nimbus-docs: API projection is available only during a configured Astro build or dev server.");
	return state.projectors;
}
/**
* Project page props for Markdown consumers. Markdown renders code from its
* source, so skipping highlighting and navigation keeps the `.md` route and
* `llms-full.txt` from repeating the HTML route's most expensive work.
*/
function projectConfiguredApiPageProps(collection, version, coordinate) {
	return configuredProjectors().pageProps(collection, version, coordinate);
}
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/lib/pkgm.js
var COMMAND_TYPES = [
	"add",
	"create",
	"dlx",
	"exec",
	"install",
	"remove",
	"run"
];
function isCommandType(value) {
	return COMMAND_TYPES.includes(value);
}
var commands = {
	npm: {
		add: "npm i",
		create: "npm create",
		dlx: "npx",
		exec: "npx",
		install: "npm install",
		run: "npm run",
		remove: "npm uninstall",
		dev: "-D"
	},
	yarn: {
		add: "yarn add",
		create: "yarn create",
		dlx: "yarn dlx",
		exec: "yarn",
		install: "yarn install",
		run: "yarn run",
		remove: "yarn remove",
		dev: "-D"
	},
	pnpm: {
		add: "pnpm add",
		create: "pnpm create",
		dlx: "pnpm dlx",
		exec: "pnpm",
		install: "pnpm install",
		run: "pnpm run",
		remove: "pnpm remove",
		dev: "-D"
	},
	bun: {
		add: "bun add",
		create: "bun create",
		dlx: "bunx",
		exec: "bunx",
		install: "bun install",
		run: "bun run",
		remove: "bun remove",
		dev: "-d"
	}
};
var MANAGERS = [
	"npm",
	"yarn",
	"pnpm",
	"bun"
];
/**
* `pnpm <x>` and `yarn <x>` run an installed bin, never a package, so `exec`
* names the bin a scoped package gets by default: `@cloudflare/nimbus-docs`
* → `nimbus-docs`. `npx` and `bunx` take the package and prefer a local
* install, and the scoped name keeps them from fetching an unrelated
* unscoped package when it isn't installed.
*/
function binName(pkg) {
	const name = pkg.startsWith("@") ? pkg.slice(pkg.indexOf("/") + 1) : pkg;
	const version = name.indexOf("@");
	return version > 0 ? name.slice(0, version) : name;
}
function getCommand(mgr, type, pkg, { args, dev = false, comment } = {}) {
	let cmd = commands[mgr][type];
	if (cmd === void 0) return void 0;
	if (comment) cmd = `# ${comment}\n${cmd}`;
	if (dev && type === "add") cmd += ` ${commands[mgr].dev}`;
	if (pkg) {
		const processedPkg = type === "create" && mgr === "yarn" ? pkg.replace(/@(?![^@]*\/)[^\s]*$/, "") : type === "exec" && (mgr === "pnpm" || mgr === "yarn") ? binName(pkg) : pkg;
		cmd += ` ${processedPkg}`;
	}
	if (args) cmd += `${mgr === "npm" && ![
		"dlx",
		"exec",
		"run"
	].includes(type) ? " --" : ""} ${args}`;
	return cmd;
}
function getTabs(type, pkg, options = {}) {
	const { managers, ...commandOptions } = options;
	return (managers ?? MANAGERS).filter((mgr) => commands[mgr][type] !== void 0).map((mgr) => ({
		mgr,
		cmd: getCommand(mgr, type, pkg, commandOptions)
	}));
}
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/discoverability-BpgpYYOK.js
/**
* Fenced code blocks and inline code spans in Markdown/MDX source, for the
* passes that rewrite prose and must leave code alone. A line scanner rather
* than a parser: it runs at request time, where the native parser isn't
* available. It follows CommonMark for fences (backtick or tilde, a closing
* fence at least as long as the opening one, fences in lists, on a list-item
* line, or nested in `>` quotes); `code-regions.test.ts` checks it against the
* parser.
*/
var FENCE_OPEN = /^((?:[ \t]*(?:>|(?:[-*+]|\d{1,9}[.)])[ \t]))*[ \t]*)(`{3,}|~{3,})([^\r]*)/;
var INLINE_CODE = /`[^`\n]+`/g;
/**
* Closed fenced blocks in `lines`, in order. An unclosed fence is left as
* prose, including one whose `>` quote ends before the fence closes.
*/
function fencedBlocks(lines) {
	const blocks = [];
	for (let i = 0; i < lines.length; i++) {
		const open = FENCE_OPEN.exec(lines[i]);
		const [, prefix = "", fence = "", info = ""] = open ?? [];
		if (!open || fence[0] === "`" && info.includes("`")) continue;
		const close = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}[ \\t]*\\r?$`);
		const depth = prefix.split(">").length - 1;
		let end = i + 1;
		while (end < lines.length && quoteDepth(lines[end]) >= depth && !close.test(stripPrefix(lines[end], prefix))) end++;
		if (end === lines.length || quoteDepth(lines[end]) < depth) continue;
		blocks.push({
			open: i,
			close: end,
			prefix
		});
		i = end;
	}
	return blocks;
}
function quoteDepth(line) {
	return /^[ \t]*((?:>[ \t]*)*)/.exec(line)[1].split(">").length - 1;
}
/**
* Remove the opening fence's container prefix from a line inside the block, as
* CommonMark does for an indented fence. A list marker's width counts as
* indentation, since the item's lines are indented under it.
*/
function stripPrefix(line, prefix) {
	let i = 0;
	while (i < prefix.length && i < line.length && /[ \t>]/.test(line[i]) && line[i] === ">" === (prefix[i] === ">")) i++;
	return line.slice(i);
}
/**
* The coordinate-citation resolver — the pure, mode-agnostic core.
*
* A prose page cites an API operation with a markdown link whose target is a
* coordinate, not a hand-typed URL:
*
*     [create a zone](api.ref:zones:createZone)
*     [in v1](api.ref:zones@v1:createZone)
*
* `resolveCitations` rewrites those link targets to site-absolute URLs against a
* citation index (coordinate → URL). It never reads the API model, so the same
* function serves same-app, split-app, and cross-repo citations, at build or
* request time.
*
* Two failure modes over one resolver, chosen by the caller:
*   - `author`  — a human wrote it. Unknown coordinate → build error.
*   - `derived` — the reference minted it. Unknown coordinate → `#` + warning.
*
* The sentinel is `api.ref:`. The `.` is load-bearing: collection names are
* `[a-z0-9-]+` (never a dot), so it can never alias a real collection, yet stays
* URI-scheme-shaped so markdown and the internal-link lint leave it alone.
*/
/** The one prefix that marks a link target as a coordinate citation. */
var CITATION_SENTINEL = "api.ref:";
/**
* A citation only counts when it is the target of a link — a markdown
* `](api.ref:…)` or a JSX `href="api.ref:…"`. A bare `api.ref:` mentioned in
* prose is not a citation and must never trip resolution or the fail-loud guard.
*
* Coordinates are opaque and may contain spaces (a tag-label coordinate like
* `tags.User Management`) or parentheses. Three alternatives, tried in order:
*   1. CommonMark angle destination `](<api.ref:…>)` — the standard wrapper for
*      a target containing spaces/parens. Interior padding is tolerated and the
*      brackets are dropped on rewrite (a resolved URL never needs them).
*   2. JSX `href="api.ref:…"` — delimited by its own quote, so spaces inside are
*      captured; the closing quote is left intact.
*   3. Bare markdown `](api.ref:…)` — terminated by whitespace, `)`, or a quote.
*
* Captured groups: (angle prefix, angle token, href prefix, href token,
* bare prefix, bare token).
*/
var CITATION_LINK = /(\]\(\s*)<\s*(api\.ref:[^>\n]*?)\s*>|(\bhref\s*=\s*["'])(api\.ref:[^"'\n]+)|(\]\(\s*)(api\.ref:[^\s)"']+)/g;
/** A collection name segment: matches the coordinate grammar's rule. */
var COLLECTION = /^[a-z0-9-]+$/;
/** A version id: no `:` or `@`, no leading/trailing/consecutive separators. */
var VERSION = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
/** The lookup key for a parsed citation. Version-bearing when a version is given. */
function citationKey(collection, version, coordinate) {
	return version ? `${collection}@${version}:${coordinate}` : `${collection}:${coordinate}`;
}
/**
* Parse a full link target into a citation, or `null` when it isn't one.
* Returns a diagnostic string (never `null`) when the target *starts* with the
* sentinel but is malformed — an author who typed `api.ref:` meant a citation,
* so a broken one is an error, not a passthrough.
*/
function parseCitation(target) {
	if (!target.startsWith(CITATION_SENTINEL)) return null;
	const rest = target.slice(8);
	const firstColon = rest.indexOf(":");
	if (firstColon === -1) return { fault: `"${target}" is missing the ":coordinate" — expected api.ref:<collection>[@<version>]:<coordinate>.` };
	const collectionPart = rest.slice(0, firstColon);
	const coordinate = rest.slice(firstColon + 1);
	if (coordinate === "") return { fault: `"${target}" has an empty coordinate.` };
	let collection = collectionPart;
	let version;
	const at = collectionPart.indexOf("@");
	if (at !== -1) {
		collection = collectionPart.slice(0, at);
		version = collectionPart.slice(at + 1);
		if (collectionPart.indexOf("@", at + 1) !== -1) return { fault: `"${target}" has more than one "@" before the coordinate.` };
		if (!VERSION.test(version)) return { fault: `"${target}" has an invalid version "${version}" (allowed: lowercase alphanumerics separated by "." or "-").` };
	}
	if (!COLLECTION.test(collection)) return { fault: `"${target}" has an invalid collection "${collection}" (allowed: [a-z0-9-]).` };
	return version ? {
		collection,
		version,
		coordinate
	} : {
		collection,
		coordinate
	};
}
/**
* Resolve a parsed citation against a citation index, shaped like every other
* generated page link (Astro's `trailingSlash`). `undefined` when unknown.
*/
function resolveCitation(parsed, citationIndex) {
	const url = citationIndex.get(citationKey(parsed.collection, parsed.version, parsed.coordinate));
	return url === void 0 ? void 0 : toDocumentHref(url);
}
/**
* True when the source contains at least one citation link. Cheap pre-filter and
* the signal the fail-loud guard uses: a body with a citation but no citation index
* is a build error, never a silent passthrough of a raw token.
*/
function hasCitation(source) {
	CITATION_LINK.lastIndex = 0;
	return CITATION_LINK.test(protectCode$1(source).code);
}
/**
* Rewrite every coordinate-citation link target in a markdown/MDX source string
* to its resolved URL. Operates on markdown link syntax `](api.ref:…)` and JSX
* `href="api.ref:…"`. Code (fenced + inline) is protected first, so documented
* syntax inside a code span is never rewritten or reported.
*
* Unknown handling follows `mode`. Malformed tokens are always errors. The
* function is pure: it collects diagnostics; the caller decides whether an
* `error` diagnostic fails the build.
*/
function resolveCitations(source, options) {
	const { mode, citationIndex } = options;
	const diagnostics = [];
	const known = new Set(citationIndex.keys());
	const knownCollections = /* @__PURE__ */ new Set();
	for (const key of known) {
		const at = key.indexOf("@");
		const colon = key.indexOf(":");
		const end = at === -1 ? colon : Math.min(at, colon);
		if (end > 0) knownCollections.add(key.slice(0, end));
	}
	const { code: guarded, restore } = protectCode$1(source);
	CITATION_LINK.lastIndex = 0;
	const rewritten = guarded.replace(CITATION_LINK, (_whole, anglePrefix, angleToken, hrefPrefix, hrefToken, barePrefix, bareToken) => {
		if (angleToken !== void 0) return `${anglePrefix}${rewriteToken(angleToken)}`;
		if (hrefToken !== void 0) return `${hrefPrefix}${rewriteToken(hrefToken)}`;
		return `${barePrefix}${rewriteToken(bareToken)}`;
	});
	function rewriteToken(token) {
		const parsed = parseCitation(token);
		if (parsed === null) return token;
		if ("fault" in parsed) {
			diagnostics.push({
				level: "error",
				message: parsed.fault,
				token
			});
			return "#";
		}
		const url = resolveCitation(parsed, citationIndex);
		if (url !== void 0) return url;
		const hint = suggest(citationKey(parsed.collection, parsed.version, parsed.coordinate), known, 4);
		const detail = hint ? ` Did you mean "${CITATION_SENTINEL}${hint}"?` : "";
		const authoritative = knownCollections.has(parsed.collection);
		if (mode === "author" && authoritative) diagnostics.push({
			level: "error",
			message: `Citation "${token}" does not resolve to any API page in "${parsed.collection}".${detail} A renamed or removed operation fails the build.`,
			token
		});
		else if (authoritative) diagnostics.push({
			level: "warning",
			message: `Citation "${token}" does not resolve; rendering "#".${detail}`,
			token
		});
		else diagnostics.push({
			level: "warning",
			message: `Citation "${token}" targets unknown collection "${parsed.collection}"; rendering "#". If it is a remote reference, check its manifest is declared and reachable.`,
			token
		});
		return "#";
	}
	return {
		code: restore(rewritten),
		diagnostics
	};
}
/** Replace fenced + inline code with placeholders so citations inside code are left alone. */
function protectCode$1(source) {
	const chunks = [];
	const PREFIX = "\0NIMBUS_CITE_CODE_";
	const SUFFIX = "\0";
	const lines = source.split("\n");
	const out = [];
	let next = 0;
	for (const { open, close } of fencedBlocks(lines)) {
		out.push(...lines.slice(next, open), store(lines.slice(open, close + 1).join("\n")));
		next = close + 1;
	}
	out.push(...lines.slice(next));
	const code = out.join("\n").replace(INLINE_CODE, store);
	function store(match) {
		const index = chunks.length;
		chunks.push(match);
		return `${PREFIX}${index}${SUFFIX}`;
	}
	return {
		code,
		restore(value) {
			return value.replace(new RegExp(`${PREFIX}(\\d+)${SUFFIX}`, "g"), (_m, i) => chunks[Number(i)] ?? "");
		}
	};
}
/**
* MDX → Markdown transform for generated static routes.
*
* This intentionally starts small and dependency-free: it operates on the
* raw MDX body that Astro's content layer exposes and maps the starter's
* default components to plain markdown equivalents. The route that calls this
* lives in user code, so replacing or bypassing this transformer is a one-line
* edit.
*/
var CONTAINER_PREFIX = /^(?:[ \t]*(?:>|(?:[-*+]|\d{1,9}[.)])[ \t]))+[ \t]*$/;
var LIST_MARKER = /(?:[-*+]|\d{1,9}[.)])(?=[ \t])/g;
function protectFences(markdown, store) {
	const lines = markdown.split("\n");
	const out = [];
	let next = 0;
	for (const { open, close, prefix } of fencedBlocks(lines)) {
		out.push(...lines.slice(next, open));
		const body = lines.slice(open + 1, close + 1).map((line) => stripPrefix(line, prefix));
		out.push(prefix + store([lines[open].slice(prefix.length), ...body].join("\n")));
		next = close + 1;
	}
	out.push(...lines.slice(next));
	return out.join("\n");
}
function protectCode(markdown) {
	const protectedChunks = [];
	const store = (kind) => (chunk) => {
		const token = `@@NIMBUS_MD_${kind}_${protectedChunks.length}@@`;
		protectedChunks.push(chunk);
		return token;
	};
	let next = protectFences(markdown, store("FENCE"));
	next = next.replace(INLINE_CODE, store("CODE"));
	return {
		markdown: next,
		restore(value) {
			return value.replace(/@@NIMBUS_MD_(?:FENCE|CODE)_(\d+)@@/g, (_match, index, offset, whole) => {
				const chunk = protectedChunks[Number(index)] ?? "";
				const before = whole.slice(whole.lastIndexOf("\n", offset) + 1, offset);
				if (!CONTAINER_PREFIX.test(before) && !/^[ \t]+$/.test(before)) return chunk;
				const continuation = before.replace(LIST_MARKER, (marker) => " ".repeat(marker.length));
				const blank = continuation.trimEnd();
				return chunk.replace(/\n([^\n\r]*)/g, (_line, text) => text ? `\n${continuation}${text}` : `\n${blank}`);
			});
		}
	};
}
function parseAttrs(raw = "") {
	const attrs = {};
	for (const match of raw.matchAll(/([A-Za-z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}|([^\s>]+)))?/g)) {
		const [, name, dq, sq, expr, bare] = match;
		if (!name) continue;
		attrs[name] = dq ?? sq ?? expr?.trim() ?? bare ?? true;
	}
	return attrs;
}
function cleanChildren(children) {
	return children.replace(/^\s+/g, "").replace(/\s+$/g, "").replace(/\n[ \t]+/g, "\n");
}
function blockquote(body) {
	return body.split("\n").map((line) => line ? `> ${line}` : ">").join("\n");
}
function asTitle(value, fallback) {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function renderPackageManagers(attrs) {
	const asString = (value) => typeof value === "string" ? value : void 0;
	const type = asString(attrs.type) ?? "add";
	if (!isCommandType(type)) return "";
	const comment = asString(attrs.comment);
	const commands = getTabs(type, asString(attrs.pkg), {
		args: asString(attrs.args),
		dev: attrs.dev === true || attrs.dev === "true"
	}).map((tab) => tab.cmd);
	if (commands.length === 0) return "";
	return [
		"```sh",
		...comment ? [`# ${comment}`] : [],
		...commands,
		"```"
	].join("\n");
}
function applyDefaultComponentTransforms(markdown) {
	let out = markdown;
	out = out.replace(/<PackageManagers\b([^>]*)\/>/g, (_match, rawAttrs) => renderPackageManagers(parseAttrs(rawAttrs)));
	out = out.replace(/<Aside\b([^>]*)>([\s\S]*?)<\/Aside>/g, (_match, rawAttrs, children) => {
		const attrs = parseAttrs(rawAttrs);
		const type = asTitle(attrs.type, "note").toUpperCase();
		return blockquote(`**${asTitle(attrs.title, type.charAt(0) + type.slice(1).toLowerCase())}**\n\n${cleanChildren(children)}`);
	});
	out = out.replace(/<Card\b([^>]*)>([\s\S]*?)<\/Card>/g, (_match, rawAttrs, children) => {
		const title = asTitle(parseAttrs(rawAttrs).title, "Card");
		const body = cleanChildren(children);
		return `- **${title}**${body ? ` — ${body}` : ""}`;
	});
	out = out.replace(/<\/?CardGrid\b[^>]*>/g, "");
	out = out.replace(/<LinkCard\b([^>]*?)\s*\/>/g, (_match, rawAttrs) => {
		const attrs = parseAttrs(rawAttrs);
		const title = asTitle(attrs.title, "Link");
		const href = typeof attrs.href === "string" ? attrs.href : "";
		const description = typeof attrs.description === "string" ? attrs.description : "";
		return `- ${href ? `[${title}](${href})` : `**${title}**`}${description ? ` — ${description}` : ""}`;
	});
	out = out.replace(/<Steps\b[^>]*>([\s\S]*?)<\/Steps>/g, (_match, children) => {
		let index = 0;
		return children.replace(/<Step\b([^>]*)>([\s\S]*?)<\/Step>/g, (_stepMatch, rawAttrs, stepChildren) => {
			index += 1;
			const title = asTitle(parseAttrs(rawAttrs).title, `Step ${index}`);
			const body = cleanChildren(stepChildren);
			return `${index}. **${title}**${body ? `\n\n   ${body.replace(/\n/g, "\n   ")}` : ""}`;
		});
	});
	out = out.replace(/<Tabs\b[^>]*>([\s\S]*?)<\/Tabs>/g, (_match, children) => children.replace(/<TabItem\b([^>]*)>([\s\S]*?)<\/TabItem>/g, (_tabMatch, rawAttrs, tabChildren) => {
		return `### ${asTitle(parseAttrs(rawAttrs).label, "Option")}\n\n${cleanChildren(tabChildren)}`;
	}));
	out = out.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, "$2");
	out = out.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, "");
	return out;
}
function applyCustomComponentTransforms(markdown, componentMap, base) {
	let out = markdown;
	for (const [name, render] of Object.entries(componentMap)) {
		const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const paired = new RegExp(`<${escapedName}(?=[\\s/>])([^>]*)>([\\s\\S]*?)<\\/${escapedName}>`, "g");
		out = out.replace(paired, (_match, rawAttrs, children) => render({
			name,
			attrs: parseAttrs(rawAttrs),
			children: cleanChildren(children),
			base
		}));
		const selfClosing = new RegExp(`<${escapedName}(?=[\\s/>])([^>]*)\\/>`, "g");
		out = out.replace(selfClosing, (_match, rawAttrs) => render({
			name,
			attrs: parseAttrs(rawAttrs),
			children: "",
			base
		}));
	}
	return out;
}
/**
* Render an Astro content entry's raw MDX body as plain markdown.
*
* This handles the starter's default MDX components. Users can pass a
* `componentMap` to override individual component renderers or replace this
* function entirely from their user-owned `.md` route.
*/
function renderEntryAsMarkdown(entry, options = {}) {
	const stripFrontmatter = options.stripFrontmatter ?? true;
	let markdown = entry.body ?? "";
	const isMdx = !entry.filePath?.endsWith(".md");
	if (isMdx && /<Render(?=[\s/>])/.test(protectCode(markdown).markdown)) throw new Error("nimbus-docs: renderEntryAsMarkdown no longer expands <Render> partials at runtime. Serve it with getMarkdownPayload from @cloudflare/nimbus-docs/agent-endpoints.");
	if (stripFrontmatter) markdown = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
	if (hasCitation(markdown)) {
		if (!options.citationIndex) throw new Error("nimbus-docs: renderEntryAsMarkdown received a body with api.ref: citations but no citation index. Use getEntryMarkdown, or pass `{ citationIndex: await loadCitationIndex() }`.");
		markdown = resolveCitations(markdown, {
			mode: "derived",
			citationIndex: options.citationIndex
		}).code;
	}
	if (!isMdx) return markdown.trim();
	const protectedCode = protectCode(markdown);
	markdown = protectedCode.markdown;
	if (options.componentMap) markdown = applyCustomComponentTransforms(markdown, options.componentMap, options.base ?? "/");
	markdown = applyDefaultComponentTransforms(markdown);
	markdown = markdown.replace(/^[ \t]+(- (?:\*\*|\[))/gm, "$1").replace(/^[ \t]+(\d+\. \*\*)/gm, "$1").replace(/^[ \t]+(### )/gm, "$1").replace(/^[ \t]+$/gm, "");
	markdown = dedentComponentFences(markdown).replace(/\n{3,}/g, "\n\n").trim();
	return protectedCode.restore(markdown);
}
var LIST_ITEM = /^([ \t]*)([-*+]|\d{1,9}[.)])([ \t]+)/;
/** Width of leading whitespace, with tabs expanded to the next multiple of 4. */
function columns(whitespace) {
	let width = 0;
	for (const char of whitespace) width = char === "	" ? width + 4 - width % 4 : width + 1;
	return width;
}
/** The column a list item's content starts at, per CommonMark. */
function contentColumn(item) {
	const markerEnd = columns(item[1]) + item[2].length;
	const gap = columns(item[1] + " ".repeat(item[2].length) + item[3]) - markerEnd;
	return gap > 4 ? markerEnd + 1 : markerEnd + gap;
}
/**
* Place each fence where the Markdown reader expects it. A fence inside a
* list item moves to the item's content column: at column 0 it would end the
* list, and 4 or more columns past it the backticks would read as indented
* code. Any other fence is indented only by component markup (`<Tabs>`,
* `<Steps>`) and moves to column 0.
*/
function dedentComponentFences(markdown) {
	const lines = markdown.split("\n");
	return lines.map((line, index) => {
		const fence = /^([ \t]+)(```|@@NIMBUS_MD_FENCE_)/.exec(line);
		if (!fence) return line;
		const indent = columns(fence[1]);
		for (let i = index - 1; i >= 0; i--) {
			const previous = lines[i];
			if (!previous.trim()) continue;
			if (columns(/^[ \t]*/.exec(previous)[0]) >= indent) continue;
			const item = LIST_ITEM.exec(previous);
			const column = item ? contentColumn(item) : -1;
			return column >= 0 && column <= indent ? " ".repeat(column) + line.trimStart() : line.trimStart();
		}
		return line.trimStart();
	}).join("\n");
}
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/projection-BneklZbC.js
var PUBLIC_AUDIENCE = Object.freeze({ key: "public" });
function resolveAudience(ctx) {
	return ctx?.audience ?? PUBLIC_AUDIENCE;
}
function audienceCacheKey(audience) {
	const groups = audience.groups ? [...audience.groups].sort() : [];
	return JSON.stringify([audience.key, groups]);
}
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/runtime.js
var _cached = null;
var _cachedCollections = null;
var _cachedRequestRenderingCollections = null;
var _cachedAlternates = null;
var _cachedApiCollections = null;
async function virtualConfig() {
	const [mod, astroConfig] = await Promise.all([import("./config_Dva8qa7x.mjs"), import("./client_BtnOQe4j.mjs")]);
	setLinkPolicy({
		trailingSlash: astroConfig.trailingSlash,
		format: astroConfig.build.format
	});
	return mod;
}
async function loadNimbusConfig() {
	if (_cached) return _cached;
	const value = (await virtualConfig()).config;
	_cached = value;
	return value;
}
async function loadIndexedCollections() {
	if (_cachedCollections) return _cachedCollections;
	const value = (await virtualConfig()).indexedCollections;
	_cachedCollections = value;
	return value;
}
async function loadRequestRenderingCollections() {
	if (_cachedRequestRenderingCollections) return _cachedRequestRenderingCollections;
	const value = (await virtualConfig()).requestRenderingCollections ?? [];
	_cachedRequestRenderingCollections = value;
	return value;
}
async function loadVersionAlternates() {
	if (_cachedAlternates) return _cachedAlternates;
	const value = (await virtualConfig()).versionAlternates ?? {};
	_cachedAlternates = value;
	return value;
}
async function loadApiCollections() {
	if (_cachedApiCollections) return _cachedApiCollections;
	const value = (await virtualConfig()).apiCollections ?? [];
	_cachedApiCollections = value;
	return value;
}
async function loadCollectionOrWarn(name, getCollection) {
	try {
		return { entries: await getCollection(name) };
	} catch (err) {
		return {
			entries: [],
			warning: `getIndexedEntries: collection "${name}" failed to load and was skipped — ${err instanceof Error ? err.message : String(err)}`
		};
	}
}
var PRIMARY_COLLECTION = "docs";
async function getVisibleEntries(collections = [PRIMARY_COLLECTION], ctx) {
	return (await Promise.all(collections.map((name) => loadVisibleEntries(name, ctx)))).flat();
}
async function getVisibleEntry(collection, id, ctx) {
	return (await loadVisibleEntries(collection, ctx)).find((entry) => entry.id === id) ?? null;
}
var visibleEntriesByName = /* @__PURE__ */ new Map();
async function loadVisibleEntries(name, ctx) {
	const cacheKey = `${name}::${audienceCacheKey(resolveAudience(ctx))}`;
	const cached = visibleEntriesByName.get(cacheKey);
	if (cached) return cached;
	const { getCollection } = await import("./_astro_content_qq75t_pv.mjs");
	const published = (await getCollection(name).catch(() => [])).filter((entry) => !entry.data.draft);
	visibleEntriesByName.set(cacheKey, published);
	return published;
}
async function getVisibleEntriesByCollection(collections, ctx) {
	const out = {};
	await Promise.all(collections.map(async (name) => {
		out[name] = await loadVisibleEntries(name, ctx);
	}));
	return out;
}
var sortKeyByItem = /* @__PURE__ */ new WeakMap();
var directoryIndexLinks = /* @__PURE__ */ new WeakSet();
var sidebarCollator = new Intl.Collator("en");
function sortSidebarItems(a, b) {
	const orderDiff = a.order - b.order;
	if (orderDiff !== 0) return orderDiff;
	const labelDiff = sidebarCollator.compare(a.label, b.label);
	if (labelDiff !== 0) return labelDiff;
	const typeDiff = a.type.localeCompare(b.type);
	if (typeDiff !== 0) return typeDiff;
	return (sortKeyByItem.get(a) ?? "").localeCompare(sortKeyByItem.get(b) ?? "");
}
function buildEntryIndex(entries) {
	const visible = entries.filter((e) => !e.data.sidebar?.hidden);
	const byId = /* @__PURE__ */ new Map();
	for (const entry of visible) byId.set(entry.id, entry);
	const hasChildren = /* @__PURE__ */ new Set();
	for (const entry of visible) {
		const parts = entry.id.split("/");
		for (let i = 1; i < parts.length; i++) hasChildren.add(parts.slice(0, i).join("/"));
	}
	return {
		visible,
		byId,
		hasChildren
	};
}
function joinHref(hrefPrefix, entryId) {
	return toDocumentHref(entryRouteUrl(hrefPrefix.replace(/\/$/, ""), entryId));
}
function createLink(entry, currentPath, hrefPrefix = "") {
	const internalHref = joinHref(hrefPrefix, entry.id);
	const badge = entry.data.draft ? entry.data.sidebar?.badge ?? {
		text: "Draft",
		variant: "warning"
	} : entry.data.sidebar?.badge;
	const label = entry.data.sidebar?.label ?? entry.data.title;
	const order = entry.data.sidebar?.order ?? Number.MAX_VALUE;
	const externalLink = entry.data.external_link;
	if (externalLink) {
		if (isAbsoluteUrl(externalLink)) {
			const ext = {
				type: "external",
				label,
				href: externalLink,
				badge,
				order
			};
			sortKeyByItem.set(ext, entry.id);
			return ext;
		}
		const link2 = {
			type: "link",
			label,
			href: toBrowserHref(externalLink),
			isCurrent: false,
			_neverActive: true,
			badge,
			order
		};
		sortKeyByItem.set(link2, entry.id);
		return link2;
	}
	const link = {
		type: "link",
		label,
		href: internalHref,
		isCurrent: toRouteKey(currentPath) === toRouteKey(internalHref),
		badge,
		order
	};
	sortKeyByItem.set(link, entry.id);
	return link;
}
function buildFilesystemTree(entries, currentPath, directory, hrefPrefix = "") {
	const { visible, byId, hasChildren } = buildEntryIndex(entries);
	const scoped = directory ? visible.filter((e) => e.id === directory || e.id.startsWith(`${directory}/`)) : visible;
	function buildLevel(parentPath) {
		const result = [];
		const groupsAtLevel = /* @__PURE__ */ new Map();
		if (directory && parentPath === directory) {
			const dirIndex = byId.get(directory);
			if (dirIndex && !dirIndex.data.sidebar?.group?.hideIndex) {
				const indexLink = createLink(dirIndex, currentPath, hrefPrefix);
				if (indexLink.type === "link" && !dirIndex.data.sidebar?.label) directoryIndexLinks.add(indexLink);
				result.push(indexLink);
			}
		}
		for (const entry of scoped) {
			if (entry.id === "index") continue;
			if (entry.id === directory) continue;
			const id = entry.id;
			const relativeTo = directory ?? "";
			const relativeId = relativeTo ? id === relativeTo ? "" : id.slice(relativeTo.length + 1) : id;
			if (parentPath === "") if (!relativeId || relativeId.includes("/") === false) {
				if (!relativeId) continue;
				if (hasChildren.has(id)) {
					if (!groupsAtLevel.has(id)) {
						const group = createGroupFromEntry(id, entry, currentPath, byId);
						groupsAtLevel.set(id, group);
						result.push(group);
					}
				} else result.push(createLink(entry, currentPath, hrefPrefix));
			} else {
				const firstSeg = relativeId.split("/")[0];
				const topDir = directory ? `${directory}/${firstSeg}` : firstSeg;
				if (!groupsAtLevel.has(topDir)) {
					const group = createGroupFromEntry(topDir, byId.get(topDir), currentPath, byId);
					groupsAtLevel.set(topDir, group);
					result.push(group);
				}
			}
			else {
				if (!id.startsWith(`${parentPath}/`)) continue;
				const remainderParts = id.slice(parentPath.length + 1).split("/");
				if (remainderParts.length === 1) if (hasChildren.has(id)) {
					if (!groupsAtLevel.has(id)) {
						const group = createGroupFromEntry(id, entry, currentPath, byId);
						groupsAtLevel.set(id, group);
						result.push(group);
					}
				} else result.push(createLink(entry, currentPath, hrefPrefix));
				else {
					const nextDir = `${parentPath}/${remainderParts[0]}`;
					if (!groupsAtLevel.has(nextDir)) {
						const group = createGroupFromEntry(nextDir, byId.get(nextDir), currentPath, byId);
						groupsAtLevel.set(nextDir, group);
						result.push(group);
					}
				}
			}
		}
		for (const [groupPath, group] of groupsAtLevel) {
			const nestedChildren = buildLevel(groupPath);
			group.children = [...group.children, ...nestedChildren].sort(sortSidebarItems);
			if (group.order === Number.MAX_VALUE && group.children.length > 0) group.order = Math.min(...group.children.map((item) => item.order));
		}
		return result.sort(sortSidebarItems);
	}
	function createGroupFromEntry(dirPath, indexEntry, currentPath2, _byId) {
		const dirSegment = dirPath.split("/").pop();
		const groupConfig = indexEntry?.data.sidebar?.group;
		const groupLabel = groupConfig?.label ?? indexEntry?.data.title ?? formatLabel(dirSegment);
		const indexLabel = indexEntry?.data.sidebar?.label;
		const groupOrder = indexEntry?.data.sidebar?.order ?? Number.MAX_VALUE;
		const groupBadge = groupConfig?.badge ?? indexEntry?.data.sidebar?.badge;
		const hideIndex = groupConfig?.hideIndex === true;
		let indexHref;
		let indexIsCurrent = false;
		let indexIsExternal = false;
		let indexNeverActive = false;
		if (indexEntry && !hideIndex) {
			const externalLink = indexEntry.data.external_link;
			if (externalLink !== void 0) if (isAbsoluteUrl(externalLink)) {
				indexHref = externalLink;
				indexIsExternal = true;
			} else {
				indexHref = toBrowserHref(externalLink);
				indexNeverActive = true;
			}
			else {
				indexHref = joinHref(hrefPrefix, indexEntry.id);
				indexIsCurrent = toRouteKey(currentPath2) === toRouteKey(indexHref);
			}
		}
		const group = {
			type: "group",
			label: groupLabel,
			order: groupOrder,
			badge: groupBadge,
			icon: groupConfig?.icon,
			children: [],
			_indexId: indexEntry?.id,
			_indexLabel: indexLabel,
			indexHref,
			indexIsCurrent: indexIsCurrent || void 0,
			indexIsExternal: indexIsExternal || void 0,
			_indexNeverActive: indexNeverActive || void 0,
			_routeKey: joinHref(hrefPrefix, dirPath)
		};
		sortKeyByItem.set(group, dirPath);
		return group;
	}
	if (directory) return buildLevel(directory);
	return buildLevel("");
}
function resolveConfigItems(configItems, entriesByCollection, primaryCollection, currentPath, orderStart = 0, primaryPrefix = "") {
	const primaryEntries = entriesByCollection[primaryCollection] ?? [];
	const { byId } = buildEntryIndex(primaryEntries);
	const result = [];
	for (let i = 0; i < configItems.length; i++) {
		const item = configItems[i];
		if (!item) continue;
		const order = orderStart + i;
		if (typeof item === "string") {
			const entry = byId.get(item);
			if (entry) {
				const link = createLink(entry, currentPath, primaryPrefix);
				link.order = order;
				result.push(link);
			} else runtimeWarn(`sidebar: Page "${item}" referenced in config but not found in primary collection "${primaryCollection}"`);
		} else if ("link" in item) if (isAbsoluteUrl(item.link) || !item.link.startsWith("/")) {
			const extLink = {
				type: "external",
				label: item.label,
				href: item.link,
				badge: item.badge,
				order
			};
			result.push(extLink);
		} else {
			const href = toBrowserHref(item.link);
			const routeKey = toRouteKey(item.link);
			const lookup = routeKey.slice(1);
			if (lookup !== "" && !lookup.includes("/") && !byId.has(lookup)) runtimeWarn(`sidebar: Internal link "${item.link}" (label: "${item.label}") does not match any entry in primary collection "${primaryCollection}"`);
			const link = {
				type: "link",
				label: item.label,
				href,
				isCurrent: toRouteKey(currentPath) === routeKey,
				badge: item.badge,
				order
			};
			result.push(link);
		}
		else if ("autogenerate" in item) {
			let autoItems;
			let groupPrefix;
			let autoRouteKey;
			if ("collection" in item.autogenerate) {
				const collectionName = item.autogenerate.collection;
				const collectionEntries = entriesByCollection[collectionName];
				if (!collectionEntries) {
					runtimeWarn(`sidebar: autogenerate references collection "${collectionName}" which is not registered in nimbus.config.collections; skipping`);
					autoItems = [];
				} else {
					const explicit = item.autogenerate.prefix;
					const isPrimary = collectionName === primaryCollection;
					const prefix = explicit ?? (isPrimary ? primaryPrefix : `/${collectionName}`);
					autoItems = buildFilesystemTree(collectionEntries, currentPath, void 0, prefix);
					if (!isPrimary && prefix !== "") {
						groupPrefix = prefix;
						autoRouteKey = toDocumentHref(prefix);
					}
				}
			} else {
				autoItems = buildFilesystemTree(primaryEntries, currentPath, item.autogenerate.directory, primaryPrefix);
				autoRouteKey = joinHref(primaryPrefix, item.autogenerate.directory);
			}
			if (item.label) {
				const group = {
					type: "group",
					label: item.label,
					order,
					collapsed: item.collapsed,
					badge: item.badge,
					icon: item.icon,
					children: autoItems,
					_prefix: groupPrefix,
					_routeKey: autoRouteKey
				};
				result.push(group);
			} else {
				if (item.collapsed !== void 0) {
					for (const ai of autoItems) if (ai.type === "group") ai.collapsed = item.collapsed;
				}
				result.push(...autoItems);
			}
		} else if ("items" in item) {
			const children = resolveConfigItems(item.items, entriesByCollection, primaryCollection, currentPath, 0, primaryPrefix);
			const group = {
				type: "group",
				label: item.label,
				order,
				collapsed: item.collapsed,
				badge: item.badge,
				icon: item.icon,
				children
			};
			const landing = item.landing;
			const segment = item.segment;
			if (segment !== void 0) {
				group.segment = segment;
				group._routeKey = toDocumentHref(segment.startsWith("/") ? segment : `/${segment}`);
			}
			if (landing !== void 0) {
				group.indexHref = toDocumentHref(landing);
				group.indexIsCurrent = toRouteKey(currentPath) === toRouteKey(landing) || void 0;
			}
			result.push(group);
		}
	}
	return result;
}
function cloneSidebarTree(value) {
	if (Array.isArray(value)) {
		const out = new Array(value.length);
		for (let i = 0; i < value.length; i++) out[i] = cloneSidebarTree(value[i]);
		return out;
	}
	if (value !== null && typeof value === "object") {
		const out = {};
		for (const k of Object.keys(value)) out[k] = cloneSidebarTree(value[k]);
		return out;
	}
	return value;
}
function firstPathSegment(href) {
	const seg = href.split("/").filter(Boolean)[0];
	return seg && !seg.includes(":") ? seg : void 0;
}
function internalIndexSegment(group) {
	return group.indexHref && !group.indexIsExternal && !group._indexNeverActive ? firstPathSegment(group.indexHref) : void 0;
}
function groupProductSegment(group) {
	const ownSeg = internalIndexSegment(group);
	if (ownSeg) return ownSeg;
	const stack = [...group.children];
	while (stack.length > 0) {
		const item = stack.shift();
		if (item.type === "link") {
			if (item._neverActive) continue;
			const seg = firstPathSegment(item.href);
			if (seg) return seg;
		} else if (item.type === "group") {
			const seg = internalIndexSegment(item);
			if (seg) return seg;
			stack.unshift(...item.children);
		}
	}
}
function scopeToGroup(group, currentPath, key) {
	const children = cloneSidebarTree(group.children);
	markActiveState(children, currentPath);
	if (!group.indexHref) return children;
	const badge = group.badge && typeof group.badge === "object" ? { ...group.badge } : group.badge;
	return [group.indexIsExternal ? {
		type: "external",
		label: group.label,
		href: group.indexHref,
		badge,
		order: Number.NEGATIVE_INFINITY
	} : {
		type: "link",
		label: group.label,
		href: group.indexHref,
		isCurrent: groupIndexMatchesKey(group, key),
		badge,
		order: Number.NEGATIVE_INFINITY
	}, ...children];
}
function scopeToCurrentSection(items, currentPath) {
	const key = toRouteKey(currentPath);
	const currentSegment = currentPath.split("/").filter(Boolean)[0];
	if (currentSegment) {
		for (const item of items) if (item.type === "group" && containsRouteKey(item, key)) return scopeToGroup(item, currentPath, key);
		for (const item of items) if (item.type === "group" && groupProductSegment(item) === currentSegment) return scopeToGroup(item, currentPath, key);
	}
	const fallback = cloneSidebarTree(items);
	markActiveState(fallback, currentPath);
	return fallback;
}
function linkMatchesKey(item, key) {
	return item._neverActive !== true && toRouteKey(item.href) === key;
}
function groupIndexMatchesKey(item, key) {
	return !!item.indexHref && !item.indexIsExternal && item._indexNeverActive !== true && toRouteKey(item.indexHref) === key;
}
function findActivePath(items, currentPath) {
	const key = toRouteKey(currentPath);
	const isPrefix = (ancestor) => ancestor === "/" || key === ancestor || key.startsWith(ancestor + "/");
	const cleanTrail = (trail) => trail.every((n) => n.type !== "group" || !n.indexHref || n.indexIsExternal || isPrefix(toRouteKey(n.indexHref)));
	let fallback = null;
	function search(nodes, trail) {
		for (const item of nodes) if (item.type === "link") {
			if (linkMatchesKey(item, key)) {
				const path = [...trail, item];
				if (cleanTrail(trail)) return path;
				fallback ??= path;
			}
		} else if (item.type === "group") {
			const branch = [...trail, item];
			if (groupIndexMatchesKey(item, key)) {
				if (cleanTrail(trail)) return branch;
				fallback ??= branch;
			}
			const childPath = search(item.children, branch);
			if (childPath) return childPath;
		}
		return null;
	}
	return search(items, []) ?? fallback ?? [];
}
function isolateToBoundary(items, currentPath, boundaries) {
	const currentKey = toRouteKey(currentPath);
	const segs = currentKey.split("/").filter(Boolean);
	for (const glob of boundaries) {
		const globSegs = glob.split("/").filter(Boolean);
		if (segs.length < globSegs.length || globSegs.length === 0) continue;
		if (!globSegs.every((g, i) => g === "*" || g === segs[i])) continue;
		const group = findBoundaryGroup(items, toRouteKey("/" + segs.slice(0, globSegs.length).join("/")), currentKey);
		if (group) return group.children;
	}
	return items;
}
function findBoundaryGroup(items, prefixKey, currentKey) {
	for (const item of items) {
		if (item.type !== "group") continue;
		if (item._routeKey !== void 0 && toRouteKey(item._routeKey) === prefixKey && containsRouteKey(item, currentKey)) return item;
		const nested = findBoundaryGroup(item.children, prefixKey, currentKey);
		if (nested) return nested;
	}
}
function deriveTransformCtx(fullTree, currentSlug) {
	const segs = currentSlug.split("/").filter(Boolean);
	const sectionGroup = findActivePath(fullTree, currentSlug).find((n) => n.type === "group");
	return {
		sectionSlug: segs[0] ?? "",
		module: segs[1],
		indexEntryId: sectionGroup?._indexId
	};
}
function subtreeContainsPath(item, currentPath) {
	return containsRouteKey(item, toRouteKey(currentPath));
}
function containsRouteKey(item, key) {
	if (item.type === "link") return linkMatchesKey(item, key);
	if (item.type === "external") return false;
	if (groupIndexMatchesKey(item, key)) return true;
	return item.children.some((child) => containsRouteKey(child, key));
}
function markActiveState(items, currentPath) {
	const key = toRouteKey(currentPath);
	for (const item of items) if (item.type === "link") item.isCurrent = linkMatchesKey(item, key);
	else if (item.type === "group") {
		if (item.indexHref) item.indexIsCurrent = groupIndexMatchesKey(item, key) || void 0;
		markActiveState(item.children, currentPath);
	}
}
function deriveSidebarSections(items, currentPath) {
	return items.flatMap((item) => {
		if (item.type !== "group") return [];
		if (!item._prefix) return [];
		if (flattenSidebar(item.children).length === 0) return [];
		return [{
			label: item.label,
			href: toDocumentHref(item._prefix),
			isActive: subtreeContainsPath(item, currentPath)
		}];
	});
}
function buildSidebarTree(entriesByCollection, primaryCollection, currentPath, config, primaryPrefix = "") {
	const primaryEntries = entriesByCollection[primaryCollection] ?? [];
	let items;
	if (config?.items && config.items.length > 0) items = resolveConfigItems(config.items, entriesByCollection, primaryCollection, currentPath, 0, primaryPrefix);
	else items = buildFilesystemTree(primaryEntries, currentPath, void 0, primaryPrefix);
	const pooledEntries = Object.values(entriesByCollection).flat();
	items = processHideChildren(items, pooledEntries);
	if (config?.overviewLabel) {
		const label = typeof config.overviewLabel === "string" ? config.overviewLabel : "Overview";
		items = applyOverviewLabel(items, label);
	}
	if (config?.defaultCollapsed) applyDefaultCollapsed(items);
	return items;
}
function applyDefaultCollapsed(items) {
	for (const item of items) if (item.type === "group") {
		if (item.collapsed === void 0) item.collapsed = true;
		applyDefaultCollapsed(item.children);
	}
}
function applyOverviewLabel(items, label) {
	for (const item of items) if (item.type === "link" && directoryIndexLinks.has(item)) item.label = label;
	else if (item.type === "group") {
		if (item._indexId) {
			const firstLink = item.children.find((child) => child.type === "link");
			if (firstLink && sortKeyByItem.get(firstLink) === item._indexId) firstLink.label = label;
		}
		applyOverviewLabel(item.children, label);
	}
	return items;
}
function processHideChildren(items, entries) {
	const entryById = /* @__PURE__ */ new Map();
	for (const e of entries) entryById.set(e.id, e);
	function process(items2) {
		const result = [];
		for (const item of items2) {
			if (item.type !== "group") {
				result.push(item);
				continue;
			}
			if (item._indexId && item.indexHref) {
				const entry = entryById.get(item._indexId);
				if (entry?.data.sidebar?.hideChildren || entry?.data.hideChildren) {
					const replacement = item.indexIsExternal ? {
						type: "external",
						label: item.label,
						href: item.indexHref,
						badge: item.badge,
						order: item.order
					} : {
						type: "link",
						label: item.label,
						href: item.indexHref,
						isCurrent: item.indexIsCurrent === true,
						_neverActive: item._indexNeverActive,
						badge: item.badge,
						order: item.order
					};
					sortKeyByItem.set(replacement, item._indexId);
					result.push(replacement);
					continue;
				}
			}
			item.children = process(item.children);
			result.push(item);
		}
		return result;
	}
	return process(items);
}
function collectSidebarCollectionRefs(items) {
	if (!items) return [];
	const found = /* @__PURE__ */ new Set();
	function walk(items2) {
		for (const item of items2) {
			if (typeof item === "string") continue;
			if ("autogenerate" in item && "collection" in item.autogenerate) found.add(item.autogenerate.collection);
			else if ("items" in item) walk(item.items);
		}
	}
	walk(items);
	return [...found];
}
function flattenSidebar(items) {
	const flat = [];
	for (const item of items) if (item.type === "link") flat.push(item);
	else if (item.type === "group") {
		if (item.indexHref && !item.indexIsExternal) flat.push({
			type: "link",
			label: item.label,
			href: item.indexHref,
			isCurrent: item.indexIsCurrent === true,
			badge: item.badge,
			order: item.order
		});
		flat.push(...flattenSidebar(item.children));
	}
	return flat;
}
function applyOverviewLeaf(items, sectionSlug, label) {
	return pinSectionOverviewFirst(liftOverviewLeaves(items, label), sectionSlug, label);
}
function liftOverviewLeaves(items, label) {
	const lower = label.toLowerCase();
	return items.map((item) => {
		if (item.type !== "group") return item;
		const children = liftOverviewLeaves(item.children, label);
		if (!(!!item.indexHref && !item.indexIsExternal && !item._indexNeverActive && item.label.trim().toLowerCase() !== lower)) return {
			...item,
			children
		};
		const overview = {
			type: "link",
			label: item._indexLabel ?? label,
			href: item.indexHref,
			isCurrent: item.indexIsCurrent === true,
			order: Number.NEGATIVE_INFINITY
		};
		return {
			...item,
			indexHref: void 0,
			indexIsCurrent: void 0,
			indexIsExternal: void 0,
			_indexNeverActive: void 0,
			children: [overview, ...children]
		};
	});
}
function pinSectionOverviewFirst(items, sectionSlug, label) {
	if (!sectionSlug) return items;
	const rootKey = toRouteKey(`/${sectionSlug}/`);
	const idx = items.findIndex((it) => it.type === "link" && toRouteKey(it.href) === rootKey);
	if (idx < 0) return items;
	if (!flattenSidebar(items).some((l) => firstPathSegment(l.href) === sectionSlug && toRouteKey(l.href) !== rootKey)) return items;
	const next = [...items];
	const [landing] = next.splice(idx, 1);
	if (!landing || landing.type !== "link") return items;
	next.unshift({
		...landing,
		label
	});
	return next;
}
function formatLabel(segment) {
	return segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
function buildSidebarIdentity(items) {
	return items.flatMap((item) => item.type === "group" ? item.label + buildSidebarIdentity(item.children) : item.label + ("href" in item ? item.href : "")).join("");
}
function sidebarHash(items) {
	const identity = buildSidebarIdentity(items);
	let hash = 0;
	for (let i = 0; i < identity.length; i++) hash = (hash << 5) - hash + identity.charCodeAt(i);
	return (hash >>> 0).toString(36).padStart(7, "0");
}
var OG_IMAGE_ROUTE = "/og/";
function pageUrls(prefix, entry) {
	const route = entryRouteUrl(prefix, entry.id);
	const page = route === "/" ? "" : route;
	return {
		url: toDocumentHref(route),
		markdownUrl: `${page}/index.md`,
		sourceUrl: typeof entry.body === "string" && entry.body.length > 0 ? `${page}/index.mdx` : void 0,
		ogImageUrl: `${OG_IMAGE_ROUTE}${page.slice(1) || "index"}.png`
	};
}
function ogImagePageKey(ogImageUrl) {
	return ogImageUrl.slice(4);
}
function nodeHref(node) {
	if (node.type === "link") return node.href;
	if (node.type === "external") return void 0;
	return node.indexIsExternal ? void 0 : node.indexHref;
}
function assembleBreadcrumbs(root, path, labels) {
	const crumbs = [{
		label: root.label,
		href: root.href
	}];
	path.forEach((node, i) => {
		const override = labels[i];
		if (override === null) return;
		const label = override ?? node.label;
		const href = nodeHref(node);
		crumbs.push(href ? {
			label,
			href
		} : { label });
	});
	const seen = /* @__PURE__ */ new Set();
	return crumbs.filter((c) => {
		if (c.href === void 0) return true;
		if (seen.has(c.href)) return false;
		seen.add(c.href);
		return true;
	});
}
function breadcrumbsFromUrl(slug, homeLabel = "Home") {
	const parts = slug.split("/").filter(Boolean);
	const crumbs = [{
		label: homeLabel,
		href: "/"
	}];
	let path = "";
	for (const part of parts) {
		path += `/${part}`;
		const label = safeDecode(part).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
		crumbs.push({
			label,
			href: toDocumentHref(path)
		});
	}
	return crumbs;
}
function resolveOverride(override, fallback, validInternalLinks) {
	if (override === false) return void 0;
	if (override === void 0) return fallback;
	if (typeof override === "string") {
		if (!fallback) return void 0;
		return {
			label: override,
			href: fallback.href
		};
	}
	if (override.link && !override.link.startsWith("/") && !override.link.startsWith("http")) throw new Error(`prev/next override link "${override.link}" must be an absolute path (starting with /) or a full URL`);
	if (override.link?.startsWith("/") && validInternalLinks) {
		const targetPath = toRouteKey(override.link);
		if (!validInternalLinks.has(targetPath)) throw new Error(`prev/next override link "${override.link}" does not match any existing internal docs route`);
	}
	const label = override.label ?? fallback?.label;
	const href = override.link ? toBrowserHref(override.link) : fallback?.href;
	if (!fallback && (label === void 0 || href === void 0)) throw new Error("prev/next object override requires both `label` and `link` when no sidebar neighbor exists");
	if (!href) return void 0;
	return {
		label: label ?? "",
		href
	};
}
function getPrevNext$1(currentPath, sidebarTree, overrides, validInternalLinks) {
	const flat = flattenSidebar(sidebarTree);
	const currentKey = toRouteKey(currentPath);
	const index = flat.findIndex((item) => toRouteKey(item.href) === currentKey);
	const sidebarPrev = index > 0 ? {
		label: flat[index - 1].label,
		href: flat[index - 1].href
	} : void 0;
	const sidebarNext = index >= 0 && index < flat.length - 1 ? {
		label: flat[index + 1].label,
		href: flat[index + 1].href
	} : void 0;
	if (!overrides) return {
		prev: sidebarPrev,
		next: sidebarNext
	};
	return {
		prev: resolveOverride(overrides.prev, sidebarPrev, validInternalLinks),
		next: resolveOverride(overrides.next, sidebarNext, validInternalLinks)
	};
}
function getHeadings(headings, config) {
	const min = config?.minHeadingLevel ?? 2;
	const max = config?.maxHeadingLevel ?? 3;
	return headings.filter((h) => h.depth >= min && h.depth <= max);
}
var cache;
function getValidInternalLinks(indexed) {
	if (cache?.source === indexed) return cache.set;
	const set = new Set(indexed.map((e) => toRouteKey(e.url)));
	cache = {
		source: indexed,
		set
	};
	return set;
}
function normalizedPathname(url) {
	return toRouteKey(url.pathname);
}
function normalizedPageId(param) {
	if (!param) return "index";
	const route = toRouteKey(`/${param}`);
	return route === "/" ? "index" : route.slice(1);
}
function mountedCollectionSegment(context) {
	const pathSegments = normalizedPathname(context.url).split("/").filter(Boolean);
	const param = context.params.slug;
	if (!param) return pathSegments.at(-1) ?? null;
	const paramSegments = normalizedPageId(param).split("/");
	if (pathSegments.slice(-paramSegments.length).join("/") !== paramSegments.join("/")) return null;
	return pathSegments.at(-(paramSegments.length + 1)) ?? null;
}
async function requestProseIdentity(context, collection, getVersions2) {
	const id = normalizedPageId(context.params.slug);
	const versions = await getVersions2();
	const [first, ...rest] = id === "index" ? [] : id.split("/");
	const mount = mountedCollectionSegment(context);
	if (first && versions?.others.includes(first) && (!collection && !mount || collection === "docs" || collection === `docs-${first}`)) return {
		collection: `${PRIMARY_COLLECTION$1}-${first}`,
		id: rest.join("/") || "index"
	};
	if (collection) return {
		collection,
		id
	};
	if (!mount) return null;
	const candidate = versions?.others.includes(mount) ? `${PRIMARY_COLLECTION$1}-${mount}` : mount;
	return collectionMountPrefix(candidate, versions) === `/${mount}` ? {
		collection: candidate,
		id
	} : null;
}
async function resolveProsePage(context, options, dependencies) {
	const staticEntry = context.props.entry;
	const requestIdentity = staticEntry ? null : await requestProseIdentity(context, options.collection, dependencies.getVersions);
	const collection = staticEntry?.collection ?? requestIdentity?.collection;
	if (!collection || !staticEntry && !requestIdentity) return { status: "not-found" };
	const entry = staticEntry ?? await dependencies.getVisibleEntry(collection, requestIdentity.id, context.projection);
	if (!entry) return { status: "not-found" };
	const rendered = await dependencies.render(entry);
	return {
		status: "found",
		page: {
			kind: "prose",
			identity: {
				pathname: normalizedPathname(context.url),
				collection
			},
			entry,
			...rendered
		}
	};
}
async function getEntryMarkdown(entry, options = {}) {
	const { loadCitationIndex } = await import("./load-citation-index-Cobx6BUc_DI1_Kmf5.mjs");
	await loadNimbusConfig();
	return renderEntryAsMarkdown(entry, {
		...options,
		citationIndex: await loadCitationIndex()
	});
}
async function getCoordinatesManifest() {
	const { loadCoordinatesManifest } = await import("./load-citation-index-Cobx6BUc_DI1_Kmf5.mjs");
	return loadCoordinatesManifest();
}
var indexedEntriesCache = /* @__PURE__ */ new Map();
async function getIndexedEntries(ctx) {
	const cacheKey = audienceCacheKey(resolveAudience(ctx));
	const cached = indexedEntriesCache.get(cacheKey);
	if (cached) return cached;
	const { getCollection } = await import("./_astro_content_qq75t_pv.mjs");
	const collectionNames = await loadIndexedCollections();
	const names = collectionNames.length > 0 ? collectionNames : [PRIMARY_COLLECTION$1];
	const versions = await getVersions();
	const indexed = [];
	for (const name of names) {
		const { entries, warning } = await loadCollectionOrWarn(name, (n) => getCollection(n));
		if (warning) runtimeWarn(warning);
		const prefix = collectionMountPrefix(name, versions);
		const collectionVersion = await getCurrentVersion(name);
		for (const entry of entries) {
			const data = entry.data ?? {};
			if (data.draft === true) continue;
			const entryVersion = typeof data.version === "string" ? data.version : collectionVersion ?? void 0;
			const title = typeof data.title === "string" && data.title.length > 0 ? data.title : entry.id;
			const rawDescription = data.description;
			const description = typeof rawDescription === "string" && rawDescription.length > 0 ? rawDescription : void 0;
			indexed.push({
				entry,
				collection: name,
				title,
				description,
				...pageUrls(prefix, entry),
				version: entryVersion
			});
		}
	}
	indexedEntriesCache.set(cacheKey, indexed);
	return indexed;
}
async function getOgImagePages() {
	return Object.fromEntries((await getIndexedEntries()).map((item) => [ogImagePageKey(item.ogImageUrl), item]));
}
async function renderIndexedEntryMarkdown(item, options) {
	if (!(await loadApiCollections()).includes(item.collection)) return getEntryMarkdown(item.entry);
	const { renderApiPageMarkdown } = await import("./markdown-fOUs3w2D_CeowwI8D.mjs").then((n) => n.t);
	const { isPreparedApiPage } = await import("./prepared-CjmdPlWE_DpDRMEkx.mjs").then((n) => n.a);
	const apiData = item.entry.data;
	const coordinate = apiData.coordinate;
	if (typeof coordinate !== "string") throw new Error(`nimbus-docs: API entry "${item.entry.id}" in collection "${item.collection}" is missing its coordinate — the apiCollection() loader should have set it.`);
	if (isPreparedApiPage(apiData.prepared)) return renderApiPageMarkdown(apiData.prepared.page, { base: options?.base });
	if (!THIN_API_ENTRIES) throw new Error(`nimbus-docs: API entry "${item.entry.id}" in collection "${item.collection}" is missing its prepared page data — rebuild the apiCollection() index.`);
	const version = item.entry.data.version;
	return renderApiPageMarkdown(await projectConfiguredApiPageProps(item.collection, version ?? null, coordinate), { base: options?.base });
}
async function getSidebar(currentSlug, options) {
	currentSlug = withoutHtmlExtension(currentSlug);
	const config = await loadNimbusConfig();
	const structural = await buildStructuralTree(options?.collection);
	let tree;
	if (config.sidebar?.scope === "section") tree = scopeToCurrentSection(structural, currentSlug);
	else {
		tree = cloneSidebarTree(structural);
		markActiveState(tree, currentSlug);
	}
	const boundaries = config.sidebar?.isolate?.boundaries;
	if (boundaries && boundaries.length > 0) tree = isolateToBoundary(tree, currentSlug, boundaries);
	if (options?.transform) {
		const ctx = deriveTransformCtx(structural, currentSlug);
		tree = await options.transform({
			tree,
			currentSlug,
			...ctx
		});
	}
	if (config.sidebar?.indexDisplay === "overview-leaf") {
		const label = typeof config.sidebar.overviewLabel === "string" ? config.sidebar.overviewLabel : "Overview";
		const sectionSlug = currentSlug.split("/").filter(Boolean)[0] ?? "";
		tree = applyOverviewLeaf(tree, sectionSlug, label);
	}
	return tree;
}
async function getSidebarSections(currentSlug, options) {
	currentSlug = withoutHtmlExtension(currentSlug);
	return deriveSidebarSections(await buildStructuralTree(options?.collection), currentSlug);
}
var NO_ACTIVE_PATH = "\0__nimbus_structural__";
var structuralTreeCache = /* @__PURE__ */ new Map();
function deepFreeze(items) {
	for (const item of items) {
		if (item.type === "group") deepFreeze(item.children);
		Object.freeze(item);
	}
	Object.freeze(items);
}
async function buildStructuralTree(pageCollection) {
	const runtimeConfig = await loadNimbusConfig();
	const versions = await getVersions();
	let effectivePrimary = PRIMARY_COLLECTION$1;
	let primaryPrefix = "";
	if (versions && pageCollection && pageCollection.startsWith("docs-") && versions.others.includes(pageCollection.slice(5))) {
		effectivePrimary = pageCollection;
		primaryPrefix = collectionMountPrefix(pageCollection, versions);
	}
	const cached = structuralTreeCache.get(effectivePrimary);
	if (cached) return cached;
	const rewrittenItems = effectivePrimary !== "docs" ? rewriteSidebarItemsForVersion(runtimeConfig.sidebar?.items, effectivePrimary) : runtimeConfig.sidebar?.items;
	const referenced = collectSidebarCollectionRefs(rewrittenItems);
	const tree = buildSidebarTree(await getVisibleEntriesByCollection([effectivePrimary, ...referenced.filter((c) => c !== effectivePrimary)]), effectivePrimary, NO_ACTIVE_PATH, runtimeConfig.sidebar ? {
		...runtimeConfig.sidebar,
		items: rewrittenItems
	} : void 0, primaryPrefix);
	deepFreeze(tree);
	structuralTreeCache.set(effectivePrimary, tree);
	return tree;
}
function rewriteSidebarItemsForVersion(items, effectivePrimary) {
	if (!items) return items;
	return items.map((item) => {
		if (!item || typeof item !== "object") return item;
		const o = item;
		const autogen = o.autogenerate;
		if (autogen && autogen.collection === "docs") return {
			...o,
			autogenerate: {
				...autogen,
				collection: effectivePrimary
			}
		};
		if (Array.isArray(o.items)) return {
			...o,
			items: rewriteSidebarItemsForVersion(o.items, effectivePrimary)
		};
		return item;
	});
}
async function getPrevNext(currentSlug, options) {
	currentSlug = withoutHtmlExtension(currentSlug);
	const tree = options?.sidebarTree ?? await getSidebar(currentSlug);
	const validInternalLinks = getValidInternalLinks(await getIndexedEntries());
	return getPrevNext$1(currentSlug, tree, options?.overrides, validInternalLinks);
}
async function getBreadcrumbs(currentSlug, options) {
	currentSlug = withoutHtmlExtension(currentSlug);
	const path = findActivePath(await buildStructuralTree(options?.collection), currentSlug);
	if (path.length > 0) return assembleBreadcrumbs(options?.root ?? {
		label: "Home",
		href: "/"
	}, path, await Promise.all(path.map((node) => Promise.resolve(options?.resolveLabel?.({
		node,
		slug: currentSlug
	})))));
	return breadcrumbsFromUrl(currentSlug, options?.root?.label ?? "Home");
}
async function getEditUrl(entry) {
	const runtimeConfig = await loadNimbusConfig();
	if (!runtimeConfig.editPattern) return void 0;
	const path = entry.filePath ?? `src/content/docs/${entry.id}.mdx`;
	return runtimeConfig.editPattern.replace("{path}", path);
}
async function getLastUpdated(entry) {
	const path = entry.filePath ?? `src/content/docs/${entry.id}.mdx`;
	const { getLastUpdatedFromGit } = await import("./git-last-updated_B4VjexLN.mjs");
	return getLastUpdatedFromGit(path);
}
function getTOC(headings, options) {
	return getHeadings(headings, options);
}
function pageResolutionContext(astro) {
	const audience = astro.locals.nimbus?.audience;
	return {
		props: astro.props,
		params: astro.params,
		url: astro.url,
		projection: audience ? { audience } : void 0
	};
}
async function resolveAstroProsePage(astro, collection) {
	return await resolveProsePage(pageResolutionContext(astro), { collection }, {
		getVisibleEntry,
		getVersions,
		async render(entry) {
			const { render } = await import("./_astro_content_qq75t_pv.mjs");
			let rendered;
			try {
				rendered = await render(entry);
			} catch (error) {
				throw new Error(`nimbus-docs: failed to render prose entry "${entry.collection}:${entry.id}".`, { cause: error });
			}
			const { Content, headings } = rendered;
			const { getPreparedHeadings } = await import("./prepared-headings-BB7XQsWS_DFolCt0K.mjs").then((n) => n.n);
			const prepared = await getPreparedHeadings(entry.collection, entry.id);
			if (prepared) return {
				Content,
				headings: prepared
			};
			return {
				Content,
				headings
			};
		}
	});
}
function proseResolutionResponse(astro, result) {
	if (result.status === "redirect") return astro.redirect(result.location, result.permanent ? 308 : 307);
	return new Response(null, {
		status: 404,
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}
async function resolveProseRoute(astro, collection, missingPropsMessage) {
	if (!astro.props.entry && astro.isPrerendered !== false) throw new Error(missingPropsMessage);
	const result = await resolveAstroProsePage(astro, collection);
	if (result.status !== "found") return proseResolutionResponse(astro, result);
	const { entry: found, Content, headings } = result.page;
	const { markdownUrl, sourceUrl, ogImageUrl } = pageUrls(collectionMountPrefix(found.collection, await getVersions()), found);
	return {
		entry: found,
		Content,
		headings,
		markdownUrl,
		sourceUrl,
		ogImageUrl
	};
}
var getDocsStaticPaths = async () => {
	return (await getVisibleEntries(["docs"])).map((entry) => ({
		params: { slug: entryRouteKey(entry.id) },
		props: { entry },
		cacheKey: String(entry.digest)
	}));
};
function getDocsPage(astro) {
	rejectRemovedPartialHeadingOptions("getDocsPage", arguments.length);
	return resolveProseRoute(astro, PRIMARY_COLLECTION$1, "getDocsPageProps(): expected `entry` in Astro.props. Ensure your route uses `getStaticPaths = getDocsStaticPaths` (or passes an entry via custom getStaticPaths).");
}
async function getRouteFlags(entry) {
	const config = await loadNimbusConfig();
	const isCustom = entry.data.mode === "custom";
	return {
		sidebar: !isCustom && config.features?.sidebar !== false && entry.data.sidebar !== false,
		tableOfContents: !isCustom && config.features?.tableOfContents !== false && entry.data.tableOfContents !== false
	};
}
function rejectRemovedPartialHeadingOptions(helper, argumentCount) {
	if (argumentCount <= 1) return;
	throw new Error(`${helper}(Astro, options) was removed in Nimbus 0.13. Run \`npx @cloudflare/nimbus-docs migrate\` to move partialHeadings.resolvePartialId to the integration's markdown.partialResolver option.`);
}
var THIN_API_ENTRIES = true;
async function getApiVersions(collection) {
	const entry = ((await loadNimbusConfig()).api ?? []).find((a) => a.collection === collection);
	if (!entry || !entry.versions) return null;
	const { resolveApiFamily } = await import("./resolve-versions-B1VqIR_H_Dr3BZdre.mjs").then((n) => n.a);
	return resolveApiFamily(entry).map((t) => ({
		version: t.version,
		label: t.label,
		isDefault: t.isDefault,
		status: t.status,
		hidden: t.hidden,
		url: toDocumentHref(t.mountPath)
	}));
}
async function getVersions() {
	const v = (await loadNimbusConfig()).versions;
	if (!v) return null;
	const others = v.others ?? [];
	return {
		current: v.current,
		others,
		deprecated: v.deprecated ?? [],
		hidden: v.hidden ?? [],
		all: [v.current, ...others]
	};
}
async function getCurrentVersion(collectionId) {
	const versions = await getVersions();
	if (!versions) return null;
	if (collectionId === "docs") return versions.current;
	if (!collectionId.startsWith("docs-")) return null;
	const suffix = collectionId.slice(5);
	return versions.all.includes(suffix) ? suffix : null;
}
async function getVersionAlternates(collectionId, entryId) {
	return (await loadVersionAlternates())[`${collectionId}:${entryId}`] ?? null;
}
async function getApiVersionAlternates(collection, version, coordinate) {
	if (version == null) return null;
	const config = await loadNimbusConfig();
	const { resolveApiVersion } = await import("./resolve-versions-B1VqIR_H_Dr3BZdre.mjs").then((n) => n.a);
	const target = resolveApiVersion(config.api, collection, version);
	if (!target) return null;
	return (await loadVersionAlternates())[`${target.versionKey}:${coordinate}`] ?? null;
}
async function getCollectionLlmsUrl(collectionId) {
	if (collectionId === "docs") return "/llms.txt";
	const versions = await getVersions();
	if (versions && collectionId.startsWith("docs-")) {
		const slug = collectionId.slice(5);
		if (versions.others.includes(slug)) {
			if (versions.hidden.includes(slug)) return "/llms.txt";
			return `/${slug}/llms.txt`;
		}
	}
	return `/${collectionId}/llms.txt`;
}
async function getVersionStatus(collectionId) {
	const at = collectionId.indexOf("@");
	if (at > 0) {
		const family = collectionId.slice(0, at);
		const version2 = collectionId.slice(at + 1);
		const apiVersions = await getApiVersions(family);
		if (apiVersions) {
			const match = apiVersions.find((v) => v.version === version2);
			if (!match) return null;
			return {
				version: version2,
				isCurrent: match.isDefault,
				isDeprecated: match.status === "deprecated",
				isHidden: match.hidden
			};
		}
	}
	const versions = await getVersions();
	if (!versions) return null;
	const version = await getCurrentVersion(collectionId);
	if (version === null) return null;
	return {
		version,
		isCurrent: version === versions.current,
		isDeprecated: versions.deprecated.includes(version),
		isHidden: versions.hidden.includes(version)
	};
}
//#endregion
export { renderIndexedEntryMarkdown as C, collectionMountPrefix as E, loadRequestRenderingCollections as S, getTabs as T, getVersionStatus as _, getDocsPage as a, loadApiCollections as b, getIndexedEntries as c, getPrevNext as d, getRouteFlags as f, getVersionAlternates as g, getTOC as h, getCoordinatesManifest as i, getLastUpdated as l, getSidebarSections as m, getBreadcrumbs as n, getDocsStaticPaths as o, getSidebar as p, getCollectionLlmsUrl as r, getEditUrl as s, getApiVersionAlternates as t, getOgImagePages as u, getVisibleEntries as v, sidebarHash as w, loadNimbusConfig as x, getVisibleEntry as y };
