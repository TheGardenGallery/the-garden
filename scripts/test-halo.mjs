// Drive the live Split Logic page through the halo repro flow and
// screenshot every state so we can see whether the backdrop change
// actually killed the ghost outline (and didn't introduce a new
// issue). Tests:
//
//   1. Initial hero (canonical, no anchor) — baseline.
//   2. Open modal lightbox via a piece-grid click.
//   3. Close lightbox and let the hero anchor render with its
//      blurred backdrop — the location of the original halo report.
//   4. Re-open the lightbox from the anchored hero.
//   5. Page through to a different artwork; close. Hero should
//      adopt the new piece.
//   6. Re-test at a narrower viewport so the artwork-to-backdrop
//      size ratio shrinks (worst case for the halo).
//
// Outputs to /tmp/halo-{n}.png so I can read them back.

import { chromium } from "playwright";

const URL = "https://thegarden.art/exhibitions/split-logic";
const browser = await chromium.launch({ channel: "chrome" });

async function shot(page, name) {
  const p = `/tmp/halo-${name}.png`;
  await page.screenshot({ path: p, fullPage: false });
  return p;
}

async function runAt(width, height, prefix) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error(`${prefix} pageerror:`, e.message));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(4500);

  console.log(`\n[${prefix}] viewport ${width}x${height}`);
  console.log(`[${prefix}] 1. canonical hero`);
  await shot(page, `${prefix}-01-canonical`);

  // Scroll to piece grid
  await page.evaluate(() => {
    document.querySelector(".piece-grid")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(800);
  await shot(page, `${prefix}-02-grid`);

  // Click a piece-grid cell to open the lightbox
  console.log(`[${prefix}] 2. open lightbox via grid click`);
  const cellClicked = await page.evaluate(() => {
    const cells = document.querySelectorAll(".piece-cell");
    if (cells.length === 0) return false;
    cells[4]?.click();
    return true;
  });
  if (!cellClicked) {
    console.warn(`[${prefix}] no piece cells found`);
    await ctx.close();
    return;
  }
  await page.waitForTimeout(1500);
  await shot(page, `${prefix}-03-lightbox-opened`);

  // Press right arrow twice
  console.log(`[${prefix}] 3. arrow nav inside lightbox`);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(800);
  await shot(page, `${prefix}-04-lightbox-after-arrows`);

  // Close
  console.log(`[${prefix}] 4. close lightbox`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);

  // Scroll to top to see the hero with anchor
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(800);
  console.log(`[${prefix}] 5. hero with anchor backdrop`);
  await shot(page, `${prefix}-05-hero-anchored`);

  await ctx.close();
}

await runAt(1440, 900, "desktop");
await runAt(820, 1180, "tablet");
await runAt(414, 900, "mobile");

await browser.close();
console.log("\ndone");
