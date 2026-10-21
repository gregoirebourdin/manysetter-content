// Card "memoryField" (reel17): a Manychat custom field in big type, for a card beside the speaker (text ≈ 97 px, so
// ≈ 60 px on screen at 62 %). "Manychat" is written out, never its logo (brief). The field's name, its value shown empty
// in red, then typed letter by letter between t0 and t1 (the box turns green), and a pill under it that pops.
//   st.memoryField(R, { id, at, out, w, h, head, name, empty, value: { text, t0, t1 }, foot: { icon, text, at } })
import { mount, inOut, popIn, icon, clamp } from "./stage.js";

export function memoryField(R, { id = "mem", at, out, w = 900, h = 900, head = "Manychat", name, empty = "empty", value, foot }) {
  const html = `<div class="mem-head"><span class="mem-tile">${icon(R, "message-circle")}</span><b>${head}</b></div>` +
    `<div class="mem-name">${name}</div>` +
    `<div class="mem-box" id="${id}-b"><span class="mem-empty" id="${id}-e">${empty}</span><span class="mem-v" id="${id}-v"></span></div>` +
    (foot ? `<div class="mem-foot" id="${id}-f">${icon(R, foot.icon)}<b>${foot.text}</b></div>` : "");
  mount(R, id, "s-card mem", html, { w, h });
  inOut(R, id, at, out);
  const box = document.getElementById(`${id}-b`), v = document.getElementById(`${id}-v`), e = document.getElementById(`${id}-e`);
  R.onFrame((t) => {
    const n = Math.round(value.text.length * clamp((t - value.t0) / (value.t1 - value.t0)));
    v.textContent = value.text.slice(0, n);
    e.style.display = n ? "none" : "";
    box.classList.toggle("set", n > 0);
  });
  if (foot) popIn(R, `#${id}-f`, foot.at, { y: 30, scale: 0.9 });
}
