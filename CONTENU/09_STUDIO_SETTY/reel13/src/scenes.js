// Reel 13 "The 24-hour rule": a real conversation in a rented green-screen studio at night (set "greenscreen"). The coach
// sits on an apple box in front of the green, phone in hand, about to "blast" a promo to his 10,000 Manychat contacts;
// Setty sits on two road cases and breaks the plan with Meta's 24-hour window. The camera on whoever talks, the other one
// reacts; cards pop beside the speaker (his contacts, the window's clock that opens, closes and opens again, the
// follow-ups inside it), and the punchline lands on the playback monitor: his promo with a fake Lambo.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const { L, line, reaction, side, punch, push, bleep, ending, CARD_L, CARD_R } = D;

// three lines of title (slide 1 of the carousel, word for word)
kit.hookTitle(R, { lines: R.DATA.hook_title, max: 96, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

// a card beside the speaker at 70 %: its top under the title, its outer edge ~20 px from the frame
const SIDE = (where) => ({ fit: true, scale: 0.7, x: where === "left" ? -226 : 214 });
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const left24 = (t0, t1) => 24 - (t1 - t0) / 3600; // the clock running in real time from 24:00:00

// ---- frame 0 (thumbnail): the wide shot, the coach hyped about his blast, Setty smug on his road cases
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));

// ---- 0 Setty: "You've got ten thousand [bleep]ing contacts in Manychat, right?" (his riser, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0], B2 = R.DATA.bleeps[1];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Ten thousand, bro, and nobody buys. So tonight I blast them all." (his contacts, the blast button)
line(1, faceC("hyped", { lookX: 0.4 }), face("sleepy", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left", SIDE("left"));
st.contactsList(R, { id: "ctl1", at: C.clic1, out: out(2), count: { from: 0, to: 10000, t0: C.ten - 0.05, t1: C.nobody - 0.1 },
  button: { text: "Send to all", at: C.blast - 0.05 } });
KC(C.nobody - 0.05, 0.25, faceC("defeated", { lookX: 0.3 }), "back.out(1.6)");
KC(C.blast - 0.08, 0.25, faceC("proud", { lookX: 0.5, armRr: 0.6, armRf: 0.9 }), "back.out(2)");

// ---- 2 Setty: "When a lead DMs you, Meta gives you twenty-four hours." (the window opens, its clock starts)
line(2, face("deadpan", { lookX: -0.4 }), faceC("confused", { lookX: 0.6 }), CARD_R);
side(C.clic2 - 0.01, "right", SIDE("right"));
st.window24(R, { id: "w24a", at: C.clic2, out: out(3), clock: [{ t0: C.dms + 0.1, t1: out(3), from: 24, to: left24(C.dms + 0.1, out(3)) }],
  states: [{ at: C.dms - 0.05, text: "Open", tone: "green", icon: "message-circle" }],
  lines: [{ at: C.dms - 0.05, dm: "Jess", text: "how much? 👀" }, { at: C.meta, text: "Reply freely" }, { at: C.h24, text: "Offers allowed" }] });

// ---- 3 coach: "Half of them messaged me in March."
line(3, faceC("smug", { lookX: 0.5 }), face("eyeRoll", { lookX: -0.5 }));

// ---- 4 Setty: "After that, no more automated messages. Manychat won't even send them." (24 h fly by, it closes; BOOM)
line(4, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.3 }), faceC("shocked", { lookX: 0.6 }), CARD_R);
side(C.clic3 - 0.01, "right", SIDE("right"));
st.window24(R, { id: "w24b", at: C.clic3, out: out(5), clock: [{ t0: C.clic3 + 0.3, t1: C.automated, from: 23.99, to: 0 }],
  states: [{ at: C.clic3 + 0.1, text: "Open", tone: "green", icon: "message-circle" }, { at: C.automated, text: "Closed", tone: "red", icon: "lock" }],
  lines: [{ at: C.automated + 0.12, text: "No automation", icon: "bot", tone: "red" }, { at: C.boom1, text: "Not sent", icon: "ban", tone: "red" }] });
punch(C.boom1, 26);
K(C.boom1, 0.22, face("excuseMe", { lookX: -0.4 }), "back.out(2)");

// ---- 5 coach: "Wait, so I can't even message them anymore?"
line(5, faceC("shocked", { lookX: 0.5 }), face("deadpan", { lookX: -0.6 }));
KC(L[5].t + 0.6, 0.3, faceC("panic", { lookX: 0.5 }));

// ---- 6 Setty roasts: "By hand, within seven days, no promo. March is a graveyard, bro." (his March contacts lock) → Fahhh
line(6, face("sly", { lookX: -0.3 }), null, CARD_R);
side(C.clic4 - 0.01, "right", SIDE("right"));
st.contactsList(R, { id: "ctl2", at: C.clic4, out: C.fahhh1 - 0.32, total: "10,000", lock: { at: C.march, step: 0.16 },
  rows: [{ u: "Jess", c: "#d6249f", last: "Mar 3" }, { u: "Mike", c: "#3b82f6", last: "Mar 12" }],
  chips: [{ at: C.hand - 0.05, text: "By hand", icon: "hand" }, { at: C.seven - 0.05, text: "7 days", icon: "clock" },
    { at: C.promo - 0.05, text: "No promo", icon: "ban", tone: "red" }, { at: C.graveyard - 0.05, text: "RIP 🪦", icon: "", tone: "grey" }] });
K(C.graveyard - 0.1, 0.25, face("mocking", { armRr: 1.3, armRf: 1.0, lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh1, faceC("defeated", { lookX: 0.4 }));

// ---- 7 coach: "So Manychat locked my own list?"
line(7, faceC("annoyed", { lookX: 0.5 }), face("unimpressed", { lookX: -0.6 }));

// ---- 8 Setty: "Nope, Meta did. Manychat just follows the rules." (BOOM on "Meta did")
line(8, face("deadpan", { lookX: -0.4 }), faceC("confused", { lookX: 0.6 }));
punch(C.boom2, 25);
K(C.boom2 + 0.45, 0.3, { cam: { fov: 30 } }, "power2.inOut");
K(C.boom2 + 0.5, 0.3, face("smug", { lookX: -0.5 }));

// ---- 9 coach: "So how do I sell to them?"
line(9, faceC("pleading", { lookX: 0.5 }), face("sly", { lookX: -0.6 }));

// ---- 10 Setty: "While they're talking. Every message buys you twenty-four fresh hours." (a DM lands, the clock is reset)
line(10, face("proud", { lookX: -0.2 }), faceC("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic5 - 0.01, "right", SIDE("right"));
st.window24(R, { id: "w24c", at: C.clic5, out: out(11),
  clock: [{ t0: 0, t1: 0.01, from: 0, to: 0 }, { t0: C.every, t1: C.every + 0.35, from: 0, to: 24 },
    { t0: C.every + 0.35, t1: out(11), from: 24, to: left24(C.every + 0.35, out(11)) }],
  states: [{ at: C.clic5 + 0.1, text: "Closed", tone: "red", icon: "lock" }, { at: C.every, text: "Open again", tone: "green", icon: "message-circle" }],
  lines: [{ at: C.talking - 0.15, dm: "Jess", text: "me again 👋" }, { at: C.fresh - 0.05, text: "24 fresh hours", icon: "timer" }] });

// ---- 11 coach: "I film all day. I reply two days later."
line(11, faceC("defeated", { lookX: 0.4 }), face("unimpressed", { lookX: -0.6 }));
K(L[11].end - 0.5, 0.25, face("shocked", { lookX: -0.5 }), "back.out(2)");

// ---- 12 Setty: "Plug me into Manychat. I answer once they're done typing, then send up to three follow-ups inside those
// twenty-four hours." (the card on "answer": the reply, then three follow-ups while the clock runs, every one before zero; BOOM)
line(12, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right", SIDE("right"));
{
  const t0 = C.followups - 0.15, t1 = C.inside + 0.15, at = (rem) => t0 + ((24 - rem) / 20) * (t1 - t0);
  st.window24(R, { id: "w24d", at: C.clic6, out: out(13), clock: [{ t0, t1, from: 24, to: 4 }],
    rows: [{ at: C.clic6 + 0.2, text: "Reply", right: "✓", icon: "check-check" }, { at: at(20), text: "Follow-up", right: "4 h" },
      { at: at(12), text: "Follow-up", right: "12 h" }, { at: at(4), text: "Follow-up", right: "20 h" }] });
}
K(C.answer - 0.05, 0.25, face("proud", { lookX: 0.2 }), "back.out(1.6)");
punch(C.boom3, 26);
K(C.boom3, 0.25, face("proud", { armRr: 2.2, lookX: -0.3 }), "back.out(2)");

// ---- 13 coach: "Okay. How do I set you up?" (the music dies: the wide shot, silence, a slow push)
K(L[13].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.12;
  K(L[13].t + 0.02, L[13].end - L[13].t + 0.3, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, faceC("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));

// ---- 14 Setty roasts: "Step off the green screen. You're pitching nobody next to a fake [bleep]ing Lambo." (Setty, then a
// cut to the monitor: the promo, him keyed next to a fake car; the bleep's bar in the captions) → Fahhh
{
  const l = L[14], p = R.camOf("promo");
  shotTo(l.t - 0.2, "setty", { dur: 0.28 });
  K(l.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(l.t + 0.08, C.pitching - 0.2, "setty", {}, 0.8);
  K(l.t - 0.12, 0.25, face("mocking", { armRr: 1.3, armRf: 1.0, lookX: -0.8 }), "back.out(1.6)");
  KC(C.green, 0.3, faceC("confused", { lookX: 0.6 }));
  shotTo(C.pitching - 0.12, "promo", { dur: 0.12, ease: "power4.out" });
  K(C.pitching + 0.02, C.fahhh2 - 0.12 - (C.pitching + 0.02), { cam: { px: p.px + (p.ax - p.px) * 0.18, py: p.py + (p.ay - p.py) * 0.18, pz: p.pz + (p.az - p.pz) * 0.18 } }, "sine.inOut");
  bleep(B2);
}
reaction(C.fahhh2, faceC("annoyed", { lookX: 0.6 }));

// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending
line(15, face("smug", { lookX: -0.2 }), faceC("laughing"));
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
