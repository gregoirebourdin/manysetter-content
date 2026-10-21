// Card "study" (reel20, 21/10): a scientific study in big type, for a card beside the speaker in a 3D set
// (side(t, "left", { fit: true, scale: 0.62 })): the title and the rows read at about 60 px on the phone. Two ways to use it,
// alone or together: a paper (the journal and year on top, a huge title whose *starred* part gets an orange highlighter
// at `mark`, the author), or the finding as compared rows (an emoji tile tinted hot or cold, a label, a short text), each
// popping on its word, an arrow between them.
//
// st.study(R, { id, at, out, w, h, x, head: { text, sub, icon }, title, author, mark, rows, arrow })
//   head: the top line ("Health Psychology", sub "2005"; icon: a Lucide name, "file-text" by default)
//   title: "Hot-cold *empathy gap*" (the starred part is highlighted at `mark`); author: a grey line under it
//   rows: [{ emoji, tint: "hot" | "cold" | undefined, label, text, at }]; arrow: an arrow between the rows (it pops with row 2)
//   w: card width in stage px (default 900); h: a fixed height (default: its content); x: by hand (default centred)
// Example: st.study(R, { id: "s1", at: C.clic2, out: L[5].t - 0.38, head: { text: "Health Psychology", sub: "2005" },
//   title: "Hot-cold *empathy gap*", author: "George Loewenstein", mark: C.hotcold });
import { STAGE, mount, inOut, popIn, icon } from "./stage.js";

export function study(R, { id = "study", at, out, w = 900, h, x, head, title, author, mark, rows = [], arrow = true }) {
  const t = title ? title.replace(/\*(.+?)\*/, `<span class="mk"><i id="${id}-mk"></i><span class="w">$1</span></span>`) : "";
  const row = (r, k) => `<div class="sd-row${r.tint ? ` ${r.tint}` : ""}" id="${id}-r${k}"><span class="sd-em">${r.emoji}</span>` +
    `<div class="sd-col"><div class="sd-lb">${r.label}</div><div class="sd-tx">${r.text}</div></div></div>`;
  const html = (head ? `<div class="sd-head"><span class="sd-ic">${icon(R, head.icon || "file-text")}</span><b>${head.text}</b>` +
    (head.sub ? `<span class="sd-sub">${head.sub}</span>` : "") + `</div>` : "") +
    (title ? `<div class="sd-title">${t}</div>` : "") + (author ? `<div class="sd-by">${author}</div>` : "") +
    (rows.length ? `<div class="sd-rows">${rows.map((r, k) => (k && arrow ? `<div class="sd-arrow" id="${id}-a${k}">${icon(R, "arrow-down")}</div>` : "") +
      row(r, k)).join("")}</div>` : "");
  mount(R, id, `s-card sd${rows.length ? "" : " paper"}`, html, { w, h, x: x ?? STAGE.x + (STAGE.w - w) / 2 });
  inOut(R, id, at, out);
  if (mark != null && title?.includes("*")) {
    R.tl.fromTo(`#${id}-mk`, { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease: "power2.out", immediateRender: true }, mark);
  }
  rows.forEach((r, k) => {
    popIn(R, `#${id}-r${k}`, r.at, { x: -50, scale: 0.94 });
    if (k && arrow) popIn(R, `#${id}-a${k}`, r.at - 0.06, { y: -20, scale: 0.6 });
  });
}
