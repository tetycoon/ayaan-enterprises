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
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof window === "undefined" || isAdmin) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    document.documentElement.classList.add("has-scroll-animations");

    let observer;

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

      const targets = document.querySelectorAll(selectors.join(", "));

      targets.forEach((el) => {
        if (!el.classList.contains("scroll-reveal")) {
          el.classList.add("scroll-reveal");

          // Stagger items inside grids
          const parentGrid = el.closest(".grid, .process-grid, .shop-grid, .testimonial-grid");
          if (parentGrid) {
            const siblings = Array.from(parentGrid.children);
            const childIndex = siblings.indexOf(el);
            if (childIndex > 0) {
              const delay = Math.min(childIndex * 0.12, 0.48);
              el.style.transitionDelay = `${delay}s`;
            }
          }
        }
      });

      if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".scroll-reveal").forEach((el) => el.classList.add("in"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
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
      document.querySelectorAll(".scroll-reveal:not(.in)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If already in viewport on initial load, show immediately
        if (rect.top < winH && rect.bottom > 0) {
          el.classList.add("in");
        } else {
          observer.observe(el);
        }
      });
    };

    const timer = setTimeout(setupObserver, 50);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

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
