// The prop kit: every on-screen object of reel1, reusable in any reel.
// Each prop mounts its DOM in its slot (paint order: ORDER in engine.js) and adds its tweens to R.tl
// at the times you pass (seconds; use cues: C.word ± offset). Defaults reproduce reel1.
// Styles live in reel.css under the prop's id. One instance of each prop per reel.
// Catalogue with pictures: PROPS.md.

const DEFAULT_RAIN = ["info?", "price?", "link?", "info", "how much?", "INFO", "hey!", "interested", "info pls", "link pls",
  "is this still available?", "how does it work?", "info?", "price??", "send it", "?", "yes", "info", "can u send the link",
  "ok", "how much is it", "info!!", "hi", "me!", "I want in", "info?", "details?", "price pls", "link", "hello?", "info",
  "cost?", "how?", "info?", "dm me", "INFO?", "need this", "info", "link??", "pls"];

// ---------------------------------------------------------------- big type behind Setty

/** Giant scrolling words behind Setty (two rows, opposite directions), slammed in with a flash. */
export function marquee(R, { text = "5-DAY CHALLENGE", at, out, flash = 0.5 }) {
  const row = `<span>${text}</span>`.repeat(3);
  R.mount("back", "marquee", `<div id="marquee" data-layout-ignore>
    <div class="row r1">${row}</div>
    <div class="row r2">${row}</div>
  </div>`);
  const { tl } = R;
  tl.fromTo("#marquee", { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power4.out" }, at);
  tl.fromTo("#marquee .r1", { x: 0 }, { x: -620, duration: 1.0, ease: "none" }, at);
  tl.fromTo("#marquee .r2", { x: -620 }, { x: 0, duration: 1.0, ease: "none" }, at);
  tl.to("#marquee", { opacity: 0, scale: 0.9, duration: 0.15, ease: "power2.in" }, out);
  if (flash) R.flash(at, flash);
}

/** Big glowing clock (or any short text) on a night background. `size` (px) shrinks a longer text ("1:00 AM"). */
export function nightClock(R, { text = "00:00", at, blink, out, night = at - 0.06, flash = 0.35, size }) {
  R.mount("back", "clock", `<div id="clock"${size ? ` style="font-size: ${size}px"` : ""}>${text}</div>`);
  const { tl } = R;
  if (night != null) {
    tl.to("#bg-night", { opacity: 1, duration: 0.15 }, night);
    tl.to("#glow", { opacity: 0.25, duration: 0.15 }, night);
  }
  tl.fromTo("#clock", { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.2, ease: "power4.out" }, at);
  if (flash) R.flash(at - 0.02, flash);
  if (blink != null) tl.to("#clock", { opacity: 0.25, duration: 0.05, yoyo: true, repeat: 1 }, blink);
  tl.to("#clock", { opacity: 0, y: -60, duration: 0.15 }, out);
}

/** A flat bed that rises behind Setty ("in bed?"). Hidden by blackCut({ hide: ["#bed"] }) or `out`. */
export function bed(R, { at, out }) {
  R.mount("back", "bed", `<svg id="bed" viewBox="0 0 900 560">
    <rect x="40" y="40" width="820" height="210" rx="40" fill="#2a2825" />
    <rect x="60" y="230" width="780" height="140" rx="30" fill="#f5f3f2" />
    <rect x="90" y="190" width="260" height="90" rx="40" fill="#fff" />
    <rect x="20" y="300" width="860" height="200" rx="44" fill="#42403c" />
    <rect x="20" y="300" width="860" height="40" rx="20" fill="#585552" />
    <rect x="60" y="490" width="40" height="60" rx="10" fill="#2a2825" />
    <rect x="800" y="490" width="40" height="60" rx="10" fill="#2a2825" />
  </svg>`);
  R.tl.fromTo("#bed", { opacity: 0, y: 260 }, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.8)" }, at);
  if (out != null) R.tl.to("#bed", { opacity: 0, duration: 0.15 }, out);
}

/** Ring light around Setty (follows him), hot background, flicker. */
export function ringLight(R, { at, out, flicker = at + 0.28, flashAt = at + 0.02, flash = [0.7, 0.25], hot = true }) {
  R.mount("back", "ring", `<div id="ring"></div>`);
  const { tl } = R;
  tl.fromTo("#ring", { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(2.2)" }, at);
  tl.to("#ring", { opacity: 0.35, duration: 0.04, yoyo: true, repeat: 3, ease: "none" }, flicker);
  if (hot) tl.fromTo("#bg-hot", { opacity: 0 }, { opacity: 1, duration: 0.2 }, at);
  if (flash) R.flash(flashAt, ...flash);
  tl.to("#ring", { opacity: 0, scale: 1.15, duration: 0.18, ease: "power2.in" }, out);
  if (hot) tl.to("#bg-hot", { opacity: 0, duration: 0.25 }, out);
}

// ---------------------------------------------------------------- objects in front

/** LIVE pill with a day counter that flips from `from` to `to` between days.t0 and days.t1, or a viewer count
 *  (eye icon) that melts from viewers.from to viewers.to between viewers.t0 and viewers.t1. */
export function livePill(R, { at, out, days, viewers }) {
  const right = viewers ? `<div class="day">${R.ico("eye")}<b class="n" id="viewn">${viewers.from}</b></div>`
    : `<div class="day">DAY&nbsp;<b id="dayn">1</b></div>`;
  R.mount("front", "live", `<div id="live"><div class="pill"><i></i>LIVE</div>${right}</div>`);
  const { tl } = R;
  if (viewers) {
    const n = document.getElementById("viewn"), { from, to, t0, t1 } = viewers;
    R.onFrame((t) => {
      const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
      n.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
    });
  }
  tl.fromTo("#live", { opacity: 0, y: -40, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(3)" }, at);
  if (days) {
    const dayn = document.getElementById("dayn");
    const { t0, t1, from = 1, to = 5, reset = at - 0.01 } = days;
    const n = to - from;
    for (let d = from + 1; d <= to; d++) tl.set(dayn, { textContent: String(d) }, t0 + (d - from - 1) * ((t1 - t0) / (n - 1 + 0.2)));
    tl.set(dayn, { textContent: String(from) }, reset);
  }
  tl.to("#live", { opacity: 0, y: -30, duration: 0.15 }, out);
}

/** Heart monitor: three beats drawn from `at`, flatline (red) at `dead`. */
export function ecg(R, { at, dead, out, draw = dead - at + 0.05 }) {
  R.mount("front", "ecg", `<svg id="ecg" viewBox="0 0 1080 220"><path id="ecg-line" pathLength="1" d="" /></svg>`);
  const { tl } = R;
  const line = document.getElementById("ecg-line");
  const beat = (x0) => `L${x0} 110 L${x0 + 20} 110 L${x0 + 35} 40 L${x0 + 52} 180 L${x0 + 66} 80 L${x0 + 80} 110`;
  line.setAttribute("d", `M40 110 ${beat(120)} ${beat(360)} ${beat(600)} L1040 110`);
  tl.set(line, { stroke: "#00d18f" }, 0);
  tl.fromTo("#ecg", { opacity: 0 }, { opacity: 1, duration: 0.12 }, at);
  tl.fromTo(line, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: draw, ease: "none" }, at);
  tl.set(line, { attr: { d: "M40 110 L1040 110" }, stroke: "#ff2d46" }, dead);
  tl.fromTo("#ecg", { scaleY: 1.6 }, { scaleY: 1, duration: 0.3, ease: "power3.out" }, dead);
  tl.to("#ecg", { opacity: 0, duration: 0.2 }, out);
}

/** A giant chat bubble slammed on screen ("info?"), thrown down at `out`. */
export function giantBubble(R, { text = "info?", at, out, flash = 0.6, flashAt = at + 0.02 }) {
  R.mount("front", "info", `<div id="info" data-layout-allow-overflow>${text}</div>`);
  const { tl } = R;
  tl.fromTo("#info", { opacity: 0, scale: 2.6, rotation: -14 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.2, ease: "power4.out" }, at);
  tl.to("#info", { y: 1700, rotation: 18, duration: 0.5, ease: "power2.in" }, out);
  if (flash) R.flash(flashAt, flash);
}

/** Orange round badge with a Lucide icon (hand, ghost, video-off…), optional wiggle. Several per reel: give each an `id`
 *  and a `pos` [left, top] (default: top right, clear of the IG buttons). `fly` throws it up and away instead of shrinking. */
export function iconBadge(R, { id = "hand", icon = "hand", at, wiggle, out, pos, fly = false }) {
  const style = pos ? ` style="left: ${pos[0]}px; top: ${pos[1]}px"` : "";
  const el = R.mount("front", "hand", `<div id="${id}"${id === "hand" ? "" : ' class="badge"'}${style}></div>`);
  el.innerHTML = R.ico(icon);
  const { tl } = R, sel = `#${id}`;
  tl.fromTo(sel, { opacity: 0, scale: 0.2, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.26, ease: "back.out(3)" }, at);
  if (wiggle != null) tl.to(sel, { rotation: 14, duration: 0.09, yoyo: true, repeat: 5, ease: "sine.inOut" }, wiggle);
  if (fly) tl.to(sel, { y: -900, x: 160, rotation: 30, opacity: 0, duration: 0.5, ease: "power2.in" }, out);
  else tl.to(sel, { opacity: 0, scale: 0.5, duration: 0.12 }, out);
}

/** Moon + floating "z z" ("go to sleep"). */
export function moonZzz(R, { at, out }) {
  const el = R.mount("front", "moon", `<div id="moon"><b style="left: 150px; top: -10px">z</b><b style="left: 200px; top: -70px; font-size: 44px">z</b></div>`);
  el.insertAdjacentHTML("afterbegin", R.ico("moon"));
  const { tl } = R;
  tl.fromTo("#moon", { opacity: 0, scale: 0.4, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, at);
  tl.to("#moon b", { y: -30, opacity: 0.3, duration: 0.6, stagger: 0.15, ease: "sine.out" }, at + 0.23);
  tl.to("#moon", { opacity: 0, scale: 0.6, duration: 0.15 }, out);
}

/** Hard cut to black with a red spot (the dead-serious turn); back to the warm/hot stage at `until`. */
export function blackCut(R, { at, until, hide = [], back = 0.85, flash = [0.8, 0.22], flashAt = until + 0.03 }) {
  const { tl } = R;
  if (hide.length) tl.set(hide, { opacity: 0 }, at);
  tl.set("#bg-black", { opacity: 1 }, at);
  tl.set("#glow", { opacity: 0 }, at);
  tl.fromTo("#spot", { opacity: 0 }, { opacity: 1, duration: 0.6 }, at);
  tl.to(["#bg-black", "#spot"], { opacity: 0, duration: 0.2 }, until);
  tl.to("#glow", { opacity: 1, duration: 0.2 }, until);
  if (back) tl.to("#bg-hot", { opacity: back, duration: 0.2 }, until);
  if (flash) R.flash(flashAt, ...flash);
}

/** Two diagonal warning tapes that slam across the screen (black-cut scenes). */
export function tapes(R, { text = "HOSTAGE SITUATION · DO NOT CROSS · ", t1, t2, out }) {
  R.mount("front", "tapes", `<div id="tapes" data-layout-ignore>
    <div class="tape" id="tape1"><span></span></div>
    <div class="tape" id="tape2"><span></span></div>
  </div>`);
  document.querySelectorAll("#tapes .tape span").forEach((s) => (s.textContent = text.repeat(6)));
  const { tl } = R;
  tl.to("#tape1", { x: 0, duration: 0.22, ease: "power4.out" }, t1);
  tl.to("#tape2", { x: 0, duration: 0.22, ease: "power4.out" }, t2);
  tl.to("#tape1 span", { x: -500, duration: 2, ease: "none" }, t1 + 0.06);
  tl.to("#tape2 span", { x: 400, duration: 2, ease: "none" }, t2 + 0.06);
  tl.to("#tape1", { x: 2400, duration: 0.25, ease: "power3.in" }, out);
  tl.to("#tape2", { x: -2400, duration: 0.25, ease: "power3.in" }, out);
}

/** Manychat pill; a cable grows from Setty's tail to it; spark + "Connected" chip at `connect`. */
export function manychatPlug(R, { at, cable = at + 0.07, connect, out, flash = 0.45, pos = [300, 930] }) {
  R.mount("front", "cable", `<svg id="cable" viewBox="0 0 1080 1920"><path id="cable-path" pathLength="1" d="M0 0" /></svg>`);
  R.mount("front", "mc", `<div id="mc"><div class="logo" id="mc-logo"></div><b>Manychat</b><span class="ms-chip green ok" id="mc-ok"><i class="dot"></i>Connected</span></div>`);
  const spark = R.mount("front", "spark", `<div id="spark"></div>`);
  document.getElementById("mc-logo").innerHTML = R.ico("message-circle");
  const { tl } = R;
  tl.fromTo("#mc", { opacity: 0, x: -200, scale: 0.7 }, { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: "back.out(2.2)" }, at);
  tl.fromTo("#cable-path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: connect - cable + 0.05, ease: "power2.inOut" }, cable);
  tl.set("#spark", { opacity: 1 }, connect);
  for (let k = 0; k < 10; k++) {
    const i = document.createElement("i");
    i.style.transform = `rotate(${k * 36}deg)`;
    spark.appendChild(i);
    tl.fromTo(i, { scaleY: 0.2, opacity: 1, y: 0 }, { scaleY: 1, opacity: 0, y: -30, duration: 0.35, ease: "power3.out", immediateRender: false }, connect);
  }
  tl.fromTo("#mc-ok", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(3)" }, connect + 0.05);
  if (flash) R.flash(connect, flash);
  tl.to(["#mc", "#cable"], { opacity: 0, y: 60, duration: 0.18, ease: "power2.in" }, out);
  // the cable leaves from Setty's tail, every frame
  const path = document.getElementById("cable-path");
  const [px, py] = pos;
  R.onFrame((t, { bob }) => {
    const [tx, ty] = R.toScreen(R.P.x - 1.78, R.P.y + bob + 0.5, 0.05);
    path.setAttribute("d", `M${tx.toFixed(1)} ${ty.toFixed(1)} C${(tx - 60).toFixed(1)} ${(ty + 160).toFixed(1)}, ${px + 30} ${py - 200}, ${px} ${py}`);
  });
}

// ---------------------------------------------------------------- real app UI (cards under Setty, TOP framing)

function cardsBox(R) {
  if (!document.getElementById("cards")) R.mount("front", "cardsw", `<div id="cardsw"><div id="cards"></div></div>`);
  return document.getElementById("cards");
}
const card = (R, slot, html) => R.mount("cards", slot, html, cardsBox(R));

/** Playbook card: the sales page is read (bar fills), facts pop, "Learned" chip. */
export function playbookCard(R, { at, fill, fillDur, chips, learned, out, page = "yourcoaching.com/apply", facts = ["Offer", "Price", "Objections", "Your tone"] }) {
  card(R, "pb", `<div class="card ms-window" id="c-pb">
    <div class="hd" data-ico="book-open">Playbook<span class="ms-chip green" id="pb-chip" style="opacity: 0"><i class="dot"></i>Learned</span></div>
    <div class="bd">
      <div class="doc"><div class="tile" data-ico="file-text"></div><div><b>Sales page</b><span>${page}</span></div></div>
      <div class="bar"><i id="pb-fill"></i></div>
      <div class="facts">${facts.map((f) => `<span class="ms-chip orange">${f}</span>`).join("")}</div>
    </div>
  </div>`);
  const { tl } = R;
  tl.fromTo("#c-pb", { opacity: 0, y: 120, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "back.out(1.8)" }, at);
  tl.fromTo("#pb-fill", { scaleX: 0 }, { scaleX: 1, duration: fillDur, ease: "power2.inOut" }, fill);
  tl.to("#c-pb .facts .ms-chip", { opacity: 1, duration: 0.12, stagger: 0.09 }, chips);
  tl.fromTo("#pb-chip", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(3)" }, learned);
  tl.to("#c-pb", { opacity: 0, x: -460, rotation: -6, duration: 0.2, ease: "power3.in" }, out);
}

/**
 * Real DM thread. `messages` in order: { lead: "text", at } · { typing: true, at, hide, who: "lead" (default: setter) } ·
 * { setter: "text", at, chip: { text, tone: "orange"|"green", dot, at } }; add `scroll: t` on a message
 * to scroll the thread up before it appears (measured, so the newest message sits at the bottom).
 */
export function dmThread(R, { at, out, handle = "sarah.mindset", initials = "SM", messages }) {
  let n = 0, last = "m0";
  const rows = messages.map((m) => {
    if (m.typing) return { ...m, id: `${last}t`, html: `<div class="ms-typing" style="align-self: flex-${m.who === "lead" ? "start" : "end"}"><i></i><i></i><i></i></div>` };
    last = `m${++n}`;
    const who = m.lead != null ? "lead" : "setter";
    const chip = m.chip
      ? `<span class="ms-chip${m.chip.tone ? " " + m.chip.tone : ""}" id="${last}c">${m.chip.dot ? '<i class="dot"></i>' : ""}${m.chip.text}</span>` : "";
    return { ...m, id: last, html: `<div class="ms-bubble ${who}">${m.lead ?? m.setter}</div>${chip}` };
  });
  card(R, "thread", `<div class="card ms-window" id="c-thread">
    <div class="hd"><span class="who"><span class="ms-avatar">${initials}</span></span>${handle}<span class="ms-chip"><i class="dot" style="background: #00bb7f"></i>Live</span></div>
    <div class="bd"><div id="thread">
      ${rows.map((r) => `<div class="row" id="${r.id}">${r.html}</div>`).join("\n      ")}
    </div></div>
  </div>`);
  const { tl } = R;
  tl.fromTo("#c-thread", { opacity: 0, x: 460, rotation: 6 }, { opacity: 1, x: 0, rotation: 0, duration: 0.26, ease: "power3.out" }, at);
  const pop = (sel, t) => tl.fromTo(sel, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "back.out(2.4)" }, t);
  const typing = rows.filter((r) => r.typing).map((r) => document.getElementById(r.id));
  const scrollTo = (id) => {
    typing.forEach((el) => (el.style.display = "none"));
    const row = document.getElementById(id), bottom = row.offsetTop + row.offsetHeight;
    typing.forEach((el) => (el.style.display = ""));
    return Math.min(0, 180 - 14 - bottom - 28);
  };
  for (const r of rows) {
    if (r.scroll != null) tl.to("#thread", { y: scrollTo(r.id), duration: 0.3, ease: "power3.inOut" }, r.scroll);
    pop(`#${r.id}`, r.at);
    if (r.typing && r.hide != null) tl.set(`#${r.id}`, { display: "none" }, r.hide);
    if (r.chip) tl.fromTo(`#${r.id}c`, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(3)" }, r.chip.at);
  }
  tl.to("#c-thread", { opacity: 0, scale: 0.8, y: -40, duration: 0.18, ease: "power3.in" }, out);
}

/** "Call booked" card slammed in (pair it with confetti). */
export function bookedCard(R, { at, out, title = "Call booked", detail = "Discovery call · Tue, 10:00 AM<br />Added to your calendar", flash = 0.5, flashAt = at + 0.02 }) {
  card(R, "booked", `<div class="card ms-card" id="c-booked"><div class="tile" data-ico="calendar-check"></div><div><b>${title}</b><span>${detail}</span></div></div>`);
  R.tl.fromTo("#c-booked", { opacity: 0, scale: 1.6, rotation: -5 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.24, ease: "power4.out" }, at);
  if (flash) R.flash(flashAt, flash);
  R.tl.to("#c-booked", { opacity: 0, scale: 0.6, y: 120, duration: 0.2, ease: "power3.in" }, out);
}

/** Week calendar (Calendly chip); the first event drops in at `drop`, the others pop after it. */
export function weekCalendar(R, { at, drop, out, tool = "Calendly", label = "Discovery call",
  events = [[1, 1], [3, 0], [0, 2], [4, 3]], days = ["Mon", "Tue", "Wed", "Thu", "Fri"], today = 1, hours = ["9", "10", "11", "12"] }) {
  card(R, "cal", `<div class="card ms-window" id="cal">
    <div class="hd" data-ico="calendar-days">This week<span class="ms-chip">${tool}</span></div>
    <div class="grid" id="calgrid"></div>
  </div>`);
  const grid = document.getElementById("calgrid");
  grid.innerHTML = ["", ...days].map((d, k) => `<div class="dh${k === today + 1 ? " on" : ""}">${d}</div>`).join("") +
    hours.map((h) => `<div class="hr">${h}:00</div>` + "<div class='cell'></div>".repeat(days.length)).join("");
  const colW = (400 - 20 - 34) / days.length;
  events.forEach(([col, row], k) => {
    const el = document.createElement("div");
    el.className = "ev";
    el.id = `ev${k + 1}`;
    el.textContent = label;
    Object.assign(el.style, { left: `${10 + 34 + col * colW + 2}px`, top: `${6 + 24 + row * 34 + 2}px`, width: `${colW - 4}px` });
    grid.appendChild(el);
  });
  const { tl } = R;
  tl.fromTo("#cal", { opacity: 0, y: 100, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.8)" }, at);
  tl.fromTo("#ev1", { opacity: 0, y: -120, scale: 1.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.24, ease: "back.out(2.2)" }, drop);
  events.slice(1).forEach((_, k) =>
    tl.fromTo(`#ev${k + 2}`, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(3)" }, drop + 0.22 + k * 0.1));
  tl.to("#cal", { opacity: 0, y: 200, rotation: 4, duration: 0.22, ease: "power3.in" }, out);
}

/** Confetti burst (brand colours) from a point. Uses the shared random stream. */
export function confetti(R, { at, x = 540, y = 900, n = 34 }) {
  const conf = R.mount("front", "confetti", `<div id="confetti" style="left: ${x}px; top: ${y}px"></div>`);
  const cols = ["#ff611d", "#ff905e", "#00bb7f", "#fff", "#ffd27a"];
  for (let k = 0; k < n; k++) {
    const i = document.createElement("i");
    i.style.background = cols[k % cols.length];
    conf.appendChild(i);
    const a = R.rnd() * Math.PI * 2, r = 260 + R.rnd() * 420;
    R.tl.fromTo(i, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 0.6 + R.rnd() * 0.8 },
      { opacity: 0, x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8 + 260, rotation: (R.rnd() - 0.5) * 720, duration: 1.0, ease: "power3.out",
        immediateRender: false }, at);
  }
}

/** Instagram comment bar: the keyword is typed letter by letter (`step` s apart), then sent.
 *  Type it once Setty has said it (type: end of the word): key clicks on the word mask it ("SETTY" → "setting"). */
export function commentBar(R, { keyword = "SETTY", at, caret = at + 0.12, type, step = 0.065, send = type + 0.4, out }) {
  const el = R.mount("front", "comment", `<div id="comment"><div class="av"><img src="assets/ui/logo-icon.svg" /></div><span class="ph" id="ph">Add a comment…</span><div class="txt"><span id="typed"></span><i class="caret" id="caret"></i></div><div class="send" id="send"></div></div>`);
  el.querySelector("#send").innerHTML = R.ico("arrow-up");
  const { tl } = R;
  tl.fromTo("#comment", { opacity: 0, y: 240 }, { opacity: 1, y: 0, duration: 0.32, ease: "back.out(1.6)" }, at);
  const typed = document.getElementById("typed");
  tl.set("#ph", { opacity: 1 }, 0);
  tl.set("#ph", { opacity: 0 }, type);
  keyword.split("").forEach((ch, k) => tl.set(typed, { textContent: keyword.slice(0, k + 1) }, type + k * step));
  tl.set(typed, { textContent: "" }, 0);
  tl.to("#caret", { opacity: 0, duration: 0.01, repeat: 9, yoyo: true, repeatDelay: 0.25 }, caret);
  tl.fromTo("#send", { scale: 1 }, { scale: 0.8, duration: 0.07, yoyo: true, repeat: 1 }, send);
  tl.to("#comment", { y: 30, opacity: 0, duration: 0.2, ease: "power2.in" }, out);
}

/** Phone notification sliding down from the top. */
export function notification(R, { title = "setty", text = "slid into your DMs", at, flash = 0.25 }) {
  R.mount("front", "notif", `<div id="notif" data-layout-ignore><img src="assets/ui/logo-icon.svg" /><div><b>${title}</b><span>${text}</span></div><em>now</em></div>`);
  R.tl.to("#notif", { y: 0, duration: 0.35, ease: "back.out(1.6)" }, at);
  if (flash) R.flash(at, flash);
}

/** End CTA pill (orange gradient) with a bouncing arrow. */
export function endCta(R, { text = "Comment SETTY", icon = "arrow-down", at, bounce = at + 0.28 }) {
  const el = R.mount("root", "endcta", `<div id="endcta"><div>${text}<span id="endarrow"></span></div></div>`);
  el.querySelector("#endarrow").innerHTML = R.ico(icon);
  R.tl.fromTo("#endcta", { opacity: 0, scale: 0.5, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(2.4)" }, at);
  R.tl.to("#endarrow", { y: 16, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, bounce);
}

/** Small pill notification, Zoom / app style ("Mom left the webinar"): Lucide icon + text, pops in, slides out.
 *  Several per reel (`id`). tone: dark (default), red, green, light. y: top in px (default between Setty and the captions). */
export function toast(R, { id = "toast1", icon = "log-out", text, at, out, y = 1010, tone = "" }) {
  R.mount("front", "toast", `<div class="toast${tone ? " " + tone : ""}" id="${id}" style="top: ${y}px">${R.ico(icon)}<span>${text}</span></div>`);
  R.tl.fromTo(`#${id}`, { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "back.out(2.4)" }, at);
  if (out != null) R.tl.to(`#${id}`, { opacity: 0, y: -30, duration: 0.18, ease: "power2.in" }, out);
}

/** A stack of chat bubbles popping in one by one (a DM gag, follow-ups…): items [{ text, at, from: "lead"|"me", meta, small }].
 *  "me" = the coach / the setter (orange, right), "lead" = white, left. meta = small grey line under it ("Seen · 3 days ago").
 *  Several per reel (`id`). Keep it between Setty and the captions (y ≈ 680–1150 in TOP framing, 900–1150 in MID). */
export function chatBubbles(R, { id = "chat1", x = 110, y = 900, w = 860, items, out }) {
  const html = items.map((it, k) => `<div class="cb ${it.from || "lead"}" id="${id}-${k}"><div class="b${it.small ? " small" : ""}">${it.text}</div>` +
    (it.meta ? `<div class="m">${it.meta}</div>` : "") + `</div>`).join("");
  R.mount("front", "chat", `<div class="chat" id="${id}" style="left: ${x}px; top: ${y}px; width: ${w}px">${html}</div>`);
  items.forEach((it, k) => R.tl.fromTo(`#${id}-${k}`, { opacity: 0, y: 24, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "back.out(2.4)" }, it.at));
  if (out != null) R.tl.to(`#${id}`, { opacity: 0, y: 80, duration: 0.2, ease: "power2.in" }, out);
}

// ---------------------------------------------------------------- physics

/**
 * DM bubbles rain on Setty (matter.js, precomputed at 60 fps so any frame can be seeked), pile on him,
 * then drain at `drop`. Bubbles spawn between t0 and spawnEnd. Setty must be in the MID framing.
 * Uses the shared random stream: in reel1 it is the last prop built (keep that order to re-render it exactly).
 */
export function dmRain(R, { texts = DEFAULT_RAIN, t0, spawnEnd, drop, t1, fps = 60 }) {
  const { THREE, camera, CAMS, W, H } = R;
  const MID = CAMS.MID;
  const rain = R.mount("front", "rain", `<div id="rain" data-layout-ignore></div>`);
  const bubbles = texts.map((txt, k) => {
    const el = document.createElement("div");
    el.className = "bubble" + (k % 7 === 3 ? " o" : k % 3 === 1 ? " g" : "");
    el.textContent = txt;
    rain.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    const spawn = t0 + Math.pow(k / texts.length, 0.75) * (spawnEnd - t0);
    return { el, w, h, spawn, x: 110 + R.rnd() * 860, a: (R.rnd() - 0.5) * 0.8, vx: (R.rnd() - 0.5) * 4, va: (R.rnd() - 0.5) * 0.12 };
  });
  function settyBox() {
    // Setty's silhouette on screen in the MID framing, as a static body for the rain
    camera.position.set(0, MID.ly + 0.35, MID.z);
    camera.lookAt(0, MID.ly, 0);
    camera.updateMatrixWorld();
    const pts = [[-1.25, 0.75], [1.25, 0.75], [-1.25, 2.8], [1.25, 2.8]].map(([x, y]) => new THREE.Vector3(x, y, 0.4).project(camera));
    const xs = pts.map((v) => (v.x * 0.5 + 0.5) * W), ys = pts.map((v) => (-v.y * 0.5 + 0.5) * H);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  }
  const FRAMES = (() => {
    const { Engine, Bodies, Composite, Body } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
    const box = settyBox();
    const floor = Bodies.rectangle(540, 1780, 1600, 120, { isStatic: true });
    const sb = Bodies.rectangle((box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2, box.x1 - box.x0, box.y1 - box.y0,
      { isStatic: true, chamfer: { radius: 150 } });
    Composite.add(engine.world, [floor, sb]);
    const n = Math.ceil((t1 - t0) * fps);
    const frames = [];
    let dropped = false;
    for (let f = 0; f <= n; f++) {
      const time = t0 + f / fps;
      for (const b of bubbles) {
        if (!b.body && time >= b.spawn) {
          b.body = Bodies.rectangle(b.x, -80, b.w, b.h, { chamfer: { radius: 40 }, restitution: 0.25, friction: 0.4, angle: b.a });
          Body.setVelocity(b.body, { x: b.vx, y: 9 });
          Body.setAngularVelocity(b.body, b.va);
          Composite.add(engine.world, b.body);
        }
      }
      if (!dropped && time >= drop) {
        Composite.remove(engine.world, [floor, sb]);
        engine.gravity.y = 3.2; // the flood drains away fast
        dropped = true;
      }
      Engine.update(engine, 1000 / fps / 2);
      Engine.update(engine, 1000 / fps / 2);
      frames.push(bubbles.map((b) => (b.body ? [b.body.position.x, b.body.position.y, b.body.angle] : null)));
    }
    return frames;
  })();
  R.onFrame((t) => {
    const f = Math.round((t - t0) * fps);
    const fr = f >= 0 && f < FRAMES.length ? FRAMES[f] : null;
    bubbles.forEach((b, k) => {
      const s = fr && fr[k];
      if (!s || s[1] > 2200) {
        b.el.style.visibility = "hidden";
        return;
      }
      b.el.style.visibility = "visible";
      b.el.style.transform = `translate(${(s[0] - b.w / 2).toFixed(1)}px, ${(s[1] - b.h / 2).toFixed(1)}px) rotate(${s[2].toFixed(3)}rad)`;
    });
  });
}
