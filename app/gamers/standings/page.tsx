import Link from "next/link";
import Snow from "@/components/gamers/Snow";
import Reticle from "@/components/gamers/Reticle";
import StandingsBoard from "@/components/gamers/StandingsBoard";

export default function StandingsPage() {
  return (
    <main className="gamers-root surface standings-surface">
      {/* ambient particle layer + reticle cursor, consistent with the hero page */}
      <Snow />
      <Reticle />

      {/* top status ticker — same MISSION CONTROL fiction, standings context */}
      <header className="topbar mono">
        <Link href="/gamers" className="tb-left tb-link">
          ← ITSGALO
        </Link>
        <span className="tb-mid" aria-hidden>
          ▓▒░ MISSION CONTROL // GLOBAL STANDINGS // 24H WINDOW ░▒▓
        </span>
        <span className="tb-right">GAMERS</span>
      </header>

      <section className="standings">
        <div className="standings-title-block">
          <h1 className="mono title text-fit">
            <span>
              <span>STANDINGS</span>
            </span>
            <span aria-hidden="true">STANDINGS</span>
          </h1>
          <p className="mono subtitle">global · ranked by the last 24 hours</p>
        </div>

        <StandingsBoard />

        <hr className="hairline section-rule" />
        <footer className="footer mono">
          <span>2026</span>
          <span className="lb-sprite" aria-hidden>
            ☻ ░▒▓
          </span>
        </footer>
      </section>
    </main>
  );
}
