/* ==========================================================
   3D hero: an office chair assembles from scattered parts
   (repair), a scan ring sweeps over it and the worn fabric
   turns fresh (cleaning), then it idles - draggable to rotate.
   Needs three.js r128 (loaded from cdnjs before this file).
   ========================================================== */
(function () {
  var stage = document.getElementById("hero3d");
  if (!stage) return;
  var statusEl = document.getElementById("hero3d-status");
  var replayBtn = document.getElementById("hero3d-replay");

  function fallback() { stage.classList.add("no-webgl"); }
  if (!window.THREE) return fallback();
  try {
    var test = document.createElement("canvas");
    if (!(test.getContext("webgl") || test.getContext("experimental-webgl"))) return fallback();
  } catch (e) { return fallback(); }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- renderer / scene / camera ---------- */
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  var camBase = new THREE.Vector3(0, 3.4, 11.5);
  var lookAt = new THREE.Vector3(0, 2.05, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x1b3550, 0.85));
  var key = new THREE.DirectionalLight(0xfff4e0, 1.25);
  key.position.set(5, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 6; key.shadow.camera.bottom = -2;
  key.shadow.radius = 4;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x5fd8c4, 1.1);
  rim.position.set(-6, 5, -6);
  scene.add(rim);
  var fill = new THREE.PointLight(0xf5a524, 0.5, 20);
  fill.position.set(4, 1, 4);
  scene.add(fill);

  /* ---------- textures made in code (no image files needed) ---------- */
  function canvasTex(size, draw, rep) {
    var c = document.createElement("canvas"); c.width = c.height = size;
    draw(c.getContext("2d"), size);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rep, rep);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }
  var meshTex = canvasTex(128, function (g, s) {
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, s, s);
    g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3;
    for (var i = -s; i < s * 2; i += 16) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + s, s); g.stroke();
      g.beginPath(); g.moveTo(i, s); g.lineTo(i + s, 0); g.stroke();
    }
  }, 2.2);
  var fabricTex = canvasTex(128, function (g, s) {
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, s, s);
    for (var i = 0; i < 2200; i++) {
      g.fillStyle = "rgba(0,0,0," + (Math.random() * 0.12) + ")";
      g.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
  }, 1.5);
  var shadowTex = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    gr.addColorStop(0, "rgba(8,20,35,0.55)"); gr.addColorStop(1, "rgba(8,20,35,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();

  /* ---------- materials ---------- */
  var DIRTY_SEAT = new THREE.Color(0x6b6156), CLEAN_SEAT = new THREE.Color(0x1f4a72);
  var DIRTY_BACK = new THREE.Color(0x7a7366), CLEAN_BACK = new THREE.Color(0x13a38b);
  var M = {
    seat: new THREE.MeshStandardMaterial({ color: DIRTY_SEAT.clone(), roughness: 0.92, map: fabricTex }),
    back: new THREE.MeshStandardMaterial({ color: DIRTY_BACK.clone(), roughness: 0.75, map: meshTex }),
    frame: new THREE.MeshStandardMaterial({ color: 0x1a222c, roughness: 0.45, metalness: 0.2 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xc9d3dc, roughness: 0.22, metalness: 0.95 }),
    wheel: new THREE.MeshStandardMaterial({ color: 0x111418, roughness: 0.5 }),
    accent: new THREE.MeshStandardMaterial({ color: 0xf5a524, roughness: 0.4, metalness: 0.3, emissive: 0x3a2500 })
  };

  function roundedRect(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function slab(w, h, depth, r, bevel, mat) {
    var g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
      depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 10
    });
    g.center();
    var m = new THREE.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  function box(w, h, d, mat) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = true; return m; }
  function cyl(rt, rb, h, mat, seg) { var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 24), mat); m.castShadow = true; return m; }

  /* ---------- build chair as separate parts ---------- */
  var chair = new THREE.Group();
  scene.add(chair);
  var parts = []; // {obj, to:{p,r}, from:{p,r}, delay}

  function addPart(obj, pos, delay) {
    obj.position.copy(pos);
    chair.add(obj);
    var dir = new THREE.Vector3(pos.x, 0, pos.z);
    if (dir.lengthSq() < 0.01) dir.set(Math.random() - 0.5, 0, Math.random() - 0.5);
    dir.normalize().multiplyScalar(3 + Math.random() * 2.5);
    parts.push({
      obj: obj,
      to: { p: pos.clone(), r: obj.rotation.clone() },
      from: {
        p: new THREE.Vector3(pos.x + dir.x, pos.y + 2.5 + Math.random() * 3, pos.z + dir.z),
        r: new THREE.Euler(obj.rotation.x + (Math.random() - 0.5) * 4, obj.rotation.y + (Math.random() - 0.5) * 4, obj.rotation.z + (Math.random() - 0.5) * 4)
      },
      delay: delay
    });
  }

  // Five-star base: hub + legs + casters
  var hub = cyl(0.24, 0.3, 0.3, M.frame); addPart(hub, new THREE.Vector3(0, 0.46, 0), 0);
  for (var i = 0; i < 5; i++) {
    var a = (i / 5) * Math.PI * 2 + 0.3;
    var leg = new THREE.Group();
    var bar = box(1.45, 0.13, 0.24, M.frame); bar.position.x = 0.72; bar.rotation.z = -0.1; leg.add(bar);
    var cap = box(0.16, 0.16, 0.26, M.chrome); cap.position.set(1.42, -0.12, 0); leg.add(cap);
    leg.rotation.y = a;
    addPart(leg, new THREE.Vector3(0, 0.43, 0), 0.05 + i * 0.05);

    var caster = new THREE.Group();
    var w1 = cyl(0.14, 0.14, 0.09, M.wheel); w1.rotation.x = Math.PI / 2; w1.position.z = -0.06; caster.add(w1);
    var w2 = w1.clone(); w2.position.z = 0.06; caster.add(w2);
    var stem = cyl(0.04, 0.04, 0.16, M.chrome); stem.position.y = 0.16; caster.add(stem);
    caster.rotation.y = -a + Math.PI / 2;
    addPart(caster, new THREE.Vector3(Math.cos(a) * 1.42, 0.14, -Math.sin(a) * 1.42), 0.3 + i * 0.05);
  }
  // Gas lift
  var gas = new THREE.Group();
  var sleeve = cyl(0.15, 0.15, 0.55, M.frame); sleeve.position.y = -0.2; gas.add(sleeve);
  var piston = cyl(0.1, 0.1, 0.6, M.chrome); piston.position.y = 0.3; gas.add(piston);
  var ring = cyl(0.17, 0.17, 0.05, M.accent); ring.position.y = 0.08; gas.add(ring);
  addPart(gas, new THREE.Vector3(0, 0.95, 0), 0.6);
  // Tilt mechanism
  var mech = box(0.95, 0.14, 0.75, M.frame); addPart(mech, new THREE.Vector3(0, 1.47, 0.05), 0.75);
  var lever = box(0.5, 0.05, 0.05, M.chrome); lever.rotation.y = 0.3; addPart(lever, new THREE.Vector3(0.62, 1.44, 0.25), 0.8);
  // Seat cushion
  var seat = slab(1.95, 1.85, 0.22, 0.42, 0.08, M.seat); seat.rotation.x = -Math.PI / 2;
  addPart(seat, new THREE.Vector3(0, 1.7, 0.08), 0.9);
  // Back support spine
  var spine = new THREE.Group();
  var sp1 = box(0.3, 0.12, 0.85, M.frame); sp1.position.set(0, 0, 0.3); spine.add(sp1);
  var sp2 = box(0.3, 1.25, 0.12, M.frame); sp2.position.set(0, 0.6, -0.1); sp2.rotation.x = -0.1; spine.add(sp2);
  addPart(spine, new THREE.Vector3(0, 1.5, -0.95), 1.05);
  // Mesh backrest (frame + mesh panel)
  var backG = new THREE.Group();
  var bFrame = slab(1.85, 2.05, 0.08, 0.5, 0.05, M.frame); backG.add(bFrame);
  var bMesh = slab(1.62, 1.82, 0.04, 0.42, 0.02, M.back); bMesh.position.z = 0.07; backG.add(bMesh);
  var lumbar = slab(1.2, 0.25, 0.06, 0.12, 0.03, M.accent); lumbar.position.set(0, -0.45, 0.13); backG.add(lumbar);
  backG.rotation.x = -0.12;
  addPart(backG, new THREE.Vector3(0, 3.0, -1.0), 1.2);
  // Headrest
  var head = slab(1.05, 0.45, 0.1, 0.2, 0.05, M.back);
  head.rotation.x = -0.2;
  addPart(head, new THREE.Vector3(0, 4.35, -1.18), 1.4);
  var headPost = box(0.12, 0.35, 0.06, M.frame); headPost.rotation.x = -0.15;
  addPart(headPost, new THREE.Vector3(0, 4.05, -1.15), 1.35);
  // Armrests
  [-1, 1].forEach(function (s, k) {
    var arm = new THREE.Group();
    var post = box(0.12, 0.62, 0.2, M.frame); post.position.y = -0.3; arm.add(post);
    var base = box(0.1, 0.1, 0.6, M.frame); base.position.set(-0.04 * s, -0.6, -0.1); arm.add(base);
    var pad = slab(0.26, 0.85, 0.07, 0.1, 0.03, M.wheel); pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.02, 0.02); arm.add(pad);
    addPart(arm, new THREE.Vector3(1.08 * s, 2.25, 0.05), 1.5 + k * 0.08);
  });

  // Ground shadow + platform ring
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5.5), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = 0.005;
  scene.add(ground);
  var shadowCatcher = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.18 }));
  shadowCatcher.rotation.x = -Math.PI / 2; shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);
  var platform = new THREE.Mesh(new THREE.RingGeometry(2.1, 2.14, 96), new THREE.MeshBasicMaterial({ color: 0x5fd8c4, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  platform.rotation.x = -Math.PI / 2; platform.position.y = 0.01;
  scene.add(platform);
  var platform2 = new THREE.Mesh(new THREE.RingGeometry(2.45, 2.47, 96, 1, 0, Math.PI * 1.3), new THREE.MeshBasicMaterial({ color: 0xf5a524, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
  platform2.rotation.x = -Math.PI / 2; platform2.position.y = 0.01;
  scene.add(platform2);

  // Cleaning scan ring
  var scan = new THREE.Group();
  var scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.025, 8, 96), new THREE.MeshBasicMaterial({ color: 0x5fd8c4, transparent: true, opacity: 0 }));
  scanRing.rotation.x = Math.PI / 2;
  var scanDisc = new THREE.Mesh(new THREE.CircleGeometry(1.75, 64), new THREE.MeshBasicMaterial({ color: 0x5fd8c4, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  scanDisc.rotation.x = -Math.PI / 2;
  scan.add(scanRing, scanDisc);
  scene.add(scan);

  // Orbiting wrench
  var wrench = new THREE.Group();
  var wHandle = box(0.9, 0.12, 0.05, M.chrome); wrench.add(wHandle);
  var wHead = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.06, 10, 24, Math.PI * 1.55), M.chrome);
  wHead.position.x = 0.55; wHead.rotation.z = Math.PI * 0.72; wrench.add(wHead);
  var wHead2 = wHead.clone(); wHead2.position.x = -0.55; wHead2.rotation.z = -Math.PI * 0.28; wrench.add(wHead2);
  wrench.scale.setScalar(0.85);
  scene.add(wrench);

  // Sparkle particles
  var PCOUNT = 160, pGeo = new THREE.BufferGeometry(), pPos = new Float32Array(PCOUNT * 3), pSpeed = [];
  for (var p = 0; p < PCOUNT; p++) {
    var ang = Math.random() * Math.PI * 2, rad = 1 + Math.random() * 2.6;
    pPos[p * 3] = Math.cos(ang) * rad; pPos[p * 3 + 1] = Math.random() * 5; pPos[p * 3 + 2] = Math.sin(ang) * rad;
    pSpeed.push(0.003 + Math.random() * 0.008);
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  var sparkTex = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.6)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  var pMat = new THREE.PointsMaterial({ size: 0.12, map: sparkTex, color: 0x9ff0e3, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending });
  var sparks = new THREE.Points(pGeo, pMat);
  scene.add(sparks);

  /* ---------- timeline ---------- */
  var ASSEMBLE = 2.6, PART_DUR = 0.95;
  var SCAN_START = ASSEMBLE + 0.2, SCAN_DUR = 2.2, CHAIR_TOP = 4.7;
  var t0 = performance.now(), lastNow = t0, phase = "";
  var seatClean = 0, backClean = 0, autoSpin = 0;

  function easeOutBack(x) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function easeInOut(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }

  function setStatus(key, text) {
    if (phase === key) return;
    phase = key;
    if (statusEl) { statusEl.setAttribute("data-phase", key); statusEl.querySelector("span").textContent = text; }
  }

  function restart() {
    t0 = performance.now();
    seatClean = backClean = 0;
    phase = "";
  }
  if (replayBtn) replayBtn.addEventListener("click", restart);

  /* ---------- interaction: drag to rotate + pointer parallax ---------- */
  var dragging = false, lastX = 0, spinVel = 0, userSpin = 0, mx = 0, my = 0;
  stage.addEventListener("pointerdown", function (e) { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId); stage.classList.add("grabbing"); });
  stage.addEventListener("pointermove", function (e) {
    var r = stage.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!dragging) return;
    var dx = e.clientX - lastX; lastX = e.clientX;
    spinVel = dx * 0.006; userSpin += spinVel;
  });
  function endDrag() { dragging = false; stage.classList.remove("grabbing"); }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("pointerleave", function () { mx = my = 0; });

  /* ---------- resize ---------- */
  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Pull the camera back on tall/narrow stages so the whole chair stays in frame
    camBase.z = w / h < 0.9 ? 14.5 : 11.5;
    camera.updateProjectionMatrix();
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage); else window.addEventListener("resize", resize);
  resize();

  /* ---------- pause when off-screen ---------- */
  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(stage);
  }

  var running = false;
  function loop() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function frame(now) {
    if (!visible) { running = false; return; }
    var t = reduceMotion ? 99 : (now - t0) / 1000;
    var clock = now / 1000;

    // 1) Assembly
    parts.forEach(function (pt) {
      var k = clamp01((t - pt.delay) / PART_DUR), e = easeOutBack(k);
      pt.obj.position.lerpVectors(pt.from.p, pt.to.p, e);
      pt.obj.rotation.set(
        pt.from.r.x + (pt.to.r.x - pt.from.r.x) * e,
        pt.from.r.y + (pt.to.r.y - pt.from.r.y) * e,
        pt.from.r.z + (pt.to.r.z - pt.from.r.z) * e
      );
      pt.obj.visible = t > pt.delay - 0.05;
    });

    // 2) Cleaning scan - fabric colour turns fresh as the ring passes
    var sk = clamp01((t - SCAN_START) / SCAN_DUR);
    var scanY = easeInOut(sk) * CHAIR_TOP;
    var firstScanOn = t > SCAN_START && t < SCAN_START + SCAN_DUR + 0.3;
    // later: gentle repeating scan every 7s for life
    var loopT = (t - (SCAN_START + SCAN_DUR + 2)) % 7;
    var idleScan = t > SCAN_START + SCAN_DUR + 2 && loopT < 2.4;
    if (idleScan) scanY = easeInOut(loopT / 2.4) * CHAIR_TOP;
    var scanOn = firstScanOn || idleScan;
    scan.position.y = scanY;
    var fade = scanOn ? Math.sin(Math.PI * (firstScanOn ? sk : loopT / 2.4)) : 0;
    scanRing.material.opacity = 0.9 * fade;
    scanDisc.material.opacity = (firstScanOn ? 0.22 : 0.1) * fade;

    if (t > SCAN_START) {
      seatClean = Math.max(seatClean, clamp01((scanY - 1.3) / 0.6));
      backClean = Math.max(backClean, clamp01((scanY - 2.2) / 1.4));
    }
    M.seat.color.lerpColors(DIRTY_SEAT, CLEAN_SEAT, seatClean);
    M.back.color.lerpColors(DIRTY_BACK, CLEAN_BACK, backClean);

    if (t < ASSEMBLE) setStatus("repair", "Repairing & re-assembling parts");
    else if (t < SCAN_START + SCAN_DUR) setStatus("clean", "Deep cleaning fabric & mesh");
    else setStatus("done", "Like new - ready for your office");

    // 3) Chair idle motion
    if (!dragging) { spinVel *= 0.94; userSpin += spinVel; }
    var settle = clamp01((t - ASSEMBLE) / 1.5);
    var dt = Math.min(0.05, (now - lastNow) / 1000); lastNow = now;
    if (!reduceMotion) autoSpin += dt * 0.3 * settle;
    chair.rotation.y = -0.5 + autoSpin + userSpin;
    chair.position.y = reduceMotion ? 0 : Math.sin(clock * 1.2) * 0.04 * settle;
    platform2.rotation.z = clock * 0.3;

    // 4) Wrench orbits during repair, then floats nearby
    var wa = clock * 0.9;
    wrench.position.set(Math.cos(wa) * 2.7, 2.6 + Math.sin(clock * 1.6) * 0.35, Math.sin(wa) * 2.7);
    wrench.rotation.set(clock * 0.8, clock * 1.3, clock * 0.5);

    // 5) Sparkles rise; brighter while cleaning
    var arr = pGeo.attributes.position.array;
    for (var i = 0; i < PCOUNT; i++) {
      arr[i * 3 + 1] += reduceMotion ? 0 : pSpeed[i];
      if (arr[i * 3 + 1] > 5.2) arr[i * 3 + 1] = 0;
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = 0.35 + 0.55 * fade;

    // 6) Camera parallax
    camera.position.set(camBase.x + mx * 0.6, camBase.y - my * 0.4, camBase.z);
    camera.lookAt(lookAt);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  stage.classList.add("ready");
  loop();
})();
