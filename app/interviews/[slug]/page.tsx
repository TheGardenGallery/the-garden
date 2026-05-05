import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";
import { InterviewParallax } from "@/components/InterviewParallax";
import { getInterview, interviews } from "@/lib/data/interviews";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return interviews.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interview = getInterview(slug);
  if (!interview) return {};
  return {
    title: `${interview.artistName} — ${interview.exhibitionTitle ?? "Interview"} — The Garden`,
    description: interview.preamble,
  };
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interview = getInterview(slug);
  if (!interview) notFound();

  return (
    <article className="interview-root" data-slug={slug}>
      <InterviewParallax />

      {/* Opening plate — silent looping hero behind a title block. The
          video sits at reduced opacity so it reads as ambient light, not
          the subject. The page anchor is the artist's name (clickable
          to their bio), with the exhibition framed below as a clickable
          context line — Hufkens-tier "subject : context" hierarchy. */}
      <header className="iv-hero">
        {interview.heroVideo && (
          <div
            className="iv-hero-media"
            aria-hidden
            // Fallback bg image so if iOS Safari fails to autoplay the
            // video on a hard refresh (it sometimes caches a paused
            // state), the glass overlay still has the wedge artwork
            // to sample — no "stuck dark blur".
            style={
              interview.heroPoster
                ? { backgroundImage: `url("${interview.heroPoster}")` }
                : undefined
            }
          >
            <AutoPlayVideo
              src={interview.heroVideo}
              poster={interview.heroPoster}
              loop
              muted
              playsInline
            />
          </div>
        )}
        <div className="iv-hero-glass" aria-hidden />
        <div className="iv-hero-inner">
          <h1 className="iv-hero-title">
            <Link
              href={`/artists/${interview.artistSlug}`}
              className="iv-hero-title-link"
            >
              {interview.artistName}
            </Link>
          </h1>
          {interview.title && (
            <div className="iv-hero-subtitle">{interview.title}</div>
          )}
        </div>
        {interview.exhibitionSlug && interview.exhibitionTitle && (
          <div className="iv-hero-corner">
            <span className="iv-hero-corner-label">Conversation:</span>{" "}
            <Link
              href={`/exhibitions/${interview.exhibitionSlug}`}
              className="iv-hero-corner-link"
            >
              {interview.exhibitionTitle}
            </Link>
          </div>
        )}
      </header>

      <div className="iv-body">
        {interview.sections.map((section, i) => {
          const sectionIndex = i + 1;
          return (
            <section
              key={section.label}
              id={`sec-${sectionIndex}`}
              data-interview-section={sectionIndex}
              className="iv-section"
            >
              {/* Section break — full-bleed looping wedge with the
                  chapter label pinned along the bottom of the plate
                  (gallery-poster style). Single horizontal line:
                  SEC.NN ── chapter title, in Saira condensed phosphor
                  green / white. */}
              {section.breakVideo && (
                <div className="iv-break" aria-hidden>
                  <div className="iv-break-media">
                    <AutoPlayVideo
                      src={section.breakVideo}
                      poster={section.breakPoster}
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="iv-break-label">
                    <span className="iv-break-code">{section.label}</span>
                    <span className="iv-break-rule" />
                    <span className="iv-break-title">{section.title}</span>
                  </div>
                </div>
              )}

              {/* Questions — labeled clusters, calibration-cross answer
                  marks. Each Q row carries a 2–3 letter code and a
                  decimal readout, mirroring the way data points are
                  labeled in Ricky's wedge plots. */}
              <div className="iv-qa-stack">
                {section.questions.map((qa, qi) => {
                  const fallbackCode = `Q.${String(qi + 1).padStart(2, "0")}`;
                  return (
                    <div key={qi} className="iv-qa">
                      <div className="iv-qa-q">
                        <span className="iv-qa-idx">
                          <span className="iv-qa-code">
                            {qa.code ?? fallbackCode}
                          </span>
                          {qa.value && (
                            <span className="iv-qa-value">{qa.value}</span>
                          )}
                        </span>
                        <p
                          className="iv-qa-text"
                          dangerouslySetInnerHTML={{ __html: qa.q }}
                        />
                      </div>
                      <div className="iv-qa-rule" aria-hidden />
                      <div className="iv-qa-a">
                        <span className="iv-qa-mark" aria-hidden>+</span>
                        {qa.a ? (
                          <p
                            className="iv-qa-answer"
                            dangerouslySetInnerHTML={{ __html: qa.a }}
                          />
                        ) : (
                          <p className="iv-qa-answer iv-qa-answer--pending">
                            <span className="iv-qa-pending-cursor" />
                            <span className="iv-qa-pending-label">
                              UNKNOWN VARIABLE
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
