import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { C as addAttribute, b as renderTemplate, f as renderComponent, x as maybeRenderHead } from "./jsx-runtime_F2SftQcZ.mjs";
import { t as createComponent } from "./astro-component_Dy02WjwP.mjs";
import { n as $$BaseLayout, t as $$Header } from "./Header_BJlPZJxs.mjs";
import "./runtime_nQNhOH3A.mjs";
import { c as withBase } from "./url-DyuBs32r_CvQlmwi9.mjs";
import { n as config } from "./config_Cgcmwh2X.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	prerender: () => true,
	url: () => $$url
});
var $$404 = createComponent(($$result, $$props, $$slots) => {
	const homeHref = withBase("/", "/");
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": `Page not found · ${config.title}`,
		"description": "The page you're looking for doesn't exist."
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="flex flex-col min-h-screen">${renderComponent($$result2, "Header", $$Header, {})}<main id="main-content" tabindex="-1" class="flex-1 mx-auto max-w-2xl w-full px-6 py-24 text-center"><p class="text-sm font-medium text-muted-foreground">404</p><h1 class="mt-2 text-foreground leading-tight" style="font-size: var(--nb-h1-size); font-weight: var(--nb-h1-weight); letter-spacing: var(--nb-h1-tracking);">Page not found</h1><p class="mt-2 text-[1.0625rem] text-muted-foreground leading-relaxed">The page you're looking for doesn't exist or has moved.</p><a${addAttribute(homeHref, "href")} class="mt-8 inline-block rounded-lg border border-border px-4 py-2 font-medium text-foreground no-underline transition-colors hover:border-border-strong">Back home</a></main></div>` })}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/pages/404.astro", void 0);
var $$file = "/home/hatch/workspace/software-architecture-book/site/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
