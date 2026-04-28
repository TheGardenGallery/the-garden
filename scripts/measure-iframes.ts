/**
 * Measure-iframes — playwright + SQLite cache for genart-iframe
 * bounding rects.
 *
 * For each iframe URL in `lib/data/exhibitions.ts`, launch headless
 * Chromium, load the upstream genart bundle, wait for the canvas to
 * render, run a pixel-scan to find the visible artwork's bounding box,
 * and persist the measurement to `data/iframe-measurements.sqlite`.
 * On completion, export to `lib/data/iframe-measurements.generated.json`
 * which the app imports at build time so figures render with the
 * correct CSS variables on first paint (no runtime postMessage round
 * trip required).
 *
 * Run: `npm run measure-iframes`
 */
import { chromium } from "playwright";
import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";
import { exhibitions } from "../lib/data/exhibitions";

const ROOT = path.resolve(__dirname, "..");
const SQLITE_PATH = path.join(ROOT, "data/iframe-measurements.sqlite");
const JSON_PATH = path.join(ROOT, "lib/data/iframe-measurements.generated.json");

const AUTOSCOPE_IPFS_BASE =
  "https://verse-public-gateway.myfilebase.com/ipfs/Qma2KocxztncRkFiSKS1PUE47xZ4bP8fHd4FzEKW9z4xaZ/";
const BASALT_RT_IPFS_BASE =
  "https://ipfs.verse.works/ipfs/QmcorKQ1nT5c9QTrY4tMAafVQ3uC1VwQpQ4zJhz1fcb8PA/";

type Measurement = {
  url: string;
  /** Viewport size used at measurement time. All `px` values are
   *  relative to this viewport; `percent` values are normalized so
   *  they re-scale at any runtime viewport. */
  viewport: { width: number; height: number };
  /** Absolute pixel values measured at the reference viewport above.
   *  Use these when you need raw scale (rendering, scaling math). */
  px: {
    insetLeft: number;
    insetRight: number;
    insetTop: number;
    insetBottom: number;
    artWidth: number;
    artHeight: number;
  };
  /** Same values expressed as % of viewport WIDTH on both axes —
   *  intentionally width-percent for both X and Y because CSS
   *  `margin-top: X%` resolves against parent inline-size (width)
   *  regardless of axis. Drop these directly into CSS calc(). */
  percent: {
    insetLeft: number;
    insetRight: number;
    insetTop: number;
    insetBottom: number;
    artWidth: number;
    artHeight: number;
  };
  measuredAt: string;
};

/**
 * Resolve a data-file iframe URL to a measurable upstream URL. App
 * URLs (`/api/genart/...`) need to be mapped to the upstream they
 * proxy. Absolute URLs pass through.
 */
function resolveUrl(url: string): string | null {
  if (url.startsWith("/api/genart/autoscope")) {
    const search = url.split("?")[1] ?? "";
    const payload = new URLSearchParams(search).get("payload");
    if (!payload) return null;
    return `${AUTOSCOPE_IPFS_BASE}?payload=${encodeURIComponent(payload)}`;
  }
  if (url.startsWith("/api/genart/basalt-rt")) {
    const search = url.split("?")[1] ?? "";
    const payload = new URLSearchParams(search).get("payload");
    if (!payload) return null;
    return `${BASALT_RT_IPFS_BASE}?payload=${encodeURIComponent(payload)}`;
  }
  // Verse's "over-time-final" bundle doesn't paint to <canvas> (it
  // composites video/SVG), so the canvas-wait would always time out.
  // Skip cleanly rather than burning the 20s timeout per URL.
  if (url.includes("over-time-final")) return null;
  if (url.startsWith("http")) return url;
  return null;
}

async function main() {
  fs.mkdirSync(path.dirname(SQLITE_PATH), { recursive: true });
  const db = new Database(SQLITE_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS iframe_measurements (
      url TEXT PRIMARY KEY,
      viewport_w_px REAL NOT NULL,
      viewport_h_px REAL NOT NULL,
      inset_left_px REAL NOT NULL,
      inset_right_px REAL NOT NULL,
      inset_top_px REAL NOT NULL,
      inset_bottom_px REAL NOT NULL,
      art_width_px REAL NOT NULL,
      art_height_px REAL NOT NULL,
      inset_left_pct REAL NOT NULL,
      inset_right_pct REAL NOT NULL,
      inset_top_pct REAL NOT NULL,
      inset_bottom_pct REAL NOT NULL,
      art_width_pct REAL NOT NULL,
      art_height_pct REAL NOT NULL,
      measured_at TEXT NOT NULL
    )
  `);

  const urls = new Set<string>();
  for (const ex of exhibitions) {
    if (ex.heroIframe) urls.add(ex.heroIframe);
    for (const group of ex.inlineArtworks ?? []) {
      for (const item of group.items) {
        if (item.iframe) urls.add(item.iframe);
      }
    }
    for (const item of ex.exploreArtworks ?? []) {
      if (item.iframe) urls.add(item.iframe);
    }
  }

  // Viewport sized to a typical inline-iframe footprint (autoscope's
  // .ex-inline-iframe at 707×471, aspect 1.5). Cream insets are
  // expressed as percentages of viewport width so they translate at
  // runtime regardless of the actual rendered iframe size.
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 707, height: 471 },
  });
  // tsx/esbuild wraps named function expressions with `__name()` for
  // stack-trace identity. When we serialise functions into
  // `page.evaluate`, those `__name` references travel with the code
  // but the helper itself is left behind in node-land. Polyfill a
  // no-op into every page so the transformed code runs.
  await context.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__name = <T>(fn: T, _name?: string) => fn;
  });

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO iframe_measurements
    (url, viewport_w_px, viewport_h_px,
     inset_left_px, inset_right_px, inset_top_px, inset_bottom_px,
     art_width_px, art_height_px,
     inset_left_pct, inset_right_pct, inset_top_pct, inset_bottom_pct,
     art_width_pct, art_height_pct,
     measured_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const url of urls) {
    const measureUrl = resolveUrl(url);
    if (!measureUrl) {
      console.log(`SKIP   ${url.slice(0, 80)}…`);
      continue;
    }
    console.log(`MEASURE ${url.slice(0, 80)}…`);
    const page = await context.newPage();
    try {
      await page.goto(measureUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      // Wait for the bundle to mount the canvas at non-zero size.
      // 20s is enough for IPFS-cold loads; longer mostly catches dead
      // URLs we'd want to skip anyway.
      await page.waitForFunction(
        () => {
          const c = document.querySelector("canvas");
          return c instanceof HTMLCanvasElement && c.width > 0;
        },
        { timeout: 20000 }
      );
      // Extra paint settle — generative bundles sometimes render
      // background then artwork over a few frames.
      await page.waitForTimeout(1000);

      // The bundle is animated — single-frame pixel-scans capture
      // whatever fraction of the artwork happens to be painted at that
      // instant. To find the artwork's UNION extent (the smallest box
      // that contains the visible art across the entire animation),
      // sample N frames over T seconds and take min(top), max(bottom),
      // min(left), max(right) across all samples.
      const FRAME_SAMPLES = 24;
      const SAMPLE_INTERVAL_MS = 200;

      const measurement = await page.evaluate(
        async ({ samples, intervalMs }) => {
          const canvas = document.querySelector("canvas");
          if (!(canvas instanceof HTMLCanvasElement)) return null;
          const canvasRect = canvas.getBoundingClientRect();
          const iw = window.innerWidth;
          const ih = window.innerHeight;
          const w = canvas.width;
          const h = canvas.height;
          if (w === 0 || h === 0) return null;

          // Reusable off-screen 2d for pixel reads.
          const off = document.createElement("canvas");
          off.width = w;
          off.height = h;
          const ctx = off.getContext("2d");
          if (!ctx) {
            return {
              artLeft: canvasRect.left,
              artTop: canvasRect.top,
              artRight: canvasRect.right,
              artBottom: canvasRect.bottom,
              iw,
              ih,
              tainted: true,
              samples: 0,
            };
          }

          // Reference cream color from corner pixels of the very first
          // sample. Re-using the same reference across frames means we
          // detect "non-cream" consistently.
          ctx.drawImage(canvas, 0, 0);
          let firstData: Uint8ClampedArray;
          try {
            firstData = ctx.getImageData(0, 0, w, h).data;
          } catch {
            return {
              artLeft: canvasRect.left,
              artTop: canvasRect.top,
              artRight: canvasRect.right,
              artBottom: canvasRect.bottom,
              iw,
              ih,
              tainted: true,
              samples: 0,
            };
          }
          const c1i = (2 * w + 2) * 4;
          const c2i = (2 * w + (w - 3)) * 4;
          const c3i = ((h - 3) * w + 2) * 4;
          const c4i = ((h - 3) * w + (w - 3)) * 4;
          const cr = Math.round(
            (firstData[c1i] +
              firstData[c2i] +
              firstData[c3i] +
              firstData[c4i]) /
              4
          );
          const cg = Math.round(
            (firstData[c1i + 1] +
              firstData[c2i + 1] +
              firstData[c3i + 1] +
              firstData[c4i + 1]) /
              4
          );
          const cb = Math.round(
            (firstData[c1i + 2] +
              firstData[c2i + 2] +
              firstData[c3i + 2] +
              firstData[c4i + 2]) /
              4
          );
          // Threshold tuned high enough to ignore the bundle's subtle
          // near-cream painting at canvas edges (which would otherwise
          // pull the bounding box out to nearly-full-iframe). RGB
          // sum-of-diffs against the corner cream — 240 means a pixel
          // must differ in at least one channel by ~80, i.e. visibly
          // not-cream, to count as artwork content.
          const T = 240;
          const STEP = 4;

          const scanFrame = (data: Uint8ClampedArray) => {
            const diff = (x: number, y: number) => {
              const i = (y * w + x) * 4;
              return (
                Math.abs(data[i] - cr) +
                Math.abs(data[i + 1] - cg) +
                Math.abs(data[i + 2] - cb)
              );
            };
            let top = h;
            let bottom = -1;
            let left = w;
            let right = -1;
            for (let y = 0; y < h; y += STEP) {
              for (let x = 0; x < w; x += STEP) {
                if (diff(x, y) > T) {
                  if (y < top) top = y;
                  if (y > bottom) bottom = y;
                  if (x < left) left = x;
                  if (x > right) right = x;
                }
              }
            }
            return top <= bottom && left <= right
              ? { top, bottom, left, right }
              : null;
          };

          // Union accumulator across all samples.
          let uTop = h;
          let uBottom = -1;
          let uLeft = w;
          let uRight = -1;
          let validSamples = 0;

          for (let n = 0; n < samples; n++) {
            try {
              ctx.drawImage(canvas, 0, 0);
              const data = ctx.getImageData(0, 0, w, h).data;
              const box = scanFrame(data);
              if (box) {
                if (box.top < uTop) uTop = box.top;
                if (box.bottom > uBottom) uBottom = box.bottom;
                if (box.left < uLeft) uLeft = box.left;
                if (box.right > uRight) uRight = box.right;
                validSamples++;
              }
            } catch {
              /* tainted — abort sampling, fall through to fallback */
              return {
                artLeft: canvasRect.left,
                artTop: canvasRect.top,
                artRight: canvasRect.right,
                artBottom: canvasRect.bottom,
                iw,
                ih,
                tainted: true,
                samples: validSamples,
              };
            }
            await new Promise((r) => setTimeout(r, intervalMs));
          }

          if (validSamples === 0) {
            return {
              artLeft: canvasRect.left,
              artTop: canvasRect.top,
              artRight: canvasRect.right,
              artBottom: canvasRect.bottom,
              iw,
              ih,
              tainted: false,
              samples: 0,
            };
          }

          // Convert canvas-pixel union to iframe display coords.
          const sx = canvasRect.width / w;
          const sy = canvasRect.height / h;
          return {
            artLeft: canvasRect.left + uLeft * sx,
            artTop: canvasRect.top + uTop * sy,
            artRight: canvasRect.left + uRight * sx,
            artBottom: canvasRect.top + uBottom * sy,
            iw,
            ih,
            tainted: false,
            samples: validSamples,
          };
        },
        { samples: FRAME_SAMPLES, intervalMs: SAMPLE_INTERVAL_MS }
      );

      if (!measurement) {
        console.log(`        no canvas found`);
        continue;
      }

      // Save raw px (relative to measurement viewport) AND % of
      // viewport width for both axes (% values re-scale at any
      // runtime viewport since they're inherently proportional;
      // px values capture the absolute scale at the reference
      // viewport).
      const px = {
        insetLeft: measurement.artLeft,
        insetRight: measurement.iw - measurement.artRight,
        insetTop: measurement.artTop,
        insetBottom: measurement.ih - measurement.artBottom,
        artWidth: measurement.artRight - measurement.artLeft,
        artHeight: measurement.artBottom - measurement.artTop,
      };
      const pct = {
        insetLeft: (px.insetLeft / measurement.iw) * 100,
        insetRight: (px.insetRight / measurement.iw) * 100,
        insetTop: (px.insetTop / measurement.iw) * 100,
        insetBottom: (px.insetBottom / measurement.iw) * 100,
        artWidth: (px.artWidth / measurement.iw) * 100,
        artHeight: (px.artHeight / measurement.iw) * 100,
      };

      insertStmt.run(
        url,
        measurement.iw,
        measurement.ih,
        px.insetLeft,
        px.insetRight,
        px.insetTop,
        px.insetBottom,
        px.artWidth,
        px.artHeight,
        pct.insetLeft,
        pct.insetRight,
        pct.insetTop,
        pct.insetBottom,
        pct.artWidth,
        pct.artHeight,
        new Date().toISOString()
      );
      console.log(
        `        px: L${px.insetLeft.toFixed(0)} R${px.insetRight.toFixed(
          0
        )} T${px.insetTop.toFixed(0)} B${px.insetBottom.toFixed(
          0
        )} W${px.artWidth.toFixed(0)} H${px.artHeight.toFixed(0)} (${
          measurement.samples
        } samples${measurement.tainted ? ", tainted" : ""})`
      );
      console.log(
        `        pct: L${pct.insetLeft.toFixed(
          1
        )}% R${pct.insetRight.toFixed(1)}% T${pct.insetTop.toFixed(
          1
        )}% B${pct.insetBottom.toFixed(1)}% W${pct.artWidth.toFixed(
          1
        )}% H${pct.artHeight.toFixed(1)}%`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`        ERROR ${msg.slice(0, 80)}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Dump SQLite → JSON for the app to consume at build time.
  const rows = db
    .prepare("SELECT * FROM iframe_measurements")
    .all() as Array<{
    url: string;
    viewport_w_px: number;
    viewport_h_px: number;
    inset_left_px: number;
    inset_right_px: number;
    inset_top_px: number;
    inset_bottom_px: number;
    art_width_px: number;
    art_height_px: number;
    inset_left_pct: number;
    inset_right_pct: number;
    inset_top_pct: number;
    inset_bottom_pct: number;
    art_width_pct: number;
    art_height_pct: number;
    measured_at: string;
  }>;
  const json: Record<string, Measurement> = {};
  for (const r of rows) {
    json[r.url] = {
      url: r.url,
      viewport: { width: r.viewport_w_px, height: r.viewport_h_px },
      px: {
        insetLeft: r.inset_left_px,
        insetRight: r.inset_right_px,
        insetTop: r.inset_top_px,
        insetBottom: r.inset_bottom_px,
        artWidth: r.art_width_px,
        artHeight: r.art_height_px,
      },
      percent: {
        insetLeft: r.inset_left_pct,
        insetRight: r.inset_right_pct,
        insetTop: r.inset_top_pct,
        insetBottom: r.inset_bottom_pct,
        artWidth: r.art_width_pct,
        artHeight: r.art_height_pct,
      },
      measuredAt: r.measured_at,
    };
  }
  fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
  fs.writeFileSync(JSON_PATH, JSON.stringify(json, null, 2));
  console.log(`\nWrote ${rows.length} measurements to ${JSON_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
