/* 4dtruth: about page */
(() => {
  const { $, $$, clamp, pad2, onFrame } = FDT;
  const WORKS = window.WORKS, THEMES = window.THEMES;

  // Studio film: frame opens from an inset as it scrolls into view
  const frame = $("#studio-frame");
  onFrame(() => {
    const r = frame.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / (vh * 0.9));
    frame.style.setProperty("--ci", `${(1 - p) * 8}%`);
    frame.style.setProperty("--cs", (1.15 - 0.15 * p).toFixed(3));
  });

  // Themes accordion (same component as home)
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
  sps.forEach((sp) => sp.addEventListener("mouseenter", () => sps.forEach((o) => o.classList.toggle("act", o === sp))));

  $$(".role").forEach((r) => r.classList.add("fade"));
  $$(".stat").forEach((r) => r.classList.add("fade"));
})();
