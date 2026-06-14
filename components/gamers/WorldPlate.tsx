"use client";

import { useEffect, useRef, useState } from "react";

/**
 * WorldPlate — the full-bleed background. OUR design asset (NOT itsgalo's
 * artwork): a forked, HUD-stripped copy of the renderer (/piece-bg/) showing
 * only the procedural terrain + sky. It mirrors the HERO's seed so the framed
 * artwork reads as a targeted window into the world bleeding behind the page.
 *
 * LIVE, RE-ROLLS IN LOCKSTEP: each re-roll appends a fresh live iframe layer for
 * the new seed; it boots, and the instant it has painted a composed frame (the
 * iframe posts `gamers:plate-ready`) we crossfade it up while the outgoing world
 * fades out — a smooth dissolve driven by real paint, not a guess timer, so the
 * new world never pops in late. The background is moving video, not a frozen
 * snapshot (we accept the GPU cost for the smoother feel). The hero in /piece/
 * is untouched.
 */

type Layer = { id: number; seed: string; shown: boolean };

// must match the CSS opacity transition on .worldplate-frame
const FADE_MS = 900;
// safety reveal if a paint-ready ping is ever missed (network/raf hiccup)
const REVEAL_FALLBACK_MS = 2200;

export default function WorldPlate() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const seedRef = useRef<string | null>(null);
  const idRef = useRef(0);

  // MOBILE: do not run the live background WebGL iframe at all. The Hero already
  // runs one live WebGL context; a SECOND full-bleed live context on a phone
  // (iOS Safari, DPR 3) blows the GPU/memory budget and the tab gets killed
  // ("the page keeps crashing on mobile"). On phones we skip mounting the plate
  // entirely and fall back to the solid `--bg` ground the .worldplate already
  // paints. Desktop keeps the live moving background. Resize-aware so rotating
  // / DevTools device-mode flips correctly.
  const [allowLive, setAllowLive] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 561px) and (pointer: fine)");
    const update = () => setAllowLive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // listen for the hero's current seed (append a new layer when it changes) and
  // for each new layer's paint-ready ping (reveal it). Ready pings have no seed,
  // so we reveal the newest not-yet-shown layer.
  useEffect(() => {
    if (!allowLive) return; // mobile: no live plate, no listeners
    function revealNewestPending() {
      setLayers((prev) => {
        const pending = prev.filter((l) => !l.shown);
        if (!pending.length) return prev;
        const target = pending[pending.length - 1].id;
        return prev.map((l) => (l.id === target ? { ...l, shown: true } : l));
      });
    }
    function onMsg(e: MessageEvent) {
      const d = e.data;
      if (!d) return;
      if (d.type === "gamers:bg" && d.hash && typeof d.hash === "string") {
        if (seedRef.current === d.hash) return; // ignore the hero's heartbeat
        seedRef.current = d.hash;
        const id = ++idRef.current;
        setLayers((prev) => [...prev, { id, seed: d.hash, shown: false }]);
      }
      if (d.type === "gamers:plate-ready") {
        revealNewestPending();
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [allowLive]);

  // safety reveal: if a layer is mounted but never pinged ready, fade it in
  // anyway after a generous window so the background can't get stuck hidden.
  useEffect(() => {
    const pending = layers.find((l) => !l.shown);
    if (!pending) return;
    const t = window.setTimeout(() => {
      setLayers((prev) =>
        prev.map((l) => (l.id === pending.id ? { ...l, shown: true } : l))
      );
    }, REVEAL_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [layers]);

  // cleanup: once the newest layer is shown, retire older layers after the
  // crossfade completes (keeps exactly one live world running at rest).
  const shown = layers.filter((l) => l.shown);
  const newestShownId = shown.length ? shown[shown.length - 1].id : null;
  useEffect(() => {
    if (newestShownId == null) return;
    if (layers.length <= 1) return;
    const cleanup = window.setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.id >= newestShownId));
    }, FADE_MS + 120);
    return () => clearTimeout(cleanup);
  }, [newestShownId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="worldplate" aria-hidden>
      {allowLive &&
        layers.map((l) => (
          <iframe
            key={l.id}
            className="worldplate-frame"
            data-shown={l.shown ? "true" : "false"}
            title=""
            aria-hidden
            tabIndex={-1}
            scrolling="no"
            src={`/gamers/piece-bg/index.html?fxhash=${encodeURIComponent(l.seed)}`}
          />
        ))}
    </div>
  );
}
