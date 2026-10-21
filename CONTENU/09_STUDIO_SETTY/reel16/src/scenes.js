// Reel 16 "The $600 setter": a real conversation in a call center's empty open space at dusk (set "callcenter"). The coach
// sits in his setter's task chair (everybody went home), proud of his $600 + 5% deal; Setty, perched on the next
// workstation's partition, asks one question: the lead who asked at 2 p.m. got her answer at 5 p.m. and was gone. The
// coach wants to fire him, Setty defends the setter (the villain is the delay, never the person), then plugs himself in.
// Cards beside the speaker: the deal, her DM, the black slide, not his fault, the same lead answered while she's still
// there, the hand-off, the new math. The punchline cuts to the setter's sticky note ("back tomorrow 9 AM :)").
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const { L, line, reaction, side, punch, push, bleep, ending, CARD_L, CARD_R } = D;
const BIG = { fit: true, scale: 0.62 }; // cards in big type, under the title
const BIGR = { fit: true, scale: 0.7 }; // Setty's light text cards: snug (w 800) and bigger, Setty is small on the left
const SR = { ...CARD_R, dist: 14.5, y: 1000 }; // Setty with a card on his right: a bit smaller, the card clears his head and
// his mouth stays above the captions at the end of the push
/** a slow push on `who` from t0 to t1 that is not cut short by the next line (lines 9 and 10 stay on Setty) */
const glide = (t0, t1, who, shot, k) => {
  const f = R.set.frames[who];
  const { fov, ...cam } = R.camOf(who, { ...shot, dist: (shot.dist ?? f.dist) * k, yaw: (shot.yaw ?? f.yaw) + (who === "coach" ? -0.07 : 0.07) });
  K(t0, t1 - t0, { cam }, "sine.inOut");
};
const [B1, B2, B3] = R.DATA.bleeps;

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

// ---- frame 0 (thumbnail): the wide shot, the coach in his setter's chair, phone in hand, Setty smug on the partition
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("smug", { lookX: 0.5 }));

// ---- 0 Setty: "You pay a [bleep]ing setter six hundred bucks a month, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("proud", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Plus five percent. Best hire ever, bro." (the deal: $600 a month, the pill "+ 5% of sales" on "five")
line(1, faceC("proud", { lookX: 0.4, armRr: 0.3, armRf: 1.1, elbowR: 1.5 }), face("eyeRoll", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left", BIG);
st.priceTag(R, { id: "deal", at: C.clic1, out: L[2].t - 0.38, price: "$600", sub: "a month", ask: { text: "+ 5% of sales", at: C.five1 } });
KC(T(14) - 0.08, 0.25, faceC("hyped", { lookX: 0.4 }), "back.out(2)");

// ---- 2 Setty: "Cool, when did he answer your last lead?"
line(2, face("deadpan", { lookX: -0.5 }), faceC("smug", { lookX: 0.5 }));

// ---- 3 coach: "She asked at two, he answered at five." (her DM: the question, the reply "+3 h", her status turns red), the
// camera stays on him while Setty starts ("By five,"), then goes to Setty on "she": "she was in another coach's DMs." (BOOM)
line(3, faceC("neutral", { lookX: 0.4, armRr: 0.3, armRf: 1.0, elbowR: 1.4 }), face("sideEye", { lookX: -0.6 }), CARD_L);
side(C.clic2 - 0.01, "left", BIG);
const cut4 = C.she4 - 0.12;
st.bigDM(R, { id: "dm", at: C.clic2, out: cut4 - 0.2, user: "jess.fit", color: "#16a34a",
  status2: { text: "Active 3h ago", at: C.five3 + 0.35 },
  msgs: [{ text: "still available?", at: C.asked }, { me: true, time: "+3 h", text: "yes, still open!", at: C.five3 }] });
push(L[4].t - 0.19, cut4 - 0.02, "coach", CARD_L, 0.84);
KC(L[4].t, 0.3, faceC("thinking", { lookX: 0.3, lookY: -0.2 }));
shotTo(cut4, "setty", { dur: 0.16, ease: "power4.out" });
push(cut4 + 0.18, L[4].end + 0.3, "setty", {}, 0.82);
K(cut4, 0.2, face("smug", { lookX: -0.5 }), "back.out(2)");
KC(cut4, 0.3, faceC("defeated", { lookX: 0.4, lookY: -0.2 }));
punch(C.boom1, 24);
K(C.boom1, 0.22, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }), "back.out(2)");

// ---- 5 coach: "Six hundred [bleep]ing bucks for a reply three hours late? I'm firing him." (the black slide)
line(5, faceC("shocked", { lookX: 0.4 }), face("smug", { lookX: -0.6 }), CARD_L);
side(C.clic3 - 0.01, "left", BIG);
st.bigText(R, { id: "turn", at: C.clic3, out: L[6].t - 0.38, lines: [{ text: "$600 a month", at: C.six5 },
  { text: "for a reply", at: C.for5 }, { text: "3 hours late", at: C.three5, mark: { text: "3 hours late", at: C.three5 + 0.08 } }] });
bleep(B2);
KC(C.three5, 0.25, faceC("disgusted", { lookX: 0.4 }), "back.out(2)");
KC(C.firing - 0.12, 0.25, faceC("annoyed", { lookX: 0.4, armRr: 0.9, armRf: 1.2, elbowR: 1.4 }), "back.out(2)");

// ---- 6 Setty: "It's not his fault. Other clients, a life, sleep. Nobody lives in your inbox, not even you." → Fahhh
line(6, face("deadpan", { lookX: -0.4 }), faceC("skeptical", { lookX: 0.5 }), SR);
side(C.clic4 - 0.01, "right", BIGR);
st.bigText(R, { id: "fault", at: C.clic4, out: C.even - 0.32, tone: "light", w: 800, lines: [{ text: "other clients,", at: C.clients },
  { text: "a life,", at: C.life }, { text: "sleep.", at: C.sleep, mark: { text: "sleep.", at: C.sleep + 0.05 } }] });
K(C.nobody - 0.1, 0.25, face("sly", { lookX: -0.5 }));
shotTo(C.even - 0.14, "setty", { dur: 0.22, dist: 8.6, ease: "power3.out" }); // the card is gone: the jab in close-up
K(C.even - 0.1, 0.2, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }), "back.out(2)");
K(L[6].end - 0.1, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.6 }));

// ---- 7 coach: "So I answer them myself, from his desk?" (he glances back at the desk)
line(7, faceC("defeated", { lookX: 0.4, lookY: -0.15 }), face("smug", { lookX: -0.6 }));
KC(C.desk - 0.3, 0.3, faceC("stressed", { lookX: -0.9, headTurn: -0.35 }));

// ---- 8 Setty: "Nope, plug me into Manychat. I answer while she's still in the chat, in your voice." (BOOM; the same lead,
// "Active now": the dots, the reply, one question)
line(8, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), SR);
K(L[8].t - 0.05, 0.2, face("proud", { armRr: 2.2 }), "back.out(2)");
punch(C.boom2, 25);
side(C.clic5 - 0.01, "right", BIG);
st.bigDM(R, { id: "dm2", at: C.clic5, out: L[9].t - 0.3, user: "jess.fit", color: "#16a34a",
  msgs: [{ text: "still available?", at: C.clic5 + 0.12 }, { me: true, text: "yes! what's<br>your goal?", typing: C.plug8, at: C.answer8 }] });

// ---- 9 coach, off screen: "And the tricky ones?" (Setty listens) + 10 Setty: "I hand those to your team, context
// included." (tricky ones? → your team + the context)
glide(L[9].t - 0.15, L[11].t - 0.25, "setty", SR, 0.78);
K(L[9].t - 0.1, 0.25, face("thinking", { lookX: -0.6 }));
KC(L[9].t - 0.1, 0.25, faceC("skeptical", { lookX: 0.5 }));
K(L[10].t - 0.12, 0.25, face("proud", { lookX: -0.3 }), "back.out(1.6)");
side(C.clic6 - 0.01, "right", BIGR);
st.bigText(R, { id: "tricky", at: C.clic6, out: L[11].t - 0.38, tone: "light", w: 800, lines: [{ text: "tricky ones?", at: C.tricky },
  { text: "→ your team", at: C.team, mark: { text: "your team", at: C.team + 0.05 } }, { text: "+ the context", at: C.context }] });

// ---- 11 coach: "And how much are you?" (eyes narrowed)
line(11, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 12 Setty: "A hundred nineteen bucks a month, and I don't take five percent." (the deal's paper tag again, now $119 and
// "no commission"; BOOM on "five")
line(12, face("proud", { lookX: -0.3 }), faceC("shocked", { lookX: 0.5 }), SR);
side(C.clic7 - 0.01, "right", BIG);
st.priceTag(R, { id: "math", at: C.clic7, out: L[13].t - 0.3, price: "$119", sub: "a month", ask: { text: "no commission", at: C.and12 } });
punch(C.boom3, 24);
K(C.boom3, 0.22, face("smug", { lookX: -0.4, armRr: 0.6, armRf: 0.8 }), "back.out(2)");

// ---- 13 coach: "Okay, how do I set you up?" (the music dies: the wide shot, silence, a slow push)
K(L[13].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.12;
  K(L[13].t + 0.02, L[14].t - 0.25 - L[13].t, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k,
    pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, faceC("pleading", { lookX: 0.6 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));

// ---- 14 Setty: "Get out of his [bleep]ing chair, he went home like a normal human." → the sticky note on "he went home"
// → Fahhh on the coach
line(14, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.5 }), faceC("confused", { lookX: 0.5 }));
bleep(B3);
K(B3.end + 0.1, 0.2, face("laughing"), "back.out(2)");
shotTo(C.he14 - 0.08, "note", { dur: 0.001, ease: "none" }); // a hard cut: a 0.14 s move went through the coach's head (MP4, 41.1 s)
{
  const n = R.camOf("note"), k = 0.18; // a slow push toward the note (a set shot: no framing to shrink)
  K(C.he14 + 0.08, L[14].end + 0.02 - C.he14, { cam: { px: n.px + (n.ax - n.px) * k, py: n.py + (n.ay - n.py) * k,
    pz: n.pz + (n.az - n.pz) * k } }, "sine.inOut");
}
reaction(C.fahhh2, faceC("defeated", { lookX: 0.5 }));

// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"));
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
