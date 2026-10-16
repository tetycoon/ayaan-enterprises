"use client";

import { useRef, useState } from "react";
import Photo, { SIZES } from "./Photo";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt, title, subtitle, className = "", sizes = SIZES.grid3 }) {
  const [val, setVal] = useState(50);
  const dragging = useRef(false);

  // Pointer drag on the whole frame (mouse, pen and touch). Touch only claims horizontal
  // movement (touch-action: pan-y in CSS), so the page still scrolls vertically over the photo.
  // The range input stays for keyboard and screen-reader use.
  const moveTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setVal(Math.min(100, Math.max(0, Math.round(pct * 10) / 10)));
  };
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e);
  };
  const onPointerMove = (e) => {
    if (dragging.current) moveTo(e);
  };
  const endDrag = () => {
    dragging.current = false;
  };

  return (
    <div className="reveal in">
      <div
        className={className ? `ba ${className}` : "ba"}
        style={{ "--pos": `${val}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <figure className="img-slot" style={{ "--ba-bg": `url("${beforeSrc}")` }}>
          <Photo src={beforeSrc} alt={beforeAlt || "Before"} sizes={sizes} />
        </figure>
        <figure className="img-slot ba-after" style={{ "--ba-bg": `url("${afterSrc}")`, clipPath: `inset(0 0 0 ${val}%)` }}>
          <Photo src={afterSrc} alt={afterAlt || "After"} sizes={sizes} />
        </figure>
        <span className="ba-label l">Before</span>
        <span className="ba-label r">After</span>
        <span className="ba-handle" style={{ left: `${val}%` }} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 7 3 12 8 17" />
            <polyline points="16 7 21 12 16 17" />
          </svg>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(val)}
          onChange={(e) => setVal(Number(e.target.value))}
          aria-label="Compare before and after"
        />
      </div>
      {(title || subtitle) && (
        <div className="ba-meta">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
