/** Color helpers for theming the page from the artwork's baked-in palette. */

export type RGB = { r: number; g: number; b: number };

/** Parse "rgb(255, 232, 0)" / "rgb(255 232 0)" / "#rrggbb" into RGB. */
export function parseColor(input: string): RGB | null {
  if (!input) return null;
  const s = input.trim();

  const m = s.match(
    /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i
  );
  if (m) {
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  const hex = s.match(/^#?([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  return null;
}

export function rgbStr({ r, g, b }: RGB, a?: number): string {
  return a == null ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}

const WHITE: RGB = { r: 244, g: 244, b: 244 };
// fixed near-black "dark room" ground — the artwork's colour lives in the hero
// and the glowing world-plate, not the flat page surface.
const GROUND: RGB = { r: 9, g: 9, b: 11 };

/**
 * Derive the page theme from the artwork's baked background colour. DARK-ROOM
 * model: the ground is a fixed near-black so the colourful world-plate + hero
 * glow against it (gallery / cinema), and ink is light. The iteration's actual
 * colour is exposed as --art (the literal colour, e.g. the colophon chip) and
 * --title-alt (the same hue lifted to a vivid, readable accent on the dark
 * ground — used for the GAMERS toggle and the spec values).
 */
export function deriveTheme(bg: RGB) {
  // a vivid, on-palette accent — the iteration's hue, saturated and set to a
  // fixed readable lightness so it always reads against the dark ground.
  const [h, s] = rgbToHsl(bg);
  const accentSat = Math.max(0.62, Math.min(1, s + 0.35));
  const titleAlt = hslToRgb(h, accentSat, 0.64);

  return {
    bg: rgbStr(GROUND),          // fixed dark ground
    ink: rgbStr(WHITE),          // light ink
    inkDim: rgbStr(WHITE, 0.5),
    hair: rgbStr(WHITE, 0.18),
    art: rgbStr(bg),             // the iteration's literal colour (chip)
    titleAlt: rgbStr(titleAlt),  // lifted accent (title toggle + spec values)
  };
}
export function rgbToHsl({ r, g, b }: RGB): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0));
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

/** HSL -> RGB. */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

