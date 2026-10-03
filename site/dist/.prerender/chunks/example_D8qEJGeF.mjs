//#region src/content/partials/example.mdx?astroPropagatedAssets
async function getMod() {
	return import("./example_BCy0Oe7A.mjs");
}
var defaultMod = {
	__astroPropagation: true,
	getMod,
	collectedLinks: [],
	collectedStyles: [],
	collectedScripts: []
};
//#endregion
export { defaultMod as default };
