// Card "contactsList" (reel13, the 24-hour rule): a coach's Manychat contacts in big type, made to be read at 66–70 %
// beside a speaker (D.side). Two modes: the counter (a huge number that runs, "contacts" under it, a "Send to all"
// button that pops: the blast he plans) and the list (rows with the date of each contact's last DM, the dates turn red
// and a lock lands on each row; under them one chip at a time, each replacing the one before: what's left after 24
// hours). Manychat is written out, never its logo (brief). Same contract as stage.js: id, at, out. Styles:
// card_contactsList.css (rules start with .ctl).
import { mount, inOut, popIn, icon, initials, clamp, ease3 } from "./stage.js";

/** count: { from, to, t0, t1 } (the counter mode), label: the word under it, button: { text, at, icon };
 *  rows: [{ u, c, last }] (the list mode), total: the line in the header ("10,000 contacts"), lock: { at, step } (the
 *  dates turn red and the locks land, one row after the other), chips: [{ at, text, icon ("" for none), tone }] */
export function contactsList(R, { id = "ctl", at, out, title = "Contacts", count, label = "contacts", button, rows, total, lock,
  chips = [], w = 840, h }) {
  const head = `<div class="ctl-hd"><span class="ctl-ic">${icon(R, "users")}</span><b>Manychat</b><span class="ctl-t">${title}</span>` +
    (total ? `<span class="ctl-tot">${total}</span>` : "") + "</div>";
  const body = count
    ? `<div class="ctl-n" id="${id}-n">${count.from.toLocaleString("en-US")}</div><div class="ctl-lb">${label}</div>` +
      (button ? `<div class="ctl-btn" id="${id}-btn">${icon(R, button.icon || "send")}${button.text}</div>` : "")
    : `<div class="ctl-list">${(rows || []).map((r, k) => `<div class="ctl-row" id="${id}-r${k}"><span class="s-av" style="background: ${r.c}">${initials(r.u)}</span>` +
      `<span class="u">${r.u}</span><span class="d" id="${id}-d${k}">${r.last}</span><span class="lk" id="${id}-k${k}">${icon(R, "lock")}</span></div>`).join("")}</div>` +
      `<div class="ctl-chips">${chips.map((c, k) => `<span class="s-pill ctl-chip tone-${c.tone || "amber"}" id="${id}-c${k}" data-layout-allow-overlap>${c.icon === "" ? "" : icon(R, c.icon || "hand")}${c.text}</span>`).join("")}</div>`;
  mount(R, id, `s-card ctl${count ? " ctl-count" : ""}`, head + body, { x: 60 + (960 - w) / 2, w, h: h ?? (count ? 640 : 580) });
  chips.forEach((_, k) => gsap.set(`#${id}-c${k}`, { xPercent: -50 })); // centred (GSAP keeps xPercent apart from x)
  inOut(R, id, at, out);
  if (count) {
    const el = document.getElementById(`${id}-n`);
    R.onFrame((t) => (el.textContent = Math.round(count.from + (count.to - count.from) * ease3(clamp((t - count.t0) / (count.t1 - count.t0)))).toLocaleString("en-US")));
    if (button) popIn(R, `#${id}-btn`, button.at, { y: 30, scale: 0.6 });
  }
  (rows || []).forEach((_, k) => {
    R.tl.set(`#${id}-r${k}`, { opacity: 1 }, 0);
    if (lock) {
      const t = lock.at + k * (lock.step ?? 0.18);
      R.tl.to(`#${id}-d${k}`, { color: "#e0182d", duration: 0.15 }, t);
      popIn(R, `#${id}-k${k}`, t, { scale: 0.2, rotation: -25 });
    }
  });
  chips.forEach((c, k) => {
    popIn(R, `#${id}-c${k}`, c.at, { y: 30, scale: 0.6 });
    if (k > 0) R.tl.to(`#${id}-c${k - 1}`, { opacity: 0, y: -30, duration: 0.14, ease: "power2.in" }, c.at - 0.02);
  });
}
