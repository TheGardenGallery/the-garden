/**
 * Shared arrow icons used alongside colophon links and navigation
 * affordances. One SVG family (same viewBox, stroke, cap style) so
 * the three directions read as a set and don't fall back to emoji
 * glyphs like ↗ on mobile OSes that render them inconsistently.
 */
const arrowSvgProps = {
  viewBox: "0 0 16 16",
  width: 13,
  height: 13,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowRight() {
  return (
    <svg {...arrowSvgProps}>
      <path d="M3 8 H13 M9 4.5 L12.5 8 L9 11.5" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg {...arrowSvgProps}>
      <path d="M8 3 V13 M4.5 9 L8 12.5 L11.5 9" />
    </svg>
  );
}

export function ArrowNE() {
  return (
    <svg {...arrowSvgProps}>
      <path d="M4 12 L12 4 M6.5 4 L12 4 L12 9.5" />
    </svg>
  );
}
