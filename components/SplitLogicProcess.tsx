import type { Exhibition } from "@/lib/types";
import { AutoPlayVideo } from "./AutoPlayVideo";

/**
 * Studio process record — themed as another instrument on the Split
 * Logic dashboard, not a generic BTS gallery. Section sits between
 * Ricky's annotated broadsheet and the colophon: editorial frame
 * closes (the works, the artist's note); the process film plays as a
 * coda before the credits.
 *
 * Featured clip uses AutoPlayVideo with autoplay-on-intersect + loop +
 * no controls — same treatment as the inline-process clip in the
 * description prose. Controls were tried but the bottom control bar
 * occupies the lower ~30-40px of the frame, which made the visual
 * gap between frame-bottom and caption-top read as larger than the
 * inline clip's matching 10px gap (controls aren't there to push the
 * content down). Same ambient behaviour means matching gaps and a
 * cohesive read across both clips.
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
        <div className="sl-process-heading">studio</div>

        <figure className="sl-process-plate sl-process-plate--featured">
          <div className="sl-process-frame">
            <AutoPlayVideo
              className="sl-process-video"
              src={featured.src}
              poster={featured.poster}
              preload="metadata"
              loop
            />
          </div>
          {featured.label && (
            <figcaption className="sl-process-readout">
              <span className="sl-process-readout-prefix">&gt;&gt;</span>
              <span className="sl-process-readout-label">{featured.label}</span>
              {featured.duration && (
                <span className="sl-process-readout-duration">
                  {featured.duration}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
