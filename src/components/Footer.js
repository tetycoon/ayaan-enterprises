"use client";

import Link from "next/link";
import { SITE, waLink } from "@/lib/config";
import { clearStoredCart } from "@/lib/cart";
import FooterMap from "./FooterMap";

export default function Footer({ onOpenCallback }) {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-cta">
        <div className="container footer-cta-in">
          <div>
            <h2>Have 10, 50, or 500+ office chairs to fix?</h2>
            <p>Send photos and chair count. We reply with a clear price estimate the same day.</p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-amber" href="/quote" onClick={() => clearStoredCart()}>
              Get Free Quote
            </Link>
            <a
              className="btn btn-wa"
              target="_blank"
              rel="noopener noreferrer"
              href={waLink("Hi, I want to share chair photos for a repair / cleaning quote.")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"
                />
              </svg>
              WhatsApp Photos
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-grid">
        <div>
          <Link
            href="/"
            aria-label={`${SITE.name} home`}
            className="footer-logo-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              maxWidth: "fit-content",
              background: "#ffffff",
              padding: "6px 12px",
              borderRadius: "8px",
              marginBottom: "16px"
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="footer-logo"
              src={SITE.logo}
              alt={SITE.name}
              width="585"
              height="222"
              style={{ height: "46px", width: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>
          <p>
            {SITE.tagline}. On-site chair repair, deep shampoo extraction, and complete refurbishment with before &amp;
            after photo proof.
          </p>
        </div>
        <div>
          <h3>Services</h3>
          <Link href="/chair-repair">Chair Repair</Link>
          <Link href="/chair-cleaning">Old Chair Cleaning</Link>
          <Link href="/bulk-service">Bulk Service</Link>
          <Link href="/products">Spare Parts &amp; New Chairs</Link>
          <Link href="/shop">Buy Office Chairs</Link>
          <Link href="/office-furniture">Office Furniture</Link>
          <Link href="/office-furniture/ergonomics">Ergonomic Office Chairs</Link>
        </div>
        <div>
          <h3>Company</h3>
          <Link href="/our-work">Our Completed Work</Link>
          <Link href="/quote" onClick={() => clearStoredCart()}>Request a Quote</Link>
          <button type="button" className="footer-link-btn" onClick={onOpenCallback}>
            Request a Callback
          </button>
          <Link href="/admin">Staff Login</Link>
        </div>
        <div>
          <h3>Contact Us</h3>
          <a href={`tel:${SITE.phoneLink}`}>Call: {SITE.phone}</a>
          <a target="_blank" rel="noopener noreferrer" href={waLink()}>
            WhatsApp: {SITE.whatsappDisplay}
          </a>
          <p>{SITE.address}</p>
          <p>{SITE.hours}</p>
        </div>
        <FooterMap />
      </div>

      <div className="container footer-bottom">
        <span>&copy; 2026 {SITE.name}. All rights reserved.</span>
        <span>Service &amp; Repair All Over Chennai | Sales All Over Tamil Nadu</span>
      </div>
    </footer>
  );
}
