---
name: setty-reel
description: Make a ManySetter reel starring Setty (9:16, 25–30 s, insolent, Charon voice) from an idea or a hook, with the studio kit in CONTENU/09_STUDIO_SETTY (studio.py). Use for any new Setty reel, a series variant (webinar, VSL, live…), edits to an existing one, or improving the shared kit.
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

## 1. Script ✋

- `python3 studio.py new reelN <slug>` creates the reel (hook + CTA already acted and sounded) and `writing/reelN_<slug>.md`.
- Write the script with CLAUDE.md § 5: the signature hook naming his format, 3–4 physical pain images in the
  coaches' words, the dead-serious turn on black, "Plug me into Manychat." + 3 true facts, the bleeped roast, the CTA
  (check § 2: "Comment SETTY" only if the keyword answers on the publishing account).
- 85–90 words, ≤ 3 bleeps, facts from § 1 only. The table: line (EN) / sens (FR) / on screen / verbatim ids.
- Show it to Grégoire. Wait for his go (or his edits): the go also authorises the paid voice for this script.

## 2. Voice

- Write `vo/reelN_segments.json` (one segment per line, each with a delivery direction).
- `python3 studio.py voice reelN --yes`: 3 takes in parallel, Whisper, tight pauses, timing; it keeps the best take
  (every word right, 25.5–29.5 s). If a key word is swallowed, give its pause room in `BEATS` (scripts/voice.py).

## 3. Picture and sound

- `reelN/build.py`: name the cues of the middle scenes (`find("word")`), tune the auto chunks (accent, hero,
  display for numbers, hide when a prop says the word), set the third bleep.
- `reelN/src/scenes.js`: for each line, Setty's face (`K` + a preset), a camera move, one prop or one UI card, a flash
  on hard cuts. Props first from `PROPS.md`; a new one goes into `props.js` (and the catalogue). Real UI only.
- `reelN/audio.py`: the beat sections (stop on the comedic beats, drone under the turn), one SFX per motion (PROPS.md
  gives each prop's sound), never on a word onset.
- `python3 studio.py go reelN`, read the contact sheets, fix, repeat. Check: framing, captions readable and in the
  safe zone, nothing under the IG buttons, every scene lands on its word, Whisper understands every word of the mix.

## 4. Render ✋

- `python3 studio.py render reelN` (30 fps), then fill `reelN/reel.json` (pub_id `AAMMJJ_REEL_S?_AV?_slug`, funnel,
  segment, avatar, biases, verbatims, caption with the words the target searches, 3 hashtags max, "not affiliated"
  line if Manychat is named) and `python3 studio.py deliver reelN`: 2 MP4s + QA + `07_PRET_A_PUBLIER/<pub_id>/`.
- Send both files to Grégoire. After his notes: fix, `render reelN --fps 60`, `deliver reelN`.
- Every note of his becomes a dated rule in `retours-validation.md` before the fix. Commit and push the sources
  (not the videos). Nothing is published or scheduled without his explicit go, post by post.
