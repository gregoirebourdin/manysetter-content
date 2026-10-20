// Reel 11 "The DM script": a real conversation by a villa pool in the afternoon (set "poolside"). The coach sits on the
// side of a lounger, laptop on his knees, pasting a free PDF script to every lead; Setty sits on a teak side table by his
// orange spritz and takes the script apart, then says the real one out loud. The camera on whoever talks, the other one
// reacts; cards pop beside the speaker (his PDF, the lead's inbox, the Instagram thread, the script, the playbook).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

// three lines of title (slide 1 of the carousel), all at the same size
kit.hookTitle(R, { lines: R.DATA.hook_title, max: 72, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, punch, push, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const fc = (name, extra = {}) => faceC(name, { phone: 0, ...extra }); // the laptop stays on his knees
// a card beside the speaker, as big as the side allows: its top under the three-line title (y 600), its outer edge 20 px
// from the frame. w = the card's width in the stage (narrower cards read bigger), s = its scale on screen.
const card = (t, id, where, s, { w = 960, h } = {}) => {
  const el = document.getElementById(id);
  Object.assign(el.style, { width: `${w}px`, left: `${where === "left" ? 60 : 1020 - w}px` }, h ? { height: `${h}px` } : {});
  tl.set("#stagebox", { scale: s, x: where === "left" ? 480 * s - 520 : 520 - 480 * s, y: 300 * s - 240 }, t);
};
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const SMALL_L = { x: 220, y: 1000, dist: 20 }; // Setty small at the left, for the big cards (the script, the playbook)
const SARAH = { user: "Sarah", color: "#d6249f" };
const OPENER = "Hey! Love your energy 🔥 Quick question, what's your biggest struggle right now?";

// ---- frame 0 (thumbnail): the wide shot, the coach proud of his PDF, laptop on his knees, Setty smug on his table
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, fc("proud", { lookX: 0.5 }));

// ---- 0 Setty: "You copied a [bleep]ing DM script off YouTube, right?" (his riser from frame 0, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Free PDF, some guy with a Lambo. I paste it to every lead." (his PDF, the opener he pastes)
line(1, fc("proud", { lookX: 0.4 }), face("sleepy", { lookX: -0.6 }), CARD_L);
st.docQuote(R, { id: "pdf", at: C.clic1, out: out(2), source: "free_DM_script_FINAL.pdf", sub: "from a YouTube video", srcIcon: "file-text",
  badge: { text: "Paste to every lead", icon: "copy" }, text: OPENER,
  marks: [{ text: "Love your energy 🔥", at: C.paste }, { text: "what's your biggest struggle right now?", at: C.every1 }] });
card(C.clic1 - 0.01, "pdf", "left", 0.68, { w: 820 });
KC(C.lambo - 0.05, 0.25, fc("hyped", { lookX: 0.4 }), "back.out(2)");
// ---- 2 Setty roasts: "Your lead got that exact message from every guy who watched that video." (her inbox) → Fahhh
line(2, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.3 }), null, CARD_R);
const COACHES = [["Coach Mike", "#f97316"], ["Dan | Mindset", "#8b5cf6"], ["Jay Scales", "#10b981"], ["Alpha Ty", "#06b6d4"], ["You", "#ff611d"]];
st.igDMs(R, { id: "inbox", at: C.clic2, out: C.fahhh1 - 0.32, title: "Sarah's DMs",
  rows: COACHES.map(([u, c], k) => ({ u, c, m: "Hey! Love your energy 🔥", time: `${k + 1}m` })),
  times: COACHES.map((_, k) => C.clic2 + 0.12 + k * ((C.video - C.clic2 - 0.1) / COACHES.length)), unread: { from: 1, to: 5, t0: C.clic2, t1: C.video } });
card(C.clic2 - 0.01, "inbox", "right", 0.6);
K(C.guy - 0.05, 0.25, face("laughing"), "back.out(2)");
reaction(C.fahhh1, fc("annoyed", { lookX: 0.6 }));
// ---- 3 coach: "They ask how much, I send my call link." (the thread: "how much is it?" → his call link)
line(3, fc("annoyed", { lookX: 0.5, armRr: 0.4, armRf: 0.7, elbowR: 1.6 }), face("deadpan", { lookX: -0.7 }), CARD_L);
st.igDM(R, { id: "dm1", at: C.clic3, out: out(4), ...SARAH, h: 470,
  msgs: [{ text: "how much is it? 🙏", at: C.much - 0.1 }, { me: true, text: "Hop on a quick call first 📞", at: C.link }] });
card(C.clic3 - 0.01, "dm1", "left", 0.72, { w: 760 });
// ---- 4 Setty: "And then?"
line(4, face("deadpan", { lookX: -0.7 }), fc("defeated"));
// ---- 5 coach: "Seen. Or "I'll think about it," so I pitch again." (BOOM on "Seen.", then the pitch again)
line(5, fc("defeated", { lookX: 0.4 }), face("sly", { lookX: -0.7 }), CARD_L);
st.igDM(R, { id: "dm2", at: C.clic4, out: out(6), ...SARAH, status: "Active now", status2: { text: "Active 3d ago", at: C.boom1 + 0.1 }, h: 790,
  msgs: [{ me: true, text: "Hop on a quick call first 📞", at: C.clic4, seen: { text: "Seen", at: C.boom1 - 0.04 } },
    { text: "i'll think about it", at: C.think },
    { me: true, text: "This program will change your life 🔥", at: C.pitch }] });
card(C.clic4 - 0.01, "dm2", "left", 0.72, { w: 760 });
punch(C.boom1, 27);
K(C.boom1 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut"); // back out: his face stays beside the card
// ---- 6 Setty roasts: "Let me guess. In caps." (the pitch again, in caps) → Fahhh
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0 }), null, CARD_R);
st.igDM(R, { id: "dm3", at: C.clic5, out: C.fahhh2 - 0.32, ...SARAH, status: "Active 3d ago", h: 760,
  msgs: [{ me: true, text: "This program will change your life 🔥", at: C.clic5 },
    { me: true, text: "THIS PROGRAM WILL CHANGE YOUR LIFE 🔥🔥🔥", at: C.caps - 0.04 }] });
card(C.clic5 - 0.01, "dm3", "right", 0.72, { w: 760 });
K(C.caps, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh2, fc("eyeRoll"));
// ---- 7 coach: "Okay genius, what do I send?"
line(7, fc("annoyed", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
KC(L[7].t + 0.45, 0.3, fc("thinking", { lookX: 0.6 }));
// ---- 8 Setty: the script, said out loud (two big cards, each step pops and gets its check on his words)
line(8, face("smug", { lookX: 0.3 }), fc("thinking", { lookX: 0.5 }), SMALL_L);
st.checklist(R, { id: "script", at: C.clic6, out: C.clic9 - 0.02, title: "The DM script",
  items: [{ icon: "message-circle", text: "Answer first", sub: "price included", at: C.s1 },
    { icon: "list-ordered", text: "One question", sub: "at a time, never two", at: C.s2 },
    { icon: "target", text: "Check the fit", sub: "timing and budget", at: C.s3 }] });
card(C.clic6 - 0.01, "script", "right", 0.72);
st.checklist(R, { id: "script2", at: C.clic9, out: L[9].t - 0.3, title: "The DM script",
  items: [{ icon: "calendar-days", text: "Two times", sub: "Tue 2 pm or Thu 10 am?", at: C.s4 },
    { icon: "quote", text: "Which part?", sub: "on \"I'll think about it\"", at: C.think2 }],
  done: { text: "Save it 📌", at: C.s5 } });
card(C.clic9 - 0.01, "script2", "right", 0.72);
K(C.s3, 0.3, face("proud", { lookX: 0.3 }), "back.out(1.6)");
// ---- 9 coach: "Cool. Who does that while I'm at the pool?" (a quick look at the pool from above)
{
  const l9 = L[9], p = R.camOf("pool");
  shotTo(l9.t - 0.2, "coach", { dur: 0.28 });
  K(l9.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(l9.t + 0.08, C.pool - 0.1, "coach", {}, 0.8);
  KC(l9.t - 0.12, 0.25, fc("skeptical", { lookX: 0.5 }), "back.out(1.6)");
  K((l9.t + l9.end) / 2, 0.3, face("smug", { lookX: -0.6 }));
  shotTo(C.pool - 0.08, "pool", { dur: 0.1, ease: "power4.out" });
  K(C.pool + 0.04, L[10].t - 0.24 - (C.pool + 0.04), { cam: { py: p.py - 0.6, pz: p.pz - 0.5 } }, "sine.out");
}
// ---- 10 Setty: "Me. Plug me into Manychat. I build that script from your offer and adapt it to every lead." (BOOM)
{
  const l10 = L[10];
  shotTo(l10.t - 0.2, "setty", { dur: 0.28 });
  K(l10.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(l10.t + 0.08, C.clic7 - 0.14, "setty", {}, 0.8);
  K(l10.t - 0.12, 0.25, face("sly", { lookX: -0.3 }), "back.out(1.6)");
  KC((l10.t + l10.end) / 2, 0.3, fc("skeptical", { lookX: 0.5 }));
  shotTo(C.clic7 - 0.12, "setty", { ...SMALL_L, dur: 0.3 });
  push(C.clic7 + 0.2, l10.end + 0.35, "setty", SMALL_L, 0.9);
}
st.checklist(R, { id: "playbook", at: C.clic7, out: out(11), title: "Your playbook", appSlug: "manysetter",
  items: [{ icon: "message-square-text", text: "Setting script", sub: "from your offer", at: C.offer },
    { icon: "shield-check", text: "Objections", sub: "with real answers", at: C.offer + 0.3 },
    { icon: "mic", text: "Your tone", sub: "so it sounds like you", at: C.adapt }],
  done: { text: "Ready in about 2 min", at: C.every2 } });
card(C.clic7 - 0.01, "playbook", "right", 0.66);
punch(C.boom2, 27);
K(C.boom2, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
K(C.clic7 - 0.1, 0.25, face("sly", { lookX: 0.3 }), "back.out(1.6)"); // he looks at the playbook
// ---- 11 coach: "And it won't sound copied?"
line(11, fc("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 12 Setty: "It sounds like you. Minus the caps lock." (the same "how much?", now a real answer; BOOM on "caps")
line(12, face("smug", { lookX: -0.2 }), fc("laughing"), CARD_R);
st.igDM(R, { id: "dm4", at: C.clic8, out: out(13), ...SARAH, h: 800,
  msgs: [{ text: "how much is it? 🙏", at: C.clic8 },
    { me: true, text: "it's $300 a month 🙂 what made you reach out?", at: C.like - 0.1 },
    { text: "honestly? my energy, I'm always tired", at: C.boom3 + 0.25 }] });
card(C.clic8 - 0.01, "dm4", "right", 0.72, { w: 760 });
punch(C.boom3, 27);
K(C.boom3, 0.2, face("wink"), "back.out(2)");
// ---- 13 coach: "Okay. How do I set you up?" (the music dies: the wide shot, silence, a slow push)
K(L[13].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[13].t + 0.02, L[13].end - L[13].t + 0.5, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, fc("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 14 Setty roasts: "Close the laptop. You rented a [bleep]ing villa to copy-paste a PDF." (cut to the villa) → Fahhh
{
  const l14 = L[14], v = R.camOf("villa"), CU = { dist: 19, y: 900 };
  shotTo(l14.t - 0.2, "setty", { dur: 0.28 });
  K(l14.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(l14.t + 0.08, C.villa - 0.1, "setty", {}, 0.8);
  K(l14.t - 0.12, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), "back.out(1.6)");
  const B2 = R.DATA.bleeps[1];
  K(B2.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
  K(B2.end + 0.05, 0.1, { censor: 0, squash: 0 });
  shotTo(C.villa - 0.06, "villa", { dur: 0.1, ease: "power4.out" });
  K(C.villa + 0.06, C.copy - 0.1 - (C.villa + 0.06), { cam: { px: v.px - 0.8, pz: v.pz - 1.0 } }, "sine.out");
  shotTo(C.copy - 0.08, "coach", { ...CU, dur: 0.12, ease: "power4.out" });
  push(C.copy + 0.06, C.fahhh3 - 0.1, "coach", CU, 0.9);
  KC(C.copy - 0.05, 0.2, fc("defeated", { lookY: -0.6, lookX: 0 }));
}
reaction(C.fahhh3, fc("annoyed", { lookX: 0.6 }));
// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(15, face("smug", { lookX: 0.2 }), fc("laughing"));
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, fc("proud", { lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 1.0 });
tl.to("#notif", { opacity: 0, duration: 0.25 }, C.end + 0.85);
// the comment bar and the notification sit under the three-line title, not on it
for (const id of ["comment", "notif"]) { const el = document.getElementById(id); if (el) el.style.top = "612px"; }
