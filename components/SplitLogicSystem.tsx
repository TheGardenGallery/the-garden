"use client";

import { useMemo, useState } from "react";
import {
  colorDistance,
  hexToOklch,
  type WedgeCell,
} from "@/lib/split-logic-color";
import { SplitLogicPalette } from "./SplitLogicPalette";
import { PieceGrid, type PieceGridItem } from "./PieceGrid";

/**
 * Hand-picked bar zones — one representative per cluster, ordered
 * light → dark. Replaces farthest-first selection so the bar always
 * spans the full palette family (white, yellow, pink, blue, green,
 * mauve, coral, deep blue) instead of doubling up on close greens.
 */
const ZONE_WEDGE_IDS = [
  "wedge-02", // DBK   — white / very pale
  "wedge-03", // HTX   — pastel yellow
  "wedge-07", // HEK   — peach / pastel pink
  "wedge-12", // MB/SUL — dark cream
  "wedge-04", // CI    — sage green
  "wedge-15", // maze  — mauve
  "wedge-10", // MJG   — coral / red
  "wedge-16", // EL    — deep blue
];

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

  // Map ZONE_WEDGE_IDS → indices into the live cells array. Filters
  // out any IDs that aren't in the current cells (defensive).
  const zoneIndices = useMemo(
    () =>
      ZONE_WEDGE_IDS.map((id) =>
        cells.findIndex((c) => c.wedgeId === id)
      ).filter((i) => i >= 0),
    [cells]
  );
  const zoneCells = useMemo(
    () => zoneIndices.map((i) => cells[i]),
    [zoneIndices, cells]
  );

  const cellOrder = useMemo(() => {
    // Hand-mapped clusters — matches the artist's intended visual
    // groupings exactly, no algorithm guessing. Each wedge maps to
    // a cluster name; clusters never split, only their order
    // changes between locked and unlocked states.
    const CLUSTER_BY_WEDGE: Record<string, string> = {
      "wedge-01": "pink",
      "wedge-02": "white",
      "wedge-03": "yellow",
      "wedge-04": "green",
      "wedge-05": "white",
      "wedge-06": "yellow",
      "wedge-07": "pink",
      "wedge-08": "pink",
      "wedge-09": "green",
      "wedge-10": "red",
      "wedge-11": "green",
      "wedge-12": "dark-cream",
      "wedge-13": "green",
      "wedge-14": "yellow",
      "wedge-15": "blue",
      "wedge-16": "blue",
    };
    // Default cluster ordering when no zone is locked — follows the
    // artist's reference layout (top-to-bottom in their screenshot).
    const DEFAULT_CLUSTER_ORDER = [
      "yellow",
      "pink",
      "white",
      "blue",
      "dark-cream",
      "red",
      "green",
    ];

    const n = cells.length;
    const clusterOf = (wedgeId: string) =>
      CLUSTER_BY_WEDGE[wedgeId] ?? "other";

    const clusterMembers: Record<string, number[]> = {};
    for (let i = 0; i < n; i++) {
      const c = clusterOf(cells[i].wedgeId);
      (clusterMembers[c] ??= []).push(i);
    }

    if (lockedZoneIdx === null) {
      // Default order — by DEFAULT_CLUSTER_ORDER, within cluster
      // light → dark.
      const ranking: number[] = [];
      for (const name of DEFAULT_CLUSTER_ORDER) {
        const members = clusterMembers[name];
        if (!members) continue;
        const sorted = [...members].sort(
          (a, b) => characteristicLchs[b].L - characteristicLchs[a].L
        );
        ranking.push(...sorted);
      }
      // Stragglers (any wedge not in DEFAULT_CLUSTER_ORDER).
      for (const name of Object.keys(clusterMembers)) {
        if (DEFAULT_CLUSTER_ORDER.includes(name)) continue;
        ranking.push(...clusterMembers[name]);
      }
      const order = new Array<number>(n);
      ranking.forEach((origIdx, sortedPos) => {
        order[origIdx] = sortedPos;
      });
      return order;
    }

    // Locked: locked cluster first, then other clusters ordered by
    // min perceptual distance from cluster member to locked colour.
    // Within each cluster, sort by per-piece distance.
    const targetWedgeIdx = zoneIndices[lockedZoneIdx];
    const target = characteristicLchs[targetWedgeIdx];
    const lockedCluster = clusterOf(cells[targetWedgeIdx].wedgeId);

    const distances = palettesLch.map((palette) => {
      let minD = Infinity;
      for (const lch of palette) {
        const d = colorDistance(lch, target);
        if (d < minD) minD = d;
      }
      return minD;
    });

    const clusterEntries = Object.entries(clusterMembers).map(
      ([name, members]) => {
        let minD = Infinity;
        for (const i of members) {
          if (distances[i] < minD) minD = distances[i];
        }
        return { name, members, minD };
      }
    );

    const sorted = clusterEntries.sort((a, b) => {
      // Locked cluster always first.
      if (a.name === lockedCluster && b.name !== lockedCluster) return -1;
      if (b.name === lockedCluster && a.name !== lockedCluster) return 1;
      return a.minD - b.minD;
    });

    for (const entry of sorted) {
      entry.members.sort((a, b) => distances[a] - distances[b]);
    }

    const ranking: number[] = [];
    for (const entry of sorted) ranking.push(...entry.members);
    const order = new Array<number>(n);
    ranking.forEach((origIdx, sortedPos) => {
      order[origIdx] = sortedPos;
    });
    return order;
  }, [
    cells,
    characteristicLchs,
    palettesLch,
    zoneIndices,
    lockedZoneIdx,
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
