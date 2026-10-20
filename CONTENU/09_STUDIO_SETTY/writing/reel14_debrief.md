# Débrief du reel 14 « Free coaching in the DMs » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 12 de la banque n° 2, en paire avec le carrousel `261020_CAR_S2_AV2_free-coaching-dms`. Le coach a
coaché des inconnus gratuitement en DM toute la semaine : une « quick question » devient son alimentation, son
entraînement, son sommeil ; il tape un programme entier, puis le lead « va réfléchir » et disparaît. Setty, en psy, lui
fait dire « cinq heures cette semaine », pose le mot (« free consulting »), lui donne la règle du carrousel (« Ask before
you teach »), et ManySetter arrive parce que le coach ne peut pas poser ces questions dans chaque DM. 14 répliques,
2 bips, 2 « Fahhh », 2 BOOM en plus de celui de l'accroche, une coupure de musique.

**Le décor (nouveau) : le cabinet du coach dans un brownstone de Brooklyn, le matin** (`assets/sets/coachoffice.js`,
banc `lab/coachoffice`). Mur vert sur lambris crème, divan chesterfield bordeaux (celui de ses clients), fauteuil club
bleu nuit, bibliothèque, son certificat encadré, lampadaire, mouchoirs et verre d'eau sur la table d'appoint, tapis
persan, fenêtre à petits carreaux sur une rue arborée. Le coach est affalé sur le divan de ses clients ; Setty est dans
le fauteuil du coach, sur deux coussins, un bloc-notes jaune sur l'accoudoir.

**Les voix** (générées par MANYSETTER REELS) : Setty en Charon (prise 2), le coach en Fenrir (prise 1). Voix : 48,1 s ;
reel : 50,0 s.

**Les cartes, toutes en très gros caractères** (texte de 96 à 97 px dans la scène, soit environ 60 px sur le téléphone à
62 %), à gauche, celui qui parle à droite :
- Le DM de Jake : « quick question », « my diet? 🥗 », « my training? 💪 », sur ses mots (carte `bigDM` du reel 12).
- Sa réponse tapée bulle après bulle : « ok so week 1 💪 », « mon: push day », « tue: pull day… ».
- « lemme think 🤔 », puis « any thoughts? » qui reste en « Seen », et le statut qui passe à « Active 4d ago ».
- Son Temps d'écran : « 5h 02m » qui défile, « of free coaching », une barre par jour, et le tampon « $0 billed » qui
  tombe sur « can't pay » (nouvelle carte `screenTime`).
- Les deux questions à poser d'abord : « what do you want to fix? 🙂 » (tapée), puis « ready to invest? ».
- Les deux sorties, sur la réplique produit : « the right ones → your calendar » (Calendly) et « the rest → free guide »
  (nouvelle carte `twoWays`), chacune cochée sur son mot.

**La mise en scène.** Champ-contrechamp avec la poussée continue sur celui qui parle, les cartes à côté de lui. Setty en
psy sur « And how did that make you feel? » (tête penchée, paupières basses). La musique meurt comme une bande sur la
réplique grave (« That's not lead gen. That's free consulting. », dite dans le silence) et revient avant « So I ghost
them? ». BOOM sur « Five hours » et sur « Manychat » ; « Fahhh » sur le coach après « With your thumbs » et après
« with a beanie » (il lève les yeux vers son bonnet). La fin commune du kit : la barre de commentaire tape SETTY, retour
au plan large, la notification, le bouton.

## Ce qui a été vérifié

- La seule affirmation produit (réplique 11) reprend la formulation sûre de `sources/banque-2.md` (idée 12 : P6, P9,
  P10) ; « Five hours » est la situation du lecteur. rd50 garde sa nuance (« doesn't want to »), rd93 est au discours
  indirect. Aucun client, aucun chiffre d'appels, aucun résultat. La carte montre Calendly réservé (jamais Calendly Free).
- Whisper sur le mix final : tous les mots compris, sauf « gen » écrit « jen » (même son : de l'orthographe).
- Contrôle HyperFrames : 0 erreur, 0 problème de mise en page. Une alerte de contraste passagère à 13,9 s (le statut
  rouge « Active 4d ago » pendant son apparition en fondu) ; règles maison (tirets, « Manychat », bips, sous-titres) : OK.
  Seule remarque : le titre sur 3 lignes, validé mot pour mot.
- Rendu 30 i/s : 1080×1920, 50,0 s, -14,2 LUFS, crête -2,3 dBTP, image 0 non noire (le plan large avec le titre-hook).
- Images tirées du MP4 (`studio.py frames`) : 4 sauts, tous voulus (les deux coupes « Fahhh », le « SETTY » qui
  s'affiche en gros, la notification de fin). Aucun retour en arrière de la caméra.
- Le décor vu sous les cadrages du moteur (plan large, gros plans, plans avec carte, côté, dessus, bas) : le coach est
  assis sans traverser le divan, rien devant une bouche, pas d'orange derrière Setty (fauteuil bleu nuit), aucun
  `ctx.filter`. Le plan large laisse plus de 130 px pour la notification sous le titre.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Les cartes DM étaient à moitié vides** (hauteur fixe) : elles prennent maintenant la hauteur de leurs bulles.
2. **En gros plan, la bouche de Setty tombait sur les sous-titres** pendant la poussée : son cadrage est remonté, et la
   réplique grave n'a plus de cadrage serré à part.
3. **Les cartes mordaient sur la joue de Setty** : il est cadré un peu plus à droite quand une carte est à côté de lui.
4. **« your calendar » débordait de sa carte** : la flèche est retirée, la tuile Calendly suffit.
5. **Le tampon « $0 billed » cachait « of free coaching »** : il tombe maintenant sur les barres ; l'orange de la ligne
   est un cran plus foncé pour le contraste.
6. **Au CTA, la barre de commentaire couvrait le haut de la tête de Setty** : il est cadré plus bas sur cette réplique.
7. **Le titre de 3 lignes** est plafonné à 84 px, les trois lignes à la même taille : il mange moins de hauteur, et les
   visages comme les cartes tiennent dessous.
8. **Le décor (phase 1)** : le divan cognac se confondait avec les bras du coach (il passe en bordeaux) ; Setty, enfoncé
   dans le fauteuil, avait les bras cachés (il est sur deux coussins) ; le plan large n'avait pas de place pour la
   notification (caméra reculée) ; la moitié du tapis disparaissait au loin (il est remonté au-dessus du sol).

## Ce qui peut encore monter le niveau

1. **Le téléphone du coach** ne se voit pas dans les gros plans (ses mains restent près des genoux) : il pourrait le
   lever en parlant de ses DM. Ça demande de régler la pose `phone` du coach, donc le kit (MANYSETTER REELS).
2. **Le bloc-notes du psy** est dans le décor mais peu visible : un plan de coupe sur lui pendant « how did that make you
   feel? » serait drôle (le plan `pad` existe dans le décor).
3. **Une version de 30 à 35 s** pour la rétention, sans nouvelle voix (`studio.py cut`), en retirant les répliques 7 à 9.
4. **Le titre sur 3 lignes** : une version en 2 lignes laisserait plus de place, si tu acceptes de ne pas reprendre la
   slide 1 mot pour mot.

## Ce qui t'attend

- Ton feu vert sur ce rendu (`07_PRET_A_PUBLIER/261021_REEL_S2_AV2_free-coaching-dms/reel.mp4`), puis le final en
  60 i/s et la passation à MANYSETTER POST, avec son carrousel le même jour.
- L'étiquette « AI info » à ajouter dans l'appli après publication.
- Rien n'est programmé sans ton go.
