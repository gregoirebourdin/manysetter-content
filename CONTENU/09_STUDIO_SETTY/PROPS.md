# Prop catalogue (`assets/engine/props.js`)

Every on-screen object of reel1, reusable as is. Call them from `<reel>/src/scenes.js` with times taken from the
cues (`C.word ± offset`). Each prop mounts once per reel, in its paint slot (`ORDER` in `engine.js`), and adds its
tweens to the reel's timeline. The "Sound" column is what reel1 placed in `audio.py` for it (copy it, retime it).
Reference calls with real values: `reel1/src/scenes.js` and `reel1/audio.py`. See them in motion:
`deliverables/reel1/reel1.mp4` (local) or `python3 studio.py snap reel1`.

| Prop | Shows | Call (reel1 values) | Framing | Sound (reel1) |
|---|---|---|---|---|
| `marquee` | the format in giant type behind Setty, two rows sliding | `kit.marquee(R, { text: "5-DAY CHALLENGE", at, out })` + flash | MID | `impact_word(46)` on the word − 0.03, `swish(0.6)` |
| `livePill` | red LIVE pill + DAY counter flipping 1 → 5 | `{ at, out, days: { t0, t1, from: 1, to: 5 } }` | MID | `pop()` in, `woodblock` per day |
| `ecg` | heart monitor drawing 3 beats, then a red flatline | `{ at, dead, out, draw }` | MID | `M.ecg_beeps(voice_t, dead_t)` |
| `ringLight` | ring light around Setty (follows him), hot background, flicker | `{ at, out }` | MID | `hum(1.0)`, `thump(90)`, 4 `click()` on the flicker |
| `dmRain` | 40 DM bubbles ("info?", "price?"…) rain and pile on Setty, then drain | `{ t0, spawnEnd, drop, t1, texts }` (build it last) | MID only | `M.ping_storm(t0, t1)` |
| `giantBubble` | a giant chat bubble slammed on screen, thrown down | `{ text: "info?", at, out }` + flash | MID | `impact(52)`, `whoosh` in, `whoosh` down |
| `iconBadge` | orange round badge with any Lucide icon, wiggle | `{ icon: "hand", at, wiggle, out }` | MID / close | `pop()`, 5 `woodblock(900)` on the wiggle |
| `nightClock` | big glowing "00:00" on a night background | `{ text, at, night, blink, out }` + flash | MID | 3 `woodblock` ticks |
| `bed` | a bed rising behind Setty | `{ at, out }` | MID | `boing(150, 420)` |
| `blackCut` | hard cut to black + red spot, back to the hot stage at `until` | `{ at, until, hide: ["#bed", "#bg-night"] }` + flash | close-up, red rim light (`light: { key: 0.8, rim: 7, red: 1 }`) | `scratch()` before, `M.drone(at, until)` |
| `tapes` | two warning tapes slamming across ("HOSTAGE SITUATION · DO NOT CROSS") | `{ text, t1, t2, out }` | with `blackCut` | `whoosh` + `impact(48)` / `impact(40)` per tape |
| `manychatPlug` | Manychat pill, a cable grows from Setty's tail, spark, "Connected" | `{ at, cable, connect, out }` + flash | MID | `riser`, `impact(46)`, `key_click`, `zap`, `blip("recv")` |
| `playbookCard` | real Playbook card: sales page read, bar fills, facts, "Learned" | `{ at, fill, fillDur, chips, learned, out, page, facts }` | TOP | scan sweep, `sparkle(0.6)` on "Learned" |
| `dmThread` | real DM thread: lead / typing / setter bubbles, chips ("Qualified"), auto-scroll | `{ at, out, handle, initials, messages: [{ lead, at }, { typing, at, hide }, { setter, at, chip, scroll }] }` | TOP | `blip("recv")` per lead message, 3 `key_click` while typing, `blip("send")` per reply |
| `bookedCard` | "Call booked" card slammed in | `{ at, out, title, detail }` + flash | TOP | `impact_word(52)`, `sparkle(1.0)`, noise burst |
| `confetti` | brand-colour confetti burst | `{ at, x, y, n }` | any | (with bookedCard) |
| `weekCalendar` | real week calendar (Calendly chip), the booked event drops in, others pop | `{ at, drop, out, tool, events }` | TOP | `whoosh` in, `thump(200)`, 3 `pop()` |
| `moonZzz` | moon + floating "z z" | `{ at, out }` | close | `sparkle(0.9, 80, 96)` |
| `commentBar` | IG comment bar typing the keyword, send | `{ keyword: "SETTY", at, caret, type, step, send, out }` (type after the word is said) | MID | 5 `key_click` on the typing, `blip("send")` |
| `notification` | phone notification sliding down ("setty · slid into your DMs") | `{ title, text, at }` + flash | any | 2 `ping` |
| `endCta` | orange end pill with a bouncing arrow | `{ text: "Comment SETTY", icon: "arrow-down", at }` | END | `pop()`, `sparkle(0.8)` |

Stage helpers (engine): `flash(t, opacity, duration)`, `bg("hot" | "night" | "black" | "#glow" | "#spot", opacity, t, dur)`,
`shake(t, amp)`, cameras `HOOK / MID / TOP / END`, lights through `K(t, d, { light: { key, rim, red } })`.

New prop? Add it to `props.js` (+ its CSS in `reel.css`, its slot in `ORDER`), add a line here, then
`python3 studio.py regress` to prove reel1 did not move.
