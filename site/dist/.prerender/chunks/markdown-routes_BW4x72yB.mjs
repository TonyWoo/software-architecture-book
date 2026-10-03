//#region \0virtual:nimbus/markdown-routes
var routes = [{
	pattern: "/[...slug]/index.md",
	entrypoint: "src/pages/[...slug]/index.md.ts",
	regex: /* @__PURE__ */ new RegExp("^(?:\\/(.*?))?\\/index\\.md$", ""),
	params: ["slug"],
	prerendered: true,
	shared: "markdown"
}, {
	pattern: "/[...slug]/index.mdx",
	entrypoint: "src/pages/[...slug]/index.mdx.ts",
	regex: /* @__PURE__ */ new RegExp("^(?:\\/(.*?))?\\/index\\.mdx$", ""),
	params: ["slug"],
	prerendered: true,
	shared: "source"
}];
//#endregion
export { routes };
