import { NextResponse, type NextRequest } from "next/server";

/**
 * Same-origin proxy for Itsgalo's Verse genart bundle, used by the
 * artists-grid hover preview. Two injections happen here:
 *
 *   1. CSS reset in <head> that zeroes the body's margin/padding/bg
 *      and forces any canvas to fill its parent. The bundle ships
 *      with whitespace baked into its body styling that shows as a
 *      thick white border around the artwork at hover-preview scale.
 *
 *   2. Synthetic-pointer kickstart at end-of-body so the piece begins
 *      animating without needing a real user click — same trick we
 *      use for the VES3L hero, since cross-origin embeds can't
 *      dispatch synthetic events from the parent page.
 */
const UPSTREAM_BASE =
  "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/itsgalo-jun-2024-v4/index.html";

/* Itsgalo's bundle is a small HTML loader that pulls `style.css` and
   `script.js` via RELATIVE paths, so a naive proxy breaks them
   (relative URLs resolve to OUR domain). A <base> tag pointing at
   the upstream directory keeps those relative fetches resolving
   against S3 instead. Must come before any other <head> resource. */
const UPSTREAM_DIR =
  "https://public-bucket-verse-dev.s3.eu-west-1.amazonaws.com/genart/itsgalo-jun-2024-v4/";
const BASE_TAG = `<base href="${UPSTREAM_DIR}">`;

const FILL_RESET = `
<style>
  html, body { margin: 0 !important; padding: 0 !important; background: transparent !important; width: 100% !important; height: 100% !important; overflow: hidden !important; }
  canvas { display: block !important; width: 100% !important; height: 100% !important; max-width: 100% !important; max-height: 100% !important; margin: 0 !important; padding: 0 !important; }
</style>
`;

/**
 * No DPR cap. The persistent-iframe strategy in PlotGrid means the
 * bundle is mounted once on page load and stays mounted, so the
 * "first paint at hover time" cost that motivated the original cap
 * is gone. Capping below native DPR was upscaling the canvas on
 * retina and showing as visible pixelation. Sandbox isolates this
 * iframe to its own process, so the higher-resolution shader work
 * doesn't compete with the parent's main thread.
 */

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

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const payload = params.get("payload");
  if (!payload) {
    return new NextResponse("missing payload", { status: 400 });
  }
  const upstream = await fetch(
    `${UPSTREAM_BASE}?payload=${encodeURIComponent(payload)}`,
    { cache: "force-cache" },
  );
  if (!upstream.ok) {
    return new NextResponse("upstream fetch failed", { status: 502 });
  }
  let html = await upstream.text();
  // <base> goes immediately after <head> so relative resource URLs
  // (./style.css, ./script.js) are resolved against the upstream
  // directory before any of them are encountered by the parser.
  html = html.includes("<head>")
    ? html.replace("<head>", `<head>${BASE_TAG}`)
    : BASE_TAG + html;
  html = html.includes("</head>")
    ? html.replace("</head>", `${FILL_RESET}</head>`)
    : FILL_RESET + html;
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
