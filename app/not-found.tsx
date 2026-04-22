import Link from "next/link";

export const metadata = {
  title: "Not found | The Garden",
};

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-inner">
        <div className="not-found-label">404</div>
        <h1 className="not-found-title">
          <em>This path isn&rsquo;t in bloom.</em>
        </h1>
        <Link href="/" className="not-found-link">
          <span className="not-found-link-label">Return to the garden</span>
          <span className="not-found-link-arrow">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
