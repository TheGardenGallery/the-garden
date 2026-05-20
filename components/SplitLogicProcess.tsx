import type { Exhibition } from "@/lib/types";
import { AutoPlayVideo } from "./AutoPlayVideo";

/**
 * Studio process record — themed as another instrument on the Split
 * Logic dashboard, not a generic BTS gallery. Section sits between
 * Ricky's annotated broadsheet and the colophon: editorial frame
 * closes (the works, the artist's note); the process docs play as a
 * coda before the credits.
 *
 *   LOG  ::  PROCESS
 *   ┌─────────────────────────────────┐
 *   │  >> capture_01 :: studio.film   │
 *   │  ┌───────────────────────────┐  │
 *   │  │   [featured film w/ ctrl] │  │
 *   │  └───────────────────────────┘  │
 *   └─────────────────────────────────┘
 *   ┌─────────────────────────────────┐
 *   │  >> capture_02 :: rmesh_pass    │
 *   │  ┌──────────────┐               │
 *   │  │ [ambient loop]               │
 *   │  └──────────────┘               │
 *   └─────────────────────────────────┘
 *
 * The featured film uses native <video controls> — viewer drives a
 * 3-minute clip on their terms. The ambient clip is AutoPlayVideo
 * (the existing autoplay-on-intersect component) so it spins up
 * without burning data off-screen.
 */
export function SplitLogicProcess({
  process,
}: {
  process: NonNullable<Exhibition["processVideos"]>;
}) {
  const { featured, ambient } = process;
  if (!featured && !ambient) return null;

  return (
    <section className="sl-process" aria-label="Studio process record">
      <div className="sl-process-inner">
        <div className="sl-process-heading">log  ::  process</div>

        {featured && (
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
        )}

        {ambient && (
          <figure className="sl-process-plate sl-process-plate--ambient">
            {ambient.label && (
              <div className="sl-process-readout">
                <span className="sl-process-readout-prefix">&gt;&gt;</span>
                <span className="sl-process-readout-label">{ambient.label}</span>
                {ambient.duration && (
                  <span className="sl-process-readout-duration">
                    {ambient.duration}
                  </span>
                )}
              </div>
            )}
            <div className="sl-process-frame">
              {/* AutoPlayVideo defers play() until the element scrolls
                  into view — keeps the 3.6 MB loop off the wire until
                  the viewer reaches the section. */}
              <AutoPlayVideo
                className="sl-process-video"
                src={ambient.src}
                poster={ambient.poster}
                preload="metadata"
              />
            </div>
          </figure>
        )}
      </div>
    </section>
  );
}
