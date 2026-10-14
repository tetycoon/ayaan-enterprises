"use client";

import Link from "next/link";
import { clearStoredCart } from "@/lib/cart";

const CHAIR_TYPES = [
  {
    name: "Ergonomic High-Back",
    cat: "Workstation",
    image: "/images/hero-ergonomic.jpg",
    specs: "Synchro Tilt · Adjustable Lumbar · 3D Arms",
    tag: "High Demand"
  },
  {
    name: "Executive Leatherette",
    cat: "Cabin Seating",
    image: "/images/hero-executive.jpg",
    specs: "High-Back Cushioning · Polished Chrome Base",
    tag: "Executive"
  },
  {
    name: "Breathable Mesh Task",
    cat: "Office Staff",
    image: "/images/hero-mesh.jpg",
    specs: "Cool Airflow Mesh · Dual Castor Wheels",
    tag: "Popular"
  },
  {
    name: "Workstation Swivel",
    cat: "Desk Chair",
    image: "/images/prod-office.jpg",
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
    image: "/images/hero-desk.jpg",
    specs: "Neck Rest · Multi-Angle Lock · Foam Seat",
    tag: "Ergonomic"
  },
  {
    name: "Cafeteria & Breakout",
    cat: "Dining & Pantry",
    image: "/images/chair-wooden.jpg",
    specs: "Solid Hardwood Frame · Scratch-Resistant",
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
              <div className="marquee-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} loading="lazy" />
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
