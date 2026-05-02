/**
 * Light typographic cleanup for editorial prose — applied to exhibition
 * descriptions, artist bios, and similar HTML-bearing copy. Strictly
 * cosmetic: no structural edits, no content changes.
 *
 *   - Hyphens between letters/digits become U+2011 (non-breaking hyphen)
 *     so compound words like "dot-matrix" don't break across lines.
 *   - The space after a colon or semicolon becomes U+00A0 so the
 *     punctuation can't be stranded at end of line — including when the
 *     next token is an HTML tag like <em> (matched via end-of-chunk $).
 *   - Whitespace immediately before an em dash becomes U+00A0 so the
 *     dash binds to the preceding word and never orphans to the start
 *     of the next line.
 *   - Spaces inside short <em>…</em> titles become U+00A0 (non-breaking
 *     space) so italic titles never break mid-phrase. Long em blocks
 *     (60+ chars) are quotes or sentences that need to wrap normally
 *     inside the prose column, so they're left alone.
 *
 * Skips HTML tags in the outer pass so attribute values are unaffected.
 */
export function preserveHyphens(html: string): string {
  const hyphenated = html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag, text) => {
    if (tag) return tag;
    let t = text as string;
    t = t.replace(/(\p{L}|\d)-(\p{L}|\d)/gu, "$1‑$2");
    t = t.replace(/(\p{L}|\d): (?=\p{L}|\d|$)/gu, "$1: ");
    t = t.replace(/(\p{L}|\d); (?=\p{L}|\d|$)/gu, "$1; ");
    return t;
  });
  const emNoBreak = hyphenated.replace(/<em>([^<]*)<\/em>/g, (m, content) => {
    const text = content as string;
    if (text.length >= 60) return m;
    return `<em>${text.replace(/ /g, " ")}</em>`;
  });
  // Bind em dashes to whatever precedes them, even across tag boundaries
  // (e.g. "</em> &mdash;" → "</em> &mdash;"). Replaces the single
  // whitespace immediately before an em dash entity or literal U+2014.
  return emNoBreak.replace(/\s(&mdash;|—)/g, " $1");
}

/**
 * Pre-clean markdown coming from external sources (Verse's `about`
 * field) before passing it to the strict CommonMark parser.
 *
 * The Verse copy frequently contains italic phrases written like
 * `* INFINITE PRESSURE*` — i.e. with whitespace immediately inside the
 * asterisks. CommonMark refuses to treat that as italic (an opening
 * `*` must not be followed by whitespace; a closing `*` must not be
 * preceded by it) and renders the asterisks literally. This trims the
 * inner whitespace so author intent is preserved.
 *
 * Conservative: only matches `*…*` runs that stay on a single line and
 * don't nest other asterisks, so `**bold**`, list bullets at line
 * start, and trailing footnote markers (`text*`) are unaffected.
 */
export function normalizeMarkdownItalics(md: string): string {
  return md.replace(/\*([^\n*]+?)\*/g, (full, inner) => {
    const trimmed = (inner as string).trim();
    if (!trimmed) return full; // `* *` etc — leave alone
    // Replace internal spaces with U+00A0 (non-breaking space) so
    // line-break-based renderers — pretext shaping in the artist bio,
    // and any CSS line wrap — can't split the italic phrase across
    // lines. If they did, the asterisk pair would no longer share a
    // single line, and the markdown/regex parsers downstream would
    // fail to match — leaving literal asterisks on each fragment.
    const atomic = trimmed.replace(/ /g, " ");
    return `*${atomic}*`;
  });
}

/**
 * Convert single-line `*…*` markdown italics into HTML `<em>…</em>`.
 * Use when prose from an external source (Verse bios, etc.) is about
 * to be rendered via `dangerouslySetInnerHTML` — i.e. markdown won't
 * be parsed by the consumer, so we have to do the substitution
 * ourselves. Trims inner whitespace defensively (Verse's copy often
 * has `* TEXT *` with leading/trailing spaces).
 *
 * Same conservative match as normalizeMarkdownItalics: single-line
 * runs only, no nested asterisks, leaves bullets and footnote markers
 * alone.
 */
export function markdownItalicsToHtml(text: string): string {
  return text.replace(/\*([^\n*]+?)\*/g, (full, inner) => {
    const trimmed = (inner as string).trim();
    if (!trimmed) return full;
    return `<em>${trimmed}</em>`;
  });
}
