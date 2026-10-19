# Logos 3D des outils (carrousels)

Règle du 19/10/2026 : dès qu'une slide nomme un outil, son logo 3D, énorme, sort d'un coin et passe derrière le texte.
Le fondateur fournit les fichiers (IconScout ou kit officiel de la marque) et en garde la licence ; ils restent hors Git.
Jamais le logo de Manychat ni d'un concurrent.

| Fichier | Outil | Source | Statut |
| --- | --- | --- | --- |
| `claude.png` | Claude | IconScout, fourni par le fondateur le 19/10 | présent |
| `whatsapp.png` | WhatsApp | à fournir (claude-whatsapp, slides 2 et 6) | manquant |
| `instagram.png` | Instagram | IconScout, fourni par le fondateur le 19/10 | présent |
| `messenger.png` | Messenger | IconScout, fourni par le fondateur le 19/10 | présent |
| `chatgpt.png` | ChatGPT | à fournir (chatgpt-or-claude, couverture ; envoyé dans la conversation, pas reçu en fichier) | manquant |
| `facebook.png` | Facebook | IconScout, fourni par le fondateur le 19/10 | présent |
| `meta.png` | Meta | à fournir (envoyé dans la conversation, pas reçu en fichier) | manquant |
| `calendly.png` | Calendly | à fournir (calendly-no-shows, slides 1 et 2) | manquant |
| `zoom.png` | Zoom | à fournir | manquant |

Dans `post.json`, sur une slide : `"logo": {"name": "claude", "corner": "bl", "size": 760, "angle": -12, "out": 0.3}` (coins `tl`, `tr`, `bl`, `br` ; `out` = part du logo qui sort de la slide), ou une liste de deux logos. Pas d'ombre : là où le texte passe sur le logo, le logo est flouté (retour du 19/10). Un logo manquant ne bloque pas le rendu : la slide sort sans lui, puis on relance le rendu quand le fichier arrive.
