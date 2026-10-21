// Reel 20 "The hot lead": a real conversation in an American diner at 1 a.m. (set "diner"). The coach sits in a teal
// window booth behind the order he could not resist (pancakes, fries, a shake, a "TO GO" bag: tomorrow's burger), phone in
// hand, sure his hottest lead is booking "tonight"; Setty sits on the table by the napkins and names what happened (the
// hot-cold empathy gap, then the hunger study, which the coach is living right now). The camera on whoever talks, the other
// one reacts; cards pop beside the speaker in big type (her DM, the two studies, the hot and cold rows, the chat finished in
// the DM); three cutaways in the set: the wall clock at 1:04, the "TO GO" bag, the pancakes.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

// three lines of title (slide 1 of the carousel, word for word), all at the same size
kit.hookTitle(R, { lines: R.DATA.hook_title, max: 84, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, bleep, ending, CARD_L } = D; // assets/engine/dialogue.js
// the cards: on the left (the speaker on the right), at 62 %: their text is ~60 px on the phone; side({ fit }) starts them
// under the three-line title, and they stay short enough to stop above the captions (y 1185)
const S = 0.62;
const left = (t) => side(t, "left", { fit: true, scale: S, x: 480 * S - 516 }); // the card's left edge 24 px from the frame
const CARD = { x: 60, w: 900 }; // the DMs and the studies take their content's height
const CARD_S = { x: 840, dist: 15 }; // Setty beside a card: a little further right than CARD_L, the card off his cheek
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const JESS = { user: "Jess", color: "#ec4899" };

// a cutaway inside a line: a snap to a set shot (frames in diner.js), a slow push on it, a snap back to the speaker who
// keeps pushing (each camera move takes over from the one before: reel.json "cam_track")
const cutaway = (t0, t1, name, dist, who = "setty", tEnd) => {
  shotTo(t0 - 0.12, name, { dur: 0.14, ease: "power4.out" });
  K(t0 + 0.02, Math.max(0.3, t1 - 0.3 - t0), { cam: R.camOf(name, { dist }) }, "sine.inOut");
  if (tEnd == null) return;
  shotTo(t1 - 0.25, who, { dur: 0.16, ease: "power4.out" });
  K(t1 - 0.08, Math.max(0.3, tEnd - t1), { cam: R.camOf(who, { dist: R.set.frames[who].dist * 0.82 }) }, "sine.inOut");
};

// ---- frame 0 (thumbnail): the wide shot, the coach hyped on his phone behind his huge order, Setty smug on the table
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { lookX: 0.2, lookY: -0.4 }));

// ---- 0 Setty: "You let a [bleep]ing hot lead sleep on it, right?" (his riser, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 950 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Bro, she said, this is exactly what I need. She's booking tonight." (her DM, the carousel's example)
line(1, faceC("proud", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }), CARD_L);
st.bigDM(R, { id: "dm1", at: C.clic1, out: out(2), ...JESS, ...CARD,
  msgs: [{ text: "exactly what i need 😍", at: C.exactly }, { me: true, text: "book a call 👉 📅", at: C.shes - 0.12 },
    { text: "tonight!! 🙌", at: C.tonight }] });
left(C.clic1 - 0.01);
KC(C.tonight, 0.25, faceC("smug", { lookX: 0.4 }), "back.out(2)");

// ---- 2 Setty: "It's one in the morning. Spoiler, tonight never comes." (the wall clock at 1:04, then back to him; BOOM)
line(2, face("deadpan", { lookX: -0.2 }), faceC("smug", { lookX: 0.5 }));
cutaway(C.one, C.spoiler, "clock", 3.0, "setty", L[2].end + 0.3);
K(C.spoiler - 0.1, 0.25, face("sideEye", { lookX: -0.6 }), "back.out(2)");
punch(C.boom1, 26);
K(C.comes - 0.05, 0.25, face("mocking", { armRr: 1.1, armRf: 0.8, lookX: -0.6 }), "back.out(2)");

// ---- 3 coach: "Nah, she's busy. She forgot."
line(3, faceC("skeptical", { lookX: 0.4 }), face("unimpressed", { lookX: -0.6 }));
KC(C.forgot - 0.05, 0.25, faceC("smug", { lookX: 0.4 }), "back.out(2)");

// ---- 4 Setty: "Maybe. Or she got excited, then cold feet. Psychologists call it the hot-cold empathy gap." (the music dies on
// "Psychologists": the study pops, dead serious; the highlighter on "empathy gap", BOOM + the music back on "gap")
line(4, face("thinking", { tilt: 0.12, lookX: -0.5 }), faceC("confused", { lookX: 0.5 }), CARD_S);
K(C.excited - 0.05, 0.25, face("happy", { armRr: 1.6, armLr: 1.6, lookX: -0.3 }), "back.out(2)");
K(C.feet - 0.08, 0.25, face("deadpan", { lookX: -0.4 }), "back.out(2)");
K(C.clic2, 0.3, face("deadpan", { lidL: 0.4, lidR: 0.4, curve: -0.2, lookX: -0.2 }));
st.study(R, { id: "s1", at: C.clic2, out: out(5), ...CARD, head: { text: "Health Psychology", sub: "2005" },
  title: "Hot-cold *empathy gap*", author: "George Loewenstein", mark: C.hotcold });
left(C.clic2 - 0.01);
punch(C.boom2, 27);
K(C.boom2 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut"); // back out: his face stays beside the card

// ---- 5 coach: "The hot-cold what?"
line(5, faceC("confused", { lookX: 0.4, headTilt: 0.15 }), face("smug", { lookX: -0.6 }));

// ---- 6 Setty: "In your DM, she felt it. Tomorrow, she won't feel it the same." (hot, then cold)
line(6, face("proud", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), CARD_S);
st.study(R, { id: "hc", at: C.clic3, out: out(7), ...CARD,
  rows: [{ emoji: "🔥", tint: "hot", label: "In the DM", text: "“exactly what I need!”", at: C.dm - 0.05 },
    { emoji: "🧊", tint: "cold", label: "Tomorrow", text: "“let me think…”", at: C.tomorrow - 0.05 }] });
left(C.clic3 - 0.01);
K(C.dm, 0.25, face("happy", { lookX: -0.6 }), "back.out(2)"); // he looks at the card
K(C.tomorrow, 0.25, face("deadpan", { lookX: -0.6, lidL: 0.35, lidR: 0.35 }), "back.out(2)");

// ---- 7 coach: "Bro, I'm eating." (he points at his plate)
line(7, faceC("annoyed", { lookX: 0.4, lookY: -0.3 }), face("sly", { lookX: -0.6 }));

// ---- 8 Setty: "One study: hungry people picked more junk food for next week than people who'd just eaten. You ordered
// tomorrow's burger." (the study, then the "TO GO" bag) → Fahhh on the coach
line(8, face("smug", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_S);
st.study(R, { id: "s3", at: C.clic4, out: C.ordered - 0.2, ...CARD, head: { text: "Hunger study", sub: "1998" },
  author: "Read & van Leeuwen",
  rows: [{ emoji: "😩", tint: "hot", label: "Hungry", text: "more junk 🍩", at: C.hungry - 0.05 },
    { emoji: "😌", label: "Just ate", text: "less junk 🍎", at: C.eaten - 0.25 }] });
left(C.clic4 - 0.01);
K(C.junk - 0.05, 0.25, face("laughing", { lookX: -0.6 }), "back.out(2)");
K(C.eaten - 0.1, 0.25, face("sly", { lookX: -0.6 }), "back.out(2)");
cutaway(C.ordered, C.fahhh1 + 0.15, "bag", 2.5);
reaction(C.fahhh1, faceC("eyeRoll", { lookX: 0.3 }));

// ---- 9 coach: "So I chase her? I'll look desperate."
line(9, faceC("stressed", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }));
KC(C.desperate - 0.05, 0.25, faceC("pleading", { lookX: 0.4 }), "back.out(2)");

// ---- 10 Setty: "No. You finish while she's hot. Plug me into ManyChat." (BOOM on "hot")
line(10, face("unimpressed", { lookX: -0.3 }), faceC("confused", { lookX: 0.5 }));
K(C.finish - 0.05, 0.25, face("proud", { armRr: 1.0, armRf: 0.8, lookX: -0.4 }), "back.out(2)");
punch(C.boom3, 27);
K(C.plug - 0.05, 0.25, face("sly", { armRr: 2.2, lookX: -0.3 }), "back.out(2)");
K(C.boom3 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");

// ---- 11 coach: "And you do what?"
line(11, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 12 Setty: "I answer her last question in your voice, check she's a fit, and offer two or three times right in the chat."
// (the same DM, finished in the DM: her question, his answer + one question, two times, booked in her time zone)
line(12, face("proud", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), CARD_S);
st.bigDM(R, { id: "dm2", at: C.clic5, out: out(13), ...CARD, head: false,
  msgs: [{ text: "how long is it?", at: C.clic5 + 0.25 },
    { me: true, text: "12 weeks! your goal?", typing: C.last + 0.2, at: C.check - 0.35 },
    { me: true, text: "tue 10am or wed 2pm?", at: C.two - 0.25, seen: { text: "✓ booked · her time zone", at: C.two + 0.4 } }] });
left(C.clic5 - 0.01);
K(C.check, 0.25, face("happy", { lookX: -0.6 }), "back.out(2)");
K(C.right, 0.25, face("smug", { armRr: 1.2, armRf: 0.6, lookX: -0.4 }), "back.out(2)");
KC(C.right + 0.3, 0.3, faceC("hyped", { lookX: 0.5 }));

// ---- 13 coach: "How do I set you up?"
line(13, faceC("hyped", { lookX: 0.5, mouthOpen: 0.2 }), face("smug", { lookX: -0.6 }));

// ---- 14 Setty roasts: "Eat your pancakes first. You're the hungry guy from the [bleep]ing study." (his pancakes, then
// back to Setty for the bleep) → Fahhh (he looks down at his plate)
line(14, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.6 }), null);
cutaway(C.pancakes, C.youre, "cakes", 2.3, "setty", L[14].end + 0.3);
bleep(R.DATA.bleeps[1]);
K(C.study - 0.05, 0.2, face("laughing", { armRr: 1.2, armRf: 1.0, armLr: 1.2, armLf: 1.0, lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh2, faceC("defeated", { lookX: 0.2, lookY: -0.6 }));

// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending (back to
// the wide, which loops to frame 0; the comment bar types SETTY, the notification, the end pill)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 960 }); // lower: the comment bar sits under the title
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
