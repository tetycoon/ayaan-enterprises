"use client";

import { useState } from "react";

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt, title, subtitle }) {
  const [val, setVal] = useState(50);

  return (
    <div className="reveal in">
      <div className="ba" style={{ "--pos": `${val}%` }}>
        <figure className="img-slot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeSrc} alt={beforeAlt || "Before"} />
        </figure>
        <figure className="img-slot ba-after" style={{ clipPath: `inset(0 0 0 ${val}%)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterSrc} alt={afterAlt || "After"} />
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
          value={val}
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
