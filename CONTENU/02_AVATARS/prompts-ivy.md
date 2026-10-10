# Prompts d'Ivy, dans l'ordre

> Un prompt à la fois, en copier-coller. Chaque image générée est enregistrée sous le nom indiqué, dans `CONTENU/02_AVATARS/ivy/`.
> **Étape 1 d'abord** : tant que la planche n'est pas validée, on ne génère rien d'autre. Toutes les images suivantes s'appuient sur elle.

---

## Étape 1 · La planche de référence (ChatGPT ou Nano Banana)

**Fichier : `ivy_planche.png`**

```
Character reference sheet, landscape 3:2, plain warm light-gray seamless background, soft even studio light, photorealistic.

The character: Ivy, a woman around 28 years old, warm light-brown skin, dark brown eyes, a very short bleached platinum buzz cut (almost white, even length all over the head, clean natural hairline), strong dark natural eyebrows that contrast with the platinum hair, light freckles across her nose and cheekbones, very light makeup, friendly and slightly amused expression. She always wears an oversized cream chunky-knit crewneck sweater with slightly long sleeves, small gold hoop earrings, and bright orange over-ear headphones (hex #ff611d) resting around her neck. Dark straight-leg jeans and white sneakers.

Layout, all the same person with identical face, platinum buzz cut, skin tone, outfit and headphones:
1. head and shoulders, facing camera, neutral friendly expression
2. head and shoulders, three-quarter view left
3. head and shoulders, profile right
4. full body standing, facing camera, relaxed pose
5. a row of 4 small close-up expressions: laughing, raised eyebrow, skeptical squint, warm smile

Photorealistic, natural skin texture, realistic hands with five fingers, true-to-life colors.
No text, no letters, no labels, no logos, no watermarks, no brand names on any object.
```

Vérifier avant de valider : le visage est identique dans les 5 vues, le buzz cut est bien platine et très court partout (pas de cheveux longs ni de mèche), les sourcils restent foncés, le casque est bien orange vif, les mains ont cinq doigts, aucun texte n'apparaît.

---

## Étape 2 · Le pack de 3 références pour Google Flow

Joindre `ivy_planche.png` à chaque prompt.

**Fichier : `ivy_ref_visage.png`**

```
Square 1:1 photo. Use the attached character sheet as the only identity reference: this is Ivy. Keep her face, skin tone, freckles, platinum buzz cut, cream knit sweater and orange headphones around her neck exactly as on the sheet.

Tight head-and-shoulders portrait, facing the camera straight on, eye level, soft natural window light from the left, neutral warm background slightly out of focus. Relaxed friendly expression, mouth closed.

Photorealistic, natural skin texture, true-to-life colors. No text, no letters, no logos, no watermarks.
```

**Fichier : `ivy_ref_buste.png`**

```
Vertical 4:5 photo. Use the attached character sheet as the only identity reference: this is Ivy. Keep her face, skin tone, freckles, platinum buzz cut, cream knit sweater and orange headphones around her neck exactly as on the sheet.

Three-quarter view from mid-chest up, body turned slightly to her right, face toward the camera, soft natural light, warm home interior softly blurred behind her. Slight amused smile.

Photorealistic, natural skin texture, realistic hands with five fingers, true-to-life colors. No text, no letters, no logos, no watermarks.
```

**Fichier : `ivy_ref_pied.png`**

```
Vertical 9:16 photo. Use the attached character sheet as the only identity reference: this is Ivy. Keep her face, skin tone, freckles, platinum buzz cut, cream knit sweater, orange headphones around her neck, dark jeans and white sneakers exactly as on the sheet.

Full body, standing in a cozy home office in the evening, warm desk lamp light, a wooden desk with a laptop and a phone on a stand behind her. She holds her phone in one hand at waist height, looking at the camera with a half smile.

Photorealistic, natural skin texture, realistic hands with five fingers, true-to-life colors. No text, no letters, no logos, no watermarks, no readable screens.
```

---

## Étape 3 · Les images de départ des reels (Flow, Nano Banana)

Joindre les 3 références. Ces images servent de première image en **Frames to Video**.

**Fichier : `ivy_depart_face-camera.png`** (série « Do you have a…? »)

```
Vertical 9:16 frame, 1080x1920. Ivy, exactly as in the reference images, sits at her wooden desk in a cozy home office in the evening, warm desk lamp light, framed from mid-chest to just above her head, like a phone propped on the desk filming her. She looks straight into the camera, eyebrows slightly raised, about to say something. Her face sits in the upper middle of the frame, around 35% from the top. Behind her: a plant, a mug, a laptop with a blurred screen.

Photorealistic, natural skin texture, realistic hands with five fingers, true-to-life colors.
No text, no letters, no logos, no watermarks, no brand names on any object, no readable screens.
Leave clean, visually calm space in the bottom 30% of the frame for captions.
```

**Fichier : `ivy_depart_3am.png`** (série « 3 a.m. shift »)

```
Vertical 9:16 frame, 1080x1920. Ivy, exactly as in the reference images, at her desk late at night, the room dark except for the warm desk lamp and the glow of her phone. She has the orange headphones on her ears now, and she types on her phone with both thumbs, focused, a tiny smile. A wall clock in the background is blurred and unreadable. Framed from the waist up, slightly off-center, handheld phone feel.

Photorealistic, natural skin texture, realistic hands with five fingers, true-to-life colors.
No text, no letters, no logos, no watermarks, no readable screens.
Leave clean, visually calm space in the bottom 30% of the frame for captions.
```

---

## Étape 4 · Premiers plans vidéo test (Google Flow, Frames to Video)

**Fichier : `ivy_test_01_face-camera.mp4`** (départ : `ivy_depart_face-camera.png`, mode qualité)

```
Ivy looks into the camera and says, with a dry, amused tone: "Do you have a notes app full of DM replies you copy-paste? Be honest, I've seen your inbox." She tilts her head on "Be honest" and gives a small knowing smile at the end.

Her voice: warm American female voice, mid-low pitch, quick and confident delivery, dry playful humor, clear diction, natural pauses, no vocal fry, no accent other than General American.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only besides her dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**Fichier : `ivy_HOOK_01_lit-son-telephone.mp4`** (départ : `ivy_depart_face-camera.png`, mode rapide, plan muet)

```
Ivy glances down at her phone on the desk, it buzzes again and again, she raises her eyebrows, then looks up at the camera with a "can you believe this" expression.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**Fichier : `ivy_CTA_01_met-le-casque.mp4`** (départ : `ivy_depart_3am.png`, mode rapide, plan muet)

```
Ivy, at her desk at night, slides the orange headphones from her neck onto her ears, cracks her knuckles playfully, picks up her phone and starts typing fast with a confident little smile.

Vertical 9:16, slight handheld feel, warm lamp light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

---

## Étape 5 · Images de carrousel (modèle, ChatGPT ou Nano Banana)

Pour la 1re slide d'un carrousel (`"photo"` dans la fiche). Joindre les 3 références, remplacer la scène entre crochets. **Fichier : `CONTENU/05_BANQUE_IMAGES/ivy_<slug>.png`**

```
Vertical 4:5 photo, 1080x1350. Ivy, exactly as in the reference images (same face, freckles, platinum buzz cut, cream knit sweater, orange headphones around her neck).

Scene: [a candid smartphone photo of Ivy at her desk, what she does, her expression, 2 or 3 telling objects].

Lighting and look: ordinary warm indoor light, colors exactly as a phone renders them, light grain, no cinematic grading. Framing from the waist up, eye level, slightly off-center, her face in the upper half of the frame.

Keep the lower 45% of the image visually simple and darker for a text overlay added later. Keep the outer 10% on every side free of key elements. No text, no letters, no logo, no watermark, no brand names, no readable screens.
```

Quand ces 3 plans sont générés, les déposer dans le dépôt (ou me les envoyer) : je vérifie la constance du visage et de la voix, puis je lance la banque de plans complète (une vingtaine de plans HOOK, BODY et CTA).
