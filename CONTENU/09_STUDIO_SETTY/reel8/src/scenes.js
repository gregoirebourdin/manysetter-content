// Reel 8 "The DM funnel stuck in 2015": a real conversation on a rooftop at sunset (set "rooftop"). He lounges in his
// teak chair, phone in hand, proud of his "link in bio" funnel, and hears himself describe it; Setty sits on the low
// table and takes it apart with the coaches' own words, then the 2026 version comes up because he asks. The camera on
// whoever talks, the other one reacts; cards pop beside the speaker (his 2015 funnel, the chat that went quiet, the
// "hey, you up?", the pipeline, the setter's real answer, the follow-ups).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

// the title's two short lines would reach 120 px and run down to y ≈ 610 (onto the cards, the comment bar): capped at 100
kit.hookTitle(R, { lines: R.DATA.hook_title, max: 100, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, punch, push, CARD_L } = D; // assets/engine/dialogue.js
// the cards sit a little lower than the kit's side() (y -70, not -110): under the title, above the captions
const side = (t, where = "left") => tl.set("#stagebox", { scale: 0.55, x: where === "left" ? -262 : 262, y: -70 }, t);
const CARD_R = { x: 300, dist: 16, y: 880 }; // Setty left of the card, a bit bigger than the kit's framing
// the short chats (2 or 3 bubbles): a narrower card shown at 70 % (42 px text), Setty a little more to the left
const sideBig = (t) => tl.set("#stagebox", { scale: 0.7, x: 254, y: -50 }, t);
const CARD_RB = { x: 270, dist: 16, y: 880 };
const KEY0 = R.set.key.intensity; // the set's key light (dimmed for the dead-serious line)
const fc = (name, extra = {}) => faceC(name, { phone: 1, ...extra }); // he never lets go of his phone
const LEAD = { user: "Jess", color: "#d6249f" }; // demo lead (the carousel's chat), never a client
const PRICE = [{ text: "hey how much is it" }, { me: true, text: "It's $1,500 for the 12 weeks!" }];

// ---- frame 0 (thumbnail): the wide shot, the sun going down, him smug on his phone, Setty smug on the low table
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, fc("smug", { lookX: 0.15, lookY: -0.35 }));

// ---- 0 Setty: "You built your [bleep]ing DM funnel in 2015, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("skeptical", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Bro, it works. I post, link in bio, they ask how much, I tell them, and..." (his funnel ticks itself,
// then "and..." – the music dies, he hears it, the last row is just "hope")
line(1, fc("smug", { lookX: 0.4 }), face("sleepy", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left");
st.checklist(R, { id: "f2015", at: C.clic1, out: L[2].t - 0.3, title: "My DM funnel", appSlug: "instagram",
  items: [{ icon: "video", text: "Post a reel", sub: "it hits", at: C.post },
    { icon: "link", text: "“Link in bio”", sub: "in the caption", at: C.link },
    { icon: "message-circle", text: "“how much?”", sub: "I send the price", at: C.ask }],
  done: { text: "…and hope 🙏", at: C.and } });
KC(C.and - 0.05, 0.4, fc("confused", { lookX: 0.15, lookY: -0.3, nod: 0.05 }), "sine.out");
// ---- 2 Setty, dead serious in the silence: "They didn't say no. They disappeared into the inbox void." (BOOM, music back)
line(2, face("deadpan", { lookX: -0.3, curve: -0.2 }), fc("defeated", { lookX: 0.5 }), CARD_RB);
K(L[2].t - 0.2, 0.35, { light: { key: KEY0 * 0.5 } }, "sine.out"); // the light drops with the music
K(C.boom1, 0.2, { light: { key: KEY0 } }, "power2.out");
sideBig(C.clic2 - 0.01);
st.igDM(R, { id: "void", at: C.clic2, out: L[3].t - 0.38, ...LEAD, w: 760,
  msgs: [{ ...PRICE[0], at: C.clic2 + 0.06 }, { ...PRICE[1], at: C.clic2 + 0.14, seen: { text: "Seen", at: C.clic2 + 0.6 } }] });
punch(C.boom1, 25);
K(C.boom1, 0.25, face("unimpressed", { lookX: -0.5 }), "back.out(2)");
// ---- 3 coach: "Nah, they're just thinking about it."
line(3, fc("skeptical", { lookX: 0.4, armRr: 0.2 }), face("eyeRoll"));
// ---- 4 Setty: "Thinking for two weeks? That's not a lead, that's a missing person." (the same chat, 2 weeks on: MISSING)
line(4, face("excuseMe", { lookX: -0.4 }), fc("annoyed", { lookX: 0.5 }), CARD_RB);
sideBig(C.clic3 - 0.01);
st.igDM(R, { id: "gone", at: C.clic3, out: L[5].t - 0.38, ...LEAD, w: 760, status2: { text: "Active 2w ago", at: C.weeks },
  msgs: [{ ...PRICE[0], at: C.clic3 + 0.06 }, { ...PRICE[1], at: C.clic3 + 0.12, seen: { text: "Seen 2w ago", at: C.clic3 + 0.14 } }],
  stamp: { text: "MISSING", at: C.boom2 + 0.02 } });
punch(C.boom2, 24);
K(C.boom2, 0.25, face("deadpan", { lookX: -0.3 }), "back.out(2)");
// ---- 5 coach: "I follow up, okay? When I remember." (annoyed, then guilty and quieter)
line(5, fc("annoyed", { lookX: 0.5 }), face("sly", { lookX: -0.7 }));
KC(C.when - 0.05, 0.3, fc("pleading", { lookX: 0.3, lookY: -0.25 }));
// ---- 6 Setty roasts: "Three days later, at midnight, "hey, you up?" Like a drunk ex." → Fahhh on the coach
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.3 }), null, CARD_RB);
sideBig(C.clic4 - 0.01);
st.igDM(R, { id: "upp", at: C.clic4, out: C.fahhh1 - 0.32, ...LEAD, w: 760, status: "Active 3d ago",
  msgs: [{ ...PRICE[0], at: C.clic4 + 0.06 }, { ...PRICE[1], at: C.clic4 + 0.12, seen: { text: "Seen", at: C.clic4 + 0.14 } },
    { me: true, text: "hey, you up? 👀", sep: "Thu 11:58 PM", at: C.hey }] });
K(C.hey - 0.05, 0.2, face("sleepy", { lookX: -0.3, armRr: 0.3 }), "sine.out");
K(C.ex - 0.05, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh1, fc("annoyed", { lookX: 0.6 }));
// ---- 7 coach: "If I chase them, I look desperate."
line(7, fc("pleading", { lookX: 0.5 }), face("sideEye", { lookX: -0.6 }));
// ---- 8 Setty: "They slid into your DMs first. That's not chasing, that's answering. Plug me into Manychat." (the pipeline)
line(8, face("sly", { lookX: 0.3 }), fc("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic5 - 0.01, "right");
st.flowPipeline(R, { id: "flow", at: C.clic5, out: L[9].t - 0.38, connect: C.mc - 0.05,
  sources: ["instagram", "whatsapp", "messenger"], pulses: [C.slid, C.answering, C.mc + 0.25] });
K(C.mc, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
// ---- 9 coach: "And you'd say what, link in bio?" (teasing, pointing at him)
line(9, fc("mocking", { lookX: 0.5 }), face("unimpressed", { lookX: -0.6 }));
// ---- 10 Setty: "I answer the real question, in your voice, one question at a time. The right ones get your calendar."
line(10, face("smug", { lookX: 0.3 }), fc("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right");
st.igDM(R, { id: "setter", at: C.clic6, out: L[11].t - 0.38, user: "Marcus", color: "#8b5cf6",
  msgs: [{ text: "how much is it?", at: C.clic6 + 0.06 },
    { me: true, text: "$1,500, or 3 × $550. How many clients do you have now?", at: C.real - 0.05 },
    { text: "3, I want 10 by summer", at: C.time },
    { me: true, text: "Love that. 2 times for you 👇", at: C.right, chip: { text: "Call booked · Thu 2:00 PM", icon: "calendar-check", at: C.calendar } }] });
K(C.calendar, 0.25, face("proud"), "back.out(2)");
// ---- 11 coach: "And when they ghost you?"
line(11, fc("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 12 Setty: "Up to three follow-ups, inside twenty-four hours, and sober." (the follow-ups land, BOOM on "sober.")
line(12, face("smug", { lookX: 0.3 }), fc("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic7 - 0.01, "right");
st.igDM(R, { id: "fu", at: C.clic7, out: L[13].t - 0.38, user: "Dan", color: "#06b6d4",
  msgs: [{ text: "let me think about it", at: C.clic7 + 0.06 },
    { me: true, text: "what's holding you back?", sep: "2 hours later", at: C.three },
    { me: true, text: "want me to hold Thursday?", sep: "9 hours later", at: C.inside },
    { me: true, text: "last one, promise 🙏", sep: "21 hours later", at: C.hours }] });
punch(C.boom3, 25);
K(C.boom3, 0.25, face("wink"), "back.out(2)");
// ---- 13 coach: "Okay, that's 2026. How do I set you up?" (he finally looks up: the wide shot, a slow push)
K(L[13].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[13].t + 0.02, L[13].end - L[13].t + 0.4, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, fc("laughing", { lookX: 0.6 }));
KC(L[13].t + 0.9, 0.3, fc("proud", { lookX: 0.6 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 14 Setty roasts: "First, stop rewatching your own [bleep]ing reel. The sunset's right there." (the sunset behind
// him, the wide, him back on his phone) → Fahhh
// (by hand, not line(): its push would pull the camera back to Setty after the cut to the wide)
shotTo(L[14].t - 0.2, "setty", { dur: 0.28 });
K(L[14].t - 0.2, 0.001, { cam: { fov: 30 } });
push(L[14].t + 0.08, C.sunset - 0.12, "setty", {}, 0.8);
K(L[14].t - 0.12, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), "back.out(1.6)");
const B2 = R.DATA.bleeps[1];
K(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
K(B2.end + 0.05, 0.1, { censor: 0 });
shotTo(C.sunset - 0.08, "wide", { dur: 0.12, ease: "power4.out" });
KC(C.sunset - 0.05, 0.2, fc("smug", { lookX: 0.1, lookY: -0.4 }));
K(C.sunset - 0.05, 0.2, face("eyeRoll"));
reaction(C.fahhh2, fc("annoyed", { lookX: 0.6 }));
// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(15, face("smug", { lookX: 0.2 }), fc("laughing"));
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, fc("smug", { lookX: 0.15, lookY: -0.35 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.9 });
