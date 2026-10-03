//#region node_modules/@cloudflare/nimbus-docs/dist/url-DyuBs32r.js
function isAbsoluteUrl(href) {
	return /^([a-z][a-z0-9+\-.]*:|\/\/)/i.test(href);
}
function withBase(path, base) {
	if (isAbsoluteUrl(path)) return path;
	if (path.startsWith("#") || path.startsWith("?")) return path;
	let end = base.length;
	while (end > 0 && base[end - 1] === "/") end--;
	const prefix = base.slice(0, end);
	const [pathname, suffix] = splitSuffix(path);
	const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
	if (normalized === "/" && prefix && !appendsSlash(linkPolicy())) return `${prefix}${suffix}`;
	return `${prefix}${normalized}${suffix}`;
}
function stripBase(path, base) {
	let end = base.length;
	while (end > 0 && base[end - 1] === "/") end--;
	const prefix = base.slice(0, end);
	if (!prefix) return path;
	const [pathname, suffix] = splitSuffix(path);
	if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return path;
	return `${pathname.slice(prefix.length) || "/"}${suffix}`;
}
function hasFileExtension(pathname) {
	const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
	const dot = lastSegment.lastIndexOf(".");
	if (dot <= 0) return false;
	const ext = lastSegment.slice(dot + 1);
	return ext.length <= 6 && /^[a-zA-Z0-9]+$/.test(ext) && /[a-zA-Z]/.test(ext);
}
function safeDecode(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
function splitSuffix(href) {
	const queryAt = href.indexOf("?");
	const hashAt = href.indexOf("#");
	const cutAt = queryAt === -1 ? hashAt : hashAt === -1 ? queryAt : Math.min(queryAt, hashAt);
	if (cutAt === -1) return [href, ""];
	return [href.slice(0, cutAt), href.slice(cutAt)];
}
function toRouteKey(href) {
	const [pathname] = splitSuffix(href);
	const decoded = safeDecode(pathname);
	if (decoded.length <= 1) return decoded || "/";
	return decoded.endsWith("/") ? decoded.slice(0, -1) : decoded;
}
function withoutHtmlExtension(path) {
	return path.replace(/(?:\/index)?\.html$/, "") || "/";
}
var LINK_POLICY_KEY = /* @__PURE__ */ Symbol.for("@cloudflare/nimbus-docs/link-policy");
var ASTRO_DEFAULT_POLICY = {
	trailingSlash: "ignore",
	format: "directory"
};
function setLinkPolicy(policy) {
	globalThis[LINK_POLICY_KEY] = policy;
}
function linkPolicy() {
	return globalThis[LINK_POLICY_KEY] ?? ASTRO_DEFAULT_POLICY;
}
function appendsSlash({ trailingSlash, format }) {
	if (trailingSlash === "always") return true;
	if (trailingSlash === "never") return false;
	return format === "directory";
}
function toBrowserHref(href) {
	if (isAbsoluteUrl(href)) return href;
	if (href.startsWith("#") || href.startsWith("?")) return href;
	if (!href.startsWith("/")) return href;
	if (hasFileExtension(splitSuffix(href)[0])) return href;
	return toDocumentHref(href);
}
function toDocumentHref(href) {
	if (isAbsoluteUrl(href) || !href.startsWith("/")) return href;
	const [pathname, suffix] = splitSuffix(href);
	if (pathname === "/") return href;
	if (!appendsSlash(linkPolicy())) {
		let end = pathname.length;
		while (end > 1 && pathname[end - 1] === "/") end--;
		return `${pathname.slice(0, end)}${suffix}`;
	}
	if (pathname.endsWith("/")) return href;
	return `${pathname}/${suffix}`;
}
//#endregion
export { toBrowserHref as a, withBase as c, stripBase as i, withoutHtmlExtension as l, safeDecode as n, toDocumentHref as o, setLinkPolicy as r, toRouteKey as s, isAbsoluteUrl as t };
