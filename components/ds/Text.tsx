import type { ElementType, ReactNode, CSSProperties } from "react";

/**
 * Typography primitives.
 *
 * Each primitive wraps one semantic role and exposes size variants where
 * the design system has them. Callers never touch font-family, weight,
 * tracking, or case — those are the primitive's job.
 *
 * Escape hatches: `as` for semantic tag, `className` for one-off layout
 * (margin/width), `style` for truly dynamic values. Don't reach for these
 * to restyle typography — add a variant to the primitive instead.
 */

type BaseProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/* ---------- DISPLAY NAME (Cormorant 500 uppercase) ---------- */

type DisplayNameSize = "sm" | "md" | "lg" | "xl" | "2xl";

export function DisplayName<T extends ElementType = "span">({
  as,
  size = "md",
  children,
  className = "",
  style,
}: BaseProps<T> & { size?: DisplayNameSize }) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={`ds-display-name ds-display-name--${size} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ---------- DISPLAY TITLE (Cormorant 400 italic) ---------- */

type DisplayTitleSize = "sm" | "md" | "lg" | "xl" | "2xl";

export function DisplayTitle<T extends ElementType = "span">({
  as,
  size = "md",
  children,
  className = "",
  style,
}: BaseProps<T> & { size?: DisplayTitleSize }) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={`ds-display-title ds-display-title--${size} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ---------- EYEBROW (Barlow 500 11px uppercase) ---------- */

export function Eyebrow<T extends ElementType = "span">({
  as,
  children,
  className = "",
  style,
}: BaseProps<T>) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag className={`ds-eyebrow ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

/* ---------- FIELD LABEL (small whisper-tone label) ---------- */

type FieldLabelSize = "xs" | "sm";

export function FieldLabel<T extends ElementType = "span">({
  as,
  size = "sm",
  children,
  className = "",
  style,
}: BaseProps<T> & { size?: FieldLabelSize }) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={`ds-field-label ds-field-label--${size} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ---------- META LINE (dates, locations, card meta) ---------- */

type MetaTone = "ink" | "muted" | "whisper" | "on-dark";

export function MetaLine<T extends ElementType = "span">({
  as,
  tone = "whisper",
  children,
  className = "",
  style,
}: BaseProps<T> & { tone?: MetaTone }) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={`ds-meta ds-meta--${tone} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ---------- PROSE (body paragraph, Cormorant, oldstyle figures) ---------- */

export function Prose({
  children,
  className = "",
  html,
}: {
  children?: ReactNode;
  className?: string;
  /** Use for server-rendered HTML strings that contain <em>, <a class="prose-link">. */
  html?: string;
}) {
  if (html !== undefined) {
    return (
      <p
        className={`ds-prose ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <p className={`ds-prose ${className}`.trim()}>{children}</p>;
}
