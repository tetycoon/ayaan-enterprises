"use client";

import { useState } from "react";
import { SITE, waLink } from "@/lib/config";
import { Store } from "@/lib/store";

export default function CallbackModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Chair Repair",
    quantity: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const enq = {
      source: "Callback",
      service: formData.service || "Callback request",
      quantity: Number(formData.quantity) || 0,
      name: formData.name || "Callback lead",
      phone: formData.phone,
      message: `Callback requested for ${formData.service}${formData.quantity ? ` (${formData.quantity} chairs)` : ""}`
    };
    const id = Store.addEnquiry(enq);
    setRefNo(id || "ENQ");
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ name: "", phone: "", service: "Chair Repair", quantity: "" });
    onClose();
  };

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="cb-title">
        <button className="modal-close" aria-label="Close" onClick={handleClose}>
          &times;
        </button>

        {!submitted ? (
          <>
            <h2 id="cb-title">Request a callback</h2>
            <p className="muted">
              Leave your number. Our service team calls back within 30 minutes during working hours.
            </p>
            <form className="cb-form form-grid" onSubmit={handleSubmit}>
              <label>
                Your phone number *
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 98765 43210"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>
              <label>
                Your name / company
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rajesh / Infosys"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
              <label>
                Service needed
                <select
                  name="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option>Chair Repair</option>
                  <option>Chair Cleaning</option>
                  <option>Repair + Cleaning</option>
                  <option>Bulk Refurbishment</option>
                  <option>New Chairs</option>
                  <option>Spare Parts</option>
                </select>
              </label>
              <label>
                Approx chairs
                <input
                  type="number"
                  name="quantity"
                  placeholder="e.g. 25"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </label>
              <button className="btn btn-amber span-2" type="submit">
                Call Me Back
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <h2 className="text-emerald-600 mb-2 font-bold">Callback requested!</h2>
            <p>
              We have noted your number and reference <strong>{refNo}</strong>. Our team will call you shortly.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                className="btn btn-wa w-full"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink(`Hi, I just requested a callback (${refNo}) regarding ${formData.service}.`)}
              >
                Chat on WhatsApp instead
              </a>
              <button type="button" className="btn btn-outline" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
