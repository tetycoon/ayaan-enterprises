"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/config";

const { lat, lng, listing } = SITE.map;
const EMBED_URL = `https://maps.google.com/maps?q=${lat},${lng}(${encodeURIComponent(listing)})&z=16&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`;

// "Find Us" column in the footer grid: a small square map with a directions button below it.
// The Google Maps iframe is heavy, so it is only mounted once the map is near the viewport; the
// square box holds its size until then (no layout shift).
export default function FooterMap() {
  const boxRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShowMap(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="footer-map-col">
      <h3>Find Us</h3>
      <div className="footer-map" ref={boxRef}>
        {showMap ? (
          <iframe
            src={EMBED_URL}
            title={`Map showing ${SITE.name}, Velachery, Chennai`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <span className="footer-map-placeholder" aria-hidden="true">
            Loading map…
          </span>
        )}
      </div>
      <a className="btn btn-amber btn-sm footer-map-btn" href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4ZM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5L14 14.5Z" />
        </svg>
        Get Directions
      </a>
    </div>
  );
}
