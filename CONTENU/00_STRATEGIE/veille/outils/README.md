# Outils de la veille Instagram

Gratuit, sans compte, sans clé. Testé le 10/10/2026 depuis l'appli de bureau. Instagram bloque les requêtes venant du cloud : la veille se fait toujours depuis la machine du fondateur.

## 1. Relever les posts d'un compte (navigateur intégré)

1. Ouvrir `https://www.instagram.com/<compte>/` dans le navigateur intégré. Bannière cookies : « Refuser les cookies optionnels ».
2. Exécuter `releve_profil.js` dans la page. Il renvoie une ligne par vignette (`code;type;likes;commentaires;date;légende`) et la somme des likes.
3. Coller les lignes dans `<compte>.csv` (première ligne : `#profile;<abonnés…>;sumLikes=<somme>`), puis vérifier que la somme recalculée est identique.
4. Un compte toutes les 20 s environ : Instagram bloque les rafales.

Limites connues : sans connexion, **12 vignettes seulement**, épinglés compris ; **pas de vues** ; les nombres au-delà de 10 000 sont arrondis ; certains comptes masquent leurs likes.

## 2. Calculer les médianes

`python3 -I veille_stats.py <dossier des .csv>` : repère les épinglés (liste `PINNED` à mettre à jour à la main d'après les dates), calcule la médiane des likes et des commentaires hors épinglés, et marque `★` les posts à 2 × la médiane des likes ou plus, `c` à 2 × la médiane des commentaires. Écrit `stats.json`, d'où l'on tire le `AAAA-MM-JJ_releve.csv` du dossier `veille/`.

## 3. Lire un reel image par image (navigateur local sans fenêtre)

Le panneau du navigateur intégré ne permet pas de capture quand il n'est pas affiché. On utilise donc l'outil Playwright, branché sur un Chromium local lancé ainsi (profil jetable, accessible seulement en local) :

```bash
"$HOME/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" --headless=new --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1 --user-data-dir=<dossier temporaire> --window-size=1000,900 --mute-audio about:blank
```

Puis l'outil Playwright « run code » avec `planche_reel.js` (remplacer les codes). Pour chaque reel : durée, nombre de plans et durée moyenne d'un plan (coupes détectées automatiquement), et une planche de 21 images enregistrée dans `.playwright-mcp/` (dossier ignoré par Git : les images des autres comptes ne sont jamais versionnées).

Les planches ne téléchargent rien : la page charge déjà la vidéo, on la lit.

## 4. Transcrire la voix (accord du fondateur du 10/10/2026)

1. Dans l'outil Playwright, sur la page de chaque reel retenu, lire `performance.getEntriesByType('resource')` : la piste audio est le `.mp4` du CDN Instagram dont le paramètre `efg` (base64) contient un `vencode_tag` en `…_audio`. Retirer `bytestart` et `byteend` de l'adresse.
2. Ranger les adresses dans `localStorage`, puis les sauver avec l'outil « evaluate » et son paramètre `filename` (`.playwright-mcp/audio_urls.json`).
3. Les télécharger avec `curl` dans un dossier de travail hors du dépôt, puis `.venv/bin/python CONTENU/06_GABARITS/reel.py --transcribe <fichier> --out <texte>`.
4. Dans la note de veille, ne reprendre que de courts extraits : la transcription complète reste hors Git (droits d'auteur).

## 4. Écrire les notes

Une note par veille : `AAAA-MM-JJ_veille.md` (méthode, médianes, reels lus avec la grille de la méthode, carrousels qui sortent du lot, apprentissages), et les apprentissages repris dans `../carnet-etudes.md`.
