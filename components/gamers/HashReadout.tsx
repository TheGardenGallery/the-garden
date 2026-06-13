"use client";

/**
 * HashReadout — the fxhash seed display beside RE-ROLL.
 *
 * Clean and simple: shows the resolved seed (first 6 + "…" + last 4), or a quiet
 * placeholder while a new iteration resolves. A short CSS opacity fade on change
 * (compositor thread, so it stays smooth even while the artwork boots). No JS
 * per-frame animation — the scramble/decode was abandoned because a re-roll
 * blocks the main thread (~1.4s of back-to-back WebGL boots) and starved any JS
 * animation into stutter.
 */
export default function HashReadout({
  seed,
  hash,
}: {
  seed: string | null;
  hash: string | null;
}) {
  const value = hash ?? seed;
  const display = value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "RESOLVING";

  return (
    <span
      className="hash"
      title="fxhash seed"
      data-resolving={value ? "false" : "true"}
      // key on the value so the fade re-triggers on each new hash
      key={value ?? "resolving"}
    >
      {display}
    </span>
  );
}
