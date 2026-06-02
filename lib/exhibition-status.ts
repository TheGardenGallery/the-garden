import type { Exhibition, ExhibitionStatus } from "@/lib/types";

/**
 * Single source of truth for an exhibition's *effective* status at a given
 * instant. The seed data stores a baseline `status`; an `upcoming` show that
 * carries a `liveStart` (UTC ISO) automatically becomes `current` once that
 * instant passes.
 *
 * Pure and deterministic in `nowMs`, so the server (at request time) and the
 * client (after mount, and again exactly when the instant elapses) derive the
 * identical result — no hydration drift. Everything that branches on status —
 * the Hero label, the /exhibitions columns, the overview "Opens/Released" row —
 * funnels through here, so the transition happens everywhere at once.
 *
 * `nowMs` is injected (never read from Date.now() internally) precisely so the
 * server can pass its request-time clock and the client its own — same input,
 * same output.
 */
export function resolveStatus(
  ex: Pick<Exhibition, "status" | "liveStart">,
  nowMs: number,
): ExhibitionStatus {
  if (ex.status === "upcoming" && ex.liveStart) {
    const start = Date.parse(ex.liveStart);
    if (!Number.isNaN(start) && nowMs >= start) return "current";
  }
  return ex.status;
}

/** Apply resolveStatus across a list, returning new objects (never mutating). */
export function withResolvedStatus<T extends Pick<Exhibition, "status" | "liveStart">>(
  list: T[],
  nowMs: number,
): T[] {
  return list.map((ex) => {
    const resolved = resolveStatus(ex, nowMs);
    return resolved === ex.status ? ex : { ...ex, status: resolved };
  });
}

/**
 * Milliseconds from `nowMs` until `ex` next changes effective status, or null
 * if no future transition is scheduled. Lets a client schedule a single
 * precise timer to flip the UI at the exact instant rather than polling.
 */
export function msUntilStatusChange(
  ex: Pick<Exhibition, "status" | "liveStart">,
  nowMs: number,
): number | null {
  if (ex.status === "upcoming" && ex.liveStart) {
    const start = Date.parse(ex.liveStart);
    if (!Number.isNaN(start) && start > nowMs) return start - nowMs;
  }
  return null;
}
