---
name: setty-reel
description: Make a ManySetter reel starring Setty (9:16, a dialogue between the coach and Setty in a 3D set, Fenrir + Charon voices) from an idea or a hook, with the studio kit in CONTENU/09_STUDIO_SETTY (studio.py). Use for any new Setty reel, a series variant (webinar, VSL, live…), edits to an existing one, or improving the shared kit.
---

# /setty-reel: from an idea to the post folder

Read `CONTENU/09_STUDIO_SETTY/CLAUDE.md` first (product facts, tone, Setty, format, kit, hard-won rules), plus the
repo's rules (`retours-validation.md`, the verbatims). Work in `CONTENU/09_STUDIO_SETTY/`, run `python3 studio.py …`.
Talk to Grégoire in French, short. Two gates ✋; between them, work alone and fast.
**Only the kit lasts**: anything reusable you build for this reel goes into `assets/engine/`, `scripts/`,
`templates/reel/` or `PROPS.md` (then `studio.py regress`), never stays buried in the reel.

## 0. Ready? (once per session)

`python3 studio.py doctor`. If the Gemini key is missing, give Grégoire the one command from the doctor (he types it
himself; never ask for the key, never type it).

## 1. Script ✋ (since 19/10: a dialogue in a set, CLAUDE.md § 2b)

- `python3 studio.py new reelN <slug>` creates the reel from the dialogue template and `writing/reelN_<slug>.md`.
- Write a **real conversation**: the coach (infopreneur) talks like a human, Setty answers, insolent; Setty opens with the
  signature hook naming the coach's format; the product only comes up because the coach asks (his objections = the
  verbatims), one true fact per answer (§ 1); Setty's last line is the CTA ("Comment SETTY" only if the keyword answers).
- Pick a **new set** (never the same twice in a row: build it in `assets/sets/` from `kit.js`) and its mood.
- Mark the sound in the table: 💥 BOOM on each "dinguerie", 😩 Fahhh after each roast, clic on each card, the music cut.
- Table: who / line (EN) / sens (FR) / shot and screen / sound / verbatim ids. ≤ 3 bleeps.
- Show it to Grégoire. Wait for his go: it also authorises the paid voices for this script.

## 2. Voices

- `vo/reelN_segments.json`: one segment per line with `"who"`, a delivery direction, `"pause": 0.95` after a roast.
- `python3 studio.py voice reelN --yes --voices "coach=Fenrir,setty=Charon"`: takes per speaker, Whisper, tightened,
  laid in order. The voices are fixed (Fenrir, Charon); cast again only if Grégoire asks (`coach=A|B|C`, then `--pick`).

## 3. Picture and sound

- `reelN/build.py`: name the cues (drop, boomN, fahhhN, clicN, the CTA), accents, hero words, display for numbers.
- `reelN/src/scenes.js`: `D.line(k, speakerFace, listenerFace, framing)` for every line (the camera on whoever talks),
  `D.reaction(t, face)` for each Fahhh, `D.side()` + a real-tool card (`st.*`, the coaches' tools with their logos) with
  `CARD_L / CARD_R`, `D.punch(t)` on each BOOM. Faces: `face()` for Setty, `faceC()` for the coach (CLAUDE.md lists them).
- `reelN/audio.py`: his music (`M.music_bed`, cut on the comedic beat with `M.tape_stop`), `M.riser_into(drop)`, the BOOMs,
  Fahhh and clicks from the cues. Nothing else.
- `python3 studio.py go reelN`, read the contact sheets, fix, repeat: faces above the captions, cards never on a face,
  nothing under the IG buttons, Whisper understands every word of the mix.

## 4. Render ✋

- `python3 studio.py render reelN` (30 fps), then fill `reelN/reel.json` (pub_id `AAMMJJ_REEL_S?_AV?_slug`, funnel,
  segment, avatar, biases, verbatims, caption with the words the target searches, 3 hashtags max, "not affiliated"
  line if Manychat is named) and `python3 studio.py deliver reelN`: 2 MP4s + QA + `07_PRET_A_PUBLIER/<pub_id>/`.
- Send both files to Grégoire. After his notes: fix, `render reelN --fps 60`, `deliver reelN`.
- Every note of his becomes a dated rule in `retours-validation.md` before the fix. Commit and push the sources
  (not the videos). Nothing is published or scheduled without his explicit go, post by post.
