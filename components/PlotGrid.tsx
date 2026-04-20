"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Artist } from "@/lib/types";
import { PlotCell } from "./PlotCell";

type PlotGridProps = {
  artists: Artist[];
  columns?: number;
};

const defaultColumns = 7;

/**
 * Full-bleed artist coordinate plot.
 *
 * Each row reveals with a 40ms stagger on mount, creating a quiet top-down
 * wave. No per-cell animation — the row-level grain keeps it readable, not
 * busy. Respects prefers-reduced-motion.
 */
export function PlotGrid({ artists, columns = defaultColumns }: PlotGridProps) {
  const reduced = useReducedMotion();
  const rows = Array.from(new Set(artists.map((a) => a.coord.row)));

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
        {Array.from({ length: columns }, (_, i) => {
          const col = i + 1;
          return (
            <div key={col} className="plot-col-label" data-col={col}>
              {String(col).padStart(2, "0")}
            </div>
          );
        })}
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
        {rows.map((row) => {
          const cells = Array.from({ length: columns }, (_, i) => {
            const col = i + 1;
            const artist = artists.find(
              (a) => a.coord.row === row && a.coord.col === col
            );
            return { col, artist };
          });

          return (
            <motion.div
              key={row}
              className="plot-row"
              variants={rowVariants}
            >
              <div className="plot-row-label">{row}</div>
              {cells.map(({ col, artist }) => (
                <PlotCell key={col} col={col} row={row} artist={artist} />
              ))}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
