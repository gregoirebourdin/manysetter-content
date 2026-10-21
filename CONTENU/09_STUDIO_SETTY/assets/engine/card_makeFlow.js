// Card "makeFlow" (reel17): an automation scenario in Make's look, in big type for a card beside the speaker (text ≈ 97 px,
// so ≈ 60 px on screen at 62 %). A header (a tile and the scenario's name), then the steps one under the other: a round
// badge (a colour and a Lucide icon, or an app tile of the kit) and a short label; a dotted line draws from one badge to
// the next when the next step pops. No brand mark is drawn: the tools are named in the labels.
//   st.makeFlow(R, { id, at, out, w, h, head: { icon, color, text }, steps: [{ icon, color | app, text, at }] })
import { mount, inOut, popIn, icon, app } from "./stage.js";

export function makeFlow(R, { id = "mf", at, out, w = 900, h = 900, head, steps }) {
  const badge = (s) => (s.app ? app(s.app, 120) : `<span class="mf-dot" style="background: ${s.color}">${icon(R, s.icon)}</span>`);
  const html = (head ? `<div class="mf-head"><span class="mf-tile" style="background: ${head.color}">${icon(R, head.icon)}</span><b>${head.text}</b></div>` : "") +
    `<div class="mf-steps">` + steps.map((s, k) => `<div class="mf-step" id="${id}-s${k}">` +
      (k ? `<i class="mf-line" id="${id}-l${k}"></i>` : "") + badge(s) + `<b>${s.text}</b></div>`).join("") + `</div>`;
  mount(R, id, "s-card mf", html, { w, h });
  inOut(R, id, at, out);
  steps.forEach((s, k) => {
    if (k) R.tl.fromTo(`#${id}-l${k}`, { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: "power2.out", immediateRender: true }, s.at - 0.18);
    popIn(R, `#${id}-s${k}`, s.at, { x: -50, scale: 0.9 });
  });
}
