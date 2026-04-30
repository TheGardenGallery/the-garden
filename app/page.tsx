import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ExhibitionCard } from "@/components/ExhibitionCard";
import { JournalHero } from "@/components/JournalHero";
import { JournalItem } from "@/components/JournalItem";
import { Reveal } from "@/components/Reveal";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { fetchExhibitions, fetchJournalEntries } from "@/lib/verse-api";
import { getArtworkPalette } from "@/lib/palette";
import { homepagePastPicks } from "@/lib/data/display-rules";

export default async function HomePage() {
  const exhibitions = await fetchExhibitions();
  const journal = await fetchJournalEntries();

  // Homepage hero rotation: current + upcoming exhibitions, plus a
  // small set of recent-past releases pinned by slug. iso-iec-10646
  // is editorially "past" (sold out) but still warrants a spot in
  // the rotation alongside the upcoming work — keeps the homepage
  // alive while only one upcoming is queued.
  const HERO_PAST_PINS = ["iso-iec-10646"];
  const liveOrUpcoming = exhibitions.filter(
    (e) =>
      (e.status === "current" || e.status === "upcoming") &&
      (e.hero || e.homepageHeroVideo)
  );
  const pinnedPast = HERO_PAST_PINS
    .map((slug) => exhibitions.find((e) => e.slug === slug))
    .filter(
      (e): e is NonNullable<typeof e> =>
        Boolean(e && (e.hero || e.homepageHeroVideo))
    );
  const heroExhibitions =
    liveOrUpcoming.length + pinnedPast.length > 0
      ? [...pinnedPast, ...liveOrUpcoming]
      : [
          exhibitions.find((e) => e.status === "current") ?? exhibitions[0],
        ].filter(Boolean);

  const pastExhibitions = homepagePastPicks
    .map((slug) => exhibitions.find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const journalHero = journal[0];
  const journalSidebar = journal.slice(1, 4);

  return (
    <>
      <WelcomeOverlay />
      <h1 className="sr-only">The Garden — an online gallery for digital art</h1>

      <Hero
        slides={await Promise.all(
          heroExhibitions.map(async (ex) => {
            const paletteSrc =
              ex.homepageHero ?? ex.homepageHeroVideoPoster ?? ex.hero;
            const palette = paletteSrc
              ? await getArtworkPalette(paletteSrc)
              : {
                  base: "#f1f4f6",
                  glow: "#f7f9fa",
                  deep: "#e9ecee",
                  foreground: "#232326",
                  shadow: "rgba(40,35,25,0.14)",
                  isDark: false,
                };
            return { exhibition: ex, palette };
          })
        )}
      />

      <section className="exhibitions-hybrid">
        <div className="hybrid-container">
          <h2 className="hybrid-section-title">Past</h2>
          <div className="exhibitions-grid-hybrid">
            {pastExhibitions.map((ex) => (
              <Reveal key={ex.slug}>
                <ExhibitionCard exhibition={ex} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="news-hybrid">
        <div className="hybrid-container">
          <h2 className="hybrid-section-title">Interview</h2>
          <div
            className={`journal-grid${
              journalSidebar.length === 0 ? " is-solo" : ""
            }`}
          >
            <Reveal>
              <JournalHero entry={journalHero} />
            </Reveal>
            {journalSidebar.length > 0 && (
              <div className="journal-sidebar">
                {journalSidebar.map((entry) => (
                  <Reveal key={entry.slug}>
                    <JournalItem entry={entry} />
                  </Reveal>
                ))}
                <Link href="/journal" className="journal-all">
                  <span className="journal-all-label">View all articles</span>
                  <span className="journal-all-arrow">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
