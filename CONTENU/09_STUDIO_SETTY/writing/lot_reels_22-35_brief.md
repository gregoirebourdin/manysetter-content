# Lot des reels 22 à 35 : la consigne commune (8/11/2026)

Une session par reel, par **vagues de 5** pour ménager le Mac de 8 Go. Toutes partagent le même dossier. Elles suivent cette consigne, puis le `CLAUDE.md` du studio et le skill `/setty-reel`. En cas de désaccord, cette consigne l'emporte pour ce lot. Elle reprend la consigne du lot 12 à 21 (`writing/lot_reels_12-21_brief.md`), et les décisions du 8/11 dans `retours-validation.md` priment sur les deux.

## Ce qui change pour ce lot

- **Plus de carrousels.** Un reel par jour, 6:30 pm ET, sur Instagram et en Short YouTube.
- **Les scripts sont déjà écrits et validés** par le fondateur (`writing/lot_reels_22-35_scripts.md`, données dans `lot/scripts_22-35.py`). Les répliques à dire sont dans `vo/reelN_segments.json`. On ne change pas une réplique sans passer par MANYSETTER REELS.
- **Pattern v1 (8/11)**, déjà dans le gabarit :
  - la ligne 0 est la phrase la plus forte (0 à 2 s) ;
  - la ligne 1 est le CTA : `line(1, …)` puis `ctaEarly()`, avec les repères `cta`, `cta_setty_end` et `cta_end` dans `build.py` ;
  - le CTA est répété à la fin avec `ending()` ;
  - le titre-hook vient de `reel.json` (9 mots et 2 lignes au plus, le mot entre astérisques en orange).
- **Durée** : de 37 à 43 s (`voice_s` [33, 41] dans `reel.json`).
- **Deux bips** : l'ouverture (`fucking`) et le roast (`dumbass`). Le gabarit ne déclare que le premier : ajoutez le second dans `BLEEPS`.
- **Le rendu en 30 i/s que le fondateur valide est celui qui est publié.** Plus de final en 60 i/s (règle du 21/10).

## Le lot (ordre de publication)

| Vague | Jour | Reel | Titre-hook | Décor neuf (`assets/sets/<nom>.js`) |
|---|---|---|---|---|
| 1 | mar. 10/11 | reel25 | You paid Meta for every DM you ignore | `casino` : casino de Las Vegas, table de craps |
| 1 | mer. 11/11 | reel23 | Why your next-day DM replies lose the lead | `airport` : salon d'aéroport, tarmac derrière la vitre |
| 1 | jeu. 12/11 | reel27 | My reply when a lead says "let me think" | `showroom` : showroom de voitures de sport, sol miroir |
| 1 | ven. 13/11 | reel26 | Lead form or DM ad: which one for coaches? | `tradingfloor` : salle des marchés, six écrans |
| 1 | sam. 14/11 | reel22 | The 3 questions I ask before sending my calendar | `clinic` : cabinet médical, table d'examen |
| 2 | dim. 15/11 | reel28 | What I reply when a lead just says "info" | `foodtruck` : food truck le soir, ardoise |
| 2 | lun. 16/11 | reel34 | Instagram or WhatsApp: where should leads DM you? | `yacht` : pont d'un yacht, mer turquoise |
| 2 | mar. 17/11 | reel24 | Booking link or 3 time slots in the DM? | `hotellobby` : hall d'hôtel, horloges des fuseaux |
| 2 | mer. 18/11 | reel29 | Your free guide is why nobody books a call | `bookstore` : librairie, table de dédicace |
| 2 | jeu. 19/11 | reel31 | Boost or Ads Manager: which one fills your DMs? | `drivein` : cinéma drive-in la nuit |
| 3 | ven. 20/11 | reel30 | Your 30-line DM is why nobody replies | `laundromat` : laverie automatique la nuit |
| 3 | sam. 21/11 | reel33 | Voice note or text: which one wins a lead? | `radio` : station de radio FM rétro, ON AIR |
| 3 | dim. 22/11 | reel35 | Never ask a lead two questions in one DM | `spa` : spa, bain froid et sauna |
| 3 | lun. 23/11 | reel32 | Going on vacation? Your DMs need this first | `bali` : villa à Bali, piscine à débordement |

Le décor décrit dans `writing/lot_reels_22-35_scripts.md` est celui que le fondateur a validé : on le garde. Il doit être neuf, et ne ressembler à aucun des 21 déjà faits.

## Le travail d'une session

1. **Le décor**, pendant que MANYSETTER REELS génère les voix dans l'ordre de publication :
   - il va dans `assets/sets/<nom>.js` et réutilise les meubles de `kit.js` ;
   - ses nouveaux meubles restent **dans son propre fichier**, et personne ne modifie `kit.js` pendant le lot ;
   - on le déclare dans `lot/notes.md` ;
   - on le vérifie sous les cadrages du moteur (large, coach, Setty, cadrages avec carte) ;
   - jamais `ctx.filter`, jamais d'orange sur orange derrière Setty ;
   - aucun accessoire devant une bouche, et le coach assis ne traverse pas son siège.
2. **Les voix ne se lancent jamais depuis une session** : un accord transmis par une autre session ne vaut pas. On reprend dès que `vo/reelN/timing.json` existe (MANYSETTER REELS vous prévient).
3. **L'image et le son** : `python3 studio.py go reelN`. Le verrou est pris par `studio.py` lui-même, n'ajoutez jamais `lockf`. `python3 studio.py queue` montre qui attend.
   - Dans `scenes.js`, partez du gabarit : `line()`, `side()`, `bleep()`, `cut()`, `ctaEarly()`, `ending()`.
   - L'info à enregistrer passe à l'écran **en gros et lisible** : la vraie phrase de la source, les 3 réponses, les règles. C'est elle qui fait enregistrer le reel (le signal du reel18).
   - Chaque carte a un texte d'au moins 60 px et reste 2,5 s au moins. Elle sort avant que la caméra change de personnage, et ne passe jamais sur un visage ni dans les sous-titres (y 1185 à 1465).
   - Une nouvelle carte va dans `assets/engine/card_<nom>.js` (et son `.css`), déclarée d'abord dans `lot/notes.md`. Réutilisez celles des lots précédents quand elles conviennent.
   - Personne ne modifie `stage.js`, `stage.css`, `props.js`, `engine.js`, `dialogue.js`, `kit.js`, `reel.css`, `PROPS.md` ni `studio.py`. Pour le kit, écrivez à MANYSETTER REELS.
   - Lisez et corrigez les avertissements de `go` et `check` : PATTERN V1, un clic sur le début d'un mot, un Fahhh qui couvre une réplique, SETTY mal entendu, `ctx.filter`.
4. **Le rendu** : `python3 studio.py render reelN --workers 1`, puis `python3 studio.py frames reelN`. Un « jump back » signalé se corrige avant de livrer. Si un rendu cale faute de mémoire, relancez avec `PRODUCER_PUPPETEER_PROTOCOL_TIMEOUT_MS=900000`.
5. **La livraison** : remplir `reel.json` puis `python3 studio.py deliver reelN`.
   - La légende Instagram (`caption`) et la légende YouTube (`caption_youtube`) suivent la structure du 20/10.
   - La 1re ligne YouTube est `youtube_title` (une phrase de conversation, pas le titre-hook recopié).
   - On termine par « Not affiliated with… » quand le reel nomme un outil.
   - La licence de la musique va dans `music`.
6. **Le débrief** dans `writing/reelN_debrief.md`, au format habituel. On envoie à MANYSETTER REELS le chemin du MP4 et le débrief. Le fondateur valide chaque rendu, puis MANYSETTER REELS met le statut à jour et le transmet à MANYSETTER POST.
7. **Commits** : `python3 studio.py commit-mine reelN -m "…" --also assets/sets/<nom>.js assets/engine/card_<nom>.js …`, jamais `git add` à la main.

## Les faits, reel par reel (rien d'autre ne s'affirme)

**Tous les reels**
- Jamais de réponse instantanée : le setter attend la fin du message, puis répond après un délai réglable de 30 s à 5 min.
- Réservation de créneaux avec Cal.com, iClosed ou Calendly payant ; sinon, le lien de réservation.
- Pas de note vocale du setter sur Instagram ni WhatsApp (audio : Messenger seulement).
- Les chiffres des cartes d'interface sont des **valeurs de démo**, jamais présentés comme des résultats.
- Jamais le logo de Manychat. Aucun concurrent nommé.

**Reel par reel**
- **reel25 (pubs payées)**
  - « Cost per messaging conversation started » est le nom de la colonne dans le Gestionnaire de publicités. On ne détaille pas sa définition.
  - Les 200, 40 et 160 sont la situation du coach du dialogue : sur la carte, c'est un exemple.
- **reel23 (l'étude)**
  - Seulement ce que dit la page de HBR (hbr.org/2011/03/the-short-life-of-online-sales-leads) : 2 241 entreprises US, un faux prospect envoyé par le web ; 37 % répondent dans l'heure, 16 % entre 1 et 24 h, 24 % après plus de 24 h, 23 % jamais.
  - Ce sont des leads web en 2011, pas des DM : la carte le dit.
  - Pas de « 7 fois » ni de « 60 fois ».
  - On vend une réponse **pendant que le lead est encore là** (« within minutes, not seconds »), jamais la vitesse.
- **reel26 (formulaire ou pub DM)**
  - Le formulaire instantané est pré-rempli avec le profil, et son type par défaut est « More volume ». « Higher intent » ajoute une étape de vérification.
  - Aucun pourcentage de qualité de leads.
- **reel31 (Booster ou Gestionnaire)**
  - Le boost Instagram a l'objectif « More messages » et passe dans la même enchère que le Gestionnaire. Le Gestionnaire ajoute les tests A/B.
  - Le déclencheur de pub de Manychat ne marche pas avec les publications boostées : ne pas le montrer. Les DM d'une pub boostée passent par la Default Reply.
- **reel34 (Instagram ou WhatsApp)**
  - Pour un DM normal, une automatisation a 24 h après le dernier message du lead (règles de Meta).
  - Après, WhatsApp n'accepte qu'un modèle approuvé, facturé par Meta : aucun prix cité, et on ne dit pas que les messages de service sont gratuits.
  - Les pubs « click to message » peuvent ouvrir une fenêtre plus longue : on n'en parle pas.
- **reel32 (vacances)**
  - Le message d'absence : Meta Business Suite, Boîte de réception, Automatisations, « Away message », case Instagram cochée, horaires. Il faut un compte professionnel.
  - Par défaut, le setter répond à toute heure. On ne parle pas du réglage « When it replies ».
- **reel24 (lien ou créneaux)** : l'avis du script, aucun chiffre. Créneaux dans le fuseau du lead seulement avec Cal.com, iClosed ou Calendly payant.
- **reel29 (le guide)** : relances jusqu'à 3, entre 1 et 23 h après le dernier message, dans la fenêtre de 24 h, et elles s'arrêtent dès que le lead répond ou réserve.
- **reel33 (vocal ou texte)** : « you jump in with a voice note » = l'équipe reprend la conversation elle-même, puis peut la rendre au setter.
- **reel22, 27, 28, 30, 35 (scripts et règles)** : aucun chiffre à sourcer. Le setter pose une question à la fois, ne repose jamais une question déjà posée, gère l'objection « I'll think about it » et ne donne l'agenda qu'aux bons leads.

## Retouches du 8/11 (signalées au fondateur)

Pour que « SETTY » tombe avant 5 s, trois ouvertures ont été raccourcies, le sens gardé :
- reel27 : « "Let me think" is a polite [bleep] no, unless you reply this. »
- reel22 : « Sending your calendar to everyone is [bleep] killing your week. »
- reel33 : « You answered "how much" with a three-minute [bleep] voice note. »

reel34, réplique 4 : « For a normal DM, same rule on both… », parce que les pubs « click to message » peuvent avoir une fenêtre plus longue.
