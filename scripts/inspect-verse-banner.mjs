// Deeper inspector: find any element near the top whose computed
// background-image is a real URL (not "none"). That's almost
// certainly the banner. Report each candidate's bounding rect, the
// image URL, and probe the underlying image's natural dimensions
// separately.

import { chromium } from "playwright";

const VIEWPORTS = [
  { name: "wide", w: 2560, h: 1440 },
  { name: "desktop", w: 1440, h: 900 },
  { name: "mobile", w: 414, h: 896 },
];

const browser = await chromium.launch({ channel: "chrome" });

for (const v of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: v.w, height: v.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto("https://verse.works/zancan", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(2000);

  const candidates = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      const bi = cs.backgroundImage;
      if (!bi || bi === "none") return;
      const r = el.getBoundingClientRect();
      if (r.top > 700 || r.width < window.innerWidth * 0.6) return;
      out.push({
        tag: el.tagName.toLowerCase(),
        className: el.className,
        bgImage: bi,
        bgSize: cs.backgroundSize,
        bgPosition: cs.backgroundPosition,
        top: Math.round(r.top),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
      });
    });
    return out;
  });

  console.log(`---${v.name} (${v.w}×${v.h})---`);
  console.log(JSON.stringify(candidates, null, 2));
  await page.screenshot({
    path: `/tmp/verse-zancan-${v.name}-full.png`,
    fullPage: false,
  });
  await ctx.close();
}

await browser.close();
console.log("done");
