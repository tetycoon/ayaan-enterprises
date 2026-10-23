"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { waLink } from "@/lib/config";
import { getStoredCart, saveStoredCart, getCartSummary, CATALOGUE } from "@/lib/cart";

const CATEGORIES = ["All", "Ergonomic", "Executive", "Mesh", "Visitor & waiting", "Auditorium", "Pantry"];

export default function ShopPage() {
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState({});
  const cartRef = useRef({});
  const router = useRouter();

  useEffect(() => {
    const storedCart = getStoredCart();
    cartRef.current = storedCart;
    setCart(storedCart);
  }, []);

  const updateQty = (id, getNextQty) => {
    const currentQty = cartRef.current[id] || 0;
    const nextQty = Math.max(0, getNextQty(currentQty));
    const nextCart = { ...cartRef.current };
    if (nextQty === 0) {
      delete nextCart[id];
    } else {
      nextCart[id] = nextQty;
    }

    cartRef.current = nextCart;
    setCart(nextCart);
    saveStoredCart(nextCart);
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + (Number(b) || 0), 0);

  const handleCheckout = () => {
    const summary = getCartSummary(cart);
    const query = new URLSearchParams({
      qty: String(summary.totalQty || totalItems || 1),
      items: summary.textSummary,
      chairTypes: summary.typesList.join(","),
      service: "Buy New Office Chairs"
    }).toString();

    router.push(`/quote?${query}`);
  };

  const filteredItems = CATALOGUE.filter((p) => filter === "All" || p.cat === filter);

  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Buy Chairs
            </div>
            <span className="eyebrow">Chair shop</span>
            <h1>New office chairs, delivered and installed</h1>
            <p className="lead">
              Ergonomic, executive, mesh, visitor and auditorium seating for offices of every size. Pick your chairs
              and quantities, and we&apos;ll send you the best corporate price with a GST invoice.
            </p>
            <div className="btn-row">
              <a className="btn btn-amber" href="#catalogue">
                Browse chairs
              </a>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I want to buy office chairs. Please share your catalogue and prices.")}
              >
                WhatsApp us
              </a>
            </div>
            <ul className="shop-perks">
              <li>Bulk pricing</li>
              <li>Free installation</li>
              <li>Warranty</li>
              <li>GST invoice</li>
            </ul>
          </div>
          <div className="shop-collage" aria-hidden="true">
            <figure className="shop-tile t1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-ergonomic.jpg" alt="" />
            </figure>
            <figure className="shop-tile t2 white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-executive.jpg" alt="" />
            </figure>
            <figure className="shop-tile t3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-mesh.jpg" alt="" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section" id="catalogue">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Catalogue</span>
            <h2>Choose your chairs</h2>
            <p>Set the quantity and add chairs to your enquiry. We reply with prices, delivery dates and bulk discounts.</p>
          </div>

          <div className="shop-filters" role="group" aria-label="Filter by category">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={c === filter ? "on" : ""}
                aria-pressed={c === filter}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="shop-grid">
            {filteredItems.map((p) => {
              const qty = cart[p.id] || 0;
              return (
                <article key={p.id} className="shop-card">
                  <div className={`shop-media ${p.white ? "white" : ""}`}>
                    <div className="shop-media-bg" style={{ backgroundImage: `url('${p.img}')` }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} loading="lazy" />
                  </div>
                  <div className="shop-body">
                    <span className="tag">{p.cat}</span>
                    <h3>{p.name}</h3>
                    <ul className="shop-feat">
                      {(p.features || []).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                    <div className="shop-foot">
                      <div className="shop-price">Ask for price</div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => updateQty(p.id, (qty) => qty + 1)}
                          aria-label={`Add ${p.name}`}
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="qty-picker" role="group" aria-label={`Quantity for ${p.name}`}>
                          <button
                            type="button"
                            className="qty-btn"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(p.id, (qty) => qty - 1)}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={qty}
                            aria-label={`Quantity for ${p.name}`}
                            onChange={(e) => updateQty(p.id, () => parseInt(e.target.value, 10) || 0)}
                          />
                          <button
                            type="button"
                            className="qty-btn"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(p.id, (qty) => qty + 1)}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalItems > 0 && (
            <div
              style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 100,
                background: "rgba(9, 24, 43, 0.94)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                color: "#fff",
                padding: "14px 22px",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(13, 148, 136, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>🪑</span>
                <div>
                  <strong style={{ fontSize: "0.95rem", display: "block" }}>{totalItems} chairs selected</strong>
                  <span style={{ fontSize: "0.76rem", color: "#9cb5ce" }}>Ready for bulk quotation</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-amber btn-sm"
                onClick={handleCheckout}
                style={{ fontWeight: 800, whiteSpace: "nowrap" }}
              >
                New Chair Buy Quotes &rarr;
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
