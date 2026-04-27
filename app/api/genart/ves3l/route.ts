import { NextResponse, type NextRequest } from "next/server";

/**
 * Same-origin proxy for VES3L's Solve-Un-Solve genart bundle.
 *
 * The piece is interactive by design: the puzzle waits for a pointer
 * event on the canvas before it begins solving. Cross-origin embeds
 * can't dispatch synthetic events into the iframe, so we tunnel the
 * S3 bundle through our own domain and inject a tiny kickstart script
 * that fires a synthetic pointer/click cycle on the canvas once it's
 * mounted. The genart's listeners don't check `isTrusted`, so the
 * synthetic events trip the same code paths a real click would.
 *
 * Query params:
 *   payload  (required) — base64-encoded JSON the upstream genart reads.
 *   lock     (optional) — when "1", deterministically seed Math.random
 *                         from the payload's hash so the artwork looks
 *                         identical across reloads. Hero variants leave
 *                         this off so they re-roll on refresh; inline
 *                         editions set it on so they read as fixed
 *                         "specimens" of the series.
 *   fit      (optional) — when "1", zero body margin/padding and force
 *                         any canvas to fill its parent. Used by the
 *                         artists-grid hover preview where the iframe
 *                         is surrounded by the page background (not the
 *                         exhibition's "paper" theme) and the bundle's
 *                         body whitespace would show as a white border
 *                         around the artwork's cream canvas.
 *
 * The upstream HTML is ~2MB but fully self-contained (no external
 * resource fetches), so a straight pass-through works without base-URL
 * rewriting. CDN-cached aggressively per (payload, lock) pair.
 */
const UPSTREAM_BASE =
  "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/ves3l-v3/index.html";

const FILL_RESET = `
<style>
  html, body { margin: 0 !important; padding: 0 !important; background: transparent !important; width: 100% !important; height: 100% !important; overflow: hidden !important; }
  canvas { display: block !important; width: 100% !important; height: 100% !important; max-width: 100% !important; max-height: 100% !important; margin: 0 !important; padding: 0 !important; }
</style>
`;

/**
 * Cap devicePixelRatio at 1 inside the preview iframe. On retina the
 * bundle would otherwise size its canvas buffer at 2× per axis (4×
 * pixel count). Capping at 1 keeps the buffer aligned with CSS
 * pixels — sharp at preview scale, 4× less per-frame work than
 * native retina. Only injected when `fit=1` so the exhibition hero
 * keeps full crispness.
 */
const DPR_CAP = `
<script>
(function(){
  try {
    Object.defineProperty(window, 'devicePixelRatio', { get: function(){ return 1; }, configurable: true });
  } catch(e) {}
})();
</script>
`;

const KICKSTART = `
<script>
(function(){
  function fireAt(target, x, y){
    var pointerOpts = { bubbles:true, cancelable:true, view:window, clientX:x, clientY:y, button:0, buttons:1, pointerType:'mouse', isPrimary:true, pointerId:1 };
    var mouseOpts = { bubbles:true, cancelable:true, view:window, clientX:x, clientY:y, button:0, buttons:1 };
    try { target.dispatchEvent(new PointerEvent('pointerdown', pointerOpts)); } catch(e){}
    target.dispatchEvent(new MouseEvent('mousedown', mouseOpts));
    try { target.dispatchEvent(new PointerEvent('pointerup', Object.assign({}, pointerOpts, { buttons:0 }))); } catch(e){}
    target.dispatchEvent(new MouseEvent('mouseup', Object.assign({}, mouseOpts, { buttons:0 })));
    target.dispatchEvent(new MouseEvent('click', mouseOpts));
  }
  function kickstart(){
    var canvas = document.querySelector('canvas');
    if (!canvas) return false;
    var r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    fireAt(canvas, x, y);
    fireAt(document, x, y);
    fireAt(window, x, y);
    return true;
  }
  function tryUntilReady(remaining){
    if (kickstart()) return;
    if (remaining <= 0) return;
    setTimeout(function(){ tryUntilReady(remaining - 1); }, 150);
  }
  function start(){ tryUntilReady(40); }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
</script>
`;


/**
 * When `lock=1`, monkey-patch Math.random with a deterministic PRNG
 * (mulberry32) seeded from the payload's hash. Injected into <head>
 * so it lands BEFORE the genart's body script runs and therefore
 * before any Math.random calls happen during initial scramble/camera
 * setup.
 */
const SEED_LOCK = `
<script>
(function(){
  try {
    var params = new URLSearchParams(location.search);
    var payloadRaw = params.get('payload');
    if (!payloadRaw) return;
    var hash;
    try {
      var json = JSON.parse(atob(payloadRaw));
      hash = json.hash;
    } catch(e) { return; }
    if (!hash) return;
    function xmur3(str){
      var h = 1779033703 ^ str.length;
      for (var i = 0; i < str.length; i++){
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
      }
      return function(){
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        h ^= h >>> 16;
        return h >>> 0;
      };
    }
    function mulberry32(a){
      return function(){
        a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    var seed = xmur3(hash)();
    var rng = mulberry32(seed);
    Math.random = rng;
  } catch(e) {}
})();
</script>
`;

// Module-cached upstream HTML. The S3 index.html is identical for every
// payload — the bundle reads its payload client-side from the iframe's
// own location.search at runtime, so the upstream document doesn't vary.
// Caching it once per server instance turns each refresh-button click
// from "fetch 2MB from S3" into "serve from memory + stream to client",
// which is the dominant cost when each unique hash mints a new URL the
// CDN can't reuse.
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
  const lock = params.get("lock") === "1";
  const fit = params.get("fit") === "1";
  if (!payload) {
    return new NextResponse("missing payload", { status: 400 });
  }
  let html: string;
  try {
    html = await getUpstreamHtml();
  } catch {
    return new NextResponse("upstream fetch failed", { status: 502 });
  }
  if (lock) {
    html = html.includes("</head>")
      ? html.replace("</head>", `${SEED_LOCK}</head>`)
      : SEED_LOCK + html;
  }
  if (fit) {
    // DPR cap goes BEFORE FILL_RESET (and therefore before the body
    // script runs) so the bundle reads the capped value when it sizes
    // its canvas buffer. Wrong order = full-resolution buffer and the
    // perf win is lost.
    const inject = DPR_CAP + FILL_RESET;
    html = html.includes("</head>")
      ? html.replace("</head>", `${inject}</head>`)
      : inject + html;
  }
  html = html.includes("</body>")
    ? html.replace("</body>", `${KICKSTART}</body>`)
    : html + KICKSTART;
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
