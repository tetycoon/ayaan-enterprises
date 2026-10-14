/* Quote request form: photo upload with preview, validation, saves enquiry */
(function () {
  var form = document.getElementById("quote-form");
  if (!form) return;
  var MAX = 6, photos = [];
  var input = document.getElementById("photo-input");
  var zone = document.getElementById("dropzone");
  var thumbs = document.getElementById("thumbs");
  var errEl = document.getElementById("form-error");

  // Pre-select service from ?service=... links on other pages
  var svc = new URLSearchParams(location.search).get("service");
  if (svc) {
    var sel = form.elements.service, base = svc.split(" - ")[0];
    var match = Array.prototype.find.call(sel.options, function (o) { return o.value === svc || o.value === base; });
    if (match) sel.value = match.value;
    if (svc.indexOf(" - ") > -1) form.elements.message.value = "Interested in: " + svc;
  }
  // Chairs chosen on the shop page arrive as ?qty=..&items=..
  var params = new URLSearchParams(location.search);
  if (params.get("qty")) form.elements.quantity.value = params.get("qty");
  if (params.get("items")) form.elements.message.value = "Chairs I want to buy:\n" + params.get("items");

  function render() {
    thumbs.innerHTML = "";
    photos.forEach(function (src, i) {
      var d = document.createElement("div");
      d.className = "thumb";
      d.innerHTML = '<img alt="Chair photo ' + (i + 1) + '"><button type="button" aria-label="Remove photo ' + (i + 1) + '">&times;</button>';
      d.querySelector("img").src = src;
      d.querySelector("button").onclick = function () { photos.splice(i, 1); render(); };
      thumbs.appendChild(d);
    });
  }
  function addFiles(files) {
    var list = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type); });
    list = list.slice(0, MAX - photos.length);
    Promise.all(list.map(function (f) { return Store.compressImage(f, 900, 0.65); })).then(function (urls) {
      photos = photos.concat(urls); render();
    });
  }
  zone.addEventListener("click", function () { input.click(); });
  zone.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
  input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("drag"); }); });
  zone.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      var bad = form.querySelector(":invalid");
      errEl.textContent = "Please fill in: " + (bad.closest("label") ? bad.closest("label").childNodes[0].textContent.replace("*", "").trim() : "required fields");
      errEl.hidden = false;
      bad.focus();
      return;
    }
    errEl.hidden = true;
    var f = new FormData(form);
    var enq = {
      source: "Website",
      service: f.get("service"),
      chairTypes: f.getAll("chairTypes"),
      quantity: Number(f.get("quantity")) || 0,
      preferredDate: f.get("preferredDate"),
      problems: f.getAll("problems"),
      name: f.get("name"), company: f.get("company"), phone: f.get("phone"),
      city: f.get("city"), contactPref: f.get("contactPref"), heard: f.get("heard"),
      message: f.get("message"),
      photos: photos
    };
    var ref = Store.addEnquiry(enq);
    if (!ref) return;

    var msg = "Hi, I just requested a quote (" + ref + ").\n" +
      "Service: " + enq.service + "\nChairs: " + enq.quantity +
      (enq.chairTypes.length ? "\nType: " + enq.chairTypes.join(", ") : "") +
      (enq.problems.length ? "\nIssues: " + enq.problems.join(", ") : "") +
      "\nName: " + enq.name + (enq.company ? " (" + enq.company + ")" : "") +
      (enq.city ? "\nLocation: " + enq.city : "") +
      (photos.length ? "\nI will share " + photos.length + " photo(s) here." : "");
    document.getElementById("ref-no").textContent = ref;
    document.getElementById("wa-followup").href = window.waLink(msg);
    form.hidden = true;
    document.getElementById("form-success").hidden = false;
    form.closest(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
