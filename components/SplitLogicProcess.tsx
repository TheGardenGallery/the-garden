import type { Exhibition } from "@/lib/types";
import { AutoPlayVideo } from "./AutoPlayVideo";

/**
 * Studio process record — themed as another instrument on the Split
 * Logic dashboard, not a generic BTS gallery. Section sits between
 * Ricky's annotated broadsheet and the colophon: editorial frame
 * closes (the works, the artist's note); the process film plays as a
 * coda before the credits.
 *
 * Featured clip uses AutoPlayVideo so it autoplays muted on intersect
 * and loops continuously, matching the inline-process clip's
 * behaviour. Controls stay on so a viewer who wants to scrub or pause
 * a long capture still can. Inline ambient (shorter loop) lives in
 * the description prose, rendered by TerminalDescription.
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
              controls
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
