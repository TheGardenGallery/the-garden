"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { WedgeCell } from "@/lib/split-logic-color";

/**
 * Split Logic — walker bar.
 *
 * 16 wedge colors arrayed as a thin horizontal strip. A single dim
 * walker migrates from cell to cell with a stochastic wait timer
 * drawn from the same family as the walkers in Ricky's pieces. When
 * the walker jumps, the previous cell briefly retains a phosphor
 * afterglow before fading — like decay on a CRT tube.
 *
 * Hover a cell to preview without committing; click a cell to lock
 * the system to that node. The host (SplitLogicSystem) re-ranks the
 * piece grid by perceptual proximity to the locked colour.
 */
type Props = {
  cells: WedgeCell[];
  lockedIdx: number | null;
  onCellClick: (i: number) => void;
};

export function SplitLogicPalette({ cells, lockedIdx, onCellClick }: Props) {
  const [walkerIdx, setWalkerIdx] = useState(0);
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dwellMs, setDwellMs] = useState(0);
  const cellsLen = cells.length;
  const cellsLenRef = useRef(cellsLen);
  cellsLenRef.current = cellsLen;

  const isLocked = lockedIdx !== null;

  // Display priority: hover preview > lock > walker. The walker keeps
  // running underneath in the autonomous case; hover just temporarily
  // shifts what's reported in the readout.
  const displayIdx =
    hoveredIdx !== null ? hoveredIdx : isLocked ? (lockedIdx as number) : walkerIdx;
  const display = cells[displayIdx];
  const displayMode: "preview" | "lock" | "walker" =
    hoveredIdx !== null ? "preview" : isLocked ? "lock" : "walker";

  useEffect(() => {
    if (isLocked || cellsLen === 0) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let fadeTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const step = (idx: number) => {
      // Wait timer: stochastic 1.4–4.2s.
      const wait = 1400 + Math.random() * 2800;
      const tickMs = 80;
      let elapsed = 0;
      intervalId = setInterval(() => {
        elapsed += tickMs;
        if (!cancelled) setDwellMs(elapsed);
      }, tickMs);

      timeoutId = setTimeout(() => {
        if (intervalId !== undefined) clearInterval(intervalId);
        if (cancelled) return;
        const len = cellsLenRef.current;
        const offset = 1 + Math.floor(Math.random() * (len - 1));
        const next = (idx + offset) % len;
        // Phosphor afterglow on the previous cell — visible for 600ms,
        // then cleared. If a new jump happens before the timer fires,
        // we just overwrite — fine, the latest fade wins.
        setFadingIdx(idx);
        if (fadeTimeoutId !== undefined) clearTimeout(fadeTimeoutId);
        fadeTimeoutId = setTimeout(() => {
          if (!cancelled) setFadingIdx(null);
        }, 600);
        setWalkerIdx(next);
        setDwellMs(0);
        step(next);
      }, wait);
    };

    step(walkerIdx);

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
      if (fadeTimeoutId !== undefined) clearTimeout(fadeTimeoutId);
    };
    // walkerIdx is the seed for the loop, not a dependency — once the
    // loop is running, it owns the cursor and re-seeds itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, cellsLen]);

  if (cellsLen === 0) return null;

  const displayNum = String(displayIdx + 1).padStart(2, "0");

  return (
    <section
      className={`sl-palette is-${displayMode}`}
      aria-label="Split Logic system index"
    >
      <div
        className="sl-palette-strip"
        style={{
          "--active-color": display.hex,
          gridTemplateColumns: `repeat(${cellsLen}, 1fr)`,
        } as CSSProperties}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {cells.map((c, i) => {
          const cellNum = String(i + 1).padStart(2, "0");
          const isWalkerHere = !isLocked && i === walkerIdx;
          const isLockHere = lockedIdx === i;
          const isHoverHere = hoveredIdx === i;
          const isFadeHere = fadingIdx === i && !isWalkerHere && !isLockHere;
          const classes = [
            "sl-palette-cell",
            isWalkerHere && "is-walker",
            isLockHere && "is-locked",
            isHoverHere && "is-hovered",
            isFadeHere && "is-fading",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={c.wedgeId}
              type="button"
              className={classes}
              style={{ backgroundColor: c.hex }}
              onClick={() => onCellClick(i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onFocus={() => setHoveredIdx(i)}
              onBlur={() => setHoveredIdx(null)}
              aria-label={`Tune to zone ${cellNum}, ${c.hex}`}
              aria-pressed={i === lockedIdx}
            />
          );
        })}
      </div>
      <div className="sl-palette-readout" aria-hidden="true">
        <span className="sl-readout-prompt">{">>"}</span>
        <span
          className="sl-readout-hex"
          style={{ color: display.hex }}
        >
          {display.hex.toUpperCase().replace("#", "0x")}
        </span>
        <span className="sl-readout-sep">::</span>
        <span className="sl-readout-id">zone {displayNum}/{cellsLen}</span>
        <span className="sl-readout-sep">::</span>
        <span className="sl-readout-state">
          {displayMode === "lock"
            ? "LOCK"
            : displayMode === "preview"
              ? "PREVIEW"
              : `wait ${(dwellMs / 1000).toFixed(2)}s`}
        </span>
        <span className="sl-readout-cursor">█</span>
      </div>
    </section>
  );
}
