// Card "todoList" (reel17): a checklist in big type, for a card beside the speaker (text ≈ 97 px, so ≈ 60 px on screen at
// 62 %). An optional header (an app tile of the kit, or an emoji, and a text), then one row per item, popping on its word,
// with an empty red box ("still yours to do") or a green check that drops on its word.
//   st.todoList(R, { id, at, out, w, h, head: { app | emoji, text }, rows: [{ text, at, ok }] }) (ok: when the check drops;
//   without ok the box stays empty and red)
import { mount, inOut, popIn, icon, app } from "./stage.js";

export function todoList(R, { id = "td", at, out, w = 900, h = 900, head, rows }) {
  const tile = (x) => (x.app ? app(x.app, 104) : `<span class="td-emo">${x.emoji}</span>`);
  const html = (head ? `<div class="td-head">${tile(head)}<b>${head.text}</b></div>` : "") +
    rows.map((r, k) => `<div class="td-row${r.ok != null ? " ok" : ""}" id="${id}-r${k}"><b>${r.text}</b>` +
      `<span class="td-box"><span class="td-ck" id="${id}-k${k}">${icon(R, "check")}</span></span></div>`).join("");
  mount(R, id, "s-card td", html, { w, h });
  inOut(R, id, at, out);
  rows.forEach((r, k) => {
    popIn(R, `#${id}-r${k}`, r.at, { x: -50, scale: 0.94 });
    if (r.ok != null) popIn(R, `#${id}-k${k}`, r.ok, { scale: 0.2 });
  });
}
