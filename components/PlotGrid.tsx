"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Artist } from "@/lib/types";
import { PlotCell } from "./PlotCell";

type PlotGridProps = {
  artists: Artist[];
  columns?: number;
};

const defaultColumns = 6;
const LETTER_ROWS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

/* Hover state fires all three layers on enter simultaneously — the
   visual stagger comes from different CSS fade-in durations per layer
   (col fastest, cell slowest), not setTimeout delays. This keeps the
   interaction feeling immediate while preserving the layered read. */

type DisplayRow = {
  label: string;
  letters: string[];
  isCollapsed: boolean;
};

/** Build the list of rows to render. The `#` row (numeric-prefix artists)
    always comes first, labeled "1". Then A–Z, with any run of 3+ consecutive
    empty letters collapsed into a single range row like "F—H". Shorter runs
    render as individual empty rows. */
function buildDisplayRows(occupied: Set<string>): DisplayRow[] {
  const rows: DisplayRow[] = [];
  if (occupied.has("#")) {
    rows.push({ label: "1", letters: ["#"], isCollapsed: false });
  }
  let emptyRun: string[] = [];
  const flush = () => {
    if (emptyRun.length >= 3) {
      rows.push({
        label: `${emptyRun[0]}—${emptyRun[emptyRun.length - 1]}`,
        letters: [...emptyRun],
        isCollapsed: true,
      });
    } else {
      emptyRun.forEach((l) =>
        rows.push({ label: l, letters: [l], isCollapsed: false }),
      );
    }
    emptyRun = [];
  };
  for (const letter of LETTER_ROWS) {
    if (occupied.has(letter)) {
      flush();
      rows.push({ label: letter, letters: [letter], isCollapsed: false });
    } else {
      emptyRun.push(letter);
    }
  }
  flush();
  return rows;
}

export function PlotGrid({ artists, columns = defaultColumns }: PlotGridProps) {
  const reduced = useReducedMotion();
  const occupied = new Set(artists.map((a) => a.coord.row));
  const displayRows = buildDisplayRows(occupied);

  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [hoverCellKey, setHoverCellKey] = useState<string | null>(null);

  const handleEnter = (row: string, col: number) => {
    setHoverCol(col);
    setHoverRow(row);
    setHoverCellKey(`${row}-${col}`);
  };

  const handleLeave = () => {
    setHoverCol(null);
    setHoverRow(null);
    setHoverCellKey(null);
  };

  const rowVariants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="plot-wrap">
      <div className="plot-top">
        <div className="plot-origin">x,y</div>
        <div className="plot-top-cells">
          {Array.from({ length: columns }, (_, i) => {
            const col = i + 1;
            const active = hoverCol === col;
            return (
              <div
                key={col}
                className={`plot-col-label${active ? " plot-col-label--active" : ""}`}
                data-col={col}
              >
                {String(col).padStart(2, "0")}
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        className="plot-body"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: reduced ? 0 : 0.04 },
          },
        }}
      >
        {displayRows.map(({ label, letters, isCollapsed }) => {
          const rowArtists = artists.filter((a) =>
            letters.includes(a.coord.row),
          );
          const maxCol = Math.max(
            columns,
            ...rowArtists.map((a) => a.coord.col),
          );
          // Numeric row uses "1" for the coord readout instead of "#"
          const coordRow = letters[0] === "#" ? "1" : letters[0];
          const cells = Array.from({ length: maxCol }, (_, i) => {
            const col = i + 1;
            const artist = rowArtists.find((a) => a.coord.col === col);
            return { col, artist };
          });

          const rowActive = hoverRow != null && letters.includes(hoverRow);

          return (
            <motion.div
              key={label}
              className={`plot-row${rowActive ? " plot-row--active" : ""}`}
              data-collapsed={isCollapsed || undefined}
              variants={rowVariants}
            >
              <div className="plot-row-label">{label}</div>
              <PlotRowCells>
                {cells.map(({ col, artist }) => (
                  <PlotCell
                    key={col}
                    col={col}
                    row={coordRow}
                    artist={isCollapsed ? undefined : artist}
                    isColActive={hoverCol === col}
                    isCellActive={hoverCellKey === `${coordRow}-${col}`}
                    onEnter={handleEnter}
                    onLeave={handleLeave}
                  />
                ))}
              </PlotRowCells>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/** Horizontally-scrollable cell container that flags itself while
    scrolling so :active invert styles can be suppressed (prevents a
    tap flash when the user is actually scrolling). */
function PlotRowCells({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    el.dataset.scrolling = "true";
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (ref.current) ref.current.dataset.scrolling = "false";
    }, 220);
  };

  return (
    <div ref={ref} className="plot-row-cells" onScroll={onScroll}>
      {children}
    </div>
  );
}
