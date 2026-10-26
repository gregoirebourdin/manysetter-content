# Vidéos YouTube du fondateur → reels

Un dossier par vidéo, nommé par son identifiant YouTube. La vidéo et les images de travail restent hors Git (`.gitignore`).

## Récupérer une vidéo

Le `yt-dlp` de Homebrew (2026.03.13) est refusé par YouTube (erreur 403, ou 360p seulement). On utilise celui du `.venv` du dépôt :

```bash
.venv/bin/yt-dlp -f "bv*[height<=1080][vcodec^=avc1]+ba[ext=m4a]" --merge-output-format mp4 -o "CONTENU/08_YOUTUBE/<id>/source.%(ext)s" "https://www.youtube.com/watch?v=<id>"
.venv/bin/yt-dlp --skip-download --write-auto-subs --sub-langs fr-orig --sub-format json3 -o "CONTENU/08_YOUTUBE/<id>/source.%(ext)s" "https://www.youtube.com/watch?v=<id>"
```

Les sous-titres automatiques de YouTube (`fr-orig`) donnent l'heure de chaque mot : `transcript_fr.txt` (lecture) et `mots_fr.json` (montage).

## Dans chaque dossier

- `transcript_fr.txt`, `mots_fr.json` : le script.
- `analyse.md` : les passages candidats, classés, avec timecodes, hook, verbatims, garde-fous.
- `maquettes_*.png` : essais de mise en page.
- `montage.json` (vidéo horizontale rendue dynamique, `06_GABARITS/montage_ecran.py`) : coupes, zooms, plans visage, booms ; `coupes.json` : le contrôle des coupes ; `debrief.md` : ce qui a été fait.

Un dossier sans identifiant YouTube (`ads-to-dm/`) est une vidéo enregistrée en local, pas encore publiée.
