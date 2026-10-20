// Card "window24" (reel13, the 24-hour rule): Meta's 24-hour window in big type, made to be read at 66–70 % beside a
// speaker (D.side). A huge clock that runs over a bar (green, then amber, then red), a state pill that changes
// (Open / Closed), one short line under it that changes too (a line can be a lead's DM bubble: it lands and the clock goes
// back to 24:00:00), and a follow-ups mode (rows that pop while the clock keeps running). Same contract as stage.js: id, at, out; it enters
// by zooming in and leaves by zooming through. Styles: card_window24.css (rules start with .w24).
import { mount, inOut, popIn, icon, app, clamp } from "./stage.js";

const HMS = (h) => {
  const s = Math.max(0, Math.round(h * 3600));
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":");
};

/** clock: [{ t0, t1, from, to }] in hours, in time order (the last segment started wins; before the first, its `from`).
 *  states: [{ at, text, tone: "green" | "red" | "amber", icon }] and lines: [{ at, text, icon, tone, dm }]: each replaces
 *  the one before it in the same place (dm: the lead's initial, the line is his DM bubble). rows: [{ at, text, right,
 *  icon }]: the follow-ups mode (the rows take the place of the pill and the line). h: card height (≤ 650 at 70 % keeps
 *  it above the captions under a 3-line title). */
export function window24(R, { id = "w24", at, out, appSlug = "instagram", title = "24-hour window", clock = [], states = [],
  lines = [], rows, w = 840, h = 640 }) {
  const pills = states.map((s, k) => `<span class="s-pill w24-pill tone-${s.tone || "green"}" id="${id}-s${k}" data-layout-allow-overlap>${icon(R, s.icon || "clock")}${s.text}</span>`).join("");
  const lns = lines.map((l, k) => l.dm
    ? `<div class="w24-line w24-dm" id="${id}-l${k}" data-layout-allow-overlap><span class="s-av">${l.dm[0]}</span><div class="b">${l.text}</div></div>`
    : `<div class="w24-line${l.tone ? ` t-${l.tone}` : ""}" id="${id}-l${k}" data-layout-allow-overlap>${icon(R, l.icon || "check")}<span>${l.text}</span></div>`).join("");
  const list = rows ? `<div class="w24-rows">${rows.map((r, k) => `<div class="w24-row" id="${id}-r${k}">${icon(R, r.icon || "send")}` +
    `<span class="x">${r.text}</span><b>${r.right || ""}</b></div>`).join("")}</div>` : "";
  mount(R, id, `w24${rows ? " w24-fu" : ""}`, `<div class="w24-hd">${app(appSlug, 76)}<b>${title}</b></div>` +
    `<div class="w24-clk" id="${id}-t">${HMS(clock[0] ? clock[0].from : 24)}</div><div class="w24-bar"><i id="${id}-bar"></i></div>` +
    (rows ? list : `<div class="w24-st">${pills}</div><div class="w24-ln">${lns}</div>`),
  { x: 60 + (960 - w) / 2, w, h });
  states.forEach((_, k) => gsap.set(`#${id}-s${k}`, { xPercent: -50 })); // centred (GSAP keeps xPercent apart from x)
  inOut(R, id, at, out);
  // the clock and its bar, every frame (seek-safe: computed from t only)
  const tEl = document.getElementById(`${id}-t`), bar = document.getElementById(`${id}-bar`);
  R.onFrame((t) => {
    let v = clock[0] ? clock[0].from : 24;
    for (const c of clock) if (t >= c.t0) v = c.from + (c.to - c.from) * clamp((t - c.t0) / Math.max(0.001, c.t1 - c.t0));
    tEl.textContent = HMS(v);
    tEl.classList.toggle("zero", v <= 0.0003);
    bar.style.transform = `scaleX(${clamp(v / 24)})`;
    bar.style.background = v > 8 ? "#22c55e" : v > 2 ? "#f59e0b" : "#ef4444";
  });
  // the pills and the lines: each pops in its place, the one before it leaves
  const seq = (items, key) => items.forEach((it, k) => {
    popIn(R, `#${id}-${key}${k}`, it.at, { y: 24, scale: 0.7 });
    if (k > 0) R.tl.to(`#${id}-${key}${k - 1}`, { opacity: 0, y: -24, duration: 0.14, ease: "power2.in" }, it.at - 0.02);
  });
  seq(states, "s");
  seq(lines, "l");
  (rows || []).forEach((r, k) => popIn(R, `#${id}-r${k}`, r.at, { x: -40, scale: 0.9 }));
}
