/* 4dtruth: contact page: enquiry form that composes a WhatsApp message */
(() => {
  const { $, waLink, bySlug } = FDT;
  const WORKS = window.WORKS;
  const sel = $("#piece");
  sel.insertAdjacentHTML("beforeend", WORKS.map((w) => `<option value="${w.slug}">${w.title}</option>`).join(""));

  // Arriving from an artwork page: preselect it
  const pre = bySlug(new URLSearchParams(location.search).get("w"));
  if (pre) { sel.value = pre.slug; $("#i2").checked = true; }
  sel.addEventListener("change", () => { if (sel.value) $("#i2").checked = true; });

  const form = $("#form");
  const check = (fld, ok) => { fld.classList.toggle("bad", !ok); return ok; };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name").value.trim(), msg = $("#msg").value.trim();
    const ok = [check($("#f-name"), !!name), check($("#f-msg"), !!msg)].every(Boolean);
    if (!ok) return;
    const interest = form.querySelector('input[name="interest"]:checked').value;
    const piece = bySlug(sel.value), size = $("#size").value.trim();
    const text = [
      `Hi 4dtruth, I'm ${name}.`,
      `I'm interested in: ${interest}${piece ? ` ("${piece.title}")` : ""}.`,
      size ? `Space / size: ${size}.` : "",
      "",
      msg,
    ].filter((l, i, a) => l || (i > 0 && a[i - 1])).join("\n");
    window.open(waLink(text), "_blank", "noopener");
    $("#form-done").classList.add("show");
  });
  ["name", "msg"].forEach((id) => $("#" + id).addEventListener("input", (e) => e.target.closest(".fld").classList.remove("bad")));
})();
