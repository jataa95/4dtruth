/* 4dtruth: single artwork page (piece.html?w=slug) */
(() => {
  const { $, pad2, imgSrc, pieceUrl, tagHTML, waLink, card, bySlug } = FDT;
  const WORKS = window.WORKS, THEMES = window.THEMES, C = window.CONTACT;
  const slug = new URLSearchParams(location.search).get("w");
  const w = bySlug(slug);
  if (!w) { location.replace("work.html"); return; }

  const i = WORKS.indexOf(w);
  const prev = WORKS[(i - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(i + 1) % WORKS.length];
  const theme = THEMES.find((t) => t.id === w.theme);
  const related = WORKS.filter((o) => o !== w && o.theme === w.theme)
    .concat(WORKS.filter((o) => o !== w && o.theme !== w.theme)).slice(0, 3);

  document.title = `${w.title} | 4dtruth`;
  const meta = document.querySelector('meta[name="description"]');
  meta.setAttribute("content", w.desc || `${w.title}: ${[w.medium, w.size].filter(Boolean).join(", ") || "painting"} by 4dtruth (Seun Okunola), Lagos.`);

  const specs = [["Artist", "Seun Okunola (4dtruth)"], ["Medium", w.medium], ["Size", w.size], ["Series", w.series], ["Theme", theme && theme.name], ["Studio", "Lagos, Nigeria"]]
    .filter(([, v]) => v);
  const enquiry = waLink(`Hi 4dtruth, I'm interested in "${w.title}". Is it available?`);

  $("#piece-root").innerHTML = `
    <section class="piece">
      <div>
        <div class="crumbs mono"><a href="work.html" class="bnd-hov">Work</a><span>/</span>${theme ? `<a href="work.html?theme=${theme.id}" class="bnd-hov">${theme.name}</a><span>/</span>` : ""}<span>${w.title}</span></div>
        <div class="piece-wall" data-reveal><img src="${imgSrc(w)}" alt="${w.title}, oil painting by 4dtruth" /></div>
      </div>
      <aside class="piece-info">
        <span class="mono piece-idx">${pad2(i + 1)} / ${pad2(WORKS.length)}</span>
        <h1 class="piece-title" data-split="wipe">${w.title}</h1>
        <div class="tags" style="justify-content:flex-start;margin-top:22px">${tagHTML(w)}</div>
        ${w.desc ? `<p class="piece-desc" data-split="wipe">${w.desc}</p>` : `<p class="piece-desc" data-split="wipe">Enquire for availability, pricing and delivery.</p>`}
        <dl class="specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
        <div class="piece-btns">
          <a href="${enquiry}" target="_blank" rel="noopener" class="btn"><span class="bnd-hov">Enquire on WhatsApp</span><i>↗</i></a>
          <a href="contact.html?w=${w.slug}" class="btn btn-ghost"><span class="bnd-hov">Send an enquiry</span><i>↗</i></a>
        </div>
        <div class="pager mono">
          <a href="${pieceUrl(prev)}" class="bnd-hov">← ${prev.title}</a>
          <a href="${pieceUrl(next)}" class="bnd-hov">${next.title} →</a>
        </div>
      </aside>
    </section>

    <a class="next" href="${pieceUrl(next)}" data-parallax="0.08" aria-label="Next work: ${next.title}">
      <img src="${imgSrc(next)}" alt="" />
      <div class="next-in">
        <div><p class="mono" style="margin-bottom:14px">Next work</p><div class="next-t">${next.title}</div></div>
        <span class="mono">${pad2(WORKS.indexOf(next) + 1)} / ${pad2(WORKS.length)} ↗</span>
      </div>
    </a>

    <section class="related">
      <div class="sec-head"><h2 class="h2" data-split="wipe">${theme ? `More ${theme.name}` : "More work"}</h2><a href="work.html" class="mono bnd-hov">All work ↗</a></div>
      <div class="grid3">${related.map((o) => card(o)).join("")}</div>
    </section>`;
})();
