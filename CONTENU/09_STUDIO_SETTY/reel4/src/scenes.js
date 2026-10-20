// Reel 4 "10 calls, 0 closed": a real conversation in the coach's car (set "car", dusk outside a coworking). He sits at the
// wheel between two discovery calls, proud of his packed week; Setty floats over the passenger seat and asks how many
// paid. The camera on whoever talks, the other one reacts; big cards pop beside the speaker (his Calendly week, the call
// at minute 40, the questions in the DM, who gets what, the invite with the lead's answers, the next call's reminder).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const cl = await import("./assets/engine/calls.js"); // the discovery-call cards (kit)

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, CARD_R } = D; // assets/engine/dialogue.js
const AT = { coach: -0.5, setty: 0.6 }; // lookX of each one looking at the other
// his cards go on the right of the frame (over the door and the pillar): framed on the left, Setty stays out of the shot
const COACH_CARD = { x: 300, dist: 15, y: 820 };

// ---- frame 0 (thumbnail): the wide shot through the windshield, the coach proud at the wheel, Setty smug next to him
R.place({ ...face("smug", { lookX: AT.setty, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("proud", { lookX: AT.coach }));

// ---- 0 Setty: "You booked ten [bleep]ing calls this week, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: AT.setty }));
KC(1.0, 0.3, faceC("smug", { lookX: AT.coach }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Ten, bro. So booked I'm taking calls from my car." (his Calendly week fills up, 10 calls)
const WEEK = [["Jess", "Mon"], ["Marcus", "Mon"], ["Ana", "Tue"], ["Dan", "Tue"], ["Tom", "Wed"], ["Mike", "Wed"], ["Sara", "Thu"],
  ["Brad", "Thu"], ["Leo", "Fri"], ["Nina", "Fri"]];
const COL = ["#d6249f", "#8b5cf6", "#10b981", "#06b6d4", "#f97316", "#ef4444", "#3d5afe", "#64748b", "#eab308", "#ec4899"];
const tiles = WEEK.map(([who, day], k) => ({ who, day, c: COL[k] }));
line(1, faceC("hyped", { lookX: AT.coach }), face("deadpan", { lookX: AT.setty }), COACH_CARD);
side(C.clic1 - 0.01, "right");
cl.callsWeek(R, { id: "week", at: C.clic1, out: L[2].t - 0.38, tiles,
  times: tiles.map((_, k) => C.clic1 + 0.15 + k * ((C.car - C.clic1 - 0.15) / tiles.length)),
  total: { text: "10 calls booked", at: C.booked } });
// ---- 2 Setty: "Nice. How many paid you?"
line(2, face("deadpan", { lookX: AT.setty }), faceC("proud", { lookX: AT.coach }));
// ---- 3 coach: "Okay, zero. But great conversations." (the same week, stamped: 0 clients)
line(3, faceC("defeated", { lookX: AT.coach, lookY: -0.1 }), face("eyeRoll"), COACH_CARD);
KC(C.zero_end + 0.15, 0.25, faceC("hyped", { lookX: AT.coach }), "back.out(1.6)");
side(C.clic2 - 0.01, "right");
cl.callsWeek(R, { id: "week2", at: C.clic2, out: L[4].t - 0.38, tiles, full: true,
  total: { text: "10 calls booked", at: C.clic2 }, stamp: { text: "0 clients", at: C.zero_end - 0.06 } });
// ---- 4 Setty: "Great conversations. Forty minutes in, you finally ask the budget." (the call, the timer races to 40:00)
line(4, face("sly", { lookX: AT.setty }), faceC("confused", { lookX: AT.coach }), CARD_R);
side(C.clic3 - 0.01, "right");
cl.callScreen(R, { id: "call", at: C.clic3, out: L[5].t - 0.38, who: "Brad", emoji: "🧔", bg: "#64748b",
  timer: { from: 38 * 60 + 47, to: 40 * 60 + 2, t0: C.forty - 0.1, t1: C.ask }, ask: { text: "So... what's your budget?", at: C.ask - 0.05 } });
// ---- 5 coach: "And they all go, "I was thinking like fifty bucks?"" (the lead's answer slams, BOOM on "fifty")
line(5, faceC("annoyed", { lookX: AT.coach }), face("shocked", { lookX: AT.setty }), COACH_CARD);
KC(C.quote - 0.08, 0.2, faceC("pleading", { lookX: AT.coach, lookY: 0.15 }), "back.out(1.6)");
side(C.clic4 - 0.01, "right");
cl.callScreen(R, { id: "call2", at: C.clic4, out: L[6].t - 0.38, who: "Brad", emoji: "🧔", bg: "#64748b",
  timer: { from: 40 * 60 + 3, to: 40 * 60 + 11, t0: C.clic4, t1: L[5].end }, ask: { text: "So... what's your budget?", at: C.clic4 + 0.05 },
  reply: { text: "i was thinking like $50?", at: C.quote } });
punch(C.boom1, 25);
// ---- 6 Setty roasts: "That's not sales. That's free consulting from a parked car." → Fahhh on the coach
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: AT.setty }), null);
reaction(C.fahhh1, faceC("annoyed", { lookX: AT.coach }));
// ---- 7 coach: "Bro, maybe I just suck at closing." (slumps)
line(7, faceC("defeated", { nod: 0.06, lookY: -0.15, bend: 0.08 }), face("thinking", { lookX: AT.setty }));
// ---- 8 Setty: "You don't suck. Your link books people who were never buying." (warm, then dead serious, BOOM)
line(8, face("happy", { lookX: AT.setty }), faceC("shocked", { lookX: AT.coach }));
K(C.link - 0.08, 0.25, face("deadpan", { lookX: AT.setty }));
punch(C.boom2, 24);
// ---- 9 coach: "Then how do I know before they book?"
line(9, faceC("thinking", { lookX: AT.coach }), face("sly", { lookX: AT.setty }));
// ---- 10 Setty: "Plug me into Manychat. I ask your questions in the DM, one at a time." (BOOM, the questions one by one)
line(10, face("sly", { lookX: AT.setty }), faceC("skeptical", { lookX: AT.coach }), CARD_R);
punch(C.boom3, 25);
K(C.boom3, 0.25, face("proud", { armRr: 2.2, lookX: AT.setty }), "back.out(2)");
side(C.clic5 - 0.01, "right");
{
  const at0 = C.boom3 + 0.35, s = (C.time + 0.25 - at0) / 4; // the questions one by one, the last on "time."
  cl.dmAsk(R, { id: "dm", at: C.clic5, out: L[11].t - 0.38, user: "chloe.moves", color: "#ec4899", msgs: [
    { me: 1, text: "what are you trying to fix?", at: at0 }, { text: "lose 15 lb before summer", at: at0 + s },
    { me: 1, text: "worked with a coach before?", at: at0 + 2 * s }, { text: "no, first time", at: at0 + 3 * s },
    { me: 1, text: "ready to start this month?", at: at0 + 4 * s }] });
}
// ---- 11 coach: "And the ones who literally can't pay?"
line(11, faceC("skeptical", { lookX: AT.coach }), face("smug", { lookX: AT.setty }));
// ---- 12 Setty: "No calendar. They get your free guide or your cheaper offer." (who gets what)
line(12, face("smug", { lookX: AT.setty }), faceC("thinking", { lookX: AT.coach }), CARD_R);
side(C.clic6 - 0.01, "right");
cl.routeCard(R, { id: "who", at: C.clic6, out: L[13].t - 0.38, title: "Can't pay?", rows: [
  { icon: "calendar-x", text: "your calendar", tone: "red", strike: true, at: C.nocal - 0.12 },
  { icon: "book-open", text: "your free guide", tone: "blue", at: C.guide - 0.1 },
  { icon: "circle-dollar-sign", text: "your cheaper offer", tone: "orange", at: C.cheaper - 0.1 }] });
// ---- 13 coach: "So I'll book fewer calls?"
line(13, faceC("stressed", { lookX: AT.coach }), face("sly", { lookX: AT.setty }));
// ---- 14 Setty: "Fewer calls. Serious ones. With their answers right in the invite." (Calendly, the lead's answers)
line(14, face("proud", { lookX: AT.setty }), faceC("thinking", { lookX: AT.coach }), CARD_R);
side(C.clic7 - 0.01, "right");
cl.bookedBrief(R, { id: "brief", at: C.clic7, out: L[15].t - 0.3, who: "Chloe", when: "Thursday · 2:00 pm", summaryAt: C.serious + 0.1, step: 0.34,
  summary: [{ k: "Goal", v: "lose 15 lb" }, { k: "Coached before", v: "never" }, { k: "Ready", v: "this month" }] });
// ---- 15 coach: "Okay, I'm in. My next call's in two minutes." (the music dies: the wide, his phone lights up)
K(L[15].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[15].t + 0.02, L[15].end - L[15].t + 0.5, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[15].t - 0.1, 0.3, faceC("hyped", { lookX: AT.coach }));
KC(C.clic8 + 0.1, 0.3, faceC("stressed", { lookX: 0.75, lookY: -0.25 }));
K(L[15].t + 0.3, 0.3, face("sly", { lookX: AT.setty }));
tl.set("#stagebox", { scale: 1, x: 0, y: 0 }, C.clic8 - 0.02);
cl.reminder(R, { id: "rem", at: C.clic8, out: L[16].t - 0.3, title: "Discovery call with Kyle", text: "in 2 min", y: 520 });
tl.to(R.set.lights.phone, { intensity: 9, duration: 0.15, ease: "power2.out", lazy: false }, C.clic8);
tl.to(R.set.phoneScreen.color, { r: 1.5, g: 1.5, b: 1.5, duration: 0.15, ease: "power2.out", lazy: false }, C.clic8);
// ---- 16 Setty roasts: "Take it. Spoiler, he's thinking like fifty [bleep]ing bucks." (his next call, same answer) → Fahhh
line(16, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: AT.setty }), null, CARD_R);
side(C.clic9 - 0.01, "right");
cl.callScreen(R, { id: "call3", at: C.clic9, out: C.fahhh2 - 0.32, who: "Kyle", emoji: "🧑", bg: "#3d5afe",
  timer: { from: 0, to: 9, t0: C.clic9, t1: C.fahhh2 }, reply: { text: "i was thinking like $50?", at: C.fifty2 - 0.05 } });
const B2 = R.DATA.bleeps[1];
K(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
K(B2.end + 0.05, 0.1, { censor: 0 });
K(B2.end + 0.1, 0.25, face("laughing"), "back.out(2)");
reaction(C.fahhh2, faceC("annoyed", { lookX: AT.coach }));
// ---- 17 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(17, face("smug", { lookX: AT.setty }), faceC("laughing"), { y: 950, dist: 12.5 }); // lower and smaller: the comment bar stays off his head
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: AT.setty }));
KC(C.dms_end + 0.2, 0.4, faceC("proud", { lookX: AT.coach }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
