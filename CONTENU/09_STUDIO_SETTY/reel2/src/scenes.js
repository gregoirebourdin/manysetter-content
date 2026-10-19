// Reel 2 "The webinar" (1 min): Setty's acting (K) and the props, line by line. Reference: reel1/src/scenes.js, PROPS.md.
// In scope: R, C (cues), T(i)/E(i), K, face, shake, beat, flash, bg, tl, HOOK, MID, TOP, END, kit.

const WEBINAR_DMS = ["price?", "replay?", "how much?", "is it recorded?", "price??", "info", "link?", "did I miss it?", "PRICE",
  "how much is it", "replay pls", "can u send the replay", "price pls", "payment plan?", "info?", "still available?", "how long is it?",
  "replay??", "cost?", "hi", "price?", "send it", "me!", "how much", "is it worth it?", "replay", "price", "discount?", "info pls",
  "link pls", "price?", "?", "dm me", "how?", "PRICE?", "need this", "replay?", "price!!", "pls", "how much $$"];

// ---- 1-2 hook (signature): close-up smug, censor bar on the insult, whip out, "WEBINAR" slams
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
kit.marquee(R, { text: "WEBINAR", at: C.format - 0.02, out: C.two - 0.12 });

// ---- 3 "Two hours. Twelve people stayed.": LIVE pill, the viewers melt from 347 to 12, Setty bored to death
K(C.two - 0.05, 0.3, { ...face("unimpressed", { lookY: 0.2, lookX: 0 }), lean: 0, turn: 0, dotsBounce: 0, y: -0.1, cam: { z: 13, ly: 0.35 } }, "power2.out");
K(C.hours, 0.6, { lidL: 0.78, lidR: 0.78, lean: 0.14, tilt: 0.08 }, "sine.inOut");
K(C.twelve - 0.03, 0.2, { ...face("sideEye", { lookX: -0.7, lookY: 0.55 }), lean: -0.05, tilt: 0, y: 0 }, "back.out(2)");
K(C.stayed, 0.25, { ...face("unimpressed", { lookX: -0.6, lookY: 0.5, curve: -0.3 }), squash: 0.05 });
kit.livePill(R, { at: C.two - 0.03, out: C.then - 0.1, viewers: { from: 347, to: 12, t0: C.two + 0.15, t1: C.stayed + 0.1 } });

// ---- 4 "Your mom left before the pitch.": a Zoom-style alert under him
K(C.your_mom - 0.05, 0.25, { ...face("excuseMe", { lookX: 0.2, lookY: -0.1 }), turn: 0.08, squash: 0 }, "back.out(2)");
K(C.left, 0.2, { ...face("shocked", { alert: 0, dots: 1, mouthOpen: 0.5, lookY: -0.55, armLr: 0.5, armRr: 0.5 }) }, "back.out(2.5)");
K(C.pitch, 0.25, { ...face("unimpressed", { lookY: -0.4, lookX: 0.1 }) });
kit.toast(R, { id: "t-mom", icon: "log-out", text: "Mom left the webinar", at: C.left - 0.05, out: C.half - 0.08 });

// ---- 5 "Half of them? Camera off. Eating cereal.": camera-off badge, Setty chews
K(C.half - 0.05, 0.25, { ...face("sideEye", { lookX: 0.6, lookY: 0.4 }), turn: -0.1 }, "back.out(2)");
K(C.camera, 0.18, { lidL: 0.45, lidR: 0.45, browLr: -0.25, browRr: 0.25 });
K(C.eating - 0.03, 0.15, { ...face("happy", { mouthOpen: 0.45, teeth: 0.6, lookY: 0.1, lookX: 0 }), squash: -0.05 }, "power2.out");
K(C.eating + 0.17, 0.12, { mouthOpen: 0, curve: 0.4 });
K(C.cereal - 0.02, 0.12, { mouthOpen: 0.45 });
K(C.cereal + 0.14, 0.12, { ...face("unimpressed", { lookX: 0.3 }), squash: 0 });
kit.iconBadge(R, { id: "b-cam", icon: "video-off", at: C.camera - 0.05, wiggle: C.off + 0.05, out: C.then - 0.12 });

// ---- 6 "Then the replay goes out. And your DMs go… "price?"": the DM rain, then a giant "price?"
K(C.then - 0.08, 0.3, { ...face("happy", { lookY: 0.9, lookX: 0, dots: 1, dotsBounce: 0 }), y: 0, turn: 0, cam: MID }, "power2.out");
K(C.dms - 0.05, 0.2, { ...face("shocked", { lookY: 0.6, alert: 0, dots: 1, armLr: 1.6, armRr: 1.6 }) }, "back.out(2)");
K(C.go, 0.25, { lookX: 0.4, lookY: 0 });
K(C.price - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0 }), squash: -0.16, y: 0.25 }, "power4.out");
K(C.price + 0.1, 0.45, { squash: 0, y: 0 }, "elastic.out(1, 0.4)");
shake(C.price, 1.4);
kit.dmRain(R, { texts: WEBINAR_DMS, t0: C.replay - 0.15, spawnEnd: C.price - 0.25, drop: C.send - 0.05, t1: C.another });
kit.giantBubble(R, { text: "price?", at: C.price - 0.06, out: C.send - 0.1 });

// ---- 7 "You send the price. Ghosted.": your DM is "Seen", a ghost flies away
K(C.send - 0.05, 0.3, { ...face("smug", { lookY: -0.5, lookX: 0.2 }), turn: 0.1, y: 0 }, "power2.out");
K(C.ghosted - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0, lookY: 0.8, lookX: 0.5 }), squash: -0.14 }, "power4.out");
K(C.ghosted + 0.12, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
shake(C.ghosted, 1.0);
kit.chatBubbles(R, { id: "c-price", y: 930, items: [{ from: "me", text: "Here's the price + the payment plan 🙏", at: C.send - 0.02, meta: "Seen" }],
  out: C.another - 0.12 });
kit.iconBadge(R, { id: "b-ghost", icon: "ghost", at: C.ghosted - 0.05, out: C.ghosted_end + 0.3, fly: true });
flash(C.ghosted - 0.02, 0.35);

// ---- 8-9 "Another one makes you explain the whole program… "I'll think about it." Never heard from him again."
K(C.another - 0.12, 0.45, { ...face("unimpressed", { lookY: -0.7, lookX: 0 }), turn: 0, cam: TOP }, "expo.inOut");
K(C.explain, 0.3, { ...face("excuseMe", { lookY: -0.65 }) });
K(C.program, 0.25, { lidL: 0.6, lidR: 0.6, lookY: -0.75 });
K(C.think - 0.03, 0.15, { ...face("shocked", { lookY: -0.7, alert: 0, mouthOpen: 0.4 }) }, "back.out(2)");
K(C.never - 0.05, 0.3, { ...face("unimpressed", { lookY: -0.6, lidL: 0.7, lidR: 0.7, curve: -0.2 }) });
K(C.again, 0.3, { lidL: 0.85, lidR: 0.85, lean: 0.1 });
kit.chatBubbles(R, { id: "c-program", y: 670, items: [
  { from: "me", text: "Sure!! 12 weeks. Week 1 your offer, week 2 your content, then DMs, calls, bonuses, payment plans…",
    at: C.explain - 0.05 },
  { from: "lead", text: "I'll think about it 🙏", at: C.think - 0.04, small: true },
  { from: "me", text: "any thoughts? 🙂", at: C.never - 0.04, small: true, meta: "Seen · 3 days ago" },
], out: C.rest - 0.12 });

// ---- 10 "The rest want free coaching. In your DMs. At 1 a.m.": exasperated, then night falls
K(C.rest - 0.1, 0.4, { ...face("excuseMe", { lookY: 0, lookX: 0 }), lean: 0, cam: MID }, "expo.out");
K(C.free, 0.2, { ...face("excuseMe", { armLr: 1.6, armRr: 1.6, armLf: 0.4, armRf: 0.4, curve: -0.5 }), squash: -0.06 }, "back.out(2.5)");
K(C.free + 0.2, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.indms, 0.25, { ...face("sideEye", { lookX: -0.4 }) });
K(C.at1 - 0.25, 0.25, { ...face("unimpressed", { lookY: 0.95, dots: 0 }), cam: MID }, "expo.out");
K(C.one + 0.15, 0.4, { lidL: 0.8, lidR: 0.8, lookY: 0.7 });
kit.nightClock(R, { text: "1:00 AM", size: 210, at: C.at1 - 0.18, blink: C.one + 0.4, out: C.six_line - 0.1 });

// ---- 11 "And the six calls you booked? Zero clients."
K(C.six_line - 0.08, 0.3, { ...face("sideEye", { lookX: 0.3, lookY: -0.4 }), lean: 0.05, cam: MID }, "power2.out");
K(C.booked, 0.2, { ...face("smug", { lookY: -0.4 }) });
K(C.zero - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0, lookY: -0.3 }), squash: -0.14, y: 0.2 }, "power4.out");
K(C.zero + 0.12, 0.45, { squash: 0, y: 0 }, "elastic.out(1, 0.4)");
shake(C.zero, 1.2);
kit.toast(R, { id: "t-calls", icon: "calendar-x", text: "6 calls booked · 0 clients", tone: "red", at: C.six - 0.05, out: C.funnel_line - 0.25 });

// ---- 12 the turn, on black: "That's not a funnel. That's a free consulting hotline."
K(C.funnel_line - 0.2, 0.01, { ...face("excuseMe", { curve: -0.35, lidL: 0.25, lidR: 0.25, armLr: 0.3, armRr: 0.3, armLf: 0, armRf: 0, dots: 0 }),
  y: 0, turn: 0, lean: 0, cam: { z: 10.6, ly: 0.95 }, light: { key: 0.8, rim: 7, red: 1 } }, "none");
K(C.funnel_line, 2.8, { cam: { z: 9.8 } }, "none");
K(C.free2 - 0.05, 0.12, { lidL: 0, lidR: 0, pupil: 0.7, browLy: 0.15, browRy: 0.15 }, "power4.out");
shake(C.free2, 0.9);
K(C.hotline, 0.15, { ...face("shocked", { alert: 1, dots: 0, armLr: 0.4, armRr: 0.4 }), squash: -0.1 }, "power4.out");
K(C.hotline + 0.15, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
shake(C.hotline, 1.6);
kit.blackCut(R, { at: C.funnel_line - 0.2, hide: ["#bg-night"], until: C.plug - 0.15 });
kit.tapes(R, { text: "FREE CONSULTING HOTLINE · OPEN 24/7 · ", t1: C.free2 - 0.06, t2: C.hotline - 0.06, out: C.plug - 0.18 });

// ---- 13 "Plug me into Manychat." (swagger)
K(C.plug - 0.12, 0.3, { ...face("smug", { dots: 1, dotsBounce: 1, armLr: 0.35 }), lean: -0.08, turn: 0.25, cam: MID,
  light: { key: 2.5, rim: 3, red: 0 } }, "expo.out");
K(C.manychat_end - 0.05, 0.2, { ...face("proud", { dots: 1, dotsBounce: 1 }), squash: -0.1, lean: 0 }, "back.out(2)");
K(C.manychat_end + 0.15, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
kit.manychatPlug(R, { at: C.plug - 0.02, connect: C.manychat_end - 0.05, out: C.read - 0.32 });

// ---- 14-19 the flex: Setty goes up, the real app does the talking
K(C.read - 0.15, 0.5, { ...face("smug", { lookY: -0.75, lookX: 0 }), turn: 0, lean: 0, cam: TOP }, "expo.inOut");
K(C.about, 0.25, { ...face("proud", { lookY: -0.6 }) });
K(C.talk, 0.25, { ...face("happy", { lookY: -0.7, lookX: 0.3 }) });
K(C.notbot, 0.2, { ...face("sideEye", { lookY: -0.3, lookX: 0.8 }) });
K(C.onequestion, 0.25, { ...face("smug", { lookY: -0.7, armRr: 1.0, armRf: 0.8 }) });
K(C.wait, 0.25, { ...face("happy", { lookY: -0.75, lidL: 0.3, lidR: 0.3, dots: 1, dotsBounce: 1 }) });
K(C.tire - 0.05, 0.2, { ...face("unimpressed", { lookY: -0.6, lookX: -0.3 }) });
K(C.serious - 0.05, 0.2, { ...face("proud", { lookY: -0.6 }), squash: -0.06 }, "back.out(2)");
K(C.serious + 0.2, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.theyghost - 0.05, 0.2, { ...face("sideEye", { lookY: -0.5, lookX: 0.6 }) });
K(C.followup, 0.25, { ...face("smug", { lookY: -0.7 }) });
K(C.classy - 0.03, 0.2, { ...face("wink", { lookY: -0.2 }) }, "back.out(2)");
K(C.call - 0.02, 0.18, { ...face("laughing"), squash: -0.12 }, "back.out(2.6)");
K(C.call + 0.18, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.calendar2, 0.2, { ...face("proud", { lookY: -0.5 }) });
kit.playbookCard(R, { at: C.read - 0.08, fill: C.read, fillDur: C.offer - C.read + 0.15, chips: C.read + 0.4, learned: C.offer + 0.05,
  out: C.talk - 0.14, page: "yourcoaching.com/webinar" });
kit.dmThread(R, {
  at: C.talk - 0.08, out: C.serious - 0.15, handle: "jess.fitcoach", initials: "JF",
  messages: [
    { lead: "how much is the program?", at: C.talk - 0.02 },
    { typing: true, at: C.talk + 0.2, hide: C.likeyou + 0.1 },
    { setter: "Depends where you're at, honestly. What's the one thing you want fixed first?", at: C.likeyou + 0.1,
      chip: { text: "Sounds like you", tone: "orange", at: C.bot - 0.05 } },
    { typing: true, who: "lead", at: C.wait - 0.05, hide: C.typing_end },
    { lead: "honestly I just want the replay lol", at: C.typing_end + 0.02, scroll: C.wait - 0.25 },
    { setter: "Here it is 🎬 Shout if you want help after.", at: C.replay2 - 0.1, scroll: C.replay2 - 0.3,
      chip: { text: "Replay sent", at: C.replay2 + 0.15 } },
  ],
});
kit.toast(R, { id: "t-serious", icon: "calendar-check", text: "Qualified · calendar sent", tone: "green", y: 880, at: C.calendar1 - 0.05,
  out: C.theyghost - 0.12 });
kit.chatBubbles(R, { id: "c-follow", y: 700, items: [
  { from: "me", text: "Still thinking about it? 🙂", at: C.followup - 0.05, meta: "After 2 hours", small: true },
  { from: "me", text: "Want the replay link again?", at: C.three - 0.05, meta: "After 8 hours", small: true },
  { from: "me", text: "Last one from me: want Thursday's call link?", at: C.max - 0.05, meta: "After 20 hours", small: true },
], out: C.book - 0.15 });
kit.bookedCard(R, { at: C.call - 0.05, out: C.incal - 0.12, detail: "Discovery call · Tue, 10:00 AM<br />Lead summary added" });
kit.confetti(R, { at: C.call });
kit.weekCalendar(R, { at: C.incal - 0.06, drop: C.calendar2, out: C.spicy_line - 0.2 });

// ---- 20 "If it gets spicy, I hand it to you."
K(C.spicy_line - 0.15, 0.4, { ...face("smug", { lookY: 0.3, lookX: 0.5 }), turn: -0.1, cam: MID }, "expo.out");
K(C.spicy - 0.03, 0.2, { ...face("shocked", { alert: 1, dots: 0, mouthOpen: 0.6, lookY: 0.5, lookX: 0.6 }), squash: -0.08 }, "back.out(2)");
K(C.hand, 0.25, { ...face("proud", { armLr: 1.2, armRr: 1.2, armLf: 0.6, armRf: 0.6 }), squash: 0 });
kit.iconBadge(R, { id: "b-flame", icon: "flame", at: C.spicy - 0.06, wiggle: C.spicy + 0.2, out: C.you - 0.2, pos: [790, 100] });
kit.toast(R, { id: "t-hand", icon: "hand", text: "Handed to you", tone: "green", at: C.hand - 0.05, out: C.you - 0.15 });
bg("hot", 0, C.you - 0.2, 0.3);

// ---- 21 the roast: "You? Close the laptop. And put some pants on, you [bleep]ing animal."
K(C.you - 0.15, 0.35, { ...face("smug", { armRr: 1.25, armRf: 1.35, lookX: 0, lookY: 0 }), turn: -0.12, lean: -0.05,
  cam: { z: 11, ly: 1.1, x: 0, lx: 0 } }, "expo.out");
K(C.close, 0.25, { ...face("unimpressed", { lookY: 0.3, lookX: 0.6 }), turn: 0.1, lean: 0.06, armRr: 0.35, armRf: 0 });
K(C.pants_line - 0.05, 0.25, { ...face("sideEye", { lookY: -0.9, lookX: 0 }), lean: 0.05 });
K(C.pants - 0.03, 0.15, { ...face("shocked", { alert: 1, dots: 0, lookY: -0.95, blush: 1.2 }), squash: -0.1 }, "power4.out");
K(C.pants + 0.15, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
shake(C.pants, 0.8);
K(C.animal_you - 0.05, 0.2, { ...face("smug", { lookY: 0, lookX: 0.1 }), turn: 0.15 });
K(C.bleep3 - 0.03, 0.1, { ...face("wink", { censor: 1, tongue: 0 }), squash: 0.05, cam: { z: 10.2 } }, "back.out(3)");
shake(C.bleep3, 0.7);
K(C.bleep3_end + 0.05, 0.1, { censor: 0, tongue: 1, squash: 0 });
kit.iconBadge(R, { id: "b-laptop", icon: "laptop", at: C.close - 0.05, out: C.pants_line - 0.1, pos: [820, 40] });
flash(C.bleep3 - 0.02, 0.4);

// ---- 22 CTA: Comment SETTY (typed once it is said), slide into your DMs, back for the loop
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
