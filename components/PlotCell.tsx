import Link from "next/link";
import type { Artist } from "@/lib/types";

type PlotCellProps =
  | { col: number; row: string; artist: Artist }
  | { col: number; row: string; artist?: undefined };

export function PlotCell({ col, row, artist }: PlotCellProps) {
  const coord = `${row},${String(col).padStart(2, "0")}`;

  if (!artist) {
    return (
      <div className="plot-cell empty" data-col={col} aria-hidden="true">
        <span className="coord-readout">{coord}</span>
      </div>
    );
  }

  const isNumericRow = row === "#";
  const initial = isNumericRow ? artist.name.charAt(0) : row;

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="plot-cell filled"
      data-col={col}
      aria-label={`${artist.name}, plotted at ${coord}`}
    >
      <span className="artist-coord" aria-hidden="true">
        {coord}
      </span>
      <span
        className={isNumericRow ? "artist-initial numeric" : "artist-initial"}
        aria-hidden="true"
      >
        {initial}
      </span>
      <span className="artist-name">{artist.name}</span>
    </Link>
  );
}
