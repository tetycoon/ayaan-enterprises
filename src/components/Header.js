"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/config";
import { getStoredCart, getCartSummary } from "@/lib/cart";
import { OFFICE_FURNITURE, officeFurnitureHref } from "@/lib/furniture";

// Office storage is covered by the Office Cabinets category in the Office Furniture menu.
const NAV = [
  { href: "/", label: "Home" },
  {
    label: "Workstation",
    base: "/office-furniture",
    children: [
      ...OFFICE_FURNITURE.map((c) => ({ href: officeFurnitureHref(c.slug), label: c.label })),
      { href: "/office-furniture", label: "All Office Furniture", secondary: true }
    ]
  },
  { href: "/shop", label: "Buy Chairs" },
  { href: "/chair-repair", label: "Chair Repair" },
  { href: "/chair-cleaning", label: "Chair Cleaning" },
  { href: "/bulk-servicing", label: "Bulk Servicing" },
  { href: "/spares-parts", label: "Spares / Parts" },
  { href: "/our-work", label: "Our Work" },
  { href: "/quote", label: "Contact Us" }
];

// Hover-to-open only applies to a real mouse on the desktop layout; touch and the
// collapsed mobile menu use tap/click.
const canHoverOpen = (e) => e.pointerType === "mouse" && window.matchMedia("(min-width: 1280px)").matches;

function NavDropdown({ item, pathname }) {
  // Tracking the path the menu was opened on closes it automatically after navigation.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = `nav-menu-${item.base.slice(1)}`;
  const isActive = pathname.startsWith(item.base);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenOn(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const focusItem = (index) => {
    const links = wrapRef.current?.querySelectorAll(".nav-dd-menu a");
    if (links?.length) links[(index + links.length) % links.length].focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpenOn(null);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const links = Array.from(wrapRef.current?.querySelectorAll(".nav-dd-menu a") || []);
      const current = links.indexOf(document.activeElement);
      if (!open) {
        setOpenOn(pathname);
        requestAnimationFrame(() => focusItem(e.key === "ArrowDown" ? 0 : -1));
      } else {
        focusItem(current === -1 ? (e.key === "ArrowDown" ? 0 : -1) : current + (e.key === "ArrowDown" ? 1 : -1));
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`nav-dd ${open ? "open" : ""}`}
      onPointerEnter={(e) => canHoverOpen(e) && setOpenOn(pathname)}
      onPointerLeave={(e) => canHoverOpen(e) && setOpenOn(null)}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget)) setOpenOn(null);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`nav-dd-toggle ${isActive ? "active" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(e) => {
          // With a desktop mouse the menu is already open from hover, so a click keeps it open
          // instead of toggling it shut. Keyboard (detail 0) and touch toggle.
          const hoverDesktop = e.detail > 0 && window.matchMedia("(hover: hover) and (min-width: 1280px)").matches;
          setOpenOn(open && !hoverDesktop ? null : pathname);
        }}
      >
        {item.label}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className="nav-dd-menu" id={menuId} hidden={!open}>
        {item.children.map((child) => {
          const childActive = pathname === child.href;
          return (
            <li key={child.href} className={child.secondary ? "secondary" : ""}>
              <Link
                href={child.href}
                className={childActive ? "active" : ""}
                aria-current={childActive ? "page" : undefined}
                onClick={() => setOpenOn(null)}
              >
                {child.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartSummary, setCartSummary] = useState({ totalQty: 0, textSummary: "", typesList: [] });
  const pathname = usePathname();
  // The mobile menu stays open only on the path it was opened on, so it closes after navigation.
  const [navOpenOn, setNavOpenOn] = useState(null);
  const navOpen = navOpenOn === pathname;
  const setNavOpen = (value) => setNavOpenOn(value ? pathname : null);

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
              WhatsApp {SITE.whatsappDisplay}
            </a>
            <span className="topbar-nums">
              <a href={`tel:${SITE.phone2Link}`}>Call: {SITE.phone2}</a>
              <span aria-hidden="true">/</span>
              <a href={`tel:${SITE.phoneLink}`}>{SITE.phone}</a>
            </span>
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
            if (n.children) return <NavDropdown key={n.label} item={n} pathname={pathname} />;
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
              <svg className="nav-cta-chair-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M9 5h10M9 12h10M9 19h10M4.5 5h.01M4.5 12h.01M4.5 19h.01"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
              <span className="nav-cta-chair-label">New Chair Buy Quotes</span>
              <span className="nav-cart-badge">{cartSummary.totalQty}</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
