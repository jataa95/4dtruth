/* 4dtruth: work page (filterable grid / list) */
(() => {
  const { $, $$, pad2, pad3, wait, imgSrc, pieceUrl, card, prepare, ready, onFrame, lerp } = FDT;
  const WORKS = window.WORKS, THEMES = window.THEMES;
  const params = new URLSearchParams(location.search);
  let theme = THEMES.some((t) => t.id === params.get("theme")) ? params.get("theme") : "all";
  let view = params.get("view") === "list" ? "list" : "grid";

  $("#total").textContent = pad3(WORKS.length);
  const chips = $("#chips");
  chips.innerHTML = [{ id: "all", name: "All" }, ...THEMES].map((t) => {
    const n = t.id === "all" ? WORKS.length : WORKS.filter((w) => w.theme === t.id).length;
    return `<button class="chip" role="tab" data-theme="${t.id}">${t.name}<sup>${pad2(n)}</sup></button>`;
  }).join("");

  const grid = $("#grid3"), list = $("#list");
  const themeName = (id) => (THEMES.find((t) => t.id === id) || {}).name || "";
  const items = () => WORKS.filter((w) => theme === "all" || w.theme === theme);

  function render() {
    const ws = items();
    grid.innerHTML = ws.map((w) => card(w)).join("");
    list.innerHTML = ws.map((w) => `
      <a class="row" href="${pieceUrl(w)}" data-slug="${w.slug}" data-reveal>
        <span class="mono">${pad2(WORKS.indexOf(w) + 1)}</span>
        <span class="row-t">${w.title}</span>
        <span class="mono hide-sm">${themeName(w.theme)}</span>
        <span class="mono hide-sm hide-md">${w.size || "—"}</span>
        <span class="mono hide-sm hide-md">${w.medium || "—"}</span>
        <span class="arr">↗</span>
      </a>`).join("");
    $$(".chip[data-theme]").forEach((c) => c.classList.toggle("act", c.dataset.theme === theme));
    $$("[data-view]").forEach((c) => c.classList.toggle("act", c.dataset.view === view));
    grid.hidden = view !== "grid"; list.hidden = view !== "list";
    prepare(grid); prepare(list);
    // rows fade in with a stagger
    $$(".row", list).forEach((r, i) => { r.style.transition = `opacity .8s cubic-bezier(.771,.029,.189,1.007) ${i * 40}ms, transform .8s cubic-bezier(.771,.029,.189,1.007) ${i * 40}ms`; r.classList.add("fade"); });
    const q = new URLSearchParams();
    if (theme !== "all") q.set("theme", theme);
    if (view !== "grid") q.set("view", view);
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  async function swap(fn) {
    grid.classList.add("is-swapping"); list.classList.add("is-swapping");
    await wait(350);
    fn(); render();
    requestAnimationFrame(() => { grid.classList.remove("is-swapping"); list.classList.remove("is-swapping"); });
  }
  chips.addEventListener("click", (e) => { const c = e.target.closest("[data-theme]"); if (c && c.dataset.theme !== theme) swap(() => (theme = c.dataset.theme)); });
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.view !== view) swap(() => (view = b.dataset.view)); }));

  // ---------- List: floating preview follows the cursor ----------
  const prev = $("#preview"), prevImg = $("#preview-img");
  let tx = 0, ty = 0, x = 0, y = 0, cur = null;
  list.addEventListener("mousemove", (e) => { tx = e.clientX + 24; ty = e.clientY - 160; });
  list.addEventListener("mouseover", (e) => {
    const r = e.target.closest(".row");
    if (!r || r.dataset.slug === cur) return;
    cur = r.dataset.slug;
    prevImg.src = `assets/works/${cur}.jpg`;
    prev.classList.add("show");
  });
  list.addEventListener("mouseleave", () => { prev.classList.remove("show"); cur = null; });
  onFrame(() => {
    x = lerp(x, tx, 0.14); y = lerp(y, ty, 0.14);
    prev.style.setProperty("--x", `${x}px`); prev.style.setProperty("--y", `${y}px`);
  });

  render();
})();
