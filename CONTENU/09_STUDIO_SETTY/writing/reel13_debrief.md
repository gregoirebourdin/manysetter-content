# Débrief du reel 13 « The 24-hour rule » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 16 de la banque n° 2, en paire avec le carrousel `261020_CAR_S1_AV1_24-hour-rule`. Le coach
tourne une promo pour « blaster » ses 10 000 contacts Manychat. Setty casse le plan avec la fenêtre de 24 h de Meta :
- elle s'ouvre quand le lead écrit ;
- plus aucun message automatique après ;
- 7 jours à la main, sans promo ;
- la règle vient de Meta, pas de Manychat ;
- la vente se fait pendant que le lead parle.

Puis ManySetter : il répond quand le lead a fini d'écrire et envoie jusqu'à 3 relances dans les 24 h. 16 répliques,
2 bips, 3 BOOM, 2 « Fahhh ».

**La voix.** C'est la voix générée par MANYSETTER REELS (Fenrir pour le coach, Charon pour Setty). Elle faisait 58,0 s,
soit 60,4 s avec la fin. J'ai resserré les enchaînements (`turn_gap` 0,15) avec les mêmes prises, gratuitement : 57,3 s
de voix et 59,3 s de reel. Whisper la comprend en entier.

**Le décor (nouveau, `assets/sets/greenscreen.js`).** Un studio de tournage fond vert, la nuit :
- un cyclo vert peint en dégradé, avec des croix de tracking ;
- des voilages noirs et une grille avec des cyc lights ;
- une softbox, un fresnel, un panneau LED et un C-stand ;
- le clap « BLACK FRIDAY BLAST, scene 10K, take 47 » ;
- au milieu, le moniteur de retour avec sa promo : lui incrusté à côté d'une fausse voiture de sport, « REC 00:24:00:00 ».

Le coach est assis sur un apple box, Setty sur deux flight cases (« CAM B », « FRAGILE »), orange sur vert.

**Les cartes (2 nouvelles, chacune dans son fichier).** Elles sont faites pour être lues à 70 % à côté de celui qui
parle :
- `st.contactsList` (`card_contactsList.js`) : ses contacts Manychat. D'abord le compteur qui monte à 10,000 et le bouton
  « Send to all » sur « blast ». Ensuite ses contacts de mars : les dates passent au rouge et un cadenas tombe sur chacune,
  puis « By hand », « 7 days », « No promo » et « RIP 🪦 » sur « graveyard ».
- `st.window24` (`card_window24.js`) : la fenêtre de 24 h, en trois temps.
  - Elle s'ouvre : le DM « how much? 👀 », « Open », « Reply freely », « Offers allowed ».
  - Les heures défilent jusqu'à 00:00:00 : « Closed », « No automation », « Not sent » sur le BOOM.
  - Un nouveau DM la rouvre : l'horloge repart à 24:00:00, « Open again », « 24 fresh hours ».

  Puis le mode relances : « Reply ✓ », puis « Follow-up » à 4 h, 12 h et 20 h pendant que l'horloge tourne. Toutes
  arrivent avant zéro, et l'horloge s'arrête à 04:00:00.

**La mise en scène.**
- Champ-contrechamp avec poussée continue sur celui qui parle.
- Un BOOM sur « won't even send them », « Meta did » et « twenty-four hours » ; un « Fahhh » après « March is a
  graveyard, bro » et après la chute, avec la caméra sur le coach.
- La musique meurt après le dernier BOOM. « Okay. How do I set you up? » se joue en plan large et en silence, puis la
  chute : Setty en gros plan, et sur « pitching », coupe sur l'écran du moniteur (la fausse promo). Elle revient après
  « SETTY ».

## Ce qui a été vérifié

- **Les faits.** Chaque fait vient de `sources/banque-2.md` (idée 16 et faits produit), et ses sources sont dans
  `post.json`. Aucun « always 24 hours », aucun « you can never message them again », aucune astuce des 23 h, rien sur
  les tags pour automatiser, rien qui promet d'éviter un bannissement, jamais « instant ».
- **La voix.** Whisper sur le mix comprend chaque mot. Le « you » ajouté à la fin est l'hallucination connue sur la queue
  de musique, et SETTY est entendu « SETI » (une graphie, pas un mot perdu).
- **Le rendu en 30 i/s.** 1080×1920, 59,3 s (≤ 60,0 s), -14,2 LUFS, crête -2,1 dBTP, image 0 non noire : c'est la
  miniature, le plan large avec le titre-hook.
- **Les images tirées du MP4** (`frames`). Les 8 sauts sont voulus (les BOOM, le plan large, la coupe sur la promo, le
  « Fahhh », la notification). Le seul signalé (52,53 → 52,67 s) est la pulsation du titre sur « SETTY » : la différence
  entre les deux images est dans le titre (38) et les sous-titres, pas dans l'image 3D (4,7). Ce n'est pas un conflit
  de caméra.
- **Les contrôles.** Le check de HyperFrames passe. Les règles maison ne remontent qu'une alerte, le titre sur 3 lignes,
  gardé mot pour mot comme validé.
- **Le kit.** Aucun fichier commun n'a été modifié : seulement mon décor et mes deux cartes, déclarés dans
  `lot/notes.md`.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le reel faisait 60,4 s**, au-dessus du plafond : les enchaînements sont resserrés sans nouvelle prise, il fait 59,3 s.
2. **Une carte apparaissait sur le visage du coach** (la réplique 6 arrivait pendant que la caméra passait de lui à Setty).
   Les cartes apparaissent maintenant une fois la caméra arrivée sur celui qui parle, et leur clic est placé hors du
   début des mots, avec une marge (un premier passage tombait sur « hand »).
3. **Le compteur chevauchait son libellé et le bouton « Send to all » était coupé** : la carte est plus haute et mieux
   espacée.
4. **La carte des relances restait vide 2,5 s** : elle arrive sur « answer » avec la ligne « Reply ».
5. **La chute était ratée** : en plan à deux, l'écran du moniteur était caché sous le titre et Setty passait sous les
   boutons d'Instagram. Désormais, gros plan sur Setty, puis coupe sur l'écran, qui remplit la largeur entre le titre et
   les sous-titres. Comme Setty n'est plus à l'image sur le bip, la barre du bip reste dans les sous-titres.
6. **La carte de la réplique 9** (« These rules are set by Meta ») est retirée : la réplique dure 2,1 s, sous les 2,5 s
   d'une carte. Le BOOM et la poussée sur Setty portent la phrase.
7. **Le texte des cartes** est passé à 86 px dans la carte, soit 60 px à l'écran à 70 % : états, lignes, pastilles, bouton,
   noms. Les DM sont raccourcis pour tenir à cette taille.
8. **La silhouette du coach dans la promo n'avait pas de visage** : il a les yeux et son sourire de pub.

## Ce qui peut encore monter le niveau

1. **Une version de 30 à 35 s** (`studio.py cut`, sans nouvelle voix), pour tester la rétention : retirer les
   répliques 3, 7 à 9 et 11.
2. **Le lip-sync en vraies formes de bouche**, déjà proposé aux reels précédents.
3. **Les en-têtes des cartes** (« 24-hour window », « Manychat Contacts ») font environ 40 px à l'écran : on peut les
   grossir.
4. **Le titre sur 3 lignes** prend de la hauteur aux gros plans. Le passer à 2 lignes voudrait dire changer la slide 1 du
   carrousel, ce qui reste ta décision.

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST.
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels précédents.
- Rien n'est programmé sans ton go.
