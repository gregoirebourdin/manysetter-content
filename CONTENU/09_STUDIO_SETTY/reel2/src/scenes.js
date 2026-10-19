// Reel 2 "The webinar" v3: a real conversation. The coach at his desk, Setty in the bed next to him (set "bedroom",
// Dubai at golden hour), the camera on whoever talks, the other one reacts. Cards pop beside the speaker (real tools).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: ["Your webinar is over.", "Your *DMs* just started."], pulses: [C.drop, C.boom1, C.boom3, C.boom4, C.setty] });

const { L, line, reaction, side, punch, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const COACH = "coach";

// ---- frame 0 (thumbnail): the wide shot, the coach still buzzing from his webinar, Setty smug in bed
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));

// ---- 0 Setty: "You did your [bleep]ing webinar, right?" (his riser from frame 0, BOOM + the music drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
K(T(4) - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(T(4), 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Two hours live, bro. The chat was on fire."
line(1, faceC("hyped", { lookX: 0.5 }), face("sleepy", { lookX: -0.6 }));
// ---- 2 Setty: "Cool. Now open your DMs."
line(2, face("deadpan", { lookX: -0.7 }), faceC("confused", { lookX: 0.4 }));
// ---- 3 coach: "Holy [bleep], why do I have sixty-three messages?" (his phone, the real inbox floods, BOOM on 63)
line(3, faceC("panic", { phone: 1, armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookX: 0.2, lookY: -0.3 }), face("sly", { lookX: -0.7 }), CARD_L);
const B2 = R.DATA.bleeps[1];
KC(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
KC(B2.end + 0.05, 0.1, { censor: 0 });
side(C.clic1 - 0.01, "left");
const DM = [["jess.fitcoach", "how much?"], ["coach.amy", "is the replay up??"], ["dan.fitpro", "price?"], ["mike_trains", "link pls 🙏"],
  ["nina.coach", "how much is it"], ["tom.lifts", "can I pay in 2x?"], ["sara.mind", "how much 👀"]];
const COL = ["#d6249f", "#8b5cf6", "#10b981", "#06b6d4", "#f97316", "#ef4444", "#eab308"];
st.igInbox(R, { id: "inbox", at: C.clic1, out: L[5].t - 0.15, rows: DM.map(([u, m], k) => ({ u, m, c: COL[k], hot: k === DM.length - 1 })),
  times: DM.map((_, k) => C.clic1 + 0.1 + (k / (DM.length - 1)) * (C.boom1 - C.clic1 - 0.05)), requests: { from: 4, to: 63, t0: C.clic1, t1: C.boom1 } });
punch(C.boom1, 24);
// ---- 4 Setty: "That's everyone who typed "how much" while you were talking."
line(4, face("eyeRoll"), faceC("stressed", { phone: 1, armRr: 0.25, armRf: 1.35, elbowR: 1.95 }), CARD_L);
// ---- 5 coach: "Okay, I'll answer them tonight."
line(5, faceC("proud", { phone: 0, lookX: 0.5 }), face("deadpan", { lookX: -0.7 }));
// ---- 6 Setty roasts: "Tonight you'll fall asleep in that chair with your shoes on." → Fahhh on the coach's face
line(6, face("mocking", { armRr: 1.3, armRf: 1.0 }), null);
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.6 }));
// ---- 7 coach: "Last time I replied two days late and they all vanished." (the chat: Seen 2 days ago, BOOM on vanished)
line(7, faceC("defeated"), face("deadpan", { lookX: -0.7 }), CARD_L);
side(C.clic3 - 0.01, "left");
st.igChat(R, { id: "chat", at: C.clic3, out: L[8].t - 0.15, user: "jess.fitcoach", color: "#d6249f", status: "Active 2d ago",
  msgs: [{ text: "how much is the program? 🙏", at: C.clic3 + 0.1 },
    { me: true, text: "Hey!! so sorry for the late reply, it's $997 💪", at: C.clic3 + 0.45, seen: { text: "Seen · 2 days ago", at: C.boom2 - 0.05 } }] });
punch(C.boom2, 25);
// ---- 8 Setty: "Yeah, they went with whoever answered first." → Fahhh
line(8, face("deadpan", { lookX: -0.7 }), null);
reaction(C.fahhh2, faceC("shocked", { lookX: 0.5 }));
// ---- 9 coach: "So I hire a setter? The last one disappeared."
line(9, faceC("annoyed", { lookX: 0.5 }), face("sly", { lookX: -0.7 }));
// ---- 10 Setty: "Or you plug me into Manychat." (the pipeline, BOOM on Manychat)
line(10, face("sly", { lookX: 0.4 }), faceC("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic4 - 0.01, "right");
st.flowPipeline(R, { id: "flow", at: C.clic4, out: L[11].t - 0.12, connect: C.boom3 - 0.05,
  pulses: [C.boom3 + 0.25, C.boom3 + 0.55, C.boom3 + 0.85] });
punch(C.boom3, 25);
K(C.boom3, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
// ---- 11 coach: "Nah, my leads hate robotic replies."
line(11, faceC("skeptical", { lookX: 0.5 }), face("eyeRoll"));
// ---- 12 Setty: "Same. I learn your offer, I talk like you, and I wait till they're done typing." (the Playbook)
line(12, face("smug", { lookX: 0.3 }), faceC("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic5 - 0.01, "right");
kit.playbookCard(R, { at: C.clic5, fill: C.clic5 + 0.2, fillDur: 1.2, chips: C.clic5 + 0.6, learned: C.clic5 + 1.5,
  out: L[13].t - 0.12, page: "yourcoaching.com/webinar" });
// ---- 13 coach: "And the guys who want free consulting?"
line(13, faceC("thinking", { lookX: 0.4 }), face("sly", { lookX: -0.7 }));
// ---- 14 Setty: "They get your free guide. Only the serious ones get your calendar." (the lead sorter, BOOM on calendar)
line(14, face("smug", { lookX: 0.3 }), faceC("shocked", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right");
st.leadSorter(R, { id: "sort", at: C.clic6, out: L[15].t - 0.12,
  left: { title: "Free consulting", sub: "get your free guide", tile: "📘" }, right: { title: "Serious", sub: "get your Calendly", tile: "calendly" },
  leads: [{ u: "jess.fitcoach", m: "can u just tell me what to do", c: "#d6249f", side: "l", at: C.clic6 + 0.3 },
    { u: "coach.amy", m: "is there a free version?", c: "#8b5cf6", side: "l", at: C.clic6 + 0.75 },
    { u: "dan.fitpro", m: "I'm in. When can we talk?", c: "#10b981", side: "r", at: C.boom4 - 0.45 },
    { u: "nina.coach", m: "budget's ready, let's go", c: "#f97316", side: "r", at: C.boom4 }] });
punch(C.boom4, 25);
// ---- 15 coach: "And when they say "I'll think about it"?"
line(15, faceC("pleading", { lookX: 0.4 }), face("deadpan", { lookX: -0.7 }));
// ---- 16 Setty: "I follow up, three times max, and I never beg." (the 24-hour window) → Fahhh
line(16, face("smug", { lookX: 0.3 }), null, CARD_R);
side(C.clic7 - 0.01, "right");
st.followTimeline(R, { id: "fu", at: C.clic7, out: L[16].end + 0.05, fillTo: L[16].end - 0.2,
  marks: [{ h: 2, text: "Still thinking about it? 🙂", at: C.clic7 + 0.35 }, { h: 8, text: "Want the replay link again?", at: C.clic7 + 0.85 },
    { h: 20, text: "Last one: Thursday's call link?", at: C.clic7 + 1.35 }] });
reaction(C.fahhh3, faceC("disgusted", { lookX: 0.6 }));
// ---- 17 coach: "Okay… how much?" (the music dies: the wide shot, silence)
K(L[17].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
KC(L[17].t - 0.1, 0.3, faceC("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[17].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 18 Setty: "Look who's asking "how much" now." → Fahhh on the coach
line(18, face("mocking", { armRr: 1.3, armRf: 1.0, lookX: -0.6 }), null);
reaction(C.fahhh4, faceC("eyeRoll"));
// ---- 19 Setty: "It's free to build, so comment SETTY and I'll slide into your DMs." → back to the wide (loops to frame 0)
line(19, face("smug", { lookX: 0.2 }), faceC("laughing"));
K(C.slide - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.slide - 0.1 });
kit.notification(R, { title: "setty", text: "slid into your DMs", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
