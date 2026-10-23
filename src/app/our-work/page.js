import Link from "next/link";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import PhotoGallery from "@/components/PhotoGallery";
import Photo, { SIZES } from "@/components/Photo";
import { JOB_PHOTOS } from "@/lib/work";

export const metadata = {
  title: "Corporate Seating Audit Case Studies & Transformations | Ayaan Enterprises",
  description:
    "Review before and after transformations across corporate tech parks, BFSI campuses, and managed co-working hubs. Verified zero-downtime execution and 90-day parts warranty."
};

const PROJECTS = [
  {
    beforeSrc: "/images/work-1-before.jpg",
    afterSrc: "/images/work-1-after.jpg",
    title: "450 Ergonomic Task Chairs Overhauled",
    subtitle: "Tier-1 Technology Campus, OMR Chennai · Weekend Batch Execution"
  },
  {
    beforeSrc: "/images/work-3-before.jpg",
    afterSrc: "/images/work-3-after.jpg",
    title: "320 Chairs: Class-4 Gas Lifts, Bases & PU Wheels",
    subtitle: "BFSI Operations Center, DLF Cybercity Porur · Zero Downtime SLA"
  },
  {
    beforeSrc: "/images/work-4-before.jpg",
    afterSrc: "/images/work-4-after.jpg",
    title: "280 Breathable Mesh Chairs Deep Cleaned & Calibrated",
    subtitle: "Managed Flex Co-Working Hub, Olympia Tech Park Guindy · Rapid Dry"
  },
  {
    beforeSrc: "/images/work-5-before.jpg",
    afterSrc: "/images/work-5-after.jpg",
    title: "600 Auditorium & Seminar Seats Shampooed & Disinfected",
    subtitle: "Higher Education & Research Campus, Adyar Chennai · Weekend Deployment"
  }
];

export default function OurWorkPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Corporate Audit Case Studies
            </div>
            <span className="eyebrow">Enterprise Transformation Record</span>
            <h1>Before &amp; After: Verified Workplace Transformations</h1>
            <p className="lead">
              Every single batch we execute is documented with high-resolution photographic proof before and after
              servicing. Explore how leading commercial campuses extend furniture lifespans while preserving capital.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/quote">
                Request a Site Audit for Your Campus
              </Link>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            <Photo
              src={JOB_PHOTOS[0].src}
              alt={JOB_PHOTOS[0].alt}
              style={{ objectPosition: JOB_PHOTOS[0].position }}
              sizes={SIZES.pageHero}
              hero
            />
          </figure>
        </div>
      </section>

      {/* Corporate Metrics Strip */}
      <section className="bg-slate-900 py-8 text-white border-b border-slate-800">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-amber-400">1,000+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Chairs Restored to Date</div>
            </div>
            <div>
              <div className="text-3xl font-black text-teal-400">70% Avg</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Capex Budget Preserved</div>
            </div>
            <div>
              <div className="text-3xl font-black text-amber-400">160+ Tons</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Landfill Waste Diverted</div>
            </div>
            <div>
              <div className="text-3xl font-black text-teal-400">100%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">On-Time Weekend Handover</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">On the Job</span>
            <h2>Photos from our recent jobs</h2>
            <p>Taken by our team on site: chairs serviced and ready for handover, and repairs in progress.</p>
          </div>
          <PhotoGallery photos={JOB_PHOTOS} title="Photos from our recent jobs" portrait />
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Interactive Verification</span>
            <h2>Drag the Sliders to Inspect Refurbishment Quality</h2>
            <p>
              Compare the worn condition before our intervention against the calibrated, deep-cleaned, and refurbished result.
            </p>
          </div>
          <div className="grid g-3">
            {PROJECTS.map((proj, idx) => (
              <BeforeAfterSlider
                key={idx}
                beforeSrc={proj.beforeSrc}
                afterSrc={proj.afterSrc}
                title={proj.title}
                subtitle={proj.subtitle}
              />
            ))}

            {/* Service overviews (not project results) */}
            <article className="card service-card">
              <figure className="img-slot ratio-4x3">
                <Photo src="/images/service-repair.jpg" alt="Technician replacing the gas lift of an office chair on-site" sizes={SIZES.grid3} />
              </figure>
              <div className="body">
                <span className="tag">Our Service</span>
                <h3>On-Site Component Repair</h3>
                <p>Gas lifts, castors, star bases, armrests and tilt mechanisms repaired or replaced at your premises.</p>
                <Link className="link-arrow" href="/chair-repair">
                  Repair details
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-4x3">
                <Photo src="/images/service-cleaning.jpg" alt="Technician shampoo-cleaning an office chair seat" sizes={SIZES.grid3} />
              </figure>
              <div className="body">
                <span className="tag">Our Service</span>
                <h3>Office Chair Deep Cleaning</h3>
                <p>Shampoo extraction and stain removal for fabric, mesh, leatherette, and auditorium chairs.</p>
                <Link className="link-arrow" href="/chair-cleaning">
                  Cleaning details
                </Link>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center" style={{ marginTop: "48px", textAlign: "center" }}>
            <Link className="btn btn-amber" href="/quote">
              Book a Zero-Cost Trial Chair Refurbishment &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
