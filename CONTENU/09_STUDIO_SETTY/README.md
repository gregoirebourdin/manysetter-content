# Studio Setty : les reels de la mascotte

Ici se fabriquent les reels de **Setty** (mascotte 3D faite en code, voix Charon). Tout ce qui sert à plusieurs
reels est commun (moteur, accessoires, sons, contrôles) ; un reel neuf n'est qu'un script, une chorégraphie et
ses sons. Guide complet pour Claude : `CLAUDE.md`. Méthode pas à pas : la commande `/setty-reel`.

## Ce que fait Grégoire

1. **Une seule fois** : enregistrer la clé Gemini de la voix, dans son propre terminal (la clé est tapée sans
   s'afficher et n'entre jamais dans le dépôt) :

   ```bash
   mkdir -p ~/.config/manysetter && read -s "k?Clé Gemini : " && printf 'GEMINI_API_KEY=%s\n' "$k" > ~/.config/manysetter/gemini.env && chmod 600 ~/.config/manysetter/gemini.env && unset k
   ```

2. **Pour chaque reel**, deux validations : le script (tableau ligne anglaise / sens / image / verbatims), puis le
   rendu. La voix (quelques centimes) ne se lance qu'après le feu vert sur le script.

## Ce que fait Claude

| Étape | Commande (`python3 studio.py …`) | Durée sur le M1 |
|---|---|---|
| Vérifier les outils | `doctor` | 5 s |
| Créer le reel (hook signature et CTA déjà animés et sonorisés) | `new reel2 webinar` | immédiat |
| Script → validation ✋ | `writing/reel2_webinar.md` | |
| Voix : 3 prises en parallèle, contrôle Whisper, pauses resserrées, timing mot à mot | `voice reel2 --yes` | ~1 min |
| Image et son du milieu du reel | `reel2/src/scenes.js`, `reel2/audio.py` | le travail créatif |
| Construire, mixer, capturer, contrôler | `go reel2` | ~45 s |
| Rendu, puis livraison (2 MP4, contrôle qualité, dossier dans `07_PRET_A_PUBLIER`) → validation ✋ | `render reel2`, `deliver reel2` | ~1,5 min (30 i/s) |

## Où sont les fichiers

- `reelN/` : un dossier par reel (`build.py` sous-titres et repères, `src/scenes.js` image, `audio.py` son, `reel.json` fiche de publication).
- `writing/` : les scripts. `vo/` : la voix retenue de chaque reel (les prises restent hors Git).
- `assets/engine/` : le moteur et les accessoires (catalogue : `PROPS.md`). `scripts/` : son, voix, contrôles.
- `templates/reel/` : le point de départ d'un reel. `deliverables/` et `renders/` : les vidéos (hors Git).
- Le reel 1 « The challenge » est la référence : `python3 studio.py regress` prouve qu'un changement du kit ne le modifie pas.
