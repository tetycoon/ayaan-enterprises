/* ==========================================================
   Chair shop: catalogue, filters and enquiry list.
   EDIT THE CATALOGUE BELOW to add chairs or set prices.
   price: null  -> shows "Ask for price"
   price: 5499  -> shows ₹5,499 per chair
   white: true  -> photo has a white background (shown whole)
   ========================================================== */
var CATALOGUE = [
  { id: "ergo-hb", name: "Ergonomic High-Back Chair", cat: "Ergonomic", img: "images/hero-ergonomic.jpg", price: null,
    features: ["Adjustable headrest", "3D armrests", "Synchro tilt with lock"] },
  { id: "exec-lth", name: "Executive Leatherette Chair", cat: "Executive", img: "images/hero-executive.jpg", white: true, price: null,
    features: ["High back with headrest", "Chrome arms & base", "Padded leatherette"] },
  { id: "mesh-task", name: "Mesh Back Task Chair", cat: "Mesh", img: "images/hero-mesh.jpg", price: null,
    features: ["Breathable mesh back", "Cushioned fabric seat", "Height adjustable"] },
  { id: "ergo-pro", name: "Pro Ergonomic Mesh Chair", cat: "Ergonomic", img: "images/hero-desk.jpg", price: null,
    features: ["Adjustable lumbar support", "Headrest & 3D arms", "Ideal for long hours"] },
  { id: "task-compact", name: "Compact Office Chair", cat: "Mesh", img: "images/product-office-chair.jpg", price: null,
    features: ["Space-saving design", "Fixed arms", "Smooth castors"] },
  { id: "wait-3", name: "3-Seater Waiting Chair", cat: "Visitor & waiting", img: "images/chairs-waiting.jpg", price: null,
    features: ["Steel beam frame", "Cushioned seat & back", "2, 3 or 4 seater"] },
  { id: "audi", name: "Auditorium Seating", cat: "Auditorium", img: "images/chairs-auditorium.jpg", price: null,
    features: ["Plush fabric seats", "Armrests with cup holder", "Fixed row installation"] },
  { id: "wood", name: "Solid Wood Chair", cat: "Wooden", img: "images/chair-wooden.jpg", white: true, price: null,
    features: ["Solid hardwood", "Cafeteria & reception", "Durable polish finish"] }
];

(function () {
  var grid = document.getElementById("shop-grid");
  if (!grid) return;
  var KEY = "chair_enquiry_list";
  var cur = (window.SITE && SITE.currency) || "₹";
  var filter = "All";
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { cart = {}; }
  function saveCart() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function find(id) { return CATALOGUE.find(function (p) { return p.id === id; }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function priceText(p) { return p.price ? cur + Number(p.price).toLocaleString("en-IN") + "<small> / chair</small>" : "Ask for price"; }

  /* ---------- filters ---------- */
  var cats = ["All"].concat(CATALOGUE.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
  var fbox = document.getElementById("shop-filters");
  fbox.innerHTML = cats.map(function (c) { return '<button type="button" data-cat="' + esc(c) + '"' + (c === filter ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(c) + "</button>"; }).join("");
  fbox.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]"); if (!b) return;
    filter = b.getAttribute("data-cat");
    fbox.querySelectorAll("button").forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
    render();
  });

  /* ---------- product cards ---------- */
  function render() {
    grid.innerHTML = CATALOGUE.filter(function (p) { return filter === "All" || p.cat === filter; }).map(function (p) {
      var inCart = cart[p.id] || 0;
      return '<article class="shop-card">' +
        '<div class="shop-media' + (p.white ? " white" : "") + '"><div class="shop-media-bg" style="background-image:url(\'' + p.img + '\')"></div><img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="shop-body">' +
          '<span class="tag">' + esc(p.cat) + "</span>" +
          "<h3>" + esc(p.name) + "</h3>" +
          '<ul class="shop-feat">' + p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
          '<div class="shop-price">' + priceText(p) + "</div>" +
          '<div class="shop-actions">' +
            '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '"><button type="button" data-q="-1" data-id="' + p.id + '" aria-label="Decrease">−</button><input type="number" min="1" value="' + (inCart || 1) + '" data-qty="' + p.id + '" aria-label="Quantity"><button type="button" data-q="1" data-id="' + p.id + '" aria-label="Increase">+</button></div>' +
            '<button type="button" class="btn ' + (inCart ? "btn-teal" : "btn-amber") + ' btn-sm" data-add="' + p.id + '">' + (inCart ? "✓ Update" : "Add to enquiry") + "</button>" +
          "</div>" +
        "</div></article>";
    }).join("");
  }

  grid.addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]");
    if (q) {
      var inp = grid.querySelector('[data-qty="' + q.getAttribute("data-id") + '"]');
      inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + Number(q.getAttribute("data-q")));
      return;
    }
    var add = e.target.closest("[data-add]");
    if (add) {
      var id = add.getAttribute("data-add");
      cart[id] = Math.max(1, parseInt(grid.querySelector('[data-qty="' + id + '"]').value, 10) || 1);
      saveCart(); render(); updateBar(true);
    }
  });

  /* ---------- enquiry bar ---------- */
  var bar = document.getElementById("cart-bar"), panel = document.getElementById("cart-panel"), toggle = document.getElementById("cart-toggle");
  function lines() {
    return Object.keys(cart).filter(find).map(function (id) { return { p: find(id), q: cart[id] }; });
  }
  function updateBar(pulse) {
    var ls = lines(), total = ls.reduce(function (s, l) { return s + l.q; }, 0);
    bar.hidden = !ls.length;
    document.body.classList.toggle("has-cart", ls.length > 0);
    if (!ls.length) { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); return; }
    document.getElementById("cart-count").textContent = total;
    document.getElementById("cart-label").textContent = (total === 1 ? "chair" : "chairs") + " in your enquiry (" + ls.length + (ls.length === 1 ? " model)" : " models)");
    document.getElementById("cart-list").innerHTML = ls.map(function (l) {
      return '<li><img src="' + l.p.img + '" alt=""><span><b>' + esc(l.p.name) + "</b><small>" + esc(l.p.cat) + "</small></span><strong>× " + l.q + '</strong><button type="button" data-remove="' + l.p.id + '" aria-label="Remove ' + esc(l.p.name) + '">×</button></li>';
    }).join("");
    var text = ls.map(function (l) { return "- " + l.p.name + " x " + l.q; }).join("\n");
    document.getElementById("cart-wa").href = window.waLink("Hi, I'd like a price for these chairs:\n" + text + "\nTotal: " + total + " chairs");
    document.getElementById("cart-quote").href = "quote.html?service=" + encodeURIComponent("New Chairs") + "&qty=" + total + "&items=" + encodeURIComponent(text);
    if (pulse) { bar.classList.remove("pulse"); void bar.offsetWidth; bar.classList.add("pulse"); }
  }
  toggle.addEventListener("click", function () {
    var open = panel.hidden;
    panel.hidden = !open; toggle.setAttribute("aria-expanded", open);
  });
  document.getElementById("cart-list").addEventListener("click", function (e) {
    var r = e.target.closest("[data-remove]"); if (!r) return;
    delete cart[r.getAttribute("data-remove")]; saveCart(); render(); updateBar();
  });
  document.getElementById("cart-clear").addEventListener("click", function () { cart = {}; saveCart(); render(); updateBar(); });

  render();
  updateBar();
})();
