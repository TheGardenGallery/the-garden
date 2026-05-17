"use client";

import { useState, type CSSProperties } from "react";
import { legibleOnDark, type WedgeCell } from "@/lib/split-logic-color";

/**
 * Split Logic — colour bar.
 *
 * Horizontal strip of category swatches. Hover a cell to preview;
 * click to lock the system to that category. The host
 * (SplitLogicSystem) re-ranks the piece grid so matching pieces
 * float to the front.
 */
type Props = {
  cells: WedgeCell[];
  lockedIdx: number | null;
  onCellClick: (i: number) => void;
};

export function SplitLogicPalette({
  cells,
  lockedIdx,
  onCellClick,
}: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const cellsLen = cells.length;

  const isLocked = lockedIdx !== null;

  // Display priority: lock > hover preview > first cell (idle).
  // Once tuned, the readout sticks on the locked cell; hover only
  // overrides while the cursor is on the bar.
  const displayIdx = isLocked
    ? (lockedIdx as number)
    : hoveredIdx !== null
      ? hoveredIdx
      : 0;
  const display = cells[displayIdx];
  const displayMode: "preview" | "lock" | "idle" = isLocked
    ? "lock"
    : hoveredIdx !== null
      ? "preview"
      : "idle";

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
          const isLockHere = lockedIdx === i;
          const isHoverHere = hoveredIdx === i;
          const isRainbow = c.wedgeId === "category-rainbow";
          const classes = [
            "sl-palette-cell",
            isRainbow && "is-rainbow",
            isLockHere && "is-locked",
            isHoverHere && "is-hovered",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={c.wedgeId}
              type="button"
              className={classes}
              // Rainbow swatch is applied via .is-rainbow in CSS so
              // the existing CRT scanline + sheen layers (in
              // background-image) still composite over it. Setting
              // `background` inline would wipe those layers out.
              style={isRainbow ? undefined : { backgroundColor: c.hex }}
              onClick={() => onCellClick(i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onFocus={() => setHoveredIdx(i)}
              onBlur={() => setHoveredIdx(null)}
              aria-label={
                isRainbow
                  ? `Surface the multi-colour pieces`
                  : `Tune to zone ${cellNum}, ${c.hex}`
              }
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
        {displayMode === "lock" && (
          <>
            <span className="sl-readout-sep">::</span>
            <span
              className="sl-readout-state"
              style={{ color: legibleHex }}
            >
              LOCKED
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
