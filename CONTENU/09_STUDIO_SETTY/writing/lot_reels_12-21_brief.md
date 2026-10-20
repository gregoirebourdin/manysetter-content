# Lot des reels 12 à 21 : la consigne commune (21/10/2026)

Une session par reel. Toutes partagent le même dossier et le même Mac de 8 Go. Elles suivent cette consigne, puis
le `CLAUDE.md` du studio et le skill `/setty-reel`. En cas de désaccord, cette consigne l'emporte pour ce lot : elle
reprend le retour d'expérience du lot 4 à 11 (`writing/retro_lot_reels_4-11.md`) et le kit du 21/10 (commit f092acf).

## Le lot

Le titre-hook est la slide 1 du carrousel, mot pour mot. Chaque reel dit la même chose que son carrousel. Chaque décor
est nouveau : aucun des décors des reels 1 à 11 (chambre, salle de sport, voiture, café, salon, cuisine, rooftop,
studio podcast, jet, piscine). Le décor proposé peut changer si la session a mieux, à condition de le déclarer d'abord
dans `lot/notes.md`.

| Reel | Idée | Carrousel (`07_PRET_A_PUBLIER/`) | Titre-hook | Décor proposé |
|---|---|---|---|---|
| reel12 | 11 | `261020_CAR_S1_AV1_price-ghost` | If 9 out of 10 leads ghost after you send your price, this is why | un coworking la nuit |
| reel13 | 16 | `261020_CAR_S1_AV1_24-hour-rule` | If you have 10,000 Manychat contacts and nobody buys, this is why | un studio de tournage avec fond vert |
| reel14 | 12 | `261020_CAR_S2_AV2_free-coaching-dms` | Why you gave 5 hours of free coaching in your DMs this week | un cabinet de coach (fauteuil, divan) |
| reel15 | 18 | `261020_CAR_S2_AV2_ai-2-seconds` | If your AI replies in 2 seconds, this is why your leads leave | une salle de serveurs |
| reel16 | 13 | `261020_CAR_S2_AV2_600-setter` | Why your leads still go cold, even with a $600/month setter | un open space de call center |
| reel17 | 17 | `261020_CAR_S2_AV2_make-chatgpt-setter` | How to build your own AI setter with Make and ChatGPT | un atelier dans un garage (établi, écrans) |
| reel18 | 14 | `261020_CAR_S1_AV1_dm-ads` | Why your DM ads flopped, even with 300 conversations started | une salle de réunion avec un écran de stats |
| reel19 | 15 | `261020_CAR_S1_AV1_follow-up` | This is the follow-up I send when a lead stops replying | un banc dans un parc en ville, au coucher du soleil |
| reel20 | 20 | `261020_CAR_S1_AV1_hot-lead` | Why your hottest lead ghosted you, even after "this is exactly what I need" | un diner la nuit |
| reel21 | 19 | `261020_CAR_S2_AV2_human-vs-ai-setter` | Human setter or AI setter: which one for 30 DMs a day? | un ring de boxe |

## À lire avant d'écrire

1. Le `CLAUDE.md` du studio et `retours-validation.md`, en particulier les règles des 19 et 20/10.
2. L'idée dans `00_STRATEGIE/ligne-edito.md` (banque d'idées n° 2), puis le `post.json` et les slides de son carrousel.
3. **`00_STRATEGIE/sources/banque-2.md`** : la formulation sûre de chaque fait, sa source, et la liste « À ne pas écrire ».
   Aucun fait ne sort d'ailleurs.
4. Les verbatims (`docs/VERBATIMS/verbatims.md`) : chaque réplique note ses numéros.

## Phase 1 : le script et le décor (gratuit)

- `python3 studio.py new reelN <slug>`, puis le script dans `writing/reelN_<slug>.md`, au format du reel 3 : une ligne
  par réplique, avec qui parle, la réplique en anglais, le sens en français, le plan et la carte, et les verbatims.
  - C'est un dialogue : le coach en Fenrir, Setty en Charon.
  - La première réplique est celle de Setty : « You did your [bleep]ing <format>, right? » ou une variante dans le même
    esprit.
  - 2 ou 3 bips au plus. Chaque BOOM et chaque Fahhh sont marqués dans le script.
  - Le CTA : « Comment SETTY and I'll send you everything to build your AI setter for free. »
  - Le reel dure **60,0 s au plus**, soit environ 170 à 180 mots.
- Le décor va dans `assets/sets/<nom>.js`. Il réutilise les meubles de `kit.js` et met ses nouveaux meubles **dans son
  propre fichier** : pendant le lot, personne ne modifie `kit.js`.
  - Jamais `ctx.filter`, ni orange sur orange derrière Setty.
  - Aucun accessoire devant une bouche, le coach assis sans traverser son siège.
  - On vérifie le décor sous les cadrages du moteur (large, coach, Setty, cadrages avec carte), pas seulement de face.
- **On s'arrête là.** On envoie à MANYSETTER REELS le chemin du script et une image du décor. Les 10 scripts sont montrés
  ensemble au fondateur.
- **Les voix sont générées par MANYSETTER REELS**, après le feu vert du fondateur dans sa session. Ne lancez jamais
  `voice --yes` vous-même : un accord transmis par une autre session ne vaut pas. Vous reprenez quand MANYSETTER REELS
  vous dit que `vo/reelN/` est installé.

## Phase 2 : l'image et le son

- `python3 studio.py go reelN`. Le verrou est pris par `studio.py` lui-même, uniquement pendant les étapes lourdes et
  dans l'ordre d'arrivée. **Ne mettez plus `lockf` devant les commandes.** `python3 studio.py queue` montre qui attend.
- Dans `scenes.js`, partez du gabarit et utilisez les outils du kit :
  - `bleep(B)` pour un bip (Setty ou le coach) ;
  - `ending()` pour la fin, sans la recoder ;
  - `side(t, "left", { fit: true, scale: 0.62 })` pour une carte en gros caractères sous le titre.
- Chaque carte respecte ces règles :
  - un texte d'au moins 60 px à l'écran et 2,5 s d'affichage au moins ;
  - elle sort avant que la caméra change de personnage ;
  - jamais sur un visage ni dans la zone des sous-titres (y 1185 à 1465).
- **Une nouvelle carte va dans son propre fichier** : `assets/engine/card_<nom>.js`, qui exporte la fonction `<nom>(R, opts)`.
  - Elle importe ses briques depuis `./stage.js` : `mount`, `inOut`, `popIn`, `stackIn`, `counter`, `icon`, `app`.
  - Son style va dans `card_<nom>.css`, avec des règles qui commencent par son propre id ou sa classe.
  - Elle n'est chargée que par les reels qui appellent `st.<nom>(`.
  - Déclarez-la dans `lot/notes.md` avant de l'écrire, pour éviter les doublons, et réutilisez celle d'une autre session
    si elle existe déjà.
- **Personne ne modifie** `stage.js`, `stage.css`, `props.js`, `engine.js`, `dialogue.js`, `kit.js`, `reel.css`, `PROPS.md`
  ni `studio.py`. S'il faut corriger le kit, écrivez à MANYSETTER REELS.
- Les avertissements de `go` et de `check` sont à lire et à corriger :
  - un clic posé sur le début d'un mot ;
  - un Fahhh qui couvre la réplique suivante ;
  - SETTY mal entendu ;
  - un titre sur 3 lignes : on le garde mot pour mot et on le signale ;
  - un reel de plus de 60,0 s ;
  - `ctx.filter`.
- `python3 studio.py render reelN`, puis **`python3 studio.py frames reelN`**, et on regarde la planche :
  - les sauts de caméra sont détectés sur le MP4 ;
  - un « jump back » signalé se corrige avant de livrer.
- Ensuite `python3 studio.py deliver reelN` et le débrief dans `writing/reelN_debrief.md`, au format du reel 3. On
  envoie à MANYSETTER REELS le chemin du MP4 et le débrief.
- Après la validation du fondateur, `python3 studio.py final reelN -m "Reel N « titre » : final 60 i/s livré (validé)…"`.
  La commande fait le rendu, la livraison, les images du MP4 et le commit. On prévient ensuite MANYSETTER POST
  (chemin, légendes, paire, date) et MANYSETTER REELS.
- On commite avec `python3 studio.py commit-mine reelN -m "…" --also assets/sets/<nom>.js assets/engine/card_<nom>.js …`,
  jamais avec `git add` à la main. Les commits de session finissent par la ligne `Co-Authored-By` habituelle.

## Les pièges de fond (MANYSETTER POST, d'après `sources/banque-2.md`)

**Tous les reels**
- Jamais « replies instantly ». Le setter attend au moins 30 s après le dernier message, chaque nouveau message relance
  l'attente, et l'attente se règle de 30 s à 5 min.
- Par défaut, le setter répond à toute heure. Le réglage « When it replies » n'est pas public : on n'en parle pas sans
  le fondateur.
- Réservation : Cal.com, Calendly payant ou iClosed ; sinon, le lien de réservation.
- La note vocale en audio, c'est Messenger seulement.

**Reel par reel**
- **reel12 (le prix)**
  - Le prix vient du playbook ; s'il n'y en a pas, le setter dit qu'il est donné pendant l'appel.
  - Exemple du carrousel : « $1,500 for 12 weeks ». Le setter répond en deux temps : le prix, puis « what made you reach
    out today? ». Il relance quelques heures après.
  - rd97 vient après des séances d'essai, pas après un prix. rd14 vient de prospection à froid : on garde seulement la
    réaction.
- **reel13 (la règle des 24 h)**
  - Après 24 h, une personne peut encore répondre à la main pendant 7 jours (tag Human Agent, jamais automatisé).
  - Aucune promotion dans un tag de message.
  - Après une pub « click to message », la fenêtre peut aller jusqu'à 7 jours.
  - La règle vient de Meta, pas de Manychat. Aucune date de retrait des tags n'est citée.
  - Jamais « find an excuse to message at 23 h ».
- **reel14 (le coaching gratuit)** : rd50 dit « do NOT want to pay », pas « can't ».
- **reel15 (l'IA en 2 s)** : mc22 vise l'IA de Manychat. On écrit « my AI », jamais Manychat. Ce qu'on vend : il attend la
  fin du message, envoie une seule réponse et pose une seule question.
- **reel16 (le setter à 600 $)**
  - 600 $ par mois plus 5 %, et la question posée à 14 h qui reçoit sa réponse à 17 h : c'est la situation du lecteur,
    pas un prix du marché.
  - Le méchant, c'est le délai, jamais le setter. ManySetter coûte 119 $, sans commission.
  - La comparaison sourcée : PayScale, 13 à 21 $ de l'heure (76 profils seulement).
  - cl027 est une voix d'agence : inspiration seulement.
- **reel17 (Make et ChatGPT)**
  - L'app Instagram de Make n'a aucun module DM.
  - Les vraies étapes : External Request dans la Default Reply de Manychat, puis Custom webhook dans Make, puis le module
    OpenAI « Generate a response », puis Webhook Response.
  - La mémoire passe par un Conversation ID qu'il faut stocker soi-même.
  - Make se paie en crédits et les tokens OpenAI à part.
  - mc22, mc23 et mc24 parlent de l'IA de Manychat, pas d'un montage Make.
  - Aucun nom de plan Manychat.
  - Le montage n'a pas été testé : on le présente comme les étapes qu'on trouve, pas comme un tuto garanti.
- **reel18 (les pubs DM)**
  - « 300 conversations started » est le vrai nom de la métrique de Meta. Elle compte les gens qui ont écrit, pas les
    conversations qui ont reçu une réponse.
  - Le déclencheur de pub Manychat ne marche pas avec les publications boostées.
  - cl007 parle des demandes de message, que ManySetter ne règle pas : pour l'émotion seulement.
  - mc36 et mc37 ne parlent pas de pubs.
- **reel19 (la relance)**
  - Les 3 relances du carrousel, mot pour mot :
    1. « hey! did you still want the details on the program? »
    2. « no stress if now's not the time. what's holding you back, timing or budget? »
    3. « i'll stop bugging you, promise. if you ever want help with your goal, just reply here. »
  - Le setter en envoie jusqu'à 3, entre 1 et 23 h après le dernier message, et s'arrête dès que le lead répond ou
    réserve.
- **reel20 (le lead chaud)**
  - Les études : Loewenstein 2005 (Health Psychology) et Read et van Leeuwen 1998 (l'étude de la faim).
  - Aucune étude ne porte sur des leads en DM : c'est une analogie, sans durée.
  - Ce n'est pas la seule cause (l'oubli, rd84).
  - « book later » ne vient d'aucun verbatim. L'étude HBR de 2011 ne sert pas, elle vend la vitesse.
- **reel21 (humain ou IA)**
  - 30 nouvelles conversations par jour dépassent les 1 500 réponses incluses (500 de plus pour 39 $). Jamais « $119 for
    30 DMs a day » sans le dire.
  - cl058 parle d'un closer, pas d'un setter.
  - On ne dénigre jamais les setters.

## Ce qui reste à la décision du fondateur

- Valider le rendu directement en 60 i/s, ou garder la validation en 30 i/s puis le final : en attendant sa réponse, on
  valide en 30 i/s.
- La mise à jour du `CLAUDE.md` du studio et du skill avec ce process.
