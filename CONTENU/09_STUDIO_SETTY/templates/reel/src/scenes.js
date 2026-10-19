// Setty's acting (K = keyframe on his pose / camera / light) and what the stage shows, line by line.
// Stage layout (CLAUDE.md § 4): hook title on top, the stage in the middle (st.*: real tools, diagrams), captions,
// Setty small at the bottom hopping between SPOT.L / C / R. Every reel gets its OWN stage visuals for its subject.
// Reference: reel2/src/scenes.js · catalogue: PROPS.md.
// In scope: R, C (cues), T(i)/E(i), K, face, shake, beat, flash, bg, tl, SPOT, STAGE (camera), kit, st.

const { L, R: RIGHT } = SPOT;
const look = (x, y) => ({ lookX: x, lookY: y }); // lookY > 0: up at the stage

// ---- the hook title, fixed for the whole reel: one sentence that says the subject, the key word in *orange*
kit.hookTitle(R, { lines: ["Your <subject> is over.", "Your *DMs* just started."], pulses: [C.format] });

// ---- the stage camera: on each key word, push toward the element that proves it, pull back before the next module
// zoom(C.word - 0.05, { to: [x, y], s: 1.35, dur: 0.2 });  unzoom(C.next - 0.12, 0.2);  drift(C.word, { to, s: 1.08, dur: 1.4 });

// ---- hook (no "Hey [bleep]."): the stage already shows the subject at frame 0 (at: 0), Setty smug at the bottom
// st.zoomWebinar(R, { id: "zoom", at: 0, out: …, … })   ← pick the module that fits THIS reel's subject
K(C.youdid, 0.18, { browLy: 0.24, browLr: 0.3, lean: -0.05, ...look(0.15, 0.2) }, "back.out(3)");   // straight at the viewer
K(C.bleep2 - 0.03, 0.1, { censor: 1, ...face("smug", { censor: 1, ...look(0.1, 0.2) }), squash: 0.08 }, "back.out(3)");
shake(C.bleep2, 0.5);
beat.hop(C.format - 0.3, RIGHT, { dur: 0.3 });
K(C.format - 0.02, 0.08, { censor: 0, squash: -0.14, armLr: 1.9, armLf: 0.5 }, "power2.out"); // points at the stage
K(C.format + 0.08, 0.5, { squash: 0 }, "elastic.out(1, 0.35)");
shake(C.format, 0.9);
K(C.right, 0.25, { ...face("smug", look(-0.4, 0.4)), armLr: 0.35, armLf: 0, lean: 0.08 }, "back.out(2)");

// ---- the pain, made physical and REAL on the stage (Instagram inbox, a chat, Calendly, a lock screen…), Setty hopping
// ---- the turn (black + a stage moment), the flex in the real ManySetter UI (kit.playbookCard, kit.dmThread, st.flowPipeline…)
// ---- the roast: a short push-in, K(t, 0.3, { cam: { z: 21, ly: 4.1 } }), the third censor bar, then back to cam: STAGE

// ---- CTA: Comment SETTY (typed once it is said), Setty slides out and back, the DM lands
K(C.comment - 0.12, 0.35, { ...face("happy", { ...look(0, 0.8), armRr: 0.4 }), turn: 0, cam: STAGE }, "expo.out");
K(C.setty + 0.25, 0.2, { ...face("wink") }, "back.out(2)");
K(C.slide - 0.05, 0.36, { x: 6.5, lean: -0.35, squash: 0.08, ...face("smug") }, "power3.in");
K(C.slide + 0.36, 0.01, { x: -6.5, lean: 0.35 }, "none");
K(C.slide + 0.55, 0.5, { x: 0, lean: 0, squash: 0, ...face("smug", look(0.2, 0.3)) }, "back.out(1.6)");
K(C.end + 0.5, 0.2, { ...face("wink") }, "back.out(2)");
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.04, step: 0.05,
  send: C.setty_end + 0.34, out: C.slide - 0.1 });
kit.notification(R, { title: "setty", text: "slid into your DMs", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.32 });
