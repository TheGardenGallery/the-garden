// Verify the three curator-directed pairings on the live deploy.
// For each pairing, click the relevant colour swatch, read the
// grid's full sorted piece order, and report whether the new piece
// is directly adjacent to its anchor.
//
//   node scripts/test-pairings.mjs

import { chromium } from "playwright";

const URL = "https://thegarden.art/exhibitions/split-logic";

const PAIRS = [
  { new: "sl-011", anchor: "sl-077", label: "11 next to 77" },
  { new: "sl-019", anchor: "sl-097", label: "19 after 97" },
  { new: "sl-075", anchor: "sl-015", label: "75 leads 15" },
];

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.error("pageerror:", e.message));

await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForSelector(".piece-grid", { timeout: 30000 });
await page.evaluate(() => {
  document.querySelector(".piece-grid")?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(2500);

// Probe how many swatches there are; each is locked on click.
const swatchCount = await page.evaluate(() => {
  const sels = [".sl-palette-cell", ".sl-palette-strip", "button[data-zone]"];
  for (const s of sels) {
    const n = document.querySelectorAll(s).length;
    if (n >= 4) return { selector: s, count: n };
  }
  return { selector: null, count: 0 };
});
console.log(`swatches: ${swatchCount.count} via ${swatchCount.selector}`);

// Read the full sorted-piece order across all pages, by paging until
// we see a page repeat. Returns a single array of sl-NNN ids in
// current sort order (deduplicated).
async function readFullOrder() {
  const seen = new Set();
  const order = [];
  let prevFirst = null;
  for (let p = 0; p < 12; p++) {
    const cellIds = await page.evaluate(() => {
      const cells = document.querySelectorAll(".piece-cell");
      return Array.from(cells)
        .map((c) => {
          const src =
            c.getAttribute("data-zoom-src") ??
            c.querySelector("video")?.currentSrc ??
            c.querySelector("video")?.src ??
            "";
          const m = src.match(/sl-(\d+)\.[a-z0-9]+/i);
          return m ? `sl-${m[1]}` : null;
        })
        .filter(Boolean);
    });
    if (cellIds.length === 0) break;
    if (prevFirst && cellIds[0] === prevFirst) break;
    prevFirst = cellIds[0];
    for (const id of cellIds) {
      if (!seen.has(id)) { seen.add(id); order.push(id); }
    }
    // Next page
    const next = page.locator(".sl-pager-next").first();
    if ((await next.count()) === 0) break;
    await next.click({ force: true });
    await page.waitForTimeout(900);
  }
  return order;
}

async function clickSwatch(idx) {
  const swatch = page.locator(swatchCount.selector).nth(idx);
  await swatch.click({ force: true });
  await page.waitForTimeout(1200);
}

// Test each pairing — try each swatch index, find which one yields
// the two pieces as adjacent.
for (const pair of PAIRS) {
  console.log(`\n── ${pair.label} (${pair.new} / ${pair.anchor}) ──`);
  let bestFound = false;
  for (let z = 0; z < swatchCount.count; z++) {
    await clickSwatch(z);
    const order = await readFullOrder();
    const iNew = order.indexOf(pair.new);
    const iAnc = order.indexOf(pair.anchor);
    if (iNew < 0 || iAnc < 0) {
      console.log(`  swatch ${z}: missing one of the pieces`);
      continue;
    }
    const gap = Math.abs(iNew - iAnc);
    const flag = gap === 1 ? "✓ ADJACENT" : gap <= 3 ? "near" : "far";
    console.log(`  swatch ${z}: ${pair.new}@${iNew}  ${pair.anchor}@${iAnc}  gap=${gap}  ${flag}`);
    if (gap === 1) bestFound = true;
  }
  console.log(bestFound ? `  → pairing OK on at least one filter` : `  → pairing FAILED on every filter`);
}

await browser.close();
console.log("\ndone");
