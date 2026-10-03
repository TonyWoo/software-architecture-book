import { m as Fragment, n as createVNode, r as __astro_tag_component__ } from "./jsx-runtime_F2SftQcZ.mjs";
//#region src/content/partials/example.mdx
function _createMdxContent(props) {
	const { Fragment } = props.components || {};
	if (!Fragment) _missingMdxReference("Fragment", true);
	return createVNode(Fragment, { "set:html": "<p>This text lives in <code>src/content/partials/example.mdx</code> and is pulled in with\n<code>&lt;Render file=\"example\" /&gt;</code>. Edit the partial once and every page that renders\nit stays in sync — handy for install steps, support notes, or any boilerplate\nyou’d otherwise copy between pages.</p>" });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? createVNode(MDXLayout, Object.assign({}, props, { children: createVNode(_createMdxContent, props) })) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
var frontmatter = {};
function getHeadings() {
	return [];
}
var url = "src/content/partials/example.mdx";
var file = "/home/hatch/workspace/software-architecture-book/site/src/content/partials/example.mdx";
var Content = (props = {}) => MDXContent({
	...props,
	components: {
		Fragment,
		...props.components
	}
});
Content[Symbol.for("mdx-component")] = true;
Content[Symbol.for("astro.needsHeadRendering")] = !Boolean(frontmatter.layout);
Content.moduleId = "/home/hatch/workspace/software-architecture-book/site/src/content/partials/example.mdx";
__astro_tag_component__(Content, "astro:jsx");
//#endregion
export { Content, Content as default, file, frontmatter, getHeadings, url };
