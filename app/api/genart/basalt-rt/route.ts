import { NextResponse, type NextRequest } from "next/server";

/**
 * Same-origin proxy for Itsgalo's BASALT RT genart bundle.
 *
 * The hero iframe + 3 explore-row iframes all reference the same
 * upstream IPFS bundle. Loaded direct from `ipfs.verse.works`, each
 * iframe pulls its own ~2MB copy across the network — and the IPFS
 * gateway is slow. Proxying through our origin and module-caching
 * the upstream HTML once per server instance turns the 2nd–4th
 * requests into in-memory serves.
 *
 * `<base href>` is injected at the top of <head> so the bundle's
 * relative resource URLs (sketch.js, fragment shaders, etc.) still
 * resolve to the IPFS gateway — only the index.html is proxied.
 */
const UPSTREAM_BASE =
  "https://ipfs.verse.works/ipfs/QmcorKQ1nT5c9QTrY4tMAafVQ3uC1VwQpQ4zJhz1fcb8PA/";

const BASE_TAG = `<base href="${UPSTREAM_BASE}">`;

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
  html = html.includes("<head>")
    ? html.replace("<head>", `<head>${BASE_TAG}`)
    : BASE_TAG + html;
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
