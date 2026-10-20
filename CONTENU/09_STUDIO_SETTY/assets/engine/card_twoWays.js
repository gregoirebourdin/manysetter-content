// Card "twoWays" (reel14): two ways out, in big type, for a card beside the speaker (text ≈ 97 px, so ≈ 60 px on screen
// at 62 %). An optional header (an app tile of the kit and a name), then one row per way: who (bold), and below it the
// way out (an app tile of the kit, or an emoji tile, and the destination); each row pops on its word, its check after.
//   st.twoWays(R, { id, at, out, w, h, head: { app, text }, rows: [{ who, app | emoji, to, at, ok, hi }] } (hi: the row in the brand tint)
import { mount, inOut, popIn, icon, app } from "./stage.js";

export function twoWays(R, { id = "tw", at, out, w = 900, h = 700, head, rows }) {
  const tile = (r) => (r.app ? app(r.app, 116) : `<span class="tw-emo">${r.emoji}</span>`);
  const html = (head ? `<div class="tw-head">${app(head.app, 104)}<b>${head.text}</b></div>` : "") +
    rows.map((r, k) => `<div class="tw-row${r.hi ? " hi" : ""}" id="${id}-r${k}"><div class="tw-who">${r.who}</div>` +
      `<div class="tw-to">${tile(r)}<b>${r.to}</b></div>` +
      `<span class="tw-ok" id="${id}-k${k}">${icon(R, "check")}</span></div>`).join("");
  mount(R, id, "s-card tw", html, { w, h });
  inOut(R, id, at, out);
  rows.forEach((r, k) => {
    popIn(R, `#${id}-r${k}`, r.at, { x: -50, scale: 0.94 });
    if (r.ok != null) popIn(R, `#${id}-k${k}`, r.ok, { scale: 0.2 });
  });
}
