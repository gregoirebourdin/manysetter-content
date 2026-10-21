// Card "priceTag" (reel12, 21/10): a price on its own, a big paper tag with nothing around it ("$1,500" and a line under
// it), then orange "?" popping around it and a question pill under it ("fixes… what?"). For a card beside the speaker in
// a 3D set (side(t, "left", { fit: true, scale: 0.62 })): the price is 210 px, the line and the pill 96 px (60 px on screen).
//
// st.priceTag(R, { id, at, out, price, sub, qs, ask: { text, at }, swap: { to, at }, w, h })
//   qs: the times the three "?" pop; ask: the pill under the tag; swap: the price is struck and `to` is stamped over it
// Example: st.priceTag(R, { id: "tag", at: C.clic2, out: L[6].t - 0.38, price: "$1,500", sub: "12 weeks",
//   qs: [C.q1, C.q2, C.q3], ask: { text: "fixes… what?", at: C.fixes } });
import { STAGE, mount, inOut, popIn } from "./stage.js";

const SPOTS = [[8, -10, -14], [866, 20, 12], [850, 300, -8]]; // where the "?" pop (left, top, rotation): around the tag, off the price

export function priceTag(R, { id = "tag", at, out, price, sub, qs = [], ask, swap, w = STAGE.w, h = 620 }) {
  const q = qs.map((_, k) => `<span class="pt-q" id="${id}-q${k}" data-layout-allow-overlap style="left: ${SPOTS[k % 3][0]}px; top: ${SPOTS[k % 3][1]}px">?</span>`).join("");
  mount(R, id, "pt", `<div class="pt-tag" id="${id}-g"><div class="pt-p"><span class="o">${price}<i id="${id}-x"></i></span>` +
    (swap ? `<span class="n" id="${id}-n" data-layout-allow-overlap>${swap.to}</span>` : "") + `</div>${sub ? `<div class="pt-s">${sub}</div>` : ""}</div>` + q +
    (ask ? `<div class="pt-ask" id="${id}-a">${ask.text}</div>` : ""), { h, w, x: STAGE.x + (STAGE.w - w) / 2 });
  inOut(R, id, at, out);
  qs.forEach((t, k) => R.tl.fromTo(`#${id}-q${k}`, { opacity: 0, scale: 0.3, rotation: 0 },
    { opacity: 1, scale: 1, rotation: SPOTS[k % 3][2], duration: 0.26, ease: "back.out(2.6)", immediateRender: true }, t));
  if (ask) {
    popIn(R, `#${id}-a`, ask.at, { y: 30, scale: 0.6 });
    R.tl.fromTo(`#${id}-g`, { rotation: -4 }, { rotation: 3, duration: 0.1, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, ask.at);
  }
  if (swap) {
    R.tl.fromTo(`#${id}-x`, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "power2.out", immediateRender: true }, swap.at);
    R.tl.fromTo(`#${id}-n`, { opacity: 0, scale: 2.2, rotation: -16 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.24,
      ease: "back.out(2.4)", immediateRender: true }, swap.at + 0.12);
  }
}
