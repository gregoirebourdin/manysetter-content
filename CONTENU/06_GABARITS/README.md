# Gabarits de fabrication

## `carrousel.py` : les carrousels du feed (1080 × 1350), style éditorial

- **Habillage (19/10/2026)** : `"style": "grid"` dans `post.json` ajoute un habillage premium (quadrillage fin effacé au centre, lueur orange douce, repères de coupe, léger grain ; plus de petits motifs, retour du 19/10). Bloc `{"code": ..., "file": ...}` pour les carrousels tuto (fenêtre de code sombre). Sans `style`, une fiche sort comme avant.

**C'est le gabarit des carrousels depuis le retour du fondateur du 10/10/2026** : copier la structure et le style du post de référence (instagram.com/p/Dcgl8i7CvDT), en gardant les couleurs ManySetter et le surlignage orange.

```bash
python3 CONTENU/06_GABARITS/carrousel.py CONTENU/07_PRET_A_PUBLIER/<id>/post.json
```

Écrit `slide-01.png`… et `apercu.png`. Refuse une fiche avec un tiret cadratin ou demi-cadratin, « ManyChat » ou « alternative », et une slide trop chargée (il faut alors raccourcir le texte ou réduire une image).

Le style :
- titres en Instrument Serif (licence OFL) étirée de 16 % en hauteur, en minuscules ; `*mots*` en italique avec le surligneur orange sous le bas des lettres (en orange sur fond noir) ;
- texte courant en Inter, parlé, **à la première personne**, en minuscules, aligné à gauche, phrases simples et une phrase drôle de temps en temps ; `**gras**` pour la phrase-thèse ; gros mots masqués en écrivant `\*` (« h\*ll », « d\*mn ») ;
- **le texte remplit la slide** : le script essaie la plus grande taille qui tient (jusqu'à 1,6 ×), le texte d'abord, les images grandissent à peine ; un titre ne finit jamais par un mot tout seul ;
- une idée = une slide de texte, souvent suivie d'une slide visuelle épurée : graphique (`quadrant`, `curve` avec `gap`, `compare`, `dots`), capture du produit (`03_PRODUIT_REF/site/`), écran DM (`05_BANQUE_IMAGES/ecrans/`), collage de deux images ;
- une slide noire pour la phrase choc ; une « quick pause » qui présente ManySetter avec une capture ; ni numéro de slide ni logo ; CTA en texte à la dernière slide (« build your setter free, link in bio » tant que ManySetter n'est pas branché sur le compte).

Une slide : `{"bg": "white" | "black", "blocks": [...]}`. Blocs : `title` (+ `size`), `heading`, `lead`, `text` (+ `align`), `label`, `caption`, `spacer`, `image` (+ `width`), `collage` (+ `width`), `chart`, `vote` (`incoming`, `options`), `list` (+ `start`), `chat` (bulles lead / réponse), `photo` (portrait arrondi + @, cadre « photo à déposer » si le fichier manque), `versus` (deux visages et « vs », pour les battles). Détail dans l'en-tête du script ; exemples : les 3 carrousels du 10/10 dans `07_PRET_A_PUBLIER/`.

## `slides.py` : écrans DM et ancien style

Ancien gabarit des carrousels (refusé le 10/10/2026 pour le feed). Il sert encore à dessiner les **écrans** (conversation DM, boîte de réception, appli Notes) rangés dans `05_BANQUE_IMAGES/ecrans/<nom>/`, que `carrousel.py` et `reel.py` reprennent comme images.

```bash
python3 CONTENU/06_GABARITS/slides.py CONTENU/05_BANQUE_IMAGES/ecrans/<nom>/post.json
```

Écrit `slide-01.png`… et `apercu.png` (planche pour la revue) à côté de la fiche. Le script refuse une fiche qui contient un tiret cadratin ou demi-cadratin, « ManyChat » ou le mot « alternative ». Il choisit lui-même la plus grande taille de texte qui tient, et centre le bloc (la vignette 3:4 du profil coupe les bords).

Dépendance : Pillow (`pip install pillow`). Polices dans `fonts/` (Nohemi pour les titres, Inter pour le texte), copiées sans modification : la licence Nohemi interdit de modifier les fichiers.

### La fiche `post.json`

```json
{
  "id": "261014_CAR_S1_AV1_comment-guide-flood",
  "theme": "light",
  "caption": "…",
  "slides": [ { "type": "hook", … }, … ]
}
```

`theme` vaut `light` (fond `ink-50`) ou `dark` (fond `ink-950`). Chaque slide peut le surcharger. Une slide `hook` peut recevoir `"photo": "chemin/relatif/a/la/fiche.png"` : la photo remplit la slide, un dégradé sombre monte du bas et le texte s'y pose en clair (les images de Seth prévoient une zone calme en bas pour ça). Dans un titre, `*ces mots*` sont soulignés en orange (1 à 3 mots, pas sur chaque slide).

| Type | Champs | Usage |
| --- | --- | --- |
| `hook` | `kicker` (option), `title`, `sub` (option) | 1re slide : la question de vécu en gros |
| `text` | `kicker`, `title`, `body` | une idée, une explication |
| `list` | `kicker`, `title`, `items[]`, `style` (`numbers` ou `checks`) | « Things I did before », red flags, in/out |
| `notes` | `title`, `items[]` | capture lo-fi façon appli Notes (toujours fond blanc) |
| `dm` | `label`, `contact`, `channel`, `messages[]` (`from`: `lead` ou `setter`, `text`, ou `note` pour une ligne d'heure), `caption` | une conversation DM. Toujours `label: "Example conversation"` si elle n'est pas réelle |
| `inbox` | `label`, `title`, `rows[]` (`name`, `text`, `time` ; `*mots*` en orange) | liste de conversations façon messagerie, surtout comme plan « écran » d'un reel |
| `vote` | `kicker`, `title`, `incoming`, `options[4]`, `footer` | « 4 replies, which one books the call? » |
| `cta` | `title`, `keyword` (option), `body`, `button` (option), `button_note` (option, « Link in bio » par défaut), `signature` | dernière slide, avec la signature ManySetter. Tant que ManySetter n'est pas branché sur le compte, pas de `keyword` : un `button` « Build my setter free » et « Link in bio » (retour du 10/10/2026) |

Exemple complet : `exemples/vote-4-replies/` (fiche + rendu). C'est un test du gabarit, pas un post validé.

## `revue.py` : la page de revue

```bash
python3 CONTENU/06_GABARITS/revue.py CONTENU/00_STRATEGIE/revues/AAAA-MM-JJ_revue.html CONTENU/07_PRET_A_PUBLIER/<id1> CONTENU/07_PRET_A_PUBLIER/<id2> ...
```

Écrit la page (posts rendus comme sur Instagram, légende complète, OK / À corriger, note par post, bouton « Copier les retours », bascule « Flouter la marque » pour la story, onglet Profil lu dans `00_STRATEGIE/profil.json`) et affiche la carte des images à publier. On la publie comme Artifact avec la capacité `db` : les retours vont dans la collection `reviews` (un document par post), que Claude relit avec ArtifactData. Page du lot 1 : https://claude.ai/artifact/Cq253dMMfmwdycRbwF5FSM

## `reel.py` : les reels (1080 × 1920)

```bash
python3 -m venv .venv && .venv/bin/pip install faster-whisper pillow     # une seule fois
.venv/bin/python CONTENU/06_GABARITS/reel.py CONTENU/07_PRET_A_PUBLIER/<id>/script.json
.venv/bin/python CONTENU/06_GABARITS/reel.py --transcribe <vidéo ou audio> --out texte.txt
```

Voix off (`voix.wav` dans le dossier du post) → découpe des blancs de plus de 0,3 s (ffmpeg `silenceremove`) → horaire de chaque mot (faster-whisper, modèle `small.en`) → un plan par phrase du script, calé sur la voix → sous-titres mot à mot (1 à 3 mots) et titre fixe dessinés avec Pillow, dans la zone sûre (rien dans les 270 px du haut ni les 650 px du bas) → `reel.mp4` en H.264 30 i/s + `montage.json` (horaire de chaque plan). Les plans « écran » (`fit: contain`) sont recadrés sur leur contenu et posés dans la moitié haute.

- `--tts` : voix système de remplacement quand `voix.wav` manque, et cartons « plan à générer » pour les plans absents de la banque. La sortie s'appelle alors `reel_maquette.mp4` : elle sert à valider le rythme, jamais à publier.
- `--music` : musique très basse sous la voix (on la choisit normalement au moment de programmer).
- `--transcribe` : transcrit n'importe quelle vidéo ou voix (veille).
- Les vidéos et fichiers de travail (`_build/`) restent hors Git.

La fiche `script.json` : `title` (titre fixe, option), `voice`, `lines[]` = `{text, shot, fit, zoom}`. Un plan `HOOK/…`, `BODY/…`, `CTA/…` vient de `04_BANQUE_BROLL` (liste et prompts : `02_AVATARS/banque-plans-seth.md`).


## `montage_ecran.py` : une vidéo horizontale du fondateur rendue dynamique (1920 × 1080)

Pour un enregistrement d'écran avec sa bulle webcam incrustée (demande du 26/10/2026, première vidéo : `08_YOUTUBE/ads-to-dm/`).

```bash
.venv/bin/python CONTENU/06_GABARITS/montage_ecran.py CONTENU/08_YOUTUBE/<dossier>/montage.json --apercu   # planche des zooms
lockf /tmp/setty-heavy.lock .venv/bin/python CONTENU/06_GABARITS/montage_ecran.py CONTENU/08_YOUTUBE/<dossier>/montage.json
```

- **Coupes** : mêmes règles que les reels YouTube (jamais dans un mot, blancs de plus de 0,45 s raccourcis, `couper` pour les faux départs et les reprises) ; `coupes.json` liste toute coupe où la voix serait encore audible.
- **Cadres** : `cadre` (la page sans la barre d'outils, bulle entière) ; à chaque jump cut, alternance 100 % et `pousse` ; `zooms` sur les éléments de la page nommés dans `elements` ; `visage` met la bulle en grand sur la page floutée.
- **Un zoom ne tranche jamais une ligne de texte** (`lignes`, mesurées au pixel par page ; un titre se montre en entier ou pas du tout), garde la bulle entière ou l'évite, et reste dans la fenêtre. Un élément coincé entre le titre et la bulle prend un `zoom` imposé (2,2).
- **Son** : voix traitée, le BOOM du fondateur sur `booms` (calé sur l'attaque réelle du mot), son clic à chaque page, -14 LUFS.
- Chaque plan est encodé à part dans `_build/plans/` : une retouche ne refait que les plans changés.
