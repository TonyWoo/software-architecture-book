import { n as AstroUserError } from "./errors_PsIddLPp.mjs";
import { createRequire } from "node:module";
import { deterministicString } from "deterministic-object-hash";
import { decodeHTMLStrict } from "entities";
import fs from "node:fs/promises";
import path from "node:path";
import { Buffer } from "node:buffer";
//#region node_modules/astro-og-canvas/dist/queue.js
/**
* This is a queuing/limiting system based on the `p-limit` npm package, but heavily simplified
* to a minimal API surface. All it does is ensure tasks run one at a time, sequentially.
*
* @example
* const queue = pQueue();
* const input = [
* 	limit(() => fetchSomething('foo')),
* 	limit(() => fetchSomething('bar')),
* 	limit(() => doSomething())
* ];
* // Each promise is run sequentially rather than in parallel.
* await Promise.all(input);
*/
function pQueue() {
	const queue = [];
	let activeCount = 0;
	/** Process the next queued function if we're under the concurrency limit. */
	const resumeNext = () => {
		if (activeCount < 1 && queue.length > 0) {
			activeCount++;
			queue.shift()();
		}
	};
	const run = async (task, resolve) => {
		const result = (async () => task())();
		resolve(result);
		try {
			await result;
		} catch {}
		activeCount--;
		resumeNext();
	};
	const enqueue = (task, resolve) => {
		new Promise((internalResolve) => {
			queue.push(internalResolve);
		}).then(() => run(task, resolve));
		if (activeCount < 1) resumeNext();
	};
	/** Run `task` when any previously enqueued tasks have completed. */
	const generator = (task) => new Promise((resolve) => {
		enqueue(task, resolve);
	});
	return generator;
}
//#endregion
//#region node_modules/astro-og-canvas/dist/shorthash.js
/**
* shorthash - https://github.com/bibig/node-shorthash
*
* @license
*
* (The MIT License)
*
* Copyright (c) 2013 Bibig <bibig@me.com>
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
var dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
var binary = 61;
function bitwise(str) {
	let hash = 0;
	if (str.length === 0) return hash;
	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		hash = (hash << 5) - hash + ch;
		hash = hash & hash;
	}
	return hash;
}
function shorthash(text) {
	let num;
	let result = "";
	let integer = bitwise(text);
	const sign = integer < 0 ? "Z" : "";
	integer = Math.abs(integer);
	while (integer >= binary) {
		num = integer % binary;
		integer = Math.floor(integer / binary);
		result = dictionary[num] + result;
	}
	if (integer > 0) result = dictionary[integer] + result;
	return sign + result;
}
//#endregion
//#region node_modules/astro-og-canvas/dist/assetLoaders.js
var { resolve } = createRequire(import.meta.url);
var debug = (...args) => console.debug("[astro-og-canvas]", ...args);
var error = (...args) => console.error("[astro-og-canvas]", ...args);
/** CanvasKit singleton. */
var canvasKitSingleton;
async function getCanvasKit() {
	if (!canvasKitSingleton) try {
		const { default: init } = await import("canvaskit-wasm/full");
		canvasKitSingleton = await init({ locateFile: (file) => resolve(`canvaskit-wasm/bin/full/${file}`) });
	} catch (e) {
		throw formatCanvasKitInitError(e);
	}
	return canvasKitSingleton;
}
function formatCanvasKitInitError(e) {
	if (e instanceof Error && e.message.includes("__dirname is not defined")) e.message += "\n\nThis error is often thrown when using PNPM without installing `canvaskit-wasm` directly.\nInstall this required dependency by running `pnpm add canvaskit-wasm`\n";
	return e;
}
var FontManager = class {
	/** Font data cache to avoid repeat downloads. */
	#cache = /* @__PURE__ */ new Map();
	#hashCache = /* @__PURE__ */ new Map();
	/** Queue to co-ordinate `#get` calls to run sequentially. */
	#queue = pQueue();
	/** Current `CanvasKit.FontMgr` instance. */
	#manager;
	/** Get a `CanvasKit.FontMgr` instance with all the currently cached fonts, creating a new one if needed. */
	async #getOrCreateManager(shouldUpdate) {
		if (!shouldUpdate && this.#manager) return this.#manager;
		const CanvasKit = await getCanvasKit();
		const fontData = Array.from(this.#cache.values()).filter((v) => !!v);
		this.#manager = CanvasKit.FontMgr.FromData(...fontData);
		const fontCount = this.#manager.countFamilies();
		const fontFamilies = [];
		for (let i = 0; i < fontCount; i++) fontFamilies.push(this.#manager.getFamilyName(i));
		debug("Loaded", fontCount, "font families:\n" + fontFamilies.join(", "));
		return this.#manager;
	}
	/**
	* Get a font manager instance for the provided fonts.
	*
	* Fonts are backed by an in-memory cache, so fonts are only downloaded once.
	*
	* Tries to avoid repeated instantiation of `CanvasKit.FontMgr` due to a memory leak
	* in their implementation. Will only reinstantiate if it sees a new font in the
	* `fontUrls` array.
	*
	* @param fontUrls Array of URLs to remote font files (TTF recommended).
	* @returns A font manager for all fonts loaded up until now.
	*/
	async get(fontUrls) {
		return this.#queue(async () => {
			let hasNew = false;
			for (const url of fontUrls) {
				if (this.#cache.has(url)) continue;
				hasNew = true;
				debug("Loading", url);
				if (/^https?:\/\//.test(url)) {
					const response = await fetch(url);
					if (response.ok) this.#cache.set(url, await response.arrayBuffer());
					else {
						this.#cache.set(url, void 0);
						error(response.status, response.statusText, "—", url);
					}
				} else {
					const file = await fs.readFile(url);
					this.#cache.set(url, file);
				}
			}
			return this.#getOrCreateManager(hasNew);
		});
	}
	/** Get a short hash for a given font resource. */
	getHash(url) {
		let hash = this.#hashCache.get(url) || "";
		if (hash) return hash;
		const buffer = this.#cache.get(url);
		hash = buffer ? shorthash(buffer.toString()) : "";
		this.#hashCache.set(url, hash);
		return hash;
	}
};
var fontManager = new FontManager();
var images = {
	cache: /* @__PURE__ */ new Map(),
	queue: pQueue()
};
/**
* Load an image. Backed by an in-memory cache to avoid repeat disk-reads.
* @param path Path to an image file, e.g. `./src/logo.png`.
* @returns Buffer containing the image contents.
*/
var loadImage = async (path) => images.queue(async () => {
	const cached = images.cache.get(path);
	if (cached) return cached;
	else {
		const buffer = await fs.readFile(path);
		const image = {
			buffer,
			hash: shorthash(buffer.toString())
		};
		images.cache.set(path, image);
		return image;
	}
});
//#endregion
//#region node_modules/astro-og-canvas/dist/generateOpenGraphImage.js
var [width, height] = [1200, 630];
var edges = {
	top: [
		0,
		0,
		width,
		0
	],
	bottom: [
		0,
		height,
		width,
		height
	],
	left: [
		0,
		0,
		0,
		height
	],
	right: [
		width,
		0,
		width,
		height
	]
};
var defaults = {
	border: {
		color: [
			255,
			255,
			255
		],
		width: 0,
		side: "inline-start"
	},
	font: {
		title: {
			color: [
				255,
				255,
				255
			],
			size: 70,
			lineHeight: 1,
			weight: "Normal",
			families: ["Noto Sans"]
		},
		description: {
			color: [
				255,
				255,
				255
			],
			size: 40,
			lineHeight: 1.3,
			weight: "Normal",
			families: ["Noto Sans"]
		}
	}
};
var ImageCache = class {
	#dirCache = /* @__PURE__ */ new Set();
	/** Ensure the requested directory exists. */
	async #mkdir(dir) {
		if (this.#dirCache.has(dir)) return;
		try {
			await fs.mkdir(dir, { recursive: true });
			this.#dirCache.add(dir);
		} catch {}
	}
	/** Retrieve an image from the file system cache if it exists. */
	async get(cachePath) {
		await this.#mkdir(path.dirname(cachePath));
		return await fs.readFile(cachePath).catch(() => void 0);
	}
	/** Write an image to the file system cache. */
	async set(cachePath, image) {
		await this.#mkdir(path.dirname(cachePath));
		await fs.writeFile(cachePath, image).catch(() => void 0);
	}
};
var imageCache = new ImageCache();
async function generateOpenGraphImage({ cacheDir = "./node_modules/.astro-og-canvas", title, description = "", dir = "ltr", bgGradient = [[
	0,
	0,
	0
]], bgImage, border: borderConfig = {}, padding = 60, logo, font: fontConfig = {}, fonts = ["https://api.fontsource.org/v1/fonts/noto-sans/latin-400-normal.ttf"], format = "PNG", quality = 90 }) {
	const fontMgr = await fontManager.get(fonts);
	const loadedLogo = logo && await loadImage(logo.path);
	const loadedBg = bgImage && await loadImage(bgImage.path);
	/** A deterministic hash based on inputs. */
	const hash = shorthash(deterministicString([
		title,
		description,
		dir,
		bgGradient,
		bgImage,
		borderConfig,
		padding,
		logo,
		fontConfig,
		fonts,
		quality,
		loadedLogo?.hash,
		loadedBg?.hash,
		fonts.map((font) => fontManager.getHash(font))
	]));
	let cacheFilePath;
	if (cacheDir) {
		cacheFilePath = path.join(cacheDir, `${hash}.${format.toLowerCase()}`);
		const cached = await imageCache.get(cacheFilePath);
		if (cached) return cached;
	}
	const border = {
		...defaults.border,
		...borderConfig
	};
	const font = {
		title: {
			...defaults.font.title,
			...fontConfig.title
		},
		description: {
			...defaults.font.description,
			...fontConfig.description
		}
	};
	const isRtl = dir === "rtl";
	const margin = {
		"block-start": padding,
		"block-end": padding,
		"inline-start": padding,
		"inline-end": padding
	};
	margin[border.side] += border.width;
	const CanvasKit = await getCanvasKit();
	const textStyle = (fontConfig) => ({
		color: CanvasKit.Color(...fontConfig.color),
		fontFamilies: fontConfig.families,
		fontSize: fontConfig.size,
		fontStyle: { weight: CanvasKit.FontWeight[fontConfig.weight] },
		heightMultiplier: fontConfig.lineHeight
	});
	const surface = CanvasKit.MakeSurface(width, height);
	const canvas = surface.getCanvas();
	const bgRect = CanvasKit.XYWHRect(0, 0, width, height);
	const bgPaint = new CanvasKit.Paint();
	bgPaint.setShader(CanvasKit.Shader.MakeLinearGradient([0, 0], [0, height], bgGradient.map((rgb) => CanvasKit.Color(...rgb)), null, CanvasKit.TileMode.Clamp));
	canvas.drawRect(bgRect, bgPaint);
	if (border.width) {
		const borderStyle = new CanvasKit.Paint();
		borderStyle.setStyle(CanvasKit.PaintStyle.Stroke);
		borderStyle.setColor(CanvasKit.Color(...border.color));
		borderStyle.setStrokeWidth(border.width * 2);
		const borders = {
			"block-start": edges.top,
			"block-end": edges.bottom,
			"inline-start": isRtl ? edges.right : edges.left,
			"inline-end": isRtl ? edges.left : edges.right
		};
		canvas.drawLine(...borders[border.side], borderStyle);
	}
	if (bgImage && loadedBg?.buffer) {
		const bgImg = CanvasKit.MakeImageFromEncoded(loadedBg.buffer);
		if (bgImg) {
			let { position = "center", fit = "none" } = bgImage;
			if (typeof position === "string") position = [position, position];
			const [bgW, bgH] = [bgImg.width(), bgImg.height()];
			let [targetW, targetH] = [bgW, bgH];
			if (fit === "fill") [targetW, targetH] = [width, height];
			else if (fit === "cover") {
				const ratio = bgW / width < bgH / height ? width / bgW : height / bgH;
				[targetW, targetH] = [bgW * ratio, bgH * ratio];
			} else if (fit === "contain") {
				const ratio = bgW / width > bgH / height ? width / bgW : height / bgH;
				[targetW, targetH] = [bgW * ratio, bgH * ratio];
			}
			const [blockAlign, inlineAlign] = position;
			const targetX = inlineAlign === "start" ? 0 : inlineAlign === "end" ? width - targetW : (width - targetW) / 2;
			const targetY = blockAlign === "start" ? 0 : blockAlign === "end" ? height - targetH : (height - targetH) / 2;
			const srcRect = CanvasKit.XYWHRect(0, 0, bgW, bgH);
			const destRect = CanvasKit.XYWHRect(targetX, targetY, targetW, targetH);
			canvas.drawImageRect(bgImg, srcRect, destRect, new CanvasKit.Paint());
		}
	}
	let logoHeight = 0;
	if (logo && loadedLogo?.buffer) {
		const img = CanvasKit.MakeImageFromEncoded(loadedLogo.buffer);
		if (img) {
			const logoH = img.height();
			const logoW = img.width();
			const targetW = logo.size?.[0] ?? logoW;
			const targetH = logo.size?.[1] ?? targetW / logoW * logoH;
			const xRatio = targetW / logoW;
			const yRatio = targetH / logoH;
			logoHeight = targetH;
			const imagePaint = new CanvasKit.Paint();
			imagePaint.setImageFilter(CanvasKit.ImageFilter.MakeMatrixTransform(CanvasKit.Matrix.scaled(xRatio, yRatio), { filter: CanvasKit.FilterMode.Linear }, null));
			const imageLeft = isRtl ? 1 / xRatio * (width - margin["inline-start"]) - logoW : 1 / xRatio * margin["inline-start"];
			canvas.drawImage(img, imageLeft, 1 / yRatio * margin["block-start"], imagePaint);
		}
	}
	if (fontMgr) {
		const paragraphStyle = new CanvasKit.ParagraphStyle({
			textAlign: isRtl ? CanvasKit.TextAlign.Right : CanvasKit.TextAlign.Left,
			textStyle: textStyle(font.title),
			textDirection: isRtl ? CanvasKit.TextDirection.RTL : CanvasKit.TextDirection.LTR
		});
		const paragraphBuilder = CanvasKit.ParagraphBuilder.Make(paragraphStyle, fontMgr);
		paragraphBuilder.addText(decodeHTMLStrict(title));
		paragraphBuilder.pushStyle(new CanvasKit.TextStyle({
			fontSize: padding / 3,
			heightMultiplier: 1
		}));
		paragraphBuilder.addText("\n\n");
		paragraphBuilder.pushStyle(new CanvasKit.TextStyle(textStyle(font.description)));
		paragraphBuilder.addText(decodeHTMLStrict(description));
		const para = paragraphBuilder.build();
		const paraWidth = width - margin["inline-start"] - margin["inline-end"] - padding;
		para.layout(paraWidth);
		const paraLeft = isRtl ? width - margin["inline-start"] - para.getMaxWidth() : margin["inline-start"];
		const minTop = margin["block-start"] + logoHeight + (logoHeight ? padding : 0);
		const maxTop = minTop + (logoHeight ? padding : 0);
		const naturalTop = height - margin["block-end"] - para.getHeight();
		const paraTop = Math.max(minTop, Math.min(maxTop, naturalTop));
		canvas.drawParagraph(para, paraLeft, paraTop);
	}
	const imageBytes = surface.makeImageSnapshot().encodeToBytes(CanvasKit.ImageFormat[format], quality) || /* @__PURE__ */ new Uint8Array();
	surface.dispose();
	const imgBuffer = Buffer.from(imageBytes);
	if (cacheFilePath) await imageCache.set(cacheFilePath, imgBuffer);
	return imgBuffer;
}
//#endregion
//#region node_modules/astro-og-canvas/dist/routing.js
var pathToSlug = (path, _page, imageOptions) => {
	const extension = "." + (imageOptions.format || "PNG").toLowerCase();
	path = path.replace(/^\/src\/pages\//, "");
	path = path.replace(/\.[^\.]*$/, "") + extension;
	path = path.replace(/\/index\.(png|jpeg|webp)$/, extension);
	return path;
};
async function makeGetStaticPaths({ pages, getSlug = pathToSlug, getImageOptions }) {
	const entries = await Promise.all(Object.entries(pages).map(async (page) => {
		const imageOptions = await getImageOptions(...page);
		return {
			slug: getSlug(...page, imageOptions),
			imageOptions
		};
	}));
	return function getStaticPaths({ routePattern }) {
		const param = routePatternToParam(routePattern);
		return entries.map(({ slug, imageOptions }) => ({
			params: { [param]: slug },
			props: { imageOptions }
		}));
	};
}
function createOGImageEndpoint() {
	return async function getOGImage({ props }) {
		return new Response(await generateOpenGraphImage(props.imageOptions));
	};
}
async function OGImageRoute(opts) {
	return {
		getStaticPaths: await makeGetStaticPaths(opts),
		GET: createOGImageEndpoint()
	};
}
/**
* Converts a `routePattern` from Astro's `getStaticPaths()` to a parameter name.
* For example, extracts `slug` from both `/og/[slug].png` and `/og/[...slug].png`.
*/
function routePatternToParam(routePattern) {
	const matches = routePattern.matchAll(/\[(?:\.{3})?(?<param>.+?)\]/g);
	let param;
	let paramCount = 0;
	for (const { groups } of matches) if (groups?.param) {
		param = groups.param;
		paramCount++;
	}
	if (!param) throw new AstroUserError(`No parameter found in route: \`${routePattern}\``, "Make sure the open graph image file name contains a dynamic route parameter, e.g. `src/pages/og/[...slug].ts`.\n\nSee https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.");
	if (paramCount > 1) throw new AstroUserError(`Multiple parameters found in route: \`${routePattern}\``, "Make sure the open graph image file name only contains one dynamic route parameter, e.g. `src/pages/og/[...slug].ts`.\n\nSee https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.");
	return param;
}
//#endregion
//#region src/pages/og/_og-card-config.ts
var ogCardConfig = {
	bgGradient: [[
		11,
		11,
		12
	], [
		26,
		26,
		28
	]],
	border: {
		color: [
			39,
			39,
			42
		],
		width: 2,
		side: "inline-start"
	},
	padding: 96,
	fonts: ["./public/fonts/Inter-Bold.ttf"],
	font: {
		title: {
			color: [
				250,
				250,
				250
			],
			size: 64,
			weight: "Bold",
			families: ["Inter"],
			lineHeight: 1.1
		},
		description: {
			color: [
				161,
				161,
				170
			],
			size: 32,
			weight: "Bold",
			families: ["Inter"],
			lineHeight: 1.3
		}
	},
	format: "PNG"
};
//#endregion
export { OGImageRoute as n, generateOpenGraphImage as r, ogCardConfig as t };
