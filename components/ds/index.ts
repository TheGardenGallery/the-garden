/**
 * The Garden — design system primitives.
 *
 * Import from here to get typed access to all primitives:
 *   import { Stack, DisplayName, Eyebrow } from "@/components/ds";
 *
 * Layers (bottom → top):
 *   1. Tokens (CSS variables in globals.css :root — --ink, --paper, --gutter…)
 *   2. Primitives (this folder — Text, Stack, Link)
 *   3. Feature components (components/ExhibitionCard.tsx, Hero.tsx…)
 *   4. Pages (app/**)
 *
 * Rules of engagement:
 *   - Primitives never hardcode color, spacing, or font values — all come
 *     from CSS variables or ds-* classes that reference them.
 *   - Feature components compose primitives; they don't duplicate styles.
 *   - If you need a variant that doesn't exist, add it to the primitive
 *     (CSS + prop union), don't inline a style in the feature.
 */

export { DisplayName, DisplayTitle, Eyebrow, FieldLabel, MetaLine, Prose } from "./Text";
export { Stack, Row, Container } from "./Stack";
export { ContentLink, CtaLink } from "./Link";
