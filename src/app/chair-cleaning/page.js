import Link from "next/link";
import { waLink } from "@/lib/config";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Photo, { SIZES } from "@/components/Photo";

export const metadata = {
  title: "Old Chair Deep Cleaning & Shampooing in Chennai | Ayaan Enterprises",
  description:
    "Deep shampoo cleaning for old office chairs in Chennai: fabric stain extraction, mesh foam cleaning, leather conditioning, and 3-4 hour fast drying."
};

export default function ChairCleaningPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Chair Cleaning
            </div>
            <span className="eyebrow">Old Chair Cleaning</span>
            <h1>Stained, dusty office chairs deep cleaned to look like new</h1>
            <p className="lead">
              Machine shampooing, stain extraction, and sanitization for fabric, mesh, and leatherette chairs.
              Chairs dry and ready to use in just 3 to 4 hours.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/quote?service=Chair%20Cleaning">
                Get Cleaning Quote
              </Link>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I need old office chairs deep cleaned. Sharing photos.")}
              >
                WhatsApp Photos
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            <Photo src="/images/page-cleaning.jpg" alt="Shampoo extraction cleaning on fabric office chair" sizes={SIZES.pageHero} hero />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Clean</span>
            <h2>Tailored Cleaning for Every Material</h2>
            <p>The right cleaning method for desk chairs, executive seating, cafeteria, and auditorium chairs.</p>
          </div>
          <div className="grid g-4">
            <div className="card card-top">
              <h3>Fabric Chairs</h3>
              <p>Deep shampooing and hot-water extraction to remove tea, coffee, ink, food, and sweat stains.</p>
            </div>

            <div className="card card-top">
              <h3>Mesh Chairs</h3>
              <p>Low-moisture foam cleaning to clear trapped dust and grime from the mesh weave.</p>
            </div>

            <div className="card card-top">
              <h3>Leather / Leatherette</h3>
              <p>pH-balanced cleaning and conditioning to remove grime and prevent premature cracking.</p>
            </div>

            <div className="card card-top">
              <h3>Auditoriums &amp; Cafeteria</h3>
              <p>High-volume cleaning equipment to shampoo and dry hundreds of seats in a single visit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Real Results</span>
            <h2>See the Cleaning Transformation</h2>
          </div>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <BeforeAfterSlider
              beforeSrc="/images/work-1-before.jpg"
              afterSrc="/images/work-1-after.jpg"
              title="120 Workstation Fabric Chairs Cleaned"
              subtitle="Stain removal & shampoo extraction"
              sizes="(max-width: 760px) 92vw, 700px"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
