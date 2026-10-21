// Reel 19 "The follow-up": a real conversation on a park bench at sunset, in October (set "park"). The coach sits on the
// bench staring at a lead who went quiet, too proud to follow up ("And look desperate?"); Setty, perched on the top rail of
// the backrest, gives him the three follow-ups word for word (one big DM card each), then the follow-ups he sends for him.
// The punchline: the pigeons at his feet get more follow-ups than his leads. The camera on whoever talks, the other reacts.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const { L, line, reaction, side, punch, push, bleep, ending, CARD_L, CARD_R } = D; // assets/engine/dialogue.js

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.setty] });

// the cards at 62 % (their text is ~60 px on the phone), under the title: the coach's on his left (he is on the right of the
// frame, CARD_L), Setty's on his right (he is on the left, SR): the coach sits on Setty's left, so a card on that side would
// cover his face, and SR pushes him out of the frame
const BIG = { fit: true, scale: 0.62 };
const left = (t) => side(t, "left", BIG), right = (t) => side(t, "right", BIG);
const CARD = { w: 900 }; // the DM cards take their content's height
const SR = { ...CARD_R, dist: 13.5, y: 1000 }; // Setty with a card on his right: as big as in his close-up
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const LEAD = { user: "marcus.fit", color: "#16a34a" };

// ---- frame 0 (thumbnail): the wide shot at sunset, the coach on the bench staring at his phone, Setty smug on the rail
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("defeated", { lookX: 0.2, lookY: -0.5 }));

// ---- 0 Setty: "You let that [bleep]ing lead go cold, right?" (his riser from frame 0, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 950 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Bro, he asked about my program. Then nothing." (his DM: the question, his answer, "Seen")
line(1, faceC("defeated", { lookX: 0.4, lookY: -0.2 }), face("deadpan", { lookX: -0.6 }), CARD_L);
left(C.clic1 - 0.01);
st.bigDM(R, { id: "dm", at: C.clic1, out: out(2), ...LEAD, ...CARD, status2: { text: "Active 3h ago", at: C.nothing },
  msgs: [{ text: "how does your program work? 👀", at: C.clic1 + 0.12 }, // never an empty card
    { me: true, text: "so here's how it works 👇", at: C.program - 0.1, seen: { text: "Seen", at: C.nothing } }] });
KC(C.nothing, 0.25, faceC("stressed", { lookX: 0.4, lookY: -0.3 }), "back.out(2)");

// ---- 2 Setty: "So you followed up?" (flat, a trap)
line(2, face("deadpan", { lookX: -0.6, lidL: 0.35, lidR: 0.35 }), faceC("skeptical", { lookX: 0.5 }));

// ---- 3 coach: "And look desperate? I don't chase people." (offended, the phone to his chest)
line(3, faceC("annoyed", { lookX: 0.5 }), face("sideEye", { lookX: -0.6 }));
KC(C.chase - 0.05, 0.25, faceC("proud", { lookX: 0.3 }), "back.out(2)");

// ---- 4 Setty roasts: "No, you just sit in a park refreshing his DMs like he's your ex." → Fahhh on the coach
line(4, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }), null);
K(C.refreshing - 0.05, 0.25, face("sly", { lookX: -0.7, armRr: 1.1, armRf: 0.7 }), "back.out(2)");
K(C.ex - 0.05, 0.2, face("laughing", { lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh1, faceC("eyeRoll", { lookY: 0.5 }));

// ---- 5 coach: "How many follow-ups before I let him go?" (sulking, like asking for breakup advice)
line(5, faceC("pleading", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 6 Setty, dead serious: "Three. A quiet lead didn't say no. He got busy and forgot." (BOOM on "didn't say no")
line(6, face("deadpan", { lookX: -0.3, lidL: 0.3, lidR: 0.3 }), faceC("thinking", { lookX: 0.5 }));
K(C.three - 0.05, 0.2, face("proud", { armRr: 2.0, lookX: -0.3 }), "back.out(2)");
punch(C.boom1, 26);
K(C.boom1 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");
K(C.busy - 0.05, 0.25, face("unimpressed", { lookX: -0.4 }), "back.out(2)");

// ---- 7 coach: "Okay, what do I send without sounding pushy?" (curious despite himself)
line(7, faceC("thinking", { lookX: 0.5 }), face("sly", { lookX: -0.6 }));
KC(C.pushy - 0.05, 0.25, faceC("skeptical", { lookX: 0.5 }), "back.out(2)");

// ---- 8 to 10 Setty: the three follow-ups, word for word (the carousel's), one big DM card each, typed in his bubble
line(8, face("proud", { lookX: 0.3 }), faceC("thinking", { lookX: 0.5 }), SR);
right(C.clic2 - 0.01);
st.bigDM(R, { id: "fu1", at: C.clic2, out: C.clic3 - 0.25, ...CARD, title: "1 · a few hours later",
  msgs: [{ me: true, text: "hey! did you still want the details on the program?", typing: C.clic2 + 0.12, at: C.hey }] });
K(C.hey - 0.05, 0.25, face("happy", { lookX: 0.6 }), "back.out(2)"); // he looks at the card

line(9, face("smug", { lookX: 0.3 }), faceC("skeptical", { lookX: 0.5 }), SR);
st.bigDM(R, { id: "fu2", at: C.clic3, out: C.clic4 - 0.25, ...CARD, title: "2 · a bit later",
  msgs: [{ me: true, text: "no stress if now's not the time. what's holding you back, timing or budget?", typing: C.clic3 + 0.12,
    at: C.nostress }] });
K(C.timing - 0.05, 0.25, face("sly", { lookX: 0.6 }), "back.out(2)");
KC(C.timing, 0.3, faceC("hyped", { lookX: 0.5 }));

line(10, face("happy", { lookX: 0.3 }), faceC("proud", { lookX: 0.5 }), SR);
st.bigDM(R, { id: "fu3", at: C.clic4, out: out(11), ...CARD, title: "3 · the last one",
  msgs: [{ me: true, text: "i'll stop bugging you, promise. if you ever want help with your goal, just reply here.", typing: C.clic4 + 0.12,
    at: C.illstop }] });
K(C.reply - 0.05, 0.25, face("wink", { lookX: -0.3 }), "back.out(2)");

// ---- 11 coach: "Cool. Who sends that to every lead?" (skeptical, a lazy wave at his phone)
line(11, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 12 Setty: "Me. Plug me into ManyChat. Write them once, I send them inside twenty-four hours, and stop when he replies or
// books." (BOOM on Manychat, then the three rules of his follow-ups)
line(12, face("sly", { lookX: 0.2 }), faceC("skeptical", { lookX: 0.5 }), SR);
punch(C.boom2, 27);
K(C.boom2, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
K(C.boom2 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");
right(C.clic5 - 0.01);
st.twoWays(R, { id: "fus", at: C.clic5, out: out(13), ...CARD, h: 0, head: { app: "manysetter", text: "Follow-ups" }, // h 0: its rows' height
  rows: [{ who: "you write", emoji: "✍️", to: "them once", at: C.clic5 + 0.1, ok: C.write + 0.3 },
    { who: "I send them", app: "instagram", to: "inside 24 h", at: C.send - 0.05, ok: C.inside + 0.3, hi: true },
    { who: "he replies", emoji: "✋", to: "I stop", at: C.stop - 0.05, ok: C.books }] });
K(C.write, 0.25, face("smug", { armRr: 1.0, armRf: 0.6, lookX: 0.4 }), "back.out(2)");
KC(C.books, 0.3, faceC("hyped", { lookX: 0.5 }));

// ---- 13 Setty roasts (the music dies): "These [bleep]ing pigeons get more follow-ups than your leads." On "pigeons", a cut to
// the pigeons pecking at his crumbs, back on Setty laughing, then the coach's face for the Fahhh
line(13, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4, lookY: -0.4 }), null);
bleep(R.DATA.bleeps[1]);
K(C.pigeons - 0.08, 0.001, { cam: R.camOf("pigeons") });
K(C.pigeons - 0.07, 0.9, { cam: R.camOf("pigeons", { dist: 5.4 }) }, "sine.out");
K(C.get - 0.08, 0.001, { cam: R.camOf("setty", { dist: 9.4 }) });
push(C.get - 0.07, C.fahhh2 - 0.08, "setty", {}, 0.85);
K(C.get - 0.05, 0.25, face("laughing", { lookX: -0.6, lookY: -0.3 }), "back.out(2)");
reaction(C.fahhh2, faceC("disgusted", { lookX: 0.4, lookY: -0.5 }));

// ---- 14 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending (back to
// the wide, which loops to frame 0; the comment bar types SETTY, the notification, the end pill)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 960 }); // lower: the comment bar sits under the title
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
