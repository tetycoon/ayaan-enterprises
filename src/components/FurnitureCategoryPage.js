import Link from "next/link";
import { waLink } from "@/lib/config";
import ChairGallery from "@/components/ChairGallery";
import PhotoGallery from "@/components/PhotoGallery";
import FurnitureIcon from "@/components/FurnitureIcon";
import Photo, { SIZES } from "@/components/Photo";
import {
  getFurnitureCategory,
  officeFurnitureHref,
  furnitureEnquiryHref,
  chairsFor
} from "@/lib/furniture";

// Metadata for a category route, from the shared catalogue.
export function furnitureMetadata(slug) {
  const c = getFurnitureCategory(slug);
  return { title: c.title, description: c.description };
}

export default function FurnitureCategoryPage({ slug }) {
  const c = getFurnitureCategory(slug);
  const enquiryHref = furnitureEnquiryHref(c.label);
  const enquiryLabel = `Enquire About ${c.label}`;
  const waHref = waLink(`Hi, I'd like to discuss ${c.label.toLowerCase()} for our office.`);
  const related = c.related.map(getFurnitureCategory);

  return (
    <main>
      <section className="page-hero">
        <div className={`container page-hero-grid ${c.hero ? "" : "no-media"}`}>
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link> / <Link href="/office-furniture">Office Furniture</Link> / {c.label}
            </nav>
            <span className="eyebrow">Office Furniture · {c.label}</span>
            <h1>{c.h1}</h1>
            <p className="lead">{c.intro}</p>
            <div className="btn-row">
              <Link className="btn btn-amber" href={enquiryHref}>
                {enquiryLabel}
              </Link>
              <a className="btn btn-ghost" target="_blank" rel="noopener noreferrer" href={waHref}>
                WhatsApp Us
              </a>
            </div>
          </div>
          {c.hero && (
            <figure className={`img-slot ratio-16x10 ${c.hero.contain ? "contain" : ""}`}>
              <Photo
                src={c.hero.src}
                alt={c.hero.alt}
                sizes={SIZES.pageHero}
                hero
                style={c.hero.position ? { objectPosition: c.hero.position } : undefined}
              />
            </figure>
          )}
        </div>
      </section>

      {/* Products / photos, or a catalogue request while photos are pending */}
      <section className="section">
        <div className="container">
          {c.gallery?.type === "chairs" && (
            <>
              <div className="section-head">
                <span className="eyebrow">Our Range</span>
                <h2>{c.gallery.heading}</h2>
                <p>{c.gallery.text}</p>
              </div>
              <ChairGallery chairs={chairsFor(c.gallery.groupKey)} groups={c.gallery.groups} groupKey={c.gallery.groupKey} />
            </>
          )}

          {c.gallery?.type === "photos" && (
            <>
              <div className="section-head">
                <span className="eyebrow">Gallery</span>
                <h2>{c.gallery.heading}</h2>
                <p>{c.gallery.note}</p>
              </div>
              <PhotoGallery photos={c.gallery.photos} title={c.gallery.heading} />
            </>
          )}

          {(!c.gallery || c.gallery.catalogue) && (
            <div className="fc-catalogue" style={c.gallery ? { marginTop: 28 } : undefined}>
              <div className="fc-catalogue-icon">
                <FurnitureIcon slug={c.slug} size={56} />
              </div>
              <div>
                <h2>{c.hero ? `See more ${c.label.toLowerCase()} options` : `See our current ${c.label.toLowerCase()} options`}</h2>
                <p>
                  {c.hero
                    ? `Looking for a different style or size? Message us on WhatsApp and we'll share photos of the ${c.label.toLowerCase()} options currently available.`
                    : `Photos of our ${c.label.toLowerCase()} range will be added to this page soon. Message us on WhatsApp and we'll share the options and photos currently available.`}
                </p>
                <div className="btn-row">
                  <a className="btn btn-wa" target="_blank" rel="noopener noreferrer" href={waLink(`Hi, please share photos of your ${c.label.toLowerCase()} options.`)}>
                    Ask for Photos on WhatsApp
                  </a>
                  <Link className="btn btn-outline" href={enquiryHref}>
                    {enquiryLabel}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What to include in an enquiry */}
      <section className="section bg-soft">
        <div className="container fc-tips">
          <div>
            <span className="eyebrow">Planning Your Enquiry</span>
            <h2>What to include in your {c.label.toLowerCase()} enquiry</h2>
            <p>These details help us suggest suitable options for your space.</p>
            <Link className="btn btn-amber" href={enquiryHref}>
              {enquiryLabel}
            </Link>
          </div>
          <ul className="check-list">
            {c.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related categories */}
      <section className="section">
        <div className="container">
          <div className="section-head fc-related-head">
            <div>
              <span className="eyebrow">Explore More</span>
              <h2>Related office furniture</h2>
            </div>
            <Link className="link-arrow" href="/office-furniture">
              All office furniture
            </Link>
          </div>
          <div className="fc-cat-grid compact">
            {related.map((r) => (
              <Link key={r.slug} className="fc-cat-card" href={officeFurnitureHref(r.slug)}>
                <span className="fc-cat-icon">
                  <FurnitureIcon slug={r.slug} />
                </span>
                <span className="fc-cat-text">
                  <strong>{r.label}</strong>
                  <span>{r.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
