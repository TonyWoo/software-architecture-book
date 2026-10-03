import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { i as getCoordinatesManifest } from "./runtime_nQNhOH3A.mjs";
//#region src/pages/nimbus-api/coordinates.json.ts
/**
* `/nimbus-api/coordinates.json` — this site's published coordinate manifest,
* fetched by other sites that cite its APIs via `apiReferences[]`.
*/
var coordinates_json_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => true
});
async function GET() {
	const manifest = await getCoordinatesManifest();
	return new Response(JSON.stringify(manifest), { headers: {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "public, max-age=3600"
	} });
}
//#endregion
//#region \0virtual:astro:page:src/pages/nimbus-api/coordinates.json@_@ts
var page = () => coordinates_json_exports;
//#endregion
export { page };
