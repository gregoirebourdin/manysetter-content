// Reel 9 "ChatGPT or Claude": a real conversation in the coach's podcast studio (set "podcast", the evening). He hosts
// his show, phone in hand, and opens a debate: ChatGPT or Claude, who's the better setter? Setty, on a stool across the
// table at his own mic, judges it round by round and flips it: the coach copies every DM in and pastes every reply back,
// so the setter is still him. The camera on whoever talks, the other one reacts; cards pop beside the speaker (the live
// debate board, the copy-paste loop, everything around the model, the setter inside Manychat).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.tie, C.boom1, C.boom2, C.setty] });

const { L, line, reaction, side, punch, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const fc = (name, extra = {}) => faceC(name, { phone: 1, ...extra }); // his phone never leaves his hand
const ROUND1 = { label: "Round 1 · the reply", at: 0, result: { text: "TIE", at: 0, tone: "grey" } };
const DEBATE = { show: "Scale Talk", left: "ChatGPT", right: "Claude" };
const LEAD = { user: "jess.fit", color: "#d6249f", dm: "how much is the program?", reply: "Depends on your goal! What are you training for?" };

// ---- frame 0 (thumbnail): the wide shot, ON AIR lit, the coach at his mic, phone in hand, Setty smug on his stool
R.place({ ...face("smug", { lookX: -0.2, dotsBounce: 1 }) });
Object.assign(R.Q, fc("hyped", { mouthOpen: 0.25, lookX: 0.15 }));

// ---- 0 Setty: "You asked ChatGPT to be your [bleep]ing setter, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("shocked", { lookX: 0.15 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Bro, we're on air. Okay, ChatGPT or Claude, who's the better setter?" (hushed, then the host voice: the board)
line(1, fc("stressed", { lookX: 0.15, lookY: -0.1 }), face("sly", { lookX: -0.15 }), CARD_L);
KC(C.gpt - 0.15, 0.25, fc("hyped", { lookX: 0.1, armLr: 0.6, armLf: 1.1 }), "back.out(2)");
side(C.clic1 - 0.01, "left");
st.duel(R, { id: "d1", at: C.clic1, out: L[2].t - 0.38, ...DEBATE });
// ---- 2 Setty: "Round one, writing the reply. Both are great, it's a tie." (round 1 on the board, TIE)
line(2, face("deadpan", { lookX: -0.15 }), fc("proud", { lookX: 0.15 }), CARD_R);
side(C.clic2 - 0.01, "right");
st.duel(R, { id: "d2", at: C.clic2, out: L[3].t - 0.3, ...DEBATE, checks: C.great,
  rows: [{ ...ROUND1, at: C.clic2 + 0.25, result: { text: "TIE", at: C.tie - 0.28, tone: "grey" } }] });
// ---- 3 coach: "See, AI does my DMs now." (proud, he waves his phone)
line(3, fc("smug", { lookX: 0.15, armRr: 0.3, armRf: 1.4, elbowR: 1.9 }), face("eyeRoll"));
// ---- 4 Setty: "Round two, who reads the DM?" (round 2 on the board, two question marks)
line(4, face("sly", { lookX: -0.15 }), fc("smug", { lookX: 0.15 }), CARD_R);
side(C.clic3 - 0.01, "right");
st.duel(R, { id: "d3", at: C.clic3, out: L[5].t - 0.3, ...DEBATE, checks: 0,
  rows: [ROUND1, { label: "Round 2 · the DM", at: C.clic3 + 0.15, result: { text: "?", at: C.clic3 + 0.5, tone: "grey" } }] });
// ---- 5 coach: "Me, I copy it in." (the loop: the DM copied, pasted into the assistant, it answers)
line(5, fc("proud", { lookX: 0.15, armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookY: -0.25 }), face("deadpan", { lookX: -0.15 }), CARD_L);
side(C.clic4 - 0.01, "left");
st.copyPaste(R, { id: "cp1", at: C.clic4, out: L[6].t - 0.25, ...LEAD, times: { copy: C.clic4 + 0.1, paste: C.copy + 0.2, reply: C.copy + 0.4 },
  count: { from: 0, to: 1, t0: C.copy + 0.2, t1: C.copy + 0.45 } });
// ---- 6 Setty: "And who sends the reply?"
line(6, face("deadpan", { lookX: -0.15, lidL: 0.45, lidR: 0.45 }), fc("thinking", { lookX: 0.15 }));
// ---- 7 coach: "Me again, I paste it back." (the reply copied back into the DM; he slows down: he gets it)
line(7, fc("confused", { lookX: 0.15, armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookY: -0.25 }), face("sly", { lookX: -0.15 }), CARD_L);
side(C.clic5 - 0.01, "left");
st.copyPaste(R, { id: "cp2", at: C.clic5, out: L[8].t - 0.25, ...LEAD, times: { copy: 0, paste: 0, reply: 0, copy2: C.again, send: C.paste + 0.12 },
  count: { from: 1, to: 2, t0: C.paste + 0.12, t1: C.paste + 0.4 } });
KC(C.back, 0.4, fc("defeated", { lookX: 0.15, nod: 0.05 }));
// ---- 8 Setty roasts: "So the setter is you. You're a human clipboard with a podcast." (round 2: YOU) → Fahhh on the coach
line(8, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0 }), null, CARD_R);
side(C.clic6 - 0.01, "right");
st.duel(R, { id: "d4", at: C.clic6, out: C.fahhh1 - 0.3, ...DEBATE, checks: 0,
  rows: [ROUND1, { label: "Round 2 · the DM", at: 0, result: { text: "YOU 📋", at: C.you8, tone: "orange" } }] });
K(C.podcast - 0.05, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh1, fc("annoyed", { lookX: 0.15 }));
// ---- 9 coach: "Okay, so who wins, ChatGPT or Claude?"
line(9, fc("annoyed", { lookX: 0.15, armLr: 0.5, armLf: 1.1 }), face("smug", { lookX: -0.15 }));
// ---- 10 Setty: "Whoever wins, you're still the setter." (dead serious: the lights drop, a slow push, BOOM on "setter")
line(10, face("deadpan", { lookX: -0.05, lidL: 0.3, lidR: 0.3, curve: -0.1 }), fc("shocked", { lookX: 0.15 }), { dist: 8.6 });
K(L[10].t - 0.1, 0.35, { light: { key: R.set.key.intensity * 0.35, rim: R.set.rim.intensity * 0.5 } }, "power2.out");
K(L[11].t - 0.25, 0.3, { light: { key: R.set.key.intensity, rim: R.set.rim.intensity } }, "power2.out");
punch(C.boom1, 24);
// ---- 11 coach: "Then what's a real setter?"
line(11, fc("skeptical", { lookX: 0.15 }), face("smug", { lookX: -0.15 }));
// ---- 12 Setty: "Everything around the model. Your offer, your voice, waiting till they're done typing, one question at a
// time, booking, follow-ups." (each item pops on its word)
line(12, face("proud", { lookX: -0.1 }), fc("thinking", { lookX: 0.15 }), CARD_R);
side(C.clic7 - 0.01, "right");
st.checklist(R, { id: "ck", at: C.clic7, out: L[13].t - 0.38, title: "Around the model", appSlug: "manysetter",
  items: [{ icon: "file-text", text: "Your offer", sub: "and your voice", at: C.offer },
    { icon: "message-circle", text: "Waits", sub: "till they're done typing", at: C.typing },
    { icon: "messages-square", text: "One question", sub: "at a time", at: C.one },
    { icon: "calendar-check", text: "Books the call", sub: "and follows up", at: C.booking }] });
// ---- 13 coach roasts Setty: "And you do all that, little bubble?" → Fahhh on Setty (offended)
line(13, fc("mocking", { lookX: 0.15 }), face("unimpressed", { lookX: -0.15 }));
reaction(C.fahhh2, face("excuseMe", { lookX: -0.15 }), "setty");
// ---- 14 Setty: "Little? My own setting model, years of setting work, right inside your Manychat, so nobody pastes
// anything." (the setter inside Manychat: the reply lands in the DM by itself, 0 copy-paste, BOOM on "anything")
line(14, face("excuseMe", { lookX: -0.15 }), fc("skeptical", { lookX: 0.15 }), CARD_R);
K(C.own - 0.1, 0.3, face("proud", { lookX: -0.1 }), "back.out(2)");
side(C.clic8 - 0.01, "right");
st.copyPaste(R, { id: "cp3", at: C.clic8, out: L[15].t - 0.3, ...LEAD, times: { send: C.nobody }, count: { from: 0, to: 0, t0: 0, t1: 1 },
  setter: { name: "ManySetter", sub: "in Manychat", notes: [{ icon: "sparkles", text: "Its own setting model", at: C.own },
    { icon: "badge-check", text: "Years of setting work", at: C.years }] } });
punch(C.boom2, 25);
K(C.boom2, 0.25, face("smug", { armRr: 2.2, lookX: -0.1 }), "back.out(2)");
// ---- 15 coach: "Okay, okay. How do I set you up?" (the music dies: the wide shot, silence, a slow push)
K(L[15].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[15].t + 0.02, L[15].end - L[15].t + 0.5, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[15].t - 0.1, 0.3, fc("pleading", { lookX: 0.15, lookY: -0.1 }));
K(L[15].t + 0.3, 0.3, face("sly", { lookX: -0.15 }));
// ---- 16 Setty roasts: "Stop recording first, your listeners heard all that [bleep]." (cut to the ON AIR box on
// "listeners", back to Setty for the bleep) → Fahhh on the coach, in panic
line(16, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.15 }), null);
// the camera tweens stay back to back (each one overrides the line's push while it runs, so no gap lets it snap back)
const AIR = { px: 0, py: 5.95, pz: 5.7, ax: 0, ay: 5.95, az: -3.3, fov: 30 };
const B2 = R.DATA.bleeps[1];
K(C.listeners - 0.08, 0.12, { cam: AIR }, "power4.out");
K(C.listeners + 0.04, B2.t - 0.34 - C.listeners, { cam: { ...AIR, pz: 4.9 } }, "sine.inOut");
tl.to(R.set.lights.onAir, { intensity: 16, duration: 0.08, yoyo: true, repeat: 3, lazy: false }, C.listeners);
shake(C.listeners, 0.6);
shotTo(B2.t - 0.3, "setty", { dur: 0.12, ease: "power4.out" });
D.push(B2.t - 0.18, L[16].end + 0.1, "setty", {}, 0.85);
K(B2.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B2.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B2.end + 0.08, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh3, fc("panic", { sweat: 1, lookX: 0.15 }));
// ---- 17 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(17, face("smug", { lookX: -0.1 }), fc("laughing"), { y: 980, dist: 12 }); // lower: the comment bar sits above his head
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.2 }));
KC(C.dms_end + 0.2, 0.4, fc("hyped", { mouthOpen: 0.25, lookX: 0.15 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
