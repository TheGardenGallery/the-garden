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

  // Bar zones come from the characteristic colour per wedge.
  const characteristicLchs = useMemo(
    () => cells.map((c) => hexToOklch(c.hex)),
    [cells]
  );
  // Each wedge also exposes its full matching palette (typically the
  // ground band + ink band). The grid sort uses min-distance across
  // these so a dark-ground / saturated-ink piece ranks against its
  // ink colour, not the muddy black-plus-ink mean.
  const palettesLch = useMemo(
    () =>
      cells.map((c) =>
        (c.palette.length > 0 ? c.palette : [c.hex]).map(hexToOklch)
      ),
    [cells]
  );

  // Pick BAR_ZONE_COUNT mutually-distinct wedges and present them as
  // the bar's zones. `zoneIndices[k]` is the index into `cells` for
  // the k-th zone.
  const zoneIndices = useMemo(
    () => pickDistinctIndices(characteristicLchs, BAR_ZONE_COUNT),
    [characteristicLchs]
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
    const target = characteristicLchs[targetWedgeIdx];
    // For each wedge, the distance is the *minimum* distance from the
    // locked colour to any colour in that wedge's matching palette —
    // a wedge is "near" the locked colour if any of its bands matches.
    const distances = palettesLch.map((palette) => {
      let minD = Infinity;
      for (const lch of palette) {
        const d = colorDistance(lch, target);
        if (d < minD) minD = d;
      }
      return minD;
    });
    const ranking = palettesLch
      .map((_, i) => i)
      .sort((a, b) => distances[a] - distances[b]);
    const order = new Array<number>(palettesLch.length);
    ranking.forEach((origIdx, sortedPos) => {
      order[origIdx] = sortedPos;
    });
    return order;
  }, [
    characteristicLchs,
    palettesLch,
    zoneIndices,
    lockedZoneIdx,
    gridItems,
  ]);

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
