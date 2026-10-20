// Reel 14 "Free coaching in the DMs": a real conversation in the coach's office (set "coachoffice", a Brooklyn brownstone
// in the morning). The coach slumps on his own clients' couch, phone in hand, after a week of coaching strangers for free
// in his DMs; Setty sits in the coach's armchair on two cushions and plays the therapist. The camera on whoever talks, the
// other one reacts; cards pop beside the speaker, in big type (the lead's questions, the program he typed, "Seen", his
// Screen Time, the two questions to ask, the two ways out).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

// three lines of title (slide 1 of the carousel, word for word), all at the same size
kit.hookTitle(R, { lines: R.DATA.hook_title, max: 84, pulses: [C.drop, C.boom1, C.boom2, C.setty] });

const { L, line, reaction, side, punch, bleep, ending, CARD_L } = D; // assets/engine/dialogue.js
// the cards: on the left (the speaker on the right, CARD_L), at 62 %: their text is ~60 px on the phone. They start under
// the three-line title and stop above the captions (y 1165): H is their height in stage px, from the title's real height.
const S = 0.62;
const hook = document.getElementById("hook");
const H = Math.floor((1165 - (hook.offsetTop + hook.offsetHeight + 24 + 60 * S)) / S);
const left = (t) => side(t, "left", { fit: true, scale: S, x: 480 * S - 516 }); // the card's left edge 24 px from the frame
const CARD = { x: 60, w: 900 }; // the DMs take their content's height (a fixed one left them half empty)
const BOX = { ...CARD, h: H }; // the other cards fill the room
const CARD_S = { x: 840, dist: 15 }; // Setty beside a card: a little further right than CARD_L, the card off his cheek
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const JAKE = { user: "Jake", color: "#0ea5e9" };

// ---- frame 0 (thumbnail): the wide shot, the coach slumped on his clients' couch on his phone, Setty smug in his armchair
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("defeated", { lookX: 0.2, lookY: -0.5 }));

// ---- 0 Setty: "You coached a stranger for [bleep]ing free in your DMs again, right?" (his riser, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 950 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "One quick question, bro. Then his diet, his training split, his sleep." (the lead's questions pile up)
line(1, faceC("annoyed", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }), CARD_L);
st.bigDM(R, { id: "dm1", at: C.clic1, out: out(2), ...JAKE, ...CARD,
  msgs: [{ text: "quick question", at: C.quick }, { text: "my diet? 🥗", at: C.diet }, { text: "my training? 💪", at: C.training }] });
left(C.clic1 - 0.01);
KC(C.sleep - 0.05, 0.25, faceC("stressed", { lookX: 0.4 }), "back.out(2)");

// ---- 2 Setty roasts: "So you typed him a full program. With your thumbs." (his reply, typed line after line) → Fahhh
line(2, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), null, CARD_S);
st.bigDM(R, { id: "dm2", at: C.clic2, out: C.fahhh1 - 0.32, ...JAKE, ...CARD,
  msgs: [{ me: true, text: "ok so week 1 💪", typing: C.clic2 + 0.08, at: C.typed },
    { me: true, text: "mon: push day", at: C.program - 0.1 }, { me: true, text: "tue: pull day…", at: C.program + 0.45 }] });
left(C.clic2 - 0.01);
K(C.thumbs - 0.05, 0.25, face("laughing", { armRr: 1.2, armRf: 1.0, armLr: 1.2, armLf: 1.0 }), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.5, lookY: -0.4 }));

// ---- 3 coach: "He said he'll think about it. Never heard from him again." ("Seen", then he's gone)
line(3, faceC("defeated", { lookX: 0.4 }), face("sideEye", { lookX: -0.6 }), CARD_L);
st.bigDM(R, { id: "dm3", at: C.clic3, out: out(4), ...JAKE, ...CARD, status2: { text: "Active 4d ago", at: C.again },
  msgs: [{ text: "lemme think 🤔", at: C.clic3 + 0.25 },
    { me: true, text: "any thoughts?", at: C.never - 0.08, seen: { text: "Seen", at: C.again - 0.1 } }] });
left(C.clic3 - 0.01);

// ---- 4 Setty, the therapist: "And how did that make you feel?" (slow, deadpan, his head tilted)
line(4, face("deadpan", { tilt: 0.14, lookX: -0.6, lidL: 0.35, lidR: 0.35 }), faceC("defeated", { lookY: -0.3 }));
K(C.feel, 0.3, face("thinking", { tilt: 0.18, lookX: -0.6 }));

// ---- 5 coach: "Five hours this week. Teens who can't pay, a guy who literally doesn't want to." (BOOM, his Screen Time)
line(5, faceC("stressed", { lookX: 0.4 }), face("shocked", { lookX: -0.6 }), CARD_L);
st.screenTime(R, { id: "stm", at: C.boom1, out: out(6), ...BOX, total: { from: 0, to: 302, t0: C.boom1 + 0.05, t1: C.boom1 + 1.1 },
  label: "of free coaching", stamp: { text: "$0 billed", at: C.cant } });
left(C.boom1 - 0.01);
punch(C.boom1, 27);
K(C.boom1 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut"); // back out: his face stays beside the card
KC(C.teens - 0.05, 0.25, faceC("annoyed", { lookX: 0.4 }), "back.out(2)");
KC(C.doesnt - 0.05, 0.25, faceC("disgusted", { lookX: 0.4 }), "back.out(2)");

// ---- 6 Setty, dead serious (the music dies): "That's not lead gen. That's free consulting." (a slow, close push)
line(6, face("deadpan", { lookX: -0.2, lidL: 0.4, lidR: 0.4, curve: -0.2 }), faceC("shocked"));
K(C.consulting - 0.05, 0.2, face("unimpressed", { lookX: 0 }), "back.out(2)");

// ---- 7 coach (the music is back): "So I ghost them? Some are good leads."
line(7, faceC("panic", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
KC(C.ghost + 0.4, 0.25, faceC("pleading", { lookX: 0.5 }));

// ---- 8 Setty: "Ask before you teach. What do you want to fix? Ready to invest?" (the two questions, sent first)
line(8, face("proud", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), CARD_S);
st.bigDM(R, { id: "dm4", at: C.clic4, out: out(9), ...JAKE, ...CARD,
  msgs: [{ me: true, text: "what do you want to fix? 🙂", typing: C.clic4 + 0.1, at: C.what }, { me: true, text: "ready to invest?", at: C.ready }] });
left(C.clic4 - 0.01);

// ---- 9 coach: "Bro, I can't ask that in every DM."
line(9, faceC("annoyed", { lookX: 0.5 }), face("sly", { lookX: -0.6 }));

// ---- 10 Setty: "I can. Plug me into ManyChat. One question at a time. Only the right ones get your calendar, the rest get
// something useful, like your free guide." (BOOM on Manychat, then the two ways out)
line(10, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_S);
punch(C.boom2, 27);
K(C.boom2, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
K(C.boom2 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");
K(C.one, 0.25, face("smug", { armRr: 1.0, armRf: 0.6, lookX: -0.3 }), "back.out(2)");
st.twoWays(R, { id: "ways", at: C.clic6, out: out(11), ...BOX, head: { app: "manysetter", text: "Setty" },
  rows: [{ who: "the right ones", app: "calendly", to: "your calendar", at: C.right - 0.05, ok: C.calendar, hi: true },
    { who: "the rest", emoji: "📘", to: "free guide", at: C.rest - 0.05, ok: C.guide }] });
left(C.clic6 - 0.01);
K(C.right, 0.25, face("happy", { lookX: 0.4 }), "back.out(2)"); // he looks at the card
KC(C.guide, 0.3, faceC("hyped", { lookX: 0.5 }));

// ---- 11 coach: "So I get my evenings back?"
line(11, faceC("hyped", { lookX: 0.5, mouthOpen: 0.2 }), face("smug", { lookX: -0.6 }));

// ---- 12 Setty roasts: "Yeah, stop being a free [bleep]ing YouTube channel with a beanie." → Fahhh (he looks up at his beanie)
line(12, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null);
bleep(R.DATA.bleeps[1]);
K(C.beanie - 0.05, 0.2, face("laughing", { lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh2, faceC("eyeRoll", { lookY: 0.6 }));

// ---- 13 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending (back to
// the wide, which loops to frame 0; the comment bar types SETTY, the notification, the end pill)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 960 }); // lower: the comment bar sits under the title
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
