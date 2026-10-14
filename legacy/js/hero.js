/* ==========================================================
   Home hero: animated photo slideshow + counting stats.
   Slides crossfade with a slow zoom (CSS), captions slide in,
   dots / swipe / hover-pause, and stats count up on load.
   ========================================================== */
(function () {
  var box = document.getElementById("hero-slides");
  if (!box) return;
  var slides = Array.prototype.slice.call(box.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(box.querySelectorAll(".hero-dots button"));
  var bar = box.querySelector(".hero-progress i");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MS = 6000, i = 0, timer = null, started = 0, remaining = MS, paused = false;
  box.style.setProperty("--slide-ms", MS + "ms");

  // Blurred copy of each photo fills the frame behind the full, uncropped chair
  slides.forEach(function (s) {
    var im = s.querySelector("img"), bg = document.createElement("div");
    bg.className = "hero-slide-bg";
    bg.setAttribute("aria-hidden", "true");
    bg.style.backgroundImage = 'url("' + im.src + '")';
    s.insertBefore(bg, im);
  });

  // If a slide's photo file is missing, drop that slide (and its dot) instead of showing a broken image
  function dropSlide(s) {
    var k = slides.indexOf(s);
    if (k < 0 || slides.length < 2) return;
    var wasActive = k === i;
    s.remove(); dots[k].remove();
    slides.splice(k, 1); dots.splice(k, 1);
    if (k < i) i--;
    if (wasActive) { i = k % slides.length; slides[i].classList.add("is-active"); dots[i].classList.add("on"); restartBar(); schedule(MS); }
  }
  slides.forEach(function (s) {
    var im = s.querySelector("img");
    if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) dropSlide(s);
    else im.addEventListener("error", function () { dropSlide(s); });
  });

  function show(n) {
    slides[i].classList.remove("is-active");
    dots[i].classList.remove("on");
    i = (n + slides.length) % slides.length;
    // restart the zoom animation on the incoming image
    var img = slides[i].querySelector("img");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    slides[i].classList.add("is-active");
    dots[i].classList.add("on");
    restartBar();
    schedule(MS);
  }
  function restartBar() {
    if (!bar) return;
    bar.classList.remove("run"); void bar.offsetWidth;
    if (!reduce) bar.classList.add("run");
  }
  function schedule(ms) {
    clearTimeout(timer);
    if (reduce) return;
    remaining = ms; started = Date.now();
    timer = setTimeout(function () { show(i + 1); }, ms);
  }

  dots.forEach(function (d) { d.addEventListener("click", function () { var k = dots.indexOf(d); if (k !== i) show(k); }); });

  // Pause while hovered (progress bar pauses via CSS too)
  box.addEventListener("mouseenter", function () { if (paused) return; paused = true; clearTimeout(timer); remaining -= Date.now() - started; });
  box.addEventListener("mouseleave", function () { if (!paused) return; paused = false; schedule(Math.max(400, remaining)); });

  // Swipe on touch screens
  var x0 = null;
  box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
  });

  // Don't run while the tab is hidden
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearTimeout(timer); else if (!paused) schedule(MS);
  });

  // Preload the other slides after the first is shown
  window.addEventListener("load", function () {
    slides.forEach(function (s) { var im = s.querySelector("img"); im.loading = "eager"; });
  });

  restartBar();
  schedule(MS);

  /* ---------- Count-up stats ---------- */
  if (reduce) return;
  document.querySelectorAll(".hero-stats strong").forEach(function (el) {
    var text = el.textContent.trim();
    var m = text.match(/^([\d,]+)(.*)$/);
    if (!m) return;
    var target = parseInt(m[1].replace(/,/g, ""), 10), suffix = m[2], t0 = null, dur = 1600;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString("en-IN") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 700);
  });
})();
