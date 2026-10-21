// Card "fightCard" (reel21, 21/10): boxing fight cards in very big type, for a card beside the speaker in a 3D set
// (side(t, "left", { fit: true, scale: 0.62 })): every text is 97 px or more, about 60 px on the phone.
//
// st.fightCard(R, { id, at, out, mode: "poster", top: { app, count: { from, to, t0, t1 }, unit }, left: { text, at },
//   right: { text, at }, vs, foot: { text, at }, w, h, x })
//   the fight poster: a top bar (an app tile of the kit, a counter that runs, its unit), then the two bands slam in on
//   their words (`left` on top in red, `right` under it in blue, the VS badge after the second; both wait as faint ghosts
//   until then), a foot line pops under them
// st.fightCard(R, { id, at, out, mode: "tape", corner: "red" | "blue" | "dark", head: { app | emoji, text },
//   rows: [{ big, sub, at, size, tone: "red" | "green", pill }], foot: { text, at }, w, h, x })
//   a fighter's card ("tale of the tape"): a band in the corner's colour with its tile and name, then one row per stat,
//   each popping on its word: `big` (150 px by default, `size` to change it), `sub` a line under it (97 px); `pill`: the
//   row is an orange pill (the price of the extra); `tone`: the big text in red or green; foot: a grey pill at the bottom
// Example: st.fightCard(R, { id: "human", mode: "tape", at: C.clic2, out: L[5].t - 0.38, corner: "red",
//   head: { emoji: "🧑", text: "Human setter" }, rows: [{ big: "$13-21/hr", sub: "+ commission", at: C.thirteen }] });
import { STAGE, mount, inOut, popIn, counter, app } from "./stage.js";

const tile = (h) => (h.app ? app(h.app, 104) : `<span class="fc-emo">${h.emoji}</span>`);

export function fightCard(R, { id = "fc", at, out, mode = "tape", w = 900, h, x, ...o }) {
  const X = x ?? STAGE.x + (STAGE.w - w) / 2;
  if (mode === "poster") return poster(R, { id, at, out, w, h, x: X, ...o });
  const { corner = "red", head, rows = [], foot } = o;
  const body = rows.map((r, k) => `<div class="fc-row${r.pill ? " pill" : ""}" id="${id}-r${k}">` +
    `<div class="big${r.tone ? ` ${r.tone}` : ""}"${r.size ? ` style="font-size: ${r.size}px"` : ""}>${r.big}</div>` +
    (r.sub ? `<div class="sub">${r.sub}</div>` : "") + `</div>`).join("");
  mount(R, id, `s-card fc fc-tape c-${corner}`, `<div class="fc-band">${tile(head)}<b>${head.text}</b></div>` +
    `<div class="fc-body">${body}</div>` + (foot ? `<div class="fc-foot"><span id="${id}-f">${foot.text}</span></div>` : ""), { w, h, x: X });
  inOut(R, id, at, out);
  rows.forEach((r, k) => popIn(R, `#${id}-r${k}`, r.at, r.pill ? { scale: 0.4 } : { x: -50, scale: 0.94 }));
  if (foot) popIn(R, `#${id}-f`, foot.at, { y: 20, scale: 0.7 });
}

function poster(R, { id, at, out, w, h, x, top, left, right, vs = "VS", foot }) {
  mount(R, id, "s-card fc fc-poster", `<div class="fc-top">${app(top.app, 104)}<b class="n" id="${id}-n">${top.count ? top.count.from : ""}</b>` +
    `<span class="u">${top.unit}</span></div>` +
    `<div class="fc-split"><div class="fc-half l" id="${id}-l"><b>${left.text}</b></div><div class="fc-half r" id="${id}-r"><b>${right.text}</b></div>` +
    `<span class="fc-vs" id="${id}-v" data-layout-allow-overlap>${vs}</span></div>` +
    (foot ? `<div class="fc-pfoot" id="${id}-f">${foot.text}</div>` : ""), { w, h, x });
  inOut(R, id, at, out);
  if (top.count) counter(R, document.getElementById(`${id}-n`), top.count);
  // a ghost (CSS opacity 0.14, in place) until its word, then it jumps in from the side; a "to" with keyframes so a
  // backwards seek puts the ghost back in place (a fromTo would leave it shifted aside)
  const slam = (sel, from, t) => R.tl.to(sel, { keyframes: [{ opacity: 1, x: from, scale: 1.25, duration: 0.01 },
    { x: 0, scale: 1, duration: 0.22, ease: "power4.out" }] }, t);
  slam(`#${id}-l`, -160, left.at);
  slam(`#${id}-r`, 160, right.at);
  R.tl.fromTo(`#${id}-v`, { opacity: 0, scale: 2.6, rotation: -20 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.24,
    ease: "back.out(2)", immediateRender: true }, right.at + 0.12);
  if (foot) popIn(R, `#${id}-f`, foot.at, { y: 30, scale: 0.6 });
}
