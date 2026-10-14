"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SITE, waLink } from "@/lib/config";
import { getStoredCart, getCartSummary, clearStoredCart } from "@/lib/cart";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/chair-repair", label: "Chair Repair" },
  { href: "/chair-cleaning", label: "Chair Cleaning" },
  { href: "/bulk-service", label: "Bulk Service" },
  { href: "/products", label: "Spares & Parts" },
  { href: "/shop", label: "Buy Chairs" },
  { href: "/our-work", label: "Our Work" }
];

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartSummary, setCartSummary] = useState({ totalQty: 0, textSummary: "", typesList: [] });
  const pathname = usePathname();
  const router = useRouter();

  const handleGetFreeQuote = () => {
    clearStoredCart();
    setNavOpen(false);
    if (pathname === "/quote") {
      router.replace("/quote");
    }
  };

  useEffect(() => {
    const updateCart = () => {
      setCartSummary(getCartSummary(getStoredCart()));
    };
    updateCart();

    window.addEventListener("chair_cart_updated", updateCart);
    window.addEventListener("storage", updateCart);

    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("chair_cart_updated", updateCart);
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""} ${navOpen ? "nav-open" : ""}`}>
      <div className="topbar">
        <div className="container topbar-in">
          <span>
            {SITE.hours} &middot; Serving Clients All Over Chennai
          </span>
          <span className="topbar-links">
            <a className="topbar-wa" target="_blank" rel="noopener noreferrer" href={waLink()}>
              <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"
                />
              </svg>
              WhatsApp {SITE.phone}
            </a>
            <a href={`tel:${SITE.phoneLink}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                <path
                  fill="currentColor"
                  d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1Z"
                />
              </svg>
              Call {SITE.phone}
            </a>
            <Link href="/admin" className="text-xs text-slate-400 hover:text-white ml-2">
              Staff Login &rarr;
            </Link>
          </span>
        </div>
      </div>

      <div className="container nav-in">
        <Link
          className="brand shrink-0"
          href="/"
          aria-label={`${SITE.name} home`}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center"
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand-logo"
            src={SITE.logo}
            alt={SITE.name}
            width="585"
            height="222"
            style={{
              height: "52px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              flexShrink: 0
            }}
          />
        </Link>

        <button
          className="nav-toggle"
          aria-label="Open menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="main-nav" aria-label="Main">
          {NAV.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={isActive ? "active" : ""}
                aria-current={isActive ? "page" : undefined}
              >
                {n.label}
              </Link>
            );
          })}
          {cartSummary.totalQty > 0 && (
            <Link
              className="btn btn-teal btn-sm nav-cta-chair"
              href={`/quote?service=Buy+New+Office+Chairs&qty=${cartSummary.totalQty}&items=${encodeURIComponent(cartSummary.textSummary)}&chairTypes=${encodeURIComponent(cartSummary.typesList.join(","))}`}
              title="Request quote for selected new chairs"
            >
              <span>New Chair Buy Quotes</span>
              <span className="nav-cart-badge">{cartSummary.totalQty}</span>
            </Link>
          )}
          <Link className="btn btn-amber btn-sm nav-cta" href="/quote" onClick={handleGetFreeQuote}>
            Get Free Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
