import type { Exhibition } from "@/lib/types";

type Details = NonNullable<Exhibition["details"]>;
type Crop = Details["crops"][number];

/**
 * Hi-fidelity detail crops of a single work, rendered as a grid of
 * zoomed regions derived from one source image via CSS
 * background-position + background-size.
 *
 * Crop rigor: `background-position: X% Y%` aligns the source's X/Y
 * point with the viewport's X/Y point, so the authored {x,y} is the
 * edge of the visible window at 0/100 and center at 50. We reinterpret
 * the data as "focal point in image coordinates" and convert to the
 * correct background-position, then clamp to an `artworkInset` so the
 * matte/bleed can never leak in.
 */
export function ExhibitionDetails({ details, title }: { details: Details; title: string }) {
  const aspect = details.aspectRatio ?? "1";
  const inset = {
    top: details.artworkInset?.top ?? 0,
    right: details.artworkInset?.right ?? 0,
    bottom: details.artworkInset?.bottom ?? 0,
    left: details.artworkInset?.left ?? 0,
  };

  return (
    <section className="ex-details" aria-labelledby="detailsHead">
      <div className="ex-details-inner">
        <header className="ex-details-head">
          <h2 className="ex-details-head-title" id="detailsHead">
            Details
          </h2>
          {details.title && (
            <p className="ex-details-subtitle">
              {details.verseUrl ? (
                <a
                  href={details.verseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ex-details-subtitle-link"
                >
                  <em>{details.title}</em>
                </a>
              ) : (
                <em>{details.title}</em>
              )}
            </p>
          )}
        </header>
        <div className="ex-details-grid">
          {details.crops.map((c) => {
            const { bgX, bgY } = resolveCrop(c, inset);
            return (
              <figure
                key={c.id}
                className="ex-detail-crop"
                style={
                  {
                    aspectRatio: aspect,
                    backgroundImage: `url(${details.sourceImage})`,
                    backgroundSize: `${c.zoom * 100}%`,
                    backgroundPosition: `${bgX}% ${bgY}%`,
                  } as React.CSSProperties
                }
                role="img"
                aria-label={`${title}, detail${c.caption ? ` — ${c.caption}` : ""}`}
              >
                {c.caption && (
                  <figcaption className="ex-detail-caption">{c.caption}</figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Convert an authored {x, y, zoom} — where x/y is the focal point
 * in *image coordinates* (0 = left/top edge of source, 100 = right/
 * bottom edge) — into a CSS background-position value that keeps the
 * visible window fully inside the artwork inset.
 *
 * The viewport window width at zoom Z is 100/Z percent of the source.
 * The focal point becomes window-centered when we align image X with
 * viewport 50, which requires background-position X% where:
 *   X = (focal - 50/Z) / (100 - 100/Z) * 100
 * (derived from the background-position percentage identity).
 * We then clamp focal to [inset + 50/Z, 100 - insetOpposite - 50/Z]
 * so the window cannot extend into the matte.
 */
function resolveCrop(c: Crop, inset: { top: number; right: number; bottom: number; left: number }) {
  const halfWindow = 50 / c.zoom;
  const minX = inset.left + halfWindow;
  const maxX = 100 - inset.right - halfWindow;
  const minY = inset.top + halfWindow;
  const maxY = 100 - inset.bottom - halfWindow;

  const focalX = clamp(c.x, Math.min(minX, maxX), Math.max(minX, maxX));
  const focalY = clamp(c.y, Math.min(minY, maxY), Math.max(minY, maxY));

  const denom = 100 - 100 / c.zoom;
  const bgX = denom === 0 ? 50 : ((focalX - halfWindow) / denom) * 100;
  const bgY = denom === 0 ? 50 : ((focalY - halfWindow) / denom) * 100;
  return { bgX, bgY };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
