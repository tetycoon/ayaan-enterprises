"use client";

import Link from "next/link";
import { clearStoredCart } from "@/lib/cart";
import Photo, { SIZES } from "./Photo";

const CHAIR_TYPES = [
  {
    name: "Ergonomic High-Back",
    cat: "Workstation",
    image: "/images/products/ergonomic-highback-black.jpg",
    contain: true,
    specs: "Synchro Tilt · Adjustable Lumbar · 3D Arms",
    tag: "High Demand"
  },
  {
    name: "Executive Leatherette",
    cat: "Cabin Seating",
    image: "/images/products/executive-leatherette-black.jpg",
    contain: true,
    specs: "High-Back Cushioning · Polished Chrome Base",
    tag: "Executive"
  },
  {
    name: "Breathable Mesh Task",
    cat: "Office Staff",
    image: "/images/products/mesh-midback-black.png",
    contain: true,
    specs: "Cool Airflow Mesh · Dual Castor Wheels",
    tag: "Popular"
  },
  {
    name: "Workstation Swivel",
    cat: "Desk Chair",
    image: "/images/products/workstation-midback-black.png",
    contain: true,
    specs: "Heavy-Duty Fabric · Class-4 Hydraulic Lift",
    tag: "Standard"
  },
  {
    name: "Visitor & Cantilever",
    cat: "Meeting Room",
    image: "/images/prod-visitor.jpg",
    specs: "Steel Cantilever Frame · Padded Foam Seat",
    tag: "Conference"
  },
  {
    name: "3-Seater Waiting Bench",
    cat: "Lobby & Reception",
    image: "/images/chairs-waiting.jpg",
    specs: "Reinforced Steel Beam · High-Traffic Fabric",
    tag: "Commercial"
  },
  {
    name: "Auditorium & Seminar",
    cat: "Training Halls",
    image: "/images/chairs-auditorium.jpg",
    specs: "Tip-Up Cushioned Seats · Fixed Row Layout",
    tag: "Institutional"
  },
  {
    name: "Pro Ergonomic Desk",
    cat: "Tech & IT Teams",
    image: "/images/products/ergonomic-headrest-black.png",
    contain: true,
    specs: "Neck Rest · Multi-Angle Lock · Foam Seat",
    tag: "Ergonomic"
  },
  {
    name: "Pantry & Staff Dining",
    cat: "Dining & Pantry",
    image: "/images/chair-pantry.jpg",
    contain: true,
    specs: "Moulded Shell · Padded Seat · Steel Legs",
    tag: "Breakout"
  }
];

export default function ChairGalleryMarquee() {
  // Duplicate array for seamless infinite sliding animation
  const marqueeItems = [...CHAIR_TYPES, ...CHAIR_TYPES];

  return (
    <section className="chair-gallery-section">
      <div className="container">
        <div className="section-head center" style={{ maxWidth: "720px", marginBottom: "36px" }}>
          <span className="eyebrow">Types of Chairs We Service</span>
          <h2>Office Seating Collections</h2>
          <p>
            We repair, deep clean, re-upholster, and supply replacement parts for all office seating models across Chennai.
          </p>
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="marquee-card">
              <div className={`marquee-img-wrap${item.contain ? " contain" : ""}`}>
                <Photo src={item.image} alt={item.name} sizes={SIZES.marquee} />
                <span className="marquee-badge">{item.tag}</span>
              </div>
              <div className="marquee-body">
                <span className="marquee-cat">{item.cat}</span>
                <h4>{item.name}</h4>
                <p className="marquee-specs">{item.specs}</p>
                <Link className="marquee-link" href="/quote" onClick={() => clearStoredCart()}>
                  Get Quote &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
