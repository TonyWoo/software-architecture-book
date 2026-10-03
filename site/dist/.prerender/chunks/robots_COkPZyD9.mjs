import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import "./runtime_nQNhOH3A.mjs";
import { c as withBase } from "./url-DyuBs32r_CvQlmwi9.mjs";
import { n as config } from "./config_Cgcmwh2X.mjs";
//#region src/pages/robots.txt.ts
var robots_txt_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => true
});
function GET() {
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${new URL(withBase("/sitemap-index.xml", "/"), config.site).href}`,
		""
	].join("\n");
	return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
//#endregion
//#region \0virtual:astro:page:src/pages/robots.txt@_@ts
var page = () => robots_txt_exports;
//#endregion
export { page };
