// {{REEL}}: a conversation in a 3D set (layout "set"). The camera goes to whoever talks (D.line), the other one reacts,
// cards pop beside the speaker (D.side + an st.* module), BOOMs punch in (D.punch), the roasted one gets the camera for
// the "Fahhh" (D.reaction). Scope: R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const { L, line, reaction, side, punch, CARD_L, CARD_R } = D;

kit.hookTitle(R, { lines: R.DATA.hook_title || ["Your hook,", "the *key* word in orange."], pulses: [C.drop] });

// ---- frame 0 (thumbnail): the wide shot, both characters in their mood
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));

// ---- the hook (Setty): a slow push from the wide, a punch onto Setty, the censor bar, BOOM + the drop after it
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- the middle: one line() per line (speaker face, listener face, framing); a card: side() + a module + CARD_L/CARD_R
// line(1, faceC("hyped", { lookX: 0.5 }), face("sleepy", { lookX: -0.6 }));
// line(3, faceC("panic", { phone: 1 }), face("sly"), CARD_L); side(C.clic1 - 0.01, "left"); st.igInbox(R, { … });
// punch(C.boom1);
// line(6, face("mocking", { armRr: 1.3, armRf: 1.0 }), null); reaction(C.fahhh1, faceC("annoyed"));

// ---- the CTA (Setty): wink, the comment bar types SETTY, back to the wide (loops to frame 0)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"));
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.free - 0.4 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
