import { t as __exportAll } from "./rolldown-runtime_8H4AJuhK.mjs";
import { C as addAttribute, N as createAstro, _ as renderSlot, a as renderTransition, b as renderTemplate, f as renderComponent, i as spreadAttributes, j as unescapeHTML, m as Fragment, w as createRenderInstruction, x as maybeRenderHead } from "./jsx-runtime_F2SftQcZ.mjs";
import { t as createComponent } from "./astro-component_Dy02WjwP.mjs";
import { a as renderScript, i as $$Icon, n as $$BaseLayout, r as cn, t as $$Header } from "./Header_BJlPZJxs.mjs";
import { r as render } from "./_astro_content_D4k4QI2N.mjs";
import { T as getTabs, _ as getVersionStatus, a as getDocsPage, d as getPrevNext, f as getRouteFlags, g as getVersionAlternates, h as getTOC, l as getLastUpdated, n as getBreadcrumbs, o as getDocsStaticPaths, p as getSidebar, s as getEditUrl, v as getVisibleEntries, w as sidebarHash, y as getVisibleEntry } from "./runtime_nQNhOH3A.mjs";
import { c as withBase, i as stripBase } from "./url-DyuBs32r_CvQlmwi9.mjs";
import { createHash } from "node:crypto";
//#region node_modules/astro/dist/runtime/server/render/template-depth.js
function templateEnter(_result) {
	return createRenderInstruction({ type: "template-enter" });
}
function templateExit(_result) {
	return createRenderInstruction({ type: "template-exit" });
}
//#endregion
//#region src/components/ui/banner/Banner.astro
createAstro("https://example.com");
var $$Banner = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Banner;
	const { content, variant = "note", dismissible, class: className, ...attrs } = Astro.props;
	function sanitizeBannerHtml(value) {
		return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, "");
	}
	const config = {
		note: {
			color: "var(--nb-info)",
			tint: "var(--nb-info-muted)"
		},
		tip: {
			color: "var(--nb-success)",
			tint: "var(--nb-success-muted)"
		},
		caution: {
			color: "var(--nb-warning)",
			tint: "var(--nb-warning-muted)"
		},
		danger: {
			color: "var(--nb-danger)",
			tint: "var(--nb-danger-muted)"
		}
	};
	const c = config[variant] ?? config.note;
	const safeContent = sanitizeBannerHtml(content);
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(variant === "danger" || variant === "caution" ? "alert" : "status", "role")}${addAttribute(cn("banner-card my-4 flex w-full items-start gap-3 rounded-lg px-4 py-3 text-sm leading-normal text-foreground", className), "class")}${addAttribute(`--_c: ${c.color}; --_t: ${c.tint};`, "style")}${spreadAttributes(dismissible ? {
		"data-nb-banner-dismiss": dismissible.id,
		"data-nb-banner-days": dismissible.days
	} : {})}${spreadAttributes(attrs)} data-astro-cid-feslum5t><div class="banner-card-body min-w-0 flex-1" data-astro-cid-feslum5t>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${unescapeHTML(safeContent)}` })}</div>${dismissible && renderTemplate`<button type="button" data-nb-banner-close class="-my-1 -mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-current opacity-60 transition-[background-color,opacity] hover:bg-card/60 hover:opacity-100" aria-label="Dismiss banner" data-astro-cid-feslum5t>${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:x",
		"class": "w-3.5 h-3.5",
		"data-astro-cid-feslum5t": true
	})}</button>`}</div>${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/banner/Banner.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/banner/Banner.astro", void 0);
//#endregion
//#region src/components/ui/collapsible/Collapsible.astro
createAstro("https://example.com");
var $$Collapsible = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Collapsible;
	const { open = false, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div data-nb-collapsible${addAttribute(open ? "true" : void 0, "data-nb-default-open")}${addAttribute(cn(className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/collapsible/Collapsible.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/collapsible/Collapsible.astro", void 0);
//#endregion
//#region src/components/ui/collapsible/CollapsibleTrigger.astro
createAstro("https://example.com");
var $$CollapsibleTrigger = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CollapsibleTrigger;
	const { class: className, type, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<button${addAttribute(type ?? "button", "type")} data-nb-collapsible-trigger${addAttribute(cn("w-full text-left cursor-pointer select-none", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</button>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/collapsible/CollapsibleTrigger.astro", void 0);
//#endregion
//#region src/components/ui/collapsible/CollapsibleContent.astro
createAstro("https://example.com");
var $$CollapsibleContent = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CollapsibleContent;
	const { class: className, ...attrs } = Astro.props;
	const isOpen = attrs["data-nb-state"] === "open";
	return renderTemplate`${maybeRenderHead($$result)}<div data-nb-collapsible-content${addAttribute(!isOpen || void 0, "inert")}${addAttribute(cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.87,0,0.13,1)]", "data-[nb-state=open]:grid-rows-[1fr]", "motion-reduce:transition-none", className), "class")}${spreadAttributes(attrs)}><div class="overflow-hidden min-h-0">${renderSlot($$result, $$slots["default"])}</div></div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/collapsible/CollapsibleContent.astro", void 0);
//#endregion
//#region src/components/ui/badge/Badge.astro
createAstro("https://example.com");
var $$Badge = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Badge;
	const { text, variant = "default", size = "small", class: className, ...attrs } = Astro.props;
	const variantClass = {
		default: "bg-accent text-muted-foreground",
		info: "bg-info-muted text-info",
		note: "bg-info-muted text-info",
		success: "bg-success-muted text-success",
		tip: "bg-success-muted text-success",
		warning: "bg-warning-muted text-warning",
		caution: "bg-warning-muted text-warning",
		danger: "bg-danger-muted text-danger"
	};
	const sizeClass = {
		small: "px-2 py-0.5 text-xs",
		medium: "px-2.5 py-0.5 text-[0.8125rem]",
		large: "px-3 py-1 text-sm"
	};
	return renderTemplate`${maybeRenderHead($$result)}<span${addAttribute(cn("inline-flex items-center rounded-full font-medium whitespace-nowrap leading-none", variantClass[variant] ?? variantClass.default, sizeClass[size] ?? sizeClass.small, className), "class")}${spreadAttributes(attrs)}>${text ?? renderTemplate`${renderSlot($$result, $$slots["default"])}`}</span>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/badge/Badge.astro", void 0);
//#endregion
//#region src/components/ui/sidebar/SidebarGroupHeader.astro
createAstro("https://example.com");
var $$SidebarGroupHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$SidebarGroupHeader;
	const { label, isOpen, hasActive, badge, indexHref, indexIsCurrent, indexIsExternal, icon, deprecated } = Astro2.props;
	const resolvedIndexHref = indexHref ? withBase(indexHref, "/") : void 0;
	const rowClass = cn("group/expander flex min-h-[2rem] items-center rounded-lg px-3 py-1 text-[0.8125rem] no-underline transition-colors duration-150 focus-visible:outline-offset-[-2px]", "hover:bg-accent hover:text-foreground", hasActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground");
	const caretClass = "ml-auto -mr-px shrink-0 w-5 h-5 text-muted-foreground opacity-50 transition-[rotate,color] duration-[250ms] ease-[cubic-bezier(0.87,0,0.13,1)] group-hover/expander:text-foreground";
	const labelClass = cn("break-words", deprecated && "line-through");
	return renderTemplate`${indexHref ? renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn(rowClass, "p-0", indexIsCurrent ? "bg-accent text-foreground font-semibold" : ""), "class")}${addAttribute(isOpen ? "open" : "closed", "data-nb-state")} data-nb-sidebar-group-label><a${addAttribute(resolvedIndexHref, "href")}${addAttribute(indexIsCurrent ? "page" : void 0, "aria-current")}${addAttribute(indexIsExternal ? "_blank" : void 0, "target")}${addAttribute(indexIsExternal ? "noopener" : void 0, "rel")} class="flex flex-1 min-w-0 items-center min-h-[2rem] px-3 py-1 rounded-l-lg focus-visible:outline-offset-[-2px]"><span class="flex items-center gap-2 flex-1 min-w-0">${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
		"name": icon,
		"class": "shrink-0 h-4 w-4 text-muted-foreground"
	})}`}<span${addAttribute(labelClass, "class")}>${label}</span>${badge && (typeof badge === "string" ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "text": badge })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, {
		"text": badge.text,
		"variant": badge.variant
	})}`)}</span></a>${renderComponent($$result, "CollapsibleTrigger", $$CollapsibleTrigger, {
		"class": cn("w-auto flex items-center shrink-0 min-h-[2rem] px-3 py-1 rounded-r-lg", "hover:bg-accent hover:text-foreground focus-visible:outline-offset-[-2px]", "group/expander"),
		"data-nb-state": isOpen ? "open" : "closed",
		"aria-expanded": isOpen ? "true" : "false",
		"aria-label": `Toggle ${label} section`
	}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:caret-right",
		"class": caretClass,
		"data-nb-caret": true
	})}` })}</div>` : renderTemplate`${renderComponent($$result, "CollapsibleTrigger", $$CollapsibleTrigger, {
		"class": cn(rowClass, "justify-between w-full"),
		"data-nb-sidebar-group-label": true,
		"data-nb-state": isOpen ? "open" : "closed",
		"aria-expanded": isOpen ? "true" : "false"
	}, { "default": ($$result2) => renderTemplate`<span class="flex items-center gap-2 flex-1 min-w-0">${icon && renderTemplate`${renderComponent($$result2, "Icon", $$Icon, {
		"name": icon,
		"class": "shrink-0 h-4 w-4 text-muted-foreground"
	})}`}<span${addAttribute(labelClass, "class")}>${label}</span>${badge && (typeof badge === "string" ? renderTemplate`${renderComponent($$result2, "Badge", $$Badge, { "text": badge })}` : renderTemplate`${renderComponent($$result2, "Badge", $$Badge, {
		"text": badge.text,
		"variant": badge.variant
	})}`)}</span>${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:caret-right",
		"class": caretClass,
		"data-nb-caret": true
	})}` })}`}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/sidebar/SidebarGroupHeader.astro", void 0);
//#endregion
//#region src/components/ui/sidebar/SidebarLink.astro
createAstro("https://example.com");
var $$SidebarLink = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$SidebarLink;
	const { label, href, isCurrent, badge, class: className, ...attrs } = Astro2.props;
	const resolvedHref = withBase(href, "/");
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(resolvedHref, "href")}${addAttribute(isCurrent ? "page" : void 0, "aria-current")} data-nb-sidebar-link${addAttribute(cn("flex min-h-[2rem] items-center gap-2 rounded-lg px-3 py-1 text-[0.8125rem] font-medium no-underline focus-visible:outline-offset-[-2px]", isCurrent ? "bg-accent font-semibold text-foreground" : "text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["leading"])}<span class="break-words">${label}</span>${badge && (typeof badge === "string" ? renderTemplate`${renderComponent($$result, "Badge", $$Badge, { "text": badge })}` : renderTemplate`${renderComponent($$result, "Badge", $$Badge, {
		"text": badge.text,
		"variant": badge.variant
	})}`)}</a>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/sidebar/SidebarLink.astro", void 0);
//#endregion
//#region src/components/ui/sidebar/SidebarGroup.astro
createAstro("https://example.com");
var $$SidebarGroup = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SidebarGroup;
	const { label, items, collapsed, badge, indexHref, indexIsCurrent, indexIsExternal, icon, class: className, ...attrs } = Astro.props;
	function hasActiveDescendant(items) {
		return items.some((item) => item.type === "link" ? Boolean(item.isCurrent) : item.type === "group" ? Boolean(item.indexIsCurrent) || hasActiveDescendant(item.children) : false);
	}
	const hasActive = Boolean(indexIsCurrent) || hasActiveDescendant(items);
	const isOpen = Boolean(hasActive || collapsed === false || collapsed === void 0);
	return renderTemplate`${renderComponent($$result, "Collapsible", $$Collapsible, {
		"class": cn("group/accordion", className),
		"open": isOpen,
		"data-nb-sidebar-group": true,
		...attrs
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "SidebarGroupHeader", $$SidebarGroupHeader, {
		"label": label,
		"isOpen": isOpen,
		"hasActive": hasActive,
		"badge": badge,
		"indexHref": indexHref,
		"indexIsCurrent": indexIsCurrent,
		"indexIsExternal": indexIsExternal,
		"icon": icon
	})}${renderComponent($$result, "CollapsibleContent", $$CollapsibleContent, { "data-nb-state": isOpen ? "open" : "closed" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<ul class="mt-0.5 ml-3 list-none border-l border-border p-0 pl-2 flex flex-col gap-px">${items.map((item) => renderTemplate`<li class="break-words">${item.type === "group" ? renderTemplate`${renderComponent($$result, "Astro.self", Astro.self, {
		"label": item.label,
		"items": item.children,
		"collapsed": item.collapsed,
		"badge": item.badge,
		"icon": item.icon,
		"indexHref": item.indexHref,
		"indexIsCurrent": item.indexIsCurrent,
		"indexIsExternal": item.indexIsExternal
	})}` : item.type === "external" ? renderTemplate`${renderComponent($$result, "SidebarLink", $$SidebarLink, {
		"label": item.label,
		"href": item.href,
		"badge": item.badge,
		"target": "_blank",
		"rel": "noopener"
	})}` : renderTemplate`${renderComponent($$result, "SidebarLink", $$SidebarLink, {
		"label": item.label,
		"href": item.href,
		"isCurrent": item.isCurrent,
		"badge": item.badge
	})}`}</li>`)}</ul>` })}` })}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/sidebar/SidebarGroup.astro", void 0);
//#endregion
//#region src/components/ui/sidebar/Sidebar.astro
createAstro("https://example.com");
var $$Sidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Sidebar;
	const { items, persist = false, class: className, ...attrs } = Astro.props;
	const hash = sidebarHash(items);
	return renderTemplate`${maybeRenderHead($$result)}<div data-nb-sidebar${addAttribute(hash, "data-nb-sidebar-hash")}${addAttribute(persist ? "" : void 0, "data-nb-sidebar-persist")}${addAttribute(cn(className), "class")}${spreadAttributes(attrs)}><ul class="top-level flex list-none flex-col gap-0.5 p-0">${items.map((item) => item.type === "group" ? renderTemplate`<li>${renderComponent($$result, "SidebarGroup", $$SidebarGroup, {
		"label": item.label,
		"items": item.children,
		"collapsed": item.collapsed,
		"badge": item.badge,
		"icon": item.icon,
		"indexHref": item.indexHref,
		"indexIsCurrent": item.indexIsCurrent,
		"indexIsExternal": item.indexIsExternal
	})}</li>` : item.type === "external" ? renderTemplate`<li>${renderComponent($$result, "SidebarLink", $$SidebarLink, {
		"label": item.label,
		"href": item.href,
		"badge": item.badge,
		"target": "_blank",
		"rel": "noopener"
	})}</li>` : renderTemplate`<li>${renderComponent($$result, "SidebarLink", $$SidebarLink, {
		"label": item.label,
		"href": item.href,
		"isCurrent": item.isCurrent,
		"badge": item.badge
	})}</li>`)}</ul></div>${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/sidebar/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/sidebar/Sidebar.astro", void 0);
//#endregion
//#region src/components/ui/sidebar/SidebarFilter.astro
createAstro("https://example.com");
var $$SidebarFilter = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SidebarFilter;
	const { class: className, placeholder = "Filter…", ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn("relative mb-3", className), "class")}${spreadAttributes(attrs)}><input data-nb-sidebar-filter-input type="search"${addAttribute(placeholder, "placeholder")} class="peer w-full rounded-md border border-border bg-card py-1.5 pl-3 pr-9 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-ring [&amp;:not(:placeholder-shown)]:pr-2" aria-label="Filter navigation" autocomplete="off"><kbd aria-hidden="true" class="pointer-events-none absolute right-2 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[0.6875rem] font-semibold leading-none text-muted-foreground transition-opacity duration-150 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0 motion-reduce:transition-none">/</kbd></div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/sidebar/SidebarFilter.astro", void 0);
//#endregion
//#region src/components/ui/toc/TOC.astro
createAstro("https://example.com");
var $$TOC = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TOC;
	const { headings, class: className, ...attrs } = Astro.props;
	return renderTemplate`${headings.length > 0 && renderTemplate`${maybeRenderHead($$result)}<div data-nb-toc${addAttribute(cn("toc-container", className), "class")}${spreadAttributes(attrs)}><h2 class="mb-2 text-sm font-semibold text-foreground">On this page</h2><nav aria-label="Table of contents" class="relative"><svg data-nb-toc-rail aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none"><path data-nb-toc-rail-active class="stroke-primary opacity-0 transition-[stroke-dasharray,stroke-dashoffset,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[ready=true]:opacity-100 data-[initial=true]:transition-opacity motion-reduce:transition-opacity" stroke-width="2" stroke-linecap="round"></path></svg><ul class="flex list-none flex-col m-0 p-0">${headings.map((h, i) => {
		const prevDepth = i > 0 ? headings[i - 1].depth : h.depth;
		const nextDepth = i < headings.length - 1 ? headings[i + 1].depth : h.depth;
		const indent = h.depth - 2;
		const goingDeeper = h.depth > prevDepth;
		const goingShallower = nextDepth < h.depth;
		return renderTemplate`<li>${goingDeeper && renderTemplate`<svg aria-hidden="true" class="block h-2 text-border"${addAttribute(`margin-left: calc(${prevDepth - 2}rem - 0.0625rem); width: ${h.depth - prevDepth}rem;`, "style")} viewBox="0 0 1 1" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2" overflow="visible"><path d="M 0 0 C 0 0.5, 1 0.5, 1 1" vector-effect="non-scaling-stroke"></path></svg>`}<a${addAttribute(`#${h.slug}`, "href")} data-nb-toc-link${addAttribute(h.slug, "data-nb-slug")} class="grid grid-cols-1 border-l-2 border-border pl-5 py-1.5 text-[0.8125rem] leading-snug text-muted-foreground no-underline transition-colors duration-150 hover:border-foreground/20 hover:text-foreground aria-[current=true]:font-medium aria-[current=true]:text-foreground"${addAttribute(`margin-left: calc(${indent}rem - 0.125rem);`, "style")}><span class="col-start-1 row-start-1">${h.text}</span><span aria-hidden="true" class="col-start-1 row-start-1 invisible font-medium">${h.text}</span></a>${goingShallower && renderTemplate`<svg aria-hidden="true" class="block h-2 text-border"${addAttribute(`margin-left: calc(${nextDepth - 2}rem - 0.0625rem); width: ${h.depth - nextDepth}rem;`, "style")} viewBox="0 0 1 1" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="2" overflow="visible"><path d="M 1 0 C 1 0.5, 0 0.5, 0 1" vector-effect="non-scaling-stroke"></path></svg>`}</li>`;
	})}</ul></nav></div>`}${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/toc/TOC.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/toc/TOC.astro", void 0);
//#endregion
//#region src/components/ui/toc/MobileTOC.astro
createAstro("https://example.com");
var $$MobileTOC = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$MobileTOC;
	const { headings, class: className, ...attrs } = Astro.props;
	const hasHeadings = headings.length > 0;
	return renderTemplate`${hasHeadings && renderTemplate`${maybeRenderHead($$result)}<nav data-nb-mobile-toc aria-label="On this page"${addAttribute(cn("relative", className), "class")}${spreadAttributes(attrs)}><select data-nb-mobile-toc-select aria-label="Jump to section" class="w-full appearance-none rounded-md border border-border bg-background py-2.5 pl-3 pr-9 text-sm font-medium text-foreground transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"><option value="_top">Overview</option>${headings.map((heading) => renderTemplate`<option${addAttribute(heading.slug, "value")}>${`${" ".repeat(Math.max(0, heading.depth - 2))}${heading.text}`}</option>`)}</select>${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:caret-down",
		"aria-hidden": "true",
		"class": "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
	})}</nav>`}${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/toc/MobileTOC.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/toc/MobileTOC.astro", void 0);
//#endregion
//#region src/components/ui/breadcrumbs/Breadcrumbs.astro
createAstro("https://example.com");
var $$Breadcrumbs = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Breadcrumbs;
	const { items, maxVisible = 4, endsAtCurrentPage = true, class: className, ...attrs } = Astro2.props;
	const isCurrent = (isLast) => endsAtCurrentPage && isLast;
	const resolveHref = (href) => withBase(href, "/");
	const shouldCollapse = items.length > maxVisible;
	const headCount = 2;
	const tailCount = 2;
	const headItems = shouldCollapse ? items.slice(0, headCount) : items;
	const collapsedItems = shouldCollapse ? items.slice(headCount, items.length - tailCount) : [];
	const tailItems = shouldCollapse ? items.slice(items.length - tailCount) : [];
	return renderTemplate`${items.length > (endsAtCurrentPage ? 1 : 0) && renderTemplate`${maybeRenderHead($$result)}<nav aria-label="Breadcrumb"${addAttribute(cn("text-xs font-medium", className), "class")}${spreadAttributes(attrs)}><ol class="flex flex-wrap items-center gap-y-0.5 text-muted-foreground">${headItems.map((crumb, i) => renderTemplate`<li class="flex items-center">${i > 0 && renderTemplate`<span class="mx-1.5 text-muted-foreground/50">/</span>`}${isCurrent(!shouldCollapse && i === items.length - 1) || !crumb.href ? renderTemplate`<span class="text-foreground truncate max-w-[12rem]">${crumb.label}</span>` : renderTemplate`<a${addAttribute(resolveHref(crumb.href), "href")} class="hover:text-foreground transition-colors truncate max-w-[12rem]">${crumb.label}</a>`}</li>`)}${shouldCollapse && collapsedItems.length > 0 && renderTemplate`<li class="flex items-center"><span class="mx-1.5 text-muted-foreground/50">/</span><details class="relative group"><summary class="list-none cursor-pointer select-none rounded px-1 py-0.5 transition-colors hover:bg-accent hover:text-foreground [&amp;::-webkit-details-marker]:hidden group-open:before:fixed group-open:before:inset-0 group-open:before:z-[39] group-open:before:cursor-default group-open:before:content-['']"${addAttribute(`Show ${collapsedItems.length} more path segments`, "aria-label")}><span class="tracking-widest">&hellip;</span></summary><div class="absolute left-0 top-full z-40 mt-1 min-w-[10rem] max-w-[16rem] rounded-lg border border-border bg-card p-1 shadow-lg">${collapsedItems.map((crumb) => crumb.href ? renderTemplate`<a${addAttribute(resolveHref(crumb.href), "href")} class="block truncate rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">${crumb.label}</a>` : renderTemplate`<span class="block truncate rounded-md px-2.5 py-1.5 text-xs text-muted-foreground">${crumb.label}</span>`)}</div></details></li>`}${shouldCollapse && tailItems.map((crumb, i) => renderTemplate`<li class="flex items-center"><span class="mx-1.5 text-muted-foreground/50">/</span>${isCurrent(i === tailItems.length - 1) || !crumb.href ? renderTemplate`<span class="text-foreground truncate max-w-[12rem]">${crumb.label}</span>` : renderTemplate`<a${addAttribute(resolveHref(crumb.href), "href")} class="hover:text-foreground transition-colors truncate max-w-[12rem]">${crumb.label}</a>`}</li>`)}</ol></nav>`}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/breadcrumbs/Breadcrumbs.astro", void 0);
//#endregion
//#region src/components/ui/pagination/Pagination.astro
createAstro("https://example.com");
var $$Pagination = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Pagination;
	const { prevNext, class: className, ...attrs } = Astro2.props;
	const { prev, next } = prevNext;
	const prevHref = prev ? withBase(prev.href, "/") : void 0;
	const nextHref = next ? withBase(next.href, "/") : void 0;
	return renderTemplate`${(prev || next) && renderTemplate`${maybeRenderHead($$result)}<nav aria-label="Pagination"${addAttribute(cn("flex items-center justify-between mt-12 pt-6 border-t border-border", className), "class")}${spreadAttributes(attrs)}>${prev ? renderTemplate`<a${addAttribute(prevHref, "href")} class="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:caret-left",
		"class": "w-4 h-4 transition-transform group-hover:-translate-x-0.5"
	})}<span><span class="block text-xs text-muted-foreground">Previous</span><span class="font-medium text-foreground">${prev.label}</span></span></a>` : renderTemplate`<span></span>`}${next ? renderTemplate`<a${addAttribute(nextHref, "href")} class="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"><span><span class="block text-xs text-muted-foreground">Next</span><span class="font-medium text-foreground">${next.label}</span></span>${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:caret-right",
		"class": "w-4 h-4 transition-transform group-hover:translate-x-0.5"
	})}</a>` : renderTemplate`<span></span>`}</nav>`}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/pagination/Pagination.astro", void 0);
//#endregion
//#region src/components/ui/page-actions/PageActions.astro
createAstro("https://example.com");
var $$PageActions = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$PageActions;
	const { markdownUrl, lastUpdated, class: className, ...attrs } = Astro2.props;
	const resolvedMarkdownUrl = markdownUrl ? withBase(markdownUrl, "/") : void 0;
	const baseBtn = "inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-transparent px-2 py-1 text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2";
	const formattedDate = lastUpdated ? new Intl.DateTimeFormat(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	}).format(lastUpdated) : null;
	return renderTemplate`${(markdownUrl || lastUpdated) && renderTemplate`${maybeRenderHead($$result)}<div data-nb-page-actions${addAttribute(resolvedMarkdownUrl, "data-md-url")}${addAttribute(cn("not-prose -ml-2 flex flex-wrap items-center gap-y-1 text-[0.8125rem]", className), "class")}${spreadAttributes(attrs)}>${lastUpdated && renderTemplate`<span class="inline-flex items-center gap-1.5 px-2 py-1 text-muted-foreground">${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:clock",
		"class": "w-3.5 h-3.5"
	})}Updated <time${addAttribute(lastUpdated.toISOString(), "datetime")}>${formattedDate}</time></span>`}${markdownUrl && lastUpdated && renderTemplate`<span aria-hidden="true" class="select-none text-muted-foreground/40">|</span>`}${markdownUrl && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<button type="button" data-nb-page-actions-copy${addAttribute(baseBtn, "class")}>${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:copy",
		"class": "w-3.5 h-3.5",
		"data-nb-page-actions-copy-icon": true
	})}${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:check",
		"class": "hidden w-3.5 h-3.5 text-success",
		"data-nb-page-actions-check-icon": true
	})}<span data-nb-page-actions-label aria-live="polite">Copy page</span></button><span aria-hidden="true" class="select-none text-muted-foreground/40">|</span><a${addAttribute(resolvedMarkdownUrl, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(baseBtn, "class")}>${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:markdown-logo",
		"class": "w-3.5 h-3.5"
	})}View as Markdown</a>` })}`}</div>`}${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/page-actions/PageActions.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/page-actions/PageActions.astro", void 0);
//#endregion
//#region src/layouts/DocsLayout.astro
createAstro("https://example.com");
var $$DocsLayout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$DocsLayout;
	const { title, description, sidebar, headings, breadcrumbs, prevNext, mode = "doc", banner, head = [], searchable, noindex, markdownUrl, socialImage, lastUpdated, editUrl, draft, audience, collection, entryId } = Astro2.props;
	const effectiveSearchable = searchable ?? !noindex;
	const isCustom = mode === "custom";
	const showSidebar = sidebar !== false;
	const versionStatus = collection ? await getVersionStatus(collection) : null;
	const versionAlternates = collection && entryId ? await getVersionAlternates(collection, entryId) : null;
	const currentSiblingUrl = versionAlternates?.canonical?.url ? withBase(versionAlternates.canonical.url, "/") : null;
	const homeHref = withBase("/", "/");
	const pagefindAttrs = {};
	const pagefindDeprecated = effectiveSearchable && !versionStatus?.isHidden && Boolean(versionStatus?.isDeprecated);
	if (!effectiveSearchable || versionStatus?.isHidden) pagefindAttrs["data-pagefind-ignore"] = "";
	else {
		pagefindAttrs["data-pagefind-body"] = "";
		if (versionStatus) pagefindAttrs["data-pagefind-filter"] = `version:${versionStatus.version}`;
	}
	const hasHeader = Astro2.slots.has("header");
	const hasSidebar = Astro2.slots.has("sidebar");
	const hasToc = Astro2.slots.has("toc");
	const hasPageTitle = Astro2.slots.has("page-title");
	const hasContentFooter = Astro2.slots.has("content-footer");
	const hasPagination = Astro2.slots.has("pagination");
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": title,
		"description": description,
		"noindex": noindex || draft,
		"markdownUrl": markdownUrl,
		"socialImage": socialImage,
		"lastUpdated": lastUpdated,
		"head": head,
		"collection": collection,
		"entryId": entryId
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div class="flex flex-col min-h-screen">${hasHeader ? renderTemplate`${renderSlot($$result2, $$slots["header"])}` : renderTemplate`${renderComponent($$result2, "Header", $$Header, {
		"collection": collection,
		"entryId": entryId,
		"showSidebar": showSidebar
	})}`}${isCustom ? renderTemplate`<main${addAttribute(renderTransition($$result2, "oh3zk5it", "", "nb-content"), "data-astro-transition-scope")} id="main-content" tabindex="-1" class="flex-1">${renderSlot($$result2, $$slots["default"])}</main>` : renderTemplate`<div class="flex-1 mx-auto w-full"><div class="flex">${showSidebar && renderTemplate`<aside id="desktop-sidebar" data-nb-desktop-sidebar class="hidden md:flex w-60 lg:w-(--nb-sidebar-width) shrink-0 border-r border-border bg-background sticky top-14 h-[calc(100vh-3.5rem)] flex-col overflow-y-auto overscroll-contain relative">${hasSidebar ? renderTemplate`${renderSlot($$result2, $$slots["sidebar"])}` : renderTemplate`<nav class="px-4 pb-12 pt-5 flex-1">${renderComponent($$result2, "SidebarFilter", $$SidebarFilter, {})}${renderComponent($$result2, "Sidebar", $$Sidebar, {
		"items": sidebar,
		"persist": true
	})}</nav>`}<div class="pointer-events-none sticky bottom-0 h-8 bg-gradient-to-t from-base to-transparent"></div></aside>`}${showSidebar && renderTemplate`<script aria-hidden="true">
          (function () {
            function centerActive(sidebar, active) {
              const sr = sidebar.getBoundingClientRect();
              const ar = active.getBoundingClientRect();
              sidebar.scrollTop += ar.top - sr.top - sr.height / 2 + ar.height / 2;
            }

            function setGroupOpen(group, open) {
              group.setAttribute("data-nb-default-open", open ? "true" : "false");
              const trigger = group.querySelector("[data-nb-collapsible-trigger]");
              const panel = group.querySelector("[data-nb-collapsible-content]");
              const state = open ? "open" : "closed";
              if (trigger) {
                trigger.setAttribute("data-nb-state", state);
                trigger.setAttribute("aria-expanded", String(open));
              }
              if (panel) {
                panel.setAttribute("data-nb-state", state);
                panel.toggleAttribute("inert", !open);
              }
            }

            function restore() {
              try {
                if (!matchMedia("(min-width: 48rem)").matches) return;
                const sidebar = document.getElementById("desktop-sidebar");
                if (!sidebar) return;
                const content = sidebar.querySelector("[data-nb-sidebar]");
                if (!content) return;

                const raw = sessionStorage.getItem("sidebar-state");
                let state;
                if (raw) {
                  state = JSON.parse(raw);
                  if (state && content.dataset.nbSidebarHash === state.hash) {
                    const groups = content.querySelectorAll("[data-nb-sidebar-group]");
                    for (let i = 0; i < groups.length; i++) {
                      if (typeof state.open[i] === "boolean") {
                        setGroupOpen(groups[i], state.open[i]);
                      }
                    }
                  }
                }

                const active = sidebar.querySelector("[aria-current='page']");
                if (active) {
                  let d = active.closest("[data-nb-sidebar-group]");
                  while (d) {
                    setGroupOpen(d, true);
                    d = d.parentElement && d.parentElement.closest("[data-nb-sidebar-group]");
                  }
                }

                if (raw && state && typeof state.scroll === "number") {
                  sidebar.scrollTop = state.scroll;
                  if (active) {
                    const sr = sidebar.getBoundingClientRect();
                    const ar = active.getBoundingClientRect();
                    if (ar.top < sr.top || ar.bottom > sr.bottom) centerActive(sidebar, active);
                  }
                } else if (active) {
                  centerActive(sidebar, active);
                }
              } catch (_) {}
            }

            restore();
            if (!window.__nbSidebarRestoreBound) {
              window.__nbSidebarRestoreBound = true;
              document.addEventListener("astro:after-swap", restore);
            }
          })();
          <\/script>`}<main${addAttribute(renderTransition($$result2, "evztszbv", "", "nb-content"), "data-astro-transition-scope")} id="main-content" tabindex="-1" class="flex-1 min-w-0"><div class="mx-auto max-w-(--nb-content-max) px-4 md:px-6 pt-6 pb-12">${versionStatus?.isDeprecated && renderTemplate`${renderComponent($$result2, "Banner", $$Banner, {
		"variant": "caution",
		"content": currentSiblingUrl ? `This is the <strong>${versionStatus.version}</strong> version of the docs and is no longer maintained. The latest version of this page is at <a href="${currentSiblingUrl}">${currentSiblingUrl}</a>.` : `This is the <strong>${versionStatus.version}</strong> version of the docs and is no longer maintained. See the <a href="${homeHref}">current docs</a> for up-to-date content.`
	})}`}${banner && renderTemplate`${renderComponent($$result2, "Banner", $$Banner, {
		"content": banner.content,
		"variant": banner.type,
		"dismissible": banner.dismissible
	})}`}${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, {
		"items": breadcrumbs,
		"class": "pb-2"
	})}<div${spreadAttributes(pagefindAttrs)}>${pagefindDeprecated && renderTemplate`<span hidden data-pagefind-filter="status:deprecated"></span>`}${hasPageTitle ? renderTemplate`${renderSlot($$result2, $$slots["page-title"])}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<div class="flex items-center gap-3 flex-wrap mt-6"><h1 class="text-foreground mb-0 leading-tight [text-wrap:balance]"${addAttribute(`font-size:var(--nb-h1-size);font-weight:var(--nb-h1-weight);letter-spacing:var(--nb-h1-tracking)`, "style")}>${title}</h1>${draft && renderTemplate`${renderComponent($$result3, "Badge", $$Badge, {
		"text": "Draft",
		"variant": "warning",
		"size": "medium"
	})}`}</div>${description && renderTemplate`<p class="text-[0.9375rem] sm:text-[1.0625rem] text-muted-foreground leading-relaxed mt-2 mb-2 [text-wrap:pretty]">${description}</p>`}${renderComponent($$result3, "PageActions", $$PageActions, {
		"markdownUrl": markdownUrl,
		"lastUpdated": lastUpdated,
		"class": description ? void 0 : "mt-3"
	})}${headings !== false && headings.length > 0 && renderTemplate`<div class="border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-14 z-20 -mx-4 mt-3 border-y px-4 py-2 backdrop-blur md:-mx-6 md:px-6 xl:hidden">${renderComponent($$result3, "MobileTOC", $$MobileTOC, { "headings": headings })}</div>`}${(markdownUrl || audience === "human") && (audience === "human" ? renderTemplate`<div class="mt-3 mb-6 flex items-center gap-3" role="none"><div class="h-px flex-1 bg-border"></div>${renderComponent($$result3, "Badge", $$Badge, {
		"text": "For humans",
		"variant": "success",
		"size": "small",
		"class": "font-mono uppercase border border-success/15"
	})}<div class="h-px flex-1 bg-border"></div></div>` : renderTemplate`<div class="mt-3 mb-6 h-px w-full bg-border" role="none"></div>`)}${!description && !markdownUrl && audience !== "human" && renderTemplate`<div class="mb-4"></div>`}` })}`}<article class="docs-content max-w-none">${renderSlot($$result2, $$slots["default"])}</article>${hasContentFooter ? renderTemplate`${renderSlot($$result2, $$slots["content-footer"])}` : editUrl && renderTemplate`<div class="mt-8 mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"><a${addAttribute(editUrl, "href")} class="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors no-underline" target="_blank" rel="noopener">${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:pencil-simple",
		"class": "w-3.5 h-3.5"
	})}Edit this page</a></div>`}</div>${hasPagination ? renderTemplate`${renderSlot($$result2, $$slots["pagination"])}` : renderTemplate`${renderComponent($$result2, "Pagination", $$Pagination, { "prevNext": prevNext })}`}</div></main>${headings !== false && (hasToc || headings.length > 0) && renderTemplate`<aside data-nb-toc-scroll-host class="hidden xl:block w-(--nb-toc-width) shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"><div class="pt-6 pb-8 pl-8 pr-6">${hasToc ? renderTemplate`${renderSlot($$result2, $$slots["toc"])}` : renderTemplate`${renderComponent($$result2, "TOC", $$TOC, { "headings": headings })}`}</div></aside>`}</div></div>`}</div>${showSidebar && renderTemplate`<dialog data-mobile-sidebar data-state="closed" class="group fixed inset-0 m-0 h-full w-full max-h-full max-w-full border-0 bg-transparent p-0 [&amp;::backdrop]:bg-transparent" aria-label="Site navigation"><div data-mobile-sidebar-panel class="h-full w-(--nb-sidebar-width) max-w-[85vw] -translate-x-full overflow-y-auto overscroll-contain border-r border-border bg-card transition-transform duration-250 ease-out group-data-[state=open]:translate-x-0 motion-reduce:transition-none"><div class="sticky top-0 z-[1] flex items-center justify-between border-b border-border bg-card px-4 py-3"><span class="font-semibold text-sm text-foreground">Navigation</span><button data-close-sidebar class="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" aria-label="Close sidebar">${renderComponent($$result2, "Icon", $$Icon, {
		"name": "ph:x",
		"class": "w-5 h-5"
	})}</button></div><nav class="px-4 pb-8 pt-5">${hasSidebar ? renderTemplate`${renderSlot($$result2, $$slots["sidebar"])}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "SidebarFilter", $$SidebarFilter, {})}${renderComponent($$result3, "Sidebar", $$Sidebar, { "items": sidebar })}` })}`}</nav></div></dialog>`}${renderScript($$result2, "/home/hatch/workspace/software-architecture-book/site/src/layouts/DocsLayout.astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/layouts/DocsLayout.astro", "self");
//#endregion
//#region src/components/ui/aside/Aside.astro
createAstro("https://example.com");
var $$Aside = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Aside;
	const { type = "note", title, class: className, ...attrs } = Astro.props;
	const config = {
		note: {
			label: "Note",
			color: "var(--nb-info)",
			tint: "var(--nb-info-muted)"
		},
		tip: {
			label: "Tip",
			color: "var(--nb-success)",
			tint: "var(--nb-success-muted)"
		},
		caution: {
			label: "Caution",
			color: "var(--nb-warning)",
			tint: "var(--nb-warning-muted)"
		},
		danger: {
			label: "Danger",
			color: "var(--nb-danger)",
			tint: "var(--nb-danger-muted)"
		}
	};
	const c = config[type] ?? config.note;
	const displayTitle = title ?? c.label;
	return renderTemplate`${maybeRenderHead($$result)}<aside role="note"${addAttribute(displayTitle, "aria-label")}${addAttribute(cn("aside-card flex items-start gap-3 rounded-lg px-4 py-3 my-4", className), "class")}${addAttribute(`--_c: ${c.color}; --_t: ${c.tint};`, "style")}${spreadAttributes(attrs)} data-astro-cid-znle5jil><span class="shrink-0 flex items-center h-[1.375em]" aria-hidden="true" data-astro-cid-znle5jil>${type === "note" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:info",
		"class": "w-[1em] h-[1em]",
		"data-astro-cid-znle5jil": true
	})}`}${type === "tip" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:lightbulb",
		"class": "w-[1em] h-[1em]",
		"data-astro-cid-znle5jil": true
	})}`}${type === "caution" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:warning",
		"class": "w-[1em] h-[1em]",
		"data-astro-cid-znle5jil": true
	})}`}${type === "danger" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:warning-circle",
		"class": "w-[1em] h-[1em]",
		"data-astro-cid-znle5jil": true
	})}`}</span><div class="flex min-w-0 flex-1 flex-col gap-0.5" data-astro-cid-znle5jil><p class="m-0 text-base font-semibold leading-snug" data-astro-cid-znle5jil>${displayTitle}</p><div class="aside-card-body text-sm leading-normal" data-astro-cid-znle5jil>${renderSlot($$result, $$slots["default"])}</div></div></aside>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/aside/Aside.astro", void 0);
//#endregion
//#region src/components/Render.astro
createAstro("https://example.com");
var $$Render = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Render;
	const { file, params } = Astro.props;
	const page = Astro.url.pathname;
	const partial = await getVisibleEntry("partials", file);
	if (!partial) {
		const partialIds = (await getVisibleEntries(["partials"])).map((p) => p.id);
		const hint = closest(file, partialIds);
		const shortList = partialIds.sort().slice(0, 10).join(", ");
		const tail = partialIds.length > 10 ? ` (and ${partialIds.length - 10} more)` : partialIds.length === 0 ? "none" : "";
		throw new Error(`[Render] Partial "${file}" not found, included on "${page}".` + (hint ? ` Did you mean "${hint}"?` : "") + ` Available: ${shortList}${tail}`);
	}
	const declaredParams = partial.data.params;
	if (declaredParams) {
		const required = declaredParams.filter((param) => !param.endsWith("?"));
		const optional = declaredParams.filter((param) => param.endsWith("?"));
		const allNames = [...required, ...optional.map((param) => param.slice(0, -1))];
		const received = Object.keys(params ?? {});
		const missing = required.filter((param) => !received.includes(param));
		if (missing.length > 0) throw new Error(`[Render] Missing required params ${JSON.stringify(missing)} for "${file}" on "${page}". Expected: ${JSON.stringify(declaredParams)}, received: ${JSON.stringify(received)}`);
		const unexpected = received.filter((param) => !allNames.includes(param));
		if (unexpected.length > 0) {
			const unexpectedHints = unexpected.map((u) => {
				const h = closest(u, allNames);
				return h ? `"${u}" (did you mean "${h}"?)` : `"${u}"`;
			}).join(", ");
			throw new Error(`[Render] Unexpected params ${unexpectedHints} for "${file}" on "${page}". Declared: ${JSON.stringify(declaredParams)}`);
		}
	}
	const { Content } = await render(partial);
	function distance(a, b) {
		if (a === b) return 0;
		if (!a.length) return b.length;
		if (!b.length) return a.length;
		const v0 = new Array(b.length + 1);
		const v1 = new Array(b.length + 1);
		for (let i = 0; i <= b.length; i++) v0[i] = i;
		for (let i = 0; i < a.length; i++) {
			v1[0] = i + 1;
			for (let j = 0; j < b.length; j++) {
				const cost = a[i] === b[j] ? 0 : 1;
				v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
			}
			for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
		}
		return v1[b.length];
	}
	function closest(target, candidates, maxDist = 3) {
		const t = target.toLowerCase();
		let best = null;
		for (const c of candidates) {
			const d = distance(t, c.toLowerCase());
			if (d <= maxDist && (!best || d < best.dist)) best = {
				name: c,
				dist: d
			};
		}
		return best?.name ?? null;
	}
	return renderTemplate`${renderComponent($$result, "Content", Content, {
		"components": components,
		...params ?? {}
	})}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/Render.astro", void 0);
//#endregion
//#region src/components/ui/card/Card.astro
createAstro("https://example.com");
var $$Card = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Card;
	const { title, icon, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<article${addAttribute(cn("my-4 rounded-lg bg-card p-5 shadow-sm ring ring-border", className), "class")}${spreadAttributes(attrs)}>${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, {
		"name": icon,
		"class": "mb-2.5 block w-6 h-6 text-foreground"
	})}`}<h3 class="m-0 text-base font-semibold leading-snug text-foreground">${title}</h3><div class="mt-1.5 text-sm leading-normal text-muted-foreground">${renderSlot($$result, $$slots["default"])}</div></article>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/card/Card.astro", void 0);
//#endregion
//#region src/components/ui/card-grid/CardGrid.astro
createAstro("https://example.com");
var $$CardGrid = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CardGrid;
	const { class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn("grid grid-cols-1 gap-4 my-4 sm:grid-cols-2 [&>*]:my-0", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/card-grid/CardGrid.astro", void 0);
//#endregion
//#region src/components/ui/layer-card/LayerCard.astro
createAstro("https://example.com");
var $$LayerCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LayerCard;
	const { class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn("flex w-full flex-col overflow-hidden rounded-lg bg-muted text-sm ring ring-border", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/layer-card/LayerCard.astro", void 0);
//#endregion
//#region src/components/ui/layer-card/LayerCardHeader.astro
createAstro("https://example.com");
var $$LayerCardHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LayerCardHeader;
	const { class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn("flex items-center gap-2 bg-muted px-3 py-2 text-[0.8125rem] font-medium leading-5 text-muted-foreground", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/layer-card/LayerCardHeader.astro", void 0);
//#endregion
//#region src/components/ui/layer-card/LayerCardContent.astro
createAstro("https://example.com");
var $$LayerCardContent = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LayerCardContent;
	const { class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn("relative flex flex-col gap-2 overflow-hidden rounded-lg bg-card p-4 pr-3 text-sm leading-6 text-foreground ring ring-border", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/layer-card/LayerCardContent.astro", void 0);
//#endregion
//#region src/components/ui/package-managers/PackageManagers.astro
createAstro("https://example.com");
var $$PackageManagers = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PackageManagers;
	const { pkg, type = "add", args, dev, comment } = Astro.props;
	const tabs = getTabs(type, pkg, {
		args,
		dev,
		comment
	});
	const locals = Astro.locals;
	const counters = locals.__nbCounters ?? (locals.__nbCounters = /* @__PURE__ */ new Map());
	const n = (counters.get("package-managers") ?? 0) + 1;
	counters.set("package-managers", n);
	const uid = "pm-" + createHash("sha256").update(JSON.stringify({
		pkg,
		type,
		args,
		dev,
		comment
	})).digest("hex").slice(0, 12) + "-" + n.toString(16).padStart(4, "0");
	return renderTemplate`${maybeRenderHead($$result)}${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/package-managers/PackageManagers.astro?astro&type=script&index=0&lang.ts")}<div data-nb-pm class="w-full">${renderComponent($$result, "LayerCard", $$LayerCard, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "LayerCardHeader", $$LayerCardHeader, {
		"role": "tablist",
		"aria-label": "Package manager"
	}, { "default": ($$result) => renderTemplate`${tabs.map((tab, i) => renderTemplate`<button role="tab" type="button"${addAttribute(i === 0 ? "true" : "false", "aria-selected")}${addAttribute(`pm-panel-${uid}-${tab.mgr}`, "aria-controls")}${addAttribute(`pm-tab-${uid}-${tab.mgr}`, "id")} data-nb-pm-tab class="m-0 cursor-pointer rounded-md border-0 bg-transparent px-2 py-0.5 text-xs leading-5 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-selected:bg-selected aria-selected:text-foreground">${tab.mgr}</button>`)}` })}${tabs.map((tab, i) => {
		const cmdLines = tab.cmd.split("\n");
		const commentPrefix = cmdLines.length > 1 ? cmdLines.slice(0, -1).join("\n") + "\n" : "";
		const codeLine = cmdLines[cmdLines.length - 1];
		const spaceIdx = codeLine.indexOf(" ");
		const codeFirst = spaceIdx === -1 ? codeLine : codeLine.slice(0, spaceIdx);
		const codeRest = spaceIdx === -1 ? "" : codeLine.slice(spaceIdx);
		return renderTemplate`<div role="tabpanel"${addAttribute(`pm-panel-${uid}-${tab.mgr}`, "id")}${addAttribute(`pm-tab-${uid}-${tab.mgr}`, "aria-labelledby")}${addAttribute(i !== 0, "hidden")} data-nb-pm-panel class="relative overflow-hidden rounded-lg bg-card text-inherit ring ring-border"><div class="flex items-stretch"><pre class="my-0 min-w-0 grow overflow-x-auto border-0 bg-transparent px-4 py-3 text-sm leading-relaxed whitespace-pre font-mono text-foreground"><code data-nb-pm-code>${commentPrefix && renderTemplate`<span class="text-muted-foreground">${commentPrefix}</span>`}<span class="text-success">${codeFirst}</span><span class="text-warning">${codeRest}</span></code></pre><button type="button" data-nb-pm-copy${addAttribute(tab.cmd, "data-nb-command")} aria-label="Copy to clipboard" class="m-0 flex shrink-0 cursor-pointer items-center justify-center border-0 border-l border-solid border-border bg-transparent px-3 text-muted-foreground transition-colors hover:text-foreground">${renderComponent($$result, "Icon", $$Icon, {
			"name": "ph:copy",
			"class": "w-[18px] h-[18px]"
		})}</button></div></div>`;
	})}${renderComponent($$result, "nb-pm-restore", "nb-pm-restore", { "style": "display:contents" })}` })}<template data-nb-pm-icon-copy>${templateEnter($$result)}${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:copy",
		"class": "w-[18px] h-[18px]"
	})}${templateExit($$result)}</template><template data-nb-pm-icon-check>${templateEnter($$result)}${renderComponent($$result, "Icon", $$Icon, {
		"name": "ph:check",
		"class": "w-[18px] h-[18px]"
	})}${templateExit($$result)}</template></div>${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/package-managers/PackageManagers.astro?astro&type=script&index=1&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/package-managers/PackageManagers.astro", void 0);
//#endregion
//#region src/components/ui/steps/Steps.astro
createAstro("https://example.com");
var $$Steps = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Steps;
	const { start, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div data-steps${addAttribute(cn("steps", className), "class")}${addAttribute(start !== void 0 ? `--steps-start: ${start};` : void 0, "style")}${spreadAttributes(attrs)} data-astro-cid-sfejetki>${renderSlot($$result, $$slots["default"])}</div>${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/steps/Steps.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/steps/Steps.astro", void 0);
//#endregion
//#region src/components/ui/steps/Step.astro
createAstro("https://example.com");
var $$Step = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Step;
	const { title, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div data-step${addAttribute(cn(className), "class")}${spreadAttributes(attrs)}>${title && renderTemplate`<p class="m-0 font-semibold text-foreground">${title}</p>`}<div class="mt-1 text-sm leading-snug text-foreground [&amp;_p:first-child]:mt-0 [&amp;_p:last-child]:mb-0">${renderSlot($$result, $$slots["default"])}</div></div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/steps/Step.astro", void 0);
//#endregion
//#region src/components/ui/tabs/TabsList.astro
createAstro("https://example.com");
var $$TabsList = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TabsList;
	const { class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(cn("relative flex overflow-x-auto overscroll-x-contain border-b border-border", "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className), "class")} role="tablist" data-nb-tabs-list${spreadAttributes(attrs)}><span class="pointer-events-none absolute bottom-0 h-0.5 rounded-t-sm bg-primary transition-[left,width] duration-200 ease-out" data-nb-tabs-indicator aria-hidden="true"></span>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/tabs/TabsList.astro", void 0);
//#endregion
//#region src/components/ui/tabs/Tabs.astro
createAstro("https://example.com");
var $$Tabs = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Tabs;
	const { syncKey, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div data-nb-tabs${addAttribute(syncKey, "data-nb-sync-key")}${addAttribute(cn(className), "class")}${spreadAttributes(attrs)}>${renderComponent($$result, "TabsList", $$TabsList, {})}<div class="mt-3">${renderSlot($$result, $$slots["default"])}</div></div>${renderScript($$result, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/tabs/Tabs.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/tabs/Tabs.astro", void 0);
//#endregion
//#region src/components/ui/tabs/TabItem.astro
createAstro("https://example.com");
var $$TabItem = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TabItem;
	const { label, class: className, ...attrs } = Astro.props;
	if (!label) throw new Error("Missing required `label` prop on `<TabItem>` component.");
	return renderTemplate`${maybeRenderHead($$result)}<div role="tabpanel" data-nb-tabs-content${addAttribute(label, "data-nb-tab-label")}${addAttribute(cn(className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/tabs/TabItem.astro", void 0);
//#endregion
//#region src/components/ui/tabs/TabsTrigger.astro
createAstro("https://example.com");
var $$TabsTrigger = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TabsTrigger;
	const { value, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<button role="tab" type="button" data-nb-tabs-trigger${addAttribute(value, "data-nb-value")}${addAttribute(cn("shrink-0 cursor-pointer px-4 py-2 text-sm font-medium leading-6 whitespace-nowrap text-muted-foreground transition-colors", "hover:text-foreground aria-selected:text-primary", "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]", className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</button>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/tabs/TabsTrigger.astro", void 0);
//#endregion
//#region src/components/ui/tabs/TabsContent.astro
createAstro("https://example.com");
var $$TabsContent = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TabsContent;
	const { value, class: className, ...attrs } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div role="tabpanel" data-nb-tabs-content${addAttribute(value, "data-nb-value")}${addAttribute(cn(className), "class")}${spreadAttributes(attrs)}>${renderSlot($$result, $$slots["default"])}</div>`;
}, "/home/hatch/workspace/software-architecture-book/site/src/components/ui/tabs/TabsContent.astro", void 0);
//#endregion
//#region src/components.ts
/**
* MDX globals registry — components available inside MDX without `import`.
* Wired via `<Content components={components} />` in `[...slug].astro`.
* Add new components here as you build (or install) them.
*/
var components = {
	Aside: $$Aside,
	Card: $$Card,
	CardGrid: $$CardGrid,
	PackageManagers: $$PackageManagers,
	Render: $$Render,
	Step: $$Step,
	Steps: $$Steps,
	TabItem: $$TabItem,
	Tabs: $$Tabs
};
//#endregion
//#region src/pages/[...slug].astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	prerender: () => true,
	url: () => $$url
});
createAstro("https://example.com");
var getStaticPaths = getDocsStaticPaths;
var $$Component = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Component;
	const page = await getDocsPage(Astro2);
	if (page instanceof Response) return page;
	const { entry, Content, headings, markdownUrl, ogImageUrl } = page;
	const currentSlug = stripBase(Astro2.url.pathname, "/").replace(/\/$/, "") || "/";
	const { sidebar: sidebarOn, tableOfContents: tocOn } = await getRouteFlags(entry);
	const sidebar = sidebarOn ? await getSidebar(currentSlug, { collection: entry.collection }) : false;
	const prevNext = await getPrevNext(currentSlug, {
		sidebarTree: sidebar === false ? [] : sidebar,
		overrides: {
			prev: entry.data.prev,
			next: entry.data.next
		}
	});
	const breadcrumbs = await getBreadcrumbs(currentSlug, { collection: entry.collection });
	const editUrl = await getEditUrl(entry);
	const lastUpdated = entry.data.lastUpdated ?? await getLastUpdated(entry);
	const tocConfig = entry.data.tableOfContents;
	const toc = tocOn && tocConfig !== false ? getTOC(headings, tocConfig) : false;
	const socialImage = entry.data.socialImage ?? ogImageUrl;
	return renderTemplate`${renderComponent($$result, "DocsLayout", $$DocsLayout, {
		"title": entry.data.title,
		"description": entry.data.description,
		"sidebar": sidebar,
		"headings": toc,
		"breadcrumbs": breadcrumbs,
		"prevNext": prevNext,
		"mode": entry.data.mode,
		"banner": entry.data.banner,
		"head": entry.data.head,
		"searchable": entry.data.searchable,
		"noindex": entry.data.noindex,
		"markdownUrl": markdownUrl,
		"socialImage": socialImage,
		"lastUpdated": lastUpdated,
		"editUrl": editUrl,
		"draft": entry.data.draft,
		"audience": entry.data.audience,
		"collection": entry.collection,
		"entryId": entry.id
	}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Content", Content, { "components": components })}` })}`;
}, "/home/hatch/workspace/software-architecture-book/site/src/pages/[...slug].astro", void 0);
var $$file = "/home/hatch/workspace/software-architecture-book/site/src/pages/[...slug].astro";
var $$url = "/[...slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/[...slug]@_@astro
var page = () => ____slug__exports;
//#endregion
export { page };
