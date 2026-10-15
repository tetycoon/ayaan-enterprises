import Link from "next/link";
import { waLink } from "@/lib/config";
import FurnitureIcon from "@/components/FurnitureIcon";
import { OFFICE_FURNITURE, officeFurnitureHref, furnitureEnquiryHref } from "@/lib/furniture";
import Photo, { SIZES } from "@/components/Photo";

export const metadata = {
  title: "Office Furniture in Chennai: Tables, Workstations, Storage & Seating | Ayaan Enterprises",
  description:
    "Browse office furniture categories from Ayaan Enterprises: boss tables, cabin furniture, conference tables, workstations, office cabinets, ergonomic furniture and seating."
};

export default function OfficeFurniturePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link> / Office Furniture
            </nav>
            <span className="eyebrow">Office Furniture</span>
            <h1>Office furniture for every part of your workplace</h1>
            <p className="lead">
              From management cabins and meeting rooms to team workstations, storage and seating, choose a category
              below to see what we offer, then send us your requirements.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href={furnitureEnquiryHref("")}>
                Send a Furniture Enquiry
              </Link>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I'd like to discuss office furniture for our workplace.")}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            <Photo src="/images/industry-corporate.jpg" alt="Open-plan office with rows of desks and ergonomic chairs" sizes={SIZES.pageHero} hero />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Categories</span>
            <h2>Browse by category</h2>
          </div>
          <div className="fc-cat-grid">
            {OFFICE_FURNITURE.map((c) => (
              <Link key={c.slug} className="fc-cat-card" href={officeFurnitureHref(c.slug)}>
                <span className="fc-cat-icon">
                  <FurnitureIcon slug={c.slug} />
                </span>
                <span className="fc-cat-text">
                  <strong>{c.label}</strong>
                  <span>{c.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
