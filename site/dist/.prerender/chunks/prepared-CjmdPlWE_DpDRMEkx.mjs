import { t as __exportAll } from "./rolldown-runtime-CXxUh8rJ_1dvZVnlz.mjs";
//#region node_modules/@cloudflare/nimbus-docs/dist/prepared-CjmdPlWE.js
var prepared_exports = /* @__PURE__ */ __exportAll({
	activatePreparedApiNav: () => activatePreparedApiNav,
	isPreparedApiNav: () => isPreparedApiNav,
	isPreparedApiPage: () => isPreparedApiPage,
	prepareApiNav: () => prepareApiNav,
	preparedApiVersion: () => 2
});
function prepareApiNav(nav) {
	const paths = Object.create(null);
	const visit = (item, parentPath) => {
		const path = [...parentPath, item.coordinate];
		paths[item.coordinate] = path;
		for (const child of item.children) visit(child, path);
	};
	for (const item of nav.items) visit(item, []);
	return {
		version: 2,
		nav,
		paths
	};
}
function activatePreparedApiNav(prepared, coordinate) {
	const path = prepared.paths[coordinate];
	if (!path) return prepared.nav;
	const onPath = new Set(path);
	const overlay = (item) => {
		if (!onPath.has(item.coordinate)) return item;
		const next = {
			...item,
			children: item.children.map(overlay)
		};
		if (item.coordinate === coordinate) next.active = true;
		else next.expanded = true;
		return next;
	};
	return {
		...prepared.nav,
		items: prepared.nav.items.map(overlay)
	};
}
function isPreparedApiPage(value) {
	if (!value || typeof value !== "object") return false;
	const prepared = value;
	if (prepared.version === 2 && typeof prepared.navEntryId === "string" && !!prepared.page && typeof prepared.page === "object") {
		const page = prepared.page;
		if (page.kind !== "operation") return true;
		if (page.example !== void 0 && (!page.example || typeof page.example !== "object" || typeof page.example.highlightedHtml !== "string" || page.example.highlightedHtml.length === 0)) return false;
		if (!Array.isArray(page.samples) || page.samples.some((sample) => !sample || typeof sample !== "object" || typeof sample.highlightedHtml !== "string" || sample.highlightedHtml.length === 0)) return false;
		if (!Array.isArray(page.responses) || page.responses.some((response) => !response || typeof response !== "object" || response.example !== void 0 && (!response.example || typeof response.example !== "object" || typeof response.example.highlightedHtml !== "string" || response.example.highlightedHtml.length === 0) || response.additionalMedia !== void 0 && !preparedMediaList(response.additionalMedia))) return false;
		if (page.requestExamples !== void 0 && (!Array.isArray(page.requestExamples) || page.requestExamples.some((example) => !example || typeof example !== "object" || typeof example.highlightedHtml !== "string" || example.highlightedHtml.length === 0))) return false;
		if (page.additionalBodies === void 0) return true;
		return preparedMediaList(page.additionalBodies);
	}
	return false;
}
/** A list of additional media bodies (request or response) whose examples, if
*  any, were highlighted during content sync. */
function preparedMediaList(list) {
	return Array.isArray(list) && !list.some((body) => !body || typeof body !== "object" || body.example !== void 0 && (!body.example || typeof body.example !== "object" || typeof body.example.highlightedHtml !== "string" || body.example.highlightedHtml.length === 0));
}
function isPreparedApiNav(value) {
	if (!value || typeof value !== "object") return false;
	const prepared = value;
	return prepared.version === 2 && !!prepared.nav && typeof prepared.nav === "object" && !!prepared.paths && typeof prepared.paths === "object";
}
//#endregion
export { prepared_exports as a };
