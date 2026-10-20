# Retour d'expérience : le lot des reels 4 à 11 en parallèle (20/10/2026)

Sources : les retours des 8 sessions (reel4 à reel11), leurs débriefs, l'historique Git et ce que la coordination
(MANYSETTER REELS) a vu passer.

## Ce qui s'est passé

| Reel | Décor | Phase 1 (script + décor) | 30 i/s livré | 60 i/s livré | Attente au verrou (estimée) | Passes `go` | Reprises de voix | Incident |
|---|---|---|---|---|---|---|---|---|
| 4 | voiture | 19:17 | 20:37 | 21:34 | 50 à 60 min | 3 | 0 (une prise réinstallée à la main) | cartes trop petites |
| 5 | café | 19:19 | 21:08 | 22:06 | ~30 min | 2 perdues + reprises | 1 | voix payante refusée (accord transmis), passe coupée par un redémarrage |
| 6 | salon | 19:15 | 20:42 | 21:50 | >10 min par étape | 4 | 1 | carte `igDMs` pas encore commitée |
| 7 | cuisine | 19:12 | 20:48 | 21:43 | 30 à 40 min | 3 | 1 (SETTY dit « setting ») | instantané sur une page périmée |
| 8 | rooftop | 19:09 | 20:29 | 22:06 | ~25 min | 3 | 0 | 60 i/s fini mais pas livré avant relance |
| 9 | podcast | 19:13 | 20:53 | 22:00 | ~1 h 30 | 2 + 2 snaps | 2 (« mini chat », « Sadie ») | micros devant les bouches |
| 10 | jet | 19:13 | 22:24 | 23:19 | ~10 min + rendus | 2 | 0 | arrêtée en plein tour (Whisper interrompu) |
| 11 | piscine | 19:13 | 21:03 | 23:24 | ~40 min | 3 + 5 snaps | 0 | ajout au kit écrasé par une autre session |

- **Ce qui a bien marché** :
  - la phase 1 en parallèle : les 8 scripts et leurs décors étaient prêts en 15 à 25 min ;
  - la validation des 8 scripts d'un coup ;
  - le budget des voix, environ 0,32 $ ;
  - aucun rendu refusé : les 10 reels (2 à 11) ont été validés à la première version ;
  - les reels 1 et 2 sont restés identiques tout du long (`regress`).
- **Le goulot** : le verrou des étapes lourdes. Du feu vert des voix (≈ 19:40) au dernier final (23:24), il a fallu
  près de 3 h 45. Chaque session a attendu entre 10 min et 1 h 30. Le verrou ne sert pas dans l'ordre d'arrivée, on ne
  voit pas la file, et il bloquait aussi des étapes légères (appels de voix sur le réseau, build, mix sans Whisper).
- **Un défaut trouvé tard** : les mouvements de caméra qui se chevauchent (l'accroche reculait d'un coup, les plans de
  coupe ne duraient que 3 images). Les instantanés ne le montrent jamais. Le reel 11 l'a repéré, puis la piste caméra du
  moteur l'a corrigé. Il a fallu refaire les finals des reels 2 et 3, déjà programmés.

## Les problèmes qui reviennent (nombre de sessions qui les citent)

1. **Le verrou** (8/8) : de longues attentes, aucune visibilité sur la file, des étapes légères bloquées derrière les rendus des autres.
2. **Les cartes illisibles à 55 %** (8/8) : chaque session a réinventé des cartes en gros caractères (`xl`, `igDM`,
   `igDMs`, `calls.js`, un `card()` local). De plus, `side()` ignore la hauteur du titre-hook (2 ou 3 lignes).
3. **Les fichiers partagés du kit** (7/8) :
   - `stage.js`, `stage.css` et `PROPS.md` modifiés en même temps : un ajout a été écrasé, et une carte était utilisée
     avant d'être commitée ;
   - deux cartes ont été créées en double, avec des noms proches (`igDM` et `igDMs`) ;
   - chaque session a dû fabriquer son commit à la main dans l'index Git.
4. **Des contrôles qui ne voient pas tout** (6/8) :
   - `snap` ne reconstruit pas la page : des instantanés ont montré une version périmée ;
   - `check` ne garde que ses 40 dernières lignes, et les erreurs étaient coupées ;
   - aucun outil ne tire des images du MP4 pour vérifier les mouvements de caméra.
5. **La voix** (5/8) :
   - la prononciation : SETTY sortait « setting » ou « Sadie », ManyChat « mini chat » ;
   - les nombres ne sont pas gérés par l'aligneur (2015, 24) ;
   - `check_vo` compte « nine » contre « 9 » comme une erreur. Ses scores sont donc faussés, et le reel 5 a gardé une prise
     avec 2 vraies erreurs ;
   - `--pick` ne permet pas de choisir une prise précise par personnage.
6. **Le banc d'essai des décors** (5/8) : `lab/` utilise des plans fixes, et non les cadrages du moteur sur les vraies
   têtes. Accessoires devant les visages, jambes dans le canapé, micros devant les bouches : tout cela ne se voyait
   qu'au `go`.
7. **Des sessions qui s'arrêtent sans finir** (3 cas) : une passe coupée par un redémarrage (reel5), un rendu fini mais
   pas livré (reel8), un arrêt en plein tour (reel10). La coordination ne les a vus qu'en surveillant les processus à la main.
8. **Des pièges du gabarit** :
   - les clics posés sur le premier mot de la réplique ;
   - la censure du coach différente de celle de Setty ;
   - `find()` qui cherche dans tout le texte au lieu de la réplique ;
   - un nom de repère réservé (`total`) qui faussait la durée du mix ;
   - des cartes qui apparaissent vides ;
   - la règle « pas de `ctx.filter` », arrivée après la phase 1.
9. **L'accord pour la voix payante** : une session a refusé de lancer la voix sur un feu vert transmis par la
   coordination. Il a fallu que Grégoire le tape lui-même dans cette session.
10. **La livraison** : `deliver` a réécrit des champs de `post.json` mis à jour par MANYSETTER POST (la mention de la
    musique). C'est corrigé : la livraison garde désormais ce qu'elle ne génère pas.

## Améliorations, classées par gain

### 1. Débit : finir un lot en moitié moins de temps

1. **Rendre une seule fois.** Les 10 reels ont été validés à la première version : on livre directement en 60 i/s pour
   la validation. On ne refait un rendu qu'en cas de retour. Gain : un rendu de moins par reel (5 à 8 min de verrou
   chacun) et un aller-retour de moins.
2. **Un verrou réservé au lourd, servi dans l'ordre, visible.**
   - Seuls les rendus, les instantanés et Whisper le prennent. Les appels de voix, le build et le mix s'en passent.
   - Une file dans l'ordre d'arrivée.
   - `studio.py queue` montre qui tient le verrou, depuis quand, et la file d'attente.
3. **`studio.py final reelN`, une seule commande.** Elle fait le rendu en 60 i/s, la planche d'images tirées du MP4
   (accroche et plans de coupe), le `deliver` et le commit des seuls fichiers du reel. Une session ne peut plus
   s'arrêter entre le rendu et la livraison.
4. **`studio.py status`, le tableau du lot.** Pour chaque reel, il lit l'étape dans les fichiers : script, voix, 30 ou
   60 i/s, livré, transmis. Il signale un reel qui n'avance plus. La coordination le lance au lieu de surveiller les
   processus.
5. **La coordination génère toutes les voix.** Elle détient l'accord de Grégoire. Elle lance les voix des scripts validés
   d'un seul trait, avec les reprises, puis passe la main aux sessions. Plus de refus d'un accord transmis, et moins
   d'allers-retours au verrou.

### 2. Qualité dès la première passe : moins de `go`

6. **`D.card()` dans le kit.**
   - Une carte posée à côté de celui qui parle, sous le titre-hook quelle que soit sa hauteur, avec une échelle par
     carte.
   - Des versions en gros caractères pour toutes les cartes du kit, et jamais de carte vide.
   - Un contrôle automatique : texte de 60 px ou plus à l'écran, 2,5 s d'affichage au moins, jamais sur un visage ni
     dans la zone des sous-titres.
7. **Des contrôles qui voient ce que voit le téléphone.**
   - `snap` et `go` reconstruisent la page si les sources sont plus récentes.
   - `check` affiche toutes ses erreurs, en premier.
   - `studio.py frames reelN --at …` tire une grille d'images du MP4.
   - La piste caméra est active par défaut dans le gabarit (déjà fait).
8. **`studio.py lab <décor>`** : le banc d'essai prend les cadrages du moteur (les vraies têtes, les poussées, les
   cadrages avec carte) et ajoute des vues basse, de côté et de dessus. Les hauteurs d'assise du coach sont écrites
   dans le guide.
9. **Le gabarit corrigé** :
   - les clics posés avant la réplique ;
   - la censure du coach traitée comme celle de Setty ;
   - un `find()` limité à la réplique ;
   - les repères réservés refusés par le build ;
   - les règles de dessin (pas de `ctx.filter`) dans le gabarit dès le départ.

### 3. Voix : zéro reprise évitable

10. **Un lexique de prononciation appliqué d'office.** SETTY (« SET-tee »), ManyChat et les noms de marque sont écrits
    en graphie phonétique dans la consigne envoyée au TTS. Les nombres sont convertis avant l'alignement.
11. **`check_vo` juste.**
    - Il normalise les nombres et les homophones (nine/9, too/to, Seen/scene) avant de comparer.
    - Il teste à part le mot-clé du CTA.
    - Il situe chaque erreur sur sa réplique.
    - Avec `--pick coach=try2`, on choisit une prise précise.

### 4. Coordination : plus de conflits sur le kit

12. **Une carte, un fichier** (`assets/engine/cards/<nom>.js` et `.css`, chargés tout seuls). La session qui crée une
    carte la commite tout de suite. Avant de la créer, elle la déclare dans `lot/notes.md` pour éviter les doublons.
    Les fichiers communs (`stage.js`, `stage.css`, `PROPS.md`) ne sont modifiés que par la coordination.
13. **`studio.py commit-mine`** : il commite seulement les fichiers et les blocs de la session, sans manipuler l'index
    à la main.
14. **Un fichier de notes du lot** (`lot/notes.md`), relu par chaque session à chaque phase. Les règles découvertes en
    cours de route (`ctx.filter`, les nombres, la piste caméra) y sont publiées par la coordination.
15. **Les légendes** : une fois livrées, celles du dossier de publication font foi. `deliver` ne les réécrit plus si
    MANYSETTER POST les a modifiées.

### 5. Le contenu (relevé dans les débriefs)

16. **Une version de 30 à 35 s de chaque reel** (proposée dans 7 débriefs sur 8). Elle se fait avec `studio.py cut`,
    sans nouvelle voix, pour tester la rétention.
17. **Un vrai lip-sync** (formes de bouche O, M/B/P, E), demandé dans 6 débriefs.
18. **Un tuyau Manychat en gros caractères**, la carte la moins lisible.
19. **Le plan large de fin un peu plus bas** : la notification recouvre le bonnet du coach.
20. **Un titre-hook de 2 lignes au plus.** Le titre de 3 lignes du reel 11 mange de la hauteur ; c'est au fondateur de
    décider s'il peut s'écarter de la slide 1 mot pour mot.

## Ordre conseillé

En une demi-journée, les numéros 1, 2, 3, 4, 7, 9 et 11 : ce sont surtout des changements de `studio.py` et du
gabarit, et ils suffisent à diviser par deux le temps d'un lot de 8. Les numéros 5, 6, 10 et 12 à 15 viennent ensuite,
pour le prochain lot. Les numéros 16 à 20 sont des décisions de contenu, qui reviennent au fondateur.
