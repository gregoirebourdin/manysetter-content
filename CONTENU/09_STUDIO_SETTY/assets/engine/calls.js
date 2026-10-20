// Discovery-call cards for set reels (reel4, 20/10): big type made to be read at 55 % beside a speaker (D.side). A coach's
// week of calls, the call itself (Zoom 1:1, a timer, the budget moment), the questions asked in the DM one at a time, a
// "who gets what" card, the Calendly confirmation with the lead's answers, a phone reminder. Same contract as stage.js
// (id, at, out; enter by zooming in, leave by zooming through). In scenes.js: const cl = await import("./assets/engine/calls.js");
// Styles live below and are injected once (no extra stylesheet to load before the first frame).
import { app } from "./stage.js";

const CSS = `
.cl-week { padding-bottom: 34px; }
.cl-head { height: 136px; display: flex; align-items: center; gap: 22px; padding: 0 40px; border-bottom: 2px solid #efefef; }
.cl-head b { font: 800 58px/1 Inter, sans-serif; letter-spacing: -0.035em; white-space: nowrap; }
.cl-head .r { margin-left: auto; font: 700 44px/1 Inter, sans-serif; color: #6b7280; white-space: nowrap; }
.cl-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; padding: 30px 36px 0; }
.cl-tile { position: relative; height: 214px; border-radius: 30px; background: #eef4ff; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px; opacity: 0; }
.cl-tile .s-av { width: 112px; height: 112px; font: 800 44px/1 Inter, sans-serif; color: #fff; }
.cl-tile > span:not(.s-av) { font: 800 52px/1 Inter, sans-serif; color: #0b3a8a; letter-spacing: -0.03em; }
.cl-tile .no { position: absolute; inset: 0; border-radius: 30px; background: rgba(239, 241, 245, 0.86); display: flex;
  align-items: center; justify-content: center; opacity: 0; }
.cl-tile .no svg.i { width: 96px; height: 96px; color: #ef4444; stroke-width: 3; }
.cl-tot { position: relative; margin: 30px 36px 0; height: 140px; }
.cl-tot .s-pill { position: absolute; inset: 0; justify-content: center; font: 800 80px/1 Inter, sans-serif; letter-spacing: -0.035em; opacity: 0; }
.cl-tot .s-pill svg.i { width: 76px; height: 76px; }

.cl-call { background: #141519; color: #fff; height: 800px; }
.cl-call .cl-head { border-bottom: 2px solid #26272d; }
.cl-call .rec { margin-left: auto; display: flex; align-items: center; gap: 14px; background: #26272d; border-radius: 999px; padding: 14px 26px;
  font: 800 64px/1 Inter, sans-serif; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
.cl-call .rec i { width: 26px; height: 26px; border-radius: 50%; background: #ff3b30; }
.cl-vid { position: absolute; left: 26px; right: 26px; top: 162px; height: 510px; border-radius: 30px; overflow: hidden;
  background: radial-gradient(120% 90% at 50% 30%, #4b5563, #1f2229); display: flex; align-items: center; justify-content: center; }
.cl-vid .face { width: 300px; height: 300px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 190px; color: #fff; }
.cl-vid .nm { position: absolute; left: 22px; top: 20px; background: rgba(0, 0, 0, 0.55); border-radius: 14px; padding: 8px 18px;
  font: 700 38px/1 Inter, sans-serif; }
.cl-vid .pip { position: absolute; right: 20px; top: 20px; width: 190px; height: 140px; border-radius: 20px; background: #2b2e36;
  display: flex; align-items: center; justify-content: center; font-size: 76px; color: #fff; box-shadow: 0 0 0 4px #22c55e; }
.cl-sub { position: absolute; left: 24px; right: 24px; bottom: 24px; text-align: center; opacity: 0; }
.cl-sub span { display: inline-block; background: rgba(0, 0, 0, 0.78); border-radius: 22px; padding: 16px 30px; font: 800 66px/1.1 Inter, sans-serif; letter-spacing: -0.03em; }
.cl-say { position: absolute; left: 50%; top: 200px; width: 900px; margin-left: -450px; text-align: center; opacity: 0; }
.cl-say span { display: inline-block; background: #fff; color: #121110; border-radius: 44px; padding: 30px 46px; font: 800 96px/1.04 Inter, sans-serif;
  letter-spacing: -0.03em; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.8); }
.cl-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 120px; display: flex; align-items: center; justify-content: center; gap: 34px; }
.cl-bar em { width: 84px; height: 84px; border-radius: 50%; background: #2b2e36; display: flex; align-items: center; justify-content: center; }
.cl-bar em.end { width: 120px; border-radius: 42px; background: #ef4444; }
.cl-bar svg.i { width: 44px; height: 44px; color: #fff; }

.cl-dm { height: 820px; }
.cl-dm .cl-head .s-av { width: 92px; height: 92px; font: 800 36px/1 Inter, sans-serif; color: #fff; box-shadow: 0 0 0 5px #fff, 0 0 0 9px #d6249f; }
.cl-dm .cl-head .u b { display: block; font: 800 50px/1.05 Inter, sans-serif; letter-spacing: -0.03em; }
.cl-dm .cl-head .u small { font: 600 34px/1.2 Inter, sans-serif; color: #737373; }
.cl-dm .cl-head .s-app { margin-left: auto; }
.cl-msgs { display: flex; flex-direction: column; gap: 16px; padding: 28px 32px 0; }
.cl-msgs .b { max-width: 94%; padding: 20px 30px; border-radius: 44px; font: 700 58px/1.1 Inter, sans-serif; letter-spacing: -0.025em; opacity: 0; }
.cl-msgs .b.me { align-self: flex-end; color: #fff; background: linear-gradient(135deg, #7a3cff, #3d5afe); }
.cl-msgs .b.lead { align-self: flex-start; background: #efefef; color: #121110; }

.cl-route { padding-bottom: 30px; }
.cl-route .q { font: 800 88px/1 Inter, sans-serif; letter-spacing: -0.04em; }
.cl-rows { padding: 22px 40px 0; display: flex; flex-direction: column; gap: 22px; }
.cl-row { display: flex; align-items: center; gap: 28px; height: 176px; padding: 0 30px; border-radius: 34px; background: #f4f4f6; opacity: 0; }
.cl-row .ic { width: 128px; height: 128px; border-radius: 30px; display: flex; align-items: center; justify-content: center; flex: none; color: #fff; }
.cl-row .ic svg.i { width: 74px; height: 74px; }
.cl-row .x { position: relative; font: 800 74px/1 Inter, sans-serif; letter-spacing: -0.035em; white-space: nowrap; }
.cl-row.red .ic { background: #ef4444; } .cl-row.green .ic { background: #16a34a; }
.cl-row.orange .ic { background: #ff611d; } .cl-row.blue .ic { background: #3d5afe; }
.cl-row.strike .x { color: #9ca3af; }
.cl-row .x i { position: absolute; left: -6px; right: -6px; top: 52%; height: 10px; border-radius: 5px; background: #ef4444; transform-origin: left center; }

.cl-book { padding-bottom: 34px; }
.cl-book .chk { width: 84px; height: 84px; border-radius: 50%; background: #16a34a; color: #fff; display: flex; align-items: center; justify-content: center; flex: none; }
.cl-book .chk svg.i { width: 52px; height: 52px; stroke-width: 3; }
.cl-ev { padding: 26px 40px 0; }
.cl-ev h3 { font: 600 72px/1.02 Nohemi, sans-serif; letter-spacing: -0.035em; }
.cl-ev .r { display: flex; align-items: center; gap: 16px; margin-top: 14px; font: 700 48px/1 Inter, sans-serif; color: #4b5563; }
.cl-ev .r svg.i { width: 44px; height: 44px; }
.cl-sum { margin: 26px 36px 0; padding: 24px 30px 30px; border-radius: 32px; background: #fff4ee; box-shadow: inset 0 0 0 3px #ffd2bd; opacity: 0; }
.cl-sum .h { display: flex; align-items: center; gap: 14px; font: 800 34px/1 Inter, sans-serif; color: #c2410c; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
.cl-sum .li { margin-top: 18px; font: 700 60px/1.08 Inter, sans-serif; letter-spacing: -0.03em; opacity: 0; white-space: nowrap; }
.cl-sum .li b { color: #c2410c; }

.cl-rem { display: flex; align-items: center; gap: 28px; padding: 30px 36px; border-radius: 44px; background: rgba(250, 250, 252, 0.94); }
.cl-rem .t { flex: 1; min-width: 0; }
.cl-rem .t .h { display: flex; align-items: baseline; gap: 16px; font: 700 34px/1 Inter, sans-serif; color: #6b7280; }
.cl-rem .t .h em { margin-left: auto; font-style: normal; }
.cl-rem .t b { display: block; margin-top: 10px; font: 800 56px/1.05 Inter, sans-serif; letter-spacing: -0.035em; color: #121110; white-space: nowrap; }
.cl-rem .t span { display: block; margin-top: 6px; font: 700 46px/1.05 Inter, sans-serif; color: #ef4444; }
`;
if (!document.getElementById("cl-css")) document.head.insertAdjacentHTML("beforeend", `<style id="cl-css">${CSS}</style>`);

const STAGE = { x: 60, y: 540, w: 960 };
const initials = (u) => u.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
const ico = (R, name) => R.ico(name, "i");
function mount(R, id, cls, html, { x = STAGE.x, y = STAGE.y, w = STAGE.w, h } = {}) {
  const box = document.getElementById("stagebox");
  return R.mount(box ? "stagebox" : "back", "stage", `<div class="st ${cls}" id="${id}" style="left: ${x}px; top: ${y}px; width: ${w}px;${h ? ` height: ${h}px;` : ""}">${html}</div>`, box || undefined);
}
function inOut(R, id, at, out) {
  if (at <= 0) R.tl.set(`#${id}`, { opacity: 1 }, 0);
  else R.tl.fromTo(`#${id}`, { opacity: 0, y: 50, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }, at);
  if (out != null) R.tl.to(`#${id}`, { opacity: 0, scale: 1.22, duration: 0.18, ease: "power2.in" }, out);
}
const popIn = (R, target, at, from = { y: 18, scale: 0.92 }, dur = 0.24) =>
  R.tl.fromTo(target, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, scale: 1, duration: dur, ease: "back.out(2.2)" }, at);

/** A coach's week of booked calls: the tiles pop one by one (or are all there: full), a green total; then `stamp` greys
 *  every tile with a red cross and the total turns red ("0 clients"). tiles: [{ who, day, c }], times: one per tile. */
export function callsWeek(R, { id = "week", at, out, title = "Scheduled events", right = "This week", tiles, times, full = false,
  total, stamp }) {
  const grid = tiles.map((tl, k) => `<div class="cl-tile" id="${id}-t${k}"><span class="s-av" style="background: ${tl.c}">${initials(tl.who)}</span>` +
    `<span>${tl.day || tl.time}</span><div class="no" id="${id}-n${k}">${ico(R, "x")}</div></div>`).join("");
  mount(R, id, "s-card cl-week", `<div class="cl-head">${app("calendly", 76)}<b>${title}</b><span class="r">${right}</span></div>` +
    `<div class="cl-grid">${grid}</div><div class="cl-tot">` +
    (total ? `<span class="s-pill tone-green" id="${id}-ok">${ico(R, "calendar-check")}${total.text}</span>` : "") +
    (stamp ? `<span class="s-pill tone-red" id="${id}-ko">${ico(R, "circle-x")}${stamp.text}</span>` : "") + `</div>`);
  inOut(R, id, at, out);
  tiles.forEach((_, k) => (full ? R.tl.set(`#${id}-t${k}`, { opacity: 1 }, at) : popIn(R, `#${id}-t${k}`, times[k], { scale: 0.4 })));
  if (total) (total.at <= at ? R.tl.set(`#${id}-ok`, { opacity: 1 }, at) : popIn(R, `#${id}-ok`, total.at, { scale: 0.5 }));
  if (stamp) {
    tiles.forEach((_, k) => popIn(R, `#${id}-n${k}`, stamp.at + k * 0.035, { scale: 1.8 }, 0.18));
    if (total) R.tl.to(`#${id}-ok`, { opacity: 0, duration: 0.1 }, stamp.at + 0.1);
    popIn(R, `#${id}-ko`, stamp.at + 0.1, { scale: 1.6 }, 0.22);
  }
}

/** The discovery call (Zoom 1:1): the lead's video, you in the corner, the call timer running, the coach's question
 *  as a subtitle, then the lead's answer slammed as a bubble. timer: { from, to, t0, t1 } in seconds of call. */
export function callScreen(R, { id = "call", at, out, title = "Discovery call", who, emoji = "🙂", bg = "#8b5cf6", me = "🧢", timer,
  ask, reply }) {
  mount(R, id, "s-card cl-call", `<div class="cl-head">${app("zoom", 76)}<b>${title}</b><span class="rec"><i></i><span id="${id}-tm"></span></span></div>` +
    `<div class="cl-vid"><div class="face" style="background: ${bg}" data-layout-allow-overlap data-layout-allow-occlusion>${emoji}</div>` +
    `<div class="nm" data-layout-allow-overlap data-layout-allow-occlusion>${who}</div><div class="pip" data-layout-allow-overlap data-layout-allow-occlusion>${me}</div>` +
    (ask ? `<div class="cl-sub" id="${id}-q"><span>${ask.text}</span></div>` : "") + `</div>` +
    (reply ? `<div class="cl-say" id="${id}-a" data-layout-allow-overlap><span>${reply.text}</span></div>` : "") +
    `<div class="cl-bar"><em>${ico(R, "mic")}</em><em>${ico(R, "video")}</em><em class="end">${ico(R, "phone")}</em></div>`);
  inOut(R, id, at, out);
  const el = document.getElementById(`${id}-tm`), fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  R.onFrame((t) => {
    const k = Math.min(1, Math.max(0, (t - timer.t0) / (timer.t1 - timer.t0)));
    el.textContent = fmt(timer.from + (timer.to - timer.from) * (1 - Math.pow(1 - k, 2)));
  });
  if (ask) popIn(R, `#${id}-q`, ask.at, { y: 24 });
  if (reply) {
    if (ask) R.tl.to(`#${id}-q`, { opacity: 0, duration: 0.12 }, reply.at - 0.05);
    popIn(R, `#${id}-a`, reply.at, { scale: 1.7, y: -30 }, 0.26);
  }
}

/** Instagram DM, big type: your messages (right, purple) and the lead's (left, grey), each popping at its time, top to
 *  bottom. msgs: [{ me, text, at }]. */
export function dmAsk(R, { id = "dm", at, out, user, color = "#d6249f", status = "Active now", msgs }) {
  mount(R, id, "s-card cl-dm", `<div class="cl-head"><span class="s-av" style="background: ${color}">${initials(user)}</span>` +
    `<div class="u"><b>${user}</b><small>${status}</small></div>${app("instagram", 76)}</div>` +
    `<div class="cl-msgs">${msgs.map((m, k) => `<div class="b ${m.me ? "me" : "lead"}" id="${id}-m${k}">${m.text}</div>`).join("")}</div>`);
  inOut(R, id, at, out);
  msgs.forEach((m, k) => popIn(R, `#${id}-m${k}`, m.at, { x: m.me ? 40 : -40, scale: 0.85 }));
}

/** A "who gets what" card: a question on top, then rows (icon tile + text) popping at their time; a `strike` row is
 *  crossed out in red (what they do NOT get). rows: [{ icon, text, tone: red|green|orange|blue, strike, at }]. */
export function routeCard(R, { id = "route", at, out, title, appSlug = "manysetter", rows }) {
  mount(R, id, "s-card cl-route", `<div class="cl-head">${app(appSlug, 76)}<b class="q">${title}</b></div><div class="cl-rows">` +
    rows.map((r, k) => `<div class="cl-row ${r.tone || "blue"}${r.strike ? " strike" : ""}" id="${id}-r${k}"><span class="ic">${ico(R, r.icon)}</span>` +
      `<span class="x">${r.text}${r.strike ? `<i id="${id}-s${k}"></i>` : ""}</span></div>`).join("") + `</div>`);
  inOut(R, id, at, out);
  rows.forEach((r, k) => {
    popIn(R, `#${id}-r${k}`, r.at, { x: -40, scale: 0.9 });
    if (r.strike) R.tl.fromTo(`#${id}-s${k}`, { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: "power2.out", immediateRender: true }, r.at + 0.2);
  });
}

/** Calendly "You are scheduled", big type, with the lead's answers ManySetter adds to the event.
 *  summary: [{ k, v }] lines popping from summaryAt, `step` s apart. */
export function bookedBrief(R, { id = "brief", at, out, who, when, title = "Discovery call", summaryAt, summary = [], step = 0.3 }) {
  mount(R, id, "s-card cl-book", `<div class="cl-head"><span class="chk">${ico(R, "check")}</span><b>You are scheduled</b>` +
    `<span class="r">${app("calendly", 76)}</span></div>` +
    `<div class="cl-ev"><h3>${title} with ${who}</h3><div class="r">${ico(R, "calendar")}${when}</div></div>` +
    `<div class="cl-sum" id="${id}-sum"><div class="h">${app("manysetter", 40)}Lead summary · added by ManySetter</div>` +
    summary.map((s, k) => `<div class="li" id="${id}-l${k}"><b>${s.k}:</b> ${s.v}</div>`).join("") + `</div>`);
  inOut(R, id, at, out);
  if (summaryAt != null) {
    popIn(R, `#${id}-sum`, summaryAt, { y: 30 });
    summary.forEach((_, k) => popIn(R, `#${id}-l${k}`, summaryAt + 0.15 + k * step, { x: -24 }));
  }
}

/** A phone notification banner (iOS look, big type): app icon, app name + time, title, text. y: its top on the stage. */
export function reminder(R, { id = "rem", at, out, appSlug = "calendly", appName = "Calendly", time = "now", title, text, y = 540 }) {
  mount(R, id, "cl-rem-w", `<div class="cl-rem">${app(appSlug, 112)}<div class="t"><div class="h">${appName}<em>${time}</em></div>` +
    `<b>${title}</b><span>${text}</span></div></div>`, { y });
  R.tl.fromTo(`#${id}`, { opacity: 0, y: -120 }, { opacity: 1, y: 0, duration: 0.32, ease: "back.out(1.6)" }, at);
  if (out != null) R.tl.to(`#${id}`, { opacity: 0, y: -80, duration: 0.2, ease: "power2.in" }, out);
}
