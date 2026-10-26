"use client";

import { useState } from "react";
import Link from "next/link";
import Lightbox from "./Lightbox";
import Photo, { SIZES } from "./Photo";
import { chairQuoteHref } from "@/lib/furniture";

export default function ChairGallery({ chairs, groups, groupKey = "group" }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null); // { chair, index }

  const counts = Object.fromEntries(groups.map((g) => [g.id, chairs.filter((c) => c[groupKey] === g.id).length]));
  const visible = filter === "all" ? chairs : chairs.filter((c) => c[groupKey] === filter);

  return (
    <>
      <div className="shop-filters pf-filters" role="group" aria-label="Filter chairs by type">
        <button type="button" className={filter === "all" ? "on" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span>{chairs.length}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={filter === g.id ? "on" : ""}
            aria-pressed={filter === g.id}
            onClick={() => setFilter(g.id)}
          >
            {g.label} <span>{counts[g.id]}</span>
          </button>
        ))}
      </div>

      <div className="pf-grid">
        {visible.map((chair) => {
          const [main] = chair.images;
          const photoLabel = chair.images.length > 1 ? `${chair.images.length} photos` : "1 photo";
          return (
            <article key={chair.id} className="pf-card">
              <button
                type="button"
                className={`pf-media ${chair.cover ? "cover" : ""}`}
                onClick={() => setActive({ chair, index: 0 })}
                aria-label={`View photos of ${chair.name}`}
              >
                <Photo className="pf-img" src={main.src} alt={main.alt} sizes={SIZES.chairCard} />
                <span className="pf-badge">{chair.badge || photoLabel}</span>
              </button>
              <div className="pf-body">
                <h3>
                  {chair.name.split(" · ")[0]}
                  {chair.name.includes(" · ") && <span className="pf-finish">{chair.name.split(" · ")[1]}</span>}
                </h3>
                <div className="pf-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setActive({ chair, index: 0 })}>
                    View Photos
                  </button>
                  <Link className="btn btn-amber btn-sm" href={chairQuoteHref(chair.name)}>
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Lightbox
        images={active ? active.chair.images : []}
        index={active ? active.index : null}
        title={active?.chair.name}
        onIndexChange={(index) => setActive((a) => (a ? { ...a, index } : a))}
        onClose={() => setActive(null)}
      />
    </>
  );
}
