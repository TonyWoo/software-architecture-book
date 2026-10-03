import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { C as renderIndexedEntryMarkdown, E as collectionMountPrefix, S as loadRequestRenderingCollections, _ as getVersionStatus, b as loadApiCollections, c as getIndexedEntries, x as loadNimbusConfig } from "./runtime_nQNhOH3A.mjs";
import { n as entryRouteUrl } from "./astro-slug-Dibmp5Qt_B7BM6MvU.mjs";
//#region node_modules/@cloudflare/nimbus-docs/dist/agent-endpoint-asset-reader-DRJXXgJT.js
var STATE_KEY = Symbol.for("@cloudflare/nimbus-docs/agent-endpoint-asset-reader/v1");
var stateGlobal = globalThis;
var state = stateGlobal[STATE_KEY] ??= { version: 1 };
function readConfiguredMarkdownEndpointPayload(root, reference) {
	if (!state.readMarkdownEndpointPayload) throw new Error("nimbus-docs: agent-endpoint assets are available only during a configured Astro build or dev server.");
	return state.readMarkdownEndpointPayload(root, reference);
}
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/_internal/request-route-inventory.js
var request_route_inventory_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => true
});
function requestInventoryEntryUrl(prefix, entryId, api) {
	const id = api && entryId === "index" ? "" : entryId;
	return id === "" ? prefix || "/" : `${prefix}/${id}`;
}
function contentInventoryEntryUrl(prefix, entryId, api, request) {
	return request ? requestInventoryEntryUrl(prefix, entryId, api) : entryRouteUrl(prefix, entryId);
}
function requestInventoryVersionStatusKey(collection, api, version) {
	return api && version ? `${collection}@${version}` : collection;
}
async function GET() {
	const projectRoot = "/home/hatch/workspace/software-architecture-book/site/";
	const config = await loadNimbusConfig();
	const requestCollections = new Set(await loadRequestRenderingCollections());
	const apiCollections = new Set(await loadApiCollections());
	const entries = await getIndexedEntries();
	const versions = config.versions ? { others: config.versions.others ?? [] } : null;
	const routes = [];
	for (const item of entries) {
		const collection = item.collection;
		const prefix = collectionMountPrefix(collection, versions);
		const data = item.entry.data ?? {};
		const request = requestCollections.has(collection);
		const versionStatus = await getVersionStatus(requestInventoryVersionStatusKey(collection, apiCollections.has(collection), item.version));
		const discoverable = data.noindex !== true && !versionStatus?.isHidden;
		const searchable = !versionStatus?.isHidden && (data.searchable === true || data.searchable !== false && data.noindex !== true);
		const route = {
			collection,
			url: contentInventoryEntryUrl(prefix, item.entry.id, apiCollections.has(collection), request),
			request,
			discoverable,
			searchable,
			title: item.title,
			language: (config.locale ?? "en").split("-")[0]
		};
		if (item.description) route.description = item.description;
		if (item.version) route.version = item.version;
		if (versionStatus?.isDeprecated) route.deprecated = true;
		if (route.request && searchable) route.content = apiCollections.has(collection) ? await renderIndexedEntryMarkdown(item, { base: "/" }) : (await readConfiguredMarkdownEndpointPayload(projectRoot, {
			collection,
			id: item.entry.id,
			surface: "markdown"
		})).content;
		routes.push(route);
	}
	return new Response(JSON.stringify(routes), { headers: { "Content-Type": "application/json" } });
}
//#endregion
//#region \0virtual:astro:page:node_modules/@cloudflare/nimbus-docs/dist/_internal/request-route-inventory@_@js
var page = () => request_route_inventory_exports;
//#endregion
export { page };
