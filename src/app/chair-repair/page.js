import Link from "next/link";
import { waLink } from "@/lib/config";

export const metadata = {
  title: "Office Chair Repair Services in Chennai | Ayaan Enterprises",
  description:
    "On-site office chair repair in Chennai: gas lift cylinder, wheels, star base, armrest, tilt mechanism, foam and upholstery replacement with 90-day warranty."
};

export default function ChairRepairPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Chair Repair
            </div>
            <span className="eyebrow">Chair Repair Service</span>
            <h1>Broken office chairs? We fix every part on-site.</h1>
            <p className="lead">
              Don&apos;t replace broken chairs. We replace sinking gas lifts, cracked wheels, broken bases, mechanisms,
              foam, and torn upholstery directly at your office.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/quote?service=Chair%20Repair">
                Get Repair Quote
              </Link>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I need chair repair. Sharing photos of broken chairs.")}
              >
                WhatsApp Photos
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/page-repair.jpg" alt="Technician repairing office chair" />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Fix</span>
            <h2>Every Component Repaired &amp; Tested</h2>
            <p>Tell us the issue or send photos. We bring standard replacement parts directly to your premises.</p>
          </div>
          <div className="grid g-3">
            <div className="card card-top">
              <div className="card-icon">⬍</div>
              <h3>Gas Lift / Cylinder</h3>
              <p>Chair sinking or losing height adjustment? We replace it with certified Class 3 or Class 4 heavy-duty hydraulic cylinders.</p>
            </div>

            <div className="card card-top">
              <div className="card-icon">◎</div>
              <h3>Wheels &amp; Castors</h3>
              <p>Stuck, broken, or floor-scratching wheels replaced with smooth nylon or floor-safe PU castors.</p>
            </div>

            <div className="card card-top">
              <div className="card-icon">✳</div>
              <h3>Base / Star Base</h3>
              <p>Cracked plastic or bent metal star bases replaced with heavy-duty nylon or polished chrome bases.</p>
            </div>

            <div className="card card-top amber">
              <div className="card-icon">⟲</div>
              <h3>Tilt Mechanism</h3>
              <p>Tilt lock, tension knob, push-back, and synchro mechanism repaired or replaced.</p>
            </div>

            <div className="card card-top amber">
              <div className="card-icon">▭</div>
              <h3>Armrests</h3>
              <p>Loose, cracked, or missing armrests replaced with fixed or adjustable arm assemblies.</p>
            </div>

            <div className="card card-top amber">
              <div className="card-icon">✂</div>
              <h3>Foam &amp; Upholstery</h3>
              <p>High-density seat foam replacement and re-upholstery in fabric, leatherette, or mesh in your company colors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container split">
          <figure className="img-slot ratio-4x3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/repair-onsite.jpg" alt="On-site chair repair setup in office" />
          </figure>
          <div>
            <span className="eyebrow">Our Process</span>
            <h2>On-Site Repair in Staggered Batches</h2>
            <ul className="check-list">
              <li>Free inspection and chair-by-chair condition tagging</li>
              <li>Itemised quotation with per-part pricing</li>
              <li>Repairs completed in batches of 20–50 chairs on-site</li>
              <li>Every chair weight-tested before handover</li>
              <li>90-day replacement warranty on all spare parts</li>
            </ul>
            <div className="btn-row" style={{ marginTop: "24px" }}>
              <Link className="btn btn-amber" href="/quote?service=Chair%20Repair">
                Request On-Site Repair
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
