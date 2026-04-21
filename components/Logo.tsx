import Link from "next/link";

type LogoProps = {
  variant?: "nav" | "footer";
};

/**
 * THE G△RDEN mark. Renders prototype-exact markup:
 * <a class="logo"> for the nav, <a class="f-logo"> for the footer.
 * All styles live in globals.css (.logo, .f-logo, .the, .grd, .triangle).
 */
export function Logo({ variant = "nav" }: LogoProps) {
  const className = variant === "footer" ? "f-logo" : "logo";
  const theText = variant === "footer" ? "THE" : "THE ";

  return (
    <Link href="/" className={className} aria-label="The Garden — home">
      <span className="the">{theText}</span>
      {variant === "footer" ? "\u00A0" : null}
      <span className="grd">
        G
        <span className="triangle">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M50 0 L100 100 L0 100 Z M50 49 L64 78 L36 78 Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </span>
        RDEN
      </span>
    </Link>
  );
}
