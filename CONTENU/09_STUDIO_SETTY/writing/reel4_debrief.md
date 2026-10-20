# Débrief du reel 4 « 10 calls, 0 closed » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 3 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S2_AV2_10-calls-0-closed`. Le coach
se vante de sa semaine pleine (dix appels) ; Setty lui demande combien l'ont payé : zéro. Puis le fil du carrousel :
- n'importe qui réserve, et le budget tombe à la 40e minute (« I was thinking like fifty bucks? ») ;
- ce n'est pas de la vente, c'est du consulting gratuit, et le coach doute de lui ;
- ce n'est pas lui le problème, c'est son lien ouvert à tous ;
- Setty pose ses questions en DM, une à la fois, avant l'agenda ; ceux qui ne peuvent pas payer reçoivent le guide gratuit
  ou l'offre moins chère ; ceux qui réservent arrivent avec leurs réponses dans l'invitation.

18 répliques, environ 56 s, 2 bips (le hook et la chute, qui rappelle le « fifty bucks » de la réplique 6).

**Le décor (nouveau).** Sa voiture, garée devant un coworking au crépuscule :
- un SUV noir carré, vu à travers le pare-brise ouvert ; cuir noir surpiqué orange, bande d'ambiance orange, plafonnier ;
- dehors, la vitrine chaude d'un coworking (néon « cowork »), des lampadaires, le ciel du violet à l'orange ;
- le coach au volant, son téléphone sur un support près du montant ; Setty au-dessus du siège passager ;
- une plaque « BOOKED » à l'avant, pour le plan large.

**Les voix.** Le coach en Fenrir et Setty en Charon : 3 prises chacun, vérifiées par Whisper. L'outil avait gardé une
prise du coach où Whisper entendait « for my car » au lieu de « from my car » ; j'ai installé à la place la prise 2, sans
aucune vraie erreur (seulement « ten » écrit « 10 »).

**Les cartes (nouvelles, dans le kit : `assets/engine/calls.js`).** En gros caractères, lisibles à 55 % à côté du
personnage :
- sa semaine Calendly : dix appels qui tombent un par un, « 10 calls booked » ; puis la même semaine barrée, « 0 clients » ;
- l'appel de découverte sur Zoom : le chrono qui file jusqu'à 40:00, « So... what's your budget? », puis la réponse
  « i was thinking like $50? » plaquée sur le BOOM ;
- le DM Instagram : les trois questions du carrousel, une à la fois, avec les réponses du lead ;
- « Can't pay? » : « your calendar » barré, puis « your free guide » et « your cheaper offer » ;
- la confirmation Calendly avec le résumé du lead ajouté par ManySetter (but, coaché avant, prêt ce mois-ci) ;
- la notification de son prochain appel, « Discovery call with Kyle · in 2 min », quand son téléphone s'allume.

**La mise en scène.**
- Champ-contrechamp avec poussée continue sur celui qui parle. Ses cartes à lui passent à droite de l'image (sur le
  montant et la portière) : Setty sort du cadre au lieu d'être caché à moitié.
- Un BOOM sur « fifty bucks? », « never buying. » et « Manychat » ; un « Fahhh » après les deux roasts, caméra sur lui.
- La musique meurt sur « Okay, I'm in. My next call's in two minutes. » (plan large, silence) et revient après « SETTY ».
- La chute : la carte de son prochain appel avec Kyle, et la même réponse à 50 dollars.

## Ce qui a été vérifié

- Chaque fait vient du brief (§ 2 et § 3), de l'idée 3 et des verbatims ; aucune promesse de clients ni de taux de
  closing ; « Manychat » écrit ainsi à l'écran ; aucun concurrent.
- Whisper comprend chaque mot de la voix installée et du mix (les seuls écarts sont des chiffres écrits en nombres et le
  mot bipé).
- Contrôle HyperFrames : 0 erreur (mise en page, mouvement, contraste : 50 textes sur 50 au niveau WCAG AA).
- Rendu 30 i/s : 1080×1920, 56,3 s, -14,2 LUFS, crête -2,1 dBTP, image 0 non noire (c'est la miniature : le plan large à
  travers le pare-brise, avec le titre-hook et la plaque « BOOKED »).
- `regress` non lancé, car inutile ici : mes ajouts au kit sont des fichiers nouveaux (`calls.js`, `car.js`) que seules mes
  scènes chargent ; aucun fichier partagé du moteur n'a été modifié (PROPS.md reçoit seulement une section en plus).

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le téléphone du coach lui cachait la bouche** en gros plan : il est passé sur le support côté portière.
2. **Le tableau de bord coupait le visage de Setty** : Setty flotte plus haut, le tableau de bord est plus bas et la
   caméra de Setty plonge davantage.
3. **Le rétroviseur mordait le bonnet** du coach : il est plus petit et décalé ; la petite breloque orange, qui faisait
   une tache près des têtes, est partie.
4. **Le flou de canvas sort noir au rendu** (signalé par une autre session) : le bokeh du ciel est fait en dégradés.
5. **Mes cartes étaient trop petites** pour un téléphone au premier passage : texte agrandi d'environ 30 %.
6. **Le DM n'avait que 1,8 s à l'écran** : il arrive dès le début de la réplique, les questions tombent jusqu'à « time ».
7. **Ses cartes à gauche cachaient la moitié de Setty** : elles passent à droite.
8. **Le résumé du lead arrivait trop tard** : il tombe dès « Serious ones ».
9. **La barre de commentaire mordait la tête de Setty** dans le CTA : le cadrage est plus bas.

## Ce qui peut encore monter le niveau

1. **Une version de 30 à 35 s** en parallèle (retirer les répliques 6 à 9), pour la rétention.
2. **Le lip-sync en vraies formes de bouche**, déjà proposé aux reels 2 et 3.
3. **Le volant** : le coach ne le tient jamais ; des mains posées dessus entre deux gestes feraient plus vrai.

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST.
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- Rien n'est programmé sans ton go.
