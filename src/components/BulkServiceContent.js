import Link from "next/link";
import { SITE } from "@/lib/config";
import PhotoGallery from "@/components/PhotoGallery";
import Photo, { SIZES } from "@/components/Photo";

// Shared Bulk & Corporate Service content, used by /bulk-servicing (header menu) and /bulk-service.
const QUOTE_HREF = `/quote?service=${encodeURIComponent("Bulk Office Refurbishment")}`;

export const BULK_METADATA = {
  title: "Bulk & Corporate Office Chair Refurbishment in Chennai | Ayaan Enterprises",
  description:
    "Bulk chair repair and cleaning for offices, IT parks, colleges, and hospitals across Chennai. Work done in planned batches with zero office downtime."
};

// Real photos taken by the Ayaan Enterprises team on servicing jobs.
const JOB_PHOTOS = [
  { src: "/images/work/job-serviced-mesh-chairs.jpg", alt: "Six black mesh office chairs lined up in a client office after servicing", position: "50% 62%" },
  { src: "/images/work/job-fitting-star-base.jpg", alt: "Technician fitting a star base and castors to an office chair on site", position: "50% 60%" },
  { src: "/images/work/job-fitting-gas-lift.jpg", alt: "Technician fitting a new gas lift to an office chair seat mechanism", position: "50% 60%" }
];

const STEPS = [
  { icon: "📋", title: "Site Survey & Tagging", text: "Every chair is counted, tagged, and its exact condition recorded with required repairs." },
  { icon: "📑", title: "Itemised Quote", text: "Per-chair pricing grouped by chair type and specific service needed. No hidden charges." },
  { icon: "⚙️", title: "Batch Servicing", text: "Work is completed on-site during weekends or off-hours in controlled batches." },
  { icon: "✅", title: "Handover & GST Invoice", text: "Final quality check, before & after photo report, 90-day warranty, and GST invoice." }
];

const SECTORS = [
  { title: "IT Parks & Corporate Offices", text: "Weekend servicing designed to avoid noise and disruption during busy weekday hours." },
  { title: "BPOs & Call Centres", text: "Heavy chair usage causes worn gas lifts and armrests. We restore hundreds of seats quickly." },
  { title: "Colleges & Auditoriums", text: "Large-volume seating shampooed, repaired, and disinfected ahead of events and academic sessions." }
];

export default function BulkServiceContent({ crumb, showJobPhotos = false }) {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / {crumb}
            </div>
            <span className="eyebrow">Bulk &amp; Corporate Service</span>
            <h1>50 to 5,000 chairs refurbished without stopping your office</h1>
            <p className="lead">
              One reliable partner for inspection, repair, deep cleaning, and refurbishment of every chair in your building.
              Work runs in planned batches so your workforce never sits on the floor.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href={QUOTE_HREF}>
                Request Site Inspection
              </Link>
              <a className="btn btn-ghost" href={`tel:${SITE.phoneLink}`}>
                Call: {SITE.phone}
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            <Photo src="/images/page-bulk.jpg" alt="Corporate office with rows of refurbished chairs" sizes={SIZES.pageHero} zoom={1.15} hero />
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
            {STEPS.map((step, i) => (
              <div key={step.title} className="process-card">
                <div className="process-header">
                  <span className="process-badge">Step {String(i + 1).padStart(2, "0")}</span>
                  <span className="process-icon">{step.icon}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showJobPhotos && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">On-Site Service</span>
              <h2>Servicing at your premises</h2>
            </div>
            <PhotoGallery photos={JOB_PHOTOS} title="Servicing at your premises" portrait />
          </div>
        </section>
      )}

      <section className={`section ${showJobPhotos ? "bg-soft" : ""}`}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Who We Serve</span>
            <h2>Trusted Across Sectors in Chennai</h2>
          </div>
          <div className="grid g-3">
            {SECTORS.map((s) => (
              <div key={s.title} className="card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ textAlign: "center", marginTop: "36px" }}>
            <Link className="btn btn-amber" href={QUOTE_HREF}>
              Book a Free Site Survey &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
