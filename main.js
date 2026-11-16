/* =========================================================
   4dtruth: interactions
   Motion system modelled on ouiwill.com: 3D loader, hero that
   opens out of it, tile-to-reel scroll expansion, line wipes,
   band-sweep hovers, scroll-filled text, parallax, dark
   statement slider, velocity marquee, smooth scroll (Lenis).
   ========================================================= */

// ---------- Artwork data (from the 4dtruth Instagram captions) ----------
// Size / medium are omitted where they weren't legible in the source screenshots.
const WORKS = [
  { slug: "moments-we-share", title: "Moments We Share", medium: "Oil on canvas",
    desc: "A celebration of human connection, shared experiences, and the beauty found in togetherness. Through vibrant colours and expressive textures, the piece captures the warmth of community and the unforgettable moments that bring us together." },
  { slug: "open-market-2", title: "Open Market 2", size: "40 × 42 in", medium: "Oil on canvas", series: "Open Market" },
  { slug: "city-in-layers", title: "City in Layers", size: "3 × 4 ft", medium: "Oil on canvas" },
  { slug: "the-weight-of-beauty", title: "The Weight of Beauty", medium: "Oil on canvas",
    desc: "The Weight of Beauty reflects the unseen burdens we carry while becoming who we are. Through vibrant colours, layered textures, and expressive forms, the work explores the beauty found in resilience and identity." },
  { slug: "the-golden-path", title: "The Golden Path", size: "42 × 44 in", medium: "Oil on canvas" },
  { slug: "ojude-series", title: "Ojude", size: "3 × 4 ft", medium: "Oil on canvas", series: "Ojude series" },
  { slug: "in-one-rhythm", title: "In One Rhythm", size: "34 × 54 in", medium: "Oil on canvas",
    desc: "In One Rhythm explores the beauty of unity, movement, and shared identity. Through vibrant colours and rich layers of texture, the figures come together as one, reflecting how individual stories can create a powerful collective rhythm." },
  { slug: "hallelujah", title: "Hallelujah", size: "42 × 54 in", medium: "Oil on canvas" },
  { slug: "red-carpet", title: "Red Carpet", size: "3 × 4 ft", medium: "Oil on canvas", series: "Ojude series" },
  { slug: "vibrant-vision-2", title: "Vibrant Vision 2", size: "3 × 4 ft", medium: "Oil on canvas", series: "Vibrant Vision" },
  { slug: "study-in-red", title: "Study in Red", size: "3 × 4 ft", medium: "Oil on canvas" },
  { slug: "where-the-light-persists", title: "Where the Light Persists", size: "3 × 4 ft" },
  { slug: "the-beauty-we-became", title: "The Beauty We Became", size: "54 × 42 in",
    desc: "Reflective and emotional, the work suggests that every layer, fragment, and experience contributed to something beautiful." },
];
// Selected Work grid: pairs of halves with full-width rows between (as on the reference)
const SELECTED = [
  ["moments-we-share"], ["open-market-2"],
  ["city-in-layers", "wide"],
  ["the-weight-of-beauty"], ["the-golden-path"],
  ["ojude-series", "wide"],
  ["in-one-rhythm"], ["hallelujah"],
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const pad2 = (n) => String(n).padStart(2, "0");
const bySlug = (s) => WORKS.find((w) => w.slug === s);
const idxOf = (w) => WORKS.indexOf(w);
const imgSrc = (w) => `assets/works/${w.slug}.jpg`;
const tagsFor = (w) => [w.medium, w.size, w.series].filter(Boolean);
const tagHTML = (w) => tagsFor(w).map((t, i) => `<span class="tag" style="--t:${i}">${t}</span>`).join("");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

// ---------- Smooth scroll ----------
let lenis = null;
if (window.Lenis && !reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
}
const scrollTo = (target) => {
  if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else (typeof target === "number" ? window.scrollTo({ top: target, behavior: "smooth" }) : $(target)?.scrollIntoView({ behavior: "smooth" }));
};
$$("[data-scroll]").forEach((a) => a.addEventListener("click", (e) => {
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  e.preventDefault();
  scrollTo(href === "#top" ? 0 : href);
}));

// ---------- Text splitting into lines ----------
const splitStore = new Map();
function split(el) {
  if (!splitStore.has(el)) splitStore.set(el, el.innerHTML);
  const src = splitStore.get(el);
  el.innerHTML = src;
  const mode = el.dataset.split;
  // Words (keep <br> as hard breaks)
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
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  el.innerHTML = lines.map((l, i) => {
    const txt = l.join(" ");
    return mode === "fill"
      ? `<span class="ln" aria-hidden="true">${txt}<span class="ln-f" style="--fill:0">${txt}</span></span>`
      : `<span class="ln" aria-hidden="true"><span class="ln-i" style="--i:${i}">${txt}</span></span>`;
  }).join("");
}
const splitAll = () => $$("[data-split]").forEach(split);

// Reveal on enter
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });

// ---------- Band hover (a gap sweeps down through the text) ----------
function bandify(el) {
  const trigger = el.closest("a, button") || el;
  trigger.addEventListener("mouseenter", () => {
    if (el.classList.contains("hov")) return;
    el.classList.add("hov");
  });
  el.addEventListener("animationend", (e) => { if (e.animationName === "bnd") el.classList.remove("hov"); });
}
$$(".bnd-hov").forEach(bandify);

// ---------- Loader ring ----------
const ring = $("#ring");
const RING = ["moments-we-share", "ojude-series", "the-weight-of-beauty", "open-market-2", "city-in-layers", "in-one-rhythm", "the-golden-path", "hallelujah"];
ring.innerHTML = RING.map((s, k) => `<div class="ring-card" style="--k:${k};background-image:url(assets/works/${s}.jpg)"></div>`).join("");

// ---------- Hero / reel ----------
const intro = $(".intro");
const hero = $("#hero");
const heroTitle = $(".hero-title");
const reel = $("#reel");
const reelMedia = $("#reel-media");
const reelCount = $("#reel-count");
const REEL = ["moments-we-share", "ojude-series", "the-golden-path", "city-in-layers", "open-market-2", "the-weight-of-beauty", "vibrant-vision-2", "red-carpet"];
reelMedia.innerHTML = REEL.map((s) => `<img src="assets/works/${s}.jpg" alt="" />`).join("");
const reelImgs = $$("img", reelMedia);
let reelI = 0, reelT = 0, reelBig = 0;
function reelStep(now) {
  const every = reelBig > 0.5 ? 2400 : 1300;
  if (now - reelT < every) return;
  reelT = now;
  reelImgs[reelI].classList.remove("act");
  reelI = (reelI + 1) % reelImgs.length;
  const img = reelImgs[reelI];
  img.classList.remove("act"); void img.offsetWidth; img.classList.add("act");
  reelCount.textContent = `${pad2(reelI + 1)}/${pad2(reelImgs.length)}`;
}
reelImgs[0].classList.add("act");

function updateIntro() {
  const W = innerWidth, H = intro.querySelector(".intro-pin").offsetHeight;
  const r = intro.getBoundingClientRect();
  const p = clamp(-r.top / (intro.offsetHeight - H));
  const e = easeInOut(p);
  reelBig = e;
  const padd = W < 860 ? 16 : 20;
  const w0 = W < 860 ? 132 : 233, h0 = Math.round(w0 * 0.615);
  const x0 = W - padd - w0, y0 = H - padd - h0;
  const x = lerp(x0, padd, e), y = lerp(y0, padd, e);
  const w = lerp(w0, W - padd * 2, e), h = lerp(h0, H - padd * 2, e);
  const s = reel.style;
  s.setProperty("--rx", `${x}px`); s.setProperty("--ry", `${y}px`);
  s.setProperty("--rw", `${w}px`); s.setProperty("--rh", `${h}px`);
  s.setProperty("--rr", `${lerp(2, 5, e)}px`);
  s.setProperty("--rp", e.toFixed(3));
  s.setProperty("--rl", clamp((e - 0.55) / 0.3).toFixed(3));
  if (!root.classList.contains("is-loading")) {
    hero.style.setProperty("--hs", (1.08 - 0.06 * e).toFixed(4));
    heroTitle.style.opacity = (1 - clamp(e * 1.8)).toFixed(3);
    heroTitle.style.transform = `translateY(${-e * 70}px)`;
  }
}

// ---------- Scroll-filled text ----------
function updateFill() {
  const vh = innerHeight;
  $$('[data-split="fill"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -vh || r.top > vh * 1.5) return;
    const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
    const lines = $$(".ln-f", el);
    const n = lines.length;
    lines.forEach((f, k) => f.style.setProperty("--fill", clamp(p * n - k).toFixed(3)));
  });
}

// ---------- About cycle ----------
const cyc = $$("#about-cycle span");
let cycI = 0;
setInterval(() => {
  const cur = cyc[cycI];
  cur.classList.remove("act"); cur.classList.add("leave");
  setTimeout(() => cur.classList.remove("leave"), 750);
  cycI = (cycI + 1) % cyc.length;
  cyc[cycI].classList.add("act");
}, 1800);

// ---------- Selected work grid ----------
const grid = $("#grid");
grid.innerHTML = SELECTED.map(([slug, kind]) => {
  const w = bySlug(slug);
  return `<article class="card${kind === "wide" ? " wide" : ""}" data-i="${idxOf(w)}" tabindex="0" aria-label="${w.title}">
    <div class="card-media"><img src="${imgSrc(w)}" alt="${w.title}, oil painting by 4dtruth" loading="lazy" /></div>
    <div class="card-info"><h3 data-split="wipe">${w.title}</h3><div class="tags">${tagHTML(w)}</div></div>
  </article>`;
}).join("");
const cards = $$(".card", grid);
const cardIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); cardIO.unobserve(en.target); }
  });
}, { threshold: 0.12 });
cards.forEach((c) => cardIO.observe(c));
grid.addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openLB(+c.dataset.i); });
grid.addEventListener("keydown", (e) => { const c = e.target.closest(".card"); if (c && e.key === "Enter") openLB(+c.dataset.i); });

function updateParallax() {
  if (reduced) return;
  const vh = innerHeight;
  cards.forEach((c) => {
    const m = c.firstElementChild;
    const r = m.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const off = (r.top + r.height / 2 - vh / 2) / vh;
    m.firstElementChild.style.setProperty("--py", `${(-off * r.height * 0.07).toFixed(1)}px`);
  });
}

// ---------- Statements slider ----------
const withDesc = WORKS.filter((w) => w.desc);
const tBgs = $("#testi-bgs"), tQs = $("#testi-quotes"), tTabs = $("#testi-tabs"), tIdx = $("#testi-index");
tBgs.innerHTML = withDesc.map((w) => `<div class="testi-bg" style="background-image:url(${imgSrc(w)})"></div>`).join("");
tQs.innerHTML = withDesc.map((w) => `<div class="testi-q">
    <blockquote data-split="wipe">“${w.desc}”</blockquote>
    <div class="meta" data-split="wipe">${w.title}</div>
  </div>`).join("");
tTabs.innerHTML = withDesc.map((w, i) => `<button class="testi-tab" role="tab" data-k="${i}">${w.title}<i></i></button>`).join("");
const tBgEls = $$(".testi-bg", tBgs), tQEls = $$(".testi-q", tQs), tTabEls = $$(".testi-tab", tTabs);
let tI = -1, tTimer = null, tActive = false;
const T_DUR = 7000;
function showT(n) {
  n = (n + withDesc.length) % withDesc.length;
  if (tI >= 0) {
    tBgEls[tI].classList.remove("act"); tQEls[tI].classList.remove("act");
    tTabEls[tI].classList.remove("act");
    $$("[data-split]", tQEls[tI]).forEach((el) => el.classList.remove("in"));
  }
  tI = n;
  tBgEls[n].classList.add("act"); tQEls[n].classList.add("act");
  const tab = tTabEls[n]; void tab.offsetWidth; tab.classList.add("act");
  tab.style.setProperty("--dur", `${T_DUR}ms`);
  requestAnimationFrame(() => $$("[data-split]", tQEls[n]).forEach((el) => el.classList.add("in")));
  tIdx.textContent = `${pad2(n + 1)}/${pad2(withDesc.length)}`;
  clearTimeout(tTimer);
  if (tActive) tTimer = setTimeout(() => showT(tI + 1), T_DUR);
}
tTabEls.forEach((b) => b.addEventListener("click", () => showT(+b.dataset.k)));
new IntersectionObserver(([en]) => {
  tActive = en.isIntersecting;
  if (tActive) showT(tI < 0 ? 0 : tI); else clearTimeout(tTimer);
}, { threshold: 0.35 }).observe($("#statements"));

// ---------- More Work marquee (speed reacts to scroll velocity) ----------
const track = $("#marquee-track");
const mqHTML = WORKS.map((w, i) => `<div class="mq" data-i="${i}"><img src="${imgSrc(w)}" alt="${w.title}" loading="lazy" /><span>${w.title}</span></div>`).join("");
track.innerHTML = mqHTML + mqHTML;
$("#more-count").textContent = String(WORKS.length).padStart(3, "0");
track.addEventListener("click", (e) => { const m = e.target.closest(".mq"); if (m) openLB(+m.dataset.i); });
let mqX = 0, mqHover = false, mqSpeed = 0.6;
track.addEventListener("mouseenter", () => (mqHover = true));
track.addEventListener("mouseleave", () => (mqHover = false));
function updateMarquee(dt) {
  if (reduced) return;
  const vel = lenis ? Math.abs(lenis.velocity || 0) : 0;
  const target = (mqHover ? 0.12 : 0.6) + Math.min(vel * 0.35, 14);
  mqSpeed = lerp(mqSpeed, target, 0.08);
  mqX -= mqSpeed * (dt / 16.67);
  const half = track.scrollWidth / 2;
  if (half && -mqX >= half) mqX += half;
  track.style.transform = `translate3d(${mqX.toFixed(2)}px,0,0)`;
}

// ---------- Footer wordmark ----------
const wm = $("#wordmark");
wm.innerHTML = [..."4dtruth"].map((c, i) => `<span style="--i:${i}" aria-hidden="true">${c}</span>`).join("");
new IntersectionObserver(([en], o) => { if (en.isIntersecting) { wm.classList.add("in"); o.disconnect(); } }, { threshold: 0.3 }).observe(wm);
$("#year").textContent = new Date().getFullYear();

// ---------- Lightbox ----------
const lb = $("#lightbox"), lbImg = $("#lb-img");
let cur = 0;
function openLB(i) {
  cur = (i + WORKS.length) % WORKS.length;
  const w = WORKS[cur];
  lbImg.classList.remove("ready");
  lbImg.onload = () => requestAnimationFrame(() => lbImg.classList.add("ready"));
  lbImg.src = imgSrc(w);
  lbImg.alt = `${w.title}, by 4dtruth`;
  $("#lb-index").textContent = `${pad2(cur + 1)} / ${pad2(WORKS.length)}`;
  $("#lb-title").textContent = w.title;
  $("#lb-tags").innerHTML = tagHTML(w);
  $("#lb-desc").textContent = w.desc || "";
  if (lbImg.complete && lbImg.naturalWidth) requestAnimationFrame(() => lbImg.classList.add("ready"));
  lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
  lenis ? lenis.stop() : (document.body.style.overflow = "hidden");
}
function closeLB() {
  lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
  lenis ? lenis.start() : (document.body.style.overflow = "");
}
$("#lb-close").onclick = closeLB;
$("#lb-prev").onclick = () => openLB(cur - 1);
$("#lb-next").onclick = () => openLB(cur + 1);
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowRight") openLB(cur + 1);
  if (e.key === "ArrowLeft") openLB(cur - 1);
});

// ---------- Nav: hide on scroll down, show on scroll up ----------
let lastY = 0;
function updateNav() {
  const y = scrollY;
  if (Math.abs(y - lastY) < 2) return;
  root.classList.toggle("nav-hide", y > 140 && y > lastY && !lb.classList.contains("open"));
  lastY = y;
}

// ---------- Main loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(now - last, 50); last = now;
  if (lenis) lenis.raf(now);
  updateIntro();
  updateFill();
  updateParallax();
  updateMarquee(dt);
  updateNav();
  reelStep(now);
  requestAnimationFrame(frame);
}

// ---------- Boot: loader sequence ----------
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const videoReady = new Promise((res) => {
  const v = $("#hero-video");
  if (v.readyState >= 2) return res();
  v.addEventListener("loadeddata", res, { once: true });
  setTimeout(res, 2500);
});

async function boot() {
  if (lenis) lenis.stop();
  window.scrollTo(0, 0);
  await document.fonts.ready;
  splitAll();
  $$("[data-split]").forEach((el) => { if (!el.closest(".hero, .testi-q")) revealIO.observe(el); });
  requestAnimationFrame(frame);

  const loader = $("#loader");
  if (reduced) {
    loader.remove(); root.classList.remove("is-loading");
    heroTitle.classList.add("in");
    return;
  }
  // Hero starts as a small frame in the centre (hidden behind the loader)
  const hs = hero.style;
  const setFrame = (t, r, b, l, rad) => { hs.setProperty("--ht", t); hs.setProperty("--hr", r); hs.setProperty("--hb", b); hs.setProperty("--hl", l); hs.setProperty("--hrad", rad); };
  setFrame("50%", "50%", "50%", "50%", "4px");
  hs.setProperty("--hs", "1.35");

  await Promise.all([wait(2300), videoReady]);
  // Ring dissolves; the hero frame appears where the ring was
  loader.classList.add("out");
  hero.style.transition = "clip-path .7s cubic-bezier(.771,.029,.189,1.007)";
  loader.style.background = "transparent";
  setFrame("38%", "41%", "38%", "41%", "4px");
  await wait(650);
  // ...and opens to full bleed
  hero.style.transition = "clip-path 1.25s cubic-bezier(.771,.029,.189,1.007)";
  $("#hero-video").style.transition = "transform 1.6s cubic-bezier(.771,.029,.189,1.007)";
  setFrame("0%", "0%", "0%", "0%", "0px");
  hs.setProperty("--hs", "1.08");
  await wait(750);
  root.classList.remove("is-loading");
  heroTitle.classList.add("in");
  loader.classList.add("gone");
  await wait(700);
  hero.style.transition = "";
  $("#hero-video").style.transition = "";
  if (lenis) lenis.start();
  setTimeout(() => loader.remove(), 600);
}
boot();

// Re-split text on width change
let rw = innerWidth, rt;
addEventListener("resize", () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    if (innerWidth === rw) return;
    rw = innerWidth;
    $$("[data-split]").forEach((el) => {
      const was = el.classList.contains("in");
      split(el);
      if (was) el.classList.add("in");
    });
  }, 200);
});
