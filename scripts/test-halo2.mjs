// Tighter repro. Open the page-wide ZoomCatcher lightbox by clicking
// the hero video directly (avoids piece-grid timing). Arrow through
// a few pieces. Close. Scroll back and grab a HIGH-RES screenshot of
// the hero anchor so I can actually see whether the halo is gone.

import { chromium } from "playwright";

const URL = "https://thegarden.art/exhibitions/split-logic";
const browser = await chromium.launch({ channel: "chrome" });

async function run(width, height, prefix) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2, // retina — keeps the halo visible if it's subtle
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  // Wait for the hero video to actually mount + play
  await page.waitForSelector(".ex-hero-plate video", { timeout: 30000 });
  await page.waitForTimeout(2500);

  console.log(`[${prefix}] click hero video to open lightbox`);
  await page.locator(".ex-hero-plate video").first().click({ force: true });
  // Wait for the lightbox modal to appear (.piece-grid-overlay)
  await page.waitForSelector(".piece-grid-overlay", { timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `/tmp/halo2-${prefix}-modal-opened.png` });

  console.log(`[${prefix}] arrow right twice`);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(450);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/halo2-${prefix}-modal-paged.png` });

  console.log(`[${prefix}] close lightbox`);
  await page.keyboard.press("Escape");
  // Wait for the modal to fully unmount
  await page.waitForSelector(".piece-grid-overlay", { state: "detached", timeout: 5000 });
  await page.waitForTimeout(700);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(600);
  console.log(`[${prefix}] hero with anchor`);
  await page.screenshot({ path: `/tmp/halo2-${prefix}-hero-anchored.png` });

  // Also crop just the hero region for a close look at the edge
  const heroBox = await page.locator(".ex-hero").first().boundingBox();
  if (heroBox) {
    await page.screenshot({
      path: `/tmp/halo2-${prefix}-hero-cropped.png`,
      clip: heroBox,
    });
  }
  await ctx.close();
}

await run(1440, 900, "desktop");
await browser.close();
console.log("done");
