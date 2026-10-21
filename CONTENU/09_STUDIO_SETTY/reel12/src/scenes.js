// Reel 12 "The price ghost": a real conversation in an empty coworking at night (set "coworking"). The coach sits alone at
// the head of the long table, his laptop open on the DM that left him on "Seen"; Setty sits on a felt pouf by the table
// and takes the discount plan apart: it's not the price, nobody says no, give the price plus one question, then plug me
// in. The camera on whoever talks, the other one reacts; cards beside the speaker (his DM, the price tag, the fixed reply,
// the pipeline, the nudges); the punchline: the coworking's lights are on a motion sensor and he hasn't moved since Tuesday.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const { L, line, reaction, side, punch, push, bleep, ending, CARD_L, CARD_R } = D;
const BIG = { fit: true, scale: 0.62 }; // cards in big type, under the 3-line title
const LEFT = { ...BIG, x: -222 }, RIGHT = { ...BIG, x: 222 }; // a 24 px margin from the edge at 62 %
const SR = { ...CARD_R, dist: 13.5, y: 1000 }; // Setty with a card on his right: as big as in his close-up

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

// ---- frame 0 (thumbnail): the wide shot, the coach at his laptop, Setty smug on his pouf
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("smug", { lookX: 0.5 }));

// ---- 0 Setty: "You sent your [bleep]ing price in the DM, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 940 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 to 3, the camera stays on the coach and his DM ("And he said?" is Setty off screen): the price, "Seen" since
// Tuesday, the header turns red, the price struck and $999? written over it
line(1, faceC("proud", { lookX: 0.4, armRr: 0.3, armRf: 1.1, elbowR: 1.5 }), face("sleepy", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left", LEFT);
st.bigDM(R, { id: "dm", at: C.clic1, out: L[4].t - 0.38, user: "kev.trains", color: "#2563eb",
  status2: { text: "Active 2d ago", at: C.tue },
  msgs: [{ text: "how much?", at: C.clic1 + 0.12 }, // never an empty card: the first bubble comes with it
    { me: true, text: "{swap}, 12 weeks", swap: { from: "$1,500", to: "$999?", at: C.nine }, at: C.fifteen,
      seen: { text: "Seen Tuesday", at: C.seen } }] });
K(L[2].t - 0.1, 0.25, face("deadpan", { lookX: -0.6 }));
KC(L[2].t + 0.05, 0.3, faceC("thinking", { lookX: 0.3, lookY: -0.2 }));
push(L[2].t - 0.15, L[3].t - 0.22, "coach", CARD_L, 0.86);
line(3, faceC("defeated", { lookX: 0.3, lookY: -0.25 }), null, { ...CARD_L, dist: 12.9 });
KC(C.nine - 0.15, 0.25, faceC("sly", { lookX: 0.5, armRr: 0.5, armRf: 1.0, elbowR: 1.3 }), "back.out(2)");

// ---- 4 Setty roasts: "Smart. Now he ghosts you at a discount." → Fahhh on the coach
line(4, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }), null);
K(L[4].end - 0.45, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.6 }));

// ---- 5 Setty: "Relax, it's not your price. He doesn't know yet what it fixes." (BOOM; the lone price tag, "?" around it)
line(5, face("deadpan", { lookX: -0.4 }), faceC("skeptical", { lookX: 0.5 }), CARD_L);
punch(C.boom1, 24);
K(C.boom1, 0.22, face("excuseMe", { lookX: -0.3 }), "back.out(2)");
side(C.clic2 - 0.01, "left", LEFT);
st.priceTag(R, { id: "tag", at: C.clic2, out: L[6].t - 0.38, price: "$1,500", sub: "12 weeks", qs: [C.q1, C.q2, C.q3],
  ask: { text: "fixes… what?", at: C.ask } });

// ---- 6 coach: "Why not just say no?"
line(6, faceC("confused", { lookX: 0.5, armRr: 0.4, armRf: 1.0, elbowR: 1.2 }), face("smug", { lookX: -0.6 }));
// ---- 7 Setty: "Saying no is awkward. Ghosting takes zero words." (BOOM on "zero")
line(7, face("deadpan", { lookX: -0.4 }), faceC("confused", { lookX: 0.5 }));
punch(C.boom2, 24);
K(C.boom2, 0.22, face("mocking", { armRr: 0.5, armRf: 0.9 }), "back.out(2)");
// ---- 8 coach: "I hate people wasting my damn time." (his hand comes down on the table)
line(8, faceC("annoyed", { lookX: 0.4, armRr: 0.9, armRf: 1.2, elbowR: 1.4 }), face("sideEye", { lookX: -0.6 }));
KC(C.damn - 0.05, 0.1, faceC("annoyed", { lookX: 0.4, armRr: 0.25, armRf: 1.25, elbowR: 0.5 }), "power4.in");
shake(C.damn + 0.06, 0.45);

// ---- 9 Setty: "Give the price, plus one question. What made you reach out today?" (the reply that keeps the chat alive)
line(9, face("proud", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), SR);
side(C.clic3 - 0.01, "right", RIGHT);
st.bigDM(R, { id: "fix", at: C.clic3, out: L[10].t - 0.38, head: false,
  msgs: [{ me: true, text: "$1,500, 12 weeks", at: C.clic3 + 0.12 }, { me: true, text: "what made you<br>reach out?", at: C.what9 },
    { text: null, typing: C.typing9 }] });

// ---- 10 coach: "I'm on calls all day. Who's asking that?"
line(10, faceC("skeptical", { lookX: 0.5, armRr: 0.3, armRf: 1.0, elbowR: 1.6 }), face("smug", { lookX: -0.6 }));
// ---- 11 Setty: "Me. Plug me into Manychat. I answer the price from your offer, then ask the next question." (BOOM)
line(11, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_L);
K(L[11].t - 0.05, 0.2, face("proud", { armRr: 2.2 }), "back.out(2)");
punch(C.boom3, 25);
side(C.clic4 - 0.01, "left", LEFT);
st.checklist(R, { id: "plug", at: C.clic4, out: L[12].t - 0.38, title: "Plug me in", appSlug: "manysetter",
  items: [{ icon: "message-circle", text: "Manychat", sub: "your flows stay", at: C.clic4 + 0.12 },
    { app: "instagram", text: "Price + question", sub: "from your offer", at: C.answer }] });

// ---- 12 coach: "And when he goes quiet? Chasing comes off desperate."
line(12, faceC("stressed", { lookX: 0.4, lookY: -0.15 }), face("smug", { lookX: -0.6 }));
// ---- 13 Setty: "Maybe he just forgot. I nudge him up to three times in twenty-four hours." (three nudges in the window)
line(13, face("smug", { lookX: -0.3 }), faceC("thinking", { lookX: 0.5 }), SR);
side(C.clic5 - 0.01, "right", RIGHT);
st.bigDM(R, { id: "nudge", at: C.clic5, out: L[14].t - 0.38, title: "Within 24 hours",
  msgs: [{ me: true, time: "+3 h", text: "still keen? 👀", at: C.clic5 + 0.12 }, { me: true, time: "+9 h", text: "busy week? 😅", at: C.n2 },
    { me: true, time: "+20 h", text: "no rush 🙌", at: C.n3 }] });

// ---- 14 coach: "Okay. How do I get you?" (the music dies: the wide shot, silence, a slow push)
K(L[14].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.12;
  K(L[14].t + 0.02, L[15].t - 0.25 - L[14].t, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k,
    pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[14].t - 0.1, 0.3, faceC("pleading", { lookX: 0.6 }));
K(L[14].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));

// ---- 15 Setty: "The lights are on a motion sensor, bro." (a low shot on the pendants: they go off one by one, far end
// first, a click each) → his face in the dark, lit by the laptop → "You haven't moved since [bleep]ing Tuesday." (Setty in
// the dark) → Fahhh on the coach, he waves both arms at the sensor, the lights come back
const steps = [[0, 1], [C.off1, 1], [C.off1 + 0.04, 0.75], [C.off2, 0.75], [C.off2 + 0.04, 0.5], [C.off3, 0.5], [C.off3 + 0.04, 0.25],
  [C.off4, 0.25], [C.off4 + 0.04, 0], [C.back, 0], [C.back + 0.05, 0.6], [C.back + 0.1, 0.1], [C.back + 0.16, 1]];
const level = (t) => {
  let v = 1;
  for (let k = 0; k < steps.length - 1; k++) {
    const [a, va] = steps[k], [b, vb] = steps[k + 1];
    if (t >= a && t <= b) v = b > a ? va + (vb - va) * ((t - a) / (b - a)) : vb;
    else if (t > b) v = vb;
  }
  return v;
};
// a tween on the pose timeline (seeked right before each render; R.onFrame runs after it, a frame late): the sensor
// level is a pure function of the time, so any frame can be rendered alone
R.act.to({ p: 0 }, { p: 1, duration: L[L.length - 1].end + 3, ease: "none", lazy: false,
  onUpdate() { R.set.power(level(this.time())); } }, 0);
const KEY0 = R.set.key.intensity;
[[C.off1, 1.0], [C.off2, 0.8], [C.off3, 0.6], [C.off4, 0.32]].forEach(([t, k]) => K(t, 0.04, { light: { key: KEY0 * k } }, "none"));
K(C.back + 0.1, 0.08, { light: { key: KEY0 } }, "none");
K(L[15].t - 0.1, 0.25, face("smug", { lookX: -0.7 }));
shotTo(C.lamps - 0.1, "lamps", { dur: 0.14, ease: "power4.out" });
K(C.lamps + 0.05, C.bro - 0.12 - C.lamps, { cam: R.camOf("lamps", { dist: 6.2 }) }, "sine.inOut");
KC(C.off2, 0.2, faceC("shocked", { lookX: 0.2, lookY: 0.5 }), "back.out(2)");
shotTo(C.bro - 0.05, "coach", { dur: 0.12, ease: "power4.out" });
KC(C.bro - 0.1, 0.2, faceC("panic", { lookX: 0.4, lookY: 0.35 }), "back.out(2)");
push(C.bro + 0.08, C.you15 - 0.25, "coach", {}, 0.9);
shotTo(C.you15 - 0.2, "setty", { dur: 0.16, ease: "power4.out" });
push(C.you15 - 0.02, L[15].end + 0.1, "setty", {}, 0.82);
K(C.you15 - 0.05, 0.2, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.5 }), "back.out(2)");
bleep(R.DATA.bleeps[1]);
K(R.DATA.bleeps[1].end + 0.1, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh2, faceC("annoyed", { lookX: 0.5 }));
// he waves both arms at the sensor: the lights come back
KC(C.back - 0.3, 0.16, faceC("panic", { lookX: 0.2, lookY: 0.4, armLr: 2.6, armRr: 2.6, armLf: 0.2, armRf: 0.2, elbowL: 0.4, elbowR: 0.4 }), "power2.out");
KC(C.back - 0.12, 0.12, { armLr: 2.2, armRr: 2.9 }, "sine.inOut");
KC(C.back + 0.02, 0.12, { armLr: 2.9, armRr: 2.2 }, "sine.inOut");
KC(C.back + 0.2, 0.3, faceC("proud", { lookX: 0.5 }));

// ---- 16 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"));
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
