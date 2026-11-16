/* 4dtruth: home page (landing) */
(() => {
  const { $, $$, clamp, lerp, easeInOut, pad2, wait, reduced, lenis, imgSrc, pieceUrl, tagsFor, card, bySlug, onFrame, ready } = FDT;
  const WORKS = window.WORKS, THEMES = window.THEMES;
  const root = document.documentElement;

  // ---------- Selected work (6) ----------
  const SELECTED = [["moments-we-share"], ["open-market-2"], ["city-in-layers", 1], ["the-weight-of-beauty"], ["the-golden-path"], ["ojude-series", 1]];
  $("#grid").innerHTML = SELECTED.map(([s, wide]) => card(bySlug(s), { wide })).join("");

  // ---------- Series accordion ----------
  const row = $("#series-row");
  row.innerHTML = THEMES.map((t, i) => {
    const n = WORKS.filter((w) => w.theme === t.id).length;
    return `<a class="sp${i === 0 ? " act" : ""}" href="work.html?theme=${t.id}">
      <img src="assets/works/${t.cover}.jpg" alt="" loading="lazy" />
      <span class="sp-n">${pad2(i + 1)}</span>
      <span class="sp-v">${t.name}</span>
      <div class="sp-panel"><div><h3>${t.name}</h3><p>${t.blurb}</p></div><span class="mono">${pad2(n)} work${n > 1 ? "s" : ""} ↗</span></div>
    </a>`;
  }).join("");
  const sps = $$(".sp", row);
  sps.forEach((sp) => sp.addEventListener("mouseenter", () => { sps.forEach((o) => o.classList.toggle("act", o === sp)); }));

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

  // ---------- Statements slider ----------
  const withDesc = WORKS.filter((w) => w.desc);
  $("#testi-bgs").innerHTML = withDesc.map((w) => `<div class="testi-bg" style="background-image:url(${imgSrc(w)})"></div>`).join("");
  $("#testi-quotes").innerHTML = withDesc.map((w) => `<div class="testi-q">
      <blockquote data-split="wipe">“${w.desc}”</blockquote>
      <div class="meta"><a href="${pieceUrl(w)}">${w.title} ↗</a></div>
    </div>`).join("");
  $("#testi-tabs").innerHTML = withDesc.map((w, i) => `<button class="testi-tab" role="tab" data-k="${i}">${w.title}<i></i></button>`).join("");
  const tBg = $$(".testi-bg"), tQ = $$(".testi-q"), tTab = $$(".testi-tab"), tIdx = $("#testi-index");
  let tI = -1, tTimer = null, tActive = false;
  const T_DUR = 7000;
  function showT(n) {
    n = (n + withDesc.length) % withDesc.length;
    if (tI >= 0) {
      tBg[tI].classList.remove("act"); tQ[tI].classList.remove("act"); tTab[tI].classList.remove("act");
      $$("[data-split]", tQ[tI]).forEach((el) => el.classList.remove("in"));
    }
    tI = n;
    tBg[n].classList.add("act"); tQ[n].classList.add("act");
    const tab = tTab[n]; void tab.offsetWidth; tab.classList.add("act"); tab.style.setProperty("--dur", `${T_DUR}ms`);
    requestAnimationFrame(() => $$("[data-split]", tQ[n]).forEach((el) => el.classList.add("in")));
    tIdx.textContent = `${pad2(n + 1)}/${pad2(withDesc.length)}`;
    clearTimeout(tTimer);
    if (tActive) tTimer = setTimeout(() => showT(tI + 1), T_DUR);
  }
  tTab.forEach((b) => b.addEventListener("click", () => showT(+b.dataset.k)));
  ready.then(() => new IntersectionObserver(([en]) => {
    tActive = en.isIntersecting;
    if (tActive) showT(tI < 0 ? 0 : tI); else clearTimeout(tTimer);
  }, { threshold: 0.35 }).observe($("#statements")));

  // ---------- More Work marquee (speed reacts to scroll velocity) ----------
  const track = $("#marquee-track");
  const mq = WORKS.map((w) => `<a class="mq" href="${pieceUrl(w)}"><img src="assets/works/thumbs/${w.slug}.jpg" alt="${w.title}" loading="lazy" /><span>${w.title}</span></a>`).join("");
  track.innerHTML = mq + mq;
  $("#more-count").textContent = String(WORKS.length).padStart(3, "0");
  let mqX = 0, mqHover = false, mqSpeed = 0.6;
  track.addEventListener("mouseenter", () => (mqHover = true));
  track.addEventListener("mouseleave", () => (mqHover = false));
  onFrame((now, dt) => {
    if (reduced) return;
    const vel = lenis ? Math.abs(lenis.velocity || 0) : 0;
    mqSpeed = lerp(mqSpeed, (mqHover ? 0.12 : 0.6) + Math.min(vel * 0.35, 14), 0.08);
    mqX -= mqSpeed * (dt / 16.67);
    const half = track.scrollWidth / 2;
    if (half && -mqX >= half) mqX += half;
    track.style.transform = `translate3d(${mqX.toFixed(2)}px,0,0)`;
  });

  // ---------- Hero / reel ----------
  const intro = $(".intro"), pin = $(".intro-pin"), hero = $("#hero"), heroContent = $("#hero-content");
  const reel = $("#reel"), reelMedia = $("#reel-media"), reelCount = $("#reel-count"), scrollHint = $(".hero-scroll");
  const REEL = ["moments-we-share", "ojude-series", "the-golden-path", "city-in-layers", "open-market-2", "the-weight-of-beauty", "vibrant-vision-2", "red-carpet"];
  reelMedia.innerHTML = REEL.map((s, i) => `<img src="assets/works/${s}.jpg" alt=""${i ? ' loading="lazy"' : ""} />`).join("");
  const reelImgs = $$("img", reelMedia);
  reelImgs[0].classList.add("act");
  let reelI = 0, reelT = 0, reelBig = 0;
  onFrame((now) => {
    // corner tile cycles; slower once it has become the reel
    if (now - reelT >= (reelBig > 0.5 ? 2400 : 1300)) {
      reelT = now;
      reelImgs[reelI].classList.remove("act");
      reelI = (reelI + 1) % reelImgs.length;
      const img = reelImgs[reelI]; void img.offsetWidth; img.classList.add("act");
      reelCount.textContent = `${pad2(reelI + 1)}/${pad2(reelImgs.length)}`;
    }
    // tile -> reel expansion
    const W = innerWidth, H = pin.offsetHeight;
    const p = clamp(-intro.getBoundingClientRect().top / (intro.offsetHeight - H));
    const e = easeInOut(p); reelBig = e;
    const pd = W < 860 ? 16 : 20, w0 = W < 860 ? 132 : 233, h0 = Math.round(w0 * 0.615);
    const s = reel.style;
    s.setProperty("--rx", `${lerp(W - pd - w0, pd, e)}px`); s.setProperty("--ry", `${lerp(H - pd - h0, pd, e)}px`);
    s.setProperty("--rw", `${lerp(w0, W - pd * 2, e)}px`); s.setProperty("--rh", `${lerp(h0, H - pd * 2, e)}px`);
    s.setProperty("--rr", `${lerp(2, 5, e)}px`); s.setProperty("--rp", e.toFixed(3));
    s.setProperty("--rl", clamp((e - 0.55) / 0.3).toFixed(3));
    if (!root.classList.contains("is-loading")) {
      hero.style.setProperty("--hs", (1.02 - 0.02 * e).toFixed(4));
      heroContent.style.opacity = (1 - clamp(e * 1.8)).toFixed(3);
      heroContent.style.transform = `translateY(${-e * 70}px)`;
      scrollHint.style.setProperty("--so", (1 - clamp(e * 4)).toFixed(3));
    }
  });

  // ---------- Intro: hand-off from the wordmark preloader into the hero ----------
  const video = $("#hero-video");
  const played = root.classList.contains("preload");

  async function boot() {
    if (lenis) lenis.stop();
    await ready;
    const hs = hero.style;
    const setFrame = (t, r, b, l, rad) => { hs.setProperty("--ht", t); hs.setProperty("--hr", r); hs.setProperty("--hb", b); hs.setProperty("--hl", l); hs.setProperty("--hrad", rad); };
    if (played && !reduced) {
      // While the preloader runs, the hero waits as a small frame in the centre...
      setFrame("38%", "41%", "38%", "41%", "4px");
      hs.setProperty("--hs", "1.12");
      await FDT.preloaded;
      await wait(450);
      // ...then opens to full bleed as the panel wipes away
      hero.style.transition = "clip-path 1.3s cubic-bezier(.771,.029,.189,1.007)";
      video.style.transition = "transform 1.6s cubic-bezier(.771,.029,.189,1.007)";
      setFrame("0%", "0%", "0%", "0%", "0px");
      hs.setProperty("--hs", "1.02");
      await wait(800);
      root.classList.remove("is-loading");
      heroContent.classList.add("in"); $$("[data-split]", heroContent).forEach((el) => el.classList.add("in"));
      await wait(700);
      hero.style.transition = ""; video.style.transition = "";
    } else {
      root.classList.remove("is-loading");
      await wait(250);
      heroContent.classList.add("in"); $$("[data-split]", heroContent).forEach((el) => el.classList.add("in"));
    }
    if (lenis) lenis.start();
  }
  boot();
})();
