// Reel 10 "The big coaches' DMs": a real conversation in a private jet the coach rented for one hour (set "jet", golden
// hour over the clouds). He plays the big coach, phone in hand; Setty sits across the walnut table on two cushions and
// shows him how the big accounts really run their DMs. The camera on whoever talks, the other one reacts; cards pop
// beside the speaker (his Instagram DMs, the real job post, the big-account system, his own setup, what a setter costs,
// the pipeline, the take-over and the price).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const fc = (name, extra = {}) => faceC(name, { phone: 1, ...extra }); // he never lets go of his phone

// ---- frame 0 (thumbnail): the wide shot, the coach living the big-coach life in his jet, Setty smug across the table
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, fc("proud", { lookX: 0.5 }));

// ---- 0 Setty: "You still answer your own [bleep]ing DMs, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Bro, private jet. This is how the big coaches live." (arms open, the windows on the clouds behind him)
line(1, fc("hyped", { armLr: 1.1, armLf: 0.5, lookX: 0.4 }), face("eyeRoll"));
KC(C.live - 0.1, 0.3, fc("proud", { armLr: 1.3, armLf: 0.3, nod: -0.1, lookX: 0.3 }), "back.out(2)");
// ---- 2 Setty roasts: "You rented it for an hour and spent forty minutes in your DMs." (his Instagram DMs) → Fahhh
line(2, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), null, CARD_R);
side(C.clic1 - 0.01, "right");
const DM = [["jess.fit", "price?"], ["marcus_lifts", "is the program still open?"], ["ana.moves", "how does it work?"],
  ["dan.trains", "info pls"], ["tom_runs", "can we talk today?"], ["sam.b", "hello??"]];
const COL = ["#d6249f", "#8b5cf6", "#10b981", "#06b6d4", "#f97316", "#ef4444"];
st.igDMs(R, { id: "igdms", at: C.clic1, out: C.fahhh1 - 0.32, rows: DM.map(([u, m], k) => ({ u, m, c: COL[k], time: "now" })),
  times: DM.map((_, k) => C.clic1 + 0.1 + k * ((C.indms - C.clic1) / DM.length)), unread: { from: 9, to: 40, t0: C.clic1, t1: C.indms + 0.3 } });
K(C.forty - 0.05, 0.2, face("laughing", { lookX: -0.5 }), "back.out(2)");
reaction(C.fahhh1, fc("annoyed", { lookX: 0.6 }));
// ---- 3 coach: "Nah, big coaches answer their own DMs. That's trust." (the false belief, sure of himself)
line(3, fc("smug", { lookX: 0.4, headTilt: 0.08 }), face("deadpan", { lookX: -0.7 }));
KC(C.trust - 0.08, 0.25, fc("proud", { nod: -0.12, lookX: 0.4 }), "back.out(2)");
// ---- 4 Setty: "Big coaches hire people for that. Read their job posts."
line(4, face("sly", { lookX: -0.4 }), fc("skeptical", { lookX: 0.5 }));
// ---- 5 coach: "Holy [bleep], three sixty-three K followers, and he's hiring someone?" (the real post, word for word, BOOM)
line(5, fc("shocked", { armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookX: -0.2, lookY: -0.2 }), face("smug", { lookX: -0.7 }), CARD_L);
side(C.clic2 - 0.01, "left");
st.docQuote(R, { id: "post", at: C.clic2, out: L[6].t - 0.38, source: "Hiring: DM appointment setter", sub: "a health coach's public job post",
  srcIcon: "briefcase", text: "I have 363K followers on Instagram, so a ton of leads coming in for you.",
  marks: [{ text: "363K followers", at: C.n363 }, { text: "a ton of leads", at: C.hiring }] });
const B2 = R.DATA.bleeps[1];
KC(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
KC(B2.end + 0.05, 0.1, { censor: 0 });
KC(C.hiring - 0.1, 0.25, fc("panic", { lookX: 0.3 }), "back.out(2)");
punch(C.boom1, 24);
// ---- 6 Setty: "The coach films, the setter answers, the closer closes." (the big-account system, one row per job)
line(6, face("deadpan", { lookX: -0.3 }), fc("confused", { lookX: 0.5 }), CARD_R);
side(C.clic3 - 0.01, "right");
st.checklist(R, { id: "sys", at: C.clic3, out: L[7].t - 0.38, title: "A big account's DMs", appSlug: "instagram",
  items: [{ icon: "video", text: "Content", sub: "the coach", at: C.films }, { icon: "message-circle", text: "DMs", sub: "the setter", at: C.answers },
    { icon: "phone", text: "Calls", sub: "the closer", at: C.closes }] });
// ---- 7 coach: "Wait, so I'm doing all three?"
line(7, fc("confused", { lookX: 0.5, headTilt: -0.1 }), face("deadpan", { lookX: -0.7 }));
KC(C.three - 0.1, 0.25, fc("stressed", { lookX: 0.4 }), "back.out(2)");
// ---- 8 Setty roasts: "Yep, a one-man call center in a beanie." (his own setup: you, you, you) → Fahhh
line(8, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.5 }), null, CARD_R);
side(C.oneman - 0.31, "right");
st.checklist(R, { id: "you", at: C.oneman - 0.3, out: C.fahhh2 - 0.32, title: "Your DMs", appSlug: "instagram",
  items: [{ icon: "video", text: "Content", sub: "you", at: C.oneman }, { icon: "message-circle", text: "DMs", sub: "you", at: C.callc },
    { icon: "phone", text: "Calls", sub: "you", at: C.beanie - 0.15 }] });
K(C.beanie - 0.05, 0.2, face("laughing", { lookX: -0.5 }), "back.out(2)");
reaction(C.fahhh2, fc("annoyed", { lookX: 0.6 }));
// ---- 9 coach: "Bro, I reply at midnight. I don't even like coaching anymore." (the phone drops in his lap)
line(9, fc("defeated", { nod: 0.06, lookY: -0.15, bend: 0.06 }), face("pleading", { lookX: -0.7 }), { y: 780, x: 540 }); // his head drops: frame it higher, push less
KC(C.coaching - 0.1, 0.4, fc("defeated", { nod: 0.1, lookY: -0.3, bend: 0.1, armRf: 0.2 }), "power2.out");
// ---- 10 Setty: "Then copy their system, not their payroll." (what a setter costs, BOOM on "payroll.")
line(10, face("sly", { lookX: -0.3 }), fc("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic5 - 0.01, "right");
st.docQuote(R, { id: "pay", at: C.clic5, out: L[11].t - 0.38, source: "What a setter costs", sub: "US appointment setter · PayScale, May 2026",
  srcIcon: "circle-dollar-sign", text: "About $13 to $21 an hour, plus commission.",
  marks: [{ text: "$13 to $21 an hour", at: C.system }, { text: "plus commission", at: C.boom2 }] });
punch(C.boom2, 25);
K(C.boom2, 0.25, face("smug", { armRr: 1.6 }), "back.out(2)");
// ---- 11 coach: "So a bot? My leads hate bots."
line(11, fc("skeptical", { lookX: 0.5 }), face("eyeRoll"));
KC(C.bots - 0.08, 0.25, fc("disgusted", { lookX: 0.4 }), "back.out(2)");
// ---- 12 Setty: "Plug me into Manychat. I reply in your voice, only serious leads get your calendar." (the pipeline)
line(12, face("proud", { lookX: -0.2 }), fc("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right");
st.flowPipeline(R, { id: "flow", at: C.clic6, out: L[13].t - 0.38, connect: C.mc + 0.1, sources: ["instagram", "whatsapp", "messenger"],
  target: "calendly", targetLabel: "Serious leads only", pulses: [C.voice, C.serious, C.calendar] });
// ---- 13 coach: "And the big deals?"
line(13, fc("skeptical", { lookX: 0.5, headTilt: 0.1 }), face("smug", { lookX: -0.6 }));
// ---- 14 Setty: "You jump in whenever you want. A hundred nineteen bucks a month." (BOOM on "month.")
line(14, face("smug", { lookX: -0.3 }), fc("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic7 - 0.01, "right");
st.checklist(R, { id: "ms", at: C.clic7, out: L[15].t - 0.3, title: "ManySetter", appSlug: "manysetter",
  items: [{ icon: "hand", text: "You jump in", sub: "any chat, anytime", at: C.jump }, { icon: "circle-dollar-sign", text: "$119/month", sub: "per live setter", at: C.price }] });
punch(C.boom3, 25);
KC(C.boom3, 0.3, fc("shocked", { lookX: 0.5 }), "back.out(2)");
// ---- 15 coach: "Okay. How do I set you up?" (the music dies: the wide shot, silence, a slow push)
K(L[15].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[15].t + 0.02, L[15].end - L[15].t + 0.5, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[15].t - 0.1, 0.3, fc("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[15].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 16 Setty roasts: "Hurry, this jet turns back into an Uber in ten minutes." (the rental runs out) → Fahhh
// a wider framing, his face lower: the red pill sits between the hook title and his head
line(16, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null, { dist: 12.5, y: 880, x: 540 });
kit.toast(R, { id: "rent", icon: "clock", text: "Jet rental: 10 min left", tone: "red", y: 515, at: C.uber - 0.25, out: C.fahhh3 - 0.1 });
K(C.uber - 0.05, 0.2, face("laughing", { lookX: -0.5 }), "back.out(2)");
reaction(C.fahhh3, fc("panic", { lookX: 0.6 }));
// ---- 17 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(17, face("smug", { lookX: 0.2 }), fc("laughing"), { dist: 12.5, y: 900, x: 540 }); // the comment bar above his head
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, fc("proud", { lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment + 0.12, caret: C.comment + 0.18, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.45 }); // once back on the wide
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
