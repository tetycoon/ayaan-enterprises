"use client";

import Link from "next/link";
import { SITE, waLink } from "@/lib/config";
import { clearStoredCart } from "@/lib/cart";

export default function MobileBottomBar() {
  return (
    <nav className="mobile-bottom-bar" aria-label="Quick contact actions">
      {/* Call Now */}
      <a
        className="mbb-item mbb-call"
        href={`tel:${SITE.phone2Link}`}
        aria-label={`Call ${SITE.phone2}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
          <path
            fill="currentColor"
            d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1Z"
          />
        </svg>
        <span>Call Now</span>
      </a>

      {/* WhatsApp Photo Share */}
      <a
        className="mbb-item mbb-wa"
        href={waLink("Hi, I want to share chair photos for an instant repair / cleaning quote.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share chair photos on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"
          />
        </svg>
        <span>WhatsApp Photos</span>
      </a>

      {/* Get Quotes */}
      <Link
        className="mbb-item mbb-quote"
        href="/quote"
        aria-label="Get Free Quotes"
        onClick={() => clearStoredCart()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
          <path
            fill="currentColor"
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 1.5L18.5 9H13V3.5ZM8 13h8v1.5H8V13Zm0 3h5v1.5H8V16Zm0-6h3v1.5H8V10Z"
          />
        </svg>
        <span>Get Quotes</span>
      </Link>
    </nav>
  );
}
