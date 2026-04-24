import Link from "next/link";

export const metadata = {
  title: "About | The Garden",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">About — The Garden</h1>
      <section className="about-page">
        <Link href="/principles" className="about-principles-link">
          Principles
        </Link>
        <div className="about-col">
          <p>The Garden is a gallery for digital art.</p>
          <p>
            The conditions of encounter shape the work. Each exhibition is
            developed with attention to structure, duration, and form.
          </p>
          <p>
            Projects are approached one at a time, in close collaboration with
            the artist.
          </p>
          <p>Past exhibitions remain in place.</p>

          <hr className="about-rule" aria-hidden="true" />

          <h2 className="about-curator-head">
            <a
              href="https://x.com/chilltulpa"
              target="_blank"
              rel="noopener noreferrer"
              className="about-curator-link"
            >
              Ivan Zhyzhkevych
            </a>
          </h2>
          <p>
            Curation, writing, release, and presentation are held as a single
            practice.
          </p>
        </div>
      </section>
    </>
  );
}
