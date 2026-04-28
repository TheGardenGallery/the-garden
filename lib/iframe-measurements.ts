/**
 * Lookup baked-in iframe measurements produced by
 * `scripts/measure-iframes.ts`. Each measurement is the visible
 * artwork's bounding box inside the iframe, expressed as % of iframe
 * width (so CSS calc() works uniformly across axes — `margin-top: X%`
 * resolves against parent inline-size regardless of axis).
 *
 * Used to render figures with the correct CSS variables on first
 * paint so captions land at the artwork's actual bottom-left edge
 * without waiting for a runtime postMessage round trip.
 */
import measurements from "./data/iframe-measurements.generated.json";

export type IframeMeasurement = {
  url: string;
  /** Reference viewport size when the measurement was captured. */
  viewport: { width: number; height: number };
  /** Absolute pixel values relative to `viewport`. */
  px: {
    insetLeft: number;
    insetRight: number;
    insetTop: number;
    insetBottom: number;
    artWidth: number;
    artHeight: number;
  };
  /** Same values as % of `viewport.width` (intentionally width-percent
   *  for both axes, since CSS margin-top % is parent inline-size
   *  relative regardless of axis). Drop these straight into CSS
   *  calc() — they auto-scale at any runtime viewport. */
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

const map = measurements as Record<string, IframeMeasurement>;

export function getIframeMeasurement(url: string): IframeMeasurement | null {
  return map[url] ?? null;
}

/**
 * Build a CSS `style` object exposing both pixel and percent
 * representations of the cached measurement as CSS variables, plus
 * the reference viewport so callers can compute scale factors against
 * the runtime iframe size if they need to. Returns `undefined` when
 * no measurement is cached so callers fall back to runtime defaults.
 */
export function iframeMeasurementCssVars(
  url: string
): Record<string, string> | undefined {
  const m = getIframeMeasurement(url);
  if (!m) return undefined;
  return {
    // Reference viewport (px) the measurements were captured at.
    "--art-viewport-w": `${m.viewport.width}px`,
    "--art-viewport-h": `${m.viewport.height}px`,
    // Absolute pixel values from the reference viewport.
    "--art-inset-left-px": `${m.px.insetLeft.toFixed(2)}px`,
    "--art-inset-right-px": `${m.px.insetRight.toFixed(2)}px`,
    "--art-inset-top-px": `${m.px.insetTop.toFixed(2)}px`,
    "--art-inset-bottom-px": `${m.px.insetBottom.toFixed(2)}px`,
    "--art-width-px": `${m.px.artWidth.toFixed(2)}px`,
    "--art-height-px": `${m.px.artHeight.toFixed(2)}px`,
    // Scaleable percentages (of iframe width on both axes). These are
    // the canonical "use me in calc()" values.
    "--art-inset-left": `${m.percent.insetLeft.toFixed(2)}%`,
    "--art-inset-right": `${m.percent.insetRight.toFixed(2)}%`,
    "--art-inset-top": `${m.percent.insetTop.toFixed(2)}%`,
    "--art-inset-bottom": `${m.percent.insetBottom.toFixed(2)}%`,
    "--art-width": `${m.percent.artWidth.toFixed(2)}%`,
    "--art-height": `${m.percent.artHeight.toFixed(2)}%`,
  };
}
