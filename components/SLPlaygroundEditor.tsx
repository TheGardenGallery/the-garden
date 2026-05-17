"use client";

import { useMemo, useRef, useState } from "react";

// Seed state — mirrors the current ADJACENCY_GROUPS / RAINBOW_IDS in
// components/SplitLogicSystem.tsx as of the last edit. Drag pieces
// around, then copy the export back into SplitLogicSystem.tsx.
const SEED_RAINBOW: string[] = [
  "sl-001",
  "sl-002",
  "sl-003",
  "sl-004",
  "sl-094",
  "sl-095",
  "sl-096",
];

const SEED_GROUPS: string[][] = [
  ["sl-007", "sl-012", "sl-099"],
  ["sl-098", "sl-037", "sl-027", "sl-087", "sl-049"],
  ["sl-093", "sl-013"],
  ["sl-078", "sl-070", "sl-020"],
  ["sl-060", "sl-046", "sl-050", "sl-063", "sl-016"],
  ["sl-015", "sl-076", "sl-067", "sl-066", "sl-073", "sl-038", "sl-064", "sl-008", "sl-086", "sl-080"],
  ["sl-036", "sl-033", "sl-034", "sl-044", "sl-018", "sl-058", "sl-092", "sl-028"],
  ["sl-075", "sl-045", "sl-042"],
  ["sl-077", "sl-100", "sl-019", "sl-061", "sl-069", "sl-065", "sl-025", "sl-079", "sl-043", "sl-051", "sl-017", "sl-047", "sl-085"],
  ["sl-009", "sl-056", "sl-053", "sl-068", "sl-090"],
  ["sl-057", "sl-022", "sl-088"],
  ["sl-024", "sl-035"],
  ["sl-062", "sl-055", "sl-021", "sl-059", "sl-071"],
  ["sl-039"],
  ["sl-005", "sl-006", "sl-011", "sl-010"],
  ["sl-030", "sl-040", "sl-029", "sl-041"],
  ["sl-089", "sl-083", "sl-031", "sl-032", "sl-081"],
  ["sl-084", "sl-048"],
];

const ALL_IDS: string[] = Array.from({ length: 100 }, (_, i) =>
  `sl-${String(i + 1).padStart(3, "0")}`,
);

const RAINBOW_LANE_ID = "__rainbow__";
const UNGROUPED_LANE_ID = "__ungrouped__";

type Lane = {
  id: string;
  label: string;
  locked?: boolean;
  pieces: string[];
};

function initialLanes(): Lane[] {
  const lanes: Lane[] = [];
  lanes.push({
    id: RAINBOW_LANE_ID,
    label: "Rainbow (locked — multi-colour)",
    locked: true,
    pieces: [...SEED_RAINBOW],
  });
  SEED_GROUPS.forEach((group, idx) => {
    lanes.push({
      id: `g-${idx}`,
      label: `Group ${idx + 1}`,
      pieces: [...group],
    });
  });
  const used = new Set<string>([...SEED_RAINBOW, ...SEED_GROUPS.flat()]);
  const ungrouped = ALL_IDS.filter((id) => !used.has(id));
  lanes.push({
    id: UNGROUPED_LANE_ID,
    label: "Ungrouped (drop here to remove from a cluster)",
    pieces: ungrouped,
  });
  return lanes;
}

type DragPayload = {
  laneId: string;
  pieceId: string;
};

export function SLPlaygroundEditor() {
  const [lanes, setLanes] = useState<Lane[]>(() => initialLanes());
  const [hoverTarget, setHoverTarget] = useState<{
    laneId: string;
    index: number;
  } | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const dragRef = useRef<DragPayload | null>(null);
  const nextGroupNumRef = useRef(SEED_GROUPS.length + 1);

  const flatOrder = useMemo(() => {
    return lanes
      .filter((l) => l.id !== UNGROUPED_LANE_ID && l.id !== RAINBOW_LANE_ID)
      .flatMap((l) => l.pieces);
  }, [lanes]);

  function handleDragStart(laneId: string, pieceId: string) {
    dragRef.current = { laneId, pieceId };
  }

  function handleDragEnd() {
    dragRef.current = null;
    setHoverTarget(null);
  }

  function handleDropAt(targetLaneId: string, targetIndex: number) {
    const payload = dragRef.current;
    if (!payload) return;
    if (
      targetLaneId === RAINBOW_LANE_ID ||
      payload.laneId === RAINBOW_LANE_ID
    ) {
      // Rainbow lane is locked — pieces can't enter or leave it from
      // this UI. Source of truth: the RAINBOW_IDS Set in
      // SplitLogicSystem.tsx; multi-colour mosaics belong there by
      // design, not by drag.
      dragRef.current = null;
      setHoverTarget(null);
      return;
    }
    setLanes((prev) => {
      const next = prev.map((l) => ({ ...l, pieces: [...l.pieces] }));
      const srcLane = next.find((l) => l.id === payload.laneId);
      const dstLane = next.find((l) => l.id === targetLaneId);
      if (!srcLane || !dstLane) return prev;
      const srcIdx = srcLane.pieces.indexOf(payload.pieceId);
      if (srcIdx === -1) return prev;
      srcLane.pieces.splice(srcIdx, 1);
      let insertAt = targetIndex;
      if (srcLane === dstLane && srcIdx < targetIndex) insertAt -= 1;
      insertAt = Math.max(0, Math.min(insertAt, dstLane.pieces.length));
      dstLane.pieces.splice(insertAt, 0, payload.pieceId);
      return next;
    });
    dragRef.current = null;
    setHoverTarget(null);
  }

  function addLane() {
    setLanes((prev) => {
      const idx = nextGroupNumRef.current++;
      const newLane: Lane = {
        id: `g-new-${idx}-${Date.now()}`,
        label: `Group ${idx}`,
        pieces: [],
      };
      // Insert before the ungrouped lane.
      const ungroupedIdx = prev.findIndex((l) => l.id === UNGROUPED_LANE_ID);
      const out = [...prev];
      const at = ungroupedIdx === -1 ? out.length : ungroupedIdx;
      out.splice(at, 0, newLane);
      return out;
    });
  }

  function deleteLane(laneId: string) {
    setLanes((prev) => {
      const target = prev.find((l) => l.id === laneId);
      if (!target || target.locked) return prev;
      if (target.id === UNGROUPED_LANE_ID) return prev;
      const ungrouped = prev.find((l) => l.id === UNGROUPED_LANE_ID);
      if (!ungrouped) return prev;
      return prev
        .map((l) => {
          if (l.id === UNGROUPED_LANE_ID) {
            return { ...l, pieces: [...l.pieces, ...target.pieces] };
          }
          return l;
        })
        .filter((l) => l.id !== laneId);
    });
  }

  function renameLane(laneId: string, label: string) {
    setLanes((prev) =>
      prev.map((l) => (l.id === laneId ? { ...l, label } : l)),
    );
  }

  function moveLane(laneId: string, dir: -1 | 1) {
    setLanes((prev) => {
      const idx = prev.findIndex((l) => l.id === laneId);
      if (idx === -1) return prev;
      const lane = prev[idx];
      if (lane.locked || lane.id === UNGROUPED_LANE_ID) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const neighbour = prev[target];
      if (neighbour.locked || neighbour.id === UNGROUPED_LANE_ID) return prev;
      const out = [...prev];
      out[idx] = neighbour;
      out[target] = lane;
      return out;
    });
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg(`${label} copied to clipboard.`);
    } catch {
      setCopyMsg("Clipboard blocked — see the export panel below.");
    }
    window.setTimeout(() => setCopyMsg(null), 2400);
  }

  const exportGroupsCode = useMemo(() => {
    const groupLanes = lanes.filter(
      (l) => l.id !== RAINBOW_LANE_ID && l.id !== UNGROUPED_LANE_ID,
    );
    const body = groupLanes
      .filter((l) => l.pieces.length > 0)
      .map((l) => {
        const ids = l.pieces.map((p) => `"${p}"`).join(", ");
        return `  [${ids}],`;
      })
      .join("\n");
    return `const ADJACENCY_GROUPS: string[][] = [\n${body}\n];`;
  }, [lanes]);

  const exportFlatOrder = useMemo(() => {
    return flatOrder.join(", ");
  }, [flatOrder]);

  const ungroupedCount =
    lanes.find((l) => l.id === UNGROUPED_LANE_ID)?.pieces.length ?? 0;

  return (
    <div className="slp">
      <header className="slp-head">
        <div className="slp-head-row">
          <h1>Split Logic — Cluster Playground</h1>
          <div className="slp-stat">
            {flatOrder.length} clustered · {ungroupedCount} ungrouped
          </div>
        </div>
        <p className="slp-help">
          Drag pieces between rows to refine clusters. Each row becomes one
          ADJACENCY_GROUPS entry. The rainbow row is locked.
        </p>
        <div className="slp-toolbar">
          <button type="button" onClick={addLane}>
            + Add cluster
          </button>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(exportGroupsCode, "ADJACENCY_GROUPS code")
            }
          >
            Copy ADJACENCY_GROUPS
          </button>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(exportFlatOrder, "Flat ID order")
            }
          >
            Copy flat order
          </button>
          {copyMsg && <span className="slp-flash">{copyMsg}</span>}
        </div>
      </header>

      <main className="slp-lanes">
        {lanes.map((lane, laneIdx) => (
          <LaneRow
            key={lane.id}
            lane={lane}
            laneIdx={laneIdx}
            laneCount={lanes.length}
            hoverTarget={hoverTarget}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDropAt={handleDropAt}
            onHoverTarget={setHoverTarget}
            onRename={renameLane}
            onDelete={deleteLane}
            onMove={moveLane}
          />
        ))}
      </main>

      <section className="slp-export">
        <h2>ADJACENCY_GROUPS export</h2>
        <pre>{exportGroupsCode}</pre>
        <h2>Flat order</h2>
        <pre>{exportFlatOrder}</pre>
      </section>

      <style jsx>{`
        .slp {
          min-height: 100vh;
          background: #f4efe6;
          color: #1a1a1a;
          padding: 32px clamp(16px, 3vw, 48px) 96px;
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
            sans-serif;
        }
        .slp-head h1 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(28px, 4vw, 42px);
          margin: 0;
        }
        .slp-head-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .slp-stat {
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .slp-help {
          font-size: 14px;
          opacity: 0.7;
          margin: 8px 0 18px;
          max-width: 720px;
        }
        .slp-toolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          margin-bottom: 22px;
        }
        .slp-toolbar button {
          background: #1a1a1a;
          color: #f4efe6;
          border: 0;
          padding: 8px 14px;
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
        }
        .slp-toolbar button:hover {
          background: #000;
        }
        .slp-flash {
          font-size: 13px;
          opacity: 0.8;
          margin-left: 6px;
        }
        .slp-lanes {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .slp-export {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.12);
        }
        .slp-export h2 {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 20px;
          margin: 18px 0 8px;
        }
        .slp-export pre {
          background: #1a1a1a;
          color: #f4efe6;
          padding: 16px;
          border-radius: 4px;
          font-size: 12px;
          line-height: 1.6;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}

function LaneRow({
  lane,
  laneIdx,
  laneCount,
  hoverTarget,
  onDragStart,
  onDragEnd,
  onDropAt,
  onHoverTarget,
  onRename,
  onDelete,
  onMove,
}: {
  lane: Lane;
  laneIdx: number;
  laneCount: number;
  hoverTarget: { laneId: string; index: number } | null;
  onDragStart: (laneId: string, pieceId: string) => void;
  onDragEnd: () => void;
  onDropAt: (laneId: string, index: number) => void;
  onHoverTarget: (t: { laneId: string; index: number } | null) => void;
  onRename: (laneId: string, label: string) => void;
  onDelete: (laneId: string) => void;
  onMove: (laneId: string, dir: -1 | 1) => void;
}) {
  const isLocked = !!lane.locked;
  const isUngrouped = lane.id === UNGROUPED_LANE_ID;
  return (
    <section className={`lane${isLocked ? " lane-locked" : ""}${
      isUngrouped ? " lane-ungrouped" : ""
    }`}>
      <header className="lane-head">
        {isLocked || isUngrouped ? (
          <span className="lane-label-static">{lane.label}</span>
        ) : (
          <input
            className="lane-label-input"
            value={lane.label}
            onChange={(e) => onRename(lane.id, e.target.value)}
          />
        )}
        <span className="lane-count">{lane.pieces.length}</span>
        {!isLocked && !isUngrouped && (
          <div className="lane-actions">
            <button
              type="button"
              onClick={() => onMove(lane.id, -1)}
              disabled={laneIdx <= 1}
              title="Move cluster up"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(lane.id, 1)}
              disabled={laneIdx >= laneCount - 2}
              title="Move cluster down"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onDelete(lane.id)}
              title="Delete cluster (pieces move to ungrouped)"
            >
              ✕
            </button>
          </div>
        )}
      </header>
      <div
        className="lane-strip"
        onDragOver={(e) => {
          if (isLocked) return;
          e.preventDefault();
          if (lane.pieces.length === 0) {
            onHoverTarget({ laneId: lane.id, index: 0 });
          }
        }}
        onDrop={(e) => {
          if (isLocked) return;
          e.preventDefault();
          if (lane.pieces.length === 0) onDropAt(lane.id, 0);
        }}
      >
        {lane.pieces.length === 0 && (
          <div className="lane-empty">drop pieces here</div>
        )}
        {lane.pieces.map((id, i) => (
          <PieceCard
            key={id}
            id={id}
            laneId={lane.id}
            index={i}
            locked={isLocked}
            isHoverBefore={
              hoverTarget?.laneId === lane.id && hoverTarget.index === i
            }
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDropAt={onDropAt}
            onHoverTarget={onHoverTarget}
          />
        ))}
        {/* Tail drop zone — append to end of lane. */}
        {!isLocked && lane.pieces.length > 0 && (
          <div
            className={`drop-tail${
              hoverTarget?.laneId === lane.id &&
              hoverTarget.index === lane.pieces.length
                ? " drop-tail-active"
                : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              onHoverTarget({ laneId: lane.id, index: lane.pieces.length });
            }}
            onDrop={(e) => {
              e.preventDefault();
              onDropAt(lane.id, lane.pieces.length);
            }}
          />
        )}
      </div>
      <style jsx>{`
        .lane {
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 6px;
          padding: 10px 12px 12px;
        }
        .lane-locked {
          background: rgba(0, 0, 0, 0.04);
          border-style: dashed;
        }
        .lane-ungrouped {
          background: rgba(255, 255, 255, 0.3);
          border-style: dashed;
        }
        .lane-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .lane-label-static {
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0.65;
        }
        .lane-label-input {
          background: transparent;
          border: 0;
          border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #1a1a1a;
          padding: 2px 4px;
          font-family: inherit;
          min-width: 140px;
        }
        .lane-label-input:focus {
          outline: none;
          border-bottom-color: #1a1a1a;
        }
        .lane-count {
          font-size: 12px;
          opacity: 0.55;
          font-variant-numeric: tabular-nums;
        }
        .lane-actions {
          margin-left: auto;
          display: flex;
          gap: 4px;
        }
        .lane-actions button {
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: #1a1a1a;
          width: 24px;
          height: 24px;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          border-radius: 2px;
        }
        .lane-actions button:disabled {
          opacity: 0.25;
          cursor: default;
        }
        .lane-actions button:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.06);
        }
        .lane-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          min-height: 96px;
          align-items: flex-start;
        }
        .lane-empty {
          font-size: 12px;
          opacity: 0.4;
          align-self: center;
          padding: 24px;
          font-style: italic;
        }
        .drop-tail {
          width: 12px;
          height: 88px;
          border-radius: 2px;
          align-self: stretch;
        }
        .drop-tail-active {
          background: rgba(0, 0, 0, 0.18);
        }
      `}</style>
    </section>
  );
}

function PieceCard({
  id,
  laneId,
  index,
  locked,
  isHoverBefore,
  onDragStart,
  onDragEnd,
  onDropAt,
  onHoverTarget,
}: {
  id: string;
  laneId: string;
  index: number;
  locked: boolean;
  isHoverBefore: boolean;
  onDragStart: (laneId: string, pieceId: string) => void;
  onDragEnd: () => void;
  onDropAt: (laneId: string, index: number) => void;
  onHoverTarget: (t: { laneId: string; index: number } | null) => void;
}) {
  const shortLabel = id.replace(/^sl-0*/, "");
  return (
    <div
      className={`pc${locked ? " pc-locked" : ""}${
        isHoverBefore ? " pc-hover-before" : ""
      }`}
      draggable={!locked}
      onDragStart={() => onDragStart(laneId, id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (locked) return;
        e.preventDefault();
        // Use cursor X within the card's bounding rect to decide
        // whether to insert before or after — feels more natural than
        // always-before.
        const rect = e.currentTarget.getBoundingClientRect();
        const before = e.clientX - rect.left < rect.width / 2;
        onHoverTarget({ laneId, index: before ? index : index + 1 });
      }}
      onDragLeave={() => {
        // No-op; the next onDragOver will replace the target.
      }}
      onDrop={(e) => {
        if (locked) return;
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const before = e.clientX - rect.left < rect.width / 2;
        onDropAt(laneId, before ? index : index + 1);
      }}
      title={id}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/ricky-retouch/works/${id}.jpg`}
        alt={id}
        loading="lazy"
        draggable={false}
      />
      <span className="pc-label">{shortLabel}</span>
      <style jsx>{`
        .pc {
          position: relative;
          width: 84px;
          height: 84px;
          background: #1a1a1a;
          border-radius: 3px;
          overflow: hidden;
          cursor: grab;
          flex: 0 0 auto;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .pc:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
        .pc:active {
          cursor: grabbing;
        }
        .pc-locked {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .pc-hover-before {
          box-shadow: -4px 0 0 0 #1a1a1a, 0 4px 10px rgba(0, 0, 0, 0.12);
        }
        .pc img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
        }
        .pc-label {
          position: absolute;
          left: 4px;
          bottom: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #fff;
          padding: 1px 5px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 2px;
          letter-spacing: 0.04em;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
