// Reel 6 "The 5-day challenge": a real conversation in the coach's living room, the night of day 6 (set "livingroom"). He
// slumps on his couch, phone in hand, cold pizza on the table, the ring light still on since Monday; Setty sits on the
// armrest. His DMs exploded, he answered twenty, he wants to quit challenges; Setty turns it around (the challenge worked,
// what's outdated is answering every DM by hand) and the product comes up because he asks. The camera on whoever talks,
// cards beside him (his challenge, his Instagram inbox, the lead left on read, the setter, the Calendly booking), cut-ins
// on the pizza and the ring light, and the ring light finally switched off.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.outdated, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, punch, push, CARD_L } = D; // assets/engine/dialogue.js
const fc = (name, extra = {}) => faceC(name, { phone: 1, ...extra }); // he never lets go of his phone
// the cards a bit bigger than D.side's 55 % (60 %): readable on a phone, inside the frame, clear of the speaker's face
const big = (t, where) => tl.set("#stagebox", { scale: 0.6, x: where === "left" ? -215 : 250, y: -94 }, t);
// Setty beside a card: closer than D.CARD_R (this set's armrest is low, the default framing shows mostly floor)
const SR = { x: 330, dist: 15.5, y: 860 };
const COL = ["#d6249f", "#8b5cf6", "#10b981", "#06b6d4", "#f97316", "#ef4444"];

// ---- frame 0 (thumbnail): the wide shot, day 6, the coach slumped on his phone, Setty smug on the armrest
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, fc("defeated", { lookX: 0.3, lookY: -0.2 }));

// ---- 0 Setty: "You did your [bleep]ing 5-day challenge, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Five days live, bro. Pitched the offer last night. Banger." (his challenge, ticked off)
line(1, fc("proud", { lookX: 0.4 }), face("sleepy", { lookX: -0.6 }), CARD_L);
big(C.clic1 - 0.01, "left");
st.checklist(R, { id: "chal", at: C.clic1, out: L[2].t - 0.26, title: "My 5-day challenge", appSlug: "instagram",
  items: [{ icon: "video", text: "5 days live", sub: "Day 1 to Day 5", at: C.five },
    { icon: "rocket", text: "Offer pitched live", sub: "last night, day 5", at: C.pitched }],
  done: { text: "Banger 🔥", at: C.banger } });
KC(C.banger - 0.05, 0.25, fc("hyped", { lookX: 0.4 }), "back.out(2)");
// ---- 2 Setty roasts: "Then why are you eating cold pizza at midnight?" (cut to the cold pizza) → Fahhh on the coach
line(2, face("sly", { lookX: -0.6 }), null);
shotTo(C.pizza - 0.08, "pizza", { dur: 0.12, ease: "power4.out" });
shotTo(C.pizza + 0.95, "setty", { dur: 0.12, ease: "power4.out" });
K(C.pizza + 0.95, 0.2, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }), "back.out(2)");
push(C.pizza + 1.1, L[2].end + 0.3, "setty", {}, 0.85);
reaction(C.fahhh1, fc("annoyed", { lookX: 0.6 }));
// ---- 3 coach: "Day six, man. My DMs exploded. Still open? Can I pay in two parts?" (his Instagram inbox floods)
line(3, fc("stressed", { lookX: 0.2, lookY: -0.25, sweat: 1 }), face("deadpan", { lookX: -0.7 }), CARD_L);
big(C.clic2 - 0.01, "left");
{
  const rows = [["dan.k", "link??"], ["tom.rivera", "price?"], ["ana.moves", "does it work if I travel?"],
    ["jess.fit", "is it still open?"], ["marcus_t", "can I pay in 2 parts?"], ["mia.lifts", "still open???"]];
  const times = [C.clic2 + 0.06, C.clic2 + 0.4, C.exploded + 0.1, C.open - 0.05, C.pay - 0.05, C.pay + 0.5]; // never an empty card
  st.igDMs(R, { id: "dms", at: C.clic2, out: L[4].t - 0.38, rows: rows.map(([u, m], k) => ({ u, m, c: COL[k] })), times,
    unread: { from: 9, to: 214, t0: C.clic2, t1: L[3].end } });
}
KC(C.open - 0.1, 0.25, fc("pleading", { lookX: 0.3, sweat: 1 }));
// ---- 4 Setty: "How many did you answer?"  ·  5 coach: "Like twenty." (the music dies: the deadpan beat)
line(4, face("deadpan", { lookX: -0.7 }), fc("stressed", { lookX: 0.5 }));
line(5, fc("pleading", { lookX: 0.5, lookY: -0.15 }), face("deadpan", { lookX: -0.7, lidL: 0.62, lidR: 0.62 }));
// ---- 6 Setty, dead serious: "Out of hundreds. They showed up five days straight, now they're on read." (BOOM)
line(6, face("deadpan", { lookX: -0.4, browLr: -0.2, browRr: 0.2 }), fc("shocked", { lookX: 0.5 }), SR);
big(C.clic3 - 0.01, "right");
st.igDM(R, { id: "read", at: C.clic3, out: L[7].t - 0.25, user: "jess.fit", color: COL[0], status: "Active now",
  msgs: [{ text: "day 5 was insane 🔥 I showed up every single day", at: C.clic3 + 0.08, sep: "Fri 11:42 PM" },
    { text: "is the offer still open?", at: C.showed + 0.95 }],
  stamp: { text: "ON READ", at: C.now - 0.05 } });
punch(C.boom1, 25);
// ---- 7 coach: "Oh [bleep]. I'm fried. Next month, no challenge."
line(7, fc("panic", { sweat: 1, lookX: 0.3 }), face("deadpan", { lookX: -0.7 }));
const B2 = R.DATA.bleeps[1];
KC(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
KC(B2.end + 0.05, 0.1, { censor: 0 });
KC(T(B2.i + 1) - 0.1, 0.35, fc("defeated", { sweat: 1, lookX: 0.3, lookY: -0.2, bend: 0.06 }));
// ---- 8 Setty, the turn: "The challenge worked, look at that inbox. What's outdated is answering every DM by hand." (BOOM)
line(8, face("excuseMe", { lookX: -0.5, armRr: 0.6, armRf: 1.0 }), fc("confused", { lookX: 0.5 }), SR);
big(C.worked - 0.2, "right");
{
  const rows = [["mia.lifts", "still open???"], ["marcus_t", "can I pay in 2 parts?"], ["jess.fit", "is it still open?"],
    ["ana.moves", "does it work if I travel?"], ["tom.rivera", "price?"], ["dan.k", "link??"]];
  st.igDMs(R, { id: "dms2", at: C.worked - 0.2, out: C.outdated - 0.12, rows: rows.map(([u, m], k) => ({ u, m, c: COL[5 - k] })),
    times: rows.map((_, k) => C.worked - 0.15 + k * 0.05), unread: { from: 214, to: 231, t0: C.worked, t1: C.outdated } });
}
K(C.outdated - 0.05, 0.25, face("smug", { lookX: -0.3 }), "back.out(2)");
K(C.outdated - 0.1, 0.3, { cam: R.camOf("setty", { dist: 8.6 }) }, "power3.out");
punch(C.boom2, 23);
K(C.boom2, 0.2, face("excuseMe", { armRr: 2.0, lookX: -0.5 }), "back.out(2)");
// ---- 9 coach roasts him back: "So who answers them? You? You're a speech bubble." → Fahhh on Setty
line(9, fc("mocking", { lookX: 0.6 }), face("sideEye", { lookX: -0.7 }));
KC(C.bubble - 0.1, 0.25, fc("laughing", { lookX: 0.5 }), "back.out(2)");
reaction(C.fahhh2, face("disgusted", { lookX: -0.7 }), "setty");
// ---- 10 Setty: "Rude. Plug me into Manychat. I learn your offer from your sales page and answer in your voice." (BOOM)
line(10, face("excuseMe", { lookX: -0.5 }), fc("skeptical", { lookX: 0.5 }), SR);
K(C.clic4 - 0.05, 0.25, face("sly", { lookX: 0.3 }));
big(C.clic4 - 0.01, "right");
st.checklist(R, { id: "setter", at: C.clic4, out: L[11].t - 0.38, title: "Your setter", appSlug: "manysetter",
  items: [{ icon: "plug-zap", text: "Plugged in", sub: "into Manychat, no new flows", at: C.clic4 + 0.08 },
    { icon: "file-text", text: "Learns your offer", sub: "from your sales page", at: C.sales - 0.2 },
    { icon: "mic", text: "In your voice", sub: "your words, your tone", at: C.answer - 0.15 }] });
punch(C.boom3, 25);
K(C.boom3, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
// ---- 11 coach: "And the ones just asking the price?"
line(11, fc("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 12 Setty: "One question at a time. Serious ones get your calendar, the rest get a real answer." (Calendly + the summary)
line(12, face("proud", { lookX: 0.2 }), fc("thinking", { lookX: 0.5 }), SR);
big(C.clic5 - 0.01, "right");
st.calendlyConfirm(R, { id: "booked", at: C.clic5, out: L[13].t - 0.38, who: "Jess", when: "Monday · 10:30 AM",
  summaryAt: C.serious - 0.1, step: 0.3,
  summary: ["Showed up all 5 days", "Goal: first online clients", "Ready to start now"] });
document.getElementById("booked").classList.add("xl"); // big type at 55 % (PROPS.md), and bigger still here:
document.head.insertAdjacentHTML("beforeend", `<style>
  .layout-set #booked.xl { height: 800px !important; }
  .layout-set #booked.xl .ok-top b { font-size: 60px; }
  .layout-set #booked.xl .ok-ev h3 { font-size: 64px; }
  .layout-set #booked.xl .ok-ev .r { font-size: 46px; }
  .layout-set #booked.xl .ok-sum .h { font-size: 34px; }
  .layout-set #booked.xl .ok-sum li { font-size: 52px; line-height: 1.2; }
</style>`);
K(C.rest - 0.05, 0.25, face("smug", { lookX: -0.3 }));
// ---- 13 coach: "Okay, how do I get you?" (the wide shot, a slow push)
K(L[13].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[13].t + 0.02, L[13].end - L[13].t + 0.3, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, fc("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 14 Setty roasts: "Turn off the ring light first, it's been on since Monday." (cut to the ring light by his face) → Fahhh
line(14, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null);
shotTo(C.ring - 0.08, "ring", { dur: 0.12, ease: "power4.out" });
KC(C.ring + 0.1, 0.25, fc("eyeRoll"));
shotTo(C.monday - 0.3, "setty", { dur: 0.12, ease: "power4.out" });
K(C.monday - 0.3, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh3, fc("annoyed", { lookX: 0.6 }));
// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the wide, the ring light off
line(15, face("smug", { lookX: 0.2 }), fc("laughing"));
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, fc("proud", { lookX: 0.5 }));
{
  const RL = R.set.ring, off = C.dms_end + 0.75; // he finally switches it off (a click, the corner goes dark)
  tl.to(RL.light, { intensity: 0, duration: 0.05 }, off);
  tl.to(RL.halo.material, { opacity: 0, duration: 0.05 }, off);
  tl.to(RL.tube.material.color, { r: 0.13, g: 0.13, b: 0.15, duration: 0.05 }, off);
}
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
