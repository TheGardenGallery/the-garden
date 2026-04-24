import type { ReactNode } from "react";

type Plant = {
  keyword: string;
  sentence: string;
  svg: ReactNode;
};

const svgProps = {
  viewBox: "0 0 100 100",
  preserveAspectRatio: "xMidYMid meet" as const,
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  shapeRendering: "geometricPrecision" as const,
  "aria-hidden": true,
} as const;

/* ─── Shared grid constants ─────────────────────────────────────── */
const AXIS_X = 50;
const BASE_Y = 95;
const N1_Y = 75; // leaf node
const N2_Y = 55; // branch node
const N3_Y = 35; // resolution node

/* ─── Primitive components ──────────────────────────────────────── */

const Base = () => (
  <circle cx={AXIS_X} cy={BASE_Y} r={2.5} fill="currentColor" stroke="none" />
);

const Node = ({ cx, cy }: { cx: number; cy: number }) => (
  <circle cx={cx} cy={cy} r={2} pathLength={1} />
);

const Axis = ({ toY }: { toY: number }) => (
  <line x1={AXIS_X} y1={BASE_Y} x2={AXIS_X} y2={toY} pathLength={1} />
);

const Leaf = ({ side, y = N1_Y }: { side: "left" | "right"; y?: number }) => {
  const tipX = side === "left" ? 30 : 70;
  const ctrlX = side === "left" ? 40 : 60;
  return (
    <path
      d={`M50 ${y} Q${ctrlX} ${y - 5} ${tipX} ${y} Q${ctrlX} ${y + 5} 50 ${y} Z`}
      pathLength={1}
    />
  );
};

// Petal at `angle` degrees from "up" (0° = straight up, clockwise positive).
// Rotation lives on the <path> itself (not a <g> wrapper) so each petal stays a
// direct child of <svg> — :nth-child sequencing depends on that flat structure.
const Petal = ({ angle, cy = N3_Y }: { angle: number; cy?: number }) => {
  const tipX = 70;
  const ctrlX = 60;
  const d = `M50 ${cy} Q${ctrlX} ${cy - 5} ${tipX} ${cy} Q${ctrlX} ${cy + 5} 50 ${cy} Z`;
  return (
    <path
      d={d}
      pathLength={1}
      transform={`rotate(${angle - 90} ${AXIS_X} ${cy})`}
    />
  );
};

/**
 * Six stages on a single shared grid (viewBox 100×100).
 * Every icon is built strictly from: filled node (r=2.5), hollow node (r=2),
 * axis line, leaf path (identical geometry), and petals (leaf rotated around
 * a filled center). Growth logic:
 *
 *   1. DURATION       axis first-step — growth without anchor
 *   2. STRUCTURE      axis to N1, anchor marked
 *   3. FORM           axis to N2, single leaf at N1
 *   4. ATTENTION      axis to N3, paired leaves at N1
 *   5. COLLABORATION  axis to N3 + parallel vertical branches N1→N3
 *   6. PERMANENCE     axis to N3, paired leaves at N1, filled center at N3,
 *                     five petals rotated at 72° around the center
 */

function DurationPlant() {
  return (
    <svg {...svgProps}>
      <Base />
    </svg>
  );
}

function StructurePlant() {
  return (
    <svg {...svgProps}>
      <Base />
      <Axis toY={N1_Y} />
      <Node cx={AXIS_X} cy={N1_Y} />
    </svg>
  );
}

function FormPlant() {
  return (
    <svg {...svgProps}>
      <Base />
      <Axis toY={N2_Y} />
      <Leaf side="left" />
      <Node cx={AXIS_X} cy={N2_Y} />
    </svg>
  );
}

function AttentionPlant() {
  return (
    <svg {...svgProps}>
      <Base />
      <Axis toY={N2_Y} />
      <Leaf side="left" />
      <Leaf side="right" />
      <Node cx={AXIS_X} cy={N2_Y} />
    </svg>
  );
}

function CollaborationPlant() {
  return (
    <svg {...svgProps}>
      <Base />
      <Axis toY={N2_Y} />
      <Leaf side="left" />
      <Leaf side="right" />
      <circle cx={AXIS_X} cy={N2_Y} r={2.5} fill="currentColor" stroke="none" />
      <Petal angle={315} cy={N2_Y} />
      <Petal angle={0} cy={N2_Y} />
      <Petal angle={45} cy={N2_Y} />
    </svg>
  );
}

function PermanencePlant() {
  return (
    <svg {...svgProps}>
      <Base />
      <Axis toY={N3_Y} />
      <Leaf side="left" />
      <Leaf side="right" />
      <circle cx={AXIS_X} cy={N3_Y} r={2.5} fill="currentColor" stroke="none" />
      <Petal angle={0} />
      <Petal angle={72} />
      <Petal angle={144} />
      <Petal angle={216} />
      <Petal angle={288} />
    </svg>
  );
}

const plants: Plant[] = [
  { keyword: "Duration",      sentence: "Time committed",     svg: <DurationPlant /> },
  { keyword: "Structure",     sentence: "Framework shaped",   svg: <StructurePlant /> },
  { keyword: "Form",          sentence: "Work dignified",     svg: <FormPlant /> },
  { keyword: "Attention",     sentence: "Focus tended",       svg: <AttentionPlant /> },
  { keyword: "Collaboration", sentence: "Dialogue sustained", svg: <CollaborationPlant /> },
  { keyword: "Permanence",    sentence: "Record preserved",   svg: <PermanencePlant /> },
];

export function PrinciplesGarden() {
  return (
    <div className="principles-garden">
      {plants.map((p) => (
        <figure key={p.keyword} className="principles-plant">
          <div className="principles-plant-svg">{p.svg}</div>
          <figcaption className="principles-plant-caption">
            <span className="principles-plant-keyword">{p.keyword}</span>
            <span className="principles-plant-sentence">{p.sentence}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Small quatrefoil glyph used to invite visitors into the garden.
    Sized inline with italic caption type; explicit width/height keep it
    constrained regardless of flex context. */
export function GardenMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      stroke="currentColor"
      strokeWidth={1}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="3.5" cy="3.5" r="2" />
      <circle cx="8.5" cy="3.5" r="2" />
      <circle cx="3.5" cy="8.5" r="2" />
      <circle cx="8.5" cy="8.5" r="2" />
    </svg>
  );
}
