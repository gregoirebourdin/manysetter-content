// Setty's acting (K = keyframe on his pose / camera / light) and the props, scene by scene.
// Recipe: CLAUDE.md § 5 · props and their sounds: PROPS.md · reel1/src/scenes.js is the full reference.
// In scope: R, C (cues), T(i)/E(i) (start/end of word i), K, face, shake, beat, flash, bg, tl, HOOK, MID, TOP, END, kit.

// ---- S1 hook (signature): close-up smug, censor bar on the insult, whip out on "You did your", slam on the format
K(0, 0.5, { cam: { z: 8.4 } }, "power2.out");
K(C.hey, 0.18, { browLy: 0.24, browLr: 0.3, lean: -0.05 }, "back.out(3)");
K(C.bleep1 - 0.04, 0.12, { censor: 1, squash: 0.06, cam: { z: 7.8 } }, "back.out(3)");
shake(C.bleep1, 0.6);
K(C.bleep1_end + 0.1, 0.1, { censor: 0, squash: 0 });
K(C.youdid - 0.06, 0.32, { ...face("sideEye", { lookX: 0.6, dotsBounce: 1 }), turn: -0.18, cam: MID }, "expo.out");
K(C.bleep2 - 0.03, 0.1, { censor: 1, ...face("smug", { censor: 1 }), turn: 0.1 }, "back.out(3)");
K(C.format - 0.02, 0.08, { censor: 0, squash: -0.12 }, "power2.out");
K(C.format + 0.08, 0.5, { squash: 0 }, "elastic.out(1, 0.35)");
shake(C.format, 1.2);
K(C.right, 0.25, { ...face("smug", { lookX: 0.4 }), lean: 0.1, turn: 0.2 }, "back.out(2)");
kit.marquee(R, { text: "THE FORMAT", at: C.format - 0.02, out: C.right_end + 0.3 }); // the coach's format, in capitals

// ---- S2: the pain, made physical (3–4 short images; something changes every 0.5–0.8 s)
//   kit.livePill · kit.ecg · kit.ringLight · kit.dmRain (Setty in MID) · kit.giantBubble · kit.iconBadge · kit.nightClock · kit.bed

// ---- S3: the turn, a dead-serious one-liner on black (and M.drone in audio.py)
//   K(at, 0.01, { ...face("excuseMe", {...}), cam: { z: 10.6, ly: 0.95 }, light: { key: 0.8, rim: 7, red: 1 } }, "none");
//   kit.blackCut(R, { at, until }); kit.tapes(R, { text, t1, t2, out });

// ---- S4: the flex, "Plug me into Manychat." + 3 true product facts in the real UI (Setty goes up: cam TOP)
//   kit.manychatPlug · kit.playbookCard · kit.dmThread · kit.bookedCard + kit.confetti · kit.weekCalendar; bg("hot", 0, end, 0.3)

// ---- S5: the roast, with the third bleep
//   K(C.bleep3 - 0.03, 0.1, { ...face("wink", { censor: 1, tongue: 0 }), squash: 0.05, cam: { z: 10.2 } }, "back.out(3)");
//   shake(C.bleep3, 0.7); K(<end of the word> + 0.05, 0.1, { censor: 0, tongue: 1, squash: 0 }); flash(C.bleep3 - 0.02, 0.4);

// ---- S6 CTA: Comment SETTY (typed once it is said), slide into your DMs, back for the loop (frame 0 is the close-up)
K(C.comment - 0.1, 0.35, { ...face("happy", { lookY: -0.7, armRr: 0.4 }), turn: 0, lean: 0, cam: MID }, "expo.out");
K(C.setty + 0.25, 0.2, { ...face("wink") }, "back.out(2)");
K(C.slide - 0.05, 0.36, { x: 6.5, lean: -0.35, squash: 0.08, ...face("smug") }, "power3.in");
K(C.slide + 0.36, 0.01, { x: -6.5, lean: 0.35, cam: END }, "none");
K(C.slide + 0.55, 0.5, { x: 0, lean: 0, squash: 0, ...face("smug", { lookX: 0.2 }) }, "back.out(1.6)");
K(C.end + 0.5, 0.2, { ...face("wink") }, "back.out(2)");
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end - 0.05, step: 0.05,
  send: C.setty_end + 0.28, out: C.slide - 0.1 });
kit.notification(R, { title: "setty", text: "slid into your DMs", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.32 });
