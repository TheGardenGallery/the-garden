import Link from "next/link";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";
import { interviews } from "@/lib/data/interviews";

export const metadata = {
  title: "Interviews | The Garden",
};

export default function JournalPage() {
  return (
    <div className="journal-index">
      {/* Page label is carried by the nav (Interviews is the current
          item); the page itself opens straight into the archive. The
          sr-only h1 keeps the document outline correct for screen
          readers without a visible title. */}
      <h1 className="sr-only">Interviews — The Garden</h1>

      <ol className="journal-index-list">
        {interviews.map((iv) => (
          <li key={iv.slug} className="journal-index-li">
            <Link
              href={`/interviews/${iv.slug}`}
              className="journal-index-row"
            >
              <div className="journal-index-meta-top" aria-hidden>
                <span>Issue {iv.number}</span>
                <span className="journal-index-sep"> · </span>
                <span>{iv.date}</span>
                {iv.exhibitionTitle ? (
                  <>
                    <span className="journal-index-sep"> · </span>
                    <span>{iv.exhibitionTitle}</span>
                  </>
                ) : null}
              </div>

              <div className="journal-index-cover">
                <div className="journal-index-media">
                  {(() => {
                    // Prefer listing-specific media when set so a show
                    // can greet the index with one of its actual works
                    // rather than the conversation's hero atmosphere.
                    // Falls back to heroVideo/heroPoster otherwise.
                    const video = iv.listingHeroVideo ?? iv.heroVideo;
                    const poster = iv.listingHeroPoster ?? iv.heroPoster;
                    if (video) {
                      return (
                        <AutoPlayVideo
                          src={video}
                          poster={poster}
                          loop
                          muted
                          playsInline
                        />
                      );
                    }
                    if (poster) {
                      // eslint-disable-next-line @next/next/no-img-element
                      return <img src={poster} alt="" />;
                    }
                    return null;
                  })()}
                </div>
              </div>

              <div className="journal-index-caption">
                <h2 className="journal-index-headline">{iv.title}</h2>
                <span className="journal-index-byline">{iv.artistName}</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
