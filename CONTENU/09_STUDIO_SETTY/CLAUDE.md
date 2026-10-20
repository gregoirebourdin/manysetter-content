# ManySetter reels with Setty: the expert guide

You make vertical reels (Instagram Reels and YouTube Shorts) for **ManySetter**, starring **Setty**, its mascot.
Read this fully before touching a reel, then follow the `/setty-reel` skill (`.claude/skills/setty-reel/SKILL.md`
at the repo root). The repo's own rules apply on top (`CLAUDE.md` at the root, `retours-validation.md`, the brief,
the verbatims): when they disagree with this file, they win.

**Grégoire** (founder) speaks French: answer him in French, short and direct. The reels are in **US English**.
He decides; every direction he gives becomes a dated rule in `CONTENU/00_STRATEGIE/retours-validation.md` the same day.

**Work only on what lasts.** Each reel is different: its script, scenes and sounds are written once. Everything
reusable goes into the kit (`assets/engine/`, `scripts/`, `templates/reel/`, `PROPS.md`) so the next reel starts
further ahead, and `python3 studio.py regress` proves the kit change did not move reel1.

## 1. The product (only true claims; source: the brief and the site)

ManySetter adds an AI setter to Manychat (Instagram, WhatsApp, Messenger). Allowed facts:

- It learns your offer from your sales page, doc or FAQ: the Playbook is ready in about two minutes.
- It replies in your brand's voice, one reply once the lead has finished writing, after a reply delay you set
  (30 s to 5 min). Never sell instant replies.
- It qualifies one question at a time, handles objections ("I'll think about it"), only gives your calendar to the
  right leads, and books the call (Cal.com, iClosed, Calendly) with a summary of the lead in the event.
- Up to 3 follow-ups per lead inside the 24 h window. Hands the conversation to a person when it matters.
- $119/month per live setter. Free to build and test, no card to start; the 14-day trial when you go live asks for a
  card. Never "free trial, no card needed".
- A US appointment setter earns about $13 to $21 an hour plus commission (PayScale, May 2026, quoted on the site's
  "AI vs human setter" guide). One DM setter job post paid $1,500/month + 5%: a job post, not an average.
- Never invent numbers, testimonials or client results; numbers in UI cards are demo values. Never "a Manychat
  alternative", never a competitor's name, "Manychat" spelled so on screen (the voice script may say "ManyChat"
  for the TTS). Nothing about what the setter answers when asked if it is a bot. Inbound only.

## 2. Audience and tone (Grégoire's direction, keep it)

Coaches and infopreneurs who run **webinars, 5-day challenges, VSLs, lives**, then drown in Instagram DMs they have
no time to answer, or pay a setter. Every line comes from their own words (`docs/VERBATIMS/verbatims.md`):
`writing/<reel>_<slug>.md` gives the verbatim ids per line.

Setty is **ultra insolent, hardcore, a bit vulgar, and talks like a real human**. He goes straight into the pain
in the first second. Grégoire's words: « faut que tu sois hard, hardcore, que tu rentres cash dans le truc »,
« un poil vulgaire », « que tu parles vraiment comme un humain ». He threw out soft, generic hooks and polite pitches.

- **Signature hook, every reel:** `You did your [bleep]ing <challenge|webinar|VSL>, right?` (Grégoire cut the
  `Hey [bleep].` opener on 19 Oct; default since, unless he asks for it back).
- **Three bleeps per reel at most**: one in the hook, one in the punchline (a third only if it is the joke).
- A bleep lets the first consonant through ("b—", "f—", "sh—"), then a 1 kHz tone; a censor bar covers Setty's
  mouth (`pose.censor`) and the caption word (`.tok.bleep`).
- **CTA:** `Comment SETTY. I'll slide into your DMs.` only while the SETTY keyword really answers on the account
  that publishes (Manychat + ManySetter connected there). Otherwise Setty says "Link in bio." and the end pill
  reads the validated label "Build my setter free" (`kit.endCta`). Check before every publication.
- Funny > clever. Roast the viewer like a best friend, never punch down. The villain is the inbox, never the coach.

Series hooks: "You did your [bleep]ing webinar, right? Two hours. Twelve people stayed." · "You shot your [bleep]ing
VSL, right? Forty takes. Your mom watched it." · "You went live. Again. For the [bleep]ing algorithm, right?"

## 2b. The dialogue format (Grégoire, 19 Oct: every new reel)

Every reel is now **a real conversation between the coach and Setty**, never a monologue that sounds like an ad: the
coach (an infopreneur) talks like a human, Setty answers, insolent and funny. The product comes up because the coach
asks (his objections are the verbatims), each answer is one true fact. Two voices: Setty = Charon, the coach = **Fenrir**
(cast by Grégoire on 19 Oct, fixed). The signature hook stays Setty's first line. Script table in `writing/`: who / line /
sens / shot and screen / verbatims.

**The coach** (`assets/coach/coach.js`, same toy-like 3D language as Setty, all code): ribbed white tank top, black beanie
with a leather patch, three-day stubble, gold chain, charcoal joggers, white sneakers; he can sit (`sit: 1`) and hold his
phone (`phone: 1`). Presets: `neutral, hyped, smug, stressed (sweat drop), defeated, confused, shocked, laughing,
annoyed, skeptical, mocking (the roast, pointing), eyeRoll, panic, pleading, proud, deadpan, disgusted, thinking, sly,
pointing`; Setty gained `deadpan, eyeRoll, mocking, sleepy, disgusted, panic, pleading, thinking, sly`. Fields: `x y z turn scale squash bend lean twist nod headTurn headTilt lookX lookY pupil lidL/R
lowL/R happyL/R browLy/Ry browLa/Ra (inner end up = worried) curve smirk mouthW mouthOpen mouthRound teeth talk (lip-sync)
censor armLr/Rr armLf/Rf elbowL/R wristL/R pointL/R sit spread sweat phone`. The gold chain is ~80 real links laid
on the body by raycasting. Check every character in `lab/coach` and `lab/setty2` before showing it (Grégoire: « pas un seul bug »). Sheet: `lab/coach` (snapshot it to look).

**Sets** (`assets/sets/`): every reel plays in a styled 3D set, **a different one each time** (Grégoire: « pas juste un fond
uni »). `kit.js` holds the reusable furniture (room, wood slats, desk, monitor with a canvas screen, keyboard, mug, cans,
ring light, mic arm, gaming chair, bed, nightstand, lamp, plant, shelf, neon sign, wall glow, night window, framed print,
rug, window views `VIEWS.night / dubai / miami`, sun patch, light shaft; gym: `rubberTex`, `brickTex`, dumbbell, dumbbell rack,
flat bench, plyo box, kettlebell, shaker, towel, bumper plate, power rack, industrial pendant; `room({ floorMap, wallMap })`,
`cityWindow({ panes })` for a steel factory window); a set file (`bedroom.js`, the first, moods `golden`
(default: Dubai at golden hour) and `night`; `gym.js`, reel3: his private gym in the morning, Miami Beach through a
factory window, Setty on a plyo box) places them, its lights, the characters' spots and the camera shots
(`wide`, `coach`, `setty`, built with `shot(target, { dist, yaw, y })` so the speaker's face sits above the captions).
**Shot / reverse shot: the camera goes to whoever talks**, the other reacts. Look test: `lab/set` (bedroom) and `lab/gym` (wide + two close-ups).

**Making a dialogue reel** (reel2 v3 is the reference): `vo/<reel>_segments.json` carries `"who"` on every line (and
`"pause": 0.95` after a roast, for the Fahhh); `studio.py voice <reel> --yes --voices "coach=Fenrir,setty=Charon"` makes
takes per speaker, checks them with Whisper, tightens them (voice.py) and lays the lines in order (`scripts/dialogue.py`;
casting: `coach=A|B|C` assembles every version in `vo/_dialogue/<reel>/mix/`, `--reuse --pick B` installs one).
`reel.json`: `"layout": "set"`, `"set"`, `"mood"`, `"hook_title"`. The build adds `DATA.lines` (who, start, end) and
`DATA.lips` (mouth opening per speaker from the voice). In scenes.js, `D` (assets/engine/dialogue.js) gives `line(k,
speakerFace, listenerFace, framing)`, `reaction(t, face)`, `side(t, "left"|"right")` + an `st.*` card with framing
`CARD_L / CARD_R`, `punch(t)` on each BOOM; `R.camOf(name, { x, y, dist })`, `shotTo(t, name)`, `KC` / `faceC` act the
coach. Both characters blink on their own; dark stage modules get a card background over the set.

## 3. Setty, the character

- A living DM bubble: puffy squircle, the logo gradient (#ffa066 → #e64b15), glossy, a tail at the bottom left
  pointing down and **out**, hovering above its shadow. Big glossy eyes with real lids, arched brows, a drawn mouth
  (smile, smirk, open, "O", tongue), blush, stubby arms. The three typing dots above his head are his mood ("!").
- Voice: **Charon** (Gemini 3.8 Flash TTS). A cute bubble with a deep, confident voice is part of the joke.
  It is a realistic AI voice: publish with Instagram's "AI info" label (Grégoire's call, recommended).
- He is ManySetter's setter ("Plug me into Manychat"), never a human, never the founder. Seth (the photoreal
  character of October 10) is not used in these reels.
- Code: `assets/setty/setty.js` (Three.js, procedural, no model file). Presets: `happy, smug (signature), sideEye,
  shocked, laughing, unimpressed, wink, excuseMe, proud`. Pose fields: `lookX/lookY, lidL/lidR, lowL/lowR,
  happyL/happyR (^ eyes), slantL/R, browLy/Ry/Lr/Rr, curve, smirk, mouthOpen, mouthRound, tongue, teeth, blush,
  censor, armLr/Rr (raise), armLf/Rf (forward), dots, dotsBounce, alert, x, y, turn, tilt, lean, squash`.
- Character sheet and personality clip: `deliverables/setty/`. Lab compositions: `lab/sheet`, `lab/hello`.

## 4. Reel format

**Layout "stage" (Grégoire, 19 Oct, the default for every new reel; `"layout": "stage"` in reel.json):** the hook title
fixed at the top for the whole reel (white Instagram labels, black text, the key word in orange: `kit.hookTitle`), the
**stage** in the middle (y 480–1080) showing something real and useful (the coaches' tools, named and with their
logos: Zoom, Instagram, WhatsApp, Messenger, Calendly…; diagrams that explain: `st.*` in `assets/engine/stage.js`),
the captions just above Setty, and **Setty small at the bottom**, hopping corner to corner (`beat.hop(t, SPOT.L)`),
reacting, looking and pointing at the stage. He comes big only for an instant (a push-in on the punchline).
**Rhythm (Grégoire, 19 Oct):** the hook title as big as the width allows (`kit.hookTitle` fits each line, `pulses` on the
key beats); the stage camera zooms in toward what matters on each key word and pulls back between (`zoom(t, { to:
[x, y], s })`, `unzoom(t)`, `drift(t, …)`: the point [x, y] in screen px stays in place); modules enter by zooming in and
leave by zooming through. Something moves every 1–2 s. The title and the captions never zoom (the zoomed stage fades
out under the title).
Every reel gets its own stage visuals for its own subject: never replay another reel's sequence of props.
Reel1 keeps the older "center" layout (Setty big in the middle).

- 1080×1920, **25–30 s** by default, about **85–90 spoken words** (Charon ~3.2 words/s once the pauses are tight).
  A reel can be longer (reel2: 1 minute, 181 words): in `reel.json`, `voice_s` (target of the tightened voice, e.g.
  [54, 59.5]), `line_gap` (a breath between lines, e.g. 0.36 s) and `tail_s` (end hold, 1.6 s by default). A comedic
  beat after a line: `"pause": 0.3` on that segment in `vo/<reel>_segments.json`.
- **Frame 0 is the thumbnail**: the hook title + the stage already showing the subject + Setty smug (stage layout);
  Setty in close-up in the center layout. Never a black frame.
- Something changes on screen every ~0.5–0.8 s: a word, a prop, a camera move, a cut.
- Every spoken word is on screen (captions), except a word shown by a prop (the giant "info?" bubble).
- The last frame loops into the first (Setty centred, smug or winking; frame 0 is the close-up).
- Safe zones: captions in y 1185–1465 (centred, ≤ 920 px wide). Nothing important below y 1440, right of x ~950
  between y 900–1700 (IG buttons), or in the top 150 px (IG header), except decoration.
- Two files: with music, and without music (voice + SFX) for a trending sound added in-app.

## 5. Script recipe

1. Hook (0–3 s): the signature hook, naming the coach's exact format (and the hook title on screen says the subject).
2. Pain, made physical (3–12 s): 3–4 short, concrete images, in the coaches' words (verbatims).
3. The turn (12–15 s): a dead-serious one-liner on black ("That's not a business. That's a hostage situation.").
4. Setty's flex (15–22 s): "Plug me into Manychat." then 3 true product facts shown in the real UI.
5. Punchline (22–24 s): a roast with the third bleep ("Go to sleep. You look like [bleep].").
6. CTA (24–28 s): see § 2.

One segment per line in `vo/<reel>_segments.json`, each with its delivery direction, e.g. `"Deadpan and mocking,
short punchy beats"`, `"Suddenly dead serious, low and dramatic"`, `"Fast, confident and rhythmic, like listing
flexes"`, `"Smooth, smug, a little flirty sign-off"`.

## 6. Pipeline: `python3 studio.py <step> <reel>` (from this folder; times measured on Grégoire's M1)

| Step | Command | Time |
|---|---|---|
| Tools check | `doctor` (says exactly what to install, and the one command Grégoire types for the key) | 5 s |
| New reel | `new reel2 webinar` → `reel2/` (hook + CTA already acted, chunked, cued, sounded), `vo/reel2_segments.json`, `writing/reel2_webinar.md` | instant |
| ✋ Script | the table in `writing/` (line EN / sens FR / on screen / verbatims) → Grégoire's go | — |
| Voice (paid) | `voice reel2 --yes`: 3 Charon takes in parallel, Whisper on each, pauses tightened, word timing; keeps the take closest to 25.5–29.5 s with every word right (`--take N` reuses a take) | ~1 min |
| Picture + sound | edit `reel2/build.py` (CHUNKS, CUES), `reel2/src/scenes.js` (Setty's acting + props), `reel2/audio.py` (beat sections + SFX) | the work |
| Iterate | `go reel2`: build → audio (+ Whisper on the mix) → snapshots (contact sheet) → HyperFrames check + house rules | ~45 s |
| Look | read `reel2/snapshots/contact-sheet-*.jpg`; `snap reel2 --at 3.2,3.4` for a precise moment | 15 s |
| ✋ Render | `render reel2` (30 fps: 1 min 11 s for reel1 on the M1 GPU), then `deliver reel2`: 2 MP4s + QA (1080×1920, 25–30 s, −14 LUFS, ≤ −1 dBTP, frame 0 not black) + `07_PRET_A_PUBLIER/<pub_id>/` (reel.mp4, caption.txt, post.json) | ~1.5 min |
| Final | after Grégoire's notes: `render reel2 --fps 60`, `deliver reel2` | ~2.5 min |
| Kit change | `regress --before`, change the kit, `regress`: reel1 and reel2 must stay identical (`--reels reel2` for one) | ~2 min |

Never re-render for the no-music version (`deliver` remuxes). Commit and push after each validated step.

## 7. The kit (reuse it before inventing)

- `assets/engine/shell.html` + `engine.js`: the page every reel shares (stage, backgrounds, Setty, camera, captions,
  flash, render loop). In `scenes.js` you get `K(t, dur, {pose…, cam, light}, ease)`, `face(name, extra)`,
  `shake(t, amp)`, `beat.slam / beat.bleep / beat.pop` (acting shortcuts), `flash(t)`, `bg(name, opacity, t)`,
  cameras `HOOK, MID (z 14, Setty centred at y≈576), TOP (z 19, Setty in y 74–645, UI cards in 660–1150), END`,
  cues `C.word`, `T(i)`/`E(i)` (start/end of word i), and `kit.*` (the props).
- `assets/engine/props.js` + `reel.css`: every prop of reel1, parameterised, plus `hookTitle`, toasts, chat bubbles
  (catalogue: `PROPS.md`). A new prop goes there with a slot in `ORDER` (engine.js), never inside a reel.
- `assets/engine/stage.js` + `stage.css` + `brands.js`: the stage modules (Zoom webinar, Instagram inbox and chat, phone
  lock screen, Calendly events and confirmation, neon sign, the DMs → Manychat → ManySetter → calendar pipeline, lead
  sorter, 24-hour follow-up timeline, hand-off card, laptop) and `st.app(slug)`, glossy app icons with the official
  glyphs (Simple Icons, CC0 data). Never the Manychat logo (brief): write "Manychat".
- Stage layout helpers: `SPOT.L / C / R` (Setty's x), `beat.hop(t, x)`, `R.place({...})` (frame-0 pose),
  camera `STAGE` (and a short push-in like `{ z: 21, ly: 4.1 }` for a punchline), the stage camera `zoom / unzoom /
  drift` (modules and the real app cards live in `#stagebox`, inside `#stageclip` which fades it under the title).
- `scripts/reelkit.py`: CHUNKS (`accent`, `display`, `hide`, `hero`, `count`, `hold`), `auto_chunks(a, b)`,
  `find("word")`, the house-rule lint (dashes, "ManyChat", bleeps, uncaptioned words, length).
- `scripts/sound.py` (+ `synth.py`): voice chain + bleeps, the original half-time trap at 150 BPM with sections that
  stop on comedic beats, drone, word ticks, ping storm, ECG beeps, SFX library, ducking, master to −14 LUFS.
- `scripts/voice.py` (wav2vec2 forced alignment), `check_vo.py` (faster-whisper small.en, the repo's .venv),
  `tts_gemini.py` (Charon), `imgdiff.py` (regression).
- Brand UI: `assets/ui/ms.css` (`.ms-window`, `.ms-bubble.lead/.setter`, `.ms-typing`, `.ms-chip.green/.orange`,
  `.ms-avatar`), fonts Nohemi + Inter in `assets/fonts/`.

## 8. Hard-won rules (each one cost a render)

Picture
- Tweens read right after `seek()` (Setty pose, camera, lights) must be `lazy: false`, or jumps show stale poses.
- `fromTo` on a reused element (`#flash`) or one hidden by CSS (confetti, sparks) needs `immediateRender: false`.
- No `fetch()` and no randomness at render: data inline in `DATA`, the seeded `R.rnd()` (one shared stream:
  captions, then props in call order; reel1 builds its DM rain last to keep its exact frames).
- CSS `zoom` on a positioned element also scales its `top/left`: zoom an inner element inside an unzoomed wrapper.
- Caption stroke = `-webkit-text-stroke` + `paint-order: stroke fill` + a hard drop shadow: readable on anything.
- In a close-up, Setty's mouth sits in the caption zone: hide the caption of a bleeped word there (its own chunk with
  `hide: True`), or you get two bars.
- Keep stacks of bubbles and toasts out of the caption zone (y ≥ 1185): measure on a snapshot, shorten the text.
- Physics: Setty is a static rounded body from his projected silhouette (MID framing); no side walls; remove the
  floor and raise gravity to drain the pile.
- Pupils and glints stay inside the lid radius (1.07 × eye radius); closed eyes need the `^`/`u` arcs.
- Mark intentional off-canvas props with `data-layout-ignore` / `data-layout-allow-overflow`.
- No `../` in asset paths (HyperFrames' lint refuses it): fonts are declared in `shell.html` with `assets/...`.
- Overlapping camera tweens fight in a frame-by-frame render: when the newer move ends, the older one takes the camera
  back (reels 2 and 3: the hook jumped back at ~0.85 s, the bench cutaway lasted 3 frames). Snapshots jump straight to
  a time and never show it: check moves on frames pulled from the MP4. Fix: `"cam_track": true` in reel.json (on in
  the template since 20/10): each camera move takes over from the one before it, which stops where it was.
- Never `ctx.filter` (blur…) in a canvas painter (window views, set textures): the headless Chrome that renders ignores
  it and the whole texture comes out black (reel10). Soften with gradients.

Sound
- **Grégoire's own sounds** (`assets/sounds/`, 19 Oct; he hated a synthesized riser): `M.riser_into(t)` = his riser,
  cut so its climax lands on the end of the hook line, then his BOOM and the drop of his music (`M.music_bed(drop=t,
  play=[…])`, the track's drop at 136.2 s); `M.boom(t)` on every "dinguerie" (cues `boomN` in build.py); `M.fahhh(t)`
  right after every roast (cues `fahhhN`; give that line a `"pause"` of ~0.9 s in the segments so it never covers a
  word); `M.clic(t)` when a screen pops (cues `clicN`). No synthesized beat in new reels (the trap stays for reel1), no
  cute chimes in bursts, no tick under every word. The music's licence goes in post.json.
- Never put an SFX on a word onset: it eats the consonant ("by hand" → "buy ham"). Word ticks 0.07 s before the
  word; message blips 0.1–0.3 s before; taps after the word ends. Type the CTA keyword once it is said: reel1 typed
  under "SETTY" and Whisper heard "setting".
- The bleep ends before the next word starts. Duck the music by ~0.64 under the voice (60 ms look-ahead), SFX by 0.3.
- The beat stops under "Comment SETTY." and comes back after it: a snare on the keyword turned it into "saidy" (reel2).
- Whisper on the mix finds the culprit: if a word is fine in `mix_nomusic.wav` but not in `mix.wav`, it is the beat
  (reel2: "Manychat" → "mini chat" until the beat came back in on the spark, after the word); otherwise an SFX
  ("They" lost under a sparkle, "put" under a boing, "DMs" under the return whoosh).
- Master with a constant gain to −14 LUFS + `alimiter` (lowered automatically if the true peak passes −1 dBTP).
  Never ffmpeg loudnorm in dynamic mode. Never time-stretch the voice slower; `--rate` ≤ 1.1 only if a take is long.
- Whisper on the final mix: "four hundred" → "400", "SETTY" → "Seti" are spelling; a trailing "Thanks for
  watching" is Whisper hallucinating on the music tail, not Setty.

This Mac
- HyperFrames' own Chrome (puppeteer 121) crashes on macOS 26: `studio.py` points `HYPERFRAMES_BROWSER_PATH` to the
  Playwright headless shell (or Google Chrome). Rendering uses the M1 GPU (Metal); 8 GB RAM: `--workers 2`.
- Python steps run with the repo's `.venv` (torch 2.8 + torchaudio 2.8 pinned: `forced_align` is gone in 2.9).

## 9. Security

- The Gemini key lives only in `~/.config/manysetter/gemini.env` (`GEMINI_API_KEY=...`) or the environment, typed by
  Grégoire himself. Never in the repo, a log, or a commit. Each voice launch is paid: only after his go on the script.
- Dashboard sessions or app captures with client data never go into the repo.
