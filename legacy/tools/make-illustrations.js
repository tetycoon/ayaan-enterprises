/* ==========================================================
   Generates on-brand vector illustrations for every image slot
   on the website:  node tools/make-illustrations.js
   Output: images/<name>.svg. The site shows images/<name>.jpg
   when a real photo exists, otherwise this illustration.
   ========================================================== */
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "..", "images");

const C = { navy: "#10233a", navy2: "#1b3550", navy3: "#24486b", teal: "#13a38b", tealL: "#5fd8c4", amber: "#f5a524", frame: "#26313d", wheel: "#1a222c", skin: "#c68a5e", skin2: "#8d5a3b" };

function rng(seed) {
  let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
let R = Math.random;
const rr = (a, b) => a + R() * (b - a);

const DEFS = `<defs>
<pattern id="mesh" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H9M0 0V9" stroke="rgba(0,0,0,.3)" stroke-width="2"/></pattern>
<pattern id="weave" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3H6M3 0V6" stroke="rgba(0,0,0,.09)" stroke-width="1"/></pattern>
<linearGradient id="chromeG" x1="0" x2="1"><stop offset="0" stop-color="#8f9ba7"/><stop offset=".45" stop-color="#f3f7fa"/><stop offset="1" stop-color="#7f8b97"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#dbe5ee"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd9e2"/><stop offset="1" stop-color="#b8c6d2"/></linearGradient>
<linearGradient id="win" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3f3fb"/><stop offset="1" stop-color="#b9dcec"/></linearGradient>
<radialGradient id="studio" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe7ee"/></radialGradient>
<radialGradient id="dark" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#22476b"/><stop offset="1" stop-color="#0c1c2f"/></radialGradient>
<radialGradient id="tealGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(95,216,196,.45)"/><stop offset="1" stop-color="rgba(95,216,196,0)"/></radialGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99a6b"/><stop offset="1" stop-color="#a87a4f"/></linearGradient>
<filter id="blur"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#10233a" flood-opacity=".18"/></filter>
</defs>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;

/* ---------- backgrounds ---------- */
function office(w, h, o = {}) {
  const fy = h * (o.floor || 0.72);
  let g = `<rect width="${w}" height="${h}" fill="${o.wall || "url(#wall)"}"/>`;
  const n = o.windows == null ? 3 : o.windows;
  for (let i = 0; i < n; i++) {
    const ww = w * 0.17, x = w * 0.07 + i * w * 0.22, y = h * 0.09, wh = fy - h * 0.25;
    g += `<rect x="${x}" y="${y}" width="${ww}" height="${wh}" rx="6" fill="url(#win)" stroke="#fff" stroke-width="8"/><path d="M${x + ww / 2} ${y}V${y + wh}M${x} ${y + wh / 2}H${x + ww}" stroke="#fff" stroke-width="5"/>`;
  }
  g += `<rect y="${fy}" width="${w}" height="${h - fy}" fill="url(#floor)"/><rect y="${fy}" width="${w}" height="6" fill="#aebdca"/>`;
  if (o.plant !== false) g += plant(w * 0.93, fy + 10, h / 900);
  if (o.dim) g += `<rect width="${w}" height="${h}" fill="#6b5a45" opacity=".14"/>`;
  return g;
}
function studio(w, h, dark) {
  return `<rect width="${w}" height="${h}" fill="url(#${dark ? "dark" : "studio"})"/>` +
    (dark ? `<ellipse cx="${w / 2}" cy="${h * 0.5}" rx="${w * 0.38}" ry="${h * 0.38}" fill="url(#tealGlow)"/>` : "");
}
function plant(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-150" rx="34" ry="70" fill="#3e8e6a" transform="rotate(-25 0 -150)"/><ellipse cx="0" cy="-160" rx="30" ry="80" fill="#58a97f" transform="rotate(18 0 -160)"/><ellipse cx="0" cy="-120" rx="26" ry="56" fill="#2f7656"/><path d="M-36 -80H36L28 0H-28Z" fill="#f2f5f8" stroke="#cfd9e2" stroke-width="3"/></g>`;
}

/* ---------- office chair (local box 300 x 440, anchor = bottom centre) ---------- */
function chair(o) {
  const s = o.s || 1, type = o.type || "office";
  const seat = o.seat || "#1f4a72", back = o.back || (type === "mesh" ? C.teal : seat);
  const frame = o.frame || C.frame, metal = o.broken ? "#8a7d6a" : "url(#chromeG)";
  let g = `<ellipse cx="150" cy="434" rx="145" ry="13" fill="rgba(10,25,40,.18)"/>`;
  const ends = [[28, 418], [272, 418], [92, 428], [208, 428], [150, 410]];
  ends.forEach(([ex, ey]) => (g += `<path d="M150 392L${ex} ${ey - 10}" stroke="${o.broken ? "#5b5148" : frame}" stroke-width="14" stroke-linecap="round"/>`));
  ends.forEach(([ex, ey], i) => { if (o.broken && i === 1) return; g += `<circle cx="${ex}" cy="${ey}" r="13" fill="${C.wheel}"/><circle cx="${ex}" cy="${ey}" r="5" fill="#59636e"/>`; });
  if (o.broken) g += `<circle cx="300" cy="432" r="13" fill="${C.wheel}"/><path d="M64 398l9-7-5-5 10-6" stroke="#f3e2c0" stroke-width="3" fill="none"/>`;
  g += `<rect x="134" y="378" width="32" height="20" rx="5" fill="${frame}"/>`;
  g += `<rect x="141" y="${o.broken ? 322 : 296}" width="18" height="${o.broken ? 60 : 86}" fill="${metal}"/>`;
  g += `<rect x="136" y="340" width="28" height="44" rx="4" fill="${frame}"/>`;
  g += `<rect x="100" y="282" width="100" height="16" rx="5" fill="${frame}"/><rect x="196" y="286" width="34" height="6" rx="3" fill="#8c98a4"/>`;
  g += `<rect x="140" y="212" width="20" height="76" rx="6" fill="${frame}"/>`;
  const by = type === "exec" ? 8 : 44, bh = type === "exec" ? 214 : 180;
  if (type === "mesh" || o.headrest) {
    g += `<rect x="146" y="22" width="8" height="26" fill="${frame}"/><rect x="92" y="0" width="116" height="38" rx="17" fill="${frame}"/><rect x="99" y="5" width="102" height="28" rx="13" fill="${back}"/>`;
    if (type === "mesh") g += `<rect x="99" y="5" width="102" height="28" rx="13" fill="url(#mesh)"/>`;
  }
  g += `<rect x="55" y="${by}" width="190" height="${bh}" rx="48" fill="${frame}"/>`;
  g += `<rect x="65" y="${by + 10}" width="170" height="${bh - 20}" rx="40" fill="${back}"/>`;
  if (type === "mesh") g += `<rect x="65" y="${by + 10}" width="170" height="${bh - 20}" rx="40" fill="url(#mesh)"/><rect x="100" y="${by + 120}" width="100" height="14" rx="7" fill="${o.dirty ? "#9b8a5a" : C.amber}"/>`;
  else if (type === "exec") { for (let i = 0; i < 4; i++) g += `<path d="M78 ${by + 52 + i * 40}H222" stroke="rgba(0,0,0,.35)" stroke-width="3"/>`; }
  else g += `<rect x="65" y="${by + 10}" width="170" height="${bh - 20}" rx="40" fill="url(#weave)"/><rect x="78" y="${by + 22}" width="144" height="${bh - 44}" rx="32" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2" stroke-dasharray="6 5"/>`;
  g += `<rect x="82" y="${by + 22}" width="34" height="${bh - 70}" rx="17" fill="rgba(255,255,255,${type === "exec" ? 0.16 : 0.1})"/>`;
  g += `<rect x="26" y="196" width="14" height="70" rx="4" fill="${frame}"/><rect x="6" y="186" width="52" height="16" rx="8" fill="${C.wheel}"/>`;
  g += `<rect x="260" y="196" width="14" height="70" rx="4" fill="${frame}"/><rect x="242" y="186" width="52" height="16" rx="8" fill="${C.wheel}"/>`;
  g += `<rect x="34" y="236" width="232" height="56" rx="28" fill="${seat}"/><rect x="34" y="236" width="232" height="56" rx="28" fill="url(#weave)"/>`;
  g += `<rect x="34" y="266" width="232" height="26" rx="13" fill="rgba(0,0,0,.18)"/><rect x="62" y="243" width="120" height="9" rx="4.5" fill="rgba(255,255,255,.2)"/>`;
  if (o.dirty) {
    g += `<rect x="65" y="${by + 10}" width="170" height="${bh - 20}" rx="40" fill="#7d6b52" opacity=".22"/><rect x="34" y="236" width="232" height="56" rx="28" fill="#7d6b52" opacity=".25"/>`;
    for (let i = 0; i < 12; i++) {
      const onSeat = i < 6;
      const cx = onSeat ? rr(60, 240) : rr(85, 215), cy = onSeat ? rr(246, 282) : rr(by + 30, by + bh - 30);
      g += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rr(7, 22).toFixed(1)}" ry="${rr(4, onSeat ? 9 : 14).toFixed(1)}" fill="#5a3d22" opacity="${rr(0.22, 0.45).toFixed(2)}"/>`;
    }
  }
  if (o.torn) {
    g += `<path d="M112 ${by + 70}l22-9 13 12 19-7 9 21-15 15-23-4-19 9-10-18z" fill="#ead08c" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`;
    g += `<path d="M70 252l18-6 10 9 16-4 4 14-14 9-20-2z" fill="#ead08c" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`;
  }
  const inner = o.broken ? `<g transform="rotate(-5 150 440)">${g}</g>` : g;
  const fx = o.flip ? -1 : 1;
  return `<g transform="translate(${o.x} ${o.y}) scale(${s * fx} ${s}) translate(-150 -440)">${inner}</g>`;
}
/* cantilever visitor chair (local 300 x 440) */
function visitor(o) {
  const s = o.s || 1, col = o.color || C.navy3;
  let g = `<ellipse cx="150" cy="434" rx="130" ry="11" fill="rgba(10,25,40,.16)"/>`;
  g += `<path d="M78 300L58 428H118M222 300L242 428H182" stroke="url(#chromeG)" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  g += `<path d="M84 240V110M216 240V110" stroke="url(#chromeG)" stroke-width="9" stroke-linecap="round"/>`;
  g += `<rect x="70" y="92" width="160" height="150" rx="34" fill="${col}"/><rect x="70" y="92" width="160" height="150" rx="34" fill="url(#weave)"/><rect x="88" y="108" width="30" height="110" rx="15" fill="rgba(255,255,255,.12)"/>`;
  g += `<rect x="52" y="258" width="196" height="48" rx="22" fill="${col}"/><rect x="52" y="282" width="196" height="24" rx="12" fill="rgba(0,0,0,.18)"/>`;
  if (o.dirty) { g += `<rect x="70" y="92" width="160" height="150" rx="34" fill="#7d6b52" opacity=".25"/>`; for (let i = 0; i < 7; i++) g += `<ellipse cx="${rr(85, 215).toFixed(1)}" cy="${rr(110, 290).toFixed(1)}" rx="${rr(6, 18).toFixed(1)}" ry="${rr(4, 10).toFixed(1)}" fill="#5a3d22" opacity=".35"/>`; }
  if (o.torn) g += `<path d="M120 140l20-8 12 11 17-6 8 18-14 13-21-3-16 8-9-16z" fill="#ead08c" stroke="rgba(0,0,0,.35)" stroke-width="2"/>`;
  return `<g transform="translate(${o.x} ${o.y}) scale(${s}) translate(-150 -440)">${g}</g>`;
}
/* auditorium / waiting row seat (local 200 x 320) */
function audSeat(x, y, s, col, o = {}) {
  let g = `<rect x="0" y="120" width="22" height="200" rx="8" fill="#3b2f2a"/><rect x="178" y="120" width="22" height="200" rx="8" fill="#3b2f2a"/>`;
  g += `<rect x="24" y="10" width="152" height="200" rx="30" fill="${col}"/><rect x="24" y="10" width="152" height="200" rx="30" fill="url(#weave)"/><rect x="40" y="26" width="26" height="150" rx="13" fill="rgba(255,255,255,.14)"/>`;
  g += `<rect x="26" y="200" width="148" height="56" rx="18" fill="${col}"/><rect x="26" y="230" width="148" height="26" rx="12" fill="rgba(0,0,0,.2)"/>`;
  if (o.dirty) { g += `<rect x="24" y="10" width="152" height="246" rx="30" fill="#6b5a45" opacity=".28"/>`; for (let i = 0; i < 6; i++) g += `<ellipse cx="${rr(40, 160).toFixed(1)}" cy="${rr(30, 240).toFixed(1)}" rx="${rr(6, 18).toFixed(1)}" ry="${rr(4, 12).toFixed(1)}" fill="#3d2814" opacity=".35"/>`; }
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(-100 -320)">${g}</g>`;
}

/* ---------- people & props ---------- */
function tech(o) {
  const s = o.s || 1, fx = o.flip ? -1 : 1, skin = o.skin || C.skin;
  let g = `<ellipse cx="90" cy="436" rx="70" ry="10" fill="rgba(10,25,40,.18)"/>`;
  g += `<rect x="58" y="270" width="26" height="160" rx="11" fill="${C.navy2}"/><rect x="92" y="270" width="26" height="160" rx="11" fill="${C.navy2}"/>`;
  g += `<rect x="50" y="420" width="38" height="15" rx="7" fill="#11161c"/><rect x="88" y="420" width="38" height="15" rx="7" fill="#11161c"/>`;
  g += `<rect x="78" y="112" width="24" height="26" fill="${skin}"/>`;
  g += `<rect x="46" y="128" width="88" height="166" rx="28" fill="${C.navy3}"/><rect x="46" y="204" width="88" height="11" fill="${C.teal}"/><rect x="98" y="150" width="24" height="16" rx="3" fill="${C.amber}"/>`;
  g += `<circle cx="90" cy="90" r="32" fill="${skin}"/><path d="M58 86a32 32 0 0 1 64 0z" fill="${C.navy}"/><rect x="88" y="78" width="44" height="9" rx="4.5" fill="${C.amber}"/>`;
  g += `<rect x="26" y="140" width="24" height="122" rx="12" fill="${C.navy3}"/><circle cx="38" cy="266" r="12" fill="${skin}"/>`;
  g += `<path d="M124 152L178 214" stroke="${C.navy3}" stroke-width="24" stroke-linecap="round"/><circle cx="184" cy="220" r="12" fill="${skin}"/>`;
  const t = o.tool;
  if (t === "wrench") g += `<g transform="translate(184 220) rotate(-30)"><rect x="-7" y="-78" width="14" height="86" rx="6" fill="url(#chromeG)"/><path d="M-20-86a20 20 0 1 1 40 0h-10v-10h-20v10z" fill="#c9d3dc"/></g>`;
  if (t === "tablet") g += `<g transform="translate(176 158) rotate(8)"><rect width="78" height="100" rx="9" fill="${C.wheel}"/><rect x="6" y="7" width="66" height="86" rx="4" fill="#e9f8f5"/><rect x="12" y="14" width="54" height="8" rx="3" fill="${C.teal}"/><rect x="12" y="30" width="24" height="20" rx="3" fill="#cfd9e2"/><rect x="42" y="30" width="24" height="20" rx="3" fill="${C.tealL}"/><rect x="12" y="58" width="54" height="5" rx="2.5" fill="#b9c7d3"/><rect x="12" y="70" width="38" height="5" rx="2.5" fill="#b9c7d3"/></g>`;
  if (t === "clipboard") g += `<g transform="translate(172 150) rotate(6)"><rect width="80" height="108" rx="7" fill="#a5774a"/><rect x="7" y="12" width="66" height="90" rx="3" fill="#fff"/><rect x="26" y="2" width="28" height="14" rx="4" fill="#8c98a4"/>${[0, 1, 2, 3].map((i) => `<path d="M14 ${30 + i * 18}l5 5 9-10" stroke="${C.teal}" stroke-width="3" fill="none"/><rect x="34" y="${28 + i * 18}" width="32" height="5" rx="2.5" fill="#cfd9e2"/>`).join("")}</g>`;
  if (t === "wand") g += `<path d="M184 220L292 340" stroke="#2b3644" stroke-width="11" stroke-linecap="round"/><rect x="262" y="330" width="70" height="20" rx="8" fill="${C.teal}" transform="rotate(42 297 340)"/>${bubbles(320, 330, 6, 1)}`;
  return `<g transform="translate(${o.x} ${o.y}) scale(${s * fx} ${s}) translate(-90 -440)">${g}</g>`;
}
function sparkle(x, y, r, col) { return `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${col || "#fff"}"/>`; }
function sparkles(list, col) { return list.map(([x, y, r]) => sparkle(x, y, r, col || "#ffffff")).join(""); }
function bubbles(x, y, n, s = 1) { let g = ""; for (let i = 0; i < n; i++) { const r = rr(6, 18) * s; g += `<circle cx="${(x + rr(-60, 60) * s).toFixed(1)}" cy="${(y + rr(-60, 40) * s).toFixed(1)}" r="${r.toFixed(1)}" fill="rgba(255,255,255,.55)" stroke="rgba(19,163,139,.6)" stroke-width="2"/>`; } return g; }
function toolbox(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="95" ry="10" fill="rgba(10,25,40,.18)"/><rect x="-35" y="-118" width="70" height="26" rx="10" fill="none" stroke="#3b4652" stroke-width="10"/><rect x="-85" y="-96" width="170" height="96" rx="10" fill="#d9534f"/><rect x="-85" y="-62" width="170" height="10" fill="#b8423f"/><rect x="-14" y="-70" width="28" height="22" rx="4" fill="#c9d3dc"/><rect x="-60" y="-130" width="10" height="44" rx="4" fill="url(#chromeG)" transform="rotate(-12)"/></g>`; }
function badge(x, y, r, icon) {
  const ic = {
    cross: `<path d="M-14-40h28v26h26v28h-26v26h-28v-26h-26v-28h26z" fill="#e5484d"/>`,
    cap: `<path d="M0-34L56-10 0 14-56-10z" fill="${C.navy}"/><path d="M-32 2v22c0 10 64 10 64 0V2L0 14z" fill="${C.navy2}"/><path d="M48-6v32" stroke="${C.amber}" stroke-width="5"/><circle cx="48" cy="30" r="6" fill="${C.amber}"/>`,
    headset: `<path d="M-38 10v-12a38 38 0 0 1 76 0v12" stroke="${C.navy}" stroke-width="9" fill="none"/><rect x="-48" y="-4" width="20" height="34" rx="8" fill="${C.teal}"/><rect x="28" y="-4" width="20" height="34" rx="8" fill="${C.teal}"/><path d="M38 30q0 18-26 18" stroke="${C.navy}" stroke-width="5" fill="none"/><circle cx="10" cy="48" r="7" fill="${C.amber}"/>`,
    columns: `<path d="M-50-14L0-44 50-14z" fill="${C.navy}"/>${[-34, -12, 12, 34].map((cx) => `<rect x="${cx - 6}" y="-10" width="12" height="44" fill="${C.navy2}"/>`).join("")}<rect x="-54" y="34" width="108" height="10" fill="${C.navy}"/>`,
    laptop: `<rect x="-42" y="-34" width="84" height="56" rx="6" fill="${C.navy}"/><rect x="-34" y="-27" width="68" height="42" rx="3" fill="${C.tealL}"/><path d="M-56 26h112l-8 12h-96z" fill="${C.navy2}"/>`,
    cup: `<path d="M-34-20h56v34a28 28 0 0 1-56 0z" fill="${C.teal}"/><path d="M22-10a16 16 0 0 1 0 32" stroke="${C.teal}" stroke-width="8" fill="none"/><path d="M-20-44q8 10 0 18M-2-44q8 10 0 18" stroke="${C.amber}" stroke-width="5" fill="none" stroke-linecap="round"/>`
  }[icon];
  return `<g transform="translate(${x} ${y})" filter="url(#shadow)"><circle r="${r}" fill="#fff"/><circle r="${r - 8}" fill="none" stroke="${C.tealL}" stroke-width="4"/><g transform="scale(${r / 75})">${ic}</g></g>`;
}
function desk(x, y, w, s = 1, monitor = true, headset = false) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="${w}" height="16" rx="4" fill="#f7f9fb" stroke="#cfd9e2" stroke-width="2"/><rect x="10" y="16" width="10" height="130" fill="#9aa6b2"/><rect x="${w - 20}" y="16" width="10" height="130" fill="#9aa6b2"/>`;
  if (monitor) g += `<rect x="${w / 2 - 70}" y="-104" width="140" height="88" rx="6" fill="${C.wheel}"/><rect x="${w / 2 - 63}" y="-97" width="126" height="74" rx="3" fill="#2c5a80"/><rect x="${w / 2 - 6}" y="-16" width="12" height="16" fill="#59636e"/>`;
  if (headset) g += `<path d="M${w / 2 + 90} -12a18 18 0 0 1 36 0" stroke="${C.navy}" stroke-width="5" fill="none"/><rect x="${w / 2 + 84}" y="-14" width="10" height="14" rx="3" fill="${C.teal}"/><rect x="${w / 2 + 122}" y="-14" width="10" height="14" rx="3" fill="${C.teal}"/>`;
  return g + "</g>";
}
function calendar(x, y, s) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#shadow)"><rect width="190" height="170" rx="14" fill="#fff"/><rect width="190" height="40" rx="14" fill="${C.teal}"/><rect y="26" width="190" height="14" fill="${C.teal}"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const hl = (r === 1 && c === 2) || (r === 3 && c === 4);
    g += `<rect x="${14 + c * 28}" y="${54 + r * 27}" width="22" height="20" rx="4" fill="${hl ? C.amber : "#e6edf3"}"/>`;
  }
  return g + `<path d="M74 76l6 6 12-12" stroke="#fff" stroke-width="3" fill="none"/></g>`;
}
function clipboardBig(x, y, s, n = 6) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#shadow)"><rect width="360" height="470" rx="22" fill="#a5774a"/><rect x="24" y="44" width="312" height="404" rx="8" fill="#fff"/><rect x="120" y="14" width="120" height="50" rx="12" fill="#8c98a4"/><rect x="134" y="24" width="92" height="12" rx="6" fill="#c9d3dc"/>`;
  g += `<rect x="52" y="84" width="180" height="16" rx="8" fill="${C.navy}"/>`;
  for (let i = 0; i < n; i++) {
    const yy = 130 + i * 50, done = i < n - 1;
    g += `<rect x="52" y="${yy}" width="30" height="30" rx="7" fill="${done ? C.teal : "#fff"}" stroke="${C.teal}" stroke-width="3"/>${done ? `<path d="M59 ${yy + 15}l6 7 12-14" stroke="#fff" stroke-width="4" fill="none"/>` : ""}<rect x="98" y="${yy + 8}" width="${rr(140, 200).toFixed(0)}" height="12" rx="6" fill="#cfd9e2"/>`;
  }
  return g + `</g>`;
}
function phone(x, y, s) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#shadow)"><rect width="260" height="520" rx="36" fill="${C.wheel}"/><rect x="12" y="14" width="236" height="492" rx="28" fill="#ece5dd"/><rect x="12" y="14" width="236" height="66" rx="28" fill="#075e54"/><rect x="12" y="52" width="236" height="28" fill="#075e54"/><circle cx="50" cy="48" r="16" fill="${C.tealL}"/><rect x="76" y="40" width="100" height="10" rx="5" fill="rgba(255,255,255,.8)"/>`;
  g += `<rect x="100" y="100" width="134" height="150" rx="12" fill="#dcf8c6"/><rect x="108" y="108" width="118" height="110" rx="8" fill="#dfe7ee"/>`;
  g += chair({ x: 167, y: 214, s: 0.22, type: "office", seat: "#7d7a72", back: "#7d7a72", dirty: true });
  g += `<rect x="110" y="226" width="80" height="8" rx="4" fill="#9fc29a"/>`;
  g += `<rect x="26" y="266" width="160" height="56" rx="12" fill="#fff"/><rect x="38" y="280" width="120" height="8" rx="4" fill="#cfd9e2"/><rect x="38" y="298" width="80" height="8" rx="4" fill="#cfd9e2"/>`;
  g += `<rect x="90" y="338" width="144" height="56" rx="12" fill="#dcf8c6"/><rect x="102" y="352" width="110" height="8" rx="4" fill="#9fc29a"/><rect x="102" y="370" width="70" height="8" rx="4" fill="#9fc29a"/>`;
  g += `<rect x="26" y="410" width="170" height="40" rx="12" fill="#fff"/><rect x="38" y="426" width="100" height="8" rx="4" fill="#cfd9e2"/>`;
  g += `<rect x="24" y="462" width="170" height="34" rx="17" fill="#fff"/><circle cx="222" cy="479" r="18" fill="#25d366"/>`;
  return g + `</g>`;
}
function sprayBottle(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="60" ry="9" fill="rgba(10,25,40,.18)"/><path d="M-46 0V-150q0-24 24-30h44q24 6 24 30V0z" fill="${C.teal}"/><rect x="-30" y="-130" width="60" height="80" rx="8" fill="#fff" opacity=".85"/><rect x="-20" y="-112" width="40" height="8" rx="4" fill="${C.tealL}"/><rect x="-20" y="-96" width="28" height="6" rx="3" fill="#cfd9e2"/><rect x="-16" y="-206" width="32" height="28" fill="${C.navy}"/><path d="M-30-206h80l10 16H-30z" fill="${C.navy2}"/><path d="M-6-178q-14 20 -2 34" stroke="${C.navy}" stroke-width="8" fill="none"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${80 + i * 14}" cy="${-198 + (i % 2 ? -8 : 8) * (i / 2)}" r="${5 - i * 0.5}" fill="rgba(19,163,139,.5)"/>`).join("")}</g>`;
}

/* ---------- spare parts ---------- */
const gasLift = (x, y, s, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-9" y="-260" width="18" height="110" fill="url(#chromeG)"/><rect x="-26" y="-160" width="52" height="150" rx="6" fill="${C.wheel}"/><rect x="-26" y="-160" width="52" height="14" fill="#3b4652"/><rect x="-28" y="-20" width="56" height="14" rx="4" fill="${C.amber}"/><path d="M-20-6h40l-10 40h-20z" fill="#3b4652"/></g>`;
const castor = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="44" rx="56" ry="8" fill="rgba(10,25,40,.16)"/><rect x="-6" y="-58" width="12" height="40" fill="url(#chromeG)"/><path d="M-38-22h76v18h-76z" fill="#3b4652"/><circle cx="-18" cy="10" r="32" fill="${C.wheel}"/><circle cx="18" cy="10" r="32" fill="#2b3644"/><circle cx="18" cy="10" r="12" fill="#59636e"/></g>`;
function starBase(x, y, s) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><circle r="250" fill="rgba(10,25,40,.06)"/>`;
  for (let i = 0; i < 5; i++) g += `<g transform="rotate(${i * 72 - 90})"><rect x="0" y="-22" width="220" height="44" rx="18" fill="url(#chromeG)"/><circle cx="214" cy="0" r="26" fill="${C.wheel}"/></g>`;
  return g + `<circle r="60" fill="#3b4652"/><circle r="30" fill="url(#chromeG)"/></g>`;
}
const mechanism = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="90" rx="240" ry="20" fill="rgba(10,25,40,.14)"/><path d="M-200-40h400l-30 80h-340z" fill="#2b3644"/><rect x="-170" y="-60" width="340" height="30" rx="10" fill="#3b4652"/><circle cx="0" cy="10" r="38" fill="${C.wheel}"/><circle cx="0" cy="10" r="16" fill="url(#chromeG)"/><rect x="190" y="-14" width="150" height="16" rx="8" fill="url(#chromeG)"/><circle cx="342" cy="-6" r="18" fill="${C.wheel}"/><rect x="-60" y="40" width="120" height="40" rx="8" fill="#3b4652"/></g>`;
const armrest = (x, y, s, f = 1) => `<g transform="translate(${x} ${y}) scale(${s * f} ${s})"><ellipse cx="20" cy="250" rx="140" ry="14" fill="rgba(10,25,40,.14)"/><rect x="-80" y="-30" width="210" height="44" rx="22" fill="${C.wheel}"/><rect x="-6" y="10" width="40" height="190" rx="10" fill="#2b3644"/><rect x="-6" y="190" width="170" height="34" rx="10" fill="#2b3644"/><rect x="40" y="60" width="12" height="40" rx="6" fill="${C.amber}"/></g>`;
function foamSwatches(x, y, s) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-300" y="-150" width="420" height="300" rx="70" fill="#f2d488"/><rect x="-300" y="60" width="420" height="90" rx="45" fill="#dcbc68"/>`;
  for (let i = 0; i < 18; i++) g += `<circle cx="${rr(-260, 80).toFixed(0)}" cy="${rr(-120, 50).toFixed(0)}" r="${rr(3, 7).toFixed(1)}" fill="#d9b55e"/>`;
  [["#1f4a72", -10], [C.teal, 6], ["#6b7785", 18], ["#1d2127", 30]].forEach(([c, r], i) =>
    (g += `<g transform="translate(${180 + i * 20} ${-110 + i * 60}) rotate(${r})" filter="url(#shadow)"><rect width="200" height="140" rx="10" fill="${c}"/><rect width="200" height="140" rx="10" fill="url(#weave)"/></g>`));
  return g + `</g>`;
}

/* ---------- scene compositions ---------- */
const S169 = [1600, 1000], S43 = [1200, 900], S11 = [1000, 1000], S34 = [900, 1200];
const SPK = (w, h) => sparkles([[w * 0.78, h * 0.18, 22], [w * 0.86, h * 0.3, 12], [w * 0.2, h * 0.22, 16]], C.amber);
const scenes = {
  // ---------- home ----------
  "hero-chair": [S11, (w, h) => studio(w, h, true) + `<ellipse cx="500" cy="905" rx="300" ry="30" fill="rgba(95,216,196,.18)"/>` + chair({ x: 500, y: 900, s: 1.85, type: "mesh", seat: "#1f4a72" }) + sparkles([[790, 220, 26], [840, 330, 14], [210, 300, 18]], C.tealL)],
  "service-repair": [S43, (w, h) => office(w, h) + tech({ x: 360, y: 830, s: 1.4, tool: "wrench" }) + chair({ x: 790, y: 820, s: 1.25 }) + gasLift(1040, 820, 0.7, 12) + SPK(w, h)],
  "service-cleaning": [S43, (w, h) => office(w, h) + tech({ x: 330, y: 830, s: 1.4, tool: "wand", skin: C.skin2 }) + chair({ x: 790, y: 820, s: 1.25, seat: "#2f5f8f", back: "#2f5f8f" }) + bubbles(760, 520, 9, 1.4) + sparkles([[920, 300, 22], [640, 360, 14]])],
  "service-bulk": [S43, (w, h) => office(w, h, { windows: 3 }) + [0, 1, 2, 3, 4].map((i) => chair({ x: 170 + i * 215, y: 660, s: 0.6, type: i % 2 ? "office" : "mesh" })).join("") + [0, 1, 2, 3].map((i) => chair({ x: 260 + i * 230, y: 860, s: 0.82, type: i % 2 ? "mesh" : "office" })).join("") + SPK(w, h)],
  "service-amc": [S43, (w, h) => office(w, h) + tech({ x: 330, y: 830, s: 1.4, tool: "clipboard" }) + chair({ x: 720, y: 820, s: 1.15, type: "mesh" }) + calendar(900, 120, 1.15)],
  "why-us-team": [S43, (w, h) => office(w, h) + chair({ x: 520, y: 820, s: 0.95 }) + chair({ x: 740, y: 830, s: 0.95, type: "mesh" }) + tech({ x: 250, y: 840, s: 1.35, tool: "wrench" }) + tech({ x: 990, y: 840, s: 1.35, tool: "tablet", flip: true, skin: C.skin2 }) + toolbox(620, 880, 0.75)],
  "product-spare-parts": [S11, (w, h) => studio(w, h) + starBase(330, 330, 0.95) + gasLift(760, 520, 1.15, 25) + [0, 1, 2].map((i) => castor(220 + i * 150, 760, 0.95)).join("") + armrest(700, 760, 0.7)],
  // ---------- before / after ----------
  "work-1-before": [S43, (w, h) => { R = rng("w1"); return office(w, h, { dim: true }) + chair({ x: 600, y: 860, s: 1.55, seat: "#6b6156", back: "#6b6156", dirty: true }); }],
  "work-1-after": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 860, s: 1.55, seat: "#5d6b7a", back: "#5d6b7a" }) + sparkles([[850, 240, 26], [900, 360, 14], [330, 300, 18]])],
  "work-2-before": [S43, (w, h) => { R = rng("w2"); return office(w, h, { dim: true }) + chair({ x: 600, y: 860, s: 1.5, type: "exec", seat: "#3a342f", back: "#3a342f", frame: "#2a2420", dirty: true }); }],
  "work-2-after": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 860, s: 1.5, type: "exec", seat: "#1d2127", back: "#1d2127", frame: "#111" }) + sparkles([[860, 220, 26], [910, 340, 14], [330, 280, 18]])],
  "work-3-before": [S43, (w, h) => { R = rng("w3"); return office(w, h, { dim: true, floor: 0.6 }) + chair({ x: 600, y: 880, s: 2.6, seat: "#5b544c", back: "#5b544c", broken: true, dirty: true }); }],
  "work-3-after": [S43, (w, h) => office(w, h, { floor: 0.6 }) + chair({ x: 600, y: 880, s: 2.6, seat: "#1f4a72" }) + sparkles([[260, 700, 26], [960, 640, 18], [880, 780, 12]])],
  "work-4-before": [S43, (w, h) => { R = rng("w4"); return office(w, h, { dim: true }) + chair({ x: 600, y: 860, s: 1.5, type: "mesh", seat: "#5d5a52", back: "#77756c", dirty: true }); }],
  "work-4-after": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 860, s: 1.5, type: "mesh", seat: "#26313d", back: "#3b4652" }) + sparkles([[870, 230, 26], [920, 350, 14], [320, 300, 18]])],
  "work-5-before": [S43, (w, h) => { R = rng("w5"); return `<rect width="${w}" height="${h}" fill="#3a3330"/><rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="#2a2420"/>` + [0, 1, 2, 3, 4].map((i) => audSeat(160 + i * 220, 820, 1.35, "#8e6d66", { dirty: true })).join(""); }],
  "work-5-after": [S43, (w, h) => `<rect width="${w}" height="${h}" fill="#3a3330"/><rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="#2a2420"/>` + [0, 1, 2, 3, 4].map((i) => audSeat(160 + i * 220, 820, 1.35, "#c0392b")).join("") + sparkles([[260, 200, 22], [700, 160, 16], [1000, 240, 20]])],
  "work-6-before": [S43, (w, h) => { R = rng("w6"); return office(w, h, { dim: true, wall: "#dfe9e6" }) + `<rect x="120" y="800" width="960" height="18" rx="9" fill="#8a8f94"/>` + [0, 1, 2].map((i) => visitor({ x: 290 + i * 310, y: 830, s: 1.1, color: "#8b9aa8", dirty: true, torn: i === 1 })).join(""); }],
  "work-6-after": [S43, (w, h) => office(w, h, { wall: "#e6f2ef" }) + `<rect x="120" y="800" width="960" height="18" rx="9" fill="url(#chromeG)"/>` + [0, 1, 2].map((i) => visitor({ x: 290 + i * 310, y: 830, s: 1.1, color: "#2f6fb0" })).join("") + sparkles([[200, 240, 22], [1000, 200, 18]])],
  // ---------- repair page ----------
  "page-repair": [S169, (w, h) => office(w, h) + tech({ x: 520, y: 900, s: 1.5, tool: "wrench" }) + chair({ x: 960, y: 890, s: 1.4 }) + badgeIcon(1330, 250, gasLift(0, 60, 0.32)) + badgeIcon(1400, 450, castor(0, 0, 0.6)) + badgeIcon(1300, 640, starBase(0, 0, 0.17)) + sparkles([[240, 220, 22]], C.amber)],
  "repair-onsite": [S43, (w, h) => { R = rng("ro"); return office(w, h) + chair({ x: 560, y: 830, s: 1.2, seat: "#4f5a66", broken: true }) + toolbox(250, 850, 0.9) + castor(880, 850, 0.6) + gasLift(1000, 860, 0.55, 70) + tech({ x: 1040, y: 840, s: 1.3, tool: "wrench", flip: true, skin: C.skin2 }); }],
  "repair-parts": [S43, (w, h) => studio(w, h) + starBase(330, 360, 0.9) + gasLift(760, 560, 1.0, 20) + gasLift(900, 560, 1.0, 28) + mechanism(860, 760, 0.55) + [0, 1, 2].map((i) => castor(200 + i * 140, 780, 0.8)).join("")],
  "faq-repair": [S43, (w, h) => office(w, h) + chair({ x: 760, y: 820, s: 1.2 }) + toolbox(330, 850, 1.1) + badgeIcon(980, 220, gasLift(0, 60, 0.3)) + sparkles([[560, 220, 22]], C.amber)],
  // ---------- cleaning page ----------
  "page-cleaning": [S169, (w, h) => office(w, h) + tech({ x: 470, y: 900, s: 1.5, tool: "wand", skin: C.skin2 }) + chair({ x: 990, y: 890, s: 1.4, seat: "#2f5f8f", back: "#2f5f8f" }) + bubbles(960, 560, 12, 1.5) + sprayBottle(1360, 900, 1.1) + sparkles([[1180, 260, 26], [760, 300, 16]])],
  "cleaning-before": [S43, (w, h) => { R = rng("cl"); return office(w, h, { dim: true }) + chair({ x: 600, y: 1420, s: 2.6, seat: "#5d6670", back: "#5d6670", dirty: true }); }],
  "cleaning-after": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 1420, s: 2.6, seat: "#2f5f8f", back: "#2f5f8f" }) + sparkles([[200, 220, 26], [1000, 260, 20], [960, 420, 12]])],
  "clean-fabric": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 850, s: 1.45, seat: "#2f5f8f", back: "#2f5f8f" }) + bubbles(600, 560, 10, 1.4) + sprayBottle(950, 860, 0.9)],
  "clean-mesh": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 850, s: 1.45, type: "mesh", seat: "#26313d", back: "#3b4652" }) + sparkles([[870, 240, 26], [920, 360, 14], [330, 300, 18]])],
  "clean-leather": [S43, (w, h) => office(w, h) + chair({ x: 600, y: 850, s: 1.4, type: "exec", seat: "#4a2f22", back: "#4a2f22", frame: "#2a1c14" }) + sparkles([[860, 220, 26], [330, 300, 18], [900, 380, 12]])],
  "clean-auditorium": [S43, (w, h) => `<rect width="${w}" height="${h}" fill="#3a3330"/><rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="#2a2420"/>` + [0, 1, 2, 3, 4].map((i) => audSeat(160 + i * 220, 820, 1.35, i === 2 ? "#c0392b" : "#a8463a")).join("") + bubbles(600, 380, 8, 1.3)],
  "faq-cleaning": [S43, (w, h) => office(w, h) + chair({ x: 720, y: 830, s: 1.25, type: "mesh" }) + sprayBottle(330, 860, 1.3) + bubbles(700, 520, 8, 1.3)],
  // ---------- bulk page ----------
  "page-bulk": [S169, (w, h) => office(w, h, { floor: 0.55 }) + [0, 1, 2, 3, 4, 5, 6].map((i) => chair({ x: 200 + i * 200, y: 640, s: 0.48, type: i % 2 ? "office" : "mesh" })).join("") + [0, 1, 2, 3, 4, 5].map((i) => chair({ x: 260 + i * 220, y: 790, s: 0.64, type: i % 2 ? "mesh" : "office" })).join("") + [0, 1, 2, 3, 4].map((i) => chair({ x: 300 + i * 250, y: 980, s: 0.82, type: i % 2 ? "office" : "mesh" })).join("")],
  "industry-corporate": [S169, (w, h) => office(w, h) + desk(180, 690, 560) + desk(860, 690, 560) + chair({ x: 460, y: 900, s: 0.85, type: "mesh" }) + chair({ x: 1140, y: 900, s: 0.85, type: "mesh" }) + badge(1400, 200, 90, "laptop")],
  "industry-education": [S169, (w, h) => office(w, h, { windows: 1, wall: "#f3efe6" }) + `<rect x="560" y="110" width="760" height="330" rx="10" fill="#2f5d46" stroke="#a87a4f" stroke-width="14"/>` + [0, 1, 2, 3, 4].map((i) => visitor({ x: 240 + i * 290, y: 930, s: 0.85, color: C.navy3 })).join("") + badge(1440, 600, 85, "cap")],
  "industry-hospital": [S169, (w, h) => office(w, h, { wall: "#e8f4f1" }) + `<g transform="translate(800 260)"><circle r="80" fill="#fff"/><path d="M-18-50h36v32h32v36h-32v32h-36v-32h-32v-36h32z" fill="#e5484d"/></g><rect x="200" y="850" width="1200" height="18" rx="9" fill="url(#chromeG)"/>` + [0, 1, 2, 3].map((i) => visitor({ x: 350 + i * 300, y: 880, s: 1.0, color: "#2f6fb0" })).join("") + badge(1420, 200, 80, "cross")],
  "industry-callcentre": [S169, (w, h) => office(w, h) + desk(120, 690, 420, 1, true, true) + desk(590, 690, 420, 1, true, true) + desk(1060, 690, 420, 1, true, true) + [0, 1, 2].map((i) => chair({ x: 330 + i * 470, y: 910, s: 0.78 })).join("") + badge(1440, 190, 85, "headset")],
  "industry-coworking": [S169, (w, h) => office(w, h, { wall: "#f5efe8", plant: false }) + plant(120, 740, 1.4) + plant(1500, 740, 1.6) + `<rect x="420" y="660" width="760" height="22" rx="8" fill="url(#wood)"/><rect x="460" y="682" width="14" height="130" fill="#8c6a4a"/><rect x="1126" y="682" width="14" height="130" fill="#8c6a4a"/>` + chair({ x: 560, y: 920, s: 0.8, type: "mesh", back: C.amber }) + chair({ x: 1040, y: 920, s: 0.8, type: "mesh" }) + badge(800, 260, 85, "cup")],
  "industry-government": [S169, (w, h) => office(w, h, { wall: "#efe9e0", windows: 2 }) + `<rect x="430" y="640" width="740" height="36" rx="6" fill="url(#wood)"/><rect x="460" y="676" width="680" height="160" fill="#8c6a4a"/>` + chair({ x: 800, y: 660, s: 0.9, type: "exec", seat: "#1d2127", back: "#1d2127", frame: "#111" }) + badge(1400, 220, 85, "columns")],
  "bulk-report": [S43, (w, h) => `<rect width="${w}" height="${h}" fill="url(#wood)"/>` + `<g transform="translate(760 140) rotate(6)" filter="url(#shadow)"><rect width="340" height="440" rx="6" fill="#fff"/><rect x="30" y="34" width="150" height="16" rx="8" fill="${C.navy}"/><rect x="30" y="64" width="100" height="10" rx="5" fill="#cfd9e2"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="30" y="${110 + i * 40}" width="280" height="12" rx="6" fill="#e6edf3"/>`).join("")}<rect x="170" y="330" width="140" height="22" rx="6" fill="${C.amber}"/><path d="M30 400h120" stroke="${C.navy}" stroke-width="2"/></g>` +
    `<g transform="translate(110 150) rotate(-4)" filter="url(#shadow)"><rect width="600" height="440" rx="30" fill="${C.wheel}"/><rect x="22" y="22" width="556" height="396" rx="12" fill="#f1f5f8"/>${[0, 1].map((r) => [0, 1, 2].map((c) => `<rect x="${44 + c * 178}" y="${44 + r * 186}" width="160" height="170" rx="10" fill="${(c + r) % 2 ? "#e9f8f5" : "#ece7e1"}"/>` + chair({ x: 124 + c * 178, y: 200 + r * 186, s: 0.3, seat: (c + r) % 2 ? "#1f4a72" : "#6b6156", back: (c + r) % 2 ? "#1f4a72" : "#6b6156", dirty: !((c + r) % 2) })).join("")).join("")}</g>` +
    `<rect x="980" y="640" width="180" height="16" rx="8" fill="${C.navy}" transform="rotate(-30 1070 648)"/>`],
  // ---------- AMC ----------
  "page-amc": [S169, (w, h) => office(w, h) + tech({ x: 470, y: 900, s: 1.5, tool: "clipboard" }) + chair({ x: 880, y: 890, s: 1.2, type: "mesh" }) + chair({ x: 1180, y: 890, s: 1.0 }) + calendar(1240, 110, 1.3)],
  "amc-visit": [S43, (w, h) => office(w, h) + `<g filter="url(#blur)" opacity=".7">${[0, 1, 2, 3].map((i) => chair({ x: 180 + i * 280, y: 820, s: 0.9, type: i % 2 ? "mesh" : "office" })).join("")}</g>` + clipboardBig(420, 150, 1.25)],
  // ---------- products ----------
  "page-products": [S169, (w, h) => studio(w, h) + `<rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="#e3eaf0"/>` + [[260, "mesh"], [620, "office"], [980, "exec"]].map(([x, t]) => `<ellipse cx="${x}" cy="900" rx="170" ry="26" fill="#cfd9e2"/>` + chair({ x, y: 890, s: 1.15, type: t, seat: t === "exec" ? "#1d2127" : t === "office" ? "#4f5f72" : "#26313d", back: t === "exec" ? "#1d2127" : t === "office" ? "#4f5f72" : "#3b4652", frame: t === "exec" ? "#111" : C.frame })).join("") + `<ellipse cx="1340" cy="900" rx="170" ry="26" fill="#cfd9e2"/>` + visitor({ x: 1340, y: 890, s: 1.15, color: C.teal })],
  "product-mesh-chair": [S11, (w, h) => studio(w, h) + chair({ x: 500, y: 900, s: 1.8, type: "mesh", seat: "#26313d", back: "#3b4652" })],
  "product-office-chair": [S11, (w, h) => studio(w, h) + chair({ x: 500, y: 890, s: 1.85, seat: "#4f5f72", back: "#4f5f72" })],
  "product-executive-chair": [S11, (w, h) => studio(w, h) + chair({ x: 500, y: 900, s: 1.75, type: "exec", seat: "#1d2127", back: "#1d2127", frame: "#111" })],
  "product-visitor-chair": [S11, (w, h) => studio(w, h) + visitor({ x: 320, y: 860, s: 1.25, color: C.navy3 }) + visitor({ x: 690, y: 880, s: 1.25, color: C.teal })],
  "part-gas-lift": [S43, (w, h) => studio(w, h) + gasLift(560, 760, 2.0, 12) + gasLift(760, 740, 1.6, 22)],
  "part-wheels": [S43, (w, h) => studio(w, h) + [[300, 420], [600, 400], [900, 420], [440, 680], [760, 680]].map(([x, y]) => castor(x, y, 1.5)).join("")],
  "part-base": [S43, (w, h) => studio(w, h) + starBase(600, 450, 1.35)],
  "part-mechanism": [S43, (w, h) => studio(w, h) + mechanism(560, 470, 1.3)],
  "part-armrest": [S43, (w, h) => studio(w, h) + armrest(380, 380, 1.3) + armrest(820, 380, 1.3, -1)],
  "part-foam-fabric": [S43, (w, h) => studio(w, h) + foamSwatches(560, 450, 1.25)],
  // ---------- work page ----------
  "page-work": [S169, (w, h) => office(w, h) + [0, 1, 2, 3, 4].map((i) => chair({ x: 260 + i * 270, y: 900, s: 0.9, type: i % 2 ? "office" : "mesh" }) + `<rect x="${140 + i * 270}" y="500" width="240" height="410" rx="40" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.7)" stroke-width="3"/>`).join("") + sparkles([[240, 200, 26], [1380, 220, 22], [800, 160, 16]], C.amber)],
  // ---------- quote page ----------
  "quote-side": [S43, (w, h) => office(w, h) + phone(170, 130, 1.25) + chair({ x: 820, y: 830, s: 1.15, seat: "#6b6156", back: "#6b6156", dirty: true }) + `<path d="M540 330q120-80 200 20" stroke="${C.amber}" stroke-width="6" fill="none" stroke-dasharray="12 10"/><circle cx="740" cy="350" r="10" fill="${C.amber}"/>`]
};
function badgeIcon(x, y, inner) { return `<g transform="translate(${x} ${y})" filter="url(#shadow)"><circle r="88" fill="#fff"/><circle r="80" fill="none" stroke="${C.tealL}" stroke-width="4"/>${inner}</g>`; }

let n = 0;
for (const [name, [[w, h], fn]] of Object.entries(scenes)) {
  R = rng(name);
  fs.writeFileSync(path.join(OUT, name + ".svg"), svg(w, h, fn(w, h)));
  n++;
}
console.log("Wrote " + n + " illustrations to images/");
