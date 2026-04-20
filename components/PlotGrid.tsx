import type { Artist } from "@/lib/types";
import { PlotCell } from "./PlotCell";

type PlotGridProps = {
  artists: Artist[];
  columns?: number;
};

const defaultColumns = 7;

/**
 * Full-bleed artist coordinate plot.
 * All styles in globals.css (.plot-wrap, .plot-top, .plot-row, .plot-cell).
 * --cols custom property drives column count; responsive media queries
 * override it at breakpoints 7 → 6 → 5 → 4 → 3 → 2.
 */
export function PlotGrid({ artists, columns = defaultColumns }: PlotGridProps) {
  const rows = Array.from(new Set(artists.map((a) => a.coord.row)));

  return (
    <section className="plot-wrap">
      <div className="plot-top">
        <div className="plot-origin">x,y</div>
        {Array.from({ length: columns }, (_, i) => {
          const col = i + 1;
          return (
            <div key={col} className="plot-col-label" data-col={col}>
              {String(col).padStart(2, "0")}
            </div>
          );
        })}
      </div>

      <div className="plot-body">
        {rows.map((row) => {
          const cells = Array.from({ length: columns }, (_, i) => {
            const col = i + 1;
            const artist = artists.find(
              (a) => a.coord.row === row && a.coord.col === col
            );
            return { col, artist };
          });

          return (
            <div key={row} className="plot-row">
              <div className="plot-row-label">{row}</div>
              {cells.map(({ col, artist }) => (
                <PlotCell key={col} col={col} row={row} artist={artist} />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
