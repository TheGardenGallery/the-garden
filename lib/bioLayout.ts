import {
  prepareWithSegments,
  layoutNextLine,
  type LayoutCursor,
} from "@chenglou/pretext";

/**
 * Shared pretext-layout primitives for shape-aware bio rendering.
 * Used by `ShapedBio` (single column with exclusion) and `MagazineBio`
 * (two columns where the right column shapes against an artwork).
 */

export type LayoutResult = {
  lines: string[][];
  height: number;
};

/**
 * Lay out a list of paragraphs at a single uniform width. No exclusion
 * checks — every line gets the same `width`.
 */
export function layoutColumnUniform(
  paragraphs: string[],
  font: string,
  lineHeight: number,
  paragraphGap: number,
  width: number
): LayoutResult {
  const result: string[][] = [];
  let yInBio = 0;
  for (const para of paragraphs) {
    const prepared = prepareWithSegments(para, font);
    const lines: string[] = [];
    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    for (let i = 0; i < 1000; i++) {
      const next = layoutNextLine(prepared, cursor, width);
      if (!next) break;
      lines.push(next.text);
      cursor = next.end;
      yInBio += lineHeight;
    }
    result.push(lines);
    yInBio += paragraphGap;
  }
  const height = Math.max(0, yInBio - paragraphGap);
  return { lines: result, height };
}

/**
 * Lay out a column with shape exclusion: lines whose vertical span
 * overlaps the artwork's range render at `shapedWidth`; lines clear
 * of it render at `fullWidth`. `bioTop` is the column's top in
 * parent border-box-relative coords (caller supplies, since it
 * depends on flex centering math).
 */
export function layoutColumnShaped(
  paragraphs: string[],
  font: string,
  lineHeight: number,
  paragraphGap: number,
  bioTop: number,
  fullWidth: number,
  shapedWidth: number,
  artworkTop: number,
  artworkBottom: number
): LayoutResult {
  const result: string[][] = [];
  let yInBio = 0;
  for (const para of paragraphs) {
    const prepared = prepareWithSegments(para, font);
    const lines: string[] = [];
    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    for (let i = 0; i < 1000; i++) {
      const lineTop = bioTop + yInBio;
      const lineBottom = lineTop + lineHeight;
      const inExclusion =
        lineBottom > artworkTop && lineTop < artworkBottom;
      const w = inExclusion ? shapedWidth : fullWidth;
      const next = layoutNextLine(prepared, cursor, w);
      if (!next) break;
      lines.push(next.text);
      cursor = next.end;
      yInBio += lineHeight;
    }
    result.push(lines);
    yInBio += paragraphGap;
  }
  const height = Math.max(0, yInBio - paragraphGap);
  return { lines: result, height };
}

/**
 * Iteratively refine a column's layout: each pass derives `bioTop`
 * from the flex centering area + the previous pass's height, runs
 * `layoutFn(bioTop)`, and stops when height is stable. Catches the
 * circular dependency between bio.height and bio.top.
 *
 * `baseHeight` floors the group height — used by magazine layouts
 * where the right column should center against the *taller* of the
 * two columns, not its own height.
 */
export function refineColumn(
  layoutFn: (bioTop: number) => LayoutResult,
  flexAreaCenter: number,
  siblingExtent: number,
  baseHeight = 0,
  maxPasses = 8
): LayoutResult {
  let height = 0;
  let last: LayoutResult = { lines: [], height: 0 };
  for (let pass = 0; pass < maxPasses; pass++) {
    const groupHeight = Math.max(height, baseHeight) + siblingExtent;
    const bioTop = flexAreaCenter - groupHeight / 2;
    last = layoutFn(bioTop);
    if (Math.abs(last.height - height) < 0.5) break;
    height = last.height;
  }
  return last;
}

/**
 * Split a paragraph list into two halves whose total character
 * counts are roughly equal. Used by magazine layout to balance
 * left/right columns without a full pretext pre-pass for line
 * counting (close enough at this scale).
 */
export function splitParagraphsByChars(
  paragraphs: string[]
): [string[], string[]] {
  const totalChars = paragraphs.reduce((s, p) => s + p.length, 0);
  const halfChars = totalChars / 2;
  let acc = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    acc += paragraphs[i].length;
    if (acc >= halfChars) {
      return [paragraphs.slice(0, i + 1), paragraphs.slice(i + 1)];
    }
  }
  return [paragraphs, []];
}
