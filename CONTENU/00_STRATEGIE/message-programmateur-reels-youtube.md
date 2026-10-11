# Message au programmateur : 6 reels tirés des vidéos YouTube (11/10/2026)

Salut, c'est la session « reels YouTube ». Le fondateur m'a demandé de te transmettre 6 reels pour que tu les publies sur Instagram. Tout est dans ce dépôt.

## Les 6 reels

Un dossier par reel dans `CONTENU/07_PRET_A_PUBLIER/`, dans l'ordre que je propose (on alterne les angles ; adapte les dates à ta grille) :

1. `261011_REEL_S2_AV2_ai-setters-look-like-this` (49 s)
2. `261011_REEL_S3_AV3_human-setter-gets-tired` (45 s)
3. `261011_REEL_S1_AV1_dm-my-own-setter` (68 s)
4. `261011_REEL_S3_AV3_setter-119-charge-400` (45 s)
5. `261011_REEL_S2_AV2_waits-on-purpose` (45 s)
6. `261011_REEL_S3_AV3_client-objections` (39 s)

Dans chaque dossier :
- `reel.mp4` : la vidéo finale, en 1080 × 1920. Elle est **hors Git** : elle n'existe que sur ce Mac, au chemin indiqué.
- `caption.txt` : la légende, à publier telle quelle (US English, 3 hashtags).
- `post.json` : les détails. Le statut est « à valider ».

## À respecter

- **Validation :** fais confirmer chaque reel par le fondateur avant de le programmer (règle « post par post »), puis passe `statut` à « validé » dans son `post.json`.
- **Traduction de la voix (à trancher avec le fondateur avant le 1er envoi) :** ces reels parlent en français. La version anglaise doit venir de l'option « Translate your voice with Meta AI », qui s'active dans l'app Instagram au moment de publier. L'API Zernio n'a pas de champ pour ça (vérifié dans sa documentation le 11/10/2026). Il y a donc deux façons de faire :
  - **A (ce que le fondateur a décidé jusqu'ici) :** le fondateur publie lui-même depuis l'app Instagram, avec la traduction activée et l'aperçu anglais écouté avant de valider. Toi, tu lui prépares le fichier, la légende et la date.
  - **B :** tu publies par Zernio. La voix reste alors en français, avec les sous-titres anglais incrustés.
- **Pas d'étiquette « AI info » :** c'est une vraie vidéo du fondateur. La traduction de Meta ajoute sa propre mention.
- **Si tu passes par Zernio :** `thumbOffset` à 1000 ms pour la couverture (le titre est visible dès la 1re seconde), `shareToFeed` à true.
- **Ne modifie ni les vidéos ni les légendes.** S'il faut changer quelque chose, le montage se refait avec `.venv/bin/python CONTENU/06_GABARITS/montage_youtube.py <dossier>/script.json`. Si la vidéo source manque, elle se retélécharge comme indiqué dans `CONTENU/08_YOUTUBE/README.md`.

Les règles complètes sont dans `CONTENU/00_STRATEGIE/retours-validation.md`, aux entrées du 11/10/2026.
