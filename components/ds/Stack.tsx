import type { ElementType, ReactNode, CSSProperties } from "react";

/**
 * Layout primitives.
 *
 * Stack — vertical column with gap scale.
 * Row — horizontal row with gap scale.
 * Container — max-width centered wrapper.
 *
 * Gap values use the DS scale (1=4px, 2=8px, 3=12px, 4=16px, 5=20px,
 * 6=24px, 8=32px, 12=48px). Not every value is exposed — extend the
 * CSS and the prop union when a real need shows up.
 */

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12;

type LayoutProps<T extends ElementType> = {
  as?: T;
  gap?: Gap;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Stack<T extends ElementType = "div">({
  as,
  gap,
  children,
  className = "",
  style,
}: LayoutProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const gapClass = gap !== undefined ? `ds-stack--gap-${gap}` : "";
  return (
    <Tag className={`ds-stack ${gapClass} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

type RowProps<T extends ElementType> = LayoutProps<T> & {
  baseline?: boolean;
  wrap?: boolean;
};

export function Row<T extends ElementType = "div">({
  as,
  gap,
  baseline,
  wrap,
  children,
  className = "",
  style,
}: RowProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const gapClass = gap !== undefined ? `ds-row--gap-${gap}` : "";
  const mods = [
    baseline ? "ds-row--baseline" : "",
    wrap ? "ds-row--wrap" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag
      className={`ds-row ${gapClass} ${mods} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

export function Container<T extends ElementType = "div">({
  as,
  padded = false,
  children,
  className = "",
  style,
}: {
  as?: T;
  /** Include gutter padding (--gutter) left and right. */
  padded?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const Tag = (as ?? "div") as ElementType;
  const padClass = padded ? "ds-container--padded" : "";
  return (
    <Tag
      className={`ds-container ${padClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}
