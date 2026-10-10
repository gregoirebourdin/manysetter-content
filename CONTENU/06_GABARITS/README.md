# Gabarits de fabrication

## `slides.py` : les carrousels (1080 × 1350)

```bash
python3 CONTENU/06_GABARITS/slides.py CONTENU/07_PRET_A_PUBLIER/<id>/post.json
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

`theme` vaut `light` (fond `ink-50`) ou `dark` (fond `ink-950`). Chaque slide peut le surcharger. Une slide `hook` peut recevoir `"photo": "chemin/relatif/a/la/fiche.png"` : la photo remplit la slide, un dégradé sombre monte du bas et le texte s'y pose en clair (les images d'Ivy prévoient une zone calme en bas pour ça). Dans un titre, `*ces mots*` sont soulignés en orange (1 à 3 mots, pas sur chaque slide).

| Type | Champs | Usage |
| --- | --- | --- |
| `hook` | `kicker` (option), `title`, `sub` (option) | 1re slide : la question de vécu en gros |
| `text` | `kicker`, `title`, `body` | une idée, une explication |
| `list` | `kicker`, `title`, `items[]`, `style` (`numbers` ou `checks`) | « Things I did before », red flags, in/out |
| `notes` | `title`, `items[]` | capture lo-fi façon appli Notes (toujours fond blanc) |
| `dm` | `label`, `contact`, `channel`, `messages[]` (`from`: `lead` ou `setter`, `text`, ou `note` pour une ligne d'heure), `caption` | une conversation DM. Toujours `label: "Example conversation"` si elle n'est pas réelle |
| `vote` | `kicker`, `title`, `incoming`, `options[4]`, `footer` | « 4 replies, which one books the call? » |
| `cta` | `title`, `keyword` (option), `body`, `button` (option), `button_note` (option, « Link in bio » par défaut), `signature` | dernière slide, avec la signature ManySetter. Tant que ManySetter n'est pas branché sur le compte, pas de `keyword` : un `button` « Build my setter free » et « Link in bio » (retour du 10/10/2026) |

Exemple complet : `exemples/vote-4-replies/` (fiche + rendu). C'est un test du gabarit, pas un post validé.

## `revue.py` : la page de revue

```bash
python3 CONTENU/06_GABARITS/revue.py CONTENU/00_STRATEGIE/revues/AAAA-MM-JJ_revue.html CONTENU/07_PRET_A_PUBLIER/<id1> CONTENU/07_PRET_A_PUBLIER/<id2> ...
```

Écrit la page (posts rendus comme sur Instagram, légende complète, OK / À corriger, note par post, bouton « Copier les retours », bascule « Flouter la marque » pour la story, onglet Profil lu dans `00_STRATEGIE/profil.json`) et affiche la carte des images à publier. On la publie comme Artifact avec la capacité `db` : les retours vont dans la collection `reviews` (un document par post), que Claude relit avec ArtifactData. Page du lot 1 : https://claude.ai/artifact/Cq253dMMfmwdycRbwF5FSM

## À venir

- `reel.py` : voix off → découpe des silences (ffmpeg `silenceremove`) → horaire des mots (faster-whisper) → calage des plans de la banque et des sous-titres, en 1080 × 1920.

