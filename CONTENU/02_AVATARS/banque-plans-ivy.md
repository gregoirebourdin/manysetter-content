# Banque de plans d'Ivy (HOOK, BODY, CTA)

> Version 1 du 10/10/2026 : 13 plans, dont les 11 qu'appellent les 3 premiers scripts de reels (`07_PRET_A_PUBLIER/261010_REEL_*`) et 2 de réserve (`BODY_03`, `BODY_04`).
> **À ne générer qu'après** la validation de la planche d'Ivy (`prompts-ivy.md`, étape 1), du pack de 3 références (étape 2) et des 3 plans test (étape 4). Tant que ce n'est pas fait, `reel.py` monte des maquettes avec un carton « plan à générer » à la place de chaque plan.
> La méthode vise une vingtaine de plans par famille : on complète au fil des scripts.

## Comment générer

- **Google Flow, projet « Ivy »**, en **Frames to Video**, image de départ indiquée pour chaque plan (étape 3 de `prompts-ivy.md`), avec le pack de 3 références joint.
- **Mode rapide** : ce sont des plans muets, la voix off porte le reel (méthode A). Ivy ne parle pas à l'image : bouche fermée ou expressions sans paroles, pour qu'aucun mouvement de lèvres ne contredise la voix.
- Un plan fait 8 s au plus ; `reel.py` le coupe à la longueur de la phrase.
- **Nom du fichier** : exactement celui indiqué, déposé dans `CONTENU/04_BANQUE_BROLL/<HOOK|BODY|CTA>/` (les vidéos restent hors Git, voir `.gitignore`).
- Chaque prompt se termine par le même bloc, déjà inclus ci-dessous.

---

## HOOK (ce qui arrête le pouce)

**`HOOK/ivy_HOOK_01_lit-son-telephone.mp4`** (départ : `ivy_depart_face-camera.png`). Déjà donné à l'étape 4 de `prompts-ivy.md`, à reprendre tel quel.

**`HOOK/ivy_HOOK_02_entre-dans-le-cadre.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy walks into frame from the right and sits down at her desk in one quick, casual motion, as if she just remembered to film something. She settles, leans slightly toward the camera with her eyebrows raised and a knowing half smile, and holds that look, mouth closed.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`HOOK/ivy_HOOK_03_sourcil-leve.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Tight framing on Ivy at her desk. She looks straight into the camera, slowly raises one eyebrow, tilts her head a little to the side and presses her lips together, a dry "really?" expression. Small, subtle movements, mouth closed.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

## BODY (le vécu, le mécanisme)

**`BODY/ivy_BODY_01_tape-vite.mp4`** (départ : `ivy_depart_3am.png`)

```
Ivy, at her desk in the evening, types quickly on her phone with both thumbs, focused, a small confident smile. She glances up at the camera for a second, then back to the phone. The phone screen faces away from the camera.

Vertical 9:16, slight handheld feel, warm lamp light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`BODY/ivy_BODY_02_grimace.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy reads something on her phone, held low and facing away from the camera, and winces in a playful, exaggerated way, teeth clenched in an "oof" expression, then looks up at the camera with a sympathetic grimace. Mouth movements stay silent.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`BODY/ivy_BODY_03_explique-mains.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy looks at the camera and explains something with open, expressive hand gestures in front of her chest, nodding along, as if making a calm point. Her lips stay closed or barely parted, no clear speech.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`BODY/ivy_BODY_04_compte-doigts.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy looks at the camera and counts on her fingers, one, then two, then three, with a knowing little smile, raising her hand slightly with each number. Mouth closed.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`BODY/ivy_BODY_05_hausse-epaules.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy shrugs with both shoulders and opens her palms toward the camera, a resigned "what can you do" look, then lets her hands drop to the desk. Mouth closed, slight sigh.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`BODY/ivy_BODY_06_designe-cote.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy smiles at the camera, then gestures with an open hand toward the right side of the frame, as if handing something over to someone just off camera, with a small nod. Mouth closed.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`BODY/ivy_BODY_07_ecoute-casque.mp4`** (départ : `ivy_depart_3am.png`)

```
Ivy, headphones on her ears, presses one hand against an ear cup as if listening closely, nods slowly twice, then looks at her phone and smiles. Mouth closed.

Vertical 9:16, slight handheld feel, warm lamp light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

## CTA (la fin, l'invitation)

**`CTA/ivy_CTA_01_met-le-casque.mp4`** (départ : `ivy_depart_3am.png`). Déjà donné à l'étape 4 de `prompts-ivy.md`, à reprendre tel quel.

**`CTA/ivy_CTA_02_designe-bas.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy looks at the camera with a playful smile and points down with both index fingers toward the bottom of the frame, as if pointing at the comments, bouncing them lightly twice. Mouth closed.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

**`CTA/ivy_CTA_03_clin-doeil.mp4`** (départ : `ivy_depart_face-camera.png`)

```
Ivy looks into the camera, gives a small, natural wink and a quick smile, then turns back to her laptop and starts typing. Mouth closed.

Vertical 9:16, phone propped on a desk, static camera, natural light, realistic motion.
No on-screen text, no subtitles, no captions, no music. Ambient room sound only, no dialogue.
Keep Ivy's face, hair, outfit and orange headphones exactly as in the starting frame for the whole clip.
```

---

## Les plans « écran »

Les conversations et boîtes de réception d'exemple ne se génèrent pas : elles sortent de `slides.py` (types `dm` et `inbox`), dans `CONTENU/05_BANQUE_IMAGES/ecrans/<nom>/slide-01.png`, toujours marquées « Example conversation ». `reel.py` les recadre et les pose dans la moitié haute de l'image, au-dessus des sous-titres.

## La voix

Méthode A : une seule voix off par reel, toujours la même (fiche d'Ivy, partie 3). Deux options, **à décider par le fondateur** :
1. Générer la voix dans Flow (Veo) à partir du bloc voix d'Ivy, phrase par phrase, puis assembler : gratuit, mais la voix peut varier d'un plan à l'autre.
2. Une voix de synthèse fixe (outil payant) : la seule façon d'avoir exactement la même voix à chaque reel. Aucun abonnement n'est pris sans accord.

En attendant, les maquettes utilisent la voix système « Samantha » de macOS, seulement pour caler le rythme : elles s'appellent `reel_maquette.mp4` et ne se publient jamais.
