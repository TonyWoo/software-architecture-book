import { t as __exportAll } from "./rolldown-runtime-CXxUh8rJ_1dvZVnlz.mjs";
//#region node_modules/@cloudflare/nimbus-docs/dist/resolve-versions-B1VqIR_H.js
var resolve_versions_exports = /* @__PURE__ */ __exportAll({
	apiPageRoute: () => apiPageRoute,
	resolveAllApiCollections: () => resolveAllApiCollections,
	resolveApiFamily: () => resolveApiFamily,
	resolveApiVersion: () => resolveApiVersion
});
/** An `ApiRoutePolicy` is structurally the engine's `RoutePolicy`; narrow once here. */
function asRoutePolicy(routes) {
	return routes;
}
var VERSION_KEY_SEP = "@";
function defaultVersionOf(versions) {
	return versions.find((v) => v.default) ?? versions[0];
}
function apiPageRoute(target, slug) {
	if (slug === "") return target.isDefault ? {
		storeId: "index",
		param: void 0
	} : {
		storeId: target.version,
		param: target.version
	};
	const joined = target.isDefault ? slug : `${target.version}/${slug}`;
	return {
		storeId: joined,
		param: joined
	};
}
/** Resolve one family into its render targets (one per version). */
function resolveApiFamily(entry) {
	const family = entry.collection;
	if (!entry.versions || entry.versions.length === 0) return [{
		family,
		version: null,
		isDefault: true,
		namespace: family,
		versionKey: family,
		mountPath: `/${family}`,
		spec: entry.spec,
		status: null,
		hidden: false,
		label: entry.label ?? family,
		requireOperationId: entry.requireOperationId ?? false,
		routes: asRoutePolicy(entry.routes)
	}];
	const def = defaultVersionOf(entry.versions);
	return entry.versions.map((v) => {
		const isDefault = v === def;
		return {
			family,
			version: v.version,
			isDefault,
			namespace: family,
			versionKey: `${family}${VERSION_KEY_SEP}${v.version}`,
			mountPath: isDefault ? `/${family}` : `/${family}/${v.version}`,
			spec: v.spec,
			status: v.status ?? null,
			hidden: v.hidden ?? false,
			label: v.label ?? v.version,
			requireOperationId: entry.requireOperationId ?? false,
			routes: asRoutePolicy(v.routes)
		};
	});
}
/** Every render target across every declared family. */
function resolveAllApiCollections(api) {
	return (api ?? []).flatMap(resolveApiFamily);
}
/**
* Resolve one target by collection + version. Omitting `version` (or passing
* `null`) selects the family default — the render path for the bare
* `/family` URL.
*/
function resolveApiVersion(api, collection, version) {
	const entry = (api ?? []).find((a) => a.collection === collection);
	if (!entry) return void 0;
	const resolved = resolveApiFamily(entry);
	if (version == null) return resolved.find((r) => r.isDefault);
	return resolved.find((r) => r.version === version);
}
//#endregion
export { resolve_versions_exports as a };
