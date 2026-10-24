"use client";

import { SITE, waLink } from "@/lib/config";

export default function FloatingActions({ onOpenCallback }) {
  return (
    <div className="fab">
      <a
        className="fab-btn fab-wa"
        target="_blank"
        rel="noopener noreferrer"
        href={waLink()}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"
          />
        </svg>
        <span>WhatsApp</span>
      </a>
      <a className="fab-btn fab-call" href={`tel:${SITE.phone2Link}`} aria-label="Call us">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
          <path
            fill="currentColor"
            d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1Z"
          />
        </svg>
        <span>Call Now</span>
      </a>
      <button className="fab-btn fab-back" onClick={onOpenCallback} aria-label="Request a callback" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
          <path
            fill="currentColor"
            d="M20 15.5c-1.2 0-2.5-.2-3.6-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .3-1A11.4 11.4 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1ZM19 12h2a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7Zm-4 0h2a5 5 0 0 0-5-5v2a3 3 0 0 1 3 3Z"
          />
        </svg>
        <span>Callback</span>
      </button>
    </div>
  );
}
