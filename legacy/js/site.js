/* ==========================================================
   Shared website behaviour: header, footer, floating contact
   buttons, callback popup, image slots, before/after sliders,
   scroll reveal.
   ========================================================== */
(function () {
  var S = window.SITE;
  var page = document.body.getAttribute("data-page") || "";

  var NAV = [
    ["home", "index.html", "Home"],
    ["shop", "shop.html", "Buy Chairs"],
    ["repair", "chair-repair.html", "Chair Repair"],
    ["cleaning", "chair-cleaning.html", "Chair Cleaning"],
    ["bulk", "bulk-service.html", "Bulk / Corporate"],
    ["products", "products.html", "Products"],
    ["seating", "seating.html", "Seating"],
    ["work", "our-work.html", "Our Work"]
  ];

  var ICON = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"/></svg>',
    call: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1Z"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 15.5c-1.2 0-2.5-.2-3.6-.6a1 1 0 0 0-1 .2l-2.2 2.2a15 15 0 0 1-6.6-6.6l2.2-2.2a1 1 0 0 0 .3-1A11.4 11.4 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1ZM19 12h2a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7Zm-4 0h2a5 5 0 0 0-5-5v2a3 3 0 0 1 3 3Z"/></svg>'
  };

  function waLink(msg) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg || "Hi, I need a quote for chair repair / cleaning.");
  }
  window.waLink = waLink;

  /* ---------- Header ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="topbar"><div class="container topbar-in">' +
        '<span>' + S.hours + ' &middot; Serving ' + S.serviceAreas.slice(0, 3).join(", ") + '</span>' +
        '<span class="topbar-links"><a class="topbar-wa" target="_blank" rel="noopener" href="' + waLink() + '">' + ICON.wa + 'WhatsApp ' + S.phone + '</a><a href="tel:' + S.phoneLink + '">' + ICON.call + 'Call now</a></span>' +
      '</div></div>' +
      '<div class="container nav-in">' +
        '<a class="brand" href="index.html" aria-label="' + S.name + ' home">' +
          '<img class="brand-logo" src="' + S.logo + '" alt="' + S.name + '" width="841" height="294">' +
        '</a>' +
        '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<nav class="main-nav" aria-label="Main">' +
          NAV.map(function (n) {
            return '<a href="' + n[1] + '"' + (n[0] === page ? ' class="active" aria-current="page"' : "") + ">" + n[2] + "</a>";
          }).join("") +
          '<a class="btn btn-amber btn-sm nav-cta" href="quote.html">Get Free Quote</a>' +
        "</nav>" +
      "</div>";

    var toggle = header.querySelector(".nav-toggle");
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
    });
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- Footer ---------- */
  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="footer-cta"><div class="container footer-cta-in">' +
        '<div><h2>Have 10, 100 or 1,000 chairs to fix?</h2><p>Send photos and the chair count. We reply with a price range the same day.</p></div>' +
        '<div class="btn-row"><a class="btn btn-amber" href="quote.html">Get Free Quote</a><a class="btn btn-wa" target="_blank" rel="noopener" href="' + waLink() + '">' + ICON.wa + 'WhatsApp Photos</a></div>' +
      "</div></div>" +
      '<div class="container footer-grid">' +
        '<div><img class="footer-logo" src="' + S.logo + '" alt="' + S.name + '" width="841" height="294"><p>' + S.tagline + '. We repair, deep clean and refurbish office chairs on-site, in controlled batches, with before/after photo proof.</p></div>' +
        '<div><h3>Services</h3><a href="shop.html">Buy Chairs</a><a href="chair-repair.html">Chair Repair</a><a href="chair-cleaning.html">Old Chair Cleaning</a><a href="bulk-service.html">Bulk / Corporate Service</a><a href="products.html">New Chairs &amp; Spare Parts</a></div>' +
        '<div><h3>Company</h3><a href="our-work.html">Our Work &amp; Clients</a><a href="quote.html">Request a Quote</a><a href="#" data-callback>Request a Callback</a><a href="admin.html">Staff Login</a></div>' +
        '<div><h3>Contact</h3><a href="tel:' + S.phoneLink + '">Call: ' + S.phone + '</a><a target="_blank" rel="noopener" href="' + waLink() + '">WhatsApp: ' + S.phone + '</a><p>' + S.address + '</p><p>' + S.hours + '</p></div>' +
      "</div>" +
      '<div class="container footer-bottom"><span>&copy; ' + new Date().getFullYear() + " " + S.name + '. All rights reserved.</span><span>Service areas: ' + S.serviceAreas.join(", ") + "</span></div>";
  }

  /* ---------- Floating contact buttons ---------- */
  var fab = document.createElement("div");
  fab.className = "fab";
  fab.innerHTML =
    '<a class="fab-btn fab-wa" target="_blank" rel="noopener" href="' + waLink() + '" aria-label="Chat on WhatsApp">' + ICON.wa + '<span>WhatsApp</span></a>' +
    '<a class="fab-btn fab-call" href="tel:' + S.phoneLink + '" aria-label="Call us">' + ICON.call + '<span>Call Now</span></a>' +
    '<button class="fab-btn fab-back" data-callback aria-label="Request a callback">' + ICON.back + '<span>Callback</span></button>';
  document.body.appendChild(fab);

  /* ---------- Callback popup ---------- */
  var modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("hidden", "");
  modal.innerHTML =
    '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="cb-title">' +
      '<button class="modal-close" aria-label="Close">&times;</button>' +
      '<h2 id="cb-title">Request a callback</h2>' +
      '<p class="muted">Leave your number. Our service team calls back within 30 minutes during working hours.</p>' +
      '<form class="cb-form form-grid">' +
        '<label>Your name<input name="name" required autocomplete="name"></label>' +
        '<label>Phone number<input name="phone" type="tel" required autocomplete="tel" pattern="[0-9+ ]{8,15}"></label>' +
        '<label>Company (optional)<input name="company" autocomplete="organization"></label>' +
        '<label>Approx. number of chairs<input name="quantity" type="number" min="1" placeholder="e.g. 40"></label>' +
        '<label class="span-2">Best time to call<select name="message"><option>As soon as possible</option><option>Morning (9 - 12)</option><option>Afternoon (12 - 4)</option><option>Evening (4 - 7)</option></select></label>' +
        '<button class="btn btn-teal span-2" type="submit">Call me back</button>' +
      "</form>" +
      '<div class="cb-done" hidden><div class="done-icon">&#10003;</div><h3>Thank you!</h3><p>We will call you shortly. Reference: <strong class="cb-ref"></strong></p></div>' +
    "</div>";
  document.body.appendChild(modal);

  function openModal() { modal.removeAttribute("hidden"); modal.querySelector("input").focus(); }
  function closeModal() { modal.setAttribute("hidden", ""); }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-callback]")) { e.preventDefault(); openModal(); }
  });
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".modal-close")) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  modal.querySelector(".cb-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    var ref = Store.addEnquiry({
      source: "Callback", service: "Callback request", name: f.get("name"), phone: f.get("phone"),
      company: f.get("company"), quantity: Number(f.get("quantity")) || 0, message: "Call time: " + f.get("message"),
      chairTypes: [], problems: [], photos: []
    });
    e.target.hidden = true;
    modal.querySelector(".cb-done").hidden = false;
    modal.querySelector(".cb-ref").textContent = ref;
  });

  /* ---------- Image slots ----------
     <figure class="img-slot ratio-4x3"><img src="images/xyz.jpg" alt="..."></figure>
     If the file is missing, a labelled placeholder shows the exact file name
     to create, so generated images drop straight into the right place. */
  function markMissing(img) {
    var slot = img.closest(".img-slot");
    if (!slot || slot.classList.contains("is-missing")) return;
    slot.classList.add("is-missing");
    var name = (img.getAttribute("src") || "").split("/").pop();
    var ph = document.createElement("div");
    ph.className = "img-placeholder";
    ph.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 5v14H5V5h14m0-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-4.9 8.9-3 3.8L9 13.1 6 17h12l-3.9-5.1Z"/></svg>' +
      "<span>" + (img.getAttribute("alt") || "Image") + "</span><code>images/" + name + "</code>";
    slot.appendChild(ph);
  }
  document.querySelectorAll(".img-slot img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    img.addEventListener("error", function () { markMissing(img); });
  });

  /* ---------- Before / after slider ---------- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var range = ba.querySelector("input[type=range]");
    function set(v) { ba.style.setProperty("--pos", v + "%"); }
    range.addEventListener("input", function () { set(range.value); });
    set(range.value);
  });

  /* ---------- Fill contact placeholders ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + S.phoneLink; if (!a.textContent.trim()) a.textContent = S.phone; });
  document.querySelectorAll("[data-stat]").forEach(function (el) { el.textContent = S.stats[el.getAttribute("data-stat")]; });

  /* ---------- Scroll reveal ---------- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }
})();
