import { SITE } from "./config";

const KEY = "chairservice_data_v1";

export function blankData() {
  return {
    enquiries: [],
    inspections: [],
    quotes: [],
    jobs: [],
    invoices: [],
    technicians: ["Ramesh", "Suresh", "Imran", "Vikas"],
    settings: {
      businessName: SITE.name || "Chair Service",
      address: SITE.address || "",
      phone: SITE.phone || "",
      gstin: "",
      bank: "Bank: \nA/c No: \nIFSC: ",
      gstPct: 18,
      quoteTerms: "1. Prices are per chair unless stated.\n2. 50% advance on approval, balance on completion.\n3. Work carried out in batches so your office keeps running.\n4. 90-day warranty on replaced parts.\n5. Quotation valid for 15 days."
    },
    counters: {}
  };
}

export const Store = {
  load: function () {
    if (typeof window === "undefined") return blankData();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blankData();
      const d = JSON.parse(raw);
      const b = blankData();
      Object.keys(b).forEach((k) => {
        if (d[k] === undefined) d[k] = b[k];
      });
      Object.keys(b.settings).forEach((k) => {
        if (!d.settings || d.settings[k] === undefined) {
          if (!d.settings) d.settings = {};
          d.settings[k] = b.settings[k];
        }
      });
      if (d.settings.businessName === "ChairCare Pro") d.settings.businessName = b.settings.businessName;
      if (d.settings.phone === "+91 98765 43210") d.settings.phone = b.settings.phone;
      delete d.settings.pin; // older versions cached the admin PIN here
      delete d.settings.email;
      return d;
    } catch {
      return blankData();
    }
  },

  save: function (d) {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(KEY, JSON.stringify(d));
      return true;
    } catch {
      alert("Storage is full. Please remove some photos or export a backup and clear old records.");
      return false;
    }
  },

  nextId: function (d, prefix) {
    d.counters = d.counters || {};
    d.counters[prefix] = (d.counters[prefix] || 0) + 1;
    return prefix + "-" + String(d.counters[prefix]).padStart(4, "0");
  },

  addEnquiry: function (e) {
    const d = Store.load();
    e.id = Store.nextId(d, "ENQ");
    e.createdAt = new Date().toISOString();
    e.status = e.status || "New";
    e.notes = e.notes || [];
    e.followUp = e.followUp || new Date().toISOString().slice(0, 10);
    d.enquiries = d.enquiries || [];
    d.enquiries.unshift(e);
    Store.save(d);

    // Asynchronously persist to SQL database API
    if (typeof window !== "undefined") {
      fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e)
      }).catch((err) => console.warn("Background SQL save error:", err));
    }

    return e.id;
  },

  reset: function () {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  },

  compressImage: function (file, maxSize = 1000, quality = 0.7) {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return resolve("");
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const s = Math.min(1, maxSize / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * s);
          c.height = Math.round(img.height * s);
          const ctx = c.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL("image/jpeg", quality));
          } else {
            resolve(reader.result);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  },

  KEY
};
