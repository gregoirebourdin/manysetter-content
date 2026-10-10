# Outils de recherche des verbatims

Scripts gratuits utilisés le 10/10/2026. Les pages téléchargées ne sont **pas** versionnées (volume, droits) : on les retélécharge dans un dossier de travail hors du dépôt, puis on vérifie.

| Script | Rôle |
| --- | --- |
| `crawl.py <file> <dossier>` | Télécharge des flux RSS Reddit, **une requête toutes les 65 s** (Reddit refuse plus). Une ligne par URL : `nom https://www.reddit.com/...rss`. Recherche : `/r/<sub>/search.rss?q=...&restrict_sr=1&limit=100`. Commentaires d'un fil : `<url du fil>/.rss?limit=100`. |
| `mc_extract.py <url> <page.html>` | Extrait les messages d'un fil du forum de la communauté Manychat (liste complète des fils : `https://community.manychat.com/sitemap-topics-1.xml`). |
| `rss_filter.py <flux...>` | Garde les posts qui parlent de DM, leads, setter, appels. `OUT=fichier.json` pour les enregistrer. |
| `comments_read.py <flux...>` | Affiche les commentaires d'un fil, avec leur lien. |
| `build_corpus.py <dossier>` | Rassemble tout le texte téléchargé en `corpus.json` (lien → texte). Un dossier `manual/` accueille le texte copié depuis le navigateur (une ligne `URL: ...` puis le texte). |
| `verify_remote.py corpus.json lot.json` | Même vérification pour un lot de citations avec coupes « (…) » ou retours à la ligne « / » : chaque morceau doit figurer dans la source. Pour une page lisible seulement dans le navigateur (Trustpilot, Freelancer, LinkedIn), on teste la phrase exacte dans le texte affiché de la page, et on note `"verif": "navigateur"`. |
| `verify.py corpus.json verbatims.jsonl` | Vérifie que **chaque citation figure mot pour mot** dans sa source. Toute citation ajoutée passe ce test avant d'entrer dans la base. |

Ce qui ne marche pas depuis cette machine : l'API JSON de Reddit et ses archives (bloquées), Reddit dans le navigateur intégré (refusé), Trustpilot en ligne de commande (à lire dans le navigateur). Toujours lancer les scripts Python avec `python3 -I` sur des fichiers téléchargés.
