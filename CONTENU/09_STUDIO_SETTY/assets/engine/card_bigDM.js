// Card "bigDM" (reel12, 21/10): an Instagram DM thread in very big type, for a card beside the speaker in a 3D set
// (side(t, "left", { fit: true, scale: 0.62 })): the bubbles are 96 px, about 60 px on the phone. So: few, short bubbles
// (about 15 characters a line); 3 lines of bubbles + the header is what fits between the hook title and the captions.
//
// st.bigDM(R, { id, at, out, user, color, status, status2: { text, at }, title, msgs, w, h, x })
//   user / color / status: the header (Instagram tile, the lead's initials on `color`, the name, "Active now"…)
//   status2: the status turns red at `at` ("Active 2d ago"); title: a compact header instead (the tile + a title, no avatar)
//   head: false: no header at all (a small Instagram tile sits in the corner)
//   msgs: [{ me, text, at, seen: { text, at }, time, typing, swap: { from, to, at } }]
//     me: the coach's side (right, Instagram's purple gradient); else the lead (left, grey)
//     seen: a grey line under the bubble ("Seen Tuesday"); time: a grey label left of a "me" bubble ("+3 h")
//     typing: the bubble pops at `typing` as "…" and its text replaces the dots at `at` (text null: dots only)
//     swap: put {swap} in the text; at `swap.at` the `from` part is struck and `to` is written over it in orange ("$999?")
//   w: card width in stage px (default 960); h: a fixed height (default: its content); x: by hand (default centred)
// Example: st.bigDM(R, { id: "dm", at: C.clic1, out: L[4].t - 0.38, user: "kev.trains", color: "#0ea5e9",
//   status2: { text: "Active 2d ago", at: C.tue }, msgs: [{ text: "how much?", at: C.how },
//   { me: true, text: "{swap}, 12 weeks", swap: { from: "$1,500", to: "$999?", at: C.nine }, at: C.fifteen,
//     seen: { text: "Seen Tuesday", at: C.seen } }] });
import { STAGE, app, mount, inOut, popIn, initials } from "./stage.js";

export function bigDM(R, { id = "bdm", at, out, user = "lead", color = "#d6249f", status = "Active now", status2, title, head = true,
  msgs, w = STAGE.w, h, x }) {
  const dots = `<span class="dots"><i></i><i></i><i></i></span>`;
  const body = msgs.map((m, k) => {
    const txt = m.text == null ? "" : m.swap
      ? m.text.replace("{swap}", `<span class="sw"><span class="o">${m.swap.from}<i id="${id}-x${k}"></i></span><span class="n" id="${id}-n${k}">${m.swap.to}</span></span>`)
      : m.text;
    return `<div class="bdm-m ${m.me ? "me" : "them"}" id="${id}-m${k}"><div class="row">` +
      (m.time ? `<span class="tm">${m.time}</span>` : "") +
      `<div class="b">${m.typing != null || m.text == null ? dots : ""}<span class="t" id="${id}-t${k}">${txt}</span></div></div>` +
      (m.seen ? `<div class="seen" id="${id}-s${k}">${m.seen.text}</div>` : "") + `</div>`;
  }).join("");
  const top = !head ? `<span class="corner">${app("instagram", 64)}</span>`
    : title ? `<div class="bdm-head compact">${app("instagram", 72)}<b>${title}</b></div>`
      : `<div class="bdm-head">${app("instagram", 80)}<span class="s-av" style="background: ${color}">${initials(user)}</span>` +
        `<div><div class="u">${user}</div><div class="s"><span id="${id}-st">${status}</span>` +
        (status2 ? `<span class="s2" id="${id}-st2">${status2.text}</span>` : "") + `</div></div></div>`;
  mount(R, id, `s-card bdm${head ? "" : " nohead"}`, `${top}<div class="bdm-body">${body}</div>`, { h, w, x: x ?? STAGE.x + (STAGE.w - w) / 2 });
  inOut(R, id, at, out);
  msgs.forEach((m, k) => {
    const typed = m.typing != null && m.text != null;
    popIn(R, `#${id}-m${k}`, m.typing ?? m.at);
    if (typed) { // the dots, then the words in their place
      R.tl.set(`#${id}-m${k} .dots`, { display: "flex" }, m.typing);
      R.tl.set(`#${id}-t${k}`, { display: "none" }, m.typing);
      R.tl.set(`#${id}-m${k} .dots`, { display: "none" }, m.at);
      R.tl.set(`#${id}-t${k}`, { display: "inline" }, m.at);
    } else if (m.text == null) R.tl.set(`#${id}-m${k} .dots`, { display: "flex" }, m.typing ?? m.at);
    if (m.seen) R.tl.fromTo(`#${id}-s${k}`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, m.seen.at);
    if (m.swap) {
      R.tl.fromTo(`#${id}-x${k}`, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "power2.out", immediateRender: true }, m.swap.at);
      R.tl.fromTo(`#${id}-n${k}`, { opacity: 0, scale: 2.2, rotation: -14 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.24,
        ease: "back.out(2.4)", immediateRender: true }, m.swap.at + 0.12);
    }
  });
  if (status2) {
    R.tl.set(`#${id}-st`, { display: "none" }, status2.at);
    R.tl.set(`#${id}-st2`, { display: "inline" }, status2.at);
    popIn(R, `#${id}-st2`, status2.at, { scale: 0.7 });
  }
}
