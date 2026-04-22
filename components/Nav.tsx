"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/artists",     label: "Artists" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/journal",     label: "Interview" },
  { href: "/about",       label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Body scroll lock + focus management
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (open) {
      const first = panelRef.current?.querySelector<HTMLAnchorElement>("a[href]");
      first?.focus({ preventScroll: true });
    } else {
      toggleRef.current?.focus({ preventScroll: true });
    }
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Close when viewport returns to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <ul className="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Logo />
      </nav>

      <div
        ref={panelRef}
        className="nav-panel"
        id="nav-panel"
        data-open={open}
        aria-hidden={!open}
      >
        <ul>
          {LINKS.map((link, i) => (
            <li key={link.href}>
              <span className="nav-panel-coord">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
