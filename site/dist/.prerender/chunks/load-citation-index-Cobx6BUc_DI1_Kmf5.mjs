//#region node_modules/@cloudflare/nimbus-docs/dist/load-citation-index-Cobx6BUc.js
var _cached = null;
async function loadCitationIndex() {
	if (_cached) return _cached;
	const mod = await import("./coordinates_DboRFqs9.mjs");
	const value = new Map(Object.entries(mod.coordinates ?? {}));
	_cached = value;
	return value;
}
async function loadCoordinatesManifest() {
	return (await import("./coordinates_DboRFqs9.mjs")).manifest;
}
//#endregion
export { loadCitationIndex, loadCoordinatesManifest };
