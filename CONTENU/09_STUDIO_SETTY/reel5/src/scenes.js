// Reel 5 "Calendly and the no-shows": a real conversation in a coffee shop in the morning (set "cafe"). He sits next to
// his marble table, laptop open on a Zoom call nobody joins, proud of his fully booked week; Setty sits on the table by
// the latte and takes the week apart: the link asks nothing, a free call is free to skip, make them earn it. The camera
// on whoever talks, the other one reacts; cards pop beside the speaker (his Calendly week, the no-shows, the auto DM,
// Setty's first question, the sorter, the times and the booked call); the laptop insert shows the empty call.
// Scope (shell.html): R, C, K (Setty), KC (coach), face / faceC, shotTo, shake, flash, tl, D, T(i), E(i), kit, st.

kit.hookTitle(R, { lines: R.DATA.hook_title, pulses: [C.drop, C.boom1, C.boom2, C.setty] });

const { L, line, reaction, side, punch, CARD_L, CARD_R } = D; // assets/engine/dialogue.js
const xl = (id) => document.getElementById(id).classList.add("xl"); // big type for cards beside a speaker (stage.css)

// ---- frame 0 (thumbnail): the wide shot, the coach proud next to his laptop, Setty smug on the table
R.place({ ...face("smug", { lookX: -0.8, dotsBounce: 1 }) });
Object.assign(R.Q, faceC("proud", { lookX: 0.5 }));

// ---- 0 Setty: "You dropped your [bleep]ing Calendly link in the DM, right?" (his riser from frame 0, BOOM + drop on "right?")
K(0, 1.4, { cam: R.camOf("setty", { dist: 16, y: 900 }) }, "sine.in");
const B1 = R.DATA.bleeps[0];
K(B1.t - 0.1, 0.2, { cam: R.camOf("setty") }, "power4.out");
K(B1.t - 0.04, 0.12, { censor: 1, squash: 0.06 }, "back.out(3)");
K(B1.end + 0.05, 0.1, { censor: 0, squash: 0 });
K(B1.end + 0.1, 0.25, face("mocking", { armRr: 0.5, armRf: 0.9 }));
KC(1.0, 0.3, faceC("confused", { lookX: 0.6 }));
punch(C.drop, 26);
flash(C.drop, 0.5, 0.18);

// ---- 1 coach: "Auto DM, bio, stories. Booked all week, bro." (his Calendly week fills up)
const WEEK = [["MON", "19", "9:00 am", "Tyler"], ["TUE", "20", "10:30 am", "Brianna"], ["WED", "21", "1:00 pm", "Marcus"],
  ["THU", "22", "9:30 am", "Kayla"], ["FRI", "23", "4:00 pm", "Devin"]].map(([day, date, time, who]) => ({ day, date, time, who }));
line(1, faceC("proud", { lookX: 0.4, armRr: 0.3, armRf: 1.1, elbowR: 1.5 }), face("sleepy", { lookX: -0.6 }), CARD_L);
side(C.clic1 - 0.01, "left");
st.calendlyEvents(R, { id: "wk", at: C.clic1, out: L[2].t - 0.38, rows: WEEK, rowAt: C.clic1 + 0.3 });
xl("wk");
// ---- 2 Setty: "Cool. Where's your nine o'clock?" (his eyes slide to the laptop)
line(2, face("deadpan", { lookX: -0.5, lookY: -0.2 }), faceC("smug", { lookX: 0.4 }));
// ---- 3 coach: "He's late. Like, fifteen minutes." → the laptop insert: "Waiting for Tyler to join…", 15:02
line(3, faceC("thinking", { lookX: 0.6, lookY: -0.25 }), face("sly", { lookX: -0.6 }));
shotTo(C.late - 0.1, "laptop", { dur: 0.12, ease: "power4.out" });
K(C.late + 0.05, Math.max(0.3, L[4].t - 0.26 - C.late), { cam: R.camOf("laptop", { dist: 3.3 }) }, "sine.inOut");
// ---- 4 Setty roasts: "So you're waving at yourself on Zoom. In public." → Fahhh on the coach
line(4, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0 }), null);
K(C.public - 0.05, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh1, faceC("annoyed", { lookX: 0.6 }));
// ---- 5 coach: "Third [bleep]ing no-show this week. These calls take real time and energy!" (the no-shows land)
line(5, faceC("stressed", { sweat: 1, armRr: 0.25, armRf: 1.35, elbowR: 1.95, lookX: 0.3 }), face("deadpan", { lookX: -0.7 }), CARD_L);
const B2 = R.DATA.bleeps[1];
KC(B2.t - 0.04, 0.12, { censor: 1 }, "back.out(3)");
KC(B2.end + 0.05, 0.1, { censor: 0 });
side(C.clic2 - 0.01, "left");
st.calendlyEvents(R, { id: "ns", at: C.clic2, out: L[6].t - 0.38, rows: WEEK, rowAt: C.clic2 + 0.12,
  status: [{ row: 0, text: "No-show", tone: "red", at: C.ns1 }, { row: 1, text: "No-show", tone: "red", at: C.ns2 },
    { row: 3, text: "No-show", tone: "red", at: C.ns3 }],
  total: { label: "No-shows this week", value: "3", at: C.nstotal } });
xl("ns");
// ---- 6 Setty: "Your link doesn't ask. No budget, no goal, no idea who you are." (the auto DM answers a real question)
line(6, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_R);
side(C.clic3 - 0.01, "right");
st.igChat(R, { id: "auto", at: C.clic3, out: L[7].t - 0.38, user: "brianna.fit", color: "#8b5cf6", status: "Active now",
  msgs: [{ text: "is this for beginners? I've been burned by coaches before", at: C.clic3 + 0.12 },
    { me: true, text: "Here's the link to book your free call, grab any time that works! 📅", at: C.budget - 0.15 }] });
xl("auto");
// ---- 7 coach: "Then why even book?"
line(7, faceC("confused", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 8 Setty: "Because it's free. Free to book, free to ghost." (BOOM on "ghost")
line(8, face("deadpan", { lookX: -0.4 }), faceC("confused", { lookX: 0.5 }));
punch(C.boom1, 24);
K(C.boom1, 0.22, face("mocking", { armRr: 0.5, armRf: 0.9 }), "back.out(2)");
// ---- 9 coach: "Wait, so I stop sending the link?" (the music dies: the wide shot, silence, a slow push)
K(L[9].t - 0.25, 0.25, { cam: R.camOf("wide") }, "power3.inOut");
{
  const w = R.camOf("wide"), k = 0.14;
  K(L[9].t + 0.02, Math.min(L[9].end - L[9].t + 0.5, L[10].t - 0.23 - L[9].t), { cam: { px: w.px + (w.ax - w.px) * k,
    py: w.py + (w.ay - w.py) * k, pz: w.pz + (w.az - w.pz) * k } }, "sine.inOut");
}
KC(L[9].t - 0.1, 0.3, faceC("pleading", { lookX: 0.6, lookY: -0.2 }));
K(L[9].t + 0.3, 0.3, face("sly", { lookX: -0.8 }));
// ---- 10 Setty: "No. Make them earn it. Plug me into Manychat, I ask your questions first." (BOOM, the music slams back)
line(10, face("sly", { lookX: -0.3 }), faceC("skeptical", { lookX: 0.5 }), CARD_R);
punch(C.boom2, 25);
K(C.boom2, 0.25, face("proud", { armRr: 2.2 }), "back.out(2)");
side(C.clic4 - 0.01, "right");
st.igChat(R, { id: "qual", at: C.clic4, out: L[11].t - 0.38, user: "devin.lifts", color: "#10b981", status: "Active now",
  msgs: [{ text: "can i book a call?", at: C.clic4 + 0.12 },
    { me: true, text: "Sure, quick one first: what are you trying to fix?", at: C.ask - 0.1 }] });
xl("qual");
// ---- 11 coach: "And if they're not a fit?"
line(11, faceC("skeptical", { lookX: 0.5 }), face("smug", { lookX: -0.6 }));
// ---- 12 Setty: "They get something useful, like your free guide. Not your calendar." (the sorter)
line(12, face("smug", { lookX: -0.2 }), faceC("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic5 - 0.01, "right");
st.leadSorter(R, { id: "sort", at: C.clic5, out: L[13].t - 0.38,
  left: { title: "Not a fit", sub: "gets your free guide", tile: "📘" }, right: { title: "A fit", sub: "gets your Calendly", tile: "calendly" },
  leads: [{ u: "tyler", m: "just curious lol", c: "#06b6d4", side: "l", at: C.clic5 + 0.25 },
    { u: "kayla", m: "ready this month", c: "#d6249f", side: "r", at: C.guide - 0.2 },
    { u: "sam", m: "no budget rn", c: "#f97316", side: "l", at: C.guide + 0.25 },
    { u: "marcus", m: "want 10 clients", c: "#8b5cf6", side: "r", at: C.calendar }] });
xl("sort");
// ---- 13 coach: "And the good ones?"
line(13, faceC("sly", { lookX: 0.5 }), face("proud", { lookX: -0.5 }));
// ---- 14 Setty: "Paid Calendly? I offer two or three times in their time zone and book it, lead summary included."
line(14, face("proud", { lookX: -0.2 }), faceC("thinking", { lookX: 0.5 }), CARD_R);
side(C.clic6 - 0.01, "right");
st.igChat(R, { id: "offer", at: C.clic6, out: C.clic7 - 0.05, user: "kayla.moves", color: "#d6249f", status: "Active now",
  msgs: [{ text: "4 right now, I want to get to 10 by spring", at: C.clic6 + 0.12 },
    { me: true, text: "That's who it's for. Tuesday 2:00 pm or Wednesday 11:00 am, your time?", at: C.offer - 0.1 }] });
xl("offer");
st.calendlyConfirm(R, { id: "booked", at: C.clic7, out: L[15].t - 0.3, who: "Kayla", when: "Tuesday · 2:00 pm (her time)",
  summaryAt: C.book - 0.15, step: 0.2, summary: ["Wants 10 clients by spring", "Has 4 right now", "Came from an Instagram DM"] });
xl("booked");
// ---- 15 coach: "Fine. How do I get you?"
line(15, faceC("pleading", { lookX: 0.5 }), face("sly", { lookX: -0.6 }));
// ---- 16 Setty roasts: "Close the Zoom, bro. He's still asleep." (cut to the empty call) → Fahhh on the coach
line(16, face("mocking", { armRr: 0.5, armRf: 0.9, armLr: 1.3, armLf: 1.0, lookX: -0.6 }), null);
// his arms back at rest, eyes on the laptop: nothing between the insert camera and the screen
KC(L[16].t - 0.2, 0.25, faceC("deadpan", { armLr: 0.16, armRr: 0.16, armLf: 0.05, armRf: 0.05, elbowL: 0.25, elbowR: 0.25, lookX: 0.7, lookY: -0.3 }));
shotTo(C.zoomw - 0.06, "laptop", { dur: 0.12, ease: "power4.out" });
shotTo(C.still - 0.08, "setty", { dur: 0.12, ease: "power4.out" });
K(C.still, 0.2, face("laughing"), "back.out(2)");
reaction(C.fahhh2, faceC("annoyed", { lookX: 0.6 }));
// ---- 17 Setty: "Comment SETTY and I'll send you everything to build your AI setter for free." → back to the wide (loops)
line(17, face("smug", { lookX: 0.2 }), faceC("laughing"), { y: 940 }); // lower: the comment bar stays above his face
K(C.free - 0.1, 0.25, face("wink"), "back.out(2)");
K(C.dms_end + 0.1, 0.9, { cam: R.camOf("wide") }, "power3.inOut");
K(C.dms_end + 0.2, 0.4, face("smug", { lookX: -0.8 }));
KC(C.dms_end + 0.2, 0.4, faceC("proud", { lookX: 0.5 }));
kit.commentBar(R, { keyword: "SETTY", at: C.comment - 0.12, caret: C.comment, type: C.setty_end + 0.06, step: 0.07,
  send: C.setty_end + 0.45, out: C.send - 0.1 });
kit.notification(R, { title: "setty", text: "here's how to build your AI setter free 🎁", at: C.dms_end + 0.03 });
kit.endCta(R, { text: "Comment SETTY", at: C.end + 0.6 });
