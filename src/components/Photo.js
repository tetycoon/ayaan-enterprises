import Image from "next/image";

// Content photo that fills a sized box (an aspect-ratio container with position: relative/absolute).
// next/image serves a resized WebP from a srcset chosen by `sizes`, so phones and retina screens
// each download the width they need; the existing CSS still decides cover/contain and cropping.
// Images above the fold pass `hero` so they load eagerly at high priority.
// `zoom` is for a wide photo cropped (object-fit: cover) into a taller box: the crop needs more source
// pixels than the box width, so the slot widths in `sizes` are scaled up by that factor.
export default function Photo({ alt, sizes, hero = false, zoom = 1, quality = 85, ...props }) {
  return (
    <Image
      alt={alt}
      fill
      sizes={zoom === 1 ? sizes : scaleSizes(sizes, zoom)}
      quality={quality}
      {...(hero ? { loading: "eager", fetchPriority: "high" } : null)}
      {...props}
    />
  );
}

// Scales the slot width at the end of each `sizes` entry ("(max-width: 640px) 92vw" -> "... 110vw").
function scaleSizes(sizes, k) {
  return sizes
    .split(",")
    .map((part) => part.replace(/(\d+(?:\.\d+)?)(px|vw)\s*$/, (m, n, unit) => `${Math.round(n * k)}${unit}`))
    .join(",");
}

// `sizes` presets matching the layout breakpoints in src/styles/style.css.
export const SIZES = {
  pageHero: "(max-width: 980px) 92vw, 620px", // .page-hero-grid image column
  split: "(max-width: 980px) 92vw, 580px", // .split half
  grid3: "(max-width: 640px) 92vw, (max-width: 980px) 46vw, 400px", // .grid.g-3
  grid4: "(max-width: 640px) 92vw, (max-width: 980px) 46vw, 300px", // .grid.g-4
  gallery: "(max-width: 560px) 92vw, (max-width: 860px) 46vw, 400px", // .fc-photo-grid
  galleryPortrait: "(max-width: 560px) 92vw, (max-width: 860px) 31vw, 400px", // .fc-photo-grid.portrait
  chairCard: "(max-width: 820px) 46vw, (max-width: 1100px) 31vw, 300px", // .pf-grid
  marquee: "(max-width: 640px) 210px, 290px" // .marquee-card
};
