// Generate the Verse gallery header banner for The Garden.
//
// Renders the canonical THE G△RDEN wordmark on a near-black ground
// with a whisper-faint phosphor lattice. Designed against the actual
// constraints of Verse's UI — measured by inspecting their gallery
// pages (see inspect-verse-banner.mjs):
//
//   • Container height is fixed (280 desktop / 220 mobile); width
//     fills viewport; `background-size: cover` crops to fit.
//   • Image CDN tops out at w2400 — larger uploads get downscaled.
//   • Verse layers a flat `rgba(34,34,34,0.8)` over the banner, so
//     bright source colour comes through at ~20% intensity. The
//     wordmark will read as mid-gray in their UI; that's their
//     house aesthetic across every gallery.
//   • Mobile shows roughly the centre 38% of the image horizontally
//     — so the wordmark must live inside that safe column.
//
// Output: /tmp/verse-banner.png at 2400×480 (5:1). Move it wherever
// Verse uploads from.
//
//   node scripts/build-verse-banner.mjs

import { chromium } from "playwright";
import { readFileSync } from "fs";
import path from "path";

const WIDTH = 2400;
const HEIGHT = 480;

const FONT_PATH = path.join(process.cwd(), "public/fonts/Inter-700.woff");
const fontB64 = readFileSync(FONT_PATH).toString("base64");
const fontDataUri = `data:font/woff;base64,${fontB64}`;

// Phosphor lattice — same opacity stack the Split Logic exhibition
// page uses. After Verse's 80% dim it lands near invisible; that's
// fine, it's a "felt not seen" texture and the wordmark is the
// focus. Encoded once via URL-component since the SVG sits inline
// in a CSS url() value.
const LATTICE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>` +
    `<circle cx='20' cy='20' r='4' fill='%23e8f8f8' opacity='0.006'/>` +
    `<circle cx='20' cy='20' r='2.5' fill='%23e8f8f8' opacity='0.013'/>` +
    `<circle cx='20' cy='20' r='1.6' fill='%23e8f8f8' opacity='0.028'/>` +
    `<circle cx='20' cy='20' r='1' fill='%23e8f8f8' opacity='0.07'/>` +
    `<circle cx='20' cy='20' r='0.7' fill='%23e8f8f8' opacity='0.28'/>` +
    `</svg>`,
);

// Wordmark sized to fit the mobile safe zone (~912px = 38% of 2400).
// At 140px Inter Bold uppercase, "THE GARDEN" runs ~720px wide with
// the triangle inline — comfortably inside the safe column on every
// viewport Verse renders.
const FONT_SIZE = 140;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'Inter';
    src: url('${fontDataUri}') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    background: #000;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    background-image: url("data:image/svg+xml;utf8,${LATTICE_SVG}");
    background-size: 40px 40px;
    background-position: 50% 50%;
    /* Grayscale AA — subpixel AA produces a faint colour fringe
       around text on dark grounds that reads as smudge at this
       scale. Grayscale keeps the wordmark's edges clean. */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .logo {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: ${FONT_SIZE}px;
    /* -0.4px at 20.9px on the homepage = -0.019em; preserve the
       same relative tracking at this scale. */
    letter-spacing: -2.66px;
    text-transform: uppercase;
    color: rgba(232, 248, 248, 0.95);
    line-height: 1;
    display: inline-block;
  }
  .triangle {
    display: inline-block;
    width: 0.73em;
    height: 0.73em;
    vertical-align: baseline;
    line-height: 1;
    margin: 0 0.02em 0 -0.05em;
    position: relative;
    top: 0;
  }
  .triangle svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    color: inherit;
  }
</style>
</head>
<body>
  <div class="logo">
    <span>THE </span>G<span class="triangle"><svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 0 L100 100 L0 100 Z M50 46 L67 79 L33 79 Z" fill="currentColor" fill-rule="evenodd"/></svg></span>RDEN
  </div>
</body>
</html>`;

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);

const outPath = "/tmp/verse-banner.png";
await page.screenshot({ path: outPath, type: "png", omitBackground: false });
await browser.close();
console.log(`Banner: ${outPath} (${WIDTH}×${HEIGHT})`);
