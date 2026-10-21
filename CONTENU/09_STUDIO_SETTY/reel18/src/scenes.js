// Reel 18 "DM ads": a real conversation in a boardroom at the top of a glass tower (set "boardroom", the afternoon). The
// coach stands by the wall screen and presents his ad results ("Messaging conversations started: 300") to the only one at
// the meeting: Setty, sitting on the table. The camera on whoever talks, the other one reacts; cards pop beside the
// speaker, in big type (the metric, what it really counts, the lead who waited, the ad → Manychat → Setty relay, the reply
// in his voice).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.setty] });

const { L, line, reaction, side, punch, bleep, ending, CARD_L } = D; // assets/engine/dialogue.js
// the cards: on the left (the speaker on the right), at 62 %: their text is ~60 px on the phone. They start under the
// title and stop above the captions (y 1165): H is their height in stage px, from the title's real height.
const S = 0.62;
const hook = document.getElementById("hook");
const H = Math.floor((1165 - (hook.offsetTop + hook.offsetHeight + 24 + 60 * S)) / S);
const left = (t) => side(t, "left", { fit: true, scale: S, x: 480 * S - 516 }); // the card's left edge 24 px from the frame
const CARD = { x: 60, w: 900 };
const BOX = { ...CARD, h: H };
const CARD_S = { x: 840, dist: 15 }; // Setty beside a card: a little further right than CARD_L, the card off his cheek
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const MIA = { user: "mia.fit", color: "#7c3aed" };
const NAME = ["Messaging", "conversations", "started"]; // Meta's own name for the metric

// ---- frame 0 (thumbnail): the wide shot, the coach presenting by his dashboard ("300"), Setty smug on the table
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("proud", { lookX: 0.5, armRr: 1.2, armRf: 0.4, elbowR: 0.4, pointR: 1 }));

// ---- 0 Setty: "You paid Meta to fill your [bleep]ing DMs, right?" (his riser, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 950 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Three hundred conversations started, bro. Look at that!" (his result, the number runs up)
line(1, faceC("proud", { lookX: 0.4, armRr: 1.2, armRf: 0.4, elbowR: 0.4, pointR: 1 }), face("deadpan", { lookX: -0.6 }), CARD_L);
st.adMetric(R, { id: "m1", at: C.clic1 + 0.12, out: out(2), ...CARD, name: NAME, count: { from: 0, to: 300, t0: C.clic1 + 0.15, t1: C.started },
  up: { text: "Active", at: C.look - 0.1 } });
left(C.clic1 + 0.11);
KC(C.look - 0.05, 0.25, faceC("hyped", { lookX: 0.4, armRr: 1.5, armRf: 0.6, elbowR: 0.3, pointR: 1 }), "back.out(2)");

// ---- 2 Setty, flat: "Started, cool. How many got an answer?"
line(2, face("deadpan", { lookX: -0.4, lidL: 0.35, lidR: 0.35 }), faceC("proud", { lookX: 0.5 }));
K(C.answer1 - 0.05, 0.25, face("sideEye", { lookX: -0.6 }), "back.out(2)");

// ---- 3 coach, smug then unsure: "Bro, it literally says conversations."
line(3, faceC("smug", { lookX: 0.4, armRr: 0.9, armRf: 0.8, elbowR: 0.9 }), face("unimpressed", { lookX: -0.6 }));
KC(C.literally + 0.35, 0.3, faceC("skeptical", { lookX: 0.4 }), "back.out(1.6)");

// ---- 4 Setty: "It counts people who messaged you after the ad. Not who got an answer." (what it counts ✓, what it doesn't ✗)
line(4, face("sly", { lookX: -0.3 }), faceC("confused", { lookX: 0.5 }), CARD_S);
st.adMetric(R, { id: "m2", at: C.clic2 + 0.12, out: out(5), ...CARD, name: NAME, count: { from: 300, to: 300, t0: 0, t1: 1 },
  rows: [{ text: "messaged you", ok: true, at: C.messaged - 0.05 }, { text: "got an answer", ok: false, at: C.boom1 }] });
left(C.clic2 + 0.11);
punch(C.boom1, 27);
K(C.boom1, 0.25, face("unimpressed", { lookX: -0.2 }), "back.out(2)");
K(C.boom1 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut"); // back out: his face stays beside the card

// ---- 5 coach: "Wait, so that's not three hundred leads?"
line(5, faceC("confused", { lookX: 0.4 }), face("smug", { lookX: -0.6 }));
KC(C.leads - 0.05, 0.25, faceC("shocked", { lookX: 0.4 }), "back.out(2)");

// ---- 6 Setty roasts: "It's three hundred hellos. You paid Meta for a guestbook." → Fahhh on the coach
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), null);
K(C.guestbook - 0.05, 0.25, face("laughing", { armRr: 1.2, armRf: 1.0, armLr: 1.2, armLf: 1.0 }), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.5, lookY: -0.3 }));

// ---- 7 coach, defensive: "Lots of them click, say hi and ghost anyway."
line(7, faceC("annoyed", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }));
KC(C.ghost - 0.05, 0.3, faceC("eyeRoll", { lookX: 0.3 }), "back.out(1.6)");

// ---- 8 Setty, dead serious: "Sure. The serious ones waited, then moved on to whoever answered first." (BOOM, the lead who waited)
line(8, face("deadpan", { lookX: -0.2, lidL: 0.3, lidR: 0.3, curve: -0.2 }), faceC("stressed", { lookX: 0.5 }), CARD_S);
st.bigDM(R, { id: "dm1", at: C.clic3 + 0.12, out: out(9), ...MIA, ...CARD, status2: { text: "Active 2d ago", at: C.first },
  msgs: [{ text: "saw your ad 👀", at: C.serious - 0.05 }, { text: "how does it work?", at: C.waited },
    { me: true, text: "hey! sorry 🙏", time: "+2d", at: C.moved, seen: { text: "Seen", at: C.boom2 } }] });
left(C.clic3 + 0.11);
punch(C.boom2, 27);
K(C.boom2 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");

// ---- 9 coach, overwhelmed: "Bro, I'm on calls all day. I can't live in my DMs."
line(9, faceC("stressed", { lookX: 0.4 }), face("thinking", { lookX: -0.6 }));
KC(C.live - 0.05, 0.3, faceC("pleading", { lookX: 0.4 }), "back.out(1.6)");

// ---- 10 Setty: "You don't have to. Plug me into ManyChat. It keeps your ad trigger, and when they reply, I take over."
line(10, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_S);
st.twoWays(R, { id: "relay", at: C.clic4, out: out(11), ...BOX,
  rows: [{ who: "your ad", app: "instagram", to: "→ Manychat", at: C.mc - 0.05, ok: C.trigger },
    { who: "they reply", app: "manysetter", to: "→ I take over", at: C.they - 0.05, ok: C.over, hi: true }] });
left(C.clic4 - 0.01);
K(C.mc, 0.25, face("proud", { armRr: 2.0, lookX: -0.3 }), "back.out(2)");
K(C.over - 0.05, 0.25, face("smug", { armRr: 1.0, armRf: 0.6, lookX: -0.3 }), "back.out(2)");

// ---- 11 coach: "And I don't sound like some bot?"
line(11, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 12 Setty: "You sound like you. One question at a time. Only the right ones get your calendar." (the same lead, answered)
line(12, face("proud", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), CARD_S);
st.bigDM(R, { id: "dm2", at: C.clic5 + 0.12, out: out(13), ...MIA, ...CARD,
  msgs: [{ me: true, text: "what's your goal? 🙂", typing: C.clic5 + 0.22, at: C.one }, { text: "drop 15 lbs", at: C.time - 0.15 },
    { me: true, text: "tue 2pm or wed 11am?", at: C.only }] });
left(C.clic5 + 0.11);
K(C.only, 0.25, face("happy", { lookX: 0.4 }), "back.out(2)"); // he looks at the card
KC(C.calendar, 0.3, faceC("hyped", { lookX: 0.5 }));

// ---- 13 coach, the setup (the music dies): "Okay. How do I set you up?" (the wide: the empty boardroom)
KC(L[13].t - 0.12, 0.25, faceC("pleading", { lookX: 0.5, talk: 0 }), "back.out(1.6)");
K(L[13].t - 0.2, 0.7, { cam: R.camOf("wide") }, "power3.inOut");
K(L[13].t + 0.2, 0.3, face("sly", { lookX: -0.7 }));

// ---- 14 Setty roasts: "First, stop presenting your hellos to an empty [bleep]ing boardroom." → Fahhh on the coach
line(14, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null);
bleep(R.DATA.bleeps[1]);
K(C.boardroom - 0.05, 0.2, face("laughing", { lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh2, faceC("eyeRoll", { lookY: 0.4 }));

// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending (back to
// the wide, which loops to frame 0; the comment bar types SETTY, the notification, the end pill)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 960 }); // lower: the comment bar sits under the title
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
