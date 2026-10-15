"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SITE, waLink } from "@/lib/config";
import { Store } from "@/lib/store";
import { clearStoredCart, getCartSummary } from "@/lib/cart";
import { OFFICE_FURNITURE } from "@/lib/furniture";

const FURNITURE_SERVICE = "Office Furniture";

const AVAILABLE_CHAIR_TYPES = [
  "Ergonomic High-Back",
  "Executive Leatherette",
  "Mesh Task",
  "Pro Ergonomic",
  "Compact Office",
  "Visitor & Waiting",
  "Auditorium",
  "Solid Wood"
];

function normalizeToAvailableType(str) {
  if (!str) return null;
  const s = str.toLowerCase();
  if (s.includes("high-back") || s.includes("high back")) return "Ergonomic High-Back";
  if (s.includes("executive") || s.includes("leatherette")) return "Executive Leatherette";
  if (s.includes("mesh task") || s.includes("mesh back") || s.includes("mesh-task")) return "Mesh Task";
  if (s.includes("pro ergo") || s.includes("ergo-pro") || s.includes("pro")) return "Pro Ergonomic";
  if (s.includes("compact")) return "Compact Office";
  if (s.includes("waiting") || s.includes("visitor") || s.includes("3-seater")) return "Visitor & Waiting";
  if (s.includes("auditorium")) return "Auditorium";
  if (s.includes("wood")) return "Solid Wood";
  return null;
}

function QuoteFormInner() {
  const searchParams = useSearchParams();
  const [service, setService] = useState("Chair Repair & Spares");
  const [quantity, setQuantity] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [primaryIssue, setPrimaryIssue] = useState("Sinking gas lift / cylinder");
  const [selectedChairTypes, setSelectedChairTypes] = useState([]);
  const [selectedChairsText, setSelectedChairsText] = useState("");
  const [furnitureCategory, setFurnitureCategory] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    const svc = searchParams.get("service");
    const isNewChair = svc && (svc.toLowerCase().includes("new") || svc.toLowerCase().includes("buy"));

    if (isNewChair) {
      setService("Buy New Office Chairs");
      const qty = searchParams.get("qty");
      if (qty) setQuantity(qty);

      const items = searchParams.get("items");
      if (items) {
        setSelectedChairsText(items);
        setMessage(`Selected chair models:\n${items}`);
      }

      const types = searchParams.get("chairTypes");
      const parsedTypes = [];

      if (types) {
        types.split(",").forEach((t) => {
          const norm = normalizeToAvailableType(t.trim()) || t.trim();
          if (norm && !parsedTypes.includes(norm)) parsedTypes.push(norm);
        });
      }

      if (items) {
        AVAILABLE_CHAIR_TYPES.forEach((t) => {
          const key = t.toLowerCase().split(" ")[0];
          if (items.toLowerCase().includes(key) && !parsedTypes.includes(t)) {
            parsedTypes.push(t);
          }
        });
      }

      if (parsedTypes.length > 0) {
        setSelectedChairTypes(parsedTypes);
      }
    } else {
      if (svc) {
        setService(svc);
      } else {
        setService("Chair Repair & Spares");
        clearStoredCart();
      }
      const category = searchParams.get("category");
      setFurnitureCategory(
        svc === FURNITURE_SERVICE && OFFICE_FURNITURE.some((c) => c.label === category) ? category : ""
      );
      setSelectedChairTypes([]);
      setSelectedChairsText("");
      setQuantity("");
      setMessage("");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleCartUpdated = (e) => {
      const summary = getCartSummary(e.detail || {});
      if (summary.totalQty === 0 && !searchParams.get("service")) {
        setService("Chair Repair & Spares");
        setSelectedChairTypes([]);
        setSelectedChairsText("");
        setQuantity("");
        setMessage("");
      }
    };
    window.addEventListener("chair_cart_updated", handleCartUpdated);
    return () => window.removeEventListener("chair_cart_updated", handleCartUpdated);
  }, [searchParams]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => /^image\//.test(f.type));
    if (!files.length) return;
    setIsCompressing(true);
    try {
      const remainingSlots = 4 - photos.length;
      const toProcess = files.slice(0, remainingSlots);
      const compressed = await Promise.all(
        toProcess.map((f) => Store.compressImage(f, 800, 0.65))
      );
      setPhotos((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error("Photo compression error", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service) {
      setErrorMsg("Please select the required service.");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setErrorMsg("Please enter chair count.");
      return;
    }
    if (!phone) {
      setErrorMsg("Please provide your phone number so we can send the quote.");
      return;
    }

    setErrorMsg("");
    const isNewChair = service === "Buy New Office Chairs";
    const isFurniture = service === FURNITURE_SERVICE;
    const furnitureLine = `Furniture category: ${furnitureCategory || "Not specified"}`;

    const enq = {
      source: "Quick Quote Screen",
      service,
      chairTypes: isNewChair ? (selectedChairTypes.length ? selectedChairTypes : ["Office Chairs"]) : [],
      quantity: Number(quantity) || 0,
      preferredDate,
      problems: isNewChair
        ? ["New Chair Purchase"]
        : isFurniture
          ? [furnitureLine]
          : (primaryIssue ? [primaryIssue] : []),
      name: name || "Customer",
      company,
      email: "",
      phone,
      city: city || "Chennai",
      message: isNewChair && selectedChairsText
        ? `Selected models: ${selectedChairsText}\n${message}`
        : isFurniture
          ? `${furnitureLine}\n${message}`
          : message,
      photos
    };

    const id = Store.addEnquiry(enq);
    setRefNo(id || "ENQ");
    setSubmitted(true);
  };

  const isNewChair = service === "Buy New Office Chairs";
  const isFurniture = service === FURNITURE_SERVICE;

  const getWaMessage = () => {
    return (
      (isFurniture
        ? `Hi Ayaan Enterprises, I sent an office furniture enquiry (${refNo}).\n`
        : `Hi Ayaan Enterprises, I requested a chair service quote (${refNo}).\n`) +
      `Service: ${service}\n` +
      (isFurniture
        ? `Furniture category: ${furnitureCategory || "Not specified"}\nQuantity: ${quantity}\n`
        : `Quantity: ${quantity} chairs\n`) +
      (isNewChair && (selectedChairsText || selectedChairTypes.length)
        ? `Selected Chair Types: ${selectedChairsText || selectedChairTypes.join(", ")}\n`
        : (!isNewChair && !isFurniture && primaryIssue ? `Issue: ${primaryIssue}\n` : "")) +
      `Contact: ${name} (${phone})\n` +
      (city ? `Location: ${city}\n` : "") +
      (company ? `Company: ${company}\n` : "") +
      (photos.length ? `Attached ${photos.length} photos.` : "")
    );
  };

  if (submitted) {
    return (
      <div className="quote-screen-card text-center" style={{ padding: "36px 24px" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#dcf6f1",
          color: "#0d9488",
          fontSize: "1.8rem",
          fontWeight: 900,
          display: "grid",
          placeItems: "center",
          margin: "0 auto 16px"
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Quote Request Received!
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#475569", marginBottom: "6px" }}>
          Your reference number is <strong style={{ color: "var(--teal-dark)" }}>{refNo}</strong>.
        </p>
        <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "380px", margin: "0 auto 20px", lineHeight: "1.5" }}>
          Our team will calculate your estimated cost and contact you within 4 hours.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }}>
          <a
            className="btn btn-wa"
            target="_blank"
            rel="noopener noreferrer"
            href={waLink(getWaMessage())}
            style={{ fontWeight: 800, padding: "12px 16px" }}
          >
            Chat on WhatsApp Now &rarr;
          </a>
          <Link className="btn btn-outline" href="/" style={{ padding: "10px 16px", fontSize: "0.88rem" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-screen-card">
      <div className="qsc-header">
        <h2>Quick Quote Form</h2>
        <p>Takes less than 30 seconds • We reply within 4 hours</p>
      </div>

      {errorMsg && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "9px 12px", borderRadius: "8px", marginBottom: "14px", fontSize: "0.84rem", fontWeight: 600 }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="qsc-grid">
        {/* Service */}
        <label>
          <span>Select Service <span className="req">*</span></span>
          <select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              if (e.target.value !== "Buy New Office Chairs") {
                setSelectedChairTypes([]);
                setSelectedChairsText("");
              }
            }}
            required
          >
            <option>Chair Repair &amp; Spares</option>
            <option>Chair Deep Cleaning &amp; Shampooing</option>
            <option>Bulk Office Refurbishment</option>
            <option>Buy New Office Chairs</option>
            <option>{FURNITURE_SERVICE}</option>
          </select>
        </label>

        {/* Chair Count (item count for office furniture) */}
        <label>
          <span>{isFurniture ? "Quantity" : "Number of Chairs"} <span className="req">*</span></span>
          <input
            type="number"
            min="1"
            required
            placeholder={isFurniture ? "e.g. 2" : "e.g. 20"}
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>

        {/* User Selected Chair Type: ONLY shown when user selects service of new chair */}
        {isNewChair && (
          <div className="span-2 selected-chair-types-section">
            <label style={{ display: "block", marginBottom: "8px" }}>
              <span>User Selected Chair Type <span className="req">*</span></span>
            </label>

            <div className="chips">
              {AVAILABLE_CHAIR_TYPES.map((type) => {
                const isChecked = selectedChairTypes.some(
                  (t) => t === type || normalizeToAvailableType(t) === type
                );
                return (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedChairTypes(
                            selectedChairTypes.filter(
                              (t) => t !== type && normalizeToAvailableType(t) !== type
                            )
                          );
                        } else {
                          setSelectedChairTypes([...selectedChairTypes, type]);
                        }
                      }}
                    />
                    <span>{type}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Name */}
        <label>
          <span>Your Name <span className="req">*</span></span>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        {/* Phone / WhatsApp */}
        <label>
          <span>Phone / WhatsApp <span className="req">*</span></span>
          <input
            type="tel"
            required
            placeholder="e.g. 98765 43210"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        {/* Location */}
        <label>
          <span>Location in Chennai</span>
          <input
            type="text"
            placeholder="e.g. Guindy, OMR, Porur"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        {/* Furniture category: ONLY shown for office furniture enquiries */}
        {isFurniture && (
          <label>
            <span>Furniture Category</span>
            <select value={furnitureCategory} onChange={(e) => setFurnitureCategory(e.target.value)}>
              <option value="">Not sure / several categories</option>
              {OFFICE_FURNITURE.map((c) => (
                <option key={c.slug}>{c.label}</option>
              ))}
            </select>
          </label>
        )}

        {/* Primary Issue: ONLY shown for Repair / Cleaning services */}
        {!isNewChair && !isFurniture && (
          <label>
            <span>Primary Issue</span>
            <select value={primaryIssue} onChange={(e) => setPrimaryIssue(e.target.value)}>
              <option>Sinking gas lift / cylinder</option>
              <option>Broken or jamming wheels</option>
              <option>Stained fabric / shampoo needed</option>
              <option>Cracked star base / armrests</option>
              <option>Tilt mechanism loose / stuck</option>
              <option>Multiple issues / general service</option>
            </select>
          </label>
        )}

        {/* Expandable Advanced Options for extra details */}
        <div className="span-2" style={{ marginTop: "2px" }}>
          {!showAdvanced ? (
            <button
              type="button"
              className="qsc-expand-btn"
              onClick={() => setShowAdvanced(true)}
            >
              + Attach chair photos, date, or notes (optional)
            </button>
          ) : (
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", marginTop: "4px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <label>
                  <span>Company Name</span>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>
                <label>
                  <span>Preferred Date</span>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </label>
              </div>

              {/* Photo Uploader */}
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    border: "1.5px dashed #cbd5e1",
                    padding: "12px",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#ffffff"
                  }}
                  onClick={() => document.getElementById("qsc-photo-file").click()}
                >
                  <input
                    id="qsc-photo-file"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <span style={{ fontSize: "0.82rem", color: "var(--teal-dark)", fontWeight: 700 }}>
                    {isCompressing ? "Compressing photos..." : "📷 Click to attach chair photos (max 4)"}
                  </span>
                </div>

                {photos.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {photos.map((src, i) => (
                      <div key={i} style={{ position: "relative", width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Chair" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          style={{
                            position: "absolute",
                            top: "1px",
                            right: "1px",
                            background: "rgba(0,0,0,0.7)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            fontSize: "10px",
                            cursor: "pointer",
                            display: "grid",
                            placeItems: "center"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label>
                <span>Additional Message</span>
                <input
                  type="text"
                  placeholder="Any special notes or requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="span-2" style={{ marginTop: "6px" }}>
          <button className="btn btn-amber qsc-submit-btn" type="submit">
            Get Free Price Estimate &rarr;
          </button>
          <p className="qsc-footer-note">
            🔒 100% Free &amp; No Obligation • On-site service across Chennai
          </p>
        </div>
      </form>
    </div>
  );
}

export default function QuotePage() {
  return (
    <main>
      <section className="quote-screen-section">
        <div className="container quote-screen-grid">
          {/* Left Side: Direct Info & 1-Tap WhatsApp for Lazy Users */}
          <div className="quote-screen-info">
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Request Quote
            </div>
            <span className="eyebrow">Instant Price Estimate</span>
            <h1>Get Your Office Chair Servicing Quote</h1>
            <p className="lead">
              On-site chair repair, deep machine shampooing, and certified spare parts across all Chennai business districts.
            </p>

            {/* Fast-Track Card For Lazy Users */}
            <div className="quote-fast-card">
              <span className="qfc-badge">⚡ Fastest Option (1-Tap)</span>
              <h3>Too busy to fill out a form?</h3>
              <p>
                Skip typing! Just click below to share chair photos directly on WhatsApp for an immediate price estimate.
              </p>
              <a
                className="btn btn-wa"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi Ayaan Enterprises, I want an instant quote for my office chairs. Sharing photos.")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"
                  />
                </svg>
                Share Photos on WhatsApp &rarr;
              </a>
            </div>

            {/* Trust Bullet List */}
            <ul className="quote-trust-list">
              <li>⚡ <strong>4-Hr</strong> Response Time</li>
              <li>🏢 <strong>On-Site</strong> Inspection &amp; Fix</li>
              <li>🛡️ <strong>90-Day</strong> Parts Warranty</li>
              <li>📞 Direct Call: <a href={`tel:${SITE.phoneLink}`} style={{ color: "var(--teal-light)", fontWeight: 700 }}>{SITE.phone}</a></li>
            </ul>
          </div>

          {/* Right Side: High-Converting Compact Form */}
          <Suspense fallback={<div className="quote-screen-card">Loading quote form...</div>}>
            <QuoteFormInner />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
