/* ==========================================================
   Data layer shared by the website (quote / callback forms)
   and the admin panel. Uses browser localStorage so the demo
   works with no server. For production, replace load()/save()
   with calls to your backend (Firebase, Supabase, PHP, etc).
   ========================================================== */
(function () {
  var KEY = "chairservice_data_v1";

  function blank() {
    return {
      enquiries: [], inspections: [], quotes: [], jobs: [], invoices: [],
      technicians: ["Ramesh", "Suresh", "Imran", "Vikas"],
      settings: {
        businessName: (window.SITE && SITE.name) || "Chair Service",
        address: (window.SITE && SITE.address) || "",
        phone: (window.SITE && SITE.phone) || "",
        gstin: "",
        bank: "Bank: \nA/c No: \nIFSC: ",
        gstPct: 18,
        quoteTerms: "1. Prices are per chair unless stated.\n2. 50% advance on approval, balance on completion.\n3. Work carried out in batches so your office keeps running.\n4. 90-day warranty on replaced parts.\n5. Quotation valid for 15 days.",
        pin: "1234"
      },
      counters: {}
    };
  }

  var Store = {
    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        if (!raw) return blank();
        var d = JSON.parse(raw), b = blank();
        Object.keys(b).forEach(function (k) { if (d[k] === undefined) d[k] = b[k]; });
        Object.keys(b.settings).forEach(function (k) { if (d.settings[k] === undefined) d.settings[k] = b.settings[k]; });
        // company renamed: update records saved under the old placeholder name
        if (d.settings.businessName === "ChairCare Pro") d.settings.businessName = b.settings.businessName;
        if (d.settings.phone === "+91 98765 43210") d.settings.phone = b.settings.phone;
        delete d.settings.email;
        return d;
      } catch (e) { return blank(); }
    },
    save: function (d) {
      try { localStorage.setItem(KEY, JSON.stringify(d)); return true; }
      catch (e) {
        alert("Storage is full. Please remove some photos or export a backup and clear old records.");
        return false;
      }
    },
    nextId: function (d, prefix) {
      d.counters[prefix] = (d.counters[prefix] || 0) + 1;
      return prefix + "-" + String(d.counters[prefix]).padStart(4, "0");
    },
    addEnquiry: function (e) {
      var d = Store.load();
      e.id = Store.nextId(d, "ENQ");
      e.createdAt = new Date().toISOString();
      e.status = e.status || "New";
      e.notes = e.notes || [];
      e.followUp = e.followUp || new Date().toISOString().slice(0, 10);
      d.enquiries.unshift(e);
      return Store.save(d) ? e.id : null;
    },
    reset: function () { localStorage.removeItem(KEY); },
    KEY: KEY
  };

  /* Shrink an image File to a compact JPEG data URL so many photos fit in storage */
  Store.compressImage = function (file, maxSize, quality) {
    maxSize = maxSize || 1000; quality = quality || 0.7;
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var s = Math.min(1, maxSize / Math.max(img.width, img.height));
          var c = document.createElement("canvas");
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  window.Store = Store;
})();
