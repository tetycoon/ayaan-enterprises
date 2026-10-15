"use client";

import { useState } from "react";
import Lightbox from "./Lightbox";
import Photo, { SIZES } from "./Photo";

// Grid of setting / project photos that open in the shared lightbox.
// `portrait` uses upright tiles for phone photos; a photo's `position` sets the crop focus and
// `contain` shows a cut-out product photo whole on white instead of cropping it.
export default function PhotoGallery({ photos, title, portrait = false }) {
  const [index, setIndex] = useState(null);

  return (
    <>
      <div className={`fc-photo-grid ${portrait ? "portrait" : ""}`}>
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className={`fc-photo ${photo.contain ? "contain" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Enlarge photo: ${photo.alt}`}
          >
            <Photo
              src={photo.src}
              alt={photo.alt}
              sizes={portrait ? SIZES.galleryPortrait : SIZES.gallery}
              zoom={photo.zoom}
              style={photo.position ? { objectPosition: photo.position } : undefined}
            />
          </button>
        ))}
      </div>
      <Lightbox images={photos} index={index} title={title} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
