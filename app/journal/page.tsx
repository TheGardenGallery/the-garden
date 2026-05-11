import Link from "next/link";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";
import { interviews } from "@/lib/data/interviews";

export const metadata = {
  title: "Interview | The Garden",
};

export default function JournalPage() {
  return (
    <div className="journal-index">
      <h1 className="sr-only">Interview &mdash; The Garden</h1>

      <div className="journal-index-list">
        {interviews.map((iv) => (
          <Link
            key={iv.slug}
            href={`/interviews/${iv.slug}`}
            className="journal-index-row"
          >
            {/* Ambient artwork — the hero video/poster bleeds behind the
                row at reduced opacity so each entry carries the tonal
                register of its interview without us writing per-artist CSS. */}
            <div className="journal-index-media" aria-hidden>
              {iv.heroVideo ? (
                <AutoPlayVideo
                  src={iv.heroVideo}
                  poster={iv.heroPoster}
                  loop
                  muted
                  playsInline
                />
              ) : iv.heroPoster ? (
                <img src={iv.heroPoster} alt="" />
              ) : null}
            </div>

            <div className="journal-index-content">
              <span className="journal-index-number">{iv.number}</span>
              <div className="journal-index-text">
                <h2 className="journal-index-artist">{iv.artistName}</h2>
                <div className="journal-index-title">{iv.title}</div>
                <p className="journal-index-preamble">{iv.preamble}</p>
                <div className="journal-index-meta">
                  <span>{iv.date}</span>
                  {iv.exhibitionTitle && (
                    <>
                      <span className="journal-index-sep">&middot;</span>
                      <span>{iv.exhibitionTitle}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
