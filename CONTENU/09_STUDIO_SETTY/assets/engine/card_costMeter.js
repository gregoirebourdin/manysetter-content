// Card "costMeter" (reel17): running costs in big type, for a card beside the speaker (text ≈ 97 px, so ≈ 60 px on screen
// at 62 %). An optional header, then one row per cost, popping on its word: a round badge (a colour and a Lucide icon),
// a number that runs from `from` to `to` between t0 and t1 (it can run down: "0 weekends"), and its unit. Demo values.
//   st.costMeter(R, { id, at, out, w, h, head, rows: [{ icon, color, from, to, t0, t1, unit, at, bad }] })
//   (bad: the number turns red once it has run)
import { mount, inOut, popIn, icon, clamp, ease3 } from "./stage.js";

const fmt = (n) => Math.round(n).toLocaleString("en-US");

export function costMeter(R, { id = "cm", at, out, w = 900, h = 900, head, rows }) {
  const html = (head ? `<div class="cmt-head"><b>${head}</b></div>` : "") +
    rows.map((r, k) => `<div class="cmt-row" id="${id}-r${k}"><span class="cmt-dot" style="background: ${r.color}">${icon(R, r.icon)}</span>` +
      `<div class="cmt-txt"><span class="cmt-n" id="${id}-n${k}">${fmt(r.from)}</span><span class="cmt-u">${r.unit}</span></div></div>`).join("");
  mount(R, id, "s-card cmt", html, { w, h });
  inOut(R, id, at, out);
  rows.forEach((r, k) => {
    popIn(R, `#${id}-r${k}`, r.at, { x: -50, scale: 0.94 });
    const el = document.getElementById(`${id}-n${k}`);
    R.onFrame((t) => {
      const p = clamp((t - r.t0) / (r.t1 - r.t0));
      el.textContent = fmt(r.from + (r.to - r.from) * ease3(p));
      el.classList.toggle("bad", !!r.bad && p >= 1);
    });
  });
}
