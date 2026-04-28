import { NextResponse, type NextRequest } from "next/server";

/**
 * Same-origin proxy for Erik Swahn's AUTOSCOPE genart bundle.
 *
 * Why: Erik's p5.js bundle randomizes both the canvas aspect-ratio
 * (`u.ratio` ∈ {1, 1.33, 1.42, 1.6, 1.75}) and the cream margin painted
 * inside the canvas (`u.margin` ∈ [0.08, 0.20]) per piece. When we
 * embed the canonical Verse URL cross-origin, we can't measure where
 * the visible artwork actually sits inside the iframe — captions end
 * up floating in cream-padded empty space.
 *
 * Proxying the bundle through our own origin lets us:
 *   1. Inject a `<base href>` so the bundle's relative resources
 *      (sketch.js, p5.min.js, fragment shaders) still load from the
 *      IPFS gateway.
 *   2. Inject a measurement script that, after the bundle paints,
 *      scans the canvas pixels for the visible artwork's bounding
 *      box (cream-vs-art) and `postMessage`s those coordinates to
 *      the parent so we can position the caption against them.
 *
 * Module-cached upstream HTML — the index.html is identical for every
 * payload, the bundle reads its hash from `location.search` at runtime.
 */
const UPSTREAM_BASE =
  "https://verse-public-gateway.myfilebase.com/ipfs/Qma2KocxztncRkFiSKS1PUE47xZ4bP8fHd4FzEKW9z4xaZ/";

const BASE_TAG = `<base href="${UPSTREAM_BASE}">`;

const MEASURE_SCRIPT = `
<script>
(function(){
  function attempt() {
    const canvas = document.querySelector('canvas');
    if (!canvas || canvas.width === 0 || canvas.height === 0) return false;
    const canvasRect = canvas.getBoundingClientRect();
    if (canvasRect.width === 0) return false;

    let artLeft = canvasRect.left;
    let artTop = canvasRect.top;
    let artRight = canvasRect.right;
    let artBottom = canvasRect.bottom;

    // Try pixel-scan for the visible artwork's bounding box. If the
    // canvas is tainted (cross-origin shaders/textures the bundle
    // pulled in), getImageData throws and we fall back to the canvas
    // rect alone with an estimated cream margin handled parent-side.
    try {
      const off = document.createElement('canvas');
      off.width = canvas.width;
      off.height = canvas.height;
      const ctx = off.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      const img = ctx.getImageData(0, 0, off.width, off.height);
      const data = img.data;
      const w = off.width, h = off.height;
      function px(x, y) {
        const i = (y * w + x) * 4;
        return [data[i], data[i+1], data[i+2]];
      }
      // Sample multiple corner pixels and take the most consistent
      // (the cream is the dominant background; corners are cream).
      const c1 = px(2, 2), c2 = px(w-3, 2), c3 = px(2, h-3), c4 = px(w-3, h-3);
      const cr = Math.round((c1[0] + c2[0] + c3[0] + c4[0]) / 4);
      const cg = Math.round((c1[1] + c2[1] + c3[1] + c4[1]) / 4);
      const cb = Math.round((c1[2] + c2[2] + c3[2] + c4[2]) / 4);
      const T = 40; // color-difference threshold
      function diff(x, y) {
        const i = (y * w + x) * 4;
        return Math.abs(data[i]-cr) + Math.abs(data[i+1]-cg) + Math.abs(data[i+2]-cb);
      }
      // Step in a coarse grid first, then refine — full scan of a
      // ~700px canvas is half a million px per axis.
      const STEP = 4;
      let top = 0, bottom = h-1, left = 0, right = w-1;
      topLoop: for (let y = 0; y < h; y += STEP) {
        for (let x = 0; x < w; x += STEP) {
          if (diff(x, y) > T) { top = y; break topLoop; }
        }
      }
      botLoop: for (let y = h-1; y >= 0; y -= STEP) {
        for (let x = 0; x < w; x += STEP) {
          if (diff(x, y) > T) { bottom = y; break botLoop; }
        }
      }
      leftLoop: for (let x = 0; x < w; x += STEP) {
        for (let y = top; y <= bottom; y += STEP) {
          if (diff(x, y) > T) { left = x; break leftLoop; }
        }
      }
      rightLoop: for (let x = w-1; x >= 0; x -= STEP) {
        for (let y = top; y <= bottom; y += STEP) {
          if (diff(x, y) > T) { right = x; break rightLoop; }
        }
      }
      // Convert canvas pixel coords → iframe display coords
      const sx = canvasRect.width / w;
      const sy = canvasRect.height / h;
      artLeft = canvasRect.left + left * sx;
      artTop = canvasRect.top + top * sy;
      artRight = canvasRect.left + right * sx;
      artBottom = canvasRect.top + bottom * sy;
    } catch (e) {
      // Canvas tainted — fall back to canvas bounding rect.
    }

    parent.postMessage({
      type: 'autoscope-art-rect',
      artLeft: artLeft,
      artTop: artTop,
      artRight: artRight,
      artBottom: artBottom,
      iframeWidth: window.innerWidth,
      iframeHeight: window.innerHeight,
    }, '*');
    return true;
  }
  function tryUntilReady(remaining) {
    if (attempt()) return;
    if (remaining <= 0) return;
    setTimeout(function(){ tryUntilReady(remaining - 1); }, 250);
  }
  function start() {
    // Wait a few frames for p5 to set up + paint, then start polling.
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ tryUntilReady(40); });
    });
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
</script>
`;

let cachedUpstreamHtml: string | null = null;
let cachedUpstreamPromise: Promise<string> | null = null;

async function getUpstreamHtml(): Promise<string> {
  if (cachedUpstreamHtml) return cachedUpstreamHtml;
  if (cachedUpstreamPromise) return cachedUpstreamPromise;
  cachedUpstreamPromise = (async () => {
    const upstream = await fetch(UPSTREAM_BASE, { cache: "force-cache" });
    if (!upstream.ok) {
      cachedUpstreamPromise = null;
      throw new Error(`upstream ${upstream.status}`);
    }
    const text = await upstream.text();
    cachedUpstreamHtml = text;
    cachedUpstreamPromise = null;
    return text;
  })();
  return cachedUpstreamPromise;
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const payload = params.get("payload");
  if (!payload) {
    return new NextResponse("missing payload", { status: 400 });
  }
  let html: string;
  try {
    html = await getUpstreamHtml();
  } catch {
    return new NextResponse("upstream fetch failed", { status: 502 });
  }
  // <base href> must land BEFORE the bundle's <script src="./..."> tags
  // so the relative resource URLs (sketch.js, p5.min.js, fragment
  // shaders) resolve to the IPFS gateway instead of /api/genart/.
  // Measurement script can sit at end of <head> like normal.
  html = html.includes("<head>")
    ? html.replace("<head>", `<head>${BASE_TAG}`)
    : BASE_TAG + html;
  html = html.includes("</head>")
    ? html.replace("</head>", `${MEASURE_SCRIPT}</head>`)
    : html + MEASURE_SCRIPT;
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
