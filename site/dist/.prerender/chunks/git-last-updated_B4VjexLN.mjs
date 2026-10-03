import { t as runtimeWarn } from "./runtime-warn-etLzYhwu_SxrSKdg7.mjs";
import { promisify } from "node:util";
import { execFile, spawn } from "node:child_process";
//#region node_modules/@cloudflare/nimbus-docs/dist/_internal/git-last-updated.js
var execFileAsync = promisify(execFile);
var CONTENT_PATHSPEC = "src/content";
var cache = /* @__PURE__ */ new Map();
var bulkPromise = null;
var bulkLoaded = false;
var isShallow = false;
var bulkCount = 0;
var missCount = 0;
var warned = false;
var norm = (p) => p.replace(/\\/g, "/");
function createIndexer(map) {
	let currentMs = null;
	return (raw) => {
		const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
		if (line.startsWith("t:")) {
			const sec = Number(line.slice(2));
			currentMs = Number.isFinite(sec) ? sec * 1e3 : null;
			return;
		}
		if (currentMs === null || line.indexOf("	") === -1) return;
		const path = norm(line.slice(line.lastIndexOf("	") + 1));
		if (path && !map.has(path)) map.set(path, new Date(currentMs));
	};
}
async function detectShallow() {
	try {
		const { stdout } = await execFileAsync("git", ["rev-parse", "--is-shallow-repository"], { windowsHide: true });
		return stdout.trim() === "true";
	} catch {
		return false;
	}
}
function streamBulk(map = cache, cwd) {
	return new Promise((resolve, reject) => {
		const child = spawn("git", [
			"-c",
			"core.quotePath=false",
			"log",
			"--format=t:%at",
			"--name-status",
			"--relative",
			"--",
			CONTENT_PATHSPEC
		], {
			cwd,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			windowsHide: true
		});
		const index = createIndexer(map);
		let buf = "";
		const consume = (chunk, flush) => {
			buf += chunk;
			let nl = buf.indexOf("\n");
			while (nl !== -1) {
				index(buf.slice(0, nl));
				buf = buf.slice(nl + 1);
				nl = buf.indexOf("\n");
			}
			if (flush && buf) {
				index(buf);
				buf = "";
			}
		};
		child.stdout.setEncoding("utf8");
		child.stdout.on("data", (c) => consume(c, false));
		child.stdout.on("error", reject);
		child.on("error", reject);
		child.on("close", (code) => {
			consume("", true);
			if (code === 0) resolve();
			else reject(/* @__PURE__ */ new Error(`git log exited with code ${code}`));
		});
	});
}
async function doBulkLoad() {
	try {
		isShallow = await detectShallow();
		await streamBulk();
		bulkLoaded = true;
		bulkCount = cache.size;
	} catch {
		bulkLoaded = false;
	}
}
async function getLastUpdatedFromGit(filePath) {
	if (!filePath) return void 0;
	const key = norm(filePath);
	if (cache.has(key)) return cache.get(key);
	if (!bulkPromise) bulkPromise = doBulkLoad();
	await bulkPromise;
	if (cache.has(key)) return cache.get(key);
	if (bulkLoaded) {
		missCount++;
		if (!warned && !isShallow && missCount >= 50) {
			warned = true;
			runtimeWarn(`lastUpdated: indexed ${bulkCount} file(s) but ${missCount}+ lookups missed — likely a path mismatch between entry.filePath and git output. "Last updated" will be blank on those pages.`);
		}
	}
	cache.set(key, void 0);
}
//#endregion
export { getLastUpdatedFromGit };
