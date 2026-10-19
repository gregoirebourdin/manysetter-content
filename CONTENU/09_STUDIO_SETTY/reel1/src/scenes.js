// Reel 1 "The challenge": Setty's acting (K = keyframe on his pose / camera / light) and the props, scene by scene.
// In scope (assets/engine/shell.html): R, C (cues from build.py), K, face, shake, beat, flash, bg, tl, HOOK, MID, TOP, END, kit (props).

// ---- S1 hook: close-up smug, swears, whip out on "You did your", CHALLENGE slam
K(0, 0.5, { cam: { z: 8.4 } }, "power2.out");
K(C.hey, 0.18, { browLy: 0.24, browLr: 0.3, lean: -0.05 }, "back.out(3)");
K(C.bleep1 - 0.04, 0.12, { censor: 1, squash: 0.06, cam: { z: 7.8 } }, "back.out(3)");
shake(C.bleep1, 0.6);
K(C.bleep1 + 0.56, 0.1, { censor: 0, squash: 0 });
K(C.youdid - 0.06, 0.32, { ...face("sideEye", { lookX: 0.6, dotsBounce: 1 }), turn: -0.18, cam: MID }, "expo.out");
K(C.bleep2 - 0.03, 0.1, { censor: 1, ...face("smug", { censor: 1 }), turn: 0.1 }, "back.out(3)");
K(C.challenge - 0.02, 0.08, { censor: 0, squash: -0.12 }, "power2.out");
K(C.challenge + 0.08, 0.5, { squash: 0 }, "elastic.out(1, 0.35)");
shake(C.challenge, 1.2);
K(C.right, 0.25, { ...face("smug", { lookX: 0.4 }), lean: 0.1, turn: 0.2 }, "back.out(2)");
kit.marquee(R, { text: "5-DAY CHALLENGE", at: C.challenge - 0.02, out: C.five - 0.12 });

// ---- S2: five days live, voice dead, ring light still on
K(C.five - 0.05, 0.3, { ...face("unimpressed", { lookY: 0.2, lookX: 0 }), lean: 0, turn: 0, dotsBounce: 0, y: -0.1 }, "power2.out");
K(C.days, 0.4, { lidL: 0.62, lidR: 0.62 });
K(C.voice, 0.25, { ...face("unimpressed", { lidL: 0.75, lidR: 0.75, curve: -0.2, lookY: 0 }), lean: 0.12, y: -0.25 });
K(C.dead - 0.02, 0.18, { lidL: 1, lidR: 1, tongue: 1, curve: 0.3, mouthW: 0.8, lean: 0.32, tilt: 0.12, y: -0.45, dots: 0 }, "back.out(2)");
K(C.ring - 0.05, 0.3, { ...face("happy", { lidL: 0.55, lidR: 0.55, slantL: 0.1, slantR: -0.1, lookY: 0.5, curve: 0.2, dots: 0 }),
  lean: 0, tilt: 0, y: 0, squash: -0.08 }, "back.out(2.4)");
K(C.ring + 0.3, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.stillon, 0.2, { lidL: 0.68, lidR: 0.68 });
K(C.stillon + 0.06, 0.08, { lidL: 1, lidR: 1 }, "none");
K(C.stillon + 0.14, 0.12, { lidL: 0.6, lidR: 0.6 });
kit.livePill(R, { at: C.five - 0.03, out: C.andnow - 0.1, days: { t0: C.days, t1: C.live + 0.15, from: 1, to: 5, reset: C.five - 0.04 } });
kit.ecg(R, { at: C.voice - 0.05, dead: C.dead, draw: C.dead - C.voice + 0.1, out: C.ring - 0.1 });
kit.ringLight(R, { at: C.ring - 0.04, flicker: C.ring + 0.24, flashAt: C.ring - 0.02, out: C.andnow - 0.12 });

// ---- S3: 400 DMs rain on Setty (kit.dmRain at the end), then a giant "info?"
K(C.andnow - 0.1, 0.3, { ...face("happy", { lookY: 0.9, lookX: 0, dots: 1, dotsBounce: 0 }), y: 0 });
K(C.four, 0.2, { ...face("shocked", { lookY: 0.6, alert: 0, dots: 1, armLr: 1.6, armRr: 1.6 }) }, "back.out(2)");
K(C.dms, 0.2, { lookY: -0.2, lookX: -0.5, pupil: 0.55 });
K(C.like, 0.25, { lookX: 0.4, lookY: 0 });
K(C.info - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0 }), squash: -0.16, y: 0.25 }, "power4.out");
K(C.info + 0.1, 0.45, { squash: 0, y: 0 }, "elastic.out(1, 0.4)");
shake(C.info, 1.4);
kit.giantBubble(R, { text: "info?", at: C.info - 0.06, flashAt: C.info - 0.04, out: C.answer - 0.1 });

// ---- S4: by hand? at midnight? in bed?
K(C.answer - 0.05, 0.4, { ...face("sideEye", { lookX: 0.25, lookY: -0.05 }), turn: 0.05, cam: { z: 12.2, ly: 0.6 } }, "power2.inOut");
K(C.answer + 0.4, 0.9, { cam: { z: 11.2, ly: 0.75 } }, "none");
K(C.byhand - 0.04, 0.2, { ...face("excuseMe", { armLr: 0.5, armRr: 2.2, armRf: 0.2 }), turn: -0.1 }, "back.out(2.5)");
K(C.midnight - 0.25, 0.25, { ...face("unimpressed", { lookY: 0.95, dots: 0 }), turn: 0, cam: MID }, "expo.out");
K(C.inbed - 0.05, 0.3, { ...face("unimpressed", { lidL: 0.7, lidR: 0.7, lookY: -0.3, lookX: 0.4, dots: 0 }), y: 0.15 }, "power2.out");
kit.iconBadge(R, { icon: "hand", at: C.byhand - 0.02, wiggle: C.hand, out: C.midnight - 0.28 });
kit.nightClock(R, { text: "00:00", at: C.midnight - 0.22, night: C.midnight - 0.28, blink: C.midnight + 0.35, out: C.inbed - 0.1 });
kit.bed(R, { at: C.inbed - 0.08 });

// ---- S5: hard cut to black, hostage situation
K(C.business - 0.2, 0.01, { ...face("excuseMe", { curve: -0.35, lidL: 0.25, lidR: 0.25, armLr: 0.3, armRr: 0.3, armLf: 0, armRf: 0, dots: 0 }),
  y: 0, turn: 0, lean: 0, cam: { z: 10.6, ly: 0.95 }, light: { key: 0.8, rim: 7, red: 1 } }, "none");
K(C.business, 2.6, { cam: { z: 9.8 } }, "none");
K(C.hostage - 0.05, 0.12, { lidL: 0, lidR: 0, pupil: 0.7, browLy: 0.15, browRy: 0.15 }, "power4.out");
shake(C.hostage, 0.9);
K(C.situation, 0.15, { ...face("shocked", { alert: 1, dots: 0, armLr: 0.4, armRr: 0.4 }), squash: -0.1 }, "power4.out");
K(C.situation + 0.15, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
shake(C.situation, 1.6);
kit.blackCut(R, { at: C.business - 0.2, hide: ["#bed", "#bg-night"], until: C.plug - 0.15, flashAt: C.plug - 0.12 });
kit.tapes(R, { text: "HOSTAGE SITUATION · DO NOT CROSS · ", t1: C.hostage - 0.06, t2: C.situation - 0.06, out: C.plug - 0.18 });

// ---- S6: plug me into Manychat (swagger)
K(C.plug - 0.12, 0.3, { ...face("smug", { dots: 1, dotsBounce: 1, armLr: 0.35 }), lean: -0.08, turn: 0.25, cam: MID,
  light: { key: 2.5, rim: 3, red: 0 } }, "expo.out");
K(C.manychat, 0.2, { ...face("proud", { dots: 1, dotsBounce: 1 }), squash: -0.1, lean: 0 }, "back.out(2)");
K(C.manychat + 0.2, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
kit.manychatPlug(R, { at: C.plug - 0.02, cable: C.plug + 0.05, connect: C.manychat, out: C.learn - 0.2 });

// ---- S7: the flex (Setty goes up, the app does the talking)
K(C.learn - 0.15, 0.5, { ...face("smug", { lookY: -0.75, lookX: 0 }), turn: 0, cam: TOP }, "expo.inOut");
K(C.talk, 0.25, { ...face("happy", { lookY: -0.7, lookX: 0.3 }) });
K(C.illthink, 0.2, { ...face("sideEye", { lookY: -0.6, lookX: -0.2 }) });
K(C.andbook, 0.25, { ...face("smug", { lookY: -0.65 }) });
K(C.call, 0.18, { ...face("laughing"), squash: -0.12 }, "back.out(2.6)");
K(C.call + 0.18, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.calendar, 0.2, { ...face("proud", { lookY: -0.5 }) });
kit.playbookCard(R, { at: C.learn - 0.08, fill: C.learn, fillDur: C.offer - C.learn + 0.15, chips: C.learn + 0.15, learned: C.offer + 0.12,
  out: C.talk - 0.14 });
kit.dmThread(R, {
  at: C.talk - 0.08, out: C.call - 0.22, handle: "sarah.mindset", initials: "SM",
  messages: [
    { lead: "how much is the program?", at: C.talk - 0.02 },
    { typing: true, at: C.talk + 0.22, hide: C.likeyou - 0.2 },
    { setter: "Depends where you're at, honestly. What's the one result you want in the next 90 days?", at: C.likeyou - 0.2,
      chip: { text: "Sounds like you", tone: "orange", at: C.likeyou + 0.05 } },
    { lead: "I'll think about it", at: C.illthink - 0.03, scroll: C.illthink - 0.2 },
    { typing: true, at: C.illthink + 0.4, hide: C.thinkend + 0.02 },
    { setter: "Totally fair. What would you need to know to feel sure?", at: C.thinkend + 0.02, scroll: C.thinkend - 0.05,
      chip: { text: "Qualified", tone: "green", dot: true, at: C.andbook } },
  ],
});
kit.bookedCard(R, { at: C.call - 0.05, flashAt: C.call - 0.03, out: C.inyour - 0.12 });
kit.confetti(R, { at: C.call });
kit.weekCalendar(R, { at: C.inyour - 0.06, drop: C.calendar, out: C.you - 0.2 });
bg("hot", 0, C.you - 0.2, 0.3);

// ---- S8: You? Go to sleep. You look like [bleep].
K(C.you - 0.15, 0.35, { ...face("smug", { armRr: 1.25, armRf: 1.35, lookX: 0, lookY: 0 }), turn: -0.12, lean: -0.05,
  cam: { z: 11, ly: 1.1, x: 0, lx: 0 } }, "expo.out");
K(C.gosleep, 0.25, { ...face("unimpressed", { lookY: 0.2, lookX: 0.6 }), turn: 0.1, lean: 0.06 });
K(C.youlook, 0.2, { ...face("smug", { lookX: 0.1 }), turn: 0.15 });
K(C.bleep3 - 0.03, 0.1, { ...face("wink", { censor: 1, tongue: 0 }), squash: 0.05, cam: { z: 10.2 } }, "back.out(3)");
shake(C.bleep3, 0.7);
K(C.bleep3 + 0.32, 0.1, { censor: 0, tongue: 1, squash: 0 });
kit.moonZzz(R, { at: C.gosleep - 0.03, out: C.youlook - 0.08 });
flash(C.bleep3 - 0.02, 0.4);

// ---- S9: Comment SETTY, slide into your DMs, back for the loop
K(C.comment - 0.1, 0.35, { ...face("happy", { lookY: -0.7, armRr: 0.4 }), turn: 0, lean: 0, cam: MID }, "expo.out");
K(C.setty + 0.25, 0.2, { ...face("wink") }, "back.out(2)");
K(C.slide - 0.05, 0.36, { x: 6.5, lean: -0.35, squash: 0.08, ...face("smug") }, "power3.in");
K(C.slide + 0.36, 0.01, { x: -6.5, lean: 0.35, cam: { z: 14, ly: 1.05, x: 0, lx: 0 } }, "none");
K(C.slide + 0.55, 0.5, { x: 0, lean: 0, squash: 0, ...face("smug", { lookX: 0.2 }) }, "back.out(1.6)");
K(C.end + 0.5, 0.2, { ...face("wink") }, "back.out(2)");
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty - 0.02, send: C.setty + 0.38, out: C.slide - 0.1 });
kit.notification(R, { title: "setty", text: "slid into your DMs", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.32, bounce: C.end + 0.6 });

// ---- the DM rain of S3, built last: it draws from the shared random stream after the confetti
kit.dmRain(R, { t0: C.four - 0.15, spawnEnd: C.info - 0.25, drop: C.answer - 0.05, t1: C.midnight });
