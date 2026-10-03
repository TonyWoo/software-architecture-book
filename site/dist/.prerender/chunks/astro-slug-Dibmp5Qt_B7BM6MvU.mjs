Object.hasOwnProperty;
/**
* Route key for a final `entry.id`: the id verbatim, with only a trailing
* `/index` collapsed. No re-slugging — `getDocsStaticPaths` routes on
* `params.slug = entry.id`, so a `slug:` override like `1.1.1.1/encryption`
* must be preserved exactly (re-slugging would map it to `1111/...`).
*
*   entryRouteKey("1.1.1.1/encryption")  → "1.1.1.1/encryption"
*   entryRouteKey("a/b/index")           → "a/b"
*   entryRouteKey("index")               → ""
*/
function entryRouteKey(entryId) {
	if (entryId === "index") return "";
	return entryId.endsWith("/index") ? entryId.slice(0, -6) : entryId;
}
/**
* Compose the served URL for a final `entry.id` at a given collection
* prefix. Runtime counterpart to `canonicalEntryUrl`.
*
*   entryRouteUrl("", "1.1.1.1/encryption") → "/1.1.1.1/encryption"
*   entryRouteUrl("/v1", "guides/index")    → "/v1/guides"
*   entryRouteUrl("", "index")              → "/"
*/
function entryRouteUrl(prefix, entryId) {
	const key = entryRouteKey(entryId);
	if (key === "") return prefix === "" ? "/" : prefix;
	return `${prefix}/${key}`;
}
//#endregion
export { entryRouteUrl as n, entryRouteKey as t };
