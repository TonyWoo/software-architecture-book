import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { i as markdownRoute } from "./agent-endpoints_DHE16_W1.mjs";
//#region src/pages/[...slug]/index.md.ts
var index_md_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true
});
var { GET, getStaticPaths } = markdownRoute();
//#endregion
//#region \0virtual:astro:page:src/pages/[...slug]/index.md@_@ts
var page = () => index_md_exports;
//#endregion
export { page };
