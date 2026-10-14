/* ==========================================================
   Service management panel
   Enquiry -> Site inspection -> Quotation -> Job -> Invoice
   -> Next-service follow-up. Data is kept in Store (store.js).
   ========================================================== */
(function () {
  "use strict";
  let D = Store.load();
  const CUR = (window.SITE && SITE.currency) || "₹";

  /* ---------------- helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = () => toISO(new Date());
  const addDays = (iso, n) => { const d = parseDate(iso) || new Date(); d.setDate(d.getDate() + n); return toISO(d); };
  function parseDate(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
  }
  const fmtDate = (s) => { const d = parseDate(s); return d && !isNaN(d) ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"; };
  const money = (n) => CUR + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const find = (col, id) => D[col].find((x) => x.id === id);
  const custName = (c) => (c && (c.company || c.name)) || "—";
  const monthKey = (s) => (s || "").slice(0, 7);
  function save() { Store.save(D); }
  function waTo(phone, msg) {
    let p = String(phone || "").replace(/\D/g, "");
    if (p.length === 10) p = "91" + p;
    return "https://wa.me/" + p + "?text=" + encodeURIComponent(msg || "");
  }

  const ENQ_STATUS = ["New", "Contacted", "Inspection", "Quoted", "Won", "Lost"];
  const QT_STATUS = ["Draft", "Sent", "Approved", "Rejected"];
  const JOB_STATUS = ["Scheduled", "In progress", "On hold", "Completed"];
  const SOURCES = ["Website", "Callback", "Phone", "WhatsApp", "Referral", "Walk-in", "Repeat"];
  const SERVICES = ["Chair Repair", "Chair Cleaning", "Repair + Cleaning", "Bulk Refurbishment", "New Chairs", "Spare Parts", "Callback request"];
  const CHAIR_TYPES = ["Revolving / office", "Mesh", "Executive", "Visitor", "Cafeteria", "Auditorium", "Sofa / lounge"];
  const PILL = {
    New: "blue", Contacted: "amber", Inspection: "teal", Quoted: "violet", Won: "green", Lost: "red",
    Draft: "grey", Sent: "amber", Approved: "green", Rejected: "red",
    Scheduled: "blue", "In progress": "teal", "On hold": "grey", Completed: "green",
    Paid: "green", Partial: "amber", Unpaid: "blue", Overdue: "red"
  };
  const pill = (s) => `<span class="pill ${PILL[s] || "grey"}">${esc(s)}</span>`;
  const PRESETS = [
    ["Gas lift replacement (class 3)", 0], ["Wheel set replacement (5 nos)", 0], ["Star base replacement", 0],
    ["Tilt mechanism replacement", 0], ["Armrest replacement (pair)", 0], ["Seat foam + fabric re-upholstery", 0],
    ["Back re-upholstery", 0], ["Fabric chair deep cleaning", 0], ["Mesh chair cleaning", 0],
    ["Leatherette cleaning & conditioning", 0], ["Inspection, tightening & lubrication", 0], ["Pickup & delivery", 0]
  ];

  function totals(items, discount, gstPct) {
    const sub = (items || []).reduce((s, i) => s + num(i.qty) * num(i.rate), 0);
    const disc = num(discount), taxable = Math.max(0, sub - disc), tax = taxable * num(gstPct) / 100;
    return { sub, disc, taxable, tax, total: Math.round((taxable + tax) * 100) / 100 };
  }
  function invPaid(inv) { return (inv.payments || []).reduce((s, p) => s + num(p.amount), 0); }
  function invTotal(inv) { return totals(inv.items, inv.discount, inv.gstPct).total; }
  function invStatus(inv) {
    const bal = invTotal(inv) - invPaid(inv);
    if (bal <= 0.5) return "Paid";
    if (invPaid(inv) > 0) return "Partial";
    if (inv.dueDate && inv.dueDate < today()) return "Overdue";
    return "Unpaid";
  }

  /* ---------------- login ---------------- */
  const loginEl = $("#login"), appEl = $("#app");
  function showApp() { loginEl.hidden = true; appEl.hidden = false; route(); }
  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#pin").value === String(D.settings.pin)) { sessionStorage.setItem("cs_admin", "1"); showApp(); }
    else { $("#login-err").hidden = false; $("#pin").select(); }
  });

  /* ---------------- router ---------------- */
  const VIEWS = {
    dashboard: ["Dashboard", viewDashboard],
    enquiries: ["Enquiries", viewEnquiries],
    inspections: ["Site Inspections", viewInspections],
    quotes: ["Quotations", viewQuotes],
    jobs: ["Jobs & Schedule", viewJobs],
    invoices: ["Invoices & Payments", viewInvoices],
    reports: ["Business Reports", viewReports],
    settings: ["Settings", viewSettings]
  };
  let current = "dashboard";
  const filters = { enquiries: { s: "Open", q: "" }, quotes: { s: "All", q: "" }, jobs: { s: "Active", q: "" }, invoices: { s: "All", q: "" }, inspections: { q: "" } };

  function route() {
    const v = (location.hash.replace(/^#\/?/, "") || "dashboard").split("?")[0];
    current = VIEWS[v] ? v : "dashboard";
    render();
    document.body.classList.remove("side-open");
  }
  function render(keepFocus) {
    D = Store.load();
    const [title, fn] = VIEWS[current];
    $("#view-title").textContent = title;
    if ($("#side-name")) $("#side-name").textContent = D.settings.businessName || "Service Desk";
    document.title = title + " | " + (D.settings.businessName || "Service Desk");
    $$("#side-nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === current));
    const newCount = D.enquiries.filter((e) => e.status === "New").length;
    $("#c-enq").textContent = newCount || "";
    const out = fn();
    $("#top-actions").innerHTML = out.actions || "";
    $("#content").innerHTML = out.html;
    if (keepFocus) {
      const s = $("#content input[type=search]");
      if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
    }
  }
  window.addEventListener("hashchange", route);
  $("#side-toggle").addEventListener("click", () => document.body.classList.toggle("side-open"));

  /* ---------------- shared UI bits ---------------- */
  function seg(key, options, counts) {
    return `<div class="seg">${options.map((o) => `<button data-act="filter" data-key="${key}" data-val="${esc(o)}" class="${filters[key].s === o ? "on" : ""}">${esc(o)}${counts && counts[o] != null ? `<em>${counts[o]}</em>` : ""}</button>`).join("")}</div>`;
  }
  const search = (key, ph) => `<input type="search" data-search="${key}" placeholder="${ph || "Search..."}" value="${esc(filters[key].q)}">`;
  const matches = (obj, q) => !q || JSON.stringify(obj, (k, v) => (/photos/i.test(k) ? undefined : v)).toLowerCase().includes(q.toLowerCase());
  const table = (head, rows, empty, foot) => `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head}</tr></thead><tbody>${rows || `<tr class="empty-row"><td colspan="12">${empty}</td></tr>`}</tbody>${foot || ""}</table></div>`;

  /* ---------------- drawer ---------------- */
  const drawerEl = $("#drawer");
  let drawerSubmit = null;
  const tmpPhotos = {};
  function openDrawer(title, body, foot, onSubmit) {
    drawerSubmit = onSubmit || null;
    const inner = `<div class="drawer-head"><h2>${esc(title)}</h2><button type="button" class="x" data-act="close" aria-label="Close">&times;</button></div>
      <div class="drawer-body">${body}</div>${foot ? `<div class="drawer-foot">${foot}</div>` : ""}`;
    drawerEl.innerHTML = `<div class="drawer-panel" role="dialog" aria-modal="true">${onSubmit ? `<form id="dform" novalidate>${inner}</form>` : inner}</div>`;
    drawerEl.hidden = false;
    const first = $(".drawer-body input:not([type=hidden]), .drawer-body select, .drawer-body textarea", drawerEl);
    if (first && onSubmit) first.focus();
    updateTotals();
  }
  function closeDrawer() { drawerEl.hidden = true; drawerEl.innerHTML = ""; drawerSubmit = null; }
  drawerEl.addEventListener("click", (e) => { if (e.target === drawerEl) closeDrawer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawerEl.hidden) closeDrawer(); });
  drawerEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) { const bad = $(":invalid", f); bad.focus(); bad.reportValidity && bad.reportValidity(); return; }
    if (drawerSubmit) drawerSubmit(f);
  });
  const fv = (f, n) => (f.elements[n] ? f.elements[n].value.trim() : "");

  function photoField(key, arr, label) {
    tmpPhotos[key] = (arr || []).slice();
    return `<div class="span-2"><label>${esc(label)}</label>
      <label class="mini-drop">📷 Add photos (tap or click)<input type="file" accept="image/*" multiple hidden data-photos="${key}"></label>
      <div class="thumbs" id="th-${key}">${thumbsHtml(key)}</div></div>`;
  }
  function thumbsHtml(key) {
    return tmpPhotos[key].map((src, i) => `<div class="thumb"><img src="${src}" alt="Photo ${i + 1}"><button type="button" data-act="ph-del" data-key="${key}" data-i="${i}" aria-label="Remove">&times;</button></div>`).join("");
  }
  const gallery = (arr) => arr && arr.length ? `<div class="gallery">${arr.map((s, i) => `<a href="${s}" target="_blank" rel="noopener"><img src="${s}" alt="Photo ${i + 1}"></a>`).join("")}</div>` : `<p class="muted">No photos.</p>`;

  function custFields(c) {
    c = c || {};
    return `<div class="fs-title">Customer</div>
      <label>Contact name *<input name="c_name" required value="${esc(c.name)}"></label>
      <label>Company<input name="c_company" value="${esc(c.company)}"></label>
      <label>Phone *<input name="c_phone" required value="${esc(c.phone)}"></label>
      <label class="span-2">Address / site<textarea name="c_address" rows="2">${esc(c.address)}</textarea></label>`;
  }
  const readCust = (f) => ({ name: fv(f, "c_name"), company: fv(f, "c_company"), phone: fv(f, "c_phone"), email: fv(f, "c_email"), address: fv(f, "c_address") });
  const custFromEnq = (e) => e ? { name: e.name, company: e.company, phone: e.phone, email: e.email, address: e.city } : {};

  function itemsField(items, discount, gstPct) {
    const rows = (items && items.length ? items : [{ desc: "", qty: 1, rate: 0 }]).map(itemRow).join("");
    return `<div class="fs-title">Line items</div>
      <div class="span-2">
        <table class="items"><thead><tr><th style="width:52%">Description</th><th>Qty</th><th>Rate (${CUR})</th><th style="text-align:right">Amount</th><th></th></tr></thead>
        <tbody id="items-body">${rows}</tbody></table>
        <div class="items-tools">
          <button type="button" class="btn btn-outline btn-xs" data-act="item-add">+ Add line</button>
          <select data-preset><option value="">+ Add common item…</option>${PRESETS.map((p) => `<option>${esc(p[0])}</option>`).join("")}</select>
        </div>
      </div>
      <label>Discount (${CUR})<input name="discount" type="number" min="0" step="0.01" value="${num(discount)}" data-calc></label>
      <label>GST %<input name="gstPct" type="number" min="0" step="0.01" value="${gstPct == null ? D.settings.gstPct : gstPct}" data-calc></label>
      <div class="span-2"><div class="totals" id="totals"></div></div>`;
  }
  function itemRow(it) {
    return `<tr class="it-row"><td><input class="it-desc" value="${esc(it.desc)}" placeholder="e.g. Gas lift replacement"></td>
      <td><input class="it-qty" type="number" min="0" step="1" value="${num(it.qty)}" data-calc style="width:80px"></td>
      <td><input class="it-rate" type="number" min="0" step="0.01" value="${num(it.rate)}" data-calc style="width:110px"></td>
      <td class="amt">${money(num(it.qty) * num(it.rate))}</td>
      <td><button type="button" class="del" data-act="item-del" aria-label="Remove line">&times;</button></td></tr>`;
  }
  const readItems = () => $$(".it-row", drawerEl).map((r) => ({ desc: $(".it-desc", r).value.trim(), qty: num($(".it-qty", r).value), rate: num($(".it-rate", r).value) })).filter((i) => i.desc);
  function updateTotals() {
    const box = $("#totals", drawerEl);
    if (!box) return;
    $$(".it-row", drawerEl).forEach((r) => { $(".amt", r).textContent = money(num($(".it-qty", r).value) * num($(".it-rate", r).value)); });
    const f = $("#dform");
    const t = totals(readItems(), f.elements.discount.value, f.elements.gstPct.value);
    box.innerHTML = `<span>Subtotal</span><span>${money(t.sub)}</span><span>Discount</span><span>− ${money(t.disc)}</span>
      <span>GST (${num(f.elements.gstPct.value)}%)</span><span>${money(t.tax)}</span><span class="grand">Total</span><span class="grand">${money(t.total)}</span>`;
  }

  /* ================= DASHBOARD ================= */
  function viewDashboard() {
    const t = today(), m = monthKey(t), in30 = addDays(t, 30), in14 = addDays(t, 14);
    const open = D.enquiries.filter((e) => !["Won", "Lost"].includes(e.status));
    const followUps = open.filter((e) => e.followUp && e.followUp <= t).sort((a, b) => (a.followUp < b.followUp ? -1 : 1));
    const openQuotes = D.quotes.filter((q) => q.status === "Sent" || q.status === "Draft");
    const openQuoteVal = openQuotes.reduce((s, q) => s + totals(q.items, q.discount, q.gstPct).total, 0);
    const activeJobs = D.jobs.filter((j) => j.status === "In progress" || j.status === "Scheduled");
    const chairsMonth = D.jobs.filter((j) => monthKey(j.completedAt) === m).reduce((s, j) => s + num(j.completedChairs), 0);
    let collected = 0, outstanding = 0;
    D.invoices.forEach((inv) => {
      (inv.payments || []).forEach((p) => { if (monthKey(p.date) === m) collected += num(p.amount); });
      outstanding += Math.max(0, invTotal(inv) - invPaid(inv));
    });
    const upcomingJobs = D.jobs.filter((j) => j.status !== "Completed" && j.scheduledDate && j.scheduledDate <= in14).sort((a, b) => (a.scheduledDate < b.scheduledDate ? -1 : 1));
    const dueService = D.invoices.filter((i) => i.nextServiceDate && !i.nextServiceDone && i.nextServiceDate <= in30).sort((a, b) => (a.nextServiceDate < b.nextServiceDate ? -1 : 1));
    const newEnq = D.enquiries.filter((e) => e.status === "New");

    const kpi = (label, val, sub, alert) => `<div class="kpi${alert ? " alert" : ""}"><span>${label}</span><strong>${val}</strong>${sub ? `<small>${sub}</small>` : ""}</div>`;
    const html = `
      ${!D.enquiries.length ? `<div class="note" style="margin-bottom:18px">No data yet. Enquiries from the website's quote and callback forms appear here automatically. To explore the system, <button class="link-btn" data-act="seed">load demo data</button>.</div>` : ""}
      <div class="kpis">
        ${kpi("New enquiries", newEnq.length, "Waiting for first contact", newEnq.length > 0)}
        ${kpi("Follow-ups due", followUps.length, "Today or overdue", followUps.length > 0)}
        ${kpi("Open quotations", money(openQuoteVal), openQuotes.length + " quotes")}
        ${kpi("Active jobs", activeJobs.length, "Scheduled + in progress")}
        ${kpi("Chairs serviced", chairsMonth, "This month")}
        ${kpi("Collected", money(collected), "This month")}
        ${kpi("Outstanding", money(outstanding), "All unpaid invoices", outstanding > 0)}
      </div>
      <div class="panels">
        <section class="panel"><header><h2>Follow-ups due</h2><a href="#/enquiries">All enquiries</a></header>
          ${followUps.length ? followUps.slice(0, 8).map((e) => `<div class="list-item"><div class="grow"><strong>${esc(e.company || e.name)}</strong><small>${esc(e.id)} · ${esc(e.service)} · ${e.quantity || "?"} chairs · due ${fmtDate(e.followUp)}${e.followUp < t ? " (overdue)" : ""}</small></div>${pill(e.status)}<button class="btn btn-outline btn-xs" data-act="enq-view" data-id="${e.id}">Open</button></div>`).join("") : `<div class="empty">Nothing due. Nice work.</div>`}
        </section>
        <section class="panel"><header><h2>Upcoming jobs (next 14 days)</h2><a href="#/jobs">All jobs</a></header>
          ${upcomingJobs.length ? upcomingJobs.slice(0, 8).map((j) => `<div class="list-item"><div class="grow"><strong>${esc(custName(j.customer))}</strong><small>${esc(j.id)} · ${fmtDate(j.scheduledDate)} · ${(j.technicians || []).join(", ") || "No technician"}</small></div>${progress(j)}<button class="btn btn-outline btn-xs" data-act="job-edit" data-id="${j.id}">Open</button></div>`).join("") : `<div class="empty">No jobs scheduled.</div>`}
        </section>
        <section class="panel"><header><h2>Next service due (repeat business)</h2><a href="#/invoices">Invoices</a></header>
          ${dueService.length ? dueService.map((i) => `<div class="list-item"><div class="grow"><strong>${esc(custName(i.customer))}</strong><small>Last job ${esc(i.jobId || i.id)} · service due ${fmtDate(i.nextServiceDate)}</small></div><a class="btn btn-wa btn-xs" target="_blank" rel="noopener" href="${waTo(i.customer.phone, `Hello ${i.customer.name}, this is ${D.settings.businessName}. Your chairs are due for their next service (cleaning & check-up). Shall we schedule a visit?`)}">Remind</a><button class="btn btn-teal btn-xs" data-act="repeat-enq" data-id="${i.id}">Create enquiry</button></div>`).join("") : `<div class="empty">No services due in the next 30 days.</div>`}
        </section>
        <section class="panel"><header><h2>Enquiry pipeline</h2><a href="#/reports">Reports</a></header>
          <table class="tbl" style="min-width:0"><thead><tr><th>Stage</th><th class="num">Enquiries</th><th class="num">Chairs</th></tr></thead><tbody>
          ${ENQ_STATUS.map((s) => { const l = D.enquiries.filter((e) => e.status === s); return `<tr><td>${pill(s)}</td><td class="num">${l.length}</td><td class="num">${l.reduce((a, e) => a + num(e.quantity), 0)}</td></tr>`; }).join("")}
          </tbody></table>
        </section>
      </div>`;
    return { html, actions: `<button class="btn btn-amber" data-act="enq-new">+ New enquiry</button>` };
  }
  function progress(j) {
    const pct = j.totalChairs ? Math.min(100, Math.round(num(j.completedChairs) / num(j.totalChairs) * 100)) : 0;
    return `<div class="progress"><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><span>${num(j.completedChairs)}/${num(j.totalChairs)} chairs</span></div>`;
  }

  /* ================= ENQUIRIES ================= */
  function viewEnquiries() {
    const F = filters.enquiries, t = today();
    const counts = { Open: 0, All: D.enquiries.length };
    ENQ_STATUS.forEach((s) => (counts[s] = 0));
    D.enquiries.forEach((e) => { counts[e.status]++; if (!["Won", "Lost"].includes(e.status)) counts.Open++; });
    const list = D.enquiries.filter((e) => (F.s === "All" ? true : F.s === "Open" ? !["Won", "Lost"].includes(e.status) : e.status === F.s) && matches(e, F.q));
    const rows = list.map((e) => `<tr>
        <td><span class="ref">${esc(e.id)}</span><span class="sub">${fmtDate(e.createdAt)}</span></td>
        <td><strong>${esc(e.company || e.name)}</strong><span class="sub">${esc(e.company ? e.name + " · " : "")}${esc(e.phone)}</span></td>
        <td>${esc(e.service)}<span class="sub">${esc(e.source)}${e.photos && e.photos.length ? " · 📷 " + e.photos.length : ""}</span></td>
        <td class="num">${e.quantity || "—"}</td>
        <td><select class="inline" data-change="enq-status" data-id="${e.id}" aria-label="Status">${ENQ_STATUS.map((s) => `<option${s === e.status ? " selected" : ""}>${s}</option>`).join("")}</select></td>
        <td>${e.followUp ? `<span style="${e.followUp <= t && !["Won", "Lost"].includes(e.status) ? "color:#b0291b;font-weight:700" : ""}">${fmtDate(e.followUp)}</span>` : "—"}</td>
        <td class="actions"><a class="btn btn-wa btn-xs" target="_blank" rel="noopener" href="${waTo(e.phone, `Hello ${e.name}, thank you for your enquiry (${e.id}) with ${D.settings.businessName}.`)}">WA</a> <button class="btn btn-outline btn-xs" data-act="enq-view" data-id="${e.id}">Open</button></td></tr>`).join("");
    return {
      actions: `<button class="btn btn-amber" data-act="enq-new">+ New enquiry</button>`,
      html: `<div class="toolbar">${seg("enquiries", ["Open", "All", ...ENQ_STATUS], counts)}${search("enquiries", "Search name, phone, ref…")}</div>
        ${table(`<th>Ref</th><th>Customer</th><th>Service</th><th class="num">Chairs</th><th>Status</th><th>Follow-up</th><th></th>`, rows, "No enquiries here yet.")}`
    };
  }
  function enqForm(e) {
    e = e || { source: "Phone", status: "New", followUp: today(), chairTypes: [], problems: [], photos: [] };
    openDrawer(e.id ? "Edit " + e.id : "New enquiry", `<div class="form-grid">
        <div class="fs-title">Customer</div>
        <label>Name *<input name="name" required value="${esc(e.name)}"></label>
        <label>Company<input name="company" value="${esc(e.company)}"></label>
        <label>Phone *<input name="phone" required value="${esc(e.phone)}"></label>
        <label class="span-2">Location / address<input name="city" value="${esc(e.city)}"></label>
        <div class="fs-title">Requirement</div>
        <label>Service<select name="service">${SERVICES.map((s) => `<option${s === e.service ? " selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Number of chairs<input name="quantity" type="number" min="0" value="${esc(e.quantity)}"></label>
        <div class="span-2"><label>Chair types</label><div class="check-row">${CHAIR_TYPES.map((c) => `<label><input type="checkbox" name="chairTypes" value="${c}"${(e.chairTypes || []).includes(c) ? " checked" : ""}>${c}</label>`).join("")}</div></div>
        <label class="span-2">Problems / details<textarea name="message">${esc([(e.problems || []).join(", "), e.message].filter(Boolean).join("\n"))}</textarea></label>
        <div class="fs-title">Tracking</div>
        <label>Source<select name="source">${SOURCES.map((s) => `<option${s === e.source ? " selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Status<select name="status">${ENQ_STATUS.map((s) => `<option${s === e.status ? " selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Next follow-up<input name="followUp" type="date" value="${esc(e.followUp)}"></label>
        <label>Preferred inspection date<input name="preferredDate" type="date" value="${esc(e.preferredDate)}"></label>
        ${photoField("enq", e.photos, "Chair photos")}
      </div>`,
      `<button type="button" class="btn btn-outline" data-act="close">Cancel</button><button class="btn btn-teal" type="submit">Save enquiry</button>`,
      (f) => {
        const data = {
          name: fv(f, "name"), company: fv(f, "company"), phone: fv(f, "phone"), email: fv(f, "email"), city: fv(f, "city"),
          service: fv(f, "service"), quantity: num(fv(f, "quantity")), chairTypes: $$("input[name=chairTypes]:checked", f).map((i) => i.value),
          message: fv(f, "message"), problems: [], source: fv(f, "source"), status: fv(f, "status"), followUp: fv(f, "followUp"),
          preferredDate: fv(f, "preferredDate"), photos: tmpPhotos.enq
        };
        if (e.id) { Object.assign(find("enquiries", e.id), data); save(); }
        else { D = Store.load(); data.id = Store.nextId(D, "ENQ"); data.createdAt = new Date().toISOString(); data.notes = []; D.enquiries.unshift(data); save(); }
        closeDrawer(); render();
      });
  }
  function enqView(id) {
    const e = find("enquiries", id);
    if (!e) return;
    const ins = D.inspections.filter((i) => i.enquiryId === id), qts = D.quotes.filter((q) => q.enquiryId === id);
    openDrawer(e.id + " · " + (e.company || e.name), `
      <div class="action-bar">
        <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waTo(e.phone, `Hello ${e.name}, this is ${D.settings.businessName} regarding your chair service enquiry (${e.id}).`)}">WhatsApp</a>
        <a class="btn btn-outline btn-sm" href="tel:${esc(e.phone)}">Call</a>
        <button class="btn btn-teal btn-sm" data-act="ins-new" data-id="${e.id}">Record site inspection</button>
        <button class="btn btn-amber btn-sm" data-act="qt-new" data-id="${e.id}">Create quotation</button>
        <button class="btn btn-outline btn-sm" data-act="enq-edit" data-id="${e.id}">Edit</button>
      </div>
      <dl class="dl">
        <dt>Status</dt><dd>${pill(e.status)}</dd>
        <dt>Received</dt><dd>${fmtDate(e.createdAt)} via ${esc(e.source)}</dd>
        <dt>Contact</dt><dd>${esc(e.name)}${e.company ? ", " + esc(e.company) : ""}<br>${esc(e.phone)}</dd>
        <dt>Location</dt><dd>${esc(e.city) || "—"}</dd>
        <dt>Service</dt><dd>${esc(e.service)}</dd>
        <dt>Chairs</dt><dd>${e.quantity || "—"} ${e.chairTypes && e.chairTypes.length ? "(" + esc(e.chairTypes.join(", ")) + ")" : ""}</dd>
        <dt>Problems</dt><dd>${esc((e.problems || []).join(", ")) || "—"}</dd>
        <dt>Message</dt><dd style="white-space:pre-wrap">${esc(e.message) || "—"}</dd>
        <dt>Preferred date</dt><dd>${fmtDate(e.preferredDate)}</dd>
        <dt>Contact via</dt><dd>${esc(e.contactPref) || "—"}</dd>
        <dt>Inspections</dt><dd>${ins.map((i) => `<button class="link-btn" data-act="ins-edit" data-id="${i.id}">${i.id}</button>`).join(", ") || "—"}</dd>
        <dt>Quotations</dt><dd>${qts.map((q) => `<button class="link-btn" data-act="qt-edit" data-id="${q.id}">${q.id}</button> ${pill(q.status)}`).join(" ") || "—"}</dd>
      </dl>
      <h3>Photos</h3>${gallery(e.photos)}
      <h3 style="margin-top:20px">Follow-up</h3>
      <form id="fu-form" class="form-grid" style="margin-bottom:12px">
        <label>Status<select name="status">${ENQ_STATUS.map((s) => `<option${s === e.status ? " selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Next follow-up<input type="date" name="followUp" value="${esc(e.followUp)}"></label>
        <label class="span-2">Add note<textarea name="note" rows="2" placeholder="e.g. Called, asked for photos of 2nd floor chairs"></textarea></label>
        <div class="span-2"><button class="btn btn-teal btn-sm" type="button" data-act="fu-save" data-id="${e.id}">Save follow-up</button></div>
      </form>
      <div class="notes">${(e.notes || []).slice().reverse().map((n) => `<div class="note-item">${esc(n.text)}<small>${new Date(n.at).toLocaleString("en-IN")}</small></div>`).join("") || `<p class="muted">No notes yet.</p>`}</div>`,
      `<button class="btn btn-outline left" style="color:#b0291b;border-color:#b0291b" data-act="enq-del" data-id="${e.id}">Delete</button><button class="btn btn-outline" data-act="close">Close</button>`);
  }

  /* ================= INSPECTIONS ================= */
  function viewInspections() {
    const F = filters.inspections;
    const list = D.inspections.filter((i) => matches(i, F.q));
    const rows = list.map((i) => {
      const chairs = (i.items || []).reduce((s, x) => s + num(x.qty), 0);
      return `<tr><td><span class="ref">${esc(i.id)}</span><span class="sub">${esc(i.enquiryId || "")}</span></td>
        <td>${fmtDate(i.date)}</td><td><strong>${esc(custName(i.customer))}</strong><span class="sub">${esc(i.customer.address || "")}</span></td>
        <td class="num">${chairs}</td><td>${esc(i.inspector || "—")}</td><td>${esc(i.recommendation || "—")}</td>
        <td class="actions"><button class="btn btn-amber btn-xs" data-act="ins-quote" data-id="${i.id}">Quote</button> <button class="btn btn-outline btn-xs" data-act="ins-edit" data-id="${i.id}">Open</button></td></tr>`;
    }).join("");
    return {
      actions: `<button class="btn btn-amber" data-act="ins-new">+ New inspection</button>`,
      html: `<div class="toolbar">${search("inspections", "Search customer, ref…")}</div>
        ${table(`<th>Ref</th><th>Date</th><th>Customer / site</th><th class="num">Chairs</th><th>Inspector</th><th>Recommendation</th><th></th>`, rows, "No inspections recorded. Open an enquiry and click “Record site inspection”.")}`
    };
  }
  function insRow(it) {
    return `<tr class="in-row"><td><select class="in-type">${CHAIR_TYPES.map((c) => `<option${c === it.type ? " selected" : ""}>${c}</option>`).join("")}</select></td>
      <td><input class="in-qty" type="number" min="0" value="${num(it.qty)}" style="width:80px"></td>
      <td><select class="in-cond">${["Good", "Fair", "Poor", "Scrap"].map((c) => `<option${c === it.cond ? " selected" : ""}>${c}</option>`).join("")}</select></td>
      <td><input class="in-work" value="${esc(it.work)}" placeholder="e.g. Gas lift + cleaning"></td>
      <td><button type="button" class="del" data-act="row-del" aria-label="Remove row">&times;</button></td></tr>`;
  }
  function insForm(ins, enq) {
    const isNew = !ins;
    ins = ins || { date: today(), enquiryId: enq ? enq.id : "", customer: custFromEnq(enq), items: [{ type: (enq && enq.chairTypes && enq.chairTypes[0]) || CHAIR_TYPES[0], qty: enq ? enq.quantity : 0, cond: "Fair", work: "" }], photos: [] };
    openDrawer(isNew ? "New site inspection" : "Inspection " + ins.id, `<div class="form-grid">
        <label>Linked enquiry<select name="enquiryId"><option value="">—</option>${D.enquiries.map((e) => `<option value="${e.id}"${e.id === ins.enquiryId ? " selected" : ""}>${e.id} · ${esc(e.company || e.name)}</option>`).join("")}</select></label>
        <label>Inspection date<input type="date" name="date" value="${esc(ins.date)}"></label>
        <label>Inspected by<select name="inspector"><option value="">—</option>${D.technicians.map((t) => `<option${t === ins.inspector ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
        <label>Recommendation<select name="recommendation">${["Repair", "Cleaning", "Repair + Cleaning", "Re-upholstery", "Replace with new"].map((r) => `<option${r === ins.recommendation ? " selected" : ""}>${r}</option>`).join("")}</select></label>
        ${custFields(ins.customer)}
        <div class="fs-title">Chairs found on site</div>
        <div class="span-2"><table class="items"><thead><tr><th>Chair type</th><th>Qty</th><th>Condition</th><th style="width:40%">Work needed</th><th></th></tr></thead>
          <tbody id="in-body">${(ins.items || []).map(insRow).join("")}</tbody></table>
          <div class="items-tools"><button type="button" class="btn btn-outline btn-xs" data-act="row-add">+ Add chair group</button></div></div>
        <label class="span-2">Inspection notes<textarea name="summary" placeholder="Floors visited, access timings, special requests…">${esc(ins.summary)}</textarea></label>
        ${photoField("ins", ins.photos, "Site photos")}
      </div>`,
      `${!isNew ? `<button type="button" class="btn btn-outline left" style="color:#b0291b;border-color:#b0291b" data-act="ins-del" data-id="${ins.id}">Delete</button><button type="button" class="btn btn-amber" data-act="ins-quote" data-id="${ins.id}">Create quotation</button>` : ""}
       <button type="button" class="btn btn-outline" data-act="close">Cancel</button><button class="btn btn-teal" type="submit">Save inspection</button>`,
      (f) => {
        const data = {
          enquiryId: fv(f, "enquiryId"), date: fv(f, "date"), inspector: fv(f, "inspector"), recommendation: fv(f, "recommendation"),
          customer: readCust(f), summary: fv(f, "summary"), photos: tmpPhotos.ins,
          items: $$(".in-row", f).map((r) => ({ type: $(".in-type", r).value, qty: num($(".in-qty", r).value), cond: $(".in-cond", r).value, work: $(".in-work", r).value.trim() })).filter((x) => x.qty > 0)
        };
        D = Store.load();
        if (isNew) {
          data.id = Store.nextId(D, "INS"); D.inspections.unshift(data);
          const e = find("enquiries", data.enquiryId);
          if (e && ["New", "Contacted"].includes(e.status)) e.status = "Inspection";
        } else Object.assign(find("inspections", ins.id), data);
        save(); closeDrawer(); render();
      });
  }

  /* ================= QUOTATIONS ================= */
  function viewQuotes() {
    const F = filters.quotes;
    const counts = { All: D.quotes.length }; QT_STATUS.forEach((s) => (counts[s] = D.quotes.filter((q) => q.status === s).length));
    const list = D.quotes.filter((q) => (F.s === "All" || q.status === F.s) && matches(q, F.q));
    const rows = list.map((q) => {
      const t = totals(q.items, q.discount, q.gstPct), job = D.jobs.find((j) => j.quoteId === q.id);
      return `<tr><td><span class="ref">${esc(q.id)}</span><span class="sub">${esc(q.enquiryId || "")}</span></td><td>${fmtDate(q.date)}</td>
        <td><strong>${esc(custName(q.customer))}</strong><span class="sub">${esc(q.customer.phone)}</span></td>
        <td class="num">${money(t.total)}</td><td>${pill(q.status)}</td>
        <td class="actions"><button class="btn btn-outline btn-xs" data-act="qt-print" data-id="${q.id}">Print / PDF</button>
          ${q.status === "Approved" ? (job ? `<button class="btn btn-outline btn-xs" data-act="job-edit" data-id="${job.id}">${job.id}</button>` : `<button class="btn btn-teal btn-xs" data-act="qt-job" data-id="${q.id}">Create job</button>`) : ""}
          <button class="btn btn-outline btn-xs" data-act="qt-edit" data-id="${q.id}">Open</button></td></tr>`;
    }).join("");
    return {
      actions: `<button class="btn btn-amber" data-act="qt-new">+ New quotation</button>`,
      html: `<div class="toolbar">${seg("quotes", ["All", ...QT_STATUS], counts)}${search("quotes", "Search customer, ref…")}</div>
        ${table(`<th>Ref</th><th>Date</th><th>Customer</th><th class="num">Total</th><th>Status</th><th></th>`, rows, "No quotations yet.")}`
    };
  }
  function qtForm(q, src) {
    const isNew = !q;
    if (isNew) {
      src = src || {};
      q = { date: today(), validDays: 15, status: "Draft", discount: 0, gstPct: D.settings.gstPct, terms: D.settings.quoteTerms, enquiryId: src.enquiryId || "", inspectionId: src.inspectionId || "", customer: src.customer || {}, items: src.items || [] };
    }
    openDrawer(isNew ? "New quotation" : "Quotation " + q.id, `<div class="form-grid">
        <label>Quotation date<input type="date" name="date" value="${esc(q.date)}"></label>
        <label>Valid for (days)<input type="number" name="validDays" min="1" value="${esc(q.validDays)}"></label>
        <label>Status<select name="status">${QT_STATUS.map((s) => `<option${s === q.status ? " selected" : ""}>${s}</option>`).join("")}</select></label>
        <label>Linked enquiry<select name="enquiryId"><option value="">—</option>${D.enquiries.map((e) => `<option value="${e.id}"${e.id === q.enquiryId ? " selected" : ""}>${e.id} · ${esc(e.company || e.name)}</option>`).join("")}</select></label>
        ${custFields(q.customer)}
        ${itemsField(q.items, q.discount, q.gstPct)}
        <label class="span-2">Terms &amp; conditions<textarea name="terms" rows="5">${esc(q.terms)}</textarea></label>
      </div>`,
      `${!isNew ? `<button type="button" class="btn btn-outline left" style="color:#b0291b;border-color:#b0291b" data-act="qt-del" data-id="${q.id}">Delete</button>` : ""}
       <button type="button" class="btn btn-outline" data-act="close">Cancel</button>
       <button class="btn btn-outline" type="submit" data-then="print">Save &amp; print</button>
       <button class="btn btn-teal" type="submit">Save quotation</button>`,
      (f) => {
        const data = {
          date: fv(f, "date"), validDays: num(fv(f, "validDays")), status: fv(f, "status"), enquiryId: fv(f, "enquiryId"),
          customer: readCust(f), items: readItems(), discount: num(fv(f, "discount")), gstPct: num(fv(f, "gstPct")), terms: fv(f, "terms"),
          inspectionId: q.inspectionId || ""
        };
        if (!data.items.length) { alert("Add at least one line item."); return; }
        D = Store.load();
        let id = q.id;
        if (isNew) { id = data.id = Store.nextId(D, "QT"); D.quotes.unshift(data); }
        else Object.assign(find("quotes", id), data);
        syncEnqFromQuote(find("quotes", id));
        save(); closeDrawer(); render();
        if (lastSubmitter === "print") printDoc("quote", id);
      });
  }
  function syncEnqFromQuote(q) {
    const e = q && find("enquiries", q.enquiryId);
    if (!e) return;
    if (q.status === "Approved") e.status = "Won";
    else if (q.status === "Rejected") e.status = "Lost";
    else if (["New", "Contacted", "Inspection"].includes(e.status)) e.status = "Quoted";
  }
  let lastSubmitter = "";
  drawerEl.addEventListener("click", (e) => { const b = e.target.closest("button[type=submit]"); if (b) lastSubmitter = b.dataset.then || ""; });

  /* ================= JOBS ================= */
  function viewJobs() {
    const F = filters.jobs;
    const counts = { Active: D.jobs.filter((j) => j.status !== "Completed").length, All: D.jobs.length };
    JOB_STATUS.forEach((s) => (counts[s] = D.jobs.filter((j) => j.status === s).length));
    const list = D.jobs.filter((j) => (F.s === "All" || (F.s === "Active" ? j.status !== "Completed" : j.status === F.s)) && matches(j, F.q))
      .sort((a, b) => ((a.scheduledDate || "") < (b.scheduledDate || "") ? -1 : 1));
    const rows = list.map((j) => {
      const inv = D.invoices.find((i) => i.jobId === j.id);
      return `<tr><td><span class="ref">${esc(j.id)}</span><span class="sub">${esc(j.quoteId || "")}</span></td>
        <td><strong>${esc(custName(j.customer))}</strong><span class="sub">${esc(j.title)}</span></td>
        <td>${fmtDate(j.scheduledDate)}${j.endDate ? `<span class="sub">to ${fmtDate(j.endDate)}</span>` : ""}</td>
        <td>${esc((j.technicians || []).join(", ") || "—")}</td><td>${progress(j)}</td><td>${pill(j.status)}</td>
        <td class="actions"><button class="btn btn-outline btn-xs" data-act="job-report" data-id="${j.id}">Photo report</button>
          ${j.status === "Completed" ? (inv ? `<button class="btn btn-outline btn-xs" data-act="inv-edit" data-id="${inv.id}">${inv.id}</button>` : `<button class="btn btn-teal btn-xs" data-act="job-invoice" data-id="${j.id}">Invoice</button>`) : ""}
          <button class="btn btn-outline btn-xs" data-act="job-edit" data-id="${j.id}">Open</button></td></tr>`;
    }).join("");
    return {
      actions: `<button class="btn btn-amber" data-act="job-new">+ New job</button>`,
      html: `<div class="toolbar">${seg("jobs", ["Active", "All", ...JOB_STATUS], counts)}${search("jobs", "Search customer, technician…")}</div>
        ${table(`<th>Ref</th><th>Customer / work</th><th>Schedule</th><th>Technicians</th><th>Progress</th><th>Status</th><th></th>`, rows, "No jobs. Approve a quotation, then click “Create job”.")}`
    };
  }
  function jobForm(j, fromQuote) {
    const isNew = !j;
    if (isNew) {
      const q = fromQuote || {};
      const e = q.enquiryId ? find("enquiries", q.enquiryId) : null;
      const chairs = (e && e.quantity) || (q.items || []).reduce((s, i) => Math.max(s, num(i.qty)), 0);
      j = { quoteId: q.id || "", enquiryId: q.enquiryId || "", customer: q.customer || {}, title: (q.items || []).map((i) => i.desc).slice(0, 3).join(", "),
        totalChairs: chairs, batchSize: 25, completedChairs: 0, scheduledDate: addDays(today(), 2), technicians: [], status: "Scheduled", beforePhotos: [], afterPhotos: [] };
    }
    openDrawer(isNew ? "New job" : "Job " + j.id, `<div class="form-grid">
        <label class="span-2">Work description<input name="title" value="${esc(j.title)}" placeholder="e.g. Gas lift + deep cleaning, 2nd & 3rd floor"></label>
        <label>Start date<input type="date" name="scheduledDate" value="${esc(j.scheduledDate)}"></label>
        <label>Expected finish<input type="date" name="endDate" value="${esc(j.endDate)}"></label>
        <label>Total chairs<input type="number" min="0" name="totalChairs" value="${num(j.totalChairs)}"></label>
        <label>Batch size (chairs at a time)<input type="number" min="1" name="batchSize" value="${num(j.batchSize) || 25}"></label>
        <label>Chairs completed so far<input type="number" min="0" name="completedChairs" value="${num(j.completedChairs)}"></label>
        <label>Status<select name="status">${JOB_STATUS.map((s) => `<option${s === j.status ? " selected" : ""}>${s}</option>`).join("")}</select></label>
        <div class="span-2"><label>Assigned technicians</label><div class="check-row">${D.technicians.map((t) => `<label><input type="checkbox" name="tech" value="${esc(t)}"${(j.technicians || []).includes(t) ? " checked" : ""}>${esc(t)}</label>`).join("") || `<span class="muted">Add technicians in Settings.</span>`}</div></div>
        ${custFields(j.customer)}
        <label class="span-2">Job notes<textarea name="notes" placeholder="Access timings, floor plan, parts to carry…">${esc(j.notes)}</textarea></label>
        <div class="fs-title">Photo proof</div>
        ${photoField("before", j.beforePhotos, "Before photos")}
        ${photoField("after", j.afterPhotos, "After photos")}
      </div>`,
      `${!isNew ? `<button type="button" class="btn btn-outline left" style="color:#b0291b;border-color:#b0291b" data-act="job-del" data-id="${j.id}">Delete</button><button type="button" class="btn btn-outline" data-act="job-report" data-id="${j.id}">Photo report</button>` : ""}
       <button type="button" class="btn btn-outline" data-act="close">Cancel</button><button class="btn btn-teal" type="submit">Save job</button>`,
      (f) => {
        const data = {
          title: fv(f, "title"), scheduledDate: fv(f, "scheduledDate"), endDate: fv(f, "endDate"), totalChairs: num(fv(f, "totalChairs")),
          batchSize: num(fv(f, "batchSize")), completedChairs: num(fv(f, "completedChairs")), status: fv(f, "status"),
          technicians: $$("input[name=tech]:checked", f).map((i) => i.value), customer: readCust(f), notes: fv(f, "notes"),
          beforePhotos: tmpPhotos.before, afterPhotos: tmpPhotos.after
        };
        if (data.status === "Completed") {
          if (!j.completedAt) data.completedAt = today();
          if (!data.completedChairs) data.completedChairs = data.totalChairs;
        } else data.completedAt = "";
        if (data.status === "Scheduled" && data.completedChairs > 0) data.status = "In progress";
        D = Store.load();
        if (isNew) { data.id = Store.nextId(D, "JOB"); data.quoteId = j.quoteId; data.enquiryId = j.enquiryId; D.jobs.unshift(data); }
        else Object.assign(find("jobs", j.id), data);
        save(); closeDrawer(); render();
      });
  }

  /* ================= INVOICES ================= */
  function viewInvoices() {
    const F = filters.invoices;
    const st = ["Unpaid", "Partial", "Overdue", "Paid"];
    const counts = { All: D.invoices.length }; st.forEach((s) => (counts[s] = D.invoices.filter((i) => invStatus(i) === s).length));
    const list = D.invoices.filter((i) => (F.s === "All" || invStatus(i) === F.s) && matches(i, F.q));
    let sumT = 0, sumP = 0;
    const rows = list.map((i) => {
      const t = invTotal(i), p = invPaid(i); sumT += t; sumP += p;
      return `<tr><td><span class="ref">${esc(i.id)}</span><span class="sub">${esc(i.jobId || "")}</span></td><td>${fmtDate(i.date)}<span class="sub">due ${fmtDate(i.dueDate)}</span></td>
        <td><strong>${esc(custName(i.customer))}</strong><span class="sub">${esc(i.customer.phone)}</span></td>
        <td class="num">${money(t)}</td><td class="num">${money(p)}</td><td class="num">${money(Math.max(0, t - p))}</td><td>${pill(invStatus(i))}</td>
        <td>${i.nextServiceDate ? fmtDate(i.nextServiceDate) + (i.nextServiceDone ? " ✓" : "") : "—"}</td>
        <td class="actions">${invStatus(i) !== "Paid" ? `<button class="btn btn-teal btn-xs" data-act="inv-pay" data-id="${i.id}">Payment</button>` : ""}
          <button class="btn btn-outline btn-xs" data-act="inv-print" data-id="${i.id}">Print / PDF</button>
          <button class="btn btn-outline btn-xs" data-act="inv-edit" data-id="${i.id}">Open</button></td></tr>`;
    }).join("");
    const foot = list.length ? `<tfoot><tr><td colspan="3">Total (${list.length})</td><td class="num">${money(sumT)}</td><td class="num">${money(sumP)}</td><td class="num">${money(Math.max(0, sumT - sumP))}</td><td colspan="3"></td></tr></tfoot>` : "";
    return {
      actions: `<button class="btn btn-amber" data-act="inv-new">+ New invoice</button>`,
      html: `<div class="toolbar">${seg("invoices", ["All", ...st], counts)}${search("invoices", "Search customer, ref…")}</div>
        ${table(`<th>Ref</th><th>Date</th><th>Customer</th><th class="num">Amount</th><th class="num">Paid</th><th class="num">Balance</th><th>Status</th><th>Next service</th><th></th>`, rows, "No invoices. Complete a job, then click “Invoice”.", foot)}`
    };
  }
  function invForm(inv, fromJob) {
    const isNew = !inv;
    if (isNew) {
      const j = fromJob || {}, q = j.quoteId ? find("quotes", j.quoteId) : null;
      inv = { jobId: j.id || "", quoteId: j.quoteId || "", customer: j.customer || (q && q.customer) || {}, date: today(), dueDate: addDays(today(), 15),
        items: q ? JSON.parse(JSON.stringify(q.items)) : [], discount: q ? q.discount : 0, gstPct: q ? q.gstPct : D.settings.gstPct, payments: [],
        nextServiceDate: addDays(today(), 180) };
    }
    openDrawer(isNew ? "New invoice" : "Invoice " + inv.id, `<div class="form-grid">
        <label>Invoice date<input type="date" name="date" value="${esc(inv.date)}"></label>
        <label>Due date<input type="date" name="dueDate" value="${esc(inv.dueDate)}"></label>
        <label>Next service reminder<input type="date" name="nextServiceDate" value="${esc(inv.nextServiceDate)}"></label>
        <label>Linked job<input name="jobId" value="${esc(inv.jobId)}" readonly></label>
        ${custFields(inv.customer)}
        <label class="span-2">Customer GSTIN<input name="c_gstin" value="${esc(inv.customer.gstin)}"></label>
        ${itemsField(inv.items, inv.discount, inv.gstPct)}
      </div>`,
      `${!isNew ? `<button type="button" class="btn btn-outline left" style="color:#b0291b;border-color:#b0291b" data-act="inv-del" data-id="${inv.id}">Delete</button>` : ""}
       <button type="button" class="btn btn-outline" data-act="close">Cancel</button>
       <button class="btn btn-outline" type="submit" data-then="print">Save &amp; print</button>
       <button class="btn btn-teal" type="submit">Save invoice</button>`,
      (f) => {
        const data = {
          date: fv(f, "date"), dueDate: fv(f, "dueDate"), nextServiceDate: fv(f, "nextServiceDate"),
          customer: Object.assign(readCust(f), { gstin: fv(f, "c_gstin") }), items: readItems(), discount: num(fv(f, "discount")), gstPct: num(fv(f, "gstPct"))
        };
        if (!data.items.length) { alert("Add at least one line item."); return; }
        D = Store.load();
        let id = inv.id;
        if (isNew) { id = data.id = Store.nextId(D, "INV"); data.jobId = inv.jobId; data.quoteId = inv.quoteId; data.payments = []; D.invoices.unshift(data); }
        else Object.assign(find("invoices", id), data);
        save(); closeDrawer(); render();
        if (lastSubmitter === "print") printDoc("invoice", id);
      });
  }
  function payForm(id) {
    const inv = find("invoices", id), t = invTotal(inv), p = invPaid(inv);
    openDrawer("Payments · " + inv.id, `
      <dl class="dl"><dt>Customer</dt><dd>${esc(custName(inv.customer))}</dd><dt>Invoice total</dt><dd>${money(t)}</dd><dt>Paid</dt><dd>${money(p)}</dd><dt>Balance</dt><dd><strong>${money(Math.max(0, t - p))}</strong> ${pill(invStatus(inv))}</dd></dl>
      <table class="tbl" style="min-width:0;margin-bottom:18px"><thead><tr><th>Date</th><th>Mode</th><th>Reference</th><th class="num">Amount</th></tr></thead><tbody>
        ${(inv.payments || []).map((x) => `<tr><td>${fmtDate(x.date)}</td><td>${esc(x.mode)}</td><td>${esc(x.ref)}</td><td class="num">${money(x.amount)}</td></tr>`).join("") || `<tr class="empty-row"><td colspan="4">No payments yet.</td></tr>`}
      </tbody></table>
      <div class="form-grid cols-3">
        <div class="fs-title">Record a payment</div>
        <label>Date<input type="date" name="date" value="${today()}" required></label>
        <label>Amount (${CUR})<input type="number" name="amount" min="0.01" step="0.01" value="${Math.max(0, t - p).toFixed(2)}" required></label>
        <label>Mode<select name="mode"><option>UPI</option><option>Bank transfer</option><option>Cheque</option><option>Cash</option><option>Card</option></select></label>
        <label class="span-2">Reference / UTR / cheque no.<input name="ref"></label>
      </div>
      <p style="margin-top:14px"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waTo(inv.customer.phone, `Hello ${inv.customer.name}, a gentle reminder from ${D.settings.businessName}: invoice ${inv.id} has a balance of ${money(Math.max(0, t - p))}. Thank you!`)}">Send payment reminder on WhatsApp</a></p>`,
      `<button type="button" class="btn btn-outline" data-act="close">Close</button><button class="btn btn-teal" type="submit">Add payment</button>`,
      (f) => {
        D = Store.load();
        const i = find("invoices", id);
        i.payments = i.payments || [];
        i.payments.push({ date: fv(f, "date"), amount: num(fv(f, "amount")), mode: fv(f, "mode"), ref: fv(f, "ref") });
        save(); render(); payForm(id);
      });
  }

  /* ================= REPORTS ================= */
  function viewReports() {
    const months = [];
    const d = new Date(); d.setDate(1);
    for (let k = 0; k < 6; k++) { months.push(toISO(d).slice(0, 7)); d.setMonth(d.getMonth() - 1); }
    const mLabel = (m) => new Date(+m.slice(0, 4), +m.slice(5) - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    const monthRows = months.map((m) => {
      const enq = D.enquiries.filter((e) => monthKey(e.createdAt) === m).length;
      const qs = D.quotes.filter((q) => monthKey(q.date) === m);
      const qVal = qs.reduce((s, q) => s + totals(q.items, q.discount, q.gstPct).total, 0);
      const won = qs.filter((q) => q.status === "Approved").reduce((s, q) => s + totals(q.items, q.discount, q.gstPct).total, 0);
      const jobs = D.jobs.filter((j) => monthKey(j.completedAt) === m);
      const billed = D.invoices.filter((i) => monthKey(i.date) === m).reduce((s, i) => s + invTotal(i), 0);
      let col = 0; D.invoices.forEach((i) => (i.payments || []).forEach((p) => { if (monthKey(p.date) === m) col += num(p.amount); }));
      return `<tr><td>${mLabel(m)}</td><td class="num">${enq}</td><td class="num">${money(qVal)}</td><td class="num">${money(won)}</td><td class="num">${jobs.length}</td><td class="num">${jobs.reduce((s, j) => s + num(j.completedChairs), 0)}</td><td class="num">${money(billed)}</td><td class="num">${money(col)}</td></tr>`;
    }).join("");
    const groupBy = (arr, key) => arr.reduce((m, x) => { const k = x[key] || "—"; (m[k] = m[k] || []).push(x); return m; }, {});
    const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "—");
    const bySrc = groupBy(D.enquiries, "source"), bySvc = groupBy(D.enquiries, "service");
    const srcRows = Object.keys(bySrc).sort((a, b) => bySrc[b].length - bySrc[a].length).map((k) => { const l = bySrc[k], w = l.filter((e) => e.status === "Won").length; return `<tr><td>${esc(k)}</td><td class="num">${l.length}</td><td class="num">${w}</td><td class="num">${pct(w, l.length)}</td></tr>`; }).join("");
    const svcRows = Object.keys(bySvc).sort((a, b) => bySvc[b].length - bySvc[a].length).map((k) => { const l = bySvc[k]; return `<tr><td>${esc(k)}</td><td class="num">${l.length}</td><td class="num">${l.reduce((s, e) => s + num(e.quantity), 0)}</td><td class="num">${l.filter((e) => e.status === "Won").length}</td></tr>`; }).join("");
    const techRows = D.technicians.map((t) => { const js = D.jobs.filter((j) => (j.technicians || []).includes(t)); return `<tr><td>${esc(t)}</td><td class="num">${js.filter((j) => j.status !== "Completed").length}</td><td class="num">${js.filter((j) => j.status === "Completed").length}</td><td class="num">${js.reduce((s, j) => s + num(j.completedChairs), 0)}</td></tr>`; }).join("");
    const decided = D.quotes.filter((q) => q.status === "Approved" || q.status === "Rejected");
    const winRate = pct(decided.filter((q) => q.status === "Approved").length, decided.length);
    const totalEnq = D.enquiries.length, wonEnq = D.enquiries.filter((e) => e.status === "Won").length;
    return {
      actions: `<button class="btn btn-outline" data-act="print-page">Print report</button>`,
      html: `<div class="kpis">
          <div class="kpi"><span>Total enquiries</span><strong>${totalEnq}</strong></div>
          <div class="kpi"><span>Enquiry → won</span><strong>${pct(wonEnq, totalEnq)}</strong><small>${wonEnq} won</small></div>
          <div class="kpi"><span>Quote win rate</span><strong>${winRate}</strong><small>of decided quotes</small></div>
          <div class="kpi"><span>Chairs serviced (all time)</span><strong>${D.jobs.reduce((s, j) => s + (j.status === "Completed" ? num(j.completedChairs) : 0), 0)}</strong></div>
        </div>
        <section class="panel full" style="margin-bottom:18px"><header><h2>Monthly summary (last 6 months)</h2></header>
          <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Month</th><th class="num">Enquiries</th><th class="num">Quoted</th><th class="num">Approved</th><th class="num">Jobs done</th><th class="num">Chairs</th><th class="num">Billed</th><th class="num">Collected</th></tr></thead><tbody>${monthRows}</tbody></table></div></section>
        <div class="panels">
          <section class="panel"><header><h2>Enquiry sources</h2></header><table class="tbl" style="min-width:0"><thead><tr><th>Source</th><th class="num">Enquiries</th><th class="num">Won</th><th class="num">Conversion</th></tr></thead><tbody>${srcRows || `<tr class="empty-row"><td colspan="4">No data</td></tr>`}</tbody></table></section>
          <section class="panel"><header><h2>Services requested</h2></header><table class="tbl" style="min-width:0"><thead><tr><th>Service</th><th class="num">Enquiries</th><th class="num">Chairs</th><th class="num">Won</th></tr></thead><tbody>${svcRows || `<tr class="empty-row"><td colspan="4">No data</td></tr>`}</tbody></table></section>
          <section class="panel"><header><h2>Technician workload</h2></header><table class="tbl" style="min-width:0"><thead><tr><th>Technician</th><th class="num">Active jobs</th><th class="num">Completed</th><th class="num">Chairs done</th></tr></thead><tbody>${techRows || `<tr class="empty-row"><td colspan="4">No technicians</td></tr>`}</tbody></table></section>
        </div>`
    };
  }

  /* ================= SETTINGS ================= */
  function viewSettings() {
    const s = D.settings;
    return {
      actions: "",
      html: `<div class="settings-grid">
        <section class="panel"><header><h2>Business details (on quotations &amp; invoices)</h2></header><div>
          <form class="form-grid" id="set-biz">
            <label class="span-2">Business name<input name="businessName" value="${esc(s.businessName)}"></label>
            <label>Phone<input name="phone" value="${esc(s.phone)}"></label>
            <label class="span-2">Address<textarea name="address" rows="2">${esc(s.address)}</textarea></label>
            <label>GSTIN<input name="gstin" value="${esc(s.gstin)}"></label>
            <label>Default GST %<input name="gstPct" type="number" min="0" step="0.01" value="${esc(s.gstPct)}"></label>
            <label class="span-2">Bank / UPI details<textarea name="bank" rows="3">${esc(s.bank)}</textarea></label>
            <label class="span-2">Default quotation terms<textarea name="quoteTerms" rows="5">${esc(s.quoteTerms)}</textarea></label>
            <div class="span-2"><button class="btn btn-teal" type="button" data-act="set-save">Save details</button></div>
          </form></div></section>
        <div style="display:grid;gap:18px;align-content:start">
          <section class="panel"><header><h2>Technicians</h2></header><div>
            <label>One name per line<textarea id="set-tech" rows="6">${esc(D.technicians.join("\n"))}</textarea></label>
            <p style="margin-top:12px"><button class="btn btn-teal" data-act="tech-save">Save technicians</button></p></div></section>
          <section class="panel"><header><h2>Staff PIN</h2></header><div>
            <label>New PIN<input id="set-pin" type="password" inputmode="numeric" minlength="4" placeholder="At least 4 digits"></label>
            <p style="margin-top:12px"><button class="btn btn-teal" data-act="pin-save">Change PIN</button></p></div></section>
          <section class="panel"><header><h2>Data &amp; backup</h2></header><div>
            <p class="muted">All records are stored in this browser. Export a backup regularly.</p>
            <div class="btn-row"><button class="btn btn-outline" data-act="export">Export backup</button><label class="btn btn-outline" style="flex-direction:row;font-size:.9rem;color:var(--navy)">Import backup<input type="file" accept="application/json" hidden data-import></label>
            <button class="btn btn-outline" data-act="seed">Load demo data</button><button class="btn btn-outline" style="color:#b0291b;border-color:#b0291b" data-act="wipe">Delete all data</button></div></div></section>
        </div></div>`
    };
  }

  /* ================= PRINT DOCUMENTS ================= */
  function docHeader(type, rec, extra) {
    const s = D.settings;
    const logo = window.SITE && SITE.logoDark ? `<img class="doc-logo" src="${SITE.logoDark}" alt="${esc(s.businessName)}">` : "";
    return `<div class="doc-head"><div>${logo}<h1>${esc(s.businessName)}</h1><div style="white-space:pre-line">${esc(s.address)}</div><div>Phone / WhatsApp: ${esc(s.phone)}</div>${s.gstin ? `<div>GSTIN: ${esc(s.gstin)}</div>` : ""}</div>
      <div class="doc-type"><h2>${type}</h2><div><strong>No:</strong> ${esc(rec.id)}</div><div><strong>Date:</strong> ${fmtDate(rec.date)}</div>${extra || ""}</div></div>`;
  }
  function docItems(rec) {
    const t = totals(rec.items, rec.discount, rec.gstPct);
    return `<table><thead><tr><th style="width:40px">#</th><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>
      ${rec.items.map((it, i) => `<tr><td>${i + 1}</td><td>${esc(it.desc)}</td><td class="r">${num(it.qty)}</td><td class="r">${money(it.rate)}</td><td class="r">${money(num(it.qty) * num(it.rate))}</td></tr>`).join("")}</tbody></table>
      <table class="doc-totals"><tr><td>Subtotal</td><td class="r">${money(t.sub)}</td></tr>${t.disc ? `<tr><td>Discount</td><td class="r">− ${money(t.disc)}</td></tr>` : ""}
      ${num(rec.gstPct) ? `<tr><td>CGST ${num(rec.gstPct) / 2}%</td><td class="r">${money(t.tax / 2)}</td></tr><tr><td>SGST ${num(rec.gstPct) / 2}%</td><td class="r">${money(t.tax / 2)}</td></tr>` : ""}
      <tr class="grand"><td>Total</td><td class="r">${money(t.total)}</td></tr></table>`;
  }
  const billTo = (c, label) => `<div><h3>${label}</h3><strong>${esc(c.company || c.name)}</strong>${c.company ? `<div>Attn: ${esc(c.name)}</div>` : ""}<div style="white-space:pre-line">${esc(c.address)}</div><div>${esc(c.phone)}</div>${c.gstin ? `<div>GSTIN: ${esc(c.gstin)}</div>` : ""}</div>`;
  function printDoc(type, id) {
    D = Store.load();
    const s = D.settings;
    let html = "";
    if (type === "quote") {
      const q = find("quotes", id);
      html = `<div class="doc">${docHeader("Quotation", q, `<div><strong>Valid till:</strong> ${fmtDate(addDays(q.date, num(q.validDays)))}</div>`)}
        <div class="doc-parties">${billTo(q.customer, "Quotation for")}<div><h3>Subject</h3>Chair repair / cleaning / refurbishment services as per site inspection${q.inspectionId ? " (" + esc(q.inspectionId) + ")" : ""}.</div></div>
        ${docItems(q)}
        <div class="doc-foot"><div><h3>Terms &amp; conditions</h3><pre>${esc(q.terms)}</pre></div><div><h3>Payment details</h3><pre>${esc(s.bank)}</pre></div></div>
        <div class="doc-sign"><span>For ${esc(s.businessName)}</span></div></div>`;
    } else if (type === "invoice") {
      const inv = find("invoices", id), t = invTotal(inv), p = invPaid(inv);
      html = `<div class="doc">${docHeader("Tax Invoice", inv, `<div><strong>Due:</strong> ${fmtDate(inv.dueDate)}</div>${inv.jobId ? `<div><strong>Job:</strong> ${esc(inv.jobId)}</div>` : ""}`)}
        <div class="doc-parties">${billTo(inv.customer, "Bill to")}<div><h3>Status</h3>${invStatus(inv)}<br>Paid: ${money(p)}<br>Balance: <strong>${money(Math.max(0, t - p))}</strong></div></div>
        ${docItems(inv)}
        <div class="doc-foot"><div><h3>Payment details</h3><pre>${esc(s.bank)}</pre></div><div>${inv.nextServiceDate ? `<h3>Next recommended service</h3>${fmtDate(inv.nextServiceDate)}` : ""}</div></div>
        <div class="doc-sign"><span>For ${esc(s.businessName)}</span></div></div>`;
    } else if (type === "job") {
      const j = find("jobs", id);
      const n = Math.max(j.beforePhotos.length, j.afterPhotos.length);
      let pairs = "";
      for (let i = 0; i < n; i++) {
        pairs += `${j.beforePhotos[i] ? `<figure><img src="${j.beforePhotos[i]}" alt=""><figcaption>Before ${i + 1}</figcaption></figure>` : "<div></div>"}${j.afterPhotos[i] ? `<figure><img src="${j.afterPhotos[i]}" alt=""><figcaption>After ${i + 1}</figcaption></figure>` : "<div></div>"}`;
      }
      html = `<div class="doc">${docHeader("Service Report", { id: j.id, date: j.completedAt || j.scheduledDate })}
        <div class="doc-parties">${billTo(j.customer, "Customer")}<div><h3>Work done</h3>${esc(j.title)}<br>Chairs completed: <strong>${num(j.completedChairs)} / ${num(j.totalChairs)}</strong><br>Technicians: ${esc((j.technicians || []).join(", ") || "—")}<br>Status: ${esc(j.status)}</div></div>
        ${j.notes ? `<p><strong>Notes:</strong> ${esc(j.notes)}</p>` : ""}
        <h3 style="font-size:13px">Before / after photos</h3>${n ? `<div class="doc-photos">${pairs}</div>` : "<p>No photos added.</p>"}
        <div class="doc-sign"><span>Customer signature</span></div></div>`;
    }
    $("#print-area").innerHTML = html;
    document.body.classList.add("printing");
    setTimeout(() => { window.print(); document.body.classList.remove("printing"); }, 150);
  }

  /* ================= DEMO DATA ================= */
  function seedDemo() {
    if (D.enquiries.length && !confirm("Add demo records to your existing data?")) return;
    D = Store.load();
    const t = today(), mk = (p) => Store.nextId(D, p);
    const enq = (o) => Object.assign({ id: mk("ENQ"), createdAt: new Date(parseDate(o.d)).toISOString(), notes: [], photos: [], problems: [], chairTypes: [] }, o);
    const e1 = enq({ d: addDays(t, -40), name: "Priya Sharma", company: "Nimbus IT Services", phone: "9820012345", city: "Tech Park, Tower B", service: "Repair + Cleaning", quantity: 180, chairTypes: ["Mesh", "Revolving / office"], problems: ["Chair sinking (gas lift)", "Stains / dirty"], source: "Website", status: "Won", followUp: "" });
    const e2 = enq({ d: addDays(t, -12), name: "Rahul Mehta", company: "Greenfield College", phone: "9833312345", city: "College Road", service: "Chair Cleaning", quantity: 450, chairTypes: ["Auditorium"], source: "Referral", status: "Quoted", followUp: addDays(t, -1) });
    const e3 = enq({ d: addDays(t, -3), name: "Anita Desai", company: "CityCare Hospital", phone: "9811112345", city: "MG Road", service: "Repair + Cleaning", quantity: 120, chairTypes: ["Visitor", "Revolving / office"], source: "Phone", status: "Inspection", followUp: t });
    const e4 = enq({ d: addDays(t, -1), name: "Vikram Rao", company: "", phone: "9876500001", city: "Andheri", service: "Chair Repair", quantity: 6, chairTypes: ["Executive"], problems: ["Torn fabric / leather", "Foam worn out"], source: "Website", status: "New", followUp: t, message: "6 cabin chairs, leatherette peeling." });
    const e5 = enq({ d: t, name: "Sneha Kulkarni", company: "WorkHub Co-working", phone: "9867000002", service: "Callback request", quantity: 60, source: "Callback", status: "New", followUp: t, message: "Call time: Afternoon (12 - 4)" });
    const e6 = enq({ d: addDays(t, -20), name: "Arjun Nair", company: "Bluewave BPO", phone: "9845000003", city: "Sector 5", service: "Bulk Refurbishment", quantity: 300, source: "WhatsApp", status: "Won", followUp: "" });
    const e7 = enq({ d: addDays(t, -25), name: "Meera Iyer", company: "Iyer & Associates", phone: "9845000004", service: "Chair Repair", quantity: 10, source: "Website", status: "Lost", followUp: "" });
    D.enquiries.unshift(e5, e4, e3, e2, e6, e7, e1);
    D.inspections.unshift({ id: mk("INS"), enquiryId: e3.id, date: addDays(t, -1), inspector: D.technicians[0], recommendation: "Repair + Cleaning", customer: custFromEnq(e3), summary: "OPD and waiting area chairs. Access after 8 pm only.", photos: [],
      items: [{ type: "Visitor", qty: 80, cond: "Fair", work: "Cleaning + 12 seat covers" }, { type: "Revolving / office", qty: 40, cond: "Poor", work: "Gas lift + wheels" }] });
    const q1 = { id: mk("QT"), enquiryId: e1.id, date: addDays(t, -36), validDays: 15, status: "Approved", discount: 5000, gstPct: 18, terms: D.settings.quoteTerms, customer: custFromEnq(e1),
      items: [{ desc: "Gas lift replacement (class 3)", qty: 70, rate: 650 }, { desc: "Wheel set replacement (5 nos)", qty: 45, rate: 450 }, { desc: "Mesh chair cleaning", qty: 180, rate: 180 }] };
    const q2 = { id: mk("QT"), enquiryId: e2.id, date: addDays(t, -8), validDays: 15, status: "Sent", discount: 0, gstPct: 18, terms: D.settings.quoteTerms, customer: custFromEnq(e2),
      items: [{ desc: "Auditorium seat shampoo & extraction", qty: 450, rate: 140 }] };
    const q3 = { id: mk("QT"), enquiryId: e6.id, date: addDays(t, -17), validDays: 15, status: "Approved", discount: 10000, gstPct: 18, terms: D.settings.quoteTerms, customer: custFromEnq(e6),
      items: [{ desc: "Star base replacement", qty: 120, rate: 550 }, { desc: "Gas lift replacement (class 3)", qty: 300, rate: 600 }, { desc: "Wheel set replacement (5 nos)", qty: 300, rate: 400 }] };
    D.quotes.unshift(q2, q3, q1);
    const j1 = { id: mk("JOB"), quoteId: q1.id, enquiryId: e1.id, customer: q1.customer, title: "Gas lift, wheels & mesh cleaning, floors 3-5", totalChairs: 180, batchSize: 30, completedChairs: 180, scheduledDate: addDays(t, -30), endDate: addDays(t, -27), completedAt: addDays(t, -27), technicians: D.technicians.slice(0, 2), status: "Completed", beforePhotos: [], afterPhotos: [], notes: "Weekend work, security pass needed." };
    const j2 = { id: mk("JOB"), quoteId: q3.id, enquiryId: e6.id, customer: q3.customer, title: "Base, gas lift & wheels, 5 batches", totalChairs: 300, batchSize: 60, completedChairs: 120, scheduledDate: addDays(t, -4), endDate: addDays(t, 6), technicians: D.technicians.slice(1, 4), status: "In progress", beforePhotos: [], afterPhotos: [], notes: "Night shift floor first." };
    D.jobs.unshift(j2, j1);
    const inv1 = { id: mk("INV"), jobId: j1.id, quoteId: q1.id, customer: q1.customer, date: addDays(t, -26), dueDate: addDays(t, -11), items: q1.items, discount: q1.discount, gstPct: 18, nextServiceDate: addDays(t, 20), payments: [] };
    inv1.payments.push({ date: addDays(t, -20), amount: Math.round(invTotal(inv1) * 0.6), mode: "Bank transfer", ref: "UTR 4410" });
    D.invoices.unshift(inv1);
    save(); render();
  }

  /* ================= EVENTS ================= */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act, id = b.dataset.id;
    if (b.tagName === "A" && !b.getAttribute("href")) e.preventDefault();
    switch (act) {
      case "close": closeDrawer(); break;
      case "logout": sessionStorage.removeItem("cs_admin"); location.reload(); break;
      case "filter": filters[b.dataset.key].s = b.dataset.val; render(); break;
      case "ph-del": tmpPhotos[b.dataset.key].splice(+b.dataset.i, 1); $("#th-" + b.dataset.key).innerHTML = thumbsHtml(b.dataset.key); break;
      case "item-add": $("#items-body").insertAdjacentHTML("beforeend", itemRow({ desc: "", qty: 1, rate: 0 })); $("#items-body tr:last-child .it-desc").focus(); updateTotals(); break;
      case "item-del": b.closest("tr").remove(); updateTotals(); break;
      case "row-add": $("#in-body").insertAdjacentHTML("beforeend", insRow({ type: CHAIR_TYPES[0], qty: 0, cond: "Fair", work: "" })); break;
      case "row-del": b.closest("tr").remove(); break;
      case "enq-new": enqForm(); break;
      case "enq-view": enqView(id); break;
      case "enq-edit": enqForm(find("enquiries", id)); break;
      case "enq-del": if (confirm("Delete enquiry " + id + "?")) { D.enquiries = D.enquiries.filter((x) => x.id !== id); save(); closeDrawer(); render(); } break;
      case "fu-save": {
        const f = $("#fu-form"), en = find("enquiries", id);
        en.status = f.elements.status.value; en.followUp = f.elements.followUp.value;
        const note = f.elements.note.value.trim();
        if (note) (en.notes = en.notes || []).push({ at: new Date().toISOString(), text: note });
        save(); render(); enqView(id); break;
      }
      case "ins-new": insForm(null, id ? find("enquiries", id) : null); break;
      case "ins-edit": insForm(find("inspections", id)); break;
      case "ins-del": if (confirm("Delete inspection " + id + "?")) { D.inspections = D.inspections.filter((x) => x.id !== id); save(); closeDrawer(); render(); } break;
      case "ins-quote": {
        const ins = find("inspections", id);
        qtForm(null, { enquiryId: ins.enquiryId, inspectionId: ins.id, customer: ins.customer,
          items: (ins.items || []).map((x) => ({ desc: `${x.type} chairs - ${x.work || "repair / cleaning"}`, qty: x.qty, rate: 0 })) });
        break;
      }
      case "qt-new": {
        const en = id ? find("enquiries", id) : null;
        qtForm(null, en ? { enquiryId: en.id, customer: custFromEnq(en), items: [{ desc: `${en.service}${en.chairTypes && en.chairTypes.length ? " - " + en.chairTypes.join(", ") + " chairs" : ""}`, qty: en.quantity || 1, rate: 0 }] } : null);
        break;
      }
      case "qt-edit": qtForm(find("quotes", id)); break;
      case "qt-del": if (confirm("Delete quotation " + id + "?")) { D.quotes = D.quotes.filter((x) => x.id !== id); save(); closeDrawer(); render(); } break;
      case "qt-print": printDoc("quote", id); break;
      case "qt-job": jobForm(null, find("quotes", id)); break;
      case "job-new": jobForm(); break;
      case "job-edit": jobForm(find("jobs", id)); break;
      case "job-del": if (confirm("Delete job " + id + "?")) { D.jobs = D.jobs.filter((x) => x.id !== id); save(); closeDrawer(); render(); } break;
      case "job-report": printDoc("job", id); break;
      case "job-invoice": invForm(null, find("jobs", id)); break;
      case "inv-new": invForm(); break;
      case "inv-edit": invForm(find("invoices", id)); break;
      case "inv-del": if (confirm("Delete invoice " + id + "?")) { D.invoices = D.invoices.filter((x) => x.id !== id); save(); closeDrawer(); render(); } break;
      case "inv-pay": payForm(id); break;
      case "inv-print": printDoc("invoice", id); break;
      case "repeat-enq": {
        const inv = find("invoices", id), c = inv.customer;
        inv.nextServiceDone = true;
        const nid = Store.nextId(D, "ENQ");
        D.enquiries.unshift({ id: nid, createdAt: new Date().toISOString(), name: c.name, company: c.company, phone: c.phone, email: c.email, city: c.address,
          service: "Chair Cleaning", quantity: 0, chairTypes: [], problems: [], photos: [], notes: [{ at: new Date().toISOString(), text: "Repeat service from " + inv.id }],
          message: "Next scheduled service (repeat customer).", source: "Repeat", status: "Contacted", followUp: today() });
        save(); render(); enqView(nid); break;
      }
      case "set-save": {
        const f = $("#set-biz");
        ["businessName", "phone", "address", "gstin", "bank", "quoteTerms"].forEach((k) => (D.settings[k] = f.elements[k].value));
        D.settings.gstPct = num(f.elements.gstPct.value);
        save(); render(); alert("Saved."); break;
      }
      case "tech-save": D.technicians = $("#set-tech").value.split("\n").map((s) => s.trim()).filter(Boolean); save(); alert("Technicians saved."); break;
      case "pin-save": {
        const p = $("#set-pin").value.trim();
        if (p.length < 4) { alert("PIN must be at least 4 characters."); break; }
        D.settings.pin = p; save(); $("#set-pin").value = ""; alert("PIN changed."); break;
      }
      case "export": {
        const blob = new Blob([JSON.stringify(Store.load(), null, 2)], { type: "application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "chair-service-backup-" + today() + ".json"; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000); break;
      }
      case "seed": seedDemo(); break;
      case "wipe": if (confirm("Delete ALL enquiries, quotes, jobs and invoices? Export a backup first.") && confirm("Are you sure? This cannot be undone.")) { const keep = D.settings, tech = D.technicians; Store.reset(); D = Store.load(); D.settings = keep; D.technicians = tech; save(); render(); } break;
      case "print-page": window.print(); break;
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.change === "enq-status") { const en = find("enquiries", el.dataset.id); en.status = el.value; save(); render(); }
    if (el.dataset.photos) {
      const key = el.dataset.photos;
      Promise.all(Array.from(el.files).map((f) => Store.compressImage(f, 1000, 0.7))).then((urls) => {
        tmpPhotos[key] = tmpPhotos[key].concat(urls); $("#th-" + key).innerHTML = thumbsHtml(key);
      });
      el.value = "";
    }
    if (el.dataset.preset !== undefined && el.value) {
      const body = $("#items-body"), blank = $$(".it-row", body).find((r) => !$(".it-desc", r).value.trim());
      if (blank) $(".it-desc", blank).value = el.value; else body.insertAdjacentHTML("beforeend", itemRow({ desc: el.value, qty: 1, rate: 0 }));
      el.value = ""; updateTotals();
    }
    if (el.dataset.import !== undefined && el.files[0]) {
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data.enquiries || !data.settings) throw new Error("bad");
          if (confirm("Replace all current data with this backup?")) { Store.save(data); render(); alert("Backup restored."); }
        } catch (err) { alert("This file is not a valid backup."); }
      };
      r.readAsText(el.files[0]);
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.dataset.calc !== undefined) updateTotals();
    if (e.target.dataset.search) { filters[e.target.dataset.search].q = e.target.value; render(true); }
  });

  /* Start: show the panel if already logged in this session, else the PIN screen */
  if (sessionStorage.getItem("cs_admin") === "1") showApp(); else loginEl.hidden = false;
})();
