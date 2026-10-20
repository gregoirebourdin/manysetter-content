// Stage modules: what the middle of a "stage" reel shows (Grégoire 19/10): the coaches' real tools, named and with their
// logos, and diagrams that explain. Each module mounts in the "stage" slot of the back layer (Setty stays in front),
// animates in R.tl, and takes an `id` so a reel can use it several times. Catalogue: PROPS.md. Styles: stage.css.
import { BRANDS } from "./brands.js";

export const STAGE = { x: 60, y: 540, w: 960, h: 600 }; // between the hook title (top) and the captions + Setty (bottom)
const clamp = (k) => Math.min(1, Math.max(0, k));
const ease3 = (k) => 1 - Math.pow(1 - k, 3);

/** A glossy app-icon tile ("3D" look) with the official glyph: instagram, whatsapp, messenger, zoom, calendly, caldotcom,
 *  stripe, or "manysetter". Manychat has no tile on purpose (the brief forbids its logo): write it out. */
export function app(slug, size = 64) {
  if (slug === "manysetter") return `<span class="s-app ms" style="--s:${size}px"><img src="assets/ui/logo-icon.svg" /></span>`;
  const b = BRANDS[slug];
  if (!b) throw new Error(`brand "${slug}" missing from assets/engine/brands.js`);
  return `<span class="s-app" style="--s:${size}px; background:${b.bg}"><svg viewBox="0 0 24 24"><path d="${b.d}"/></svg></span>`;
}

const icon = (R, name) => R.ico(name, "i");
const initials = (u) => u.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();

function mount(R, id, cls, html, { x = STAGE.x, y = STAGE.y, w = STAGE.w, h } = {}) {
  const box = document.getElementById("stagebox"); // the zoomable stage (layout "stage"); else the back layer
  return R.mount(box ? "stagebox" : "back", "stage", `<div class="st ${cls}" id="${id}" style="left: ${x}px; top: ${y}px; width: ${w}px;${h ? ` height: ${h}px;` : ""}">${html}</div>`, box || undefined);
}
/** the module zooms in from small (punchy) and leaves by zooming through the camera (scale up + fade): rhythm */
function inOut(R, id, at, out) {
  if (at <= 0) R.tl.set(`#${id}`, { opacity: 1 }, 0); // on screen from frame 0 (the thumbnail)
  else R.tl.fromTo(`#${id}`, { opacity: 0, y: 50, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }, at);
  if (out != null) R.tl.to(`#${id}`, { opacity: 0, scale: 1.22, duration: 0.18, ease: "power2.in" }, out);
}
const popIn = (R, target, at, from = { y: 18, scale: 0.92 }, dur = 0.24) =>
  R.tl.fromTo(target, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, scale: 1, duration: dur, ease: "back.out(2.2)" }, at);
/** rows that arrive at the top and push the older ones down (an inbox, a lock screen): absolute positions, seek-safe */
function stackIn(R, els, times, slot, dur = 0.22) {
  els.forEach((el, j) => {
    R.tl.fromTo(el, { opacity: 0, y: -slot * 0.5, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: dur, ease: "back.out(1.8)" }, times[j]);
    for (let k = j + 1; k < els.length; k++) R.tl.to(el, { y: (k - j) * slot, duration: dur, ease: "power2.out" }, times[k]);
  });
}
/** a number that runs from `from` to `to` between t0 and t1 (ease out) */
function counter(R, el, { from, to, t0, t1 }) {
  R.onFrame((t) => (el.textContent = String(Math.round(from + (to - from) * ease3(clamp((t - t0) / (t1 - t0)))))));
}

// ---------------------------------------------------------------- the webinar

/** Zoom webinar window: REC + timer, a gallery of attendees, a participant count that melts, people leaving (a tile goes
 *  dark, Zoom toast), the active-speaker ring on a tile. tiles: [{ name, emoji | ini, bg, mic }]. */
export function zoomWebinar(R, { id = "zoom", at, out, title, timer = "01:58:42", tiles, viewers, drop = [], leave, spot = [] }) {
  const tileHTML = tiles.map((t, k) => `<div class="zw-tile" id="${id}-t${k}" style="background: ${t.bg || "#2c2c2e"}">` +
    (t.emoji ? `<span class="zw-face">${t.emoji}</span>` : `<span class="zw-face ini">${t.ini}</span>`) +
    `<span class="zw-name">${t.mic === false ? icon(R, "mic-off") : ""}${t.name}</span>` +
    `<div class="zw-left" id="${id}-l${k}">${t.leftText || "Left the webinar"}</div></div>`).join("");
  mount(R, id, "zw", `<div class="zw-top">${app("zoom", 46)}<b>Zoom Webinar</b><span class="zw-title">${title}</span>` +
    `<span class="zw-rec"><i></i>REC</span><span class="zw-timer">${timer}</span></div>` +
    `<div class="zw-grid">${tileHTML}</div>` +
    `<div class="zw-bar"><span>${icon(R, "mic")}Mute</span><span>${icon(R, "video")}Video</span>` +
    `<span class="ppl">${icon(R, "users")}<b id="${id}-n">${viewers.from}</b></span><span class="leave">Leave</span></div>` +
    `<div class="zw-toast" id="${id}-toast">${icon(R, "log-out")}<span></span></div>`, { h: 600 });
  inOut(R, id, at, out);
  counter(R, document.getElementById(`${id}-n`), viewers);
  drop.forEach(({ tile, at: t }) => R.tl.fromTo(`#${id}-l${tile}`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t));
  if (leave) {
    gsap.set(`#${id}-toast`, { xPercent: -50 });
    document.querySelector(`#${id}-toast span`).textContent = leave.toast;
    R.tl.fromTo(`#${id}-l${leave.tile}`, { opacity: 0 }, { opacity: 1, duration: 0.25 }, leave.at);
    R.tl.fromTo(`#${id}-toast`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25, ease: "back.out(2)" }, leave.at);
    if (leave.out != null) R.tl.to(`#${id}-toast`, { opacity: 0, y: 20, duration: 0.2 }, leave.out);
  }
  spot.forEach(({ tile, at: t, until }) => {
    R.tl.fromTo(`#${id}-t${tile}`, { boxShadow: "inset 0 0 0 0px #30d158", scale: 1 },
      { boxShadow: "inset 0 0 0 6px #30d158", scale: 1.04, duration: 0.2, ease: "back.out(2)", immediateRender: false }, t);
    if (until != null) R.tl.to(`#${id}-t${tile}`, { boxShadow: "inset 0 0 0 0px #30d158", scale: 1, duration: 0.15 }, until);
  });
}

// ---------------------------------------------------------------- Instagram

/** Instagram DM inbox flooding: rows arrive on top (newest first), the Requests badge counts up.
 *  rows: [{ u, m, c, hot }] in arrival order, times: arrival time of each row, requests: { from, to, t0, t1 }. */
export function igInbox(R, { id = "inbox", at, out, title = "Messages", rows, times, requests }) {
  const list = rows.map((r, k) => `<div class="ig-row${r.hot ? " hot" : ""}" id="${id}-r${k}"><span class="s-av ring" style="background: ${r.c}">` +
    `${initials(r.u)}</span><div class="t"><div class="u">${r.u}</div><div class="m"><b>${r.m}</b> · now</div></div><i class="dot"></i></div>`).join("");
  mount(R, id, "s-card ig", `<div class="ig-head">${app("instagram", 56)}<b>${title}</b><span class="ig-req">Requests <i id="${id}-n">${requests.from}</i></span></div>` +
    `<div class="ig-list">${list}</div>`, { h: 600 });
  inOut(R, id, at, out);
  stackIn(R, rows.map((_, k) => document.getElementById(`${id}-r${k}`)), times, 84);
  counter(R, document.getElementById(`${id}-n`), requests);
}

/** Instagram DM conversation: their grey bubbles, your purple ones, "Seen" under yours, their typing dots.
 *  msgs: [{ me, text, at, big, seen: { text, at }, typing: { at, until } }] (typing shows before that message). */
export function igChat(R, { id = "chat", at, out, user, color = "#d6249f", status = "Active now", msgs }) {
  const body = msgs.map((m, k) => (m.typing ? `<div class="s-typing" id="${id}-ty${k}"><i></i><i></i><i></i></div>` : "") +
    `<div class="cm ${m.me ? "me" : "them"}${m.big ? " big" : ""}" id="${id}-m${k}"><div class="b">${m.text}</div>` +
    (m.seen ? `<div class="seen" id="${id}-s${k}">${m.seen.text}</div>` : "") + `</div>`).join("");
  mount(R, id, "s-card ig", `<div class="chat-head"><span class="s-av ring" style="background: ${color}">${initials(user)}</span>` +
    `<div><div class="u">${user}</div><div class="s">${status}</div></div><div class="ic">${icon(R, "phone")}${icon(R, "video")}</div></div>` +
    `<div class="chat-body">${body}</div>`, { h: 600 });
  inOut(R, id, at, out);
  msgs.forEach((m, k) => {
    if (m.typing) {
      R.tl.set(`#${id}-ty${k}`, { display: "inline-flex" }, m.typing.at);
      popIn(R, `#${id}-ty${k}`, m.typing.at);
      R.tl.set(`#${id}-ty${k}`, { display: "none" }, m.typing.until);
    }
    popIn(R, `#${id}-m${k}`, m.at);
    if (m.seen) R.tl.fromTo(`#${id}-s${k}`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, m.seen.at);
  });
}

// ---------------------------------------------------------------- phone

/** Phone lock screen at night: notifications from Instagram, WhatsApp, Messenger stack up (newest on top).
 *  notifs: [{ app, who, text, at }]. */
export function lockScreen(R, { id = "lock", at, out, time = "1:00", date = "Tuesday, October 21", notifs }) {
  const items = notifs.map((n, k) => `<div class="nt" id="${id}-n${k}">${app(n.app, 54)}<div class="t"><div class="a">` +
    `${BRANDS[n.app] ? BRANDS[n.app].name : n.app}<span>now</span></div><div class="x"><b>${n.who}</b> ${n.text}</div></div></div>`).join("");
  mount(R, id, "lock", `<div class="lock-sb">${time}<span class="r">${icon(R, "signal")}${icon(R, "wifi")}${icon(R, "battery-full")}</span></div>` +
    `<div class="lock-ic">${icon(R, "lock")}</div><div class="lock-date">${date}</div><div class="lock-time">${time}</div>` +
    `<div class="lock-list">${items}</div>`, { x: 260, w: 560, h: 600 });
  inOut(R, id, at, out);
  stackIn(R, notifs.map((_, k) => document.getElementById(`${id}-n${k}`)), notifs.map((n) => n.at), 108);
}

// ---------------------------------------------------------------- calendars

/** Calendly "Scheduled events": discovery calls slide in, then each gets its fate (No-show, Not a fit…), then the total.
 *  rows: [{ day, date, time, who }], status: [{ row, text, tone: red|grey|amber|green, at }], total: { label, value, at }. */
export function calendlyEvents(R, { id = "events", at, out, rows, rowAt = at + 0.2, status = [], total }) {
  const html = rows.map((r, k) => `<div class="cal-row" id="${id}-r${k}" style="top: ${104 + k * 64}px"><div class="d"><small>${r.day}</small>` +
    `<span>${r.date}</span></div><div class="w"><b>${r.what || "Discovery call"}</b><span>${r.time} · with ${r.who}</span></div>` +
    `${app("zoom", 38)}<span class="s-pill st8" id="${id}-s${k}"></span></div>`).join("");
  mount(R, id, "s-card", `<div class="cal-head">${app("calendly", 56)}<b>Scheduled events</b><div class="tabs"><span class="on">Upcoming</span>` +
    `<span>Past</span></div></div>${html}` +
    (total ? `<div class="cal-total" id="${id}-tot"><span>${total.label}</span><b>${total.value}</b></div>` : ""), { h: 600 });
  inOut(R, id, at, out);
  rows.forEach((_, k) => popIn(R, `#${id}-r${k}`, rowAt + k * 0.07, { x: -30 }));
  status.forEach((s) => {
    const el = document.getElementById(`${id}-s${s.row}`);
    el.textContent = s.text;
    el.classList.add(`tone-${s.tone || "grey"}`);
    popIn(R, el, s.at, { scale: 0.5 });
  });
  if (total) popIn(R, `#${id}-tot`, total.at, { y: 30 });
}

/** Calendly booking confirmation with the lead summary ManySetter adds to the event.
 *  summary: [text…] lines popping from summaryAt, `step` s apart. */
export function calendlyConfirm(R, { id = "booked", at, out, who, when, title = "Discovery call", summaryAt, summary = [], step = 0.28 }) {
  mount(R, id, "s-card", `<div class="ok-top"><span class="chk">${icon(R, "check")}</span><b>You are scheduled</b>` +
    `<span style="margin-left: auto">${app("calendly", 56)}</span></div>` +
    `<div class="ok-ev"><h3>${title} with ${who}</h3><div class="r">${icon(R, "calendar")}${when}</div>` +
    `<div class="r">${app("zoom", 40)}Zoom meeting</div></div>` +
    `<div class="ok-sum" id="${id}-sum"><div class="h">${app("manysetter", 34)}Lead summary · added by ManySetter</div>` +
    `<ul>${summary.map((s, k) => `<li id="${id}-l${k}">${s}</li>`).join("")}</ul></div>`, { h: 600 });
  inOut(R, id, at, out);
  if (summaryAt != null) {
    popIn(R, `#${id}-sum`, summaryAt, { y: 30 });
    summary.forEach((_, k) => popIn(R, `#${id}-l${k}`, summaryAt + 0.15 + k * step, { x: -20 }));
  }
}

// ---------------------------------------------------------------- explainers

/** A sign that switches on like a real neon (flickers), on a black stage. */
export function neonSign(R, { id = "neon", at, out, lines, sub, subIcon = "phone", flicker = [] }) {
  mount(R, id, "neon", `<div class="box">${lines.map((l) => `<div class="ln">${l}</div>`).join("")}</div>` +
    (sub ? `<div class="sub">${icon(R, subIcon)}${sub}</div>` : ""), { y: STAGE.y + 40 });
  const sel = `#${id}`, tl = R.tl;
  [[0, 1], [0.06, 0.2], [0.12, 1], [0.2, 0.35], [0.26, 1]].forEach(([dt, o]) => tl.set(sel, { opacity: o }, at + dt));
  flicker.forEach((t) => {
    tl.set(sel, { opacity: 0.3 }, t);
    tl.set(sel, { opacity: 1 }, t + 0.06);
  });
  if (out != null) tl.to(sel, { opacity: 0, duration: 0.15 }, out);
}

/** The product in one picture: your DMs (Instagram, WhatsApp, Messenger) → Manychat → ManySetter → a booked call.
 *  Nodes pop in, lines draw, and messages (dots) travel the pipe at each time of `pulses`. */
export function flowPipeline(R, { id = "flow", at, out, connect, pulses = [], sources = ["instagram", "whatsapp", "messenger"],
  target = "calendly", targetLabel = "Booked call" }) {
  const S = sources.map((s, k) => ({ s, x: 110, y: 120 + k * 180 }));
  const MC = { x: 375, y: 300 }, MS = { x: 640, y: 300 }, T = { x: 865, y: 300 };
  const curve = (a, b) => `M${a.x + 52} ${a.y} C${a.x + 140} ${a.y}, ${b.x - 190} ${b.y}, ${b.x - 115} ${b.y}`;
  const paths = [...S.map((n) => curve(n, MC)), `M${MC.x + 115} ${MC.y} L${MS.x - 72} ${MS.y}`, `M${MS.x + 72} ${MS.y} L${T.x - 58} ${T.y}`];
  const node = (k, p, inner, label) => `<div class="fn" id="${id}-n${k}" style="left: ${p.x}px; top: ${p.y}px">${inner}${label ? `<small>${label}</small>` : ""}</div>`;
  mount(R, id, "flow", `<svg class="lines" viewBox="0 0 960 600">${paths.map((d, k) => `<path id="${id}-p${k}" pathLength="1" d="${d}"/>`).join("")}</svg>` +
    S.map((n, k) => node(k, n, app(n.s, 96), BRANDS[n.s].name)).join("") +
    node(3, MC, `<div class="mc">${icon(R, "message-circle")}Manychat</div>`, "keeps your flows") +
    node(4, MS, app("manysetter", 140), "ManySetter") +
    node(5, T, app(target, 108), targetLabel) +
    pulses.map((_, k) => `<i class="fd" id="${id}-d${k}"></i>`).join(""), { h: 600 });
  for (let k = 0; k < 6; k++) gsap.set(`#${id}-n${k}`, { xPercent: -50, yPercent: -50 });
  R.tl.set(`#${id}`, { opacity: 1 }, at);
  const tl = R.tl;
  S.forEach((_, k) => popIn(R, `#${id}-n${k}`, at + k * 0.08, { scale: 0.4 }));
  S.forEach((_, k) => tl.fromTo(`#${id}-p${k}`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, at + 0.2 + k * 0.06));
  popIn(R, `#${id}-n3`, at + 0.3, { scale: 0.5 });
  tl.fromTo(`#${id}-p3`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3 }, connect - 0.25);
  popIn(R, `#${id}-n4`, connect, { scale: 0.3 }, 0.32);
  tl.fromTo(`#${id}-n4 .s-app`, { boxShadow: "0 0 0 0 rgba(255, 97, 29, 0)" }, { boxShadow: "0 0 70px 20px rgba(255, 97, 29, 0.75)", duration: 0.25,
    yoyo: true, repeat: 1, immediateRender: false }, connect + 0.1);
  tl.fromTo(`#${id}-p4`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3 }, connect + 0.2);
  popIn(R, `#${id}-n5`, connect + 0.35, { scale: 0.4 });
  // messages travelling the pipe: source → Manychat → ManySetter → the calendar
  pulses.forEach((t, k) => {
    const src = S[k % S.length];
    tl.set(`#${id}-d${k}`, { opacity: 1, x: src.x + 52, y: src.y }, t);
    tl.to(`#${id}-d${k}`, { keyframes: [{ x: MC.x - 115, y: MC.y, duration: 0.35 }, { x: MS.x - 70, y: MS.y, duration: 0.3 },
      { x: T.x - 56, y: T.y, duration: 0.3 }], ease: "none" }, t);
    tl.set(`#${id}-d${k}`, { opacity: 0 }, t + 0.96);
  });
  if (out != null) tl.to(`#${id}`, { opacity: 0, scale: 1.22, duration: 0.18, ease: "power2.in" }, out);
}

/** Two lanes: the leads drop in and get sorted (left: tire-kickers, right: serious). left/right: { title, sub, tile }
 *  (tile: a brand slug or an emoji). leads: [{ u, m, c, side: "l" | "r", at }]. */
export function leadSorter(R, { id = "sort", at, out, left, right, leads }) {
  const head = (c) => `<div class="hd">${BRANDS[c.tile] || c.tile === "manysetter" ? app(c.tile, 64) : `<span style="font-size: 54px">${c.tile}</span>`}` +
    `<div><b>${c.title}</b><span>${c.sub}</span></div></div>`;
  const cards = leads.map((l, k) => `<div class="s-lead" id="${id}-c${k}" style="left: 280px; top: 120px"><span class="s-av" style="background: ${l.c}">` +
    `${initials(l.u)}</span><div class="t"><div class="u">${l.u}</div><div class="m">${l.m}</div></div></div>`).join("");
  mount(R, id, "sort", `<div class="col l">${head(left)}</div><div class="col r">${head(right)}</div>${cards}`, { h: 600 });
  inOut(R, id, at, out);
  const slot = { l: 0, r: 0 };
  leads.forEach((l, k) => {
    const n = slot[l.side]++;
    const x = (l.side === "l" ? 25 : 535) - 280, y = 130 + n * 96 - 120;
    R.tl.fromTo(`#${id}-c${k}`, { opacity: 0, x: 0, y: -60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "back.out(2)" }, l.at);
    R.tl.to(`#${id}-c${k}`, { x, y, duration: 0.32, ease: "power3.inOut" }, l.at + 0.22);
  });
}

/** Follow-ups on Instagram's 24-hour window: the bar fills, a message pops at each mark. marks: [{ h, text, at }]. */
export function followTimeline(R, { id = "fu", at, out, title = "Instagram's 24-hour window", marks, hours = 24, fillTo }) {
  const X = (h) => 40 + (880 * h) / hours;
  const cx = (h) => Math.min(770, Math.max(190, X(h)));
  mount(R, id, "tl24", `<div class="hd">${app("instagram", 50)}${title}</div><div class="axis"><i id="${id}-fill"></i></div>` +
    [0, hours / 2, hours].map((h) => `<span class="tk" style="left: ${X(h)}px">${h}h</span>`).join("") +
    marks.map((m, k) => `<i class="mk" id="${id}-k${k}" style="left: ${X(m.h)}px"></i>` +
      `<div class="fu" id="${id}-f${k}" style="left: ${cx(m.h)}px; top: ${k % 2 ? 250 : 90}px"><div class="b">${m.text}</div><small>after ${m.h} hours</small></div>`).join(""),
  { h: 600 });
  marks.forEach((_, k) => gsap.set(`#${id}-f${k}`, { xPercent: -50 }));
  inOut(R, id, at, out);
  R.tl.fromTo(`#${id}-fill`, { scaleX: 0 }, { scaleX: 1, duration: (fillTo ?? marks[marks.length - 1].at + 0.4) - at, ease: "none" }, at);
  marks.forEach((m, k) => {
    popIn(R, `#${id}-k${k}`, m.at, { scale: 0.2 });
    popIn(R, `#${id}-f${k}`, m.at + 0.04, { y: 30, scale: 0.85 });
  });
}

/** ManySetter inbox: a lead gets spicy, the tag lands, the conversation is handed to you ("Reply myself"). */
export function handoffCard(R, { id = "handoff", at, out, user, text, color = "#ef4444", tagAt, handAt, to = "you", channel = "instagram", tag = "🔥 Upset" }) {
  mount(R, id, "s-card", `<div class="ho-head">${app("manysetter", 48)}Inbox<span style="margin-left: auto">${app(channel, 44)}</span></div>` +
    `<div class="ho-row"><span class="s-av ring" style="background: ${color}">${initials(user)}</span><div class="t"><div class="u">${user}</div>` +
    `<div class="m">${text}</div></div></div>` +
    `<div class="ho-tags"><span class="s-pill tone-red" id="${id}-tag">${tag}</span><span class="s-pill tone-green" id="${id}-hand">${icon(R, "hand")}Handed to ${to}</span>` +
    `<span class="s-pill btn" id="${id}-btn">Reply myself</span></div>`, { y: STAGE.y + 120 });
  inOut(R, id, at, out);
  popIn(R, `#${id}-tag`, tagAt, { scale: 0.4 });
  popIn(R, `#${id}-hand`, handAt, { scale: 0.4 });
  popIn(R, `#${id}-btn`, handAt + 0.18, { scale: 0.4 });
}

/** A laptop (Zoom gallery on screen) whose lid shuts at `close`; optional emoji that drops in at `drop` (👖). */
export function laptopClose(R, { id = "laptop", at, close, out, tiles = ["🙂", "😴", "🥣", "👩‍🦳", "🧑", "🙃"], drop, chat }) {
  // chat: { app, msg, input } puts a desktop chat app on the screen (a request waiting to be typed) instead of the gallery
  const scr = chat ? `<div class="scr chat"><div class="ct-bar"><i></i><i></i><i></i><b>${chat.app}</b></div>` +
    `<div class="ct-msg">${chat.msg}</div><div class="ct-in"><span>${chat.input}</span><em>${icon(R, "arrow-up")}</em></div></div>`
    : `<div class="scr">${tiles.map((t) => `<div style="background: #2c2c2e">${t}</div>`).join("")}</div>`;
  mount(R, id, "lap", `<div class="lid" id="${id}-lid">${scr}</div>` +
    `<div class="base"></div>` + (drop ? `<div class="pants" id="${id}-drop">${drop.emoji}</div>` : ""), { h: 600 });
  inOut(R, id, at, out);
  R.tl.fromTo(`#${id}-lid`, { rotationX: 0, filter: "brightness(1)" }, { rotationX: -88, filter: "brightness(0.35)", duration: 0.32, ease: "power3.in" }, close);
  if (drop) {
    gsap.set(`#${id}-drop`, { xPercent: -50 });
    R.tl.fromTo(`#${id}-drop`, { opacity: 0, y: -380, rotation: -20, scale: 0.6 }, { opacity: 1, y: 0, rotation: 6, scale: 1, duration: 0.42, ease: "bounce.out" }, drop.at);
  }
}

// ---------------------------------------------------------------- tutorials, WhatsApp, documents

/** A setup checklist (the tutorial everyone shares): each step pops with its icon, then gets its green check; an
 *  optional pill at the end. items: [{ icon (Lucide) | app (brand slug), text, sub, at }], done: { text, at }. */
export function checklist(R, { id = "steps", at, out, title, appSlug, items, done }) {
  const rows = items.map((it, k) => `<div class="ck-row" id="${id}-r${k}"><span class="ck-ic">${it.app ? app(it.app, 124) : icon(R, it.icon)}</span>` +
    `<div class="t"><div class="x">${it.text}</div>${it.sub ? `<div class="s">${it.sub}</div>` : ""}</div>` +
    `<span class="ck-ok" id="${id}-k${k}">${icon(R, "check")}</span></div>`).join("");
  mount(R, id, "s-card ck", `<div class="ck-head">${appSlug ? app(appSlug, 76) : ""}<b>${title}</b></div><div class="ck-list">${rows}</div>` +
    (done ? `<div class="ck-done"><span class="s-pill tone-green" id="${id}-done">${icon(R, "circle-check")}${done.text}</span></div>` : ""));
  inOut(R, id, at, out);
  items.forEach((it, k) => {
    popIn(R, `#${id}-r${k}`, it.at, { x: -40, scale: 0.94 });
    popIn(R, `#${id}-k${k}`, it.at + 0.28, { scale: 0.2 });
  });
  if (done) popIn(R, `#${id}-done`, done.at, { scale: 0.4 });
}

/** WhatsApp chat list piling up: rows arrive on top with their green unread badge, the Chats tab counts the unread.
 *  rows: [{ u, m, c, n, time }] in arrival order, times: arrival of each row, unread: { from, to, t0, t1 }. */
export function waChats(R, { id = "wa", at, out, title = "WhatsApp", rows, times, unread }) {
  const list = rows.map((r, k) => `<div class="wa-row" id="${id}-r${k}"><span class="s-av" style="background: ${r.c}">${initials(r.u)}</span>` +
    `<div class="t"><div class="u">${r.u}<span class="tm">${r.time || "now"}</span></div><div class="m">${r.m}<i class="nb">${r.n || 1}</i></div></div></div>`).join("");
  mount(R, id, "s-card wa", `<div class="wa-head">${app("whatsapp", 76)}<b>${title}</b><span class="wa-ic">${icon(R, "search")}</span></div>` +
    `<div class="wa-tabs"><span class="on">Chats <i id="${id}-n">${unread ? unread.from : rows.length}</i></span><span>Updates</span><span>Calls</span></div>` +
    `<div class="wa-list">${list}</div>`, { h: 760 });
  inOut(R, id, at, out);
  stackIn(R, rows.map((_, k) => document.getElementById(`${id}-r${k}`)), times, 132);
  if (unread) counter(R, document.getElementById(`${id}-n`), unread);
}

/** A real document, quoted word for word (terms of service, a README): its source on top, the quote, the key words
 *  highlighted in orange one after the other. marks: [{ text (a substring of the quote), at }], badge: { text, icon }. */
export function docQuote(R, { id = "doc", at, out, source, sub, appSlug, srcIcon = "file-text", badge, text, marks = [] }) {
  let html = text;
  marks.forEach((m, k) => { html = html.replace(m.text, `<mark id="${id}-m${k}">${m.text}</mark>`); });
  mount(R, id, "s-card dq", `<div class="dq-head">${appSlug ? app(appSlug, 84) : `<span class="dq-ic">${icon(R, srcIcon)}</span>`}` +
    `<div><b>${source}</b>${sub ? `<div class="s">${sub}</div>` : ""}</div></div>` +
    (badge ? `<div class="dq-badge" id="${id}-b">${icon(R, badge.icon || "triangle-alert")}${badge.text}</div>` : "") +
    `<div class="dq-text">${html}</div>`);
  inOut(R, id, at, out);
  if (badge) popIn(R, `#${id}-b`, at + 0.2, { scale: 0.5 });
  marks.forEach((m, k) => R.tl.fromTo(`#${id}-m${k}`, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.35, ease: "power2.out", immediateRender: true }, m.at));
}

/** Instagram DMs in big type (the sets' card, like waChats): rows arrive on top with the blue unread dot, the unread
 *  count runs in the header. rows: [{ u, m, c, time }] in arrival order, times: arrival of each row, unread: { from, to, t0, t1 }. */
export function igDMs(R, { id = "igdms", at, out, title = "Messages", rows, times, unread }) {
  const list = rows.map((r, k) => `<div class="igd-row" id="${id}-r${k}"><span class="s-av" style="background: ${r.c}">${initials(r.u)}</span>` +
    `<div class="t"><div class="u">${r.u}</div><div class="m"><b>${r.m}</b><span> · ${r.time || "now"}</span></div></div><i class="dot"></i></div>`).join("");
  mount(R, id, "s-card igd", `<div class="igd-head">${app("instagram", 76)}<b>${title}</b>` +
    `<span class="igd-n"><i id="${id}-n">${unread ? unread.from : rows.length}</i>unread</span></div><div class="igd-list">${list}</div>`, { h: 760 });
  inOut(R, id, at, out);
  stackIn(R, rows.map((_, k) => document.getElementById(`${id}-r${k}`)), times, 132);
  if (unread) counter(R, document.getElementById(`${id}-n`), unread);
}

// ---------------------------------------------------------------- Instagram DM, big type (3D sets)

/** An Instagram DM thread made for a 3D set (shown at 55 % beside the speaker): big bubbles, readable on a phone.
 *  msgs: [{ me, text, at, sep, seen: { text, at }, chip: { text, tone, icon, at } }] (sep: a centred time line before the
 *  bubble, e.g. "Thu 11:58 PM"); status2: { text, at } (the header line turns red: "Active 2w ago"); stamp: { text, at }
 *  (a rubber stamp slammed over the thread: "MISSING", "GHOSTED"). h: card height (default: its content; keep it under
 *  ~980 px so the card ends above the captions at 55 %). w: a narrower card (760) can be shown bigger (70 %) beside the
 *  speaker when the thread is short. */
export function igDM(R, { id = "dm", at, out, user, color = "#d6249f", status = "Active now", status2, msgs, stamp, h, w = STAGE.w }) {
  const body = msgs.map((m, k) => (m.sep ? `<div class="dm-sep" id="${id}-p${k}">${m.sep}</div>` : "") +
    `<div class="dm-m ${m.me ? "me" : "them"}" id="${id}-m${k}"><div class="b">${m.text}</div>` +
    (m.seen ? `<div class="dm-seen" id="${id}-s${k}">${m.seen.text}</div>` : "") +
    (m.chip ? `<span class="s-pill tone-${m.chip.tone || "green"} dm-chip" id="${id}-c${k}">${icon(R, m.chip.icon || "circle-check")}${m.chip.text}</span>` : "") +
    `</div>`).join("");
  mount(R, id, "s-card igdm", `<div class="dm-head">${app("instagram", 64)}<span class="s-av" style="background: ${color}">${initials(user)}</span>` +
    `<div><div class="u">${user}</div><div class="s"><span id="${id}-st">${status}</span>` +
    (status2 ? `<span class="s2" id="${id}-st2">${status2.text}</span>` : "") + `</div></div></div>` +
    `<div class="dm-body">${body}</div>` + (stamp ? `<div class="dm-stamp" id="${id}-x" data-layout-allow-overlap>${stamp.text}</div>` : ""),
  { h, w, x: STAGE.x + (STAGE.w - w) / 2 });
  inOut(R, id, at, out);
  msgs.forEach((m, k) => {
    if (m.sep) popIn(R, `#${id}-p${k}`, m.at - 0.15, { scale: 0.8 });
    popIn(R, `#${id}-m${k}`, m.at);
    if (m.seen) R.tl.fromTo(`#${id}-s${k}`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, m.seen.at);
    if (m.chip) popIn(R, `#${id}-c${k}`, m.chip.at, { scale: 0.4 });
  });
  if (status2) {
    R.tl.set(`#${id}-st`, { display: "none" }, status2.at);
    R.tl.set(`#${id}-st2`, { display: "inline" }, status2.at);
    popIn(R, `#${id}-st2`, status2.at, { scale: 0.7 });
  }
  if (stamp) {
    gsap.set(`#${id}-x`, { xPercent: -50, yPercent: -50, rotation: -12 });
    R.tl.fromTo(`#${id}-x`, { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2.4)" }, stamp.at);
  }
}

// ---------------------------------------------------------------- Instagram comments, Manychat flow (3D sets)

/** The comments under an Instagram post, big type (the sets' card): comments arrive on top (the keyword in bold), the
 *  count runs in the header; an optional pill at the bottom counts what the automation sent ("400 guides sent").
 *  rows: [{ u, c, text, time }] in arrival order, times: arrival of each row, count: { from, to, t0, t1 },
 *  sent: { from, to, t0, t1, text, at } (the pill pops at `at`, its number runs from t0 to t1). */
export function igComments(R, { id = "cmts", at, out, title = "Comments", rows, times, count, sent }) {
  const list = rows.map((r, k) => `<div class="igc-row" id="${id}-r${k}"><span class="s-av" style="background: ${r.c}">${initials(r.u)}</span>` +
    `<div class="t"><div class="u">${r.u}<span> ${r.time || "now"}</span></div><div class="m">${r.text}</div></div>${icon(R, "heart")}</div>`).join("");
  mount(R, id, "s-card igc", `<div class="igc-head">${app("instagram", 76)}<b>${title}</b>` +
    `<span class="igc-n">${icon(R, "message-circle")}<i id="${id}-n">${count ? count.from : rows.length}</i></span></div>` +
    `<div class="igc-list">${list}</div>` +
    (sent ? `<div class="igc-sent"><span class="s-pill tone-green" id="${id}-s">${icon(R, "send")}<i id="${id}-sn">${sent.from}</i>${sent.text}</span></div>` : ""), { h: 760 });
  inOut(R, id, at, out);
  stackIn(R, rows.map((_, k) => document.getElementById(`${id}-r${k}`)), times, 132);
  if (count) counter(R, document.getElementById(`${id}-n`), count);
  if (sent) {
    popIn(R, `#${id}-s`, sent.at, { scale: 0.4 });
    counter(R, document.getElementById(`${id}-sn`), sent);
  }
}

/** A Manychat flow, the way the coach built it (the sets' card): a header with the flow's name (Manychat written out,
 *  never its logo), then rows of nodes joined by arrows; a row holds one node or two side by side. A node with `add`
 *  pops in at that time with an orange ring (what ManySetter adds: "Start conversation", "Continue conversation").
 *  rows: [[{ app | icon, title, sub, add }], [{…}, {…}]]. */
export function mcFlow(R, { id = "mcflow", at, out, title, rows }) {
  const node = (n, k) => `<div class="mcf-node${n.add != null ? " add" : ""}" id="${id}-n${k}">` +
    `<span class="mcf-ic">${n.app ? app(n.app, 92) : icon(R, n.icon || "zap")}</span>` +
    `<div class="t"><div class="x">${n.title}</div>${n.sub ? `<div class="s">${n.sub}</div>` : ""}</div></div>`;
  let k = 0;
  const added = [];
  const html = rows.map((row, j) => {
    const cells = row.map((n) => { if (n.add != null) added.push([k, n.add]); return node(n, k++); });
    const arrowDown = j ? `<div class="mcf-down${row.some((n) => n.add != null) && row.length === 1 ? " add" : ""}" id="${id}-a${j}"></div>` : "";
    return arrowDown + `<div class="mcf-row${row.length > 1 ? " two" : ""}">${cells.join(`<div class="mcf-right" id="${id}-h${j}"></div>`)}</div>`;
  }).join("");
  mount(R, id, "s-card mcf", `<div class="mcf-head"><span class="mcf-tag">Manychat</span><b>${title}</b></div><div class="mcf-canvas">${html}</div>`);
  inOut(R, id, at, out);
  added.forEach(([n, t]) => {
    popIn(R, `#${id}-n${n}`, t, { scale: 0.3 }, 0.3);
    R.tl.fromTo(`#${id}-n${n}`, { boxShadow: "0 0 0 6px #ff611d, 0 0 0 30px rgba(255, 97, 29, 0.35)" },
      { boxShadow: "0 0 0 6px #ff611d, 0 0 0 0px rgba(255, 97, 29, 0)", duration: 0.6, ease: "power2.out", immediateRender: false }, t + 0.1);
  });
  rows.forEach((row, j) => { // an arrow into a row of added nodes draws itself just before them
    const t = row.find((n) => n.add != null)?.add;
    if (j && t != null && row.length === 1) R.tl.fromTo(`#${id}-a${j}`, { scaleY: 0 }, { scaleY: 1, duration: 0.18, ease: "power2.out", immediateRender: true }, t - 0.16);
    if (row.length > 1 && row[1].add != null) R.tl.fromTo(`#${id}-h${j}`, { scaleX: 0 }, { scaleX: 1, duration: 0.18, ease: "power2.out", immediateRender: true }, row[1].add - 0.16);
  });
}
