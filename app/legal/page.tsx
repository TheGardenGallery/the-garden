export const metadata = {
  title: "Legal | The Garden",
};

export default function LegalPage() {
  return (
    <>
      <h1 className="sr-only">Legal &mdash; The Garden</h1>
      <div className="legal-page">
        <div className="legal-col">

          <section id="privacy">
            <h2 className="legal-heading">Privacy</h2>
            <p>
              The Garden does not collect personal data, require account
              creation, or use advertising&nbsp;trackers.
            </p>
            <p>
              Standard server logs (IP&nbsp;address, browser,
              page&nbsp;requested) are retained briefly for operational
              purposes and are not shared with third&nbsp;parties.
            </p>
            <p>
              Embedded artworks are served through same-origin proxy routes.
              No cross-site tracking accompanies
              these&nbsp;embeds.
            </p>
            <p>
              The welcome overlay uses <code>localStorage</code> to remember
              a single dismissal. No cookies are&nbsp;set.
            </p>
          </section>

          <hr className="legal-rule" aria-hidden="true" />

          <section id="terms">
            <h2 className="legal-heading">Terms</h2>
            <p>
              All artworks, exhibition text, and curatorial writing are the
              intellectual property of their respective creators and
              The&nbsp;Garden. Artworks may not be reproduced, distributed, or
              used commercially without permission from
              the&nbsp;artist.
            </p>
            <p>
              The site is provided as-is. We make reasonable efforts to keep
              content accurate and available, but offer no guarantees of
              uptime or error-free&nbsp;operation.
            </p>
            <p>
              Links to external platforms are provided for reference.
              The Garden is not responsible for the content or practices
              of linked&nbsp;sites.
            </p>
          </section>

          <hr className="legal-rule" aria-hidden="true" />

          <section id="accessibility">
            <h2 className="legal-heading">Accessibility</h2>
            <p>
              The Garden is committed to making its exhibitions accessible
              to the widest possible&nbsp;audience.
            </p>
            <p>
              The site uses semantic HTML, supports keyboard navigation, and
              respects <code>prefers-reduced-motion</code>. All images carry
              descriptive alt text. Video content is muted by default with
              visible poster&nbsp;frames.
            </p>
            <p>
              Generative artworks &mdash;&nbsp;by their nature
              &mdash;&nbsp;present challenges for assistive technology.
              Where possible, each piece is accompanied by written context
              describing its form and&nbsp;behaviour.
            </p>
            <p>
              If you encounter a barrier, please write
              to{" "}
              <a href="mailto:chilltulpa@gmail.com">chilltulpa@gmail.com</a>.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
