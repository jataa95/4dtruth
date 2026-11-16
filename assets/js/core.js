/* =========================================================
   4dtruth: shared core (all pages)
   Nav, mobile menu, footer, page transitions, smooth scroll,
   line-split reveals, band hovers, scroll fill, parallax,
   count-ups, film grain, live Lagos clock.
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const pad2 = (n) => String(n).padStart(2, "0");
  const pad3 = (n) => String(n).padStart(3, "0");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "home";
  const WORKS = window.WORKS || [];
  const C = window.CONTACT || {};

  const imgSrc = (w) => `assets/works/${w.slug}.jpg`;
  const pieceUrl = (w) => `piece.html?w=${w.slug}`;
  const tagsFor = (w) => [w.medium, w.size, w.series].filter(Boolean);
  const tagHTML = (w) => tagsFor(w).map((t, i) => `<span class="tag" style="--t:${i}">${t}</span>`).join("");
  const waLink = (text) => `https://wa.me/${C.phoneRaw}?text=${encodeURIComponent(text)}`;

  // Menu entries: each has a painting that previews when the link is hovered
  const MENU = [
    { href: "index.html", t: "Home", sub: "Start here", img: "moments-we-share", cur: page === "home" },
    { href: "work.html", t: "Work", sub: `${pad2(WORKS.length)} paintings`, img: "ojude-series", cur: page === "work" || page === "piece" },
    { href: "about.html", t: "About", sub: "The artist", img: "the-weight-of-beauty", cur: page === "about" },
    { href: "contact.html", t: "Contact", sub: "Commissions open", img: "the-golden-path", cur: page === "contact" },
  ];

  // ---------- Film grain + nav + menu + page transition (injected) ----------
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="grain" aria-hidden="true"></div>
    <div class="pt" id="pt" aria-hidden="true"><span class="pt-logo">4dtruth</span></div>
    <header class="nav" id="nav">
      <a href="index.html" class="nav-logo bnd-hov">4dtruth</a>
      <button class="nav-toggle" id="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
        <span class="burger" aria-hidden="true"><i></i><i></i></span>
        <span class="nav-toggle-t"><span class="bnd-hov" id="burger-t">Menu</span></span>
      </button>
    </header>
    <div class="menu" id="menu" aria-hidden="true" data-lenis-prevent>
      <div class="menu-grid">
        <nav class="menu-links" aria-label="Main">
          ${MENU.map((m, i) => `<a href="${m.href}" data-k="${i}" style="--i:${i}" class="${m.cur ? "cur" : ""}">
              <span class="ml-i mono">${pad2(i + 1)}</span>
              <span class="ml-t"><span class="ml-tt">${m.t}</span></span>
              <span class="ml-s mono">${m.sub}</span>
            </a>`).join("")}
        </nav>
        <div class="menu-preview" aria-hidden="true">
          ${MENU.map((m, i) => `<figure class="mp${i === 0 ? " act" : ""}" data-k="${i}"><img src="assets/works/${m.img}.jpg" alt="" loading="lazy" /><figcaption class="mono">${WORKS.find((w) => w.slug === m.img)?.title || ""}</figcaption></figure>`).join("")}
        </div>
      </div>
      <div class="menu-strip">
        <p class="mono menu-h">Latest work</p>
        <div class="ms-row">
          ${WORKS.slice(0, 6).map((w, i) => `<a class="ms" href="piece.html?w=${w.slug}" style="--i:${i}"><img src="assets/works/thumbs/${w.slug}.jpg" alt="${w.title}" loading="lazy" /><span class="mono">${w.title}</span></a>`).join("")}
        </div>
      </div>
      <div class="menu-foot">
        <div class="mono mf-links">
          <a href="https://wa.me/${C.phoneRaw}" target="_blank" rel="noopener" class="bnd-hov">WhatsApp ↗</a>
          <a href="${C.instagram}" target="_blank" rel="noopener" class="bnd-hov">Instagram ↗</a>
          <a href="${C.threads}" target="_blank" rel="noopener" class="bnd-hov">Threads ↗</a>
        </div>
        <div class="mono mf-meta"><span><i class="f-dot"></i>Open for enquiries</span><span>Lagos <span data-clock>--:--:--</span></span></div>
        <a href="contact.html" class="btn btn-light"><span class="bnd-hov">Commission a piece</span><i>↗</i></a>
      </div>
    </div>`);

  // ---------- Footer ----------
  const footerSlot = $("#app-footer");
  if (footerSlot) {
    footerSlot.outerHTML = `
    <footer class="footer" id="footer">
      <div class="f-cta">
        <p class="label f-label" data-split="wipe">Start something</p>
        <h2 class="f-title" data-split="wipe">Let’s bring your story into colour.</h2>
        <div class="f-btns">
          <a href="contact.html" class="btn btn-light"><span class="bnd-hov">Commission a piece</span><i>↗</i></a>
          <a href="${waLink("Hi 4dtruth, I'd love to talk about a painting.")}" target="_blank" rel="noopener" class="btn btn-ghost-light"><span class="bnd-hov">Chat on WhatsApp</span><i>↗</i></a>
        </div>
      </div>
      <div class="f-cols">
        <div><p class="mono f-h">Menu</p>
          <a href="index.html" class="bnd-hov">Home</a><a href="work.html" class="bnd-hov">Work</a><a href="about.html" class="bnd-hov">About</a><a href="contact.html" class="bnd-hov">Contact</a></div>
        <div><p class="mono f-h">Connect</p>
          <a href="https://wa.me/${C.phoneRaw}" target="_blank" rel="noopener" class="bnd-hov">WhatsApp ↗</a>
          <a href="${C.instagram}" target="_blank" rel="noopener" class="bnd-hov">Instagram ↗</a>
          <a href="${C.threads}" target="_blank" rel="noopener" class="bnd-hov">Threads ↗</a>
          <a href="tel:+${C.phoneRaw}" class="bnd-hov">${C.phone}</a></div>
        <div><p class="mono f-h">Studio</p>
          <p>Lagos, Nigeria</p>
          <p class="f-clock"><span data-clock>--:--:--</span> <span class="f-muted">WAT</span></p></div>
        <div><p class="mono f-h">Status</p>
          <p><i class="f-dot"></i>Open for enquiries</p>
          <p class="f-muted">Very responsive</p></div>
      </div>
      <a href="work.html" class="f-word" id="f-word" aria-label="4dtruth: view the work"></a>
      <div class="f-bottom mono">
        <span>© <span data-year></span> 4dtruth · All artworks © Seun Okunola</span>
        <span class="f-hint">Move across the wordmark to paint it</span>
        <a href="#" class="bnd-hov" data-top>Back to top ↑</a>
      </div>
    </footer>`;
  }
  $$("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (window.Lenis && !reduced) lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: typeof target === "number" ? target : $(target).getBoundingClientRect().top + scrollY, behavior: "smooth" });
  };
  $$("[data-top]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); scrollTo(0); }));
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute("data-top")) return;
    const id = a.getAttribute("href");
    if (id.length > 1 && $(id)) { e.preventDefault(); scrollTo(id); }
  });

  // ---------- Preloader (first visit per session, every page) ----------
  // Dark panel, giant wordmark rising letter by letter with paintings flickering
  // inside the letters, a live counter and progress line; then the letters lift
  // away and the panel wipes up. Resolves FDT.preloaded when the exit begins.
  let preloaded = Promise.resolve(false);
  if (root.classList.contains("preload")) {
    const PAINTS = ["moments-we-share", "ojude-series", "study-in-red", "open-market-2", "the-weight-of-beauty", "the-golden-path", "city-in-layers", "red-carpet", "vibrant-vision-2", "hallelujah"];
    const L = [..."4dtruth"];
    document.body.insertAdjacentHTML("afterbegin", `
      <div class="pl" id="pl" aria-hidden="true">
        <div class="pl-word">${L.map((c, i) => `<span class="pl-l" style="--i:${i}"><span class="pl-c">${c}</span></span>`).join("")}</div>
        <div class="pl-foot">
          <div class="pl-meta mono"><span>Seun Okunola</span><span>Painter &amp; colourist · Lagos</span></div>
          <div class="pl-count"><span id="pl-n">000</span><span class="pl-pc">%</span></div>
        </div>
        <div class="pl-bar"><i id="pl-bar"></i></div>
      </div>`);
    // preload the paintings used inside the letters
    PAINTS.forEach((s) => { const im = new Image(); im.src = `assets/works/thumbs/${s}.jpg`; });
    const pl = $("#pl"), plN = $("#pl-n"), plBar = $("#pl-bar"), plLetters = $$(".pl-c", pl);
    const layoutPL = () => {
      const w = $(".pl-word", pl).getBoundingClientRect();
      plLetters.forEach((c) => c.style.setProperty("--ox", `${-(c.getBoundingClientRect().left - w.left)}px`));
      pl.style.setProperty("--fw", `${w.width}px`);
    };
    let pk = 0;
    const flick = setInterval(() => { pk = (pk + 1) % PAINTS.length; pl.style.setProperty("--paint", `url(assets/works/thumbs/${PAINTS[pk]}.jpg)`); }, 160);
    pl.style.setProperty("--paint", `url(assets/works/thumbs/${PAINTS[0]}.jpg)`);

    // what we wait for: fonts, eager images on the page, the hero video (home)
    const assets = [document.fonts.ready];
    const watch = (el, ev) => new Promise((res) => { el.addEventListener(ev, res, { once: true }); el.addEventListener("error", res, { once: true }); setTimeout(res, 4500); });
    const domReady = new Promise((r) => (document.readyState === "loading" ? addEventListener("DOMContentLoaded", r, { once: true }) : r()));
    preloaded = domReady.then(async () => {
      $$("img:not([loading=lazy])").forEach((im) => { if (!im.complete) assets.push(watch(im, "load")); });
      const v = $("video"); if (v && v.readyState < 2) assets.push(watch(v, "loadeddata"));
      let done = 0; const total = assets.length;
      assets.forEach((a) => a.then(() => done++));
      if (lenis) lenis.stop();
      await document.fonts.ready; layoutPL(); pl.classList.add("in");
      // counter: eases towards real progress, never faster than the minimum duration
      const t0 = performance.now(), MIN = 2200;
      let shown = 0;
      await new Promise((res) => {
        const tick = (now) => {
          const real = total ? done / total : 1;
          const time = clamp((now - t0) / MIN);
          const target = Math.min(real, time) * 100;
          shown = lerp(shown, target, 0.08);
          if (target >= 100 && shown > 99.4) shown = 100;
          plN.textContent = String(Math.floor(shown)).padStart(3, "0");
          plBar.style.transform = `scaleX(${(shown / 100).toFixed(4)})`;
          if (shown >= 100) res(); else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      clearInterval(flick);
      pl.style.setProperty("--paint", `url(assets/works/thumbs/moments-we-share.jpg)`);
      await wait(250);
      pl.classList.add("out");                 // letters lift away
      await wait(380);
      pl.classList.add("wipe");                // panel wipes up
      sessionStorage.setItem("fdt-seen", "1");
      root.classList.remove("preload");
      setTimeout(() => { pl.remove(); if (lenis && !root.classList.contains("is-loading")) lenis.start(); }, 1100);
      return true;
    });
  }

  // ---------- Page transitions ----------
  const pt = $("#pt");
  function leave(href) {
    sessionStorage.setItem("fdt-pt", "1");
    pt.classList.remove("open");
    pt.classList.add("cover");
    setTimeout(() => (location.href = href), reduced ? 0 : 750);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:/i.test(href)) return;
    e.preventDefault();
    closeMenu();
    leave(href);
  });
  function revealPage() {
    if (!root.classList.contains("pt-in")) return;
    requestAnimationFrame(() => { pt.classList.add("open"); root.classList.remove("pt-in"); });
    sessionStorage.removeItem("fdt-pt");
  }
  addEventListener("pageshow", (e) => { if (e.persisted) { pt.classList.remove("cover"); pt.classList.add("open"); } });

  // ---------- Menu overlay (all screens) ----------
  const menu = $("#menu"), burger = $("#burger"), burgerT = $("#burger-t");
  const mLinks = $$(".menu-links a", menu), mPrev = $$(".mp", menu);
  const curIdx = Math.max(0, MENU.findIndex((m) => m.cur));
  function previewMenu(k) {
    mPrev.forEach((f) => f.classList.toggle("act", +f.dataset.k === k));
    mLinks.forEach((a) => a.classList.toggle("dim", +a.dataset.k !== k));
  }
  mLinks.forEach((a) => {
    a.addEventListener("mouseenter", () => previewMenu(+a.dataset.k));
    a.addEventListener("focus", () => previewMenu(+a.dataset.k));
  });
  $(".menu-links", menu).addEventListener("mouseleave", () => { previewMenu(curIdx); mLinks.forEach((a) => a.classList.remove("dim")); });
  function openMenu() {
    previewMenu(curIdx); mLinks.forEach((a) => a.classList.remove("dim"));
    menu.classList.add("open"); menu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    burgerT.textContent = "Close";
    root.classList.add("menu-open"); lenis && lenis.stop();
  }
  function closeMenu() {
    if (!menu.classList.contains("open")) return;
    menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    burgerT.textContent = "Menu";
    root.classList.remove("menu-open"); lenis && lenis.start();
  }
  burger.addEventListener("click", () => (menu.classList.contains("open") ? closeMenu() : openMenu()));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // ---------- Text splitting into lines ----------
  const splitStore = new Map();
  function split(el) {
    if (!splitStore.has(el)) splitStore.set(el, el.innerHTML);
    el.innerHTML = splitStore.get(el);
    const mode = el.dataset.split;
    const tokens = [];
    el.childNodes.forEach((n) => {
      if (n.nodeType === 3) n.textContent.split(/\s+/).filter(Boolean).forEach((w) => tokens.push(w));
      else if (n.nodeName === "BR") tokens.push("\n");
      else tokens.push(n.textContent);
    });
    el.innerHTML = tokens.map((t) => (t === "\n" ? "<br>" : `<span class="w">${t}</span>`)).join(" ");
    const lines = []; let top = null;
    $$(".w", el).forEach((w) => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
      lines[lines.length - 1].push(w.textContent);
    });
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    el.innerHTML = lines.map((l, i) => {
      const txt = l.join(" ");
      return mode === "fill"
        ? `<span class="ln" aria-hidden="true">${txt}<span class="ln-f">${txt}</span></span>`
        : `<span class="ln" aria-hidden="true"><span class="ln-i" style="--i:${i}">${txt}</span></span>`;
    }).join("");
    el.dataset.splitDone = "1";
  }
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  // Split + observe everything under `scope` (skip [data-manual] which pages trigger themselves)
  function prepare(scope = document) {
    $$("[data-split]", scope).forEach((el) => {
      split(el);
      if (!el.closest("[data-manual]")) revealIO.observe(el);
    });
    $$("[data-reveal]", scope).forEach((el) => revealIO.observe(el));
    $$(".bnd-hov", scope).forEach(bandify);
    $$("[data-count]", scope).forEach((el) => countIO.observe(el));
    if (noHover) $$(GS, scope).forEach((el) => gsIO.observe(el));
  }

  // ---------- Grey -> colour on touch screens (no hover): colour when centred ----------
  const GS = ".card, .mq, .sp, .next, .piece-wall, .ms";
  const noHover = matchMedia("(hover: none)").matches;
  const gsIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.target.classList.toggle("color", en.isIntersecting));
  }, { rootMargin: "-30% 0px -30% 0px" });

  // ---------- Band hover ----------
  function bandify(el) {
    if (el.dataset.bnd) return; el.dataset.bnd = "1";
    const trigger = el.closest("a, button, label") || el;
    trigger.addEventListener("mouseenter", () => { if (!el.classList.contains("hov")) el.classList.add("hov"); });
    el.addEventListener("animationend", (e) => { if (e.animationName === "bnd") el.classList.remove("hov"); });
  }

  // ---------- Count-ups ----------
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length;
      const suf = el.dataset.suffix || "", pre = el.dataset.pad ? +el.dataset.pad : 0;
      const t0 = performance.now(), dur = 1600;
      const step = (now) => {
        const p = clamp((now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        let v = (to * e).toFixed(dec);
        if (pre) v = String(v).padStart(pre, "0");
        el.textContent = v + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  // ---------- Scroll fill / parallax ----------
  function updateFill() {
    const vh = innerHeight;
    $$('[data-split="fill"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 1.5) return;
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const lines = $$(".ln-f", el), n = lines.length;
      lines.forEach((f, k) => f.style.setProperty("--fill", clamp(p * n - k).toFixed(3)));
    });
  }
  function updateParallax() {
    if (reduced) return;
    const vh = innerHeight;
    $$("[data-parallax]").forEach((m) => {
      const r = m.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const off = (r.top + r.height / 2 - vh / 2) / vh;
      const amt = parseFloat(m.dataset.parallax) || 0.07;
      m.style.setProperty("--py", `${(-off * r.height * amt).toFixed(1)}px`);
    });
  }

  // ---------- Nav hide on scroll down ----------
  let lastY = 0;
  function updateNav() {
    const y = scrollY;
    if (Math.abs(y - lastY) < 2) return;
    root.classList.toggle("nav-hide", y > 140 && y > lastY && !root.classList.contains("menu-open"));
    lastY = y;
  }

  // ---------- Live Lagos clock ----------
  function tickClock() {
    const t = new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour12: false });
    $$("[data-clock]").forEach((e) => (e.textContent = t));
  }
  tickClock(); setInterval(tickClock, 1000);

  // ---------- Footer wordmark ----------
  // Paper-white letters rise in (scrubbed by scroll, each letter at its own pace).
  // A soft spotlight follows the cursor and shows painting through the letters;
  // when idle (and on touch screens) the spotlight drifts by itself.
  const fw = $("#f-word");
  let fwTick = null;
  if (fw) {
    const paints = ["ojude-series", "moments-we-share", "study-in-red", "open-market-2", "the-weight-of-beauty", "the-golden-path", "city-in-layers", "vibrant-vision-2"];
    const L = [..."4dtruth"];
    const letters = (cls) => L.map((c, i) => `<span class="${cls}" style="--i:${i}">${c}</span>`).join("");
    fw.innerHTML = `<span class="fw-base" aria-hidden="true">${letters("fw-l")}</span><span class="fw-paint" aria-hidden="true">${letters("fw-l fw-p")}</span>`;
    const pLetters = $$(".fw-p", fw);
    let pi = 0;
    const setPaint = () => fw.style.setProperty("--paint", `url(assets/works/${paints[pi]}.jpg)`);
    setPaint();
    const layout = () => {
      const w = fw.getBoundingClientRect();
      pLetters.forEach((s) => s.style.setProperty("--ox", `${-s.offsetLeft}px`));
      fw.style.setProperty("--fw", `${w.width}px`);
    };
    let hover = false, tx = 0, ty = 0, x = 0, y = 0, rad = 0;
    fw.addEventListener("mouseenter", () => { hover = true; pi = (pi + 1) % paints.length; setPaint(); });
    fw.addEventListener("mouseleave", () => { hover = false; });
    fw.addEventListener("mousemove", (e) => { const r = fw.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });
    setInterval(() => { if (!hover) { pi = (pi + 1) % paints.length; setPaint(); } }, 5000);
    fwTick = (now) => {
      const r = fw.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // scroll progress: 0 as the wordmark enters, 1 once it is fully in view
      const p = clamp((vh - r.top) / (r.height * 1.1));
      fw.style.setProperty("--p", p.toFixed(4));
      if (!hover) { tx = r.width * (0.5 + 0.42 * Math.sin(now * 0.00035)); ty = r.height * (0.5 + 0.28 * Math.sin(now * 0.0006 + 1)); }
      const trad = hover ? Math.min(r.width * 0.2, 340) : Math.min(r.width * 0.14, 220);
      x = lerp(x, tx, 0.12); y = lerp(y, ty, 0.12); rad = lerp(rad, trad * p, 0.08);
      fw.style.setProperty("--sx", `${x.toFixed(1)}px`);
      fw.style.setProperty("--sy", `${y.toFixed(1)}px`);
      fw.style.setProperty("--sr", `${rad.toFixed(1)}px`);
    };
    document.fonts.ready.then(layout);
    addEventListener("resize", layout);
  }

  // ---------- Main loop ----------
  const hooks = [];
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(now - last, 50); last = now;
    if (lenis) lenis.raf(now);
    updateFill(); updateParallax(); updateNav();
    if (fwTick) fwTick(now);
    for (const h of hooks) h(now, dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Re-split on width change
  let rw = innerWidth, rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (innerWidth === rw) return; rw = innerWidth;
      $$("[data-split-done]").forEach((el) => { const was = el.classList.contains("in"); split(el); if (was) el.classList.add("in"); });
    }, 200);
  });

  // ---------- Card markup shared by pages ----------
  const card = (w, opts = {}) => `
    <a class="card${opts.wide ? " wide" : ""}${opts.cls ? " " + opts.cls : ""}" href="${pieceUrl(w)}" data-slug="${w.slug}" data-reveal>
      <div class="card-media" data-parallax="0.07"><img src="${imgSrc(w)}" alt="${w.title}, oil painting by 4dtruth" loading="lazy" /></div>
      <div class="card-info"><h3 data-split="wipe">${w.title}</h3><div class="tags">${tagHTML(w)}</div></div>
    </a>`;

  // ---------- Public API ----------
  // Wait for every page script to render (DOMContentLoaded) and for fonts, so lines measure correctly
  const domReady = new Promise((r) => (document.readyState === "loading" ? addEventListener("DOMContentLoaded", r, { once: true }) : r()));
  const ready = domReady.then(() => document.fonts.ready).then(() => { prepare(document); revealPage(); });
  window.FDT = {
    $, $$, clamp, lerp, easeInOut, pad2, pad3, wait, reduced, lenis, scrollTo,
    imgSrc, pieceUrl, tagsFor, tagHTML, waLink, card, prepare, split, ready, preloaded,
    onFrame: (fn) => hooks.push(fn),
    bySlug: (s) => WORKS.find((w) => w.slug === s),
  };
})();
