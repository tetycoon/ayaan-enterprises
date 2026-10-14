import Link from "next/link";
import { SITE, waLink } from "@/lib/config";

export const metadata = {
  title: "Bulk & Corporate Office Chair Refurbishment in Chennai | Ayaan Enterprises",
  description:
    "Bulk chair repair and cleaning for offices, IT parks, colleges, and hospitals across Chennai. Work done in planned batches with zero office downtime."
};

export default function BulkServicePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Bulk Service
            </div>
            <span className="eyebrow">Bulk &amp; Corporate Service</span>
            <h1>50 to 5,000 chairs refurbished without stopping your office</h1>
            <p className="lead">
              One reliable partner for inspection, repair, deep cleaning, and refurbishment of every chair in your building.
              Work runs in planned batches so your workforce never sits on the floor.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/quote?service=Bulk%20Refurbishment">
                Request Site Inspection
              </Link>
              <a className="btn btn-ghost" href={`tel:${SITE.phoneLink}`}>
                Call: {SITE.phone}
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/page-bulk.jpg" alt="Corporate office with rows of refurbished chairs" />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="highlight-box">
            <h3>Controlled batches, zero office downtime</h3>
            <p style={{ margin: 0, fontSize: "1.05rem" }}>
              We service chairs in cohorts of 20–50 units over weekends or after-hours. Each batch is returned fully
              serviced and tested before taking the next batch, ensuring zero interruption to your work routine.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Our Bulk Process</span>
            <h2>How Bulk Servicing Works</h2>
          </div>
          <div className="process-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 01</span>
                <span className="process-icon">📋</span>
              </div>
              <h3>Site Survey &amp; Tagging</h3>
              <p>Every chair is counted, tagged, and its exact condition recorded with required repairs.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 02</span>
                <span className="process-icon">📑</span>
              </div>
              <h3>Itemised Quote</h3>
              <p>Per-chair pricing grouped by chair type and specific service needed. No hidden charges.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 03</span>
                <span className="process-icon">🪑</span>
              </div>
              <h3>Sample Chair Trial</h3>
              <p>We refurbish 1–2 test chairs first so your facilities team can inspect quality before full rollout.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 04</span>
                <span className="process-icon">⚙️</span>
              </div>
              <h3>Batch Servicing</h3>
              <p>Work is completed on-site during weekends or off-hours in controlled batches.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 05</span>
                <span className="process-icon">✅</span>
              </div>
              <h3>Handover &amp; GST Invoice</h3>
              <p>Final quality check, before &amp; after photo report, 90-day warranty, and GST invoice.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Who We Serve</span>
            <h2>Trusted Across Sectors in Chennai</h2>
          </div>
          <div className="grid g-3">
            <div className="card">
              <h3>IT Parks &amp; Corporate Offices</h3>
              <p>Weekend servicing designed to avoid noise and disruption during busy weekday hours.</p>
            </div>
            <div className="card">
              <h3>BPOs &amp; Call Centres</h3>
              <p>Heavy chair usage causes worn gas lifts and armrests. We restore hundreds of seats quickly.</p>
            </div>
            <div className="card">
              <h3>Colleges &amp; Auditoriums</h3>
              <p>Large-volume seating shampooed, repaired, and disinfected ahead of events and academic sessions.</p>
            </div>
          </div>
          <div className="text-center" style={{ textAlign: "center", marginTop: "36px" }}>
            <Link className="btn btn-amber" href="/quote?service=Bulk%20Refurbishment">
              Book a Free Site Survey &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
