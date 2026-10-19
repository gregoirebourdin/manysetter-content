// Reel 2 "The webinar" (1 min), stage layout (Grégoire 19/10): the hook title fixed on top, the coaches' real tools in the
// middle, Setty small at the bottom hopping corner to corner. Kit: assets/engine/stage.js (st.*), props.js (kit.*), PROPS.md.
// In scope: R, C (cues), T(i)/E(i), K, face, shake, beat, flash, bg, tl, SPOT, STAGE (camera), kit, st.

const { L, R: RIGHT } = SPOT;
const look = (x, y) => ({ lookX: x, lookY: y });

// ---- the hook title, on screen for the whole reel (and on the thumbnail)
kit.hookTitle(R, { lines: ["Your webinar is over.", "Your *DMs* just started."],
  pulses: [C.format, C.dms, C.price, C.hotline, C.manychat_end, C.setty] });

// ---- the stage camera: push toward what matters on each key word, pull back between (rhythm). Points in screen px.
zoom(C.format - 0.02, { to: [540, 840], s: 1.12, dur: 0.12 });
unzoom(C.right + 0.15, 0.3);
zoom(C.twelve - 0.05, { to: [420, 1098], s: 1.45, dur: 0.25 });          // the participant count: 12
unzoom(C.your_mom - 0.1);
zoom(C.left - 0.05, { to: [850, 760], s: 1.3 });                          // Mom's tile, the Zoom toast
unzoom(C.half - 0.05);
zoom(C.camera - 0.05, { to: [380, 830], s: 1.18, dur: 0.3 });            // the cameras off
zoom(C.cereal - 0.05, { to: [540, 943], s: 1.5, dur: 0.2 });              // Tom and his cereal
unzoom(C.then - 0.12, 0.2);
drift(C.replay, { to: [540, 700], s: 1.08, dur: 1.4 });                   // the inbox fills up
zoom(C.price - 0.05, { to: [500, 682], s: 1.35, dur: 0.14 });             // "price?"
unzoom(C.send - 0.12, 0.2);
zoom(C.ghosted - 0.05, { to: [930, 846], s: 1.5, dur: 0.16 });            // "Seen"
unzoom(C.another - 0.12, 0.2);
zoom(C.explain, { to: [700, 840], s: 1.12, dur: 1.2, ease: "sine.inOut" }); // the wall of text keeps coming
zoom(C.think - 0.05, { to: [260, 969], s: 1.45, dur: 0.16 });             // "I'll think about it"
zoom(C.never + 0.3, { to: [900, 1111], s: 1.5, dur: 0.3 });               // "Seen 3 days ago"
unzoom(C.rest - 0.12, 0.2);
zoom(C.at1 - 0.05, { to: [540, 730], s: 1.35, dur: 0.25 });               // 1:00 AM
unzoom(C.six_line - 0.12, 0.2);
zoom(C.zero + 0.3, { to: [930, 1083], s: 1.6, dur: 0.22 });               // $0
unzoom(C.funnel_line - 0.2, 0.12);
drift(C.free2, { to: [540, 780], s: 1.1, dur: 1.6 });                     // the neon
unzoom(C.plug - 0.15, 0.15);
zoom(C.manychat_end - 0.05, { to: [700, 840], s: 1.25, dur: 0.18 });      // ManySetter plugs in
unzoom(C.read, 0.3);
zoom(C.offer + 0.05, { to: [820, 640], s: 1.3, dur: 0.2 });               // "Learned"
unzoom(C.talk - 0.12, 0.2);
zoom(C.bot - 0.05, { to: [840, 900], s: 1.25, dur: 0.2 });                // "Sounds like you"
unzoom(C.onequestion, 0.25);
zoom(C.typing - 0.1, { to: [250, 960], s: 1.3, dur: 0.25 });              // they're typing…
unzoom(C.tire - 0.15, 0.2);
zoom(C.serious + 0.05, { to: [820, 840], s: 1.2, dur: 0.25 });            // the serious lane
unzoom(C.theyghost - 0.15, 0.2);
drift(C.followup, { to: [540, 800], s: 1.08, dur: 1.2 });
zoom(C.max - 0.05, { to: [830, 700], s: 1.3, dur: 0.2 });                 // the last follow-up
unzoom(C.book - 0.15, 0.2);
zoom(C.summary - 0.05, { to: [540, 930], s: 1.35, dur: 0.3 });            // the lead summary
unzoom(C.spicy_line - 0.15, 0.2);
zoom(C.spicy - 0.05, { to: [240, 890], s: 1.45, dur: 0.16 });             // 🔥 Upset
zoom(C.hand - 0.05, { to: [430, 890], s: 1.45, dur: 0.25 });              // Handed to you
unzoom(C.you - 0.15, 0.2);
zoom(C.laptop - 0.05, { to: [540, 820], s: 1.15, dur: 0.15 });            // the lid shuts
zoom(C.pants - 0.06, { to: [540, 785], s: 1.35, dur: 0.18 });             // 👖
unzoom(C.animal_you - 0.1, 0.25);

// ---- 1-2 hook: Setty smug at the bottom, the Zoom webinar already live above him
st.zoomWebinar(R, {
  id: "zoom", at: 0, out: C.then - 0.1, title: "How I got 10 clients in 30 days", timer: "01:58:42",
  tiles: [
    { name: "Sarah K.", emoji: "😴", bg: "linear-gradient(#3a3f58, #23263a)" },
    { name: "mike_trains", ini: "MT", mic: false },
    { name: "Mom ❤️", emoji: "👩‍🦳", bg: "linear-gradient(#5a3b2e, #2f1f18)" },
    { name: "jess.fitcoach", ini: "JF", mic: false },
    { name: "Tom", emoji: "🥣", bg: "linear-gradient(#2e4a3b, #1b2c23)" },
    { name: "Amy", emoji: "🙂", bg: "linear-gradient(#4b3a5c, #2a2035)" },
  ],
  viewers: { from: 347, to: 12, t0: C.two + 0.1, t1: C.stayed + 0.15 },
  drop: [{ tile: 0, at: C.hours }, { tile: 5, at: C.twelve + 0.1 }],
  leave: { tile: 2, toast: "Mom left the webinar", at: C.left - 0.05, out: C.half - 0.1 },
  spot: [{ tile: 3, at: C.camera - 0.05, until: C.eating - 0.1 }, { tile: 1, at: C.off - 0.05, until: C.eating - 0.1 },
    { tile: 4, at: C.eating - 0.05, until: C.then - 0.15 }],
});
K(C.hey, 0.18, { browLy: 0.24, browLr: 0.3, lean: -0.05, ...look(0.2, 0.3) }, "back.out(3)");
K(C.bleep1 - 0.04, 0.12, { censor: 1, squash: 0.08 }, "back.out(3)");
shake(C.bleep1, 0.5);
K(C.bleep1_end + 0.1, 0.1, { censor: 0, squash: 0 });
beat.hop(C.youdid - 0.1, RIGHT, { dur: 0.4 });
K(C.youdid + 0.3, 0.2, { ...face("sideEye", { ...look(-0.8, 0.7), dotsBounce: 1 }) });
K(C.bleep2 - 0.03, 0.1, { censor: 1, ...face("smug", { censor: 1, ...look(-0.6, 0.6) }) }, "back.out(3)");
K(C.format - 0.02, 0.08, { censor: 0, squash: -0.14, armLr: 1.9, armLf: 0.5 }, "power2.out"); // points at the webinar
K(C.format + 0.08, 0.5, { squash: 0 }, "elastic.out(1, 0.35)");
shake(C.format, 0.9);
flash(C.format - 0.02, 0.3);
K(C.right, 0.25, { ...face("smug", look(-0.4, 0.4)), armLr: 0.35, armLf: 0, lean: 0.08 }, "back.out(2)");

// ---- 3 "Two hours. Twelve people stayed.": the room empties, Setty bored to death
K(C.two, 0.3, { ...face("unimpressed", look(-0.5, 0.6)), lean: 0, dotsBounce: 0 });
K(C.hours, 0.7, { lidL: 0.8, lidR: 0.8, lean: 0.16, tilt: 0.1, y: -0.05 }, "sine.inOut");
K(C.twelve - 0.03, 0.2, { ...face("sideEye", look(-0.8, 0.75)), lean: -0.05, tilt: 0, y: 0 }, "back.out(2)");
K(C.stayed, 0.25, { ...face("unimpressed", { ...look(-0.6, 0.6), curve: -0.3 }), squash: 0.05 });

// ---- 4 "Your mom left before the pitch.": the Zoom toast, Setty jumps to the other corner, shocked
beat.hop(C.your_mom - 0.2, L, { dur: 0.38 });
K(C.left, 0.2, { ...face("shocked", { alert: 0, dots: 1, mouthOpen: 0.5, ...look(0.5, 0.8), armLr: 0.6, armRr: 0.6 }) }, "back.out(2.5)");
K(C.pitch, 0.25, { ...face("unimpressed", look(0.5, 0.6)) });

// ---- 5 "Half of them? Camera off. Eating cereal.": the cameras-off tiles light up, Tom and his cereal
K(C.half - 0.05, 0.25, { ...face("sideEye", look(0.8, 0.7)), turn: 0.15 }, "back.out(2)");
K(C.camera, 0.18, { lidL: 0.45, lidR: 0.45, browLr: -0.25, browRr: 0.25 });
K(C.eating - 0.03, 0.15, { ...face("happy", { mouthOpen: 0.45, teeth: 0.6, ...look(0.5, 0.6) }), squash: -0.05 }, "power2.out");
K(C.eating + 0.17, 0.12, { mouthOpen: 0, curve: 0.4 });
K(C.cereal - 0.02, 0.12, { mouthOpen: 0.45 });
K(C.cereal + 0.14, 0.12, { ...face("unimpressed", look(0.4, 0.5)), squash: 0, turn: 0 });

// ---- 6 "Then the replay goes out. And your DMs go… "price?"": the Instagram inbox floods
const DM = [["sarah.k", "price?"], ["coach.amy", "replay?"], ["mike_trains", "how much is it"], ["tom.lifts", "is it recorded?"],
  ["nina.coach", "price??"], ["dan.fitpro", "info"], ["lisa_mindset", "did I miss it?"], ["mark.ceo", "payment plan?"],
  ["jules.yoga", "replay pls"], ["ben.runs", "how much $$"], ["kim.biz", "still available?"], ["jess.fitcoach", "price?"]];
const COL = ["#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444", "#10b981", "#ec4899", "#3b82f6", "#f97316", "#14b8a6", "#a855f7", "#eab308", "#d6249f"];
st.igInbox(R, {
  id: "inbox", at: C.then - 0.05, out: C.send - 0.12,
  rows: DM.map(([u, m], k) => ({ u, m, c: COL[k], hot: k === DM.length - 1 })),
  times: DM.map((_, k) => C.replay - 0.1 + Math.pow(k / (DM.length - 1), 0.8) * (C.price - 0.05 - (C.replay - 0.1))),
  requests: { from: 3, to: 148, t0: C.replay - 0.1, t1: C.price },
});
beat.hop(C.then - 0.15, 0, { dur: 0.4 });
K(C.dms - 0.05, 0.2, { ...face("shocked", { ...look(0, 0.9), alert: 0, dots: 1, armLr: 1.6, armRr: 1.6 }) }, "back.out(2)");
K(C.go, 0.25, { lookX: 0.3, lookY: 0.7 });
K(C.price - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0, ...look(0, 0.8) }), squash: -0.16, y: 0.35 }, "power4.out");
K(C.price + 0.12, 0.45, { squash: 0, y: 0 }, "elastic.out(1, 0.4)");
shake(C.price, 0.8);

// ---- 7 "You send the price. Ghosted.": the chat, "Seen", a ghost flies off
st.igChat(R, {
  id: "chat1", at: C.send - 0.1, out: C.another - 0.12, user: "jess.fitcoach", color: "#d6249f",
  msgs: [
    { text: "price?", at: C.send - 0.05 },
    { me: true, text: "Here's the price + the payment plan 🙏", at: C.send + 0.2, seen: { text: "Seen", at: C.ghosted - 0.12 } },
  ],
});
kit.iconBadge(R, { id: "b-ghost", icon: "ghost", at: C.ghosted - 0.05, out: C.ghosted_end + 0.3, fly: true, pos: [790, 560] });
K(C.send - 0.05, 0.3, { ...face("smug", look(0.3, 0.7)), turn: 0.1 }, "power2.out");
K(C.ghosted - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0, ...look(0.8, 0.9) }), squash: -0.14 }, "power4.out");
K(C.ghosted + 0.12, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");

// ---- 8-9 the wall of text, "I'll think about it.", seen three days ago
st.igChat(R, {
  id: "chat2", at: C.another - 0.1, out: C.rest - 0.12, user: "mike_trains", color: "#06b6d4", status: "Active 3d ago",
  msgs: [
    { text: "how does the program work? 🤔", at: C.another - 0.02 },
    { me: true, big: true, at: C.explain - 0.05,
      text: "Sure!! 12 weeks. Week 1 your offer, week 2 your content, then the DMs, weekly calls, templates, bonuses, payment plans, lifetime access…" },
    { text: "I'll think about it 🙏", at: C.think - 0.04, typing: { at: C.then2 - 0.25, until: C.think - 0.04 } },
    { me: true, text: "any thoughts? 🙂", at: C.never - 0.04, seen: { text: "Seen 3 days ago", at: C.never + 0.35 } },
  ],
});
beat.hop(C.another - 0.15, RIGHT, { dur: 0.4 });
K(C.explain, 0.3, { ...face("excuseMe", look(-0.6, 0.8)) });
K(C.program, 0.25, { lidL: 0.6, lidR: 0.6 });
K(C.think - 0.03, 0.15, { ...face("shocked", { ...look(-0.6, 0.8), alert: 0, mouthOpen: 0.45 }) }, "back.out(2)");
K(C.never - 0.05, 0.3, { ...face("unimpressed", { ...look(-0.5, 0.6), lidL: 0.7, lidR: 0.7, curve: -0.2 }) });
K(C.again, 0.35, { lidL: 0.88, lidR: 0.88, lean: 0.12, y: -0.08 });

// ---- 10 "The rest want free coaching. In your DMs. At 1 a.m.": night, the lock screen keeps lighting up
bg("night", 1, C.rest - 0.12, 0.3);
bg("#glow", 0.3, C.rest - 0.12, 0.3);
st.lockScreen(R, {
  id: "lock", at: C.rest - 0.1, out: C.six_line - 0.12, time: "1:00", date: "Tuesday, October 21",
  notifs: [
    { app: "instagram", who: "jess.fitcoach", text: "can u look at my funnel real quick? 🙏", at: C.free - 0.1 },
    { app: "whatsapp", who: "Mike", text: "what would you do in my case?", at: C.indms - 0.1 },
    { app: "messenger", who: "Tom", text: "quick question about my offer…", at: C.at1 - 0.15 },
    { app: "instagram", who: "amy.coaching", text: "can I ask you a few things? 😅", at: C.one + 0.15 },
  ],
});
beat.hop(C.rest - 0.25, L, { dur: 0.4 });
K(C.free, 0.2, { ...face("excuseMe", { armLr: 1.6, armRr: 1.6, armLf: 0.4, armRf: 0.4, curve: -0.5, ...look(0.4, 0.6) }), squash: -0.06 }, "back.out(2.5)");
K(C.free + 0.2, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.indms, 0.25, { ...face("sideEye", look(0.7, 0.7)) });
K(C.at1 - 0.1, 0.3, { ...face("unimpressed", { ...look(0.3, 0.5), dots: 0, lidL: 0.75, lidR: 0.75 }) });
K(C.one + 0.15, 0.35, { mouthOpen: 0.7, mouthRound: 1, lidL: 0.95, lidR: 0.95 });   // a yawn
K(C.am_end + 0.1, 0.3, { mouthOpen: 0, mouthRound: 0, lidL: 0.7, lidR: 0.7 });

// ---- 11 "And the six calls you booked? Zero clients.": Calendly, every call, its fate, and the total
bg("night", 0, C.six_line - 0.15, 0.25);
bg("#glow", 1, C.six_line - 0.15, 0.25);
st.calendlyEvents(R, {
  id: "events", at: C.six_line - 0.1, out: C.funnel_line - 0.25, rowAt: C.six_line + 0.05,
  rows: [
    { day: "MON", date: "20", time: "9:00 – 9:30am", who: "Jess F." }, { day: "MON", date: "20", time: "2:00 – 2:30pm", who: "Mike T." },
    { day: "TUE", date: "21", time: "10:00 – 10:30am", who: "Tom R." }, { day: "WED", date: "22", time: "11:00 – 11:30am", who: "Amy L." },
    { day: "THU", date: "23", time: "4:00 – 4:30pm", who: "Ben S." }, { day: "FRI", date: "24", time: "9:30 – 10:00am", who: "Kim P." },
  ],
  status: [["No-show", "red"], ["No-show", "red"], ["Not a fit", "grey"], ["“I'll think about it”", "amber"], ["No budget", "grey"], ["No-show", "red"]]
    .map(([text, tone], k) => ({ row: k, text, tone, at: C.zero - 0.15 + k * 0.07 })),
  total: { label: "Closed this week", value: "$0", at: C.zero + 0.35 },
});
K(C.six_line, 0.25, { ...face("sideEye", look(0.6, 0.6)), lean: 0.05 });
K(C.booked, 0.2, { ...face("smug", look(0.5, 0.6)) });
K(C.zero - 0.03, 0.12, { ...face("shocked", { alert: 1, dots: 0, ...look(0.4, 0.7) }), squash: -0.14, y: 0.3 }, "power4.out");
K(C.zero + 0.12, 0.45, { squash: 0, y: 0 }, "elastic.out(1, 0.4)");
shake(C.zero, 0.8);

// ---- 12 the turn: black, then the neon switches on: "That's a free consulting hotline."
bg("black", 1, C.funnel_line - 0.2, 0.08);
bg("#glow", 0, C.funnel_line - 0.2, 0.08);
beat.hop(C.funnel_line - 0.35, 0, { dur: 0.3, h: 0.6 });
K(C.funnel_line - 0.05, 0.2, { ...face("excuseMe", { curve: -0.35, lidL: 0.25, lidR: 0.25, armLr: 0.3, armRr: 0.3, armLf: 0, armRf: 0, dots: 0, ...look(0, 0.2) }),
  light: { key: 0.8, rim: 7, red: 1 } });
st.neonSign(R, { id: "neon", at: C.free2 - 0.12, out: C.plug - 0.18, lines: ["FREE CONSULTING", "HOTLINE"], sub: "OPEN 24/7", flicker: [C.hotline + 0.35] });
K(C.free2 - 0.05, 0.12, { lidL: 0, lidR: 0, pupil: 0.7, browLy: 0.15, browRy: 0.15, ...look(0, 0.8) }, "power4.out");
K(C.hotline, 0.15, { ...face("shocked", { alert: 1, dots: 0, armLr: 0.4, armRr: 0.4, ...look(0, 0.8) }), squash: -0.1 }, "power4.out");
K(C.hotline + 0.15, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
shake(C.hotline, 1.0);
bg("black", 0, C.plug - 0.15, 0.2);
bg("#glow", 1, C.plug - 0.15, 0.2);
flash(C.plug - 0.12, 0.6, 0.2);

// ---- 13 "Plug me into Manychat.": the product in one picture (your DMs → Manychat → ManySetter → a booked call)
st.flowPipeline(R, { id: "flow", at: C.plug - 0.05, out: C.about - 0.25, connect: C.manychat_end - 0.05,
  pulses: [C.manychat_end + 0.25, C.manychat_end + 0.55, C.manychat_end + 0.85, C.manychat_end + 1.15] });
beat.hop(C.plug - 0.1, RIGHT, { dur: 0.36 });
K(C.plug + 0.3, 0.3, { ...face("smug", { dots: 1, dotsBounce: 1, ...look(-0.6, 0.8) }), light: { key: 2.5, rim: 3, red: 0 } }, "expo.out");
K(C.manychat_end - 0.05, 0.2, { ...face("proud", { dots: 1, dotsBounce: 1, ...look(-0.5, 0.7) }), squash: -0.1, armRr: 2.4 }, "back.out(2)");
K(C.manychat_end + 0.15, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");

// ---- 14-15 the real ManySetter app: the Playbook learns the offer, then a DM in your voice, one question, waits for the typing
kit.playbookCard(R, { at: C.about - 0.1, fill: C.about, fillDur: C.offer - C.about + 0.15, chips: C.about + 0.3, learned: C.offer + 0.05,
  out: C.talk - 0.14, page: "yourcoaching.com/webinar" });
kit.dmThread(R, {
  at: C.talk - 0.08, out: C.tire - 0.15, handle: "jess.fitcoach", initials: "JF",
  messages: [
    { lead: "how much is the program?", at: C.talk - 0.02 },
    { typing: true, at: C.talk + 0.2, hide: C.likeyou + 0.1 },
    { setter: "Depends where you're at, honestly. What's the one thing you want fixed first?", at: C.likeyou + 0.1,
      chip: { text: "Sounds like you", tone: "orange", at: C.bot - 0.05 } },
    { typing: true, who: "lead", at: C.wait - 0.05, hide: C.typing_end },
    { lead: "honestly I just want the replay lol", at: C.typing_end + 0.02, scroll: C.wait - 0.25 },
  ],
});
K(C.about, 0.25, { ...face("proud", look(-0.5, 0.8)) });
K(C.talk, 0.25, { ...face("happy", look(-0.6, 0.8)) });
K(C.notbot, 0.2, { ...face("sideEye", look(-0.9, 0.1)), turn: -0.2 });          // offended, to the viewer
beat.hop(C.onequestion - 0.15, L, { dur: 0.36 });
K(C.onequestion + 0.25, 0.25, { ...face("smug", { ...look(0.6, 0.8), armRr: 2.6 }) });  // one finger up
K(C.wait, 0.25, { ...face("happy", { ...look(0.6, 0.8), lidL: 0.3, lidR: 0.3, dots: 1, dotsBounce: 1 }), armRr: 0.35 });

// ---- 16 "Tire-kickers get the replay. The serious ones get your calendar.": the sorter
st.leadSorter(R, {
  id: "sort", at: C.tire - 0.12, out: C.theyghost - 0.15,
  left: { title: "Tire-kickers", sub: "get the replay", tile: "🎬" },
  right: { title: "Serious", sub: "get your Calendly", tile: "calendly" },
  leads: [
    { u: "jess.fitcoach", m: "just want the replay lol", c: "#d6249f", side: "l", at: C.tire },
    { u: "coach.amy", m: "is there a free version?", c: "#8b5cf6", side: "l", at: C.tire + 0.38 },
    { u: "dan.fitpro", m: "I'm in. When can we talk?", c: "#10b981", side: "r", at: C.serious },
    { u: "nina.coach", m: "budget's ready, let's go", c: "#f97316", side: "r", at: C.serious + 0.4 },
  ],
});
beat.hop(C.tire - 0.2, 0, { dur: 0.36 });
K(C.tire + 0.2, 0.25, { ...face("unimpressed", look(-0.7, 0.8)), turn: -0.15 });
K(C.serious - 0.05, 0.2, { ...face("proud", look(0.7, 0.8)), turn: 0.15, squash: -0.06 }, "back.out(2)");
K(C.serious + 0.2, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");

// ---- 17 "They ghost? I follow up. Three times, max. Classy.": the 24-hour window
st.followTimeline(R, {
  id: "fu", at: C.theyghost - 0.1, out: C.book - 0.15, fillTo: C.classy,
  marks: [
    { h: 2, text: "Still thinking about it? 🙂", at: C.followup - 0.05 },
    { h: 8, text: "Want the replay link again?", at: C.three - 0.05 },
    { h: 20, text: "Last one from me: want Thursday's call link?", at: C.max - 0.05 },
  ],
});
beat.hop(C.theyghost - 0.2, L, { dur: 0.36 });
K(C.followup, 0.25, { ...face("smug", look(0.5, 0.8)), turn: 0.1 });
K(C.classy - 0.03, 0.2, { ...face("wink", look(0.1, 0.2)), turn: 0 }, "back.out(2)");

// ---- 18 "And I book the call. With a summary. In your calendar.": the Calendly confirmation, the lead summary
st.calendlyConfirm(R, {
  id: "booked", at: C.book - 0.1, out: C.spicy_line - 0.15, who: "Dan", when: "Tue, Oct 21 · 10:00 – 10:30 AM",
  summaryAt: C.summary - 0.05, step: 0.3,
  summary: ["Runs webinars, wants 10 clients a month", "Budget: yes · ready to start in November", "Objection: time, answered"],
});
kit.confetti(R, { at: C.call, x: 540, y: 640 });
beat.hop(C.book - 0.2, RIGHT, { dur: 0.36 });
K(C.call - 0.02, 0.18, { ...face("laughing"), squash: -0.12 }, "back.out(2.6)");
K(C.call + 0.18, 0.45, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.summary, 0.25, { ...face("proud", look(-0.6, 0.8)) });

// ---- 19 "If it gets spicy, I hand it to you.": the ManySetter inbox, the lead gets upset, handed to you
st.handoffCard(R, { id: "handoff", at: C.spicy_line - 0.1, out: C.you - 0.15, user: "nina.coach", color: "#f97316",
  text: "wait, why is it SO expensive?? 😤", tagAt: C.spicy - 0.05, handAt: C.hand - 0.05 });
K(C.spicy - 0.03, 0.2, { ...face("shocked", { alert: 1, dots: 0, mouthOpen: 0.6, ...look(-0.6, 0.8) }), squash: -0.08 }, "back.out(2)");
K(C.hand, 0.25, { ...face("proud", { armLr: 1.2, armRr: 1.2, armLf: 0.6, armRf: 0.6, ...look(0, 0.3) }), squash: 0 });

// ---- 20 the roast: close the laptop (it shuts), put some pants on (they drop), you [bleep]ing animal (Setty pushes in)
st.laptopClose(R, { id: "laptop", at: C.you - 0.12, close: C.laptop - 0.05, out: C.comment - 0.15, drop: { emoji: "👖", at: C.pants - 0.06 } });
beat.hop(C.you - 0.3, 0, { dur: 0.36 });
K(C.you + 0.1, 0.3, { ...face("smug", { armRr: 1.25, armRf: 1.35, ...look(0, 0) }), turn: -0.12 }, "expo.out");   // points at you
K(C.close, 0.25, { ...face("unimpressed", look(0.3, 0.8)), armRr: 0.35, armRf: 0, turn: 0.1 });
K(C.pants - 0.03, 0.15, { ...face("shocked", { alert: 1, dots: 0, ...look(0, 0.9), blush: 1.2 }), squash: -0.1 }, "power4.out");
K(C.pants + 0.15, 0.4, { squash: 0 }, "elastic.out(1, 0.4)");
K(C.animal_you - 0.1, 0.3, { ...face("smug", look(0.1, 0)), turn: 0.1, cam: { z: 21, ly: 4.1 } }, "expo.out");   // the push-in
K(C.bleep3 - 0.03, 0.1, { ...face("wink", { censor: 1, tongue: 0 }), squash: 0.05 }, "back.out(3)");
shake(C.bleep3, 0.6);
K(C.bleep3_end + 0.05, 0.1, { censor: 0, tongue: 1, squash: 0 });
flash(C.bleep3 - 0.02, 0.35);

// ---- 21 CTA: Comment SETTY (typed once it is said), Setty slides out and back, the DM lands
K(C.comment - 0.12, 0.35, { ...face("happy", { ...look(0, 0.8), armRr: 0.4 }), turn: 0, cam: STAGE }, "expo.out");
K(C.setty + 0.25, 0.2, { ...face("wink") }, "back.out(2)");
K(C.slide - 0.05, 0.36, { x: 6.5, lean: -0.35, squash: 0.08, ...face("smug") }, "power3.in");
K(C.slide + 0.36, 0.01, { x: -6.5, lean: 0.35 }, "none");
K(C.slide + 0.55, 0.5, { x: 0, lean: 0, squash: 0, ...face("smug", look(0.2, 0.3)) }, "back.out(1.6)");
K(C.end + 0.5, 0.2, { ...face("wink") }, "back.out(2)");
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end - 0.05, step: 0.05,
  send: C.setty_end + 0.28, out: C.slide - 0.1 });
kit.notification(R, { title: "setty", text: "slid into your DMs", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.32 });
