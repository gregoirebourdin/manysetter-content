// Reel 21 "Human setter or AI setter": a real conversation in a boxing ring at night (set "boxing"). The coach gets 30 DMs a
// day and stages a fight, "human versus AI, winner gets my inbox"; Setty, in the blue corner on his stack of towels, plays
// the honest cornerman: round 1 the price (the human's PayScale range, then his own price and the extra replies at 30 chats
// a day), round 2 the voice, then what a person does best, and the draw: both. The round timer on the wall runs.
// The camera on whoever talks, the other one reacts; cards pop beside the speaker, in big type (the fight poster, the two
// tales of the tape, the math, a DM in his voice, what a person does best, who does what).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

// two lines of title (slide 1 of the carousel, word for word)
kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, bleep, ending, CARD_L } = D; // assets/engine/dialogue.js
// the cards: on the left (the speaker on the right), at 62 %: their text is ~60 px on the phone. They start under the
// title and stop above the captions (y 1165): H is their height in stage px, from the title's real height.
const S = 0.62;
const hook = document.getElementById("hook");
const H = Math.floor((1165 - (hook.offsetTop + hook.offsetHeight + 24 + 60 * S)) / S);
const left = (t) => side(t, "left", { fit: true, scale: S, x: 480 * S - 516 }); // the card's left edge 24 px from the frame
const CARD = { x: 60, w: 900 };
const CARD_S = { x: 840, dist: 15 }; // Setty beside a card: a little further right than CARD_L, the card off his cheek
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker

// the round timer on the gym wall (set "boxing"): round 1 from "Round one", round 2 from "Round two", 3:00 running down
R.onFrame((t) => {
  const r2 = t >= C.round2, t0 = r2 ? C.round2 : C.round1;
  R.set.timer.show(r2 ? 2 : 1, 180 - Math.max(0, t - t0));
});

// ---- frame 0 (thumbnail): the wide shot, the coach on his stool in the red corner, hyped, Setty smug in the blue corner
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));

// ---- 0 Setty: "You're about to hire a [bleep]ing setter, right?" (his riser, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 950 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Thirty DMs a day, bro. Human versus AI, winner gets my inbox." (the fight poster: the counter, HUMAN, AI)
line(1, faceC("hyped", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }), CARD_L);
st.fightCard(R, { id: "poster", mode: "poster", at: C.clic1, out: out(2), ...CARD, h: Math.min(H, 860),
  top: { app: "instagram", count: { from: 0, to: 30, t0: C.thirty, t1: C.day }, unit: "DMs a day" },
  left: { text: "HUMAN", at: C.human }, right: { text: "AI", at: C.ai }, foot: { text: "🏆 gets the inbox", at: C.winner } });
left(C.clic1 - 0.01);
KC(C.human - 0.05, 0.25, faceC("proud", { lookX: 0.4 }), "back.out(2)");
KC(C.winner - 0.05, 0.25, faceC("smug", { lookX: 0.4 }), "back.out(2)");

// ---- 2 Setty roasts: "You rented a [bleep]ing boxing ring to hire a setter." → Fahhh (the coach looks around the ring)
line(2, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), null);
bleep(R.DATA.bleeps[1]);
K(R.DATA.bleeps[1].end + 0.3, 0.25, face("laughing", { armRr: 1.2, armRf: 1.0, armLr: 1.2, armLf: 1.0 }), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.5, lookY: 0.3 }));

// ---- 3 coach: "Round one, the price." (the timer on the wall starts round 1)
line(3, faceC("smug", { lookX: 0.4, armRr: 0.6, armRf: 0.8 }), face("sly", { lookX: -0.6 }));

// ---- 4 Setty: "PayScale says thirteen to twenty-one an hour, plus commission. Full time, over two grand a month."
line(4, face("deadpan", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_S);
st.fightCard(R, { id: "human", at: C.clic2, out: out(5), ...CARD, corner: "red", head: { emoji: "🧑", text: "Human setter" },
  rows: [{ big: "$13-21/hr", sub: "+ commission", at: C.thirteen }, { big: "$2,250+/mo", sub: "full time", at: C.full, size: 130 }],
  foot: { text: "PayScale, US", at: C.says } });
left(C.clic2 - 0.01);
K(C.commission - 0.05, 0.25, face("smug", { armRr: 1.0, armRf: 0.6, lookX: -0.4 }), "back.out(2)"); // he points at the card
KC(C.grand, 0.3, faceC("shocked", { lookX: 0.5 }));

// ---- 5 coach: "And you?"
line(5, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 6 Setty (BOOM): "A hundred nineteen a month. Fifteen hundred replies included." (his own tale of the tape)
line(6, face("proud", { lookX: -0.3 }), faceC("shocked", { lookX: 0.5 }), CARD_S);
st.fightCard(R, { id: "ai", at: C.boom1, out: out(7), ...CARD, corner: "blue", head: { app: "manysetter", text: "AI setter" },
  rows: [{ big: "$119/mo", sub: "per live setter", at: C.hundred }, { big: "1,500", sub: "replies included", at: C.fifteen }] });
left(C.boom1 - 0.01);
punch(C.boom1, 27);
K(C.boom1 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut"); // back out: his face stays beside the card
K(C.boom1, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");

// ---- 7 coach: "Knockout." (both fists up)
line(7, faceC("hyped", { armLr: 2.4, armRr: 2.4, armLf: 0.5, armRf: 0.5, elbowL: 1.6, elbowR: 1.6, mouthOpen: 0.6 }),
  face("deadpan", { lookX: -0.6 }));

// ---- 8 Setty, honest: "Easy, champ. Thirty new chats a day needs extra replies, thirty-nine per five hundred." (the math)
line(8, face("smug", { armRr: 1.0, armRf: 0.9, lookX: -0.3 }), faceC("confused", { lookX: 0.5 }), CARD_S);
st.fightCard(R, { id: "math", at: C.clic4, out: out(9), ...CARD, corner: "dark", head: { emoji: "🧮", text: "at 30 a day" },
  rows: [{ big: "≈ 900 chats", sub: "a month", at: C.chats, size: 110 }, { big: "× 4-5 replies", at: C.needs, size: 104 },
    { big: "> 1,500", sub: "included", at: C.extra, tone: "red", size: 120 }, { big: "+500 = $39", at: C.nine, pill: true }] });
left(C.clic4 - 0.01);
K(C.extra - 0.05, 0.25, face("sly", { lookX: -0.4 }), "back.out(2)");
KC(C.nine, 0.3, faceC("stressed", { lookX: 0.5 }));

// ---- 9 coach: "Round two. AI sounds robotic." (the timer starts round 2)
line(9, faceC("annoyed", { lookX: 0.4, armLf: 0.9, armRf: 0.9, elbowL: 1.9, elbowR: 1.9 }), face("eyeRoll", { lookX: -0.6 }));

// ---- 10 Setty: "In your voice, one question at a time, like you'd do it yourself." (a DM in the coach's own words)
line(10, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_S);
st.bigDM(R, { id: "dm", at: C.clic5, out: out(11), ...CARD, user: "jess.fit", color: "#0ea5e9",
  msgs: [{ text: "is this for me? 👀", at: C.clic5 + 0.2 }, { me: true, text: "yo! for sure 🙌", typing: C.clic5 + 0.45, at: C.voice },
    { me: true, text: "what's your goal?", at: C.question }] });
left(C.clic5 - 0.01);
K(C.yourself - 0.05, 0.25, face("smug", { lookX: -0.3 }), "back.out(2)");

// ---- 11 coach: "So you win."
line(11, faceC("hyped", { lookX: 0.5, mouthOpen: 0.2 }), face("deadpan", { lookX: -0.6 }));

// ---- 12 Setty, dead serious (BOOM): "Nope. He's better on the sales call, big deals, new objections." (what a person does best)
line(12, face("deadpan", { lookX: -0.2, lidL: 0.35, lidR: 0.35 }), faceC("shocked", { lookX: 0.5 }), CARD_S);
punch(C.boom2, 27);
K(C.boom2 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");
st.fightCard(R, { id: "person", at: C.clic6, out: out(13), ...CARD, corner: "red", head: { emoji: "🧑", text: "a person wins" },
  rows: [{ big: "the sales call", at: C.sales - 0.1, size: 100 }, { big: "big deals", at: C.big - 0.05, size: 100 },
    { big: "new objections", at: C.new - 0.05, size: 100 }] });
left(C.clic6 - 0.01);
K(C.big, 0.3, face("proud", { lookX: -0.4 }));

// ---- 13 coach: "Then who wins?"
line(13, faceC("confused", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 14 Setty (BOOM): "Both. Plug me into ManyChat, I find the serious ones and book them. He takes the hard cases and the call."
line(14, face("proud", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), CARD_S);
punch(C.boom3, 27);
K(C.boom3, 0.25, face("proud", { armRr: 2.2, armLr: 2.2 }), "back.out(2)");
K(C.boom3 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");
st.twoWays(R, { id: "both", at: C.clic7, out: out(15), ...CARD, head: { app: "manysetter", text: "in Manychat" },
  rows: [{ who: "serious ones", app: "calendly", to: "booked", at: C.mc - 0.05, ok: C.book, hi: true },
    { who: "hard cases", emoji: "🧑", to: "you + the call", at: C.he - 0.05, ok: C.call }] });
left(C.clic7 - 0.01);
K(C.serious, 0.25, face("happy", { lookX: -0.4 }), "back.out(2)");
KC(C.call, 0.3, faceC("proud", { lookX: 0.5 }));

// ---- 15 coach (the music dies): "Okay. How do I set you up?"
line(15, faceC("pleading", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 16 Setty roasts: "You paid for a fight and got a [bleep]ing group hug." → Fahhh (the coach looks at the empty ring)
line(16, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null);
bleep(R.DATA.bleeps[2]);
K(C.hug - 0.05, 0.2, face("laughing", { lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh2, faceC("eyeRoll", { lookY: 0.4 }));

// ---- 17 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending (back to
// the wide, which loops to frame 0; the comment bar types SETTY, the notification, the end pill)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 960 }); // lower: the comment bar sits under the title
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
