// Card "bigText" (reel16, 21/10): the carousel's black slide as a card beside the speaker in a 3D set (side(t, "left",
// { fit: true, scale: 0.62 })): a black card, 2 or 3 very short lines of white text in very big type (104 px, about
// 64 px on the phone), each line pops on its word, and one part of a line gets the orange highlighter on its word.
// About 14 characters a line fit at the default width.
//
// st.bigText(R, { id, at, out, lines: [{ text, at, mark: { text, at } }], tone, w, h })
//   lines: each line pops at `at` (default: with the card); mark: `text` (a substring of the line) is swept with the
//   brand's orange highlighter at `mark.at`; tone: "light" for a white card with dark text (default: the black slide)
// Example: st.bigText(R, { id: "turn", at: C.clic3, out: L[6].t - 0.38, lines: [{ text: "$600 a month", at: C.six },
//   { text: "for a reply", at: C.for }, { text: "3 hours late", at: C.three, mark: { text: "3 hours late", at: C.three } }] });
import { STAGE, mount, inOut, popIn } from "./stage.js";

export function bigText(R, { id = "btx", at, out, lines, tone, w = STAGE.w, h }) {
  const html = lines.map((ln, k) => {
    const txt = ln.mark ? ln.text.replace(ln.mark.text, `<mark id="${id}-m${k}">${ln.mark.text}</mark>`) : ln.text;
    return `<div class="btx-l" id="${id}-l${k}">${txt}</div>`;
  }).join("");
  mount(R, id, `btx${tone === "light" ? " light" : ""}`, html, { w, h, x: STAGE.x + (STAGE.w - w) / 2 });
  inOut(R, id, at, out);
  lines.forEach((ln, k) => {
    if (ln.at != null && ln.at > at) popIn(R, `#${id}-l${k}`, ln.at, { y: 40, scale: 0.9 });
    if (ln.mark) R.tl.fromTo(`#${id}-m${k}`, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.3,
      ease: "power2.out", immediateRender: true }, ln.mark.at);
  });
}
