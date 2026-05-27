"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Status = "idle" | "eligible" | "ineligible";

const ADDR_RE = /^0[xX][0-9a-fA-F]{40}$/;

/**
 * Split Logic-only allowlist eligibility check. Visitor types an
 * Ethereum address; on submit, the right-edge triangle (the gallery's
 * logomark) changes colour — phosphor green for eligible, red for
 * ineligible — and the modal opens with the appropriate release or
 * denial copy. Same triangle accents the status row inside the modal.
 *
 * Scoped to Ricky's exhibition page; doesn't touch SplitLogicSystem
 * state, so the PieceGrid FLIP lock is unaffected.
 */
export function SplitLogicAllowlistCheck() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [submittedAddr, setSubmittedAddr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitTimeoutRef = useRef<number | null>(null);

  const submit = useCallback(async () => {
    const v = value.trim();
    if (!v) {
      setError("ENTER AN ADDRESS");
      return;
    }
    if (!ADDR_RE.test(v)) {
      setError("INVALID FORMAT — 0x + 40 HEX CHARS");
      return;
    }
    setError(null);
    const normalized = v.toLowerCase();

    // Fire the lookup and the 650ms beat in parallel. Whichever
    // finishes last gates the modal open — so on fast networks the
    // user gets the deliberate beat, and on slower networks the
    // beat is effectively the loading state. Indicator on the
    // arrow stays in "idle" until the answer arrives, which is the
    // right semantic.
    if (submitTimeoutRef.current !== null) {
      window.clearTimeout(submitTimeoutRef.current);
    }
    const beat = new Promise<void>((resolve) => {
      submitTimeoutRef.current = window.setTimeout(() => resolve(), 650);
    });

    let ok = false;
    try {
      const res = await fetch(
        `/api/split-logic/check-allowlist?address=${encodeURIComponent(
          normalized,
        )}`,
      );
      if (res.ok) {
        const data = (await res.json()) as { eligible?: boolean };
        ok = Boolean(data.eligible);
      } else {
        setError("CHECK FAILED — TRY AGAIN");
        return;
      }
    } catch {
      setError("NETWORK ERROR — TRY AGAIN");
      return;
    }

    setStatus(ok ? "eligible" : "ineligible");
    setSubmittedAddr(normalized);
    await beat;
    setModalOpen(true);
  }, [value]);

  // If the input value drifts away from the submitted address, drop
  // back to idle — keeps the indicator honest about what's verified.
  useEffect(() => {
    if (!submittedAddr) return;
    if (value.trim().toLowerCase() !== submittedAddr) {
      setStatus("idle");
      setSubmittedAddr(null);
    }
  }, [value, submittedAddr]);

  // Clear error on any input change (treat as fresh attempt).
  useEffect(() => {
    if (error) setError(null);
    // intentionally only depends on value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current !== null) {
        window.clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <section
      className="split-logic-allowlist"
      aria-labelledby="sla-label"
    >
      <div className="sla-inner">
        <h2 id="sla-label" className="sla-label">
          Allowlist Eligibility
        </h2>
        <form
          className="sla-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="sla-field" data-status={status}>
            <input
              ref={inputRef}
              className="sla-input"
              type="text"
              inputMode="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0x0000…0000"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              maxLength={50}
              aria-label="Ethereum address"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "sla-error" : "sla-help"}
            />
            <button
              type="submit"
              className="sla-submit-icon"
              aria-label="Run eligibility check"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          {error ? (
            <p id="sla-error" className="sla-error" role="alert">
              {error}
            </p>
          ) : (
            <p id="sla-help" className="sla-help">
              Verify your Ethereum address
            </p>
          )}
        </form>
      </div>
      {modalOpen && submittedAddr && (
        <SLAModal status={status} onClose={closeModal} />
      )}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// Modal
// ──────────────────────────────────────────────────────────────────

function SLAModal({
  status,
  onClose,
}: {
  status: Status;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    const prev = document.body.style.overflow;
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // focus the card so screen-readers land on the modal contents
    // and the escape handler captures keys outside the input chain.
    const t = window.setTimeout(() => cardRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!mounted) return null;

  const isEligible = status === "eligible";

  return createPortal(
    <div
      className="sla-modal"
      data-status={status}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={cardRef}
        className="sla-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sla-card-status"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sla-card-head">
          {isEligible ? (
            <>
              <span
                id="sla-card-status"
                className="sla-card-head-label sla-card-head-label--granted"
              >
                ACCESS
              </span>
              <span className="sla-card-head-value sla-card-head-value--granted">
                GRANTED
              </span>
            </>
          ) : (
            <span
              id="sla-card-status"
              className="sla-card-head-value sla-card-head-value--denied"
            >
              This address is not on the Split Logic allowlist
            </span>
          )}
          <button
            type="button"
            className="sla-card-close"
            data-status={isEligible ? "granted" : "denied"}
            aria-label="Close"
            onClick={onClose}
          >
            <span className="sla-card-close-tri" aria-hidden="true" />
          </button>
        </header>
        <div className="sla-card-body">
          <MintDetails isEligible={isEligible} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function MintDetails({ isEligible }: { isEligible: boolean }) {
  return (
    <dl className="sla-card-detail" aria-label="Mint details">
      <Row label="PLATFORM" value="Verse" />
      {isEligible ? (
        <>
          <Row
            label="OPENING"
            value={formatMintTime(AL_OPEN_ISO, AL_OPEN_FALLBACK)}
          />
          <Row
            label="CLOSING"
            value={formatMintTime(AL_CLOSE_ISO, AL_CLOSE_FALLBACK)}
          />
        </>
      ) : (
        <Row
          label="PUBLIC SALE"
          value={formatMintTime(PUBLIC_SALE_ISO, PUBLIC_SALE_FALLBACK)}
        />
      )}
      <Row label="PRICE" value="0.1 ETH" />
      {isEligible && <Row label="LIMIT" value="1 / COLLECTOR" />}
      <Row label="MODE" value="FCFS" />
    </dl>
  );
}


function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="sla-row">
      <dt className="sla-row-label">{label}</dt>
      <dd className="sla-row-value">{value}</dd>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

// Canonical mint window in CDT (UTC-5): AL opens 11:00 AM Jun 03,
// closes 10:00 AM Jun 04. Public sale begins 11:00 AM Jun 04 (one
// hour after the AL closes). Stored as UTC ISO so each visitor's
// browser converts to their local timezone.
const AL_OPEN_ISO = "2026-06-03T16:00:00Z";
const AL_OPEN_FALLBACK = "JUN 03 · 11:00 AM CDT";
const AL_CLOSE_ISO = "2026-06-04T15:00:00Z";
const AL_CLOSE_FALLBACK = "JUN 04 · 10:00 AM CDT";
const PUBLIC_SALE_ISO = "2026-06-04T16:00:00Z";
const PUBLIC_SALE_FALLBACK = "JUN 04 · 11:00 AM CDT";

function formatMintTime(iso: string, fallback: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).formatToParts(new Date(iso));
    let month = "";
    let day = "";
    let hour = "";
    let minute = "";
    let dayPeriod = "";
    let tz = "";
    for (const p of parts) {
      if (p.type === "month") month = p.value;
      else if (p.type === "day") day = p.value;
      else if (p.type === "hour") hour = p.value;
      else if (p.type === "minute") minute = p.value;
      else if (p.type === "dayPeriod") dayPeriod = p.value;
      else if (p.type === "timeZoneName") tz = p.value;
    }
    if (!month || !day || !hour || !minute || !tz) return fallback;
    return `${month} ${day} · ${hour}:${minute} ${dayPeriod} ${tz}`.toUpperCase();
  } catch {
    return fallback;
  }
}
