import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
const page = await ctx.newPage();
await page.goto("https://thegarden.art/exhibitions/split-logic", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForSelector(".piece-grid", { timeout: 30000 });
await page.evaluate(() => document.querySelector(".piece-grid")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(2500);

async function dumpVisible(label) {
  const ids = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".piece-cell")).map((c) => {
      const src = c.getAttribute("data-zoom-src") ?? c.querySelector("video")?.currentSrc ?? c.querySelector("video")?.src ?? "";
      const m = src.match(/sl-(\d+)/);
      return m ? `sl-${m[1]}` : "??";
    });
  });
  console.log(`${label}: ${ids.join(", ")}`);
}

await dumpVisible("default");

const nSwatch = await page.locator(".sl-palette-cell").count();
for (let i = 0; i < nSwatch; i++) {
  await page.locator(".sl-palette-cell").nth(i).click({ force: true });
  await page.waitForTimeout(800);
  await dumpVisible(`zone-${i+1}`);
}

await browser.close();
