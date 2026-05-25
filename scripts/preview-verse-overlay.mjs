// Apply Verse's `rgba(34,34,34,0.8)` flat-dim overlay to the banner
// so we can see how it'll actually land in their UI before uploading.
// Source stays untouched; preview is a separate file.
//
// Uses Playwright instead of sharp because sharp's native binding
// didn't survive the local install here.

import { chromium } from "playwright";
import { readFileSync } from "fs";

const SRC = "/tmp/verse-banner.png";
const OUT = "/tmp/verse-banner-as-rendered-by-verse.png";

const WIDTH = 2400;
const HEIGHT = 480;

const banner = readFileSync(SRC).toString("base64");

const html = `<!doctype html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    background: #000;
  }
  .frame {
    position: relative;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(0deg, rgba(34, 34, 34, 0.8) 0%, rgba(34, 34, 34, 0.8) 100%),
      url("data:image/png;base64,${banner}");
    background-size: auto, cover;
    background-position: 0% 0%, 50% 50%;
  }
</style>
</head>
<body><div class="frame"></div></body>
</html>`;

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: OUT, type: "png" });
await browser.close();
console.log(`Preview: ${OUT}`);
