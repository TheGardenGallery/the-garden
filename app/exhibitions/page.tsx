import { ExhibitionRow } from "@/components/ExhibitionRow";
import { PastCard } from "@/components/PastCard";
import { EmptyState } from "@/components/EmptyState";
import { fetchExhibitions } from "@/lib/verse-api";
import type { Exhibition } from "@/lib/types";

export const metadata = {
  title: "Exhibitions | The Garden",
};

export default async function ExhibitionsPage() {
  const all = await fetchExhibitions();
  const current = all.filter((e) => e.status === "current");
  const upcoming = all.filter((e) => e.status === "upcoming");
  const past = all.filter((e) => e.status === "past");

  const pastByYear = past.reduce<Record<number, Exhibition[]>>((acc, ex) => {
    (acc[ex.year] ??= []).push(ex);
    return acc;
  }, {});
  const pastYears = Object.keys(pastByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="exhibitions-page">
      <h1 className="sr-only">Exhibitions — The Garden</h1>

      <section className="ex-section">
        <div className="ex-section-inner">
          <h2 className="ex-section-title">Current</h2>
          <div className="exhibitions-list">
            {current.map((ex, i) => (
              <ExhibitionRow
                key={ex.slug}
                exhibition={ex}
                mirror={i % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="ex-section">
        <div className="ex-section-inner">
          <h2 className="ex-section-title">Upcoming</h2>
          <div className="exhibitions-list">
            {upcoming.length === 0 ? (
              <EmptyState
                title="Nothing on the horizon, just yet."
                body="Join the newsletter to hear first."
              />
            ) : (
              upcoming.map((ex, i) => (
                <ExhibitionRow
                  key={ex.slug}
                  exhibition={ex}
                  mirror={i % 2 === 1}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="ex-section">
        <div className="ex-section-inner">
          <h2 className="ex-section-title">Past</h2>
          <div className="exhibitions-list past-grid">
            {pastYears.map((year) => (
              <div key={year}>
                <h3 className="past-year">{year}</h3>
                <div className="past-year-group">
                  {pastByYear[year].map((ex) => (
                    <PastCard key={ex.slug} exhibition={ex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
