import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { C as addAttribute, b as renderTemplate, f as renderComponent, x as maybeRenderHead } from "./jsx-runtime_F2SftQcZ.mjs";
import { t as createComponent } from "./astro-component_Dy02WjwP.mjs";
import { n as $$BaseLayout, t as $$Header } from "./Header_BJlPZJxs.mjs";
import { c as getIndexedEntries } from "./runtime_nQNhOH3A.mjs";
import { c as withBase } from "./url-DyuBs32r_CvQlmwi9.mjs";
import { n as config } from "./config_Cgcmwh2X.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => true,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const cards = [
		{
			id: "book/index",
			label: "全书导读",
			blurb: "十章 · 五十节"
		},
		{
			id: "book/preface",
			label: "前言",
			blurb: "这本书写给谁"
		},
		{
			id: "book/foundations-and-role/index",
			label: "第 1 章",
			blurb: "Foundations & Role"
		}
	];
	const entries = await getIndexedEntries();
	const links = cards.flatMap((card) => {
		const entry = entries.find((e) => e.collection === "docs" && e.entry.id === card.id);
		return entry ? [{
			...card,
			href: withBase(entry.url, "/")
		}] : [];
	});
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": config.title,
		"description": config.description
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="flex flex-col min-h-screen">${renderComponent($$result2, "Header", $$Header, {})}<main id="main-content" tabindex="-1" class="flex-1 mx-auto max-w-2xl w-full px-6 py-24"><h1 class="text-foreground leading-tight" style="font-size: var(--nb-h1-size); font-weight: var(--nb-h1-weight); letter-spacing: var(--nb-h1-tracking);">${config.title}</h1><p class="mt-2 text-[1.0625rem] text-muted-foreground leading-relaxed">${config.description}</p>${links.length > 0 && renderTemplate`<div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">${links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="block rounded-lg border border-border p-4 transition-colors hover:border-border-strong no-underline"><div class="font-medium text-foreground">${link.label}</div><div class="mt-0.5 text-sm text-muted-foreground">${link.blurb}</div></a>`)}</div>`}</main></div>` })}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/pages/index.astro", void 0);
var $$file = "/home/hatch/workspace/software-architecture-book/site/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
