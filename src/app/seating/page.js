import Link from "next/link";
import { waLink } from "@/lib/config";

export const metadata = {
  title: "Premium Seating Collection | Ayaan Enterprises",
  description:
    "Experience seating designed to elevate the way you work, relax, and live. Discover premium chairs built for comfort, detail, and lasting style."
};

export default function SeatingPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Seating
            </div>
            <span className="eyebrow">Premium seating</span>
            <h1>Experience seating designed to elevate the way you work, relax, and live.</h1>
            <p className="lead">
              Every chair brings together refined design, exceptional comfort, premium finishes, and dependable
              craftsmanship to create a seating experience that feels as impressive as it looks.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/shop">
                Explore the collection
              </Link>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I want to know more about your seating collection.")}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/seating-hero.jpg" alt="Bright modern workspace with premium seating" />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Why choose our seating</span>
            <h2>Made for quality, comfort, and lasting style</h2>
          </div>
          <div className="grid g-3">
            <article className="card service-card">
              <figure className="img-slot ratio-1x1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/seating-design.jpg" alt="Close-up of stitched detailing on chair" />
              </figure>
              <div className="body">
                <h3>Refined design</h3>
                <p>Clean silhouettes and premium finishes that fit beautifully into modern homes and executive offices.</p>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-1x1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/seating-comfort.jpg" alt="High-back padded office chairs" />
              </figure>
              <div className="body">
                <h3>Ergonomic support</h3>
                <p>Designed around the human body, providing proper lumbar curvature and reducing fatigue.</p>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-1x1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/seating-craft.jpg" alt="Close-up of premium materials and stitching" />
              </figure>
              <div className="body">
                <h3>Built to last</h3>
                <p>Reinforced steel cores, BIFMA-tested components, and commercial-grade upholstery fabrics.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
