import { t as entryRouteKey } from "./astro-slug-Dibmp5Qt_B7BM6MvU.mjs";
import { c as withBase } from "./url-DyuBs32r_CvQlmwi9.mjs";
//#region node_modules/@cloudflare/nimbus-docs/dist/markdown-routes-DHt9SUbz.js
function routeParams(route, url) {
	const match = route.regex.exec(url);
	if (!match) return null;
	return Object.fromEntries(route.params.map((name, index) => [name, match[index + 1] || void 0]));
}
/**
* Locate the calling factory's own route. Astro hands `getStaticPaths` only
* the route pattern, so prefer the recorded route whose file calls this
* factory; fall back to the single route with that pattern when the factory
* is reached indirectly (for example re-exported from a helper module).
*/
function findOwnMarkdownRoute(routes, routePattern, surface) {
	const candidates = routes.map((route, index) => ({
		route,
		index
	})).filter(({ route }) => route.pattern === routePattern);
	const declared = candidates.filter(({ route }) => route.shared === surface);
	if (declared.length === 1) return declared[0].index;
	if (declared.length === 0 && candidates.length === 1) return candidates[0].index;
	const factory = surface === "markdown" ? "markdownRoute()" : "markdownSourceRoute()";
	if (candidates.length === 0) throw new Error(`nimbus-docs: ${factory} is used by route ${routePattern}, but that route is not an endpoint whose last segment is a static .md or .mdx file name (for example src/pages/[...slug]/index.md.ts).`);
	throw new Error(`nimbus-docs: ${factory} cannot tell which file serves ${routePattern}: ${candidates.map(({ route }) => route.entrypoint).join(", ")}. Keep one route file per pattern.`);
}
function higherMarkdownRouteOwner(routes, index, url) {
	for (let i = 0; i < index; i += 1) if (routes[i].regex.test(url)) return routes[i];
}
//#endregion
//#region node_modules/@cloudflare/nimbus-docs/dist/agent-endpoints.js
var agentEndpointAssetsModule = null;
var agentEndpointAssetLoaderModule = null;
var markdownByIdentity;
var markdownByRoute;
var markdownByUrl;
var llmsByIdentity;
function agentEndpointAssetResponseError(url, status) {
	if (status === 404) return /* @__PURE__ */ new Error(`nimbus-docs: agent-endpoint asset not found at ${url.href}; verify client assets were deployed.`);
	return /* @__PURE__ */ new Error(`nimbus-docs: agent-endpoint asset at ${url.href} returned ${status}.`);
}
function loadAgentEndpointAssets() {
	agentEndpointAssetsModule ??= import("./agent-endpoint-assets_Cf_G9PFr.mjs");
	return agentEndpointAssetsModule;
}
function loadAgentEndpointAssetLoader() {
	agentEndpointAssetLoaderModule ??= import("./agent-endpoint-asset-loader_j4DjbAls.mjs");
	return agentEndpointAssetLoaderModule;
}
function markdownIdentity(reference) {
	return `${reference.collection}\0${reference.id}\0${reference.surface}`;
}
function markdownRouteIdentity(options) {
	return `${options.collection}\0${options.surface}\0${options.slug ?? ""}`;
}
function llmsIdentity(reference) {
	return reference.scope === "site" ? `${reference.scope}\0${reference.surface}` : `${reference.scope}\0${reference.section}\0${reference.surface}`;
}
async function readAssetBody(assetPath, context) {
	const assets = await loadAgentEndpointAssets();
	const publicPath = withBase(`/_nimbus/agent-endpoint-assets/${assetPath}`, assets.base);
	const request = context.request;
	if (request) {
		const assetUrl = new URL(publicPath, request.url);
		const { fetchAgentEndpointAsset } = await loadAgentEndpointAssetLoader();
		const response = await fetchAgentEndpointAsset(publicPath, request);
		if (response) {
			if (!response.ok) throw agentEndpointAssetResponseError(assetUrl, response.status);
			return response.text();
		}
	}
	try {
		const [{ readFile }, path] = await Promise.all([import("node:fs/promises"), import("node:path")]);
		return await readFile(path.join(assets.projectRoot, ".astro", "nimbus", "agent-endpoint-assets", assetPath), "utf8");
	} catch (error) {
		if (!request) throw error;
	}
	const assetUrl = new URL(publicPath, request.url);
	const response = await fetch(assetUrl);
	if (!response.ok) throw agentEndpointAssetResponseError(assetUrl, response.status);
	return response.text();
}
async function markdownIndexes() {
	const { markdownAssets } = await loadAgentEndpointAssets();
	if (!markdownByIdentity || !markdownByRoute || !markdownByUrl) {
		markdownByIdentity = /* @__PURE__ */ new Map();
		markdownByRoute = /* @__PURE__ */ new Map();
		markdownByUrl = /* @__PURE__ */ new Map();
		for (const asset of markdownAssets) {
			markdownByIdentity.set(markdownIdentity(asset), asset);
			markdownByUrl.set(asset.url, asset);
			markdownByRoute.set(markdownRouteIdentity({
				collection: asset.collection,
				surface: asset.surface,
				slug: entryRouteKey(asset.id)
			}), asset);
		}
	}
	return {
		markdownAssets,
		markdownByIdentity,
		markdownByRoute,
		markdownByUrl
	};
}
async function llmsIndex() {
	const { llmsAssets } = await loadAgentEndpointAssets();
	if (!llmsByIdentity) llmsByIdentity = new Map(llmsAssets.map((asset) => [llmsIdentity(asset), asset]));
	return {
		llmsAssets,
		llmsByIdentity
	};
}
async function markdownPayload(asset, context) {
	const body = await readAssetBody(asset.path, context);
	return {
		collection: asset.collection,
		id: asset.id,
		surface: asset.surface,
		digest: asset.digest,
		mediaType: asset.mediaType,
		body,
		content: body.slice(asset.contentStart, asset.contentEnd)
	};
}
/**
* The response every route factory returns: the payload, a plain 404 when
* there is none, and on request a detail-free 500 when loading fails. A
* prerendered route rethrows so the build fails instead.
*/
async function endpointResponse(context, load) {
	try {
		const payload = await load();
		if (!payload) return new Response("Not found", { status: 404 });
		return new Response(payload.body, { headers: { "Content-Type": payload.mediaType } });
	} catch (error) {
		if (context.isPrerendered) throw error;
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
function requestAssetUrl(url, base) {
	const prefix = base.replace(/\/+$/u, "");
	let pathname = url.pathname;
	if (prefix) {
		if (!pathname.startsWith(`${prefix}/`)) return void 0;
		pathname = pathname.slice(prefix.length);
	}
	try {
		return decodeURI(pathname);
	} catch {
		return;
	}
}
function createMarkdownRoute(surface) {
	return {
		async getStaticPaths({ routePattern }) {
			const [{ markdownAssets }, { routes }] = await Promise.all([markdownIndexes(), import("./markdown-routes_BW4x72yB.mjs")]);
			const index = findOwnMarkdownRoute(routes, routePattern, surface);
			const own = routes[index];
			return markdownAssets.flatMap((asset) => {
				if (asset.surface !== surface) return [];
				const params = routeParams(own, asset.url);
				if (!params || higherMarkdownRouteOwner(routes, index, asset.url)) return [];
				return [{
					params,
					props: { reference: {
						collection: asset.collection,
						id: asset.id,
						surface: asset.surface
					} },
					cacheKey: asset.digest
				}];
			});
		},
		GET: (context) => endpointResponse(context, async () => {
			const indexes = await markdownIndexes();
			const reference = context.props.reference;
			let asset;
			if (reference) asset = indexes.markdownByIdentity.get(markdownIdentity(reference));
			else {
				const { base } = await loadAgentEndpointAssets();
				const url = requestAssetUrl(context.url, base);
				asset = url ? indexes.markdownByUrl.get(url) : void 0;
			}
			if (!asset || asset.surface !== surface) return null;
			return markdownPayload(asset, { request: context.request });
		})
	};
}
/**
* The site-wide clean-Markdown route. One file serves every indexed
* collection's `/<page>/index.md`, API pages included:
*
* ```ts
* // src/pages/[...slug]/index.md.ts
* import { markdownRoute } from "@cloudflare/nimbus-docs/agent-endpoints";
*
* export const prerender = true;
* export const { GET, getStaticPaths } = markdownRoute();
* ```
*
* The route serves only the asset URLs its own pattern matches and skips any
* URL a more specific Markdown route file owns, so adding
* `src/pages/changelog/[...slug]/index.md.ts` takes over the changelog. The
* file must stay prerendered; Nimbus fails the build otherwise.
*/
function markdownRoute() {
	return createMarkdownRoute("markdown");
}
/**
* The site-wide authored-source route: `/<page>/index.mdx` for every
* collection with an authored body. API pages have no source and get no
* `.mdx`. Same rules as {@link markdownRoute}.
*/
function markdownSourceRoute() {
	return createMarkdownRoute("source");
}
async function getLlmsPayload(reference, context = {}) {
	const { llmsByIdentity } = await llmsIndex();
	const asset = llmsByIdentity.get(llmsIdentity(reference));
	if (!asset) return null;
	return {
		...reference,
		digest: asset.digest,
		mediaType: asset.mediaType,
		body: await readAssetBody(asset.path, context)
	};
}
async function getLlmsStaticPaths() {
	const { llmsAssets } = await llmsIndex();
	return llmsAssets.filter((asset) => asset.scope === "section" && asset.surface === "index").map((asset) => ({
		params: { section: asset.section },
		props: { reference: {
			scope: asset.scope,
			surface: asset.surface,
			section: asset.section
		} },
		cacheKey: asset.digest
	}));
}
function createLlmsRoute(surface) {
	return { GET: (context) => endpointResponse(context, () => getLlmsPayload({
		scope: "site",
		surface
	}, { request: context.request })) };
}
/**
* The site's `/llms.txt` index:
*
* ```ts
* // src/pages/llms.txt.ts
* import { llmsRoute } from "@cloudflare/nimbus-docs/agent-endpoints";
*
* export const prerender = true;
* export const { GET } = llmsRoute();
* ```
*
* `GET` returns 404 when the index is missing and, on request, a 500 without
* details when its asset can't be read. Wrap `GET` to customize the response.
*/
function llmsRoute() {
	return createLlmsRoute("index");
}
/** The site's `/llms-full.txt`. Same rules as {@link llmsRoute}. */
function llmsFullRoute() {
	return createLlmsRoute("full");
}
/**
* Every per-section `/<section>/llms.txt` index, one path per section:
*
* ```ts
* // src/pages/[section]/llms.txt.ts
* import { llmsSectionRoute } from "@cloudflare/nimbus-docs/agent-endpoints";
*
* export const prerender = true;
* export const { GET, getStaticPaths } = llmsSectionRoute();
* ```
*
* The route's parameter must be named `section`. On request, `GET` reads it
* from `params.section` and returns 404 for an unknown section. Same error
* rules as {@link llmsRoute}.
*/
function llmsSectionRoute() {
	return {
		getStaticPaths: getLlmsStaticPaths,
		GET: (context) => endpointResponse(context, async () => {
			const reference = context.props.reference ?? (context.params.section ? {
				scope: "section",
				surface: "index",
				section: context.params.section
			} : void 0);
			if (!reference) return null;
			return getLlmsPayload(reference, { request: context.request });
		})
	};
}
//#endregion
export { markdownSourceRoute as a, markdownRoute as i, llmsRoute as n, llmsSectionRoute as r, llmsFullRoute as t };
