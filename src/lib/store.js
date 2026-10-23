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

export function getSampleEnterpriseData() {
  return {
    enquiries: [
      {
        id: "ENQ-1001",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        name: "Senthil Kumar (Facilities)",
        company: "Cognizant Technology Solutions",
        phone: "+91 98401 22345",
        city: "OMR, Navalur, Chennai",
        service: "Chair Repair & Spares",
        quantity: 85,
        problems: ["Sinking gas lift / cylinder", "Broken wheel casters"],
        status: "Quoted",
        source: "Website Quote Form",
        notes: ["Floor 3 & 4 inspection done. 85 mesh chairs require heavy-duty class 4 gas lift."]
      },
      {
        id: "ENQ-1002",
        createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
        name: "Priya Rajan (Admin Lead)",
        company: "TCS Siruseri IT Park",
        phone: "+91 94440 98765",
        city: "Siruseri SIPCOT, Chennai",
        service: "Chair Deep Cleaning",
        quantity: 120,
        problems: ["Fabric shampoo extraction", "Stain removal on executive chairs"],
        status: "Inspection",
        source: "Callback Request",
        notes: ["Weekend on-site servicing requested to avoid disrupting office shifts."]
      },
      {
        id: "ENQ-1003",
        createdAt: new Date(Date.now() - 3600000 * 32).toISOString(),
        name: "Arunachalam V",
        company: "Zoho Corporation",
        phone: "+91 97910 11223",
        city: "Estancia IT Park, Guduvanchery",
        service: "Chair Repair & Spares",
        quantity: 50,
        problems: ["Tilt mechanism locked", "Loose 3D armrests"],
        status: "Won",
        source: "WhatsApp Chat",
        notes: ["PO approved. Work order created and assigned to Technician Imran."]
      },
      {
        id: "ENQ-1004",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        name: "Divya Ramesh (HR & Workplace)",
        company: "Freshworks Chennai",
        phone: "+91 98845 66778",
        city: "Global Infocity, Perungudi",
        service: "Buy New Office Chairs",
        chairTypes: ["Ergonomic High-Back", "Mesh Task"],
        quantity: 35,
        problems: ["New floor expansion seating"],
        status: "New",
        source: "New Chair Buy Quotes",
        notes: ["Requested bulk corporate catalogue and sample piece demonstration."]
      },
      {
        id: "ENQ-1005",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        name: "Karthik Subramanian",
        company: "DLF Cybercity",
        phone: "+91 98412 33445",
        city: "Porur, Chennai",
        service: "Bulk Annual Maintenance (AMC)",
        quantity: 160,
        problems: ["Quarterly chair maintenance & castor replacements"],
        status: "Contacted",
        source: "Direct Call",
        notes: ["Follow up on Monday with formal AMC proposal."]
      }
    ],
    quotes: [
      {
        id: "QT-1001",
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        customerName: "Senthil Kumar",
        company: "Cognizant Technology Solutions",
        phone: "+91 98401 22345",
        status: "Sent",
        items: [
          { desc: "Heavy-duty Class 4 Gas Lift (90-day warranty)", qty: 85, rate: 750 },
          { desc: "Nylon Twin-Wheel Castor Set (5 pcs/chair)", qty: 40, rate: 450 },
          { desc: "On-site Batch Servicing & Lubrication", qty: 85, rate: 100 }
        ]
      },
      {
        id: "QT-1002",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        customerName: "Arunachalam V",
        company: "Zoho Corporation",
        phone: "+91 97910 11223",
        status: "Approved",
        items: [
          { desc: "Synchro Tilt Locking Mechanism Replacement", qty: 50, rate: 950 },
          { desc: "3D Adjustable Armrest Pair", qty: 30, rate: 650 },
          { desc: "Technician On-site Installation & Alignment", qty: 50, rate: 100 }
        ]
      }
    ],
    jobs: [
      {
        id: "JOB-1001",
        customerName: "Zoho Corporation (Estancia)",
        phone: "+91 97910 11223",
        technician: "Imran",
        chairs: 50,
        progress: "60%",
        scheduledDate: "Tomorrow, 9:30 AM",
        status: "In progress",
        notes: "Batch 1 (30 chairs) done. Batch 2 (20 chairs) scheduled for tomorrow morning."
      },
      {
        id: "JOB-1002",
        customerName: "TCS Siruseri IT Park",
        phone: "+91 94440 98765",
        technician: "Ramesh & Suresh",
        chairs: 120,
        progress: "15%",
        scheduledDate: "Saturday, 10:00 AM",
        status: "Scheduled",
        notes: "Deep extraction machines & organic shampoo kits prepared."
      }
    ],
    technicians: ["Ramesh", "Suresh", "Imran", "Vikas"],
    settings: {
      businessName: SITE.name || "Ayaan Enterprises",
      address: SITE.address || "2nd Floor, ANANDHAM ELITE, 1, MRTS Road, 1st Street, Velachery, Chennai, Tamil Nadu 600042, India.",
      phone: SITE.phone || "+91 97907 33887",
      gstin: "33AABCA1234F1Z9",
      bank: "Bank: HDFC Bank\nA/c No: 50200081223388\nIFSC: HDFC0001234\nBranch: Guindy Industrial Estate, Chennai",
      gstPct: 18,
      quoteTerms: "1. Rates are inclusive of genuine spare parts and expert on-site labor.\n2. Work executed in staggered batches without interrupting office operations.\n3. 90-day comprehensive on-site warranty on all replaced hydraulic cylinders & mechanisms.\n4. Payment terms: 50% mobilization advance on PO, 50% upon satisfactory batch completion.\n5. Quotation validity: 15 days from issuance."
    },
    counters: { ENQ: 1005, QT: 1002, JOB: 1002 }
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
      delete d.settings.pin; // older versions cached the admin PIN here; credentials now stay on the server
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

  // Asynchronous SQL synchronization helpers
  syncWithSql: async function () {
    if (typeof window === "undefined") return Store.load();
    try {
      const [enqRes, qtRes, jobRes, setRes] = await Promise.all([
        fetch("/api/enquiries").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/quotes").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/jobs").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/settings").then((r) => (r.ok ? r.json() : null))
      ]);

      const current = Store.load();
      if (enqRes?.success && enqRes.enquiries) current.enquiries = enqRes.enquiries;
      if (qtRes?.success && qtRes.quotes) current.quotes = qtRes.quotes;
      if (jobRes?.success && jobRes.jobs) current.jobs = jobRes.jobs;
      if (setRes?.success && setRes.settings) current.settings = { ...current.settings, ...setRes.settings };

      Store.save(current);
      return current;
    } catch (e) {
      console.warn("SQL Sync error, using local data:", e);
      return Store.load();
    }
  },

  seedSql: async function () {
    try {
      await fetch("/api/seed", { method: "POST" });
      return await Store.syncWithSql();
    } catch (e) {
      return Store.seedSampleData();
    }
  },

  seedSampleData: function () {
    const sample = getSampleEnterpriseData();
    Store.save(sample);
    return sample;
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
