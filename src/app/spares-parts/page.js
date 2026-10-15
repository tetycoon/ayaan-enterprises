import Link from "next/link";
import { waLink } from "@/lib/config";
import Photo, { SIZES } from "@/components/Photo";

export const metadata = {
  title: "Office Chair Spare Parts & Replacement Components | Ayaan Enterprises",
  description:
    "Office chair spare parts and replacement components for chair repair and maintenance in Chennai. Enquire with Ayaan Enterprises about parts for your chair model."
};

const ENQUIRY_HREF = `/quote?service=${encodeURIComponent("Chair Repair & Spares")}`;

// Part types already named on the site's products page; illustrations from the existing assets.
const PARTS = [
  { name: "Gas Lifts / Cylinders", img: "/images/part-gas-lift.svg", alt: "Illustration of two office chair gas lift cylinders" },
  { name: "Wheels & Castors", img: "/images/part-wheels.svg", alt: "Illustration of office chair castor wheels" },
  { name: "Star Bases", img: "/images/part-base.svg", alt: "Illustration of a five-star office chair base" },
  { name: "Tilt Mechanisms", img: "/images/part-mechanism.svg", alt: "Illustration of an office chair tilt mechanism" },
  { name: "Armrests", img: "/images/part-armrest.svg", alt: "Illustration of a pair of office chair armrests" }
];

export default function SparesPartsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Spares / Parts
            </div>
            <span className="eyebrow">Spares / Parts</span>
            <h1>Office chair spare parts &amp; replacement components</h1>
            <p className="lead">
              AYAAN ENTERPRISES offers office chair spare parts and replacement components to support chair repair and
              maintenance. Contact our team to enquire about the availability of suitable parts for your chair model and
              requirements.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href={ENQUIRY_HREF}>
                Enquire About Spare Parts
              </Link>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I'm looking for spare parts for my office chair. Sharing a photo of the chair.")}
              >
                WhatsApp a Photo
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            <Photo src="/images/service-repair.jpg" alt="Technician fitting a replacement gas lift to an office chair" sizes={SIZES.pageHero} hero />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Chair Components</span>
            <h2>Parts you can enquire about</h2>
          </div>
          <div className="spares-grid">
            {PARTS.map((p) => (
              <article key={p.name} className="card service-card">
                <figure className="img-slot ratio-4x3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.alt} loading="lazy" />
                </figure>
                <div className="body">
                  <h3>{p.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container pf-cta">
          <div>
            <h2>Not sure which part your chair needs?</h2>
            <p>Send us a photo of the chair or the part, and our team will check what suits your model.</p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-amber" href={ENQUIRY_HREF}>
              Enquire About Spare Parts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
