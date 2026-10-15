"use client";

import { useEffect, useRef } from "react";

// Image lightbox on the native <dialog> element: the browser provides the focus trap,
// Esc-to-close and the backdrop. Arrow keys step through the images.
export default function Lightbox({ images, index, title, onIndexChange, onClose }) {
  const dialogRef = useRef(null);
  const isOpen = index !== null && images.length > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      const opener = document.activeElement;
      dialog.showModal();
      const restore = () => opener && typeof opener.focus === "function" && opener.focus();
      dialog.addEventListener("close", restore, { once: true });
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const step = (delta) => onIndexChange((index + delta + images.length) % images.length);

  const onKeyDown = (e) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  const current = isOpen ? images[index] : null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={title ? `${title} photos` : "Photos"}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // a click on the backdrop lands on the dialog element itself
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {current && (
        <div className="lightbox-inner">
          <div className="lightbox-head">
            <div>
              {title && <strong>{title}</strong>}
              {images.length > 1 && (
                <span className="lightbox-count">
                  {index + 1} / {images.length}
                </span>
              )}
            </div>
            <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close photos">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <figure className="lightbox-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} />
            {images.length > 1 && (
              <>
                <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photo">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photo">
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
            <figcaption>{current.alt}</figcaption>
          </figure>

          {images.length > 1 && (
            <div className="lightbox-thumbs" role="group" aria-label="Choose photo">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  className={i === index ? "on" : ""}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => onIndexChange(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
