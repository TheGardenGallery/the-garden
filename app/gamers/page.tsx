import Hero from "@/components/gamers/Hero";
import Signoff from "@/components/gamers/Signoff";
import Snow from "@/components/gamers/Snow";
import Reticle from "@/components/gamers/Reticle";
import WorldPlate from "@/components/gamers/WorldPlate";

export default function Page() {
  return (
    <main className="gamers-root surface">
      {/* full-bleed background world plate (our design asset; behind everything) */}
      <WorldPlate />
      {/* ambient snow/dust particle layer, behind all content */}
      <Snow />
      {/* targeting-reticle custom cursor */}
      <Reticle />
      {/* top status ticker — echoes the in-game TICKER / MISSION CONTROL line */}
      <header className="topbar mono">
        <span className="tb-left">ITSGALO</span>
        <span className="tb-mid" aria-hidden>
          ▓▒░ MISSION CONTROL // ALL SYSTEMS NOMINAL ░▒▓
        </span>
        <span className="tb-right">GAMERS</span>
      </header>

      {/* first view — fills the viewport: artwork + title sit here, the
          statement is intentionally pushed below the fold */}
      <section className="firstview">
        {/* the live piece */}
        <Hero />

        {/* title block */}
        <div className="titleblock">
          <h1 className="mono title">GAMERS</h1>
          <p className="mono subtitle">itsgalo</p>
        </div>
      </section>

      {/* ── SECOND HALF: the colophon ──────────────────────────────
          The dark world-room continues; text stays white-on-black. The
          iteration's colour appears only as a precise accent — the spec
          values print in --title-alt and the COLOUR row carries a chip in
          the artwork's exact baked colour, like a gallery catalogue label. */}
      <section className="colophon">
        <hr className="hairline section-rule" />

        {/* statement — a targeting-computer readout resolving into a pull-quote */}
        <section className="statement">
          <p className="readout dim">
            One seed renders an entire world. Terrain, palette, and the path the
            camera flies, all framed through the targeting computer.
          </p>
          <p className="pullquote">No two iterations share the same horizon.</p>
          <div className="signoff-row">
            <Signoff text="Fly high, space cowboy." />
          </div>
        </section>

        <hr className="hairline section-rule" />

        {/* spec readout — styled after the game's NET STATUS / MEM DUMP panels */}
        <section className="readout-grid mono">
          <Spec k="SERIES" v="GAMERS" />
          <Spec k="ARTIST" v="ITSGALO" />
          <Spec k="MEDIUM" v="GENERATIVE · WEBGL" />
          <Spec k="TYPEFACE" v="MBYTEPC230 CGA · CP437" />
          <Spec k="ITERATIONS" v="∞ / ON LOAD" />
          <Spec k="STATUS" v="STAGING" />
          <Spec k="EDITION" v="TBA" />
          <Spec k="YEAR" v="2026" />
          <ColourSpec />
        </section>

        <hr className="hairline section-rule" />

        <footer className="footer mono">
          <span>© ITSGALO 2026</span>
          <span className="dim">
            TYPE: MBYTEPC230 CGA · THE ULTIMATE OLDSCHOOL PC FONT PACK (CC BY-SA 4.0)
          </span>
        </footer>
      </section>
    </main>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="spec">
      <span className="spec-k dim">{k}</span>
      <span className="spec-dots" aria-hidden />
      <span className="spec-v">{v}</span>
    </div>
  );
}

/* COLOUR row: the iteration's defining datum stated as a gallery label — a small
   chip printed in the artwork's exact baked colour (--art), like a paint chip in
   a catalogue. The quiet, precise way to surface the palette without a field. */
function ColourSpec() {
  return (
    <div className="spec spec-full">
      <span className="spec-k dim">COLOUR</span>
      <span className="spec-dots" aria-hidden />
      <span className="spec-v spec-colour">
        <span className="colour-chip" aria-hidden />
        ITERATION
      </span>
    </div>
  );
}
