import type { Exhibition } from "@/lib/types";

/**
 * Studio process record — themed as another instrument on the Split
 * Logic dashboard, not a generic BTS gallery. Section sits between
 * Ricky's annotated broadsheet and the colophon: editorial frame
 * closes (the works, the artist's note); the process film plays as a
 * coda before the credits.
 *
 * Only renders the `featured` clip (long-form process documentary —
 * native <video controls>, click-to-play). The shorter ambient loop
 * lives inline in the description prose instead (rendered by
 * TerminalDescription), so the coda has a single quiet anchor rather
 * than two competing plates.
 */
export function SplitLogicProcess({
  process,
}: {
  process: NonNullable<Exhibition["processVideos"]>;
}) {
  const { featured } = process;
  if (!featured) return null;

  return (
    <section className="sl-process" aria-label="Studio process record">
      <div className="sl-process-inner">
        <div className="sl-process-heading">log  ::  process</div>

        <figure className="sl-process-plate sl-process-plate--featured">
          {featured.label && (
            <div className="sl-process-readout">
              <span className="sl-process-readout-prefix">&gt;&gt;</span>
              <span className="sl-process-readout-label">{featured.label}</span>
              {featured.duration && (
                <span className="sl-process-readout-duration">
                  {featured.duration}
                </span>
              )}
            </div>
          )}
          <div className="sl-process-frame">
            {/* Native controls; click-to-play; preload metadata so the
                poster is visible and the seek bar accurate without
                pulling the whole 9 MB on mount. */}
            <video
              className="sl-process-video"
              src={featured.src}
              poster={featured.poster}
              controls
              preload="metadata"
              playsInline
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
