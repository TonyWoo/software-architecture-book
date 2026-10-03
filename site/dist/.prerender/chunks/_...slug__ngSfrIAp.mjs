import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { a as markdownSourceRoute } from "./agent-endpoints_DHE16_W1.mjs";
//#region src/pages/[...slug]/index.mdx.ts
var index_mdx_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true
});
var { GET, getStaticPaths } = markdownSourceRoute();
//#endregion
//#region \0virtual:astro:page:src/pages/[...slug]/index.mdx@_@ts
var page = () => index_mdx_exports;
//#endregion
export { page };
