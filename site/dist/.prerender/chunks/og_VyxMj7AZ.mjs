import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { n as config } from "./config_Cgcmwh2X.mjs";
import { r as generateOpenGraphImage, t as ogCardConfig } from "./_og-card-config_BFdYJVeK.mjs";
//#region src/pages/og.png.ts
var og_png_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => true
});
async function GET() {
	const body = await generateOpenGraphImage({
		title: config.title,
		description: config.description,
		...ogCardConfig
	});
	return new Response(body, { headers: { "Content-Type": "image/png" } });
}
//#endregion
//#region \0virtual:astro:page:src/pages/og.png@_@ts
var page = () => og_png_exports;
//#endregion
export { page };
