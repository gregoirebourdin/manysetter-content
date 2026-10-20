// Reel 7 "The Comment GUIDE flow": a real conversation in the coach's kitchen in the morning (set "kitchen"). He stands
// behind his marble island, phone in hand, his green smoothie forgotten next to him, proud of his 400 comments; Setty sits
// on the island by the fruit bowl and asks the only number that matters. The camera on whoever talks, the other one
// reacts; cards pop beside the speaker (his comments, the DM thread, his Manychat flow, the inbox gathering dust, the
// reply in his voice). Two gags cut to an insert: the juicer still in its box, the smoothie turning brown.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, push, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const fc = (name, extra = {}) => faceC(name, { phone: 1, ...extra }); // he never lets go of his phone
const READ = { armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookY: -0.3 }; // his phone up in front of him, reading it
/** an insert on a set shot (the juicer, the smoothie): a hard cut, then a slow push toward what it shows until t1 */
const insert = (t0, t1, name, k = 0.12) => {
  shotTo(t0, name, { dur: 0.1, ease: "power4.out" });
  const c = R.camOf(name);
  K(t0 + 0.1, Math.max(0.3, t1 - t0 - 0.1), { cam: { px: c.px + (c.ax - c.px) * k, py: c.py + (c.ay - c.py) * k, pz: c.pz + (c.az - c.pz) * k } }, "sine.inOut");
};

// ---- frame 0 (thumbnail): the wide shot, the coach proud with his phone, Setty smug on the island by the fruit bowl
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, fc("proud", { lookX: 0.5 }));

// ---- 0 Setty: "You set up your [bleep]ing "Comment GUIDE" flow, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Bro, I woke up to four hundred comments. Manychat sent four hundred guides." (his comments, then the count)
line(1, fc("hyped", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left");
const CM = [["jess.fit", "<b>GUIDE</b> 🙏"], ["marcus_lifts", "<b>GUIDE</b>"], ["ana.coaching", "<b>GUIDE</b> please!"], ["dan.moves", "<b>guide</b>"],
  ["tom_trains", "<b>GUIDE</b> 🔥"], ["sarah.runs", "<b>GUIDE</b>!!"], ["leo.gains", "<b>GUIDE</b>"], ["mia.moves", "<b>GUIDE</b> 🙌"]];
const COL = ["#d6249f", "#8b5cf6", "#10b981", "#06b6d4", "#f97316", "#ef4444", "#3b82f6", "#eab308"];
st.igComments(R, { id: "cmts", at: C.clic1, out: L[2].t - 0.38,
  rows: CM.map(([u, text], k) => ({ u, text, c: COL[k], time: "now" })),
  times: CM.map((_, k) => C.clic1 + 0.12 + k * ((C.comments - C.clic1) / CM.length)),
  count: { from: 23, to: 400, t0: C.woke, t1: C.comments },
  sent: { from: 0, to: 400, t0: C.sent, t1: C.l1_end, text: "guides sent by Manychat", at: C.sent - 0.1 } });
// ---- 2 Setty: "Love that, how many sales?"
line(2, face("deadpan", { lookX: -0.7 }), fc("proud", { lookX: 0.4 }));
// ---- 3 coach: "Zero, not one [bleep]ing sale." (BOOM on "Zero")
line(3, fc("defeated", { lookX: 0.3, nod: 0.08 }), face("sly", { lookX: -0.7 }));
punch(C.boom1, 24);
const B2 = R.DATA.bleeps[1];
KC(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
KC(B2.end + 0.05, 0.1, { censor: 0 });
// ---- 4 Setty: "Manychat did its job, the guide went out. Then they replied, read me one." (the DM thread)
line(4, face("sly", { lookX: -0.3 }), fc("confused", { ...READ }), CARD_R);
side(C.clic2 - 0.01, "right");
const GUIDE = "Here's your guide! 📘 Let me know what you think.";
st.igDM(R, { id: "dm1", at: C.clic2, out: L[5].t - 0.38, user: "marcus_lifts", color: "#8b5cf6", h: 640,
  msgs: [{ me: true, text: GUIDE, at: C.clic2 + 0.25, chip: { text: "Sent by your Manychat flow", tone: "grey", icon: "zap", at: C.clic2 + 0.6 } },
    { text: "is this guide for beginners?", at: C.replied }] });
// ---- 5 coach: "Is this guide for beginners? And my flow sent him the guide, again." (the guide comes back, BOOM on "again")
line(5, fc("confused", { ...READ }), face("deadpan", { lookX: -0.7 }), CARD_L);
side(C.clic3 - 0.01, "left");
st.igDM(R, { id: "dm2", at: C.clic3, out: L[6].t - 0.38, user: "marcus_lifts", color: "#8b5cf6", h: 640,
  msgs: [{ text: "is this guide for beginners?", at: C.clic3 + 0.1 },
    { me: true, text: GUIDE, at: C.flow5 + 0.2, chip: { text: "Keyword: guide", tone: "red", icon: "zap", at: C.boom2 } }] });
punch(C.boom2, 24);
KC(C.boom2, 0.2, fc("stressed", { ...READ, lookY: 0 }), "back.out(2)");
// ---- 6 Setty roasts: "It answers the keyword, not the question. Bro, you built a vending machine." (the flow) → Fahhh
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0 }), null, CARD_R);
side(C.clic4 - 0.01, "right");
st.mcFlow(R, { id: "flow1", at: C.clic4, out: C.bro6 - 0.3, title: "Comment GUIDE",
  rows: [[{ app: "instagram", title: "Comment contains GUIDE", sub: "Instagram post" }], [{ icon: "send", title: "Send the guide", sub: "Here's your guide! 📘" }]] });
reaction(C.fahhh1, fc("annoyed", { lookX: 0.6 }));
// ---- 7 coach: "And the people who asked something else?"
line(7, fc("pleading", { lookX: 0.5 }), face("sly", { lookX: -0.7 }));
// ---- 8 Setty roasts: "Left on read, collecting dust like the juicer you bought in January." (his inbox, then the juicer
// still in its box on the shelf) → Fahhh on the coach. Built by hand: the push must end before the insert.
{
  const ln = L[8];
  shotTo(ln.t - 0.2, "setty", { dur: 0.28, ...CARD_R });
  K(ln.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(ln.t + 0.08, C.juicer - 0.12, "setty", CARD_R, 0.9);
  K(ln.t - 0.12, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.3 }), "back.out(1.6)");
  KC((ln.t + ln.end) / 2, 0.3, fc("defeated", { lookX: 0.4 }));
  side(C.clic5 - 0.01, "right");
  const IN = [["ana.coaching", "how long does it take?", "2d"], ["dan.moves", "does it work for moms?", "3d"],
    ["sarah.runs", "how much is it?", "4d"], ["leo.gains", "can I do it at home?", "5d"]];
  st.igDMs(R, { id: "inbox", at: C.clic5, out: C.juicer - 0.3, rows: IN.map(([u, m, time], k) => ({ u, m, time, c: COL[k + 2] })),
    times: IN.map((_, k) => C.clic5 + 0.1 + k * 0.22), unread: { from: 4, to: 37, t0: C.clic5, t1: C.dust + 0.4 } });
  insert(C.juicer - 0.1, C.fahhh2 - 0.06, "juicer");
}
reaction(C.fahhh2, fc("eyeRoll", { lookX: 0.4 }));
// ---- 9 coach: "So I rebuild the whole flow, at midnight?"
line(9, fc("stressed", { sweat: 1, lookX: 0.4 }), face("sly", { lookX: -0.7 }));
// ---- 10 Setty: "Nope. Keep your Manychat, add me. Two actions in your flow, no code." (BOOM on "add me", the two actions)
line(10, face("sly", { lookX: -0.3 }), fc("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right");
st.mcFlow(R, { id: "flow2", at: C.clic6, out: L[11].t - 0.38, title: "Comment GUIDE",
  rows: [[{ app: "instagram", title: "Comment contains GUIDE", sub: "Instagram post" }], [{ icon: "send", title: "Send the guide", sub: "Here's your guide! 📘" }],
    [{ app: "manysetter", title: "Start conversation", sub: "ManySetter", add: C.boom3 + 0.05 }],
    [{ icon: "message-circle", title: "Default Reply", sub: "any other DM" }, { app: "manysetter", title: "Continue conversation", sub: "ManySetter", add: C.actions }]] });
punch(C.boom3, 25);
K(C.boom3, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
// ---- 11 coach: "And you'd answer the beginner guy?"
line(11, fc("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 12 Setty: "I answer his real question, in your voice. Only the serious ones get your calendar." (the reply)
line(12, face("smug", { lookX: -0.3 }), fc("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic7 - 0.01, "right");
st.igDM(R, { id: "dm3", at: C.clic7, out: L[13].t - 0.3, user: "marcus_lifts", color: "#8b5cf6", h: 760,
  msgs: [{ text: "is this guide for beginners?", at: C.clic7 + 0.1 },
    { me: true, text: "Yes, it's made for beginners 🙌 What are you working on right now?", at: C.real - 0.1,
      seen: { text: "ManySetter · in your voice", at: C.voice },
      chip: { text: "Your calendar: serious leads only", tone: "green", icon: "calendar-check", at: C.serious } }] });
// ---- 13 coach: "Okay, how do I add you?" (the music dies: the wide shot, silence, a slow push)
K(L[13].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[13].t + 0.02, L[13].end - L[13].t + 0.5, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, fc("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 14 Setty roasts: "Drink your lawn first, it's turning brown." (cut to his green smoothie) → Fahhh on the coach
{
  const ln = L[14];
  shotTo(ln.t - 0.2, "setty", { dur: 0.28 });
  K(ln.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(ln.t + 0.08, C.lawn - 0.12, "setty");
  K(ln.t - 0.12, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), "back.out(1.6)");
  insert(C.lawn - 0.08, C.fahhh3 - 0.06, "smoothie", 0.15);
  // "it's turning brown": his smoothie goes muddy on the word (on R.act, seeked before the 3D render)
  const drink = R.set.drink, c0 = drink.color.clone(), c1 = new R.THREE.Color(0x7d6b34);
  R.act.fromTo(drink.color, { r: c0.r, g: c0.g, b: c0.b }, { r: c1.r, g: c1.g, b: c1.b, duration: 0.6, ease: "sine.inOut", lazy: false,
    immediateRender: false }, C.brown - 0.25);
}
reaction(C.fahhh3, fc("disgusted", { lookX: 0.4 }));
// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(15, face("smug", { lookX: 0.2 }), fc("laughing"));
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, fc("proud", { lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.95 }); // after the last caption has gone
