// Card "adMetric" (reel18): an ad result in very big type, for a card beside the speaker (text ≈ 97 px, so ≈ 60 px on
// screen at 62 %). A header (a blue chart tile, "Ads Manager"), the metric's name, one line per word, a huge number
// that runs up, then rows that pop on their words, each with a green check or a red cross ("people who messaged you ✓",
// "who got an answer ✗"). The metric's name is Meta's own ("Messaging conversations started"); the number is the
// reader's situation, never a result.
//   st.adMetric(R, { id, at, out, w, h, head, period (a grey label on the right, if it fits), name: [lines],
//                    count: { from, to, t0, t1 }, up: { text, at }, rows: [{ text, ok: true | false, at }] })
import { mount, inOut, popIn, icon, clamp, ease3 } from "./stage.js";

export function adMetric(R, { id = "adm", at, out, w = 900, h, head = "Ads Manager", period, name, count, up, rows = [] }) {
  const html = `<div class="adm-head"><span class="adm-ic">${icon(R, "chart-column")}</span><b>${head}</b>` +
      (period ? `<span class="adm-per">${period}</span>` : "") + `</div>` +
    `<div class="adm-name">${name.join("<br>")}</div>` +
    `<div class="adm-num"><span id="${id}-n">${count.from ?? 0}</span>` +
      (up ? `<span class="adm-up" id="${id}-u">${up.text}</span>` : "") + `</div>` +
    rows.map((r, k) => `<div class="adm-row ${r.ok ? "ok" : "no"}" id="${id}-r${k}">` +
      `<span class="adm-mk">${icon(R, r.ok ? "check" : "x")}</span><b>${r.text}</b></div>`).join("");
  mount(R, id, "s-card adm", html, { w, h });
  inOut(R, id, at, out);
  const el = document.getElementById(`${id}-n`), from = count.from ?? 0;
  R.onFrame((t) => (el.textContent = String(Math.round(from + (count.to - from) * ease3(clamp((t - count.t0) / (count.t1 - count.t0)))))));
  if (up) popIn(R, `#${id}-u`, up.at, { x: -30, scale: 0.6 });
  rows.forEach((r, k) => popIn(R, `#${id}-r${k}`, r.at, { x: -50, scale: 0.94 }));
}
