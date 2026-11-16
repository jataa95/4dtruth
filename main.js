// Artwork data, taken from the 4dtruth Instagram captions.
// Fields left out (size / medium) were not legible in the source screenshots.
const WORKS = [
  {
    slug: "in-one-rhythm", title: "In One Rhythm", size: "34 × 54 in", medium: "Oil on canvas", wide: true,
    desc: "In One Rhythm explores the beauty of unity, movement, and shared identity. Through vibrant colours and rich layers of texture, the figures come together as one, reflecting how individual stories can create a powerful collective rhythm.",
  },
  { slug: "ojude-series", title: "Ojude", size: "3 × 4 ft", medium: "Oil on canvas", series: "Ojude series", wide: true },
  { slug: "open-market-2", title: "Open Market 2", size: "40 × 42 in", medium: "Oil on canvas", series: "Open Market" },
  { slug: "hallelujah", title: "Hallelujah", size: "42 × 54 in", medium: "Oil on canvas" },
  {
    slug: "moments-we-share", title: "Moments We Share", medium: "Oil on canvas",
    desc: "A celebration of human connection, shared experiences, and the beauty found in togetherness. Through vibrant colours and expressive textures, the piece captures the warmth of community and the unforgettable moments that bring us together.",
  },
  { slug: "red-carpet", title: "Red Carpet", size: "3 × 4 ft", medium: "Oil on canvas", series: "Ojude series" },
  {
    slug: "the-weight-of-beauty", title: "The Weight of Beauty", medium: "Oil on canvas",
    desc: "The Weight of Beauty reflects the unseen burdens we carry while becoming who we are. Through vibrant colours, layered textures, and expressive forms, the work explores the beauty found in resilience and identity.",
  },
  { slug: "the-golden-path", title: "The Golden Path", size: "42 × 44 in", medium: "Oil on canvas" },
  { slug: "city-in-layers", title: "City in Layers", size: "3 × 4 ft", medium: "Oil on canvas", wide: true },
  { slug: "vibrant-vision-2", title: "Vibrant Vision 2", size: "3 × 4 ft", medium: "Oil on canvas", series: "Vibrant Vision" },
  { slug: "study-in-red", title: "Study in Red", size: "3 × 4 ft", medium: "Oil on canvas" },
  { slug: "where-the-light-persists", title: "Where the Light Persists", size: "3 × 4 ft" },
  {
    slug: "the-beauty-we-became", title: "The Beauty We Became", size: "54 × 42 in",
    desc: "Reflective and emotional, the work suggests that every layer, fragment, and experience contributed to something beautiful.",
  },
];

const img = (w) => `assets/works/${w.slug}.jpg`;
const tagsFor = (w) => [w.medium, w.size, w.series].filter(Boolean);
const tagHTML = (w) => tagsFor(w).map((t) => `<span class="tag">${t}</span>`).join("");

// Grid
const grid = document.getElementById("grid");
grid.innerHTML = WORKS.map((w, i) => `
  <article class="card reveal${w.wide ? " wide" : ""}" data-i="${i}" tabindex="0" aria-label="${w.title}">
    <div class="card-media"><img src="${img(w)}" alt="${w.title}, by 4dtruth" loading="lazy" /></div>
    <div class="card-info"><h3>${w.title}</h3><div class="tags">${tagHTML(w)}</div></div>
  </article>`).join("");
document.getElementById("work-count").textContent = String(WORKS.length).padStart(3, "0");

// Moving strip (list duplicated so the loop is seamless)
const stripHTML = WORKS.map((w) => `<img src="${img(w)}" alt="" loading="lazy" />`).join("");
document.getElementById("strip").innerHTML = stripHTML + stripHTML;

// Statements slider (works that have a written statement)
const withDesc = WORKS.filter((w) => w.desc);
const track = document.getElementById("statements");
track.innerHTML = withDesc.map((w) => `<blockquote class="statement">“${w.desc}”</blockquote>`).join("");
const slides = [...track.children];
const meta = document.getElementById("statement-meta");
const idx = document.getElementById("statement-index");
let s = 0, timer;
function show(n) {
  s = (n + slides.length) % slides.length;
  slides.forEach((el, k) => el.classList.toggle("active", k === s));
  const w = withDesc[s];
  meta.innerHTML = `${w.title}<small>${tagsFor(w).join(" · ")}</small>`;
  idx.textContent = `${String(s + 1).padStart(2, "0")}/${String(slides.length).padStart(2, "0")}`;
  clearInterval(timer);
  timer = setInterval(() => show(s + 1), 8000);
}
document.getElementById("prev").onclick = () => show(s - 1);
document.getElementById("next").onclick = () => show(s + 1);
show(0);

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
let cur = 0;
function openLB(i) {
  cur = (i + WORKS.length) % WORKS.length;
  const w = WORKS[cur];
  lbImg.src = img(w);
  lbImg.alt = `${w.title}, by 4dtruth`;
  document.getElementById("lb-title").textContent = w.title;
  document.getElementById("lb-tags").innerHTML = tagHTML(w);
  document.getElementById("lb-desc").textContent = w.desc || "";
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLB() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
grid.addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) openLB(+c.dataset.i); });
grid.addEventListener("keydown", (e) => { const c = e.target.closest(".card"); if (c && e.key === "Enter") openLB(+c.dataset.i); });
document.getElementById("lb-close").onclick = closeLB;
document.getElementById("lb-prev").onclick = () => openLB(cur - 1);
document.getElementById("lb-next").onclick = () => openLB(cur + 1);
lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowRight") openLB(cur + 1);
  if (e.key === "ArrowLeft") openLB(cur - 1);
});

// Header: white over the hero, solid after
const header = document.getElementById("header");
const hero = document.querySelector(".hero");
const onScroll = () => header.classList.toggle("solid", window.scrollY > hero.offsetHeight - 60);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
