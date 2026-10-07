#!/usr/bin/env node
// Render rest-state PNGs from hairline HTML figures for PDF.
// Usage: node render-static.mjs
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

// playwright-core from the hairline-look cache
const cacheDir = path.join(process.env.XDG_CACHE_HOME || path.join(homedir(), ".cache"), "hairline-look");
const req = createRequire(path.join(cacheDir, "look.cjs"));
const { chromium } = req("playwright-core");

const MAP = [
  ["footings", "ch01-abstract.png"],
  ["scales", "ch02-abstract.png"],
  ["dividers", "ch03-abstract.png"],
  ["layers", "ch04-abstract.png"],
  ["fence", "ch05-abstract.png"],
  ["drawers", "ch06-abstract.png"],
  ["ballot", "ch07-abstract.png"],
  ["net", "ch08-abstract.png"],
  ["breaker", "ch09-abstract.png"],
  ["locks", "ch10-abstract.png"],
  ["drafting", "ch11-abstract.png"],
  ["keystone", "cover-blueprint.png"],
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 500, height: 420 },
  deviceScaleFactor: 4,
});

for (const [name, out] of MAP) {
  const file = path.join(here, `hairline-${name}.html`);
  await page.goto(`file://${file}`);
  // wait for the figure to settle at rest
  await page.waitForTimeout(1500);
  // hide all UI chrome, keep only the SVG stage
  await page.evaluate(() => {
    for (const id of ["name", "read", "intensity", "value", "theme", "means", "rules", "error"]) {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    }
    // hide slider labels and other controls
    document.querySelectorAll("input, button, label").forEach((el) => (el.style.display = "none"));
  });
  const stage = page.locator("#stage");
  const outPath = path.join(here, "static-export", out);
  await stage.screenshot({ path: outPath });
  console.log(`wrote ${outPath}`);
}

await browser.close();
