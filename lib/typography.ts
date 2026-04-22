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
 *   - Spaces inside <em>…</em> titles become U+00A0 (non-breaking space)
 *     so italic titles never break mid-phrase.
 *
 * Skips HTML tags in the outer pass so attribute values are unaffected.
 */
export function preserveHyphens(html: string): string {
  const hyphenated = html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag, text) => {
    if (tag) return tag;
    let t = text as string;
    t = t.replace(/(\p{L}|\d)-(\p{L}|\d)/gu, "$1\u2011$2");
    t = t.replace(/(\p{L}|\d): (?=\p{L}|\d|$)/gu, "$1:\u00A0");
    t = t.replace(/(\p{L}|\d); (?=\p{L}|\d|$)/gu, "$1;\u00A0");
    return t;
  });
  return hyphenated.replace(/<em>([^<]*)<\/em>/g, (_m, content) =>
    `<em>${(content as string).replace(/ /g, "\u00A0")}</em>`
  );
}
