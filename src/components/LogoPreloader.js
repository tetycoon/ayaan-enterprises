"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LogoPreloader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Lock scrolling during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startTime = Date.now();
    const duration = 1400; // 1.4 seconds for a snappy, luxurious feel

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Hold for 180ms at 100% then fade out
        setTimeout(() => {
          setFading(true);
          setTimeout(() => {
            setHidden(true);
            document.body.style.overflow = originalOverflow;
          }, 500); // 500ms fade transition
        }, 180);
      }
    };

    const animId = requestAnimationFrame(updateProgress);

    // Fallback safety release after 2.5s
    const safetyTimeout = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setHidden(true);
        document.body.style.overflow = originalOverflow;
      }, 500);
    }, 2500);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(safetyTimeout);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (hidden) return null;

  return (
    <aside
      id="website-preloader"
      aria-label="Loading Ayaan Enterprises"
      role="status"
      aria-live="polite"
      className={`preloader-overlay ${fading ? "preloader-fade" : ""}`}
    >
      <style>{`
        .preloader-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 45%, #0f2742 0%, #06111f 70%, #030810 100%);
          color: #ffffff;
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s ease;
          overflow: hidden;
        }

        .preloader-fade {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* Ambient Glow Backdrop Elements */
        .preloader-glow-teal {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(20, 184, 166, 0.22) 0%, transparent 70%);
          filter: blur(40px);
          animation: preloaderPulse 3s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .preloader-glow-gold {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 165, 36, 0.18) 0%, transparent 70%);
          filter: blur(50px);
          transform: translate(60px, 40px);
          animation: preloaderPulse 3s ease-in-out infinite alternate-reverse;
          pointer-events: none;
        }

        @keyframes preloaderPulse {
          0% { transform: scale(0.9) translate(-10px, -10px); opacity: 0.7; }
          100% { transform: scale(1.15) translate(15px, 15px); opacity: 1; }
        }

        .preloader-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px;
          max-width: 360px;
          width: 100%;
        }

        /* 3. Logo Loader Animation Container */
        .logo-loader-wrap {
          position: relative;
          width: 124px;
          height: 124px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        /* Rotating Glowing Multi-Color Ring */
        .logo-aura-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #14b8a6,
            #f5a524,
            #a855f7,
            #06b6d4,
            #14b8a6
          );
          animation: auraRotate 2.6s linear infinite;
          filter: blur(4px);
          opacity: 0.85;
        }

        /* Subtle Inner Pulse Ring */
        .logo-pulse-ring {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          border: 1.5px solid rgba(20, 184, 166, 0.35);
          animation: pulseBorder 2s ease-in-out infinite;
        }

        @keyframes auraRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseBorder {
          0% { transform: scale(0.92); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.8; }
          100% { transform: scale(0.92); opacity: 0.3; }
        }

        /* Circular Logo Badge with Shadow & Glassmorphism */
        .logo-circle-badge {
          position: relative;
          z-index: 3;
          width: 116px;
          height: 116px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 
            0 14px 36px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.9),
            0 0 35px rgba(20, 184, 166, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: logoBreathing 2.4s ease-in-out infinite;
        }

        @keyframes logoBreathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        .logo-img {
          width: 74px;
          height: 74px;
          object-fit: contain;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12));
        }

        /* Brand Typography */
        .preloader-brand {
          margin-bottom: 20px;
        }

        .preloader-brand-title {
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 5px 0;
          background: linear-gradient(135deg, #ffffff 0%, #d8e5f2 70%, #9cb5ce 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .preloader-brand-tagline {
          font-size: 0.78rem;
          font-weight: 600;
          color: #14b8a6;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0;
        }

        /* 2. Animated Progress Bar Container */
        .preloader-progress-wrap {
          width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
        }

        .preloader-progress-track {
          width: 100%;
          height: 5px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .preloader-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #14b8a6 0%, #2dd4bf 50%, #f5a524 100%);
          border-radius: 999px;
          transition: width 0.1s linear;
          box-shadow: 0 0 12px rgba(245, 165, 36, 0.6);
        }

        .preloader-status-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.03em;
        }

        .preloader-pct {
          color: #f5a524;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      {/* Ambient Radial Lights */}
      <div className="preloader-glow-teal" aria-hidden="true" />
      <div className="preloader-glow-gold" aria-hidden="true" />

      <div className="preloader-content">
        {/* 3. Logo Loader Animation (Circular badge + glowing spinning aura + soft shadow) */}
        <div className="logo-loader-wrap">
          <div className="logo-aura-ring" aria-hidden="true" />
          <div className="logo-pulse-ring" aria-hidden="true" />
          <div className="logo-circle-badge">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-mark.png"
              alt="Ayaan Enterprises Logo Mark"
              className="logo-img"
              width={74}
              height={74}
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="preloader-brand">
          <h1 className="preloader-brand-title">Ayaan Enterprises</h1>
          <p className="preloader-brand-tagline">Corporate Seating Care &middot; Chennai</p>
        </div>

        {/* 2. Animated Progress Bar */}
        <div className="preloader-progress-wrap">
          <div className="preloader-progress-track">
            <div
              className="preloader-progress-fill"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="preloader-status-row">
            <span>Loading Experience...</span>
            <span className="preloader-pct">{progress}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
