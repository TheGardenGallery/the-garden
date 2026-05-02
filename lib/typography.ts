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
