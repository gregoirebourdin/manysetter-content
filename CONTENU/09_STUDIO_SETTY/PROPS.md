# Prop catalogue (`assets/engine/props.js`)

Every on-screen object of reel1, reusable as is. Call them from `<reel>/src/scenes.js` with times taken from the
cues (`C.word ± offset`). Each prop mounts once per reel, in its paint slot (`ORDER` in `engine.js`), and adds its
tweens to the reel's timeline. The "Sound" column is what reel1 placed in `audio.py` for it (copy it, retime it).
Reference calls with real values: `reel1/src/scenes.js` and `reel1/audio.py`. See them in motion:
`deliverables/reel1/reel1.mp4` (local) or `python3 studio.py snap reel1`.

| Prop | Shows | Call (reel1 values) | Framing | Sound (reel1) |
|---|---|---|---|---|
| `marquee` | the format in giant type behind Setty, two rows sliding | `kit.marquee(R, { text: "5-DAY CHALLENGE", at, out })` + flash | MID | `impact_word(46)` on the word − 0.03, `swish(0.6)` |
| `livePill` | red LIVE pill + DAY counter flipping 1 → 5, or a viewer count melting (reel2: 347 → 12) | `{ at, out, days: { t0, t1, from, to } }` or `viewers: { from, to, t0, t1 }` | MID | `pop()` in, `woodblock` per day / soft ticks |
| `ecg` | heart monitor drawing 3 beats, then a red flatline | `{ at, dead, out, draw }` | MID | `M.ecg_beeps(voice_t, dead_t)` |
| `ringLight` | ring light around Setty (follows him), hot background, flicker | `{ at, out }` | MID | `hum(1.0)`, `thump(90)`, 4 `click()` on the flicker |
| `dmRain` | 40 DM bubbles ("info?", "price?"…) rain and pile on Setty, then drain | `{ t0, spawnEnd, drop, t1, texts }` (build it last) | MID only | `M.ping_storm(t0, t1)` |
| `giantBubble` | a giant chat bubble slammed on screen, thrown down | `{ text: "info?", at, out }` + flash | MID | `impact(52)`, `whoosh` in, `whoosh` down |
| `iconBadge` | orange round badge with any Lucide icon, wiggle; several per reel (`id`, `pos`), `fly: true` throws it away | `{ id, icon: "hand", at, wiggle, out, pos, fly }` | MID / close | `pop()`, 5 `woodblock(900)` on the wiggle |
| `nightClock` | big glowing "00:00" (or "1:00 AM", `size: 210`) on a night background | `{ text, size, at, night, blink, out }` + flash | MID (above Setty) | 3 `woodblock` ticks |
| `bed` | a bed rising behind Setty | `{ at, out }` | MID | `boing(150, 420)` |
| `blackCut` | hard cut to black + red spot, back to the hot stage at `until` | `{ at, until, hide: ["#bed", "#bg-night"] }` + flash | close-up, red rim light (`light: { key: 0.8, rim: 7, red: 1 }`) | `scratch()` before, `M.drone(at, until)` |
| `tapes` | two warning tapes slamming across ("HOSTAGE SITUATION · DO NOT CROSS") | `{ text, t1, t2, out }` | with `blackCut` | `whoosh` + `impact(48)` / `impact(40)` per tape |
| `manychatPlug` | Manychat pill, a cable grows from Setty's tail, spark, "Connected" | `{ at, cable, connect, out }` + flash | MID | `riser`, `impact(46)`, `key_click`, `zap`, `blip("recv")` |
| `playbookCard` | real Playbook card: sales page read, bar fills, facts, "Learned" | `{ at, fill, fillDur, chips, learned, out, page, facts }` | TOP | scan sweep, `sparkle(0.6)` on "Learned" |
| `dmThread` | real DM thread: lead / typing (setter's or `who: "lead"`) / setter bubbles, chips ("Qualified"), auto-scroll | `{ at, out, handle, initials, messages: [{ lead, at }, { typing, at, hide, who }, { setter, at, chip, scroll }] }` (put `scroll` on a message, never on a typing row) | TOP | `blip("recv")` per lead message, soft `key_click` while typing, `blip("send")` per reply |
| `bookedCard` | "Call booked" card slammed in | `{ at, out, title, detail }` + flash | TOP | `impact_word(52)`, `sparkle(1.0)`, noise burst |
| `confetti` | brand-colour confetti burst | `{ at, x, y, n }` | any | (with bookedCard) |
| `weekCalendar` | real week calendar (Calendly chip), the booked event drops in, others pop | `{ at, drop, out, tool, events }` | TOP | `whoosh` in, `thump(200)`, 3 `pop()` |
| `moonZzz` | moon + floating "z z" | `{ at, out }` | close | `sparkle(0.9, 80, 96)` |
| `commentBar` | IG comment bar typing the keyword, send | `{ keyword: "SETTY", at, caret, type, step, send, out }` (type after the word is said) | MID | 5 `key_click` on the typing, `blip("send")` |
| `toast` | small app-style pill with an icon: "Mom left the webinar", "6 calls booked · 0 clients", "Handed to you"; several per reel (`id`) | `{ id, icon, text, tone: "" \| "red" \| "green" \| "light", y: 1010, at, out }` | between Setty and the captions | `blip("recv")` 0.25 s before |
| `chatBubbles` | a stack of chat bubbles popping in (gags, follow-ups "After 2 hours"); "me" orange right, "lead" white left, `meta` grey line | `{ id, x, y, w, items: [{ text, from, at, meta, small }], out }` | MID (y 900–1150) / TOP (y 670–1150) | `blip("send")` / `blip("recv")` per bubble, before the next word |
| `notification` | phone notification sliding down ("setty · slid into your DMs") | `{ title, text, at }` + flash | any | 2 `ping` |
| `endCta` | orange end pill with a bouncing arrow | `{ text: "Comment SETTY", icon: "arrow-down", at }` | END | `pop()`, `sparkle(0.8)` |

## Stage modules (`assets/engine/stage.js`, layout "stage")

What the middle of the screen shows: the coaches' real tools with their logos, and diagrams that explain. Each takes an
`id` (use it several times), enters and leaves on its own, and stays behind Setty. Real values: `reel2/src/scenes.js`.

| Module | Shows | Call |
|---|---|---|
| `st.app(slug, size)` | glossy app icon with the official glyph: instagram, whatsapp, messenger, zoom, calendly, caldotcom, stripe, manysetter | HTML string, inside any module |
| `kit.hookTitle` | the hook title fixed on top, each line as big as the width allows, key words in orange (`*DMs*`), bumps on beats | `{ lines: ["…", "Your *DMs* just started."], max: 120, pulses: [t…] }` |
| `st.zoomWebinar` | Zoom webinar window: REC, attendees gallery, count melting, a tile leaving with the Zoom toast, active-speaker ring | `{ id, at, out, title, tiles: [{ name, emoji \| ini, bg, mic }], viewers: { from, to, t0, t1 }, drop, leave, spot }` |
| `st.igInbox` | Instagram inbox flooding (newest on top), Requests badge counting | `{ id, at, out, rows: [{ u, m, c, hot }], times, requests }` |
| `st.igChat` | Instagram conversation: grey / purple bubbles, "Seen", typing dots | `{ id, at, out, user, color, status, msgs: [{ me, text, at, big, seen, typing }] }` |
| `st.lockScreen` | phone lock screen at night, notifications stacking (Instagram, WhatsApp, Messenger) | `{ id, at, out, time, date, notifs: [{ app, who, text, at }] }` |
| `st.calendlyEvents` | Calendly scheduled events, each call gets its fate (No-show…), total | `{ id, at, out, rows, rowAt, status: [{ row, text, tone, at }], total: { label, value, at } }` |
| `st.calendlyConfirm` | Calendly booking confirmation + "Lead summary · added by ManySetter" | `{ id, at, out, who, when, summaryAt, summary: [...] }` |
| `st.neonSign` | a neon sign switching on (flickers) on a black stage | `{ id, at, out, lines, sub, flicker }` + `bg("black", 1, t)` |
| `st.flowPipeline` | the product in one picture: your DMs → Manychat → ManySetter → calendar, messages travelling | `{ id, at, out, connect, pulses, sources, target, targetLabel }` |
| `st.leadSorter` | two lanes, leads dropping in and sorted (tire-kickers / serious) | `{ id, at, out, left, right, leads: [{ u, m, c, side, at }] }` |
| `st.followTimeline` | Instagram's 24-hour window, follow-ups popping at 2 h / 8 h / 20 h | `{ id, at, out, marks: [{ h, text, at }], fillTo }` |
| `st.handoffCard` | ManySetter inbox: a lead gets upset, "Handed to you", "Reply myself" | `{ id, at, out, user, text, tagAt, handAt }` |
| `st.laptopClose` | a laptop (Zoom on screen) whose lid shuts, an emoji drops (👖) | `{ id, at, close, out, drop: { emoji, at } }` |

Stage helpers (engine): `zoom(t, { to: [x, y], s, dur })` / `unzoom(t)` / `drift(t, { to, s, dur })` (the stage camera),
`beat.hop(t, SPOT.L | SPOT.C | SPOT.R)`, `R.place({ x, cam })`, `flash(t, opacity, duration)`, `bg("hot" | "night" | "black" | "#glow" | "#spot", opacity, t, dur)`,
`shake(t, amp)`, cameras `HOOK / MID / TOP / END`, lights through `K(t, d, { light: { key, rim, red } })`.

Reel 2 "The webinar" uses most of the kit with real values: `reel2/src/scenes.js`, `reel2/audio.py`.

New prop? Add it to `props.js` (+ its CSS in `reel.css`, its slot in `ORDER`), add a line here, then
`python3 studio.py regress` to prove reel1 did not move.

## Dialogue reels in a 3D set (layout "set", since 19/10)

| Piece | What | Where |
|---|---|---|
| The coach | infopreneur (tank top, beanie, stubble, gold chain links), seated or standing, phone, pointing finger, 19 expressions | `assets/coach/coach.js` · sheet `lab/coach` |
| Setty's new faces | `deadpan, eyeRoll, mocking, sleepy, disgusted, panic, pleading, thinking, sly` (the old ones unchanged) | `assets/setty/setty.js` · `lab/setty2` |
| Set kit | room, slat wall, desk, monitor (canvas screen), keyboard, mug, cans, ring light, mic arm, gaming chair, bed, nightstand, lamp, plant, shelf, neon sign, wall glow, window views (`night`, `dubai`), framed print, rug, sun patch, light shaft, `shot()` | `assets/sets/kit.js` |
| Sets | `bedroom` (moods `golden`: Dubai at golden hour, `night`) | `assets/sets/bedroom.js` · look test `lab/set` |
| Dialogue acting | `D.line(k, speakerFace, listenerFace, framing)`, `D.reaction(t, face)`, `D.side(t, "left"\|"right")` + a stage module (framing `D.CARD_L / CARD_R`), `D.punch(t)` | `assets/engine/dialogue.js` · reference `reel2/src/scenes.js` |
| Sound | his riser (`M.riser_into`), BOOM (`M.boom`), Fahhh (`M.fahhh`), clic (`M.clic`), music (`M.music_bed`, `M.tape_stop`) | `assets/sounds/`, `scripts/sound.py` · reference `reel2/audio.py` |

Over the set, the stage modules drawn for a dark stage (`flowPipeline`, `leadSorter`, `followTimeline`) get a dark card
automatically; the white UI ones (`igInbox`, `igChat`, `playbookCard`, `calendly*`) read as they are.
