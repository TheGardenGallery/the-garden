import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ExhibitionCard } from "@/components/ExhibitionCard";
import { JournalHero } from "@/components/JournalHero";
import { JournalItem } from "@/components/JournalItem";
import { fetchExhibitions, fetchJournalEntries } from "@/lib/verse-api";

export default async function HomePage() {
  const exhibitions = await fetchExhibitions();
  const journal = await fetchJournalEntries();

  const heroExhibitions =
    exhibitions.filter((e) => e.status === "current" && e.hero).length > 0
      ? exhibitions.filter((e) => e.status === "current" && e.hero)
      : [
          exhibitions.find((e) => e.status === "current") ?? exhibitions[0],
        ].filter(Boolean);

  const pastExhibitions = exhibitions
    .filter((e) => e.status === "past")
    .slice(0, 3);

  const journalHero = journal[0];
  const journalSidebar = journal.slice(1, 4);

  return (
    <>
      <h1 className="sr-only">The Garden — a digital art gallery</h1>

      <Hero exhibitions={heroExhibitions} />

      <section className="exhibitions-hybrid">
        <div className="hybrid-container">
          <h2 className="hybrid-section-title">Past</h2>
          <div className="exhibitions-grid-hybrid">
            {pastExhibitions.map((ex) => (
              <ExhibitionCard key={ex.slug} exhibition={ex} />
            ))}
          </div>
        </div>
      </section>

      <section className="news-hybrid">
        <div className="hybrid-container">
          <h2 className="hybrid-section-title">Journal</h2>
          <div className="journal-grid">
            <JournalHero entry={journalHero} />
            <div className="journal-sidebar">
              {journalSidebar.map((entry) => (
                <JournalItem key={entry.slug} entry={entry} />
              ))}
              <Link href="/journal" className="journal-all">
                <span className="journal-all-label">View all articles</span>
                <span className="journal-all-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
