// Reel 17 "Make and ChatGPT": a real conversation in the coach's garage on a Saturday night (set "garage"). He sits on his
// shop stool in front of his workbench and his three screens, proud of the AI setter he built all weekend in Make; Setty
// sits on the black tool chest in front of the half-open door and takes it apart. The camera on whoever talks, the other
// one reacts; cards pop beside the speaker, in big type (his scenario, the three messages and three replies, the memory
// field, what is still his to build, the running costs, what Setty already does).
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

// two lines of title (slide 1 of the carousel, word for word)
kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.boom3, C.setty] });

const { L, line, reaction, side, punch, bleep, ending, CARD_L } = D; // assets/engine/dialogue.js
// the cards: on the left (the speaker on the right), at 62 %: their text is ~60 px on the phone. They start under the
// title and stop above the captions (y 1165): H is their height in stage px, from the title's real height.
const S = 0.62;
const hook = document.getElementById("hook");
const H = Math.floor((1165 - (hook.offsetTop + hook.offsetHeight + 24 + 60 * S)) / S);
const left = (t) => side(t, "left", { fit: true, scale: S, x: 480 * S - 516 }); // the card's left edge 24 px from the frame
const CARD = { x: 60, w: 900 }; // the DMs take their content's height
const BOX = { ...CARD, h: H }; // the other cards fill the room
const CARD_S = { x: 840, dist: 15 }; // Setty beside a card: a little further right than CARD_L, the card off his cheek
const out = (k) => L[k].t - 0.38; // a card leaves before the camera goes to the next speaker
const JESS = { user: "jess.fit", color: "#0ea5e9" };

// ---- frame 0 (thumbnail): the wide shot, the coach proud at his bench after his weekend build, Setty smug on the chest
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("proud", { lookX: 0.5 }));

// ---- 0 Setty: "You built your own [bleep]ing AI setter with Make, right?" (his riser, BOOM + drop on "right?")
const B1 = R.DATA.bleeps[0];
K(0, B1.t - 0.12, { cam: R.camOf("setty", { dist: 16, y: 950 }) }, "sine.in");
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
bleep(B1);
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("smug", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "All weekend, bro. ManyChat sends the DM to Make, ChatGPT writes the reply, Make sends it back." (his
// scenario builds step by step: Manychat → Make webhook → ChatGPT → back to the DM)
line(1, faceC("hyped", { lookX: 0.4 }), face("deadpan", { lookX: -0.6 }), CARD_L);
st.makeFlow(R, { id: "flow", at: C.clic1, out: out(2), ...BOX, head: { icon: "zap", color: "#6d00cc", text: "my AI setter" },
  steps: [{ icon: "message-circle", color: "#27272a", text: "Manychat", at: C.mc },
    { icon: "link", color: "#d6246e", text: "Make webhook", at: C.make },
    { icon: "sparkles", color: "#10a37f", text: "ChatGPT", at: C.gpt },
    { app: "instagram", text: "back to DM", at: C.back }] });
left(C.clic1 - 0.01);
KC(C.back, 0.25, faceC("proud", { lookX: 0.4 }), "back.out(2)");

// ---- 2 Setty sets the trap: "Cute. Now a lead sends three messages in a row." (the lead's three bubbles)
line(2, face("sly", { lookX: -0.4 }), faceC("smug", { lookX: 0.5 }), CARD_S);
st.bigDM(R, { id: "dm1", at: C.clic2, out: out(3), ...JESS, ...CARD,
  msgs: [{ text: "hey!", at: C.now }, { text: "saw your reel 🔥", at: C.sends }, { text: "how much is it?", at: C.msgs }] });
left(C.clic2 - 0.01);

// ---- 3 coach: "So it answers all three? Like a robot on espresso." (three replies, one per bubble; BOOM)
line(3, faceC("confused", { lookX: 0.4 }), face("mocking", { lookX: -0.6 }), CARD_L);
st.bigDM(R, { id: "dm2", at: C.clic3, out: out(4), ...JESS, ...CARD,
  msgs: [{ me: true, text: "hey! 👋", at: C.answers }, { me: true, text: "thanks! 😊", at: C.three },
    { me: true, text: "how can I help?", at: C.robot }] });
left(C.clic3 - 0.01);
KC(C.robot - 0.05, 0.25, faceC("panic", { lookX: 0.4 }), "back.out(2)");
punch(C.boom1, 27);
K(C.boom1 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut"); // back out: his face stays beside the card

// ---- 4 Setty: "And does it remember what they said?" (dry, his lids half down)
line(4, face("deadpan", { lookX: -0.5, lidL: 0.35, lidR: 0.35 }), faceC("thinking", { lookX: 0.5 }));

// ---- 5 coach: "Uh, it asked her name twice." (sheepish)
line(5, faceC("pleading", { lookX: 0.4, lookY: -0.3 }), face("eyeRoll", { lookY: 0.6 }));

// ---- 6 Setty: "Memory doesn't wire itself, you save each lead's Conversation ID and send it back. The right questions,
// the booking, the follow-ups? You build those too." (the empty field gets its ID; then what is still his to build; BOOM)
line(6, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), faceC("stressed", { lookX: 0.5 }), CARD_S);
st.memoryField(R, { id: "mem", at: C.clic4, out: C.clic5 - 0.2, ...BOX, name: "Conversation ID",
  value: { text: "conv_8f3a", t0: C.save, t1: C.save + 0.7 }, foot: { icon: "repeat", text: "every message", at: C.sendback } });
left(C.clic4 - 0.01);
K(C.save - 0.05, 0.25, face("sly", { armRr: 1.0, armRf: 0.6, lookX: -0.5 }), "back.out(2)"); // he looks at the card
st.todoList(R, { id: "todo", at: C.clic5, out: out(7), ...BOX, head: { emoji: "🛠️", text: "still on you" },
  rows: [{ text: "questions", at: C.right }, { text: "booking", at: C.booking }, { text: "follow-ups", at: C.follow }] });
K(C.boom2 - 0.05, 0.25, face("laughing", { armRr: 1.2, armRf: 1.0, armLr: 1.2, armLf: 1.0 }), "back.out(2)");
punch(C.boom2, 27);
K(C.boom2 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");

// ---- 7 coach: "At least it's cheap." (hopeful)
line(7, faceC("sly", { lookX: 0.5 }), face("deadpan", { lookX: -0.6 }));

// ---- 8 Setty roasts: "Make credits, OpenAI tokens, and your Saturday nights in a garage." (the meters run) → Fahhh
line(8, face("mocking", { armRr: 0.5, armRf: 0.9, lookX: -0.4 }), null, CARD_S);
st.costMeter(R, { id: "cost", at: C.clic6, out: C.fahhh1 - 0.32, ...BOX,
  rows: [{ icon: "zap", color: "#6d00cc", from: 0, to: 1284, t0: C.credits - 0.1, t1: C.credits + 1.4, unit: "Make credits", at: C.clic6 + 0.12 },
    { icon: "sparkles", color: "#10a37f", from: 0, to: 48210, t0: C.tokens - 0.4, t1: C.tokens + 1.2, unit: "OpenAI tokens", at: C.tokens - 0.45 },
    { icon: "moon", color: "#3b4a6b", from: 4, to: 0, t0: C.saturday + 0.1, t1: C.garage, unit: "weekends left", at: C.saturday - 0.05, bad: true }] });
left(C.clic6 - 0.01);
K(C.garage - 0.05, 0.2, face("laughing", { armRr: 1.3, armRf: 1.0, lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.5, lookY: -0.4 }));

// ---- 9 coach: "Bro, I'm not a developer. I didn't want another thing to maintain." (tired, he gives up)
line(9, faceC("defeated", { lookX: 0.4, lookY: -0.3 }), face("sideEye", { lookX: -0.6 }));

// ---- 10 Setty: "The model isn't the setter, I am. The wait, the memory, the questions, the booking, the follow-ups,
// already built. Plug me into ManyChat." (BOOM on "I am", then the same list, ticked)
line(10, face("smug", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_S);
punch(C.boom3, 27);
K(C.boom3, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
K(C.boom3 + 0.35, 0.3, { cam: { fov: 30 } }, "power2.inOut");
st.todoList(R, { id: "done", at: C.clic7, out: out(11), ...BOX, head: { app: "manysetter", text: "already built" },
  rows: [{ text: "waits", at: C.wait, ok: C.wait + 0.12 }, { text: "remembers", at: C.mem2, ok: C.mem2 + 0.12 },
    { text: "one question", at: C.questions, ok: C.questions + 0.12 }, { text: "books", at: C.booking2, ok: C.booking2 + 0.1 },
    { text: "follows up", at: C.follow2, ok: C.follow2 + 0.12 }] });
left(C.clic7 - 0.01);
K(C.wait, 0.25, face("happy", { lookX: 0.4 }), "back.out(2)"); // he looks at the card
K(C.plug - 0.05, 0.25, face("sly", { armRr: 1.0, armRf: 0.6, lookX: -0.3 }), "back.out(2)");
KC(C.follow2, 0.3, faceC("hyped", { lookX: 0.5 }));

// ---- 11 coach (the music dies, the wide): "Okay. How do I set you up?"
shotTo(L[11].t - 0.2, "wide", { dur: 0.3 });
KC(L[11].t - 0.12, 0.25, faceC("pleading", { lookX: 0.6 }), "back.out(1.6)");
K(L[11].t + 0.3, 0.3, face("smug", { lookX: -0.7 }));

// ---- 12 Setty roasts: "Step one, go to bed. You smell like [bleep]ing webhooks." → Fahhh
line(12, face("deadpan", { lookX: -0.5, armRr: 0.5, armRf: 0.9 }), null);
K(C.bed + 0.2, 0.25, face("mocking", { armRr: 1.3, armRf: 1.0, lookX: -0.6 }), "back.out(2)");
bleep(R.DATA.bleeps[1]);
K(C.webhooks - 0.05, 0.2, face("laughing", { lookX: -0.6 }), "back.out(2)");
reaction(C.fahhh2, faceC("disgusted", { lookX: 0.4 }));

// ---- 13 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → the common ending (back to
// the wide, which loops to frame 0; the comment bar types SETTY, the notification, the end pill)
line(L.length - 1, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 960 }); // lower: the comment bar sits under the title
ending({ coachFace: faceC("proud", { lookX: 0.5 }) });
