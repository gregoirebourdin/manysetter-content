// Reel 3 "Claude on WhatsApp": a real conversation in the coach's gym (set "gym", Miami in the morning). He sits on his
// bench, phone in hand, proud of his Sunday hack; Setty sits on a plyo box next to him and takes it apart with three true
// facts. The camera on whoever talks, the other one reacts; cards pop beside the speaker (the real tutorial, his WhatsApp,
// WhatsApp's terms, the project's own README, the pipeline, the hand-off).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const fc = (name, extra = {}) => faceC(name, { phone: 1, ...extra }); // he never lets go of his phone

// ---- frame 0 (thumbnail): the wide shot, the coach proud of his setup, phone in hand, Setty smug on his box
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, fc("proud", { lookX: 0.5 }));

// ---- 0 Setty: "You plugged [bleep]ing Claude into your WhatsApp, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, fc("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "All Sunday, bro. GitHub, QR code, config file. AI answers my leads now." (the tutorial, step by step)
line(1, fc("hyped", { lookX: 0.4 }), face("sleepy", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left");
st.checklist(R, { id: "steps", at: C.clic1, out: L[2].t - 0.38, title: "Claude + WhatsApp", appSlug: "whatsapp",
  items: [{ icon: "github", text: "whatsapp-mcp", sub: "the free project on GitHub", at: C.gh },
    { icon: "qr-code", text: "Scan the QR code", sub: "with your phone", at: C.qr },
    { icon: "file-code", text: "Add it to Claude", sub: "claude_desktop_config.json", at: C.cfg }],
  done: { text: "AI answers my leads", at: C.ai } });
// ---- 2 Setty: "Cool. Who's answering them right now?"
line(2, face("deadpan", { lookX: -0.7 }), fc("proud", { lookX: 0.4 }));
// ---- 3 coach: "Claude, obviously."
line(3, fc("smug", { lookX: 0.4 }), face("sly", { lookX: -0.7 }));
// ---- 4 Setty: "Claude's on your laptop. At home. Closed." (the laptop, the lid shuts on "Closed.", BOOM)
line(4, face("deadpan", { lookX: -0.4 }), fc("confused", { lookX: 0.5 }), CARD_R);
side(C.clic2 - 0.01, "right");
st.laptopClose(R, { id: "laptop", at: C.clic2, close: C.boom1 - 0.12, out: L[5].t - 0.38, drop: { emoji: "💤", at: C.boom1 + 0.12 },
  chat: { app: "Claude", msg: "reply to my WhatsApp leads", input: "Reply to Claude…" } });
punch(C.boom1, 25);
// ---- 5 coach: "Wait, it doesn't reply by itself?" (his WhatsApp: the chats pile up, unread)
line(5, fc("confused", { armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookY: -0.3 }), face("sly", { lookX: -0.7 }), CARD_L);
side(C.clic3 - 0.01, "left");
const WA = [["Jess", "how much is the program?"], ["Marcus", "are you still taking clients?"], ["Ana", "hello??"],
  ["Dan", "can we talk today?"], ["Tom", "price pls 🙏"], ["Mike", "still there?"]];
const COL = ["#d6249f", "#8b5cf6", "#10b981", "#06b6d4", "#f97316", "#ef4444"];
st.waChats(R, { id: "wa", at: C.clic3, out: L[6].t - 0.38, rows: WA.map(([u, m], k) => ({ u, m, c: COL[k], n: 1 + (k % 3), time: "8:1" + k })),
  times: WA.map((_, k) => C.clic3 + 0.1 + k * ((L[5].end - C.clic3 - 0.1) / WA.length)), unread: { from: 3, to: 27, t0: C.clic3, t1: L[5].end } });
// ---- 6 Setty roasts: "Only when you open it and ask. That's not a setter, that's an intern." → Fahhh on the coach
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0 }), null);
reaction(C.fahhh1, fc("annoyed", { lookX: 0.6 }));
// ---- 7 coach: "Fine, I'll bring the laptop to the gym."
line(7, fc("annoyed", { lookX: 0.5 }), face("eyeRoll"));
// ---- 8 Setty: "Bring WhatsApp's terms too. No auto-messaging, or they can suspend your account." (the real terms)
line(8, face("sly", { lookX: -0.3 }), fc("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic4 - 0.01, "right");
st.docQuote(R, { id: "terms", at: C.clic4, out: L[9].t - 0.38, source: "WhatsApp Terms of Service", sub: "whatsapp.com/legal", appSlug: "whatsapp",
  text: "…impermissible communications such as bulk messaging, auto-messaging (…) we may take action with respect to your account, including disabling or suspending your account.",
  marks: [{ text: "auto-messaging", at: C.auto }, { text: "disabling or suspending your account", at: C.suspend }] });
// ---- 9 coach: "Holy [bleep], my whole business is on that number." (panic, sweat, BOOM on "number.")
line(9, fc("panic", { sweat: 1, armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookX: 0.2 }), face("deadpan", { lookX: -0.7 }));
const B2 = R.DATA.bleeps[1];
KC(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
KC(B2.end + 0.05, 0.1, { censor: 0 });
punch(C.boom2, 24);
// ---- 10 Setty roasts: "Also, it reads every chat. Your clients, your mom, your ex." (the README's own warning) → Fahhh
line(10, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.3 }), null, CARD_R);
side(C.clic5 - 0.01, "right");
st.docQuote(R, { id: "readme", at: C.clic5, out: C.fahhh2 - 0.32, source: "whatsapp-mcp · README.md", sub: "github.com", srcIcon: "github",
  badge: { text: "Caution" }, text: "As with many MCP servers, the WhatsApp MCP is subject to the lethal trifecta. (…) could lead to private data exfiltration.",
  marks: [{ text: "private data exfiltration", at: C.every }] });
K(C.ex - 0.05, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh2, fc("shocked", { lookX: 0.5 }));
// ---- 11 coach: "Bro, I'm not a developer. I just want my DMs handled."
line(11, fc("defeated", { nod: 0.06, lookY: -0.15, bend: 0.06 }), face("sly", { lookX: -0.7 }));
// ---- 12 Setty: "Then plug me into Manychat. The official WhatsApp, Instagram, Messenger, no code." (BOOM on Manychat)
line(12, face("sly", { lookX: 0.4 }), fc("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right");
st.flowPipeline(R, { id: "flow", at: C.clic6, out: L[13].t - 0.38, connect: C.boom3 - 0.05,
  sources: ["whatsapp", "instagram", "messenger"], pulses: [C.boom3 + 0.25, C.official, C.official + 0.35] });
punch(C.boom3, 25);
K(C.boom3, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
// ---- 13 coach: "And you answer while I'm training?"
line(13, fc("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 14 Setty: "On my own, in your voice. And if I don't know, I hand it to you." (the hand-off on WhatsApp)
line(14, face("smug", { lookX: 0.3 }), fc("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic7 - 0.01, "right");
st.handoffCard(R, { id: "handoff", at: C.clic7, out: L[15].t - 0.3, channel: "whatsapp", user: "Marcus", color: "#8b5cf6",
  text: "do you do a payment plan for couples?", tag: "❓ Not in your sources", tagAt: C.hand - 0.95, handAt: C.hand - 0.12 });
// ---- 15 coach: "Okay. How do I set you up?" (the music dies: the wide shot, silence, a slow push)
K(L[15].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[15].t + 0.02, L[15].end - L[15].t + 0.5, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[15].t - 0.1, 0.3, fc("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[15].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 16 Setty roasts: "Finish your set first, you've been on that bench ten minutes." (cut to him on his bench) → Fahhh
line(16, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null);
shotTo(C.bench - 0.08, "coach", { dist: 21, y: 860, dur: 0.12, ease: "power4.out" });
KC(C.bench - 0.05, 0.2, fc("eyeRoll"));
shotTo(C.bench + 0.75, "setty", { dur: 0.12, ease: "power4.out" });
reaction(C.fahhh3, fc("annoyed", { lookX: 0.6 }));
// ---- 17 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(17, face("smug", { lookX: 0.2 }), fc("laughing"));
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, fc("proud", { lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
