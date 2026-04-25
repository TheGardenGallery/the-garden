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
 *
 * The upstream HTML is ~2MB but fully self-contained (no external
 * resource fetches), so a straight pass-through works without base-URL
 * rewriting. CDN-cached aggressively per (payload, lock) pair.
 */
const UPSTREAM_BASE =
  "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/ves3l-v3/index.html";

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

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const payload = params.get("payload");
  const lock = params.get("lock") === "1";
  if (!payload) {
    return new NextResponse("missing payload", { status: 400 });
  }
  const upstream = await fetch(
    `${UPSTREAM_BASE}?payload=${encodeURIComponent(payload)}`,
    { cache: "force-cache" }
  );
  if (!upstream.ok) {
    return new NextResponse("upstream fetch failed", { status: 502 });
  }
  let html = await upstream.text();
  if (lock) {
    html = html.includes("</head>")
      ? html.replace("</head>", `${SEED_LOCK}</head>`)
      : SEED_LOCK + html;
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
