import Link from "next/link";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

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
    beforeSrc: "/images/work-2-before.jpg",
    afterSrc: "/images/work-2-after.jpg",
    title: "Executive Boardroom & Cabin Re-Upholstery",
    subtitle: "Corporate Law Firm, Nungambakkam Chennai · Premium Leatherette"
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
  },
  {
    beforeSrc: "/images/work-6-before.jpg",
    afterSrc: "/images/work-6-after.jpg",
    title: "180 Waiting & Breakout Chairs Re-Covered",
    subtitle: "Healthcare & Clinical Admin Center, Greams Road Chennai · Anti-Microbial Fabric"
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/page-work.jpg" alt="Row of refurbished corporate task chairs ready for Monday morning" />
          </figure>
        </div>
      </section>

      {/* Corporate Metrics Strip */}
      <section className="bg-slate-900 py-8 text-white border-b border-slate-800">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-amber-400">35,000+</div>
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
