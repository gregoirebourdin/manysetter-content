// {{REEL}}: a conversation in a 3D set (layout "set"). The camera goes to whoever talks (D.line), the other one reacts,
// cards pop beside the speaker (D.side + an st.* module), BOOMs punch in (D.punch), the roasted one gets the camera for
// the "Fahhh" (D.reaction). Scope: R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.
const { L, line, reaction, side, punch, bleep, cut, ending, CARD_L, CARD_R } = D;

kit.hookTitle(R, { lines: R.DATA.hook_title || ["Your hook,", "the *key* word in orange."], pulses: [C.drop] });

// ---- frame 0 (thumbnail): the wide shot, both characters in their mood
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));

// ---- the hook (Setty): a slow push from the wide, a punch onto Setty, the censor bar, BOOM + the drop after it
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1); // the censor bar on whoever says it (Setty or the coach)
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- the middle: one line() per line (speaker face, listener face, framing); a card: side() + a module + CARD_L/CARD_R.
// Cards in big type, under the title whatever its height: side(t, "left", { fit: true, scale: 0.62 }); a card stays 2.5 s
// at least, leaves before the camera changes speaker (out: L[k + 1].t - 0.38), never on a face nor in the captions.
// line(1, faceC("hyped", { lookX: 0.5 }), face("sleepy", { lookX: -0.6 }));
// line(3, faceC("panic", { phone: 1 }), face("sly"), CARD_L); side(C.clic1 - 0.01, "left", { fit: true }); st.igInbox(R, { … });
// punch(C.boom1);
// line(6, face("mocking", { armRr: 1.3, armRf: 1.0 }), null); reaction(C.fahhh1, faceC("annoyed"));
// a bleep in the middle: bleep(R.DATA.bleeps[1]); a hard cut to another shot: cut(C.bench, "coach", { dist: 21 }) (never a 0.001 s shotTo)

// ---- the CTA (Setty), then the common ending (dialogue.js): wink on "free", the comment bar types SETTY under the title,
// back to the wide (loops to frame 0), the notification between the title and the heads, the end pill
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"));
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
