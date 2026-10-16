import Link from "next/link";
import { SITE, waLink } from "@/lib/config";
import HeroSlides from "@/components/HeroSlides";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ChairGalleryMarquee from "@/components/ChairGalleryMarquee";
import GoogleReviews from "@/components/GoogleReviews";
import Photo, { SIZES } from "@/components/Photo";

export const metadata = {
  title: "Bulk Office Chair Repair & Deep Cleaning in Chennai | Ayaan Enterprises",
  description:
    "Professional office chair repair, machine shampoo cleaning, and refurbishment for companies across Chennai. Save up to 70% vs buying new. Free site inspection."
};

export default function HomePage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Bulk Chair Repair &amp; Cleaning</span>
            <h1>
              Old office chairs? We <em>repair, clean &amp; refurbish</em> them.
            </h1>
            <p className="hero-lead">
              Save up to 70% compared to buying new. We restore your office chairs on-site with fast turnaround,
              certified spare parts, and before &amp; after photo proof for every chair.
            </p>
            <ul className="hero-points">
              <li>Free site inspection for 20+ chairs</li>
              <li>On-site repair &amp; machine shampoo cleaning</li>
              <li>Before &amp; after photo proof for every chair</li>
            </ul>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/quote">
                Get Free Quote
              </Link>
              <a
                className="btn btn-wa"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I want to share chair photos for a repair / cleaning quote.")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"
                  />
                </svg>
                WhatsApp Photos
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>35,000+</strong>
                <span>Chairs Serviced</span>
              </div>
              <div>
                <strong>420+</strong>
                <span>Companies Served</span>
              </div>
              <div>
                <strong>48 hrs</strong>
                <span>Average Turnaround</span>
              </div>
            </div>
          </div>

          <HeroSlides />
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head center" style={{ maxWidth: "680px", margin: "0 auto 44px" }}>
            <span className="eyebrow">What We Do</span>
            <h2>Complete Office Seating Services</h2>
            <p>
              Repairing and cleaning existing chairs costs a fraction of buying new ones. Built for offices of all sizes.
            </p>
          </div>
          <div className="grid g-4">
            <article className="card service-card">
              <figure className="img-slot ratio-4x3">
                <Photo src="/images/service-repair.jpg" alt="Technician repairing chair" sizes={SIZES.grid4} />
              </figure>
              <div className="body">
                <span className="tag">Most Booked</span>
                <h3>Chair Repair</h3>
                <p>Professional chair repair services to fix damaged components, restore functionality, and extend the life of your office chairs.</p>
                <Link className="link-arrow" href="/chair-repair">
                  Repair details
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-4x3">
                <Photo src="/images/service-cleaning.jpg" alt="Chair deep cleaning" sizes={SIZES.grid4} />
              </figure>
              <div className="body">
                <span className="tag">Fast Turnaround</span>
                <h3>Old Chair Cleaning</h3>
                <p>Shampoo extraction and stain removal for fabric, mesh, leatherette, and auditorium chairs.</p>
                <Link className="link-arrow" href="/chair-cleaning">
                  Cleaning details
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-4x3">
                <Photo src="/images/service-bulk.jpg" alt="Bulk corporate refurbishment" sizes={SIZES.grid4} zoom={1.35} />
              </figure>
              <div className="body">
                <span className="tag">For 50+ Chairs</span>
                <h3>Bulk Refurbishment</h3>
                <p>Full overhaul done in planned batch shifts (over weekends or night shifts) with zero office downtime.</p>
                <Link className="link-arrow" href="/bulk-service">
                  Bulk service details
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-4x3 contain">
                <Photo
                  src="/images/products/mesh-highback-grey-chrome.jpg"
                  alt="New grey mesh high-back office chair with headrest and chrome base"
                  sizes={SIZES.grid4}
                />
              </figure>
              <div className="body">
                <span className="tag">Supplies</span>
                <h3>Buy Chairs &amp; Spares</h3>
                <p>Brand new ergonomic office chairs and certified spare parts delivered and installed with warranty.</p>
                <Link className="link-arrow" href="/shop">
                  Browse catalogue
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== CHAIR TYPES GALLERY MARQUEE (AUTO-SLIDING RIGHT TO LEFT) ===== */}
      <ChairGalleryMarquee />

      {/* ===== REAL COMPLETED WORK ===== */}
      <section className="section bg-soft">
        <div className="container">
          <div className="section-head center" style={{ maxWidth: "680px", margin: "0 auto 44px" }}>
            <span className="eyebrow">Our Work</span>
            <h2>Before &amp; After Image Transformation</h2>
            <p>Drag the slider to see the actual results from our recent chair repair, refurbishment, and deep cleaning projects.</p>
          </div>
          <div className="ba-feature">
            <div>
              <BeforeAfterSlider
                className="ba-portrait"
                beforeSrc="/images/work/chair-bases-before.png"
                afterSrc="/images/work/chair-bases-after.png"
                beforeAlt="Worn high-back mesh office chair with a torn seat, damaged armrests and broken castor wheels"
                afterAlt="Same high-back mesh office chair after repair, re-upholstery and cleaning"
                sizes="(max-width: 640px) 92vw, (max-width: 980px) 560px, 520px"
              />
              <span className="ba-feature-hint">&larr; Drag to compare &rarr;</span>
            </div>
            <div className="ba-feature-copy">
              <span className="ba-feature-tag">Featured Transformation</span>
              <h3>High-Back Mesh Chair: Repaired &amp; Refurbished</h3>
              <p>The same office chair before and after our work, with no new chair needed.</p>
              <ul className="check-list">
                <li>Torn seat re-padded and re-upholstered</li>
                <li>Headrest and mesh backrest restored</li>
                <li>Damaged armrests replaced</li>
                <li>Star base and castor wheels replaced</li>
                <li>Deep cleaned and tested before handover</li>
              </ul>
              <Link className="btn btn-amber" href="/quote?service=Bulk%20Office%20Refurbishment">
                Request Bulk Chair Service
              </Link>
            </div>
          </div>
          <div className="grid g-2 ba-feature-more">
            <BeforeAfterSlider
              beforeSrc="/images/work-1-before.jpg"
              afterSrc="/images/work-1-after.jpg"
              title="Fabric Chairs Deep Cleaned"
              subtitle="IT Company, OMR Chennai"
              sizes="(max-width: 640px) 92vw, 510px"
            />
            <BeforeAfterSlider
              beforeSrc="/images/work-4-before.jpg"
              afterSrc="/images/work-4-after.jpg"
              beforeAlt="Mesh office chair with a heavily stained fabric seat"
              afterAlt="Same mesh office chair after deep cleaning"
              title="Mesh Chairs Deep Cleaned"
              subtitle="Co-Working Hub, Olympia Tech Park Guindy"
              sizes="(max-width: 640px) 92vw, 510px"
            />
          </div>
          <div className="text-center" style={{ marginTop: "36px", textAlign: "center" }}>
            <Link className="btn btn-outline" href="/our-work">
              View All Completed Projects &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head center" style={{ maxWidth: "680px", margin: "0 auto 48px" }}>
            <span className="eyebrow">Simple 4-Step Process</span>
            <h2>How Our Service Works</h2>
            <p>From initial inspection to on-site testing and handover, we make chair maintenance effortless.</p>
          </div>
          <div className="process-grid">
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 01</span>
                <span className="process-icon">📸</span>
              </div>
              <h3>Share Photos &amp; Count</h3>
              <p>Send a few photos of your damaged or dirty chairs via WhatsApp or our quick online quote form.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 02</span>
                <span className="process-icon">🔍</span>
              </div>
              <h3>Free Site Inspection</h3>
              <p>For 20+ chairs, our lead technician visits your campus and tags each chair with needed repairs.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 03</span>
                <span className="process-icon">🔧</span>
              </div>
              <h3>On-Site Servicing</h3>
              <p>Repairs and deep shampoo cleaning are done in planned batches on-site so staff always have seats.</p>
            </div>
            <div className="process-card">
              <div className="process-header">
                <span className="process-badge">Step 04</span>
                <span className="process-icon">🛡️</span>
              </div>
              <h3>Photo Proof &amp; Warranty</h3>
              <p>Final inspection, before/after photo report, GST invoice, and a 90-day parts warranty included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GOOGLE REVIEWS ===== */}
      <GoogleReviews />
    </main>
  );
}
