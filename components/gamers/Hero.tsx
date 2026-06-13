"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseColor, deriveTheme } from "@/lib/gamers/color";
import DashedFrame from "@/components/gamers/DashedFrame";
import HashReadout from "@/components/gamers/HashReadout";

/** Generate a valid fxhash seed: "oo" + 49 base58-ish chars. */
function makeFxHash(): string {
  const alphabet =
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let s = "oo";
  const rnd = new Uint32Array(49);
  crypto.getRandomValues(rnd);
  for (let i = 0; i < 49; i++) s += alphabet[rnd[i] % alphabet.length];
  return s;
}

/**
 * Hero: embeds the exact generative piece in a fixed-size iframe and contain-
 * scales it with a CSS transform to fit the stage (the piece bakes its canvas +
 * camera on boot and cannot reflow, so we never resize the iframe — only the
 * scale factor changes). The iframe postMessages its baked palette colour out;
 * we derive the page theme (--bg/--ink/--art/--title-alt) from it on :root.
 *
 * Re-roll = a fresh fxhash seed + iframe remount = a new iteration.
 */
export default function Hero() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [nonce, setNonce] = useState(0); // remount counter
  const [seed, setSeed] = useState<string | null>(null); // explicit fxhash on re-roll
  const [stage, setStage] = useState({ w: 0, h: 0 });

  // The piece bakes its canvas size + HUD layout + camera on boot and cannot
  // reflow. So we boot it ONCE at a fixed base resolution and never resize the
  // iframe — that keeps the artwork perfectly composed (no internal crop or
  // letterbox). To fit any stage size we just uniformly SCALE that fixed iframe
  // with a CSS transform (like object-fit: contain). Resizing only changes the
  // scale factor — no remount, no reboot, no reflow jank, never crops.
  //
  // The piece reads window.innerWidth to size its canvas; below ~1700px wide
  // the HUD elements (DAMAGE, hash readout, corner brackets) get cropped at
  // the canvas edges, so the iframe boots at a safe high base. The visual
  // "artifacting" complaint at 2100 wasn't from too many pixels — it was the
  // nearest-neighbor downscale aliasing. Switching the canvas's
  // image-rendering from `pixelated` to `auto` (see piece/index.html) makes
  // the scale smooth instead of jaggy.
  const BASE_W = 2100;
  const BASE_H = 1037;

  // Measure the stage and compute a uniform scale so the fixed iframe fits.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setStage({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Uniform contain-scale: the same factor on both axes, so the artwork is only
  // ever zoomed proportionally to fit — never stretched, never cropped.
  const fit = stage.w > 0 ? Math.min(stage.w / BASE_W, stage.h / BASE_H) : 0;
  const frameStyle =
    fit > 0
      ? {
          width: `${BASE_W}px`,
          height: `${BASE_H}px`,
          transform: `translate(-50%, -50%) scale(${fit})`,
        }
      : { opacity: 0 };

  // Apply a reported artwork bg color to the page theme.
  const applyTheme = useCallback((color: string) => {
    const rgb = parseColor(color);
    if (!rgb) return;
    const t = deriveTheme(rgb);
    const root = document.documentElement.style;
    root.setProperty("--bg", t.bg);
    root.setProperty("--ink", t.ink);
    root.setProperty("--ink-dim", t.inkDim);
    root.setProperty("--hair", t.hair);
    root.setProperty("--art", t.art);
    root.setProperty("--title-alt", t.titleAlt);
    setReady(true);
  }, []);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const d = e.data;
      if (d && d.type === "gamers:bg" && typeof d.color === "string") {
        applyTheme(d.color);
        if (d.hash) setHash(d.hash);
      }
    }
    window.addEventListener("message", onMsg);

    // Handshake: announce we're listening so the iframe replies with its color,
    // even if it resolved its palette before this listener attached. Retry a
    // few times to cover the piece's boot window.
    let tries = 0;
    const hello = () => {
      const w = frameRef.current?.contentWindow;
      if (w) w.postMessage({ type: "gamers:hello" }, "*");
      tries++;
      if (tries < 20) setTimeout(hello, 200);
    };
    hello();

    return () => window.removeEventListener("message", onMsg);
  }, [applyTheme, nonce]);

  const reroll = useCallback(() => {
    setReady(false);
    setHash(null);
    setSeed(makeFxHash());
    setNonce((n) => n + 1);
  }, []);

  /**
   * Arrow / Space / PageUp / PageDown scroll-lock for the game iframe is now
   * handled INSIDE the iframe (see /public/gamers/piece/index.html). That
   * script is registered before the game's bundle runs, claims capture-phase
   * priority for keydown, and preventDefaults the scroll keys — so the browser
   * never tries to scroll the parent in the first place, and the game's own
   * handler still receives the key (preventDefault doesn't stop propagation).
   */

  return (
    <section className="hero" aria-label="GAMERS — live generative artwork">
      <div className="hero-stage" ref={stageRef}>
        <div className="frame-wrap" data-ready={ready}>
          {fit > 0 && (
            <iframe
              key={nonce}
              ref={frameRef}
              className="piece"
              style={frameStyle}
              width={BASE_W}
              height={BASE_H}
              src={`/gamers/piece/index.html?n=${nonce}${seed ? `&fxhash=${seed}` : ""}`}
              title="GAMERS generative artwork"
              scrolling="no"
              loading="eager"
            />
          )}
        </div>
        <DashedFrame />
      </div>

      <div className="hero-readout mono">
        <button className="reroll" onClick={reroll} aria-label="Load a new iteration">
          <span aria-hidden>↻</span> RE-ROLL
        </button>
        <HashReadout seed={seed} hash={hash} />
      </div>
    </section>
  );
}
