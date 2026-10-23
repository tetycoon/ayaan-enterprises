"use client";

import { useState, useEffect, useRef } from "react";
import { SITE, waLink } from "@/lib/config";
import Link from "next/link";

const SLIDES = [
  {
    src: "/images/hero-carpenter.jpg",
    alt: "Skilled technician repairing the base and gas lift of an ergonomic office chair in a modern office",
    title: "Expert repair, done on-site",
    desc: "Skilled technicians service every part of your chair",
    className: "scene"
  },
  {
    src: "/images/hero-ergonomic.jpg",
    alt: "Black ergonomic office chair with headrest and adjustable arms",
    title: "Ergonomic chairs, restored",
    desc: "New cushions, gas lift and smooth recline",
    className: ""
  },
  {
    src: "/images/hero-executive.jpg",
    alt: "High-back black leatherette executive chair with chrome arms and base",
    title: "Executive chairs like new",
    desc: "Leatherette re-covered, chrome polished",
    className: "light"
  },
  {
    src: "/images/hero-mesh.jpg",
    alt: "Two mesh-back office chairs with teal seats",
    title: "Mesh chairs, deep cleaned",
    desc: "Fresh fabric and spotless mesh on every chair",
    className: ""
  },
  {
    src: "/images/hero-desk.jpg",
    alt: "Ergonomic office chair at a modern work desk",
    title: "Back at the desk, ready to work",
    desc: "Fully serviced, tested and delivered",
    className: ""
  },
  {
    src: "/images/furniture/cabin-storage-header.jpg",
    alt: "Open light wood cabin cabinet with shelves and a hinged door",
    title: "Cabin furniture, built to store",
    desc: "Wooden storage cabinets for your workplace",
    className: "scene"
  }
];

export default function HeroSlides() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [paused, activeIdx]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        setActiveIdx((prev) => (prev + 1) % SLIDES.length);
      } else {
        setActiveIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      }
    }
  };

  return (
    <div
      className="hero-stage-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slides" id="hero-slides" aria-roledescription="carousel" aria-label="Office chairs we service">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === activeIdx;
          return (
            <figure
              key={slide.src}
              className={`hero-slide ${slide.className} ${isActive ? "is-active" : ""}`}
            >
              <div
                className="hero-slide-bg"
                aria-hidden="true"
                style={{ backgroundImage: `url('${slide.src}')` }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt={slide.alt} loading={idx === 0 ? "eager" : "lazy"} />
              <figcaption>
                <b>{slide.title}</b>
                <span>{slide.desc}</span>
              </figcaption>
            </figure>
          );
        })}

        <div className="hero-progress" aria-hidden="true">
          <i key={activeIdx} className="run" />
        </div>

        <div className="hero-dots" role="group" aria-label="Choose slide">
          {SLIDES.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}: ${slide.title}`}
              className={idx === activeIdx ? "on" : ""}
              onClick={() => setActiveIdx(idx)}
            />
          ))}
        </div>
      </div>

      <div className="hero-chip chip-1">
        <b>🔧</b>
        <div>
          Gas lift &amp; wheels<small>Replaced on-site</small>
        </div>
      </div>
      <div className="hero-chip chip-2">
        <b>🧽</b>
        <div>
          Deep cleaned<small>Fabric &amp; mesh</small>
        </div>
      </div>
      <div className="hero-chip chip-3">
        <b>📷</b>
        <div>
          Photo proof<small>Before / after</small>
        </div>
      </div>
    </div>
  );
}
