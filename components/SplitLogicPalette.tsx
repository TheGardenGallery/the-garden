"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { legibleOnDark, type WedgeCell } from "@/lib/split-logic-color";

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
  /** Optional: notified each time the walker steps to a new zone.
   *  The host uses this to re-rank the piece grid by the walker's
   *  current colour, so the bar reads as the system actively tuning
   *  rather than a decorative cursor. */
  onWalkerChange?: (idx: number) => void;
};

export function SplitLogicPalette({
  cells,
  lockedIdx,
  onCellClick,
  onWalkerChange,
}: Props) {
  const [walkerIdx, setWalkerIdx] = useState(0);
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dwellMs, setDwellMs] = useState(0);
  const cellsLen = cells.length;
  const cellsLenRef = useRef(cellsLen);
  cellsLenRef.current = cellsLen;

  // Notify the host whenever the walker moves so the grid can re-rank.
  useEffect(() => {
    onWalkerChange?.(walkerIdx);
  }, [walkerIdx, onWalkerChange]);

  const isLocked = lockedIdx !== null;

  // Display priority: lock > hover preview > walker. Once the viewer
  // has tuned the system, that's the truth — hovering elsewhere
  // doesn't override the locked state in the readout (clicking a
  // different cell still re-tunes via onCellClick).
  const displayIdx = isLocked
    ? (lockedIdx as number)
    : hoveredIdx !== null
      ? hoveredIdx
      : walkerIdx;
  const display = cells[displayIdx];
  const displayMode: "preview" | "lock" | "walker" = isLocked
    ? "lock"
    : hoveredIdx !== null
      ? "preview"
      : "walker";

  useEffect(() => {
    // Walker pauses while the viewer is interacting with the bar
    // (hovering or locked) — only one cell is highlighted at a time
    // so the strip reads as a single instrument, not three states
    // happening in parallel.
    if (isLocked || hoveredIdx !== null || cellsLen === 0) return;
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
  }, [isLocked, hoveredIdx, cellsLen]);

  if (cellsLen === 0) return null;

  const displayNum = String(displayIdx + 1).padStart(2, "0");
  // Brightened for the readout text/cursor only — preserves hue +
  // chroma but raises lightness so dark zones (navy, plum, brick)
  // don't sink into the black surface.
  const legibleHex = legibleOnDark(display.hex);

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
          const isHovering = hoveredIdx !== null;
          const isWalkerHere =
            !isLocked && !isHovering && i === walkerIdx;
          const isLockHere = lockedIdx === i;
          const isHoverHere = hoveredIdx === i;
          const isFadeHere =
            fadingIdx === i && !isWalkerHere && !isLockHere && !isHovering;
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
          style={{ color: legibleHex }}
        >
          {display.hex.toUpperCase().replace("#", "0x")}
        </span>
        <span className="sl-readout-sep">::</span>
        <span className="sl-readout-id">zone {displayNum}/{cellsLen}</span>
        {displayMode !== "preview" && (
          <>
            <span className="sl-readout-sep">::</span>
            <span
              className="sl-readout-state"
              style={
                displayMode === "lock" ? { color: legibleHex } : undefined
              }
            >
              {displayMode === "lock"
                ? "LOCKED"
                : `wait ${(dwellMs / 1000).toFixed(2)}s`}
            </span>
          </>
        )}
        <span
          className="sl-readout-cursor"
          style={{ color: legibleOnDark(display.hex, 0.62) }}
        >█</span>
      </div>
    </section>
  );
}
