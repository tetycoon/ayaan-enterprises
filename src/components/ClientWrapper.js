"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";
import MobileBottomBar from "./MobileBottomBar";
import CallbackModal from "./CallbackModal";
import LogoPreloader from "./LogoPreloader";

export default function ClientWrapper({ children }) {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    document.documentElement.classList.add("has-scroll-animations");

    let observer;
    const animations = new Map();

    // Entrance motion per element type. Animations run through the Web Animations API so
    // React-owned nodes never get class/style attribute changes; the page segment may hydrate
    // after this effect runs, and mutating its attributes would cause a hydration mismatch.
    const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
    const motionFor = (el) => {
      if (el.matches(".section-head")) return { from: "translateY(22px)", to: "translateY(0)", duration: 750 };
      if (el.matches(".card, .service-card, .process-card, .testimonial, .shop-card, .roi-card, .ba-card"))
        return { from: "translateY(36px) scale(0.98)", to: "translateY(0) scale(1)", duration: 850 };
      if (el.matches(".trust-bar, .stat-band, .footer-cta-in, .chair-gallery-section"))
        return { from: "translateY(28px)", to: "translateY(0)", duration: 900 };
      return { from: "translateY(32px)", to: "translateY(0)", duration: 850 };
    };

    const setupObserver = () => {
      const selectors = [
        "main > section:not(.hero)",
        ".section-head",
        ".service-card",
        ".process-card",
        ".testimonial",
        ".shop-card",
        ".stat-band",
        ".trust-bar",
        ".roi-card",
        ".footer-cta-in",
        ".clean-photo",
        ".chair-gallery-section",
        ".ba-card",
        ".split.quote-layout > *",
        ".reveal"
      ];

      // Without these APIs, content simply stays visible.
      if (!("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function") return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animations.get(entry.target)?.play();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -40px 0px",
          threshold: 0.08
        }
      );

      const winH = window.innerHeight;
      document.querySelectorAll(selectors.join(", ")).forEach((el) => {
        // Already-revealed markup (e.g. "reveal in") and anything in view on load stays as rendered
        if (el.classList.contains("in")) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < winH && rect.bottom > 0) return;

        // Stagger items inside grids
        let delay = 0;
        const parentGrid = el.closest(".grid, .process-grid, .shop-grid, .testimonial-grid");
        if (parentGrid) {
          const childIndex = Array.from(parentGrid.children).indexOf(el);
          if (childIndex > 0) delay = Math.min(childIndex * 120, 480);
        }

        const { from, to, duration } = motionFor(el);
        // fill "backwards" holds the hidden first frame while paused; once finished the
        // element falls back to its normal CSS (so hover effects keep working).
        const anim = el.animate(
          [
            { opacity: 0, transform: from },
            { opacity: 1, transform: to }
          ],
          { duration, delay, easing: EASE, fill: "backwards" }
        );
        anim.pause();
        animations.set(el, anim);
        observer.observe(el);
      });
    };

    const timer = setTimeout(setupObserver, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      animations.forEach((anim) => anim.cancel());
    };
  }, [pathname]);

  return (
    <>
      <LogoPreloader />
      <Header />
      {children}
      <Footer onOpenCallback={() => setCallbackOpen(true)} />
      <FloatingActions onOpenCallback={() => setCallbackOpen(true)} />
      <MobileBottomBar />
      <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  );
}
