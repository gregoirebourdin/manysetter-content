// Card "screenTime" (reel14): the iPhone's Screen Time in big type, for a card beside the speaker (text ≈ 97 px, so
// ≈ 60 px on screen at 62 %). A header ("Screen Time"), a huge total that runs up ("5h 02m"), a line under it, one bar a
// day rising, and an optional red stamp that drops on it ("$0 billed").
//   st.screenTime(R, { id, at, out, w, h, total: { to: 302, t0, t1 } (minutes), label, bars: [0–1 × 7], barsAt,
//                      stamp: { text, at } })
import { mount, inOut, icon, clamp, ease3 } from "./stage.js";

const hm = (min) => `${Math.floor(min / 60)}h ${String(Math.round(min % 60)).padStart(2, "0")}m`;

export function screenTime(R, { id = "stm", at, out, w = 900, h = 700, total, label, bars = [0.3, 0.55, 0.4, 0.8, 0.65, 1, 0.45], barsAt, stamp }) {
  const cols = bars.map((v, k) => `<i class="stm-bar" id="${id}-b${k}" style="height: ${Math.round(v * 100)}%"></i>`).join("");
  mount(R, id, "s-card stm", `<div class="stm-head"><span class="stm-ic">${icon(R, "hourglass")}</span><b>Screen Time</b></div>` +
    `<div class="stm-big" id="${id}-n">${hm(total.from || 0)}</div>` +
    (label ? `<div class="stm-lab">${label}</div>` : "") +
    `<div class="stm-bars">${cols}</div>` +
    (stamp ? `<div class="stm-stamp" id="${id}-x" data-layout-allow-overlap>${stamp.text}</div>` : ""),
  { w, h });
  inOut(R, id, at, out);
  const el = document.getElementById(`${id}-n`), from = total.from || 0;
  R.onFrame((t) => (el.textContent = hm(from + (total.to - from) * ease3(clamp((t - total.t0) / (total.t1 - total.t0))))));
  const t0 = barsAt ?? at + 0.15;
  bars.forEach((_, k) => R.tl.fromTo(`#${id}-b${k}`, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "back.out(1.6)", immediateRender: true }, t0 + k * 0.06));
  if (stamp) {
    gsap.set(`#${id}-x`, { xPercent: -50, yPercent: -50, rotation: -10 });
    R.tl.fromTo(`#${id}-x`, { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2.4)" }, stamp.at);
  }
}
