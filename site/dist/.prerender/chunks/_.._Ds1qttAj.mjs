import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { u as getOgImagePages } from "./runtime_nQNhOH3A.mjs";
import { n as OGImageRoute, t as ogCardConfig } from "./_og-card-config_BFdYJVeK.mjs";
//#region src/pages/og/[...slug].ts
var ____slug__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true
});
var { getStaticPaths, GET } = await OGImageRoute({
	pages: await getOgImagePages(),
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: page.description ?? "",
		...ogCardConfig
	})
});
//#endregion
//#region \0virtual:astro:page:src/pages/og/[...slug]@_@ts
var page = () => ____slug__exports;
//#endregion
export { page };
