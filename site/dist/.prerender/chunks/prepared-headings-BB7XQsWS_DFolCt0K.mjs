import { t as __exportAll } from "./rolldown-runtime-CXxUh8rJ_1dvZVnlz.mjs";
//#region node_modules/@cloudflare/nimbus-docs/dist/prepared-headings-BB7XQsWS.js
var prepared_headings_exports = /* @__PURE__ */ __exportAll({
	PREPARED_HEADINGS_GENERATION: () => 1,
	getPreparedHeadings: () => getPreparedHeadings,
	validatePreparedHeadings: () => validatePreparedHeadings
});
var indexes = /* @__PURE__ */ new WeakMap();
function headingIndex(loaded) {
	const existing = indexes.get(loaded);
	if (existing) return existing;
	const index = /* @__PURE__ */ new Map();
	for (const value of loaded.records) {
		if (!value || typeof value !== "object") continue;
		const record = value;
		if (typeof record.collection !== "string" || typeof record.id !== "string") continue;
		const key = `${record.collection}\0${record.id}`;
		const matches = index.get(key);
		if (matches) matches.push(value);
		else index.set(key, [value]);
	}
	indexes.set(loaded, index);
	return index;
}
function isHeading(value) {
	if (!value || typeof value !== "object") return false;
	const heading = value;
	return Number.isSafeInteger(heading.depth) && typeof heading.text === "string" && typeof heading.slug === "string";
}
async function getPreparedHeadings(collection, id) {
	return validatePreparedHeadings(await import("./headings_DAMYohdy.mjs"), collection, id, "/");
}
function validatePreparedHeadings(loaded, collection, id, activeBase) {
	const normalizeBase = (value) => value === "/" ? value : value.replace(/\/+$/u, "");
	if (loaded.generation !== 1 || typeof loaded.base !== "string" || normalizeBase(loaded.base) !== normalizeBase(activeBase)) throw new Error(`nimbus-docs: prepared headings are stale for "${collection}:${id}".`);
	if (!Array.isArray(loaded.records)) throw new Error("nimbus-docs: prepared heading records are malformed.");
	const matches = headingIndex(loaded).get(`${collection}\0${id}`) ?? [];
	if (matches.length === 0) return null;
	if (matches.length !== 1) throw new Error(`nimbus-docs: duplicate prepared headings for "${collection}:${id}".`);
	const record = matches[0];
	if (record.generation !== loaded.generation || record.base !== loaded.base || !Array.isArray(record.headings) || !record.headings.every(isHeading)) throw new Error(`nimbus-docs: prepared headings are malformed for "${collection}:${id}".`);
	return record.headings;
}
//#endregion
export { prepared_headings_exports as n };
