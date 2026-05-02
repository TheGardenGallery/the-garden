"use client";

import { useMemo, useState } from "react";
import {
  colorDistance,
  hexToOklch,
  pickDistinctIndices,
  type WedgeCell,
} from "@/lib/split-logic-color";
import { SplitLogicPalette } from "./SplitLogicPalette";
import { PieceGrid, type PieceGridItem } from "./PieceGrid";

const BAR_ZONE_COUNT = 8;

/**
 * Split Logic — palette + piece grid, wired together.
 *
 * The full series is 16 wedges, but several share near-identical
 * grounds, so the bar would read as redundant if it showed all of
 * them. Instead, the bar shows N=8 most-distinct colour zones picked
 * via farthest-first traversal in OKLCh space — a compact spectrum
 * that spans the system without repeating itself.
 *
 * Click a zone to lock; the piece grid re-ranks all 16 pieces by
 * perceptual distance to that zone's colour. Click the same zone
 * again to release.
 */
export function SplitLogicSystem({
  cells,
  gridItems,
}: {
  cells: WedgeCell[];
  gridItems: PieceGridItem[];
}) {
  const [lockedZoneIdx, setLockedZoneIdx] = useState<number | null>(null);

  // Pre-compute OKLCh once per cell — used both for zone selection and
  // for grid re-ranking.
  const lchs = useMemo(() => cells.map((c) => hexToOklch(c.hex)), [cells]);

  // Pick BAR_ZONE_COUNT mutually-distinct wedges and present them as
  // the bar's zones. `zoneIndices[k]` is the index into `cells` for
  // the k-th zone.
  const zoneIndices = useMemo(
    () => pickDistinctIndices(lchs, BAR_ZONE_COUNT),
    [lchs]
  );
  const zoneCells = useMemo(
    () => zoneIndices.map((i) => cells[i]),
    [zoneIndices, cells]
  );

  const cellOrder = useMemo(() => {
    if (lockedZoneIdx === null) {
      // Identity order — natural numbering.
      return gridItems.map((_, i) => i);
    }
    const targetWedgeIdx = zoneIndices[lockedZoneIdx];
    const target = lchs[targetWedgeIdx];
    // Pair each piece's wedge colour with its distance to the locked zone.
    const distances = lchs.map((lch) => colorDistance(lch, target));
    // Rank ascending. ranking[k] is the original index of the k-th closest piece.
    const ranking = lchs
      .map((_, i) => i)
      .sort((a, b) => distances[a] - distances[b]);
    // Invert: order[origIdx] = position in the sorted list.
    const order = new Array<number>(lchs.length);
    ranking.forEach((origIdx, sortedPos) => {
      order[origIdx] = sortedPos;
    });
    return order;
  }, [lchs, zoneIndices, lockedZoneIdx, gridItems]);

  const handleZoneClick = (i: number) => {
    setLockedZoneIdx((cur) => (cur === i ? null : i));
  };

  return (
    <>
      <SplitLogicPalette
        cells={zoneCells}
        lockedIdx={lockedZoneIdx}
        onCellClick={handleZoneClick}
      />
      <PieceGrid items={gridItems} cellOrder={cellOrder} />
    </>
  );
}
