"use client";

import { useState } from "react";
import Link from "next/link";

const TIERS = [
  { id: "task", name: "Ergonomic Task Chairs", newRate: 11500, refurbRate: 3400, weightKg: 14, co2Kg: 42 },
  { id: "exec", name: "Executive High-Backs", newRate: 18500, refurbRate: 4900, weightKg: 18, co2Kg: 58 },
  { id: "work", name: "Standard Workstation Chairs", newRate: 7500, refurbRate: 2200, weightKg: 11, co2Kg: 32 }
];

export default function CorporateCalculator() {
  const [chairCount, setChairCount] = useState(120);
  const [selectedTier, setSelectedTier] = useState("task");

  const tier = TIERS.find((t) => t.id === selectedTier) || TIERS[0];
  const totalNew = chairCount * tier.newRate;
  const totalRefurb = chairCount * tier.refurbRate;
  const netSavings = totalNew - totalRefurb;
  const savingsPercent = Math.round((netSavings / totalNew) * 100);
  const landfillTons = ((chairCount * tier.weightKg) / 1000).toFixed(1);
  const co2Tons = ((chairCount * tier.co2Kg) / 1000).toFixed(1);

  return (
    <div className="roi-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="sla-badge mb-2">B2B Financial &amp; ESG Assessment</span>
          <h3 className="text-xl md:text-2xl font-black text-navy mb-1" style={{ fontSize: "1.6rem" }}>
            Corporate Capital Expenditure &amp; ESG Estimator
          </h3>
          <p className="text-sm text-slate-500 mb-0">
            Compare new procurement expenditure against our enterprise batch refurbishment SLAs.
          </p>
        </div>

        <div className="flex gap-2">
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTier(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                selectedTier === t.id
                  ? "bg-navy text-white border-navy"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="roi-slider-group">
        <label>
          <span>Quantity of Office Chairs in Scope</span>
          <span className="text-teal font-black text-xl">{chairCount} chairs</span>
        </label>
        <input
          type="range"
          min="20"
          max="1000"
          step="10"
          value={chairCount}
          onChange={(e) => setChairCount(Number(e.target.value))}
          className="roi-slider"
          aria-label="Quantity of Office Chairs"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>20 Chairs (Single Wing)</span>
          <span>250 Chairs (Floor)</span>
          <span>500 Chairs (Building)</span>
          <span>1,000+ Chairs (Campus)</span>
        </div>
      </div>

      <div className="roi-results-grid">
        <div className="roi-stat-box">
          <div className="label">Estimated New Capex Budget</div>
          <div className="val text-slate-400" style={{ textDecoration: "line-through", opacity: 0.65 }}>
            ₹{totalNew.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-500 mt-2 mb-0">At ₹{tier.newRate.toLocaleString("en-IN")} / new unit</p>
        </div>

        <div className="roi-stat-box">
          <div className="label">Enterprise Refurbishment Cost</div>
          <div className="val text-teal-700">₹{totalRefurb.toLocaleString("en-IN")}</div>
          <p className="text-xs text-slate-500 mt-2 mb-0">Includes parts, on-site labor &amp; 90-day warranty</p>
        </div>

        <div className="roi-stat-box highlight">
          <div className="label">Net Corporate Capex Saved</div>
          <div className="val">₹{netSavings.toLocaleString("en-IN")}</div>
          <div className="text-xs text-amber-300 font-bold mt-1">
            ⚡ {savingsPercent}% Net Financial Savings
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span>
              <strong>{landfillTons} Metric Tons</strong> Landfill Diverted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📉</span>
            <span>
              <strong>{co2Tons} Tons CO₂</strong> Footprint Offset
            </span>
          </div>
        </div>

        <Link
          className="btn btn-amber btn-sm"
          href={`/quote?service=Bulk%20Refurbishment&qty=${chairCount}`}
        >
          Request Zero-Cost Sample Chair Trial &rarr;
        </Link>
      </div>
    </div>
  );
}
