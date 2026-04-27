import Link from "next/link";
import { Logo } from "./Logo";

const exploreLinks = [
  { href: "/artists",     label: "Artists" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/journal",     label: "Interview" },
  { href: "/about",       label: "About" },
];

const studioLinks = [
  { href: "/press",                          label: "Press" },
  { href: "mailto:chilltulpa@gmail.com",     label: "Contact" },
];

const legalLinks = [
  { href: "/privacy",       label: "Privacy" },
  { href: "/terms",         label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "/newsletter",           label: "Newsletter" },
  { href: "https://x.com",         label: "X" },
];

export function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="f-brand">
          <Logo variant="footer" />
        </div>
        <FooterColumn label="Explore" links={exploreLinks} />
        <FooterColumn label="Studio" links={studioLinks} />
        <div className="f-col">
          <span className="f-col-label">Locations</span>
          <ul>
            <li>
              <Link href="/locations" className="no-reveal">
                Worldwide{" "}
                <span
                  style={{
                    fontFamily: "'Cormorant',serif",
                    fontStyle: "italic",
                    color: "rgba(245,243,239,0.45)",
                  }}
                >
                  (Online)
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="f-bottom-left">
          <span className="f-copy">© 2023 The Garden</span>
          <div className="f-soc-text">
            {socialLinks.map((s) => (
              <Link key={s.label} href={s.href}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="f-legal">
          {legalLinks.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="f-col">
      <span className="f-col-label">{label}</span>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
