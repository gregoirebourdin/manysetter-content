// Reel 15 "AI in 2 seconds": a real conversation in a server room at night (set "serverroom"). The coach sits on a flight
// case in front of his own rack (its screen: "AUTO-REPLY 2.0 s"), proud that his AI answers every DM in two seconds;
// Setty sits on a server slid out of its rack and shows him, bubble by bubble, what two seconds does to a lead who is
// still typing. The camera on whoever talks, the other one reacts; cards pop beside the speaker (his auto-reply, the
// chat, the goal asked again, ManySetter's one reply, what it remembers).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, punch, push, bleep, ending, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
// a card beside the speaker, in big type: w = its width in the stage (narrower reads bigger), s = its scale on screen.
// Its top sits under the hook title, its outer edge 20 px from the frame on the left, 80 px on the right (IG buttons).
const titleBottom = () => { const h = document.getElementById("hook"); return h ? h.offsetTop + h.offsetHeight : 470; };
const card = (t, id, where, s, { w = 760, h } = {}) => {
  const el = document.getElementById(id);
  Object.assign(el.style, { width: `${w}px`, left: `${where === "left" ? 60 : 1020 - w}px` }, h ? { height: `${h}px` } : {});
  const top = titleBottom() + 26; // the card's top on screen
  tl.set("#stagebox", { scale: s, x: where === "left" ? 480 * s - 520 : 460 - 480 * s, y: top - 840 + 300 * s }, t);
};
const LEAD = { user: "Jess", color: "#8b5cf6" };
const CARD_R2 = { x: 280, dist: 18, y: 860 }; // Setty a little smaller and further left: the card on the right gets room

// ---- frame 0 (thumbnail): the wide shot, the coach proud with his phone on his flight case, Setty smug on his server
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("hyped", { mouthOpen: 0.3, lookX: 0.5 }));

// ---- 0 Setty: "You turned on your [bleep]ing AI auto-reply, right?" (his riser from frame 0, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0], B2 = R.DATA.bleeps[1];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Two seconds, bro. I'm upgrading the servers to make it one." (his auto-reply settings)
line(1, faceC("proud", { lookX: 0.4 }), face("eyeRoll", { lookX: -0.6 }), CARD_L);
st.checklist(R, { id: "auto", at: C.clic1, out: L[2].t - 0.24, title: "AI auto-reply",
  items: [{ icon: "zap", text: "Every DM", sub: "auto-reply on", at: C.two },
    { icon: "timer", text: "2 seconds", sub: "to reply", at: C.seconds }],
  done: { text: "Upgrading to 1s 🚀", at: C.upgrading } });
card(C.clic1 - 0.01, "auto", "left", 0.78, { w: 700 });
KC(C.upgrading - 0.05, 0.25, faceC("hyped", { lookX: 0.4 }), "back.out(2)");

// ---- 2 Setty: "Cool. Now your leads leave in two seconds too." (BOOM at the end)
line(2, face("deadpan", { lookX: -0.6 }), faceC("confused", { lookX: 0.6 }));
K(C.boom1 - 0.25, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), "back.out(2)");
punch(C.boom1, 26);

// ---- 3 coach: "What? Speed is the flex."
line(3, faceC("annoyed", { lookX: 0.5, armRr: 0.4, armRf: 0.7, elbowR: 1.6 }), face("deadpan", { lookX: -0.7 }));

// ---- 4 Setty acts it out: the lead types, the bot fires back on every piece, the booking link before the end
// (two cards in a row, two bubbles each: the type stays big)
line(4, face("sly", { lookX: -0.3 }), faceC("confused", { lookX: 0.6 }), CARD_R2);
st.igDM(R, { id: "demo1", at: C.clic2, out: C.demo2 - 0.2, ...LEAD, w: 560,
  msgs: [{ text: "hey", at: C.hey }, { me: true, text: "How can I help? 😊", at: C.bot1 }] });
card(C.clic2 - 0.01, "demo1", "right", 0.9, { w: 560 });
st.igDM(R, { id: "demo2", at: C.demo2, out: L[5].t - 0.24, ...LEAD, w: 560,
  msgs: [{ text: "so i saw your…", at: C.lead2, chip: { text: "still typing", tone: "grey", icon: "message-circle", at: C.bot2 + 0.15 } },
    { me: true, text: "Booking link! 📅", at: C.bot2 }] });
card(C.demo2 - 0.01, "demo2", "right", 0.9, { w: 560 });
K(C.bot1, 0.2, face("happy", { lookX: -0.3 }), "back.out(2)");
K(C.bot2, 0.2, face("laughing"), "back.out(2)");
KC(C.bot2 + 0.1, 0.3, faceC("shocked", { lookX: 0.6 }));

// ---- 5 coach: "Okay, they were kinda still typing."
line(5, faceC("stressed", { lookX: 0.4, lookY: -0.2 }), face("smug", { lookX: -0.6 }));

// ---- 6 Setty roasts: "They said "hey" and your bot already proposed." → Fahhh on the coach
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.4 }), null);
reaction(C.fahhh1, faceC("eyeRoll", { lookX: 0.6 }));

// ---- 7 coach: "Then it asks their goal. They literally just told it." (the goal, then the bot asking it)
line(7, faceC("defeated", { lookX: 0.4 }), face("deadpan", { lookX: -0.7 }), CARD_L);
st.igDM(R, { id: "goal", at: C.clic3, out: L[8].t - 0.22, ...LEAD, w: 560,
  msgs: [{ text: "i wanna drop 20&nbsp;lbs 🙏", at: C.clic3 + 0.15 },
    { me: true, text: "What's your goal? 😊", at: C.goal - 0.05,
      chip: { text: "they just told you", tone: "red", icon: "circle-x", at: C.told } }] });
card(C.clic3 - 0.01, "goal", "left", 0.85, { w: 560 });
KC(C.told - 0.05, 0.25, faceC("disgusted", { lookX: 0.4 }), "back.out(2)");

// ---- 8 Setty: "That's not a chat, that's a form with emojis." (BOOM at the end)
line(8, face("smug", { lookX: -0.5 }), faceC("defeated", { lookX: 0.6 }));
K(C.boom2 - 0.3, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), "back.out(2)");
punch(C.boom2, 26);

// ---- 9 coach: "Honestly, number one complaint I get? My AI answers instantly. So I slow it down?"
line(9, faceC("thinking", { lookX: 0.5 }), face("deadpan", { lookX: -0.7 }));
KC(C.instantly - 0.1, 0.25, faceC("defeated", { lookX: 0.5 }), "back.out(2)");
KC(C.slow - 0.15, 0.25, faceC("pleading", { lookX: 0.6 }), "back.out(2)");
K(C.slow + 0.2, 0.25, face("eyeRoll", { lookX: -0.6 }));

// ---- 10 Setty: "Nope. Plug me into Manychat. I wait till they're done typing, then send one reply, one question." (BOOM)
line(10, face("sly", { lookX: -0.4 }), faceC("skeptical", { lookX: 0.5 }), CARD_R2);
st.igDM(R, { id: "setter", at: C.clic4, out: L[11].t - 0.22, ...LEAD, w: 640,
  msgs: [{ text: "i wanna drop 20&nbsp;lbs", at: C.clic4 + 0.12 },
    { text: "is it online?", at: C.done - 0.1 },
    { me: true, text: "yes, fully online 🙂 how many days can you train?", at: C.send,
      chip: { text: "1 reply, 1 question", tone: "green", icon: "circle-check", at: C.question - 0.1 } }] });
card(C.clic4 - 0.01, "setter", "right", 0.7, { w: 640 });
punch(C.boom3, 27);
K(C.boom3, 0.25, face("proud", { armRr: 0.5, armRf: 0.9 }), "back.out(2)"); // arm forward: raised straight up, his hand floats beside him from this side
K(C.wait - 0.1, 0.25, face("sly", { lookX: 0.3 }), "back.out(1.6)"); // he looks at the chat

// ---- 11 coach: "And the goal thing?"
line(11, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));

// ---- 12 Setty: "I remember what they said. Same question twice? Never." (what the setter knows about the lead)
line(12, face("proud", { lookX: -0.2 }), faceC("thinking", { lookX: 0.5 }), CARD_R2);
st.checklist(R, { id: "memory", at: C.mem, out: L[13].t - 0.15, title: "I remember", appSlug: "manysetter",
  items: [{ icon: "target", text: "20 lbs", sub: "their goal", at: C.remember },
    { icon: "message-circle", text: "Online", sub: "already answered", at: C.remember + 0.35 }],
  done: { text: "Never asks twice", at: C.never - 0.1 } });
card(C.mem - 0.01, "memory", "right", 0.74, { w: 700 });
K(C.never - 0.05, 0.2, face("wink"), "back.out(2)");

// ---- 13 coach: "Okay. How do I set you up?" (the music dies: the wide shot, the servers' hum, a slow push)
K(L[13].t - 0.13, 0.25, { cam: R.camOf("wide") }, "power3.inOut"); // after the "I remember" card has left
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[13].t + 0.02, L[13].end - L[13].t + 0.3, { cam: { px: w.px + (w.ax - w.px) * k, py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[13].t - 0.1, 0.3, faceC("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[13].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));

// ---- 14 Setty roasts: "First, leave the server room. You bought [bleep]ing servers so your bot could be wrong faster."
// (cut to his rack's "2.0 s" screen on "servers", then his face on "wrong") → Fahhh
{
  const l14 = L[14], lb = R.camOf("label"), CU = { dist: 15, y: 860 };
  shotTo(l14.t - 0.2, "setty", { dur: 0.28 });
  K(l14.t - 0.2, 0.001, { cam: { fov: 30 } });
  push(l14.t + 0.08, C.servers - 0.1, "setty", {}, 0.8);
  K(l14.t - 0.12, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.6 }), "back.out(1.6)");
  K(C.room - 0.05, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), "back.out(2)");
  bleep(B2);
  shotTo(C.servers - 0.06, "label", { dur: 0.001 }); // hard cuts: a 0.1 s move flew through his head (frame 43.93 of v1)
  K(C.servers + 0.06, C.wrong - 0.1 - (C.servers + 0.06), { cam: { px: lb.px - 0.35, pz: lb.pz - 0.6 } }, "sine.out");
  shotTo(C.wrong - 0.08, "coach", { ...CU, dur: 0.001 });
  push(C.wrong + 0.06, C.fahhh2 - 0.1, "coach", CU, 0.9);
  KC(C.wrong - 0.05, 0.2, faceC("defeated", { lookY: -0.5, lookX: -0.3 }));
}
reaction(C.fahhh2, faceC("annoyed", { lookX: 0.6 }));

// ---- 15 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending
line(15, face("smug", { lookX: 0.2 }), faceC("laughing"));
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
