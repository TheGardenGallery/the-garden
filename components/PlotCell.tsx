import Link from "next/link";
import type { Artist } from "@/lib/types";

type PlotCellProps = {
  col: number;
  row: string;
  artist?: Artist;
  isColActive?: boolean;
  isCellActive?: boolean;
  onEnter?: (row: string, col: number) => void;
  onLeave?: () => void;
};

export function PlotCell({
  col,
  row,
  artist,
  isColActive,
  isCellActive,
  onEnter,
  onLeave,
}: PlotCellProps) {
  const coord = `${row},${String(col).padStart(2, "0")}`;

  if (!artist) {
    const className = [
      "plot-cell",
      "empty",
      isColActive && "plot-cell--col-active",
    ]
      .filter(Boolean)
      .join(" ");
    return <div className={className} data-col={col} aria-hidden="true" />;
  }

  const className = [
    "plot-cell",
    "filled",
    isColActive && "plot-cell--col-active",
    isCellActive && "plot-cell--cell-active",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className={className}
      data-col={col}
      data-row={row}
      aria-label={artist.name}
      onMouseEnter={() => onEnter?.(row, col)}
      onMouseLeave={onLeave}
    >
      <span className="artist-coord" aria-hidden="true">
        {coord}
      </span>
      <span className="artist-name">{artist.name}</span>
    </Link>
  );
}
