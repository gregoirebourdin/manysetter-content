# Débrief du reel 18 « DM ads » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 14 de la banque n° 2, en paire avec le carrousel `261020_CAR_S1_AV1_dm-ads`. Le coach est fier de
ses pubs : « Three hundred conversations started ». Setty lui montre ce que la métrique de Meta compte vraiment (les gens
qui lui ont écrit après la pub, pas ceux qui ont eu une réponse). Puis il dit ce que ça cache : beaucoup cliquent sans
vrai besoin, et les sérieux partent chez celui qui répond le premier. ManySetter arrive parce que le coach, en appel toute
la journée, ne peut pas vivre dans ses DM. 16 répliques, 2 bips, 2 « Fahhh », 2 BOOM en plus de celui de l'accroche, une
coupure de musique.

**Le décor (nouveau) : une salle de réunion en haut d'une tour, l'après-midi** (`assets/sets/boardroom.js`, banc
`lab/boardroom`).
- Un grand écran mural affiche son tableau de bord : « Messaging conversations started 300 », une courbe qui monte et
  trois tuiles de démo.
- Une longue table en noyer laqué, des fauteuils de direction vides et un mur à lattes de bois.
- Une baie vitrée sur des tours de verre, sous un ciel bleu, et un tableau en verre avec un entonnoir « ADS → DMs → $$$ ».
- Le coach est debout au bout de la table, à côté de l'écran, comme s'il présentait. Setty est assis sur la table, seul
  participant à la réunion : c'est la chute du reel.

**Les voix** (générées par MANYSETTER REELS) : Setty en Charon (prise 3), le coach en Fenrir (prise 1). Voix : 52,5 s ;
reel : 54,5 s.

**Les cartes, toutes en très gros caractères** (97 px dans la scène, environ 60 px sur le téléphone à 62 %), à gauche,
celui qui parle à droite :
- Son résultat de pub : en-tête « Ads Manager », le vrai nom de la métrique sur trois lignes, puis « 300 » qui défile
  pendant qu'il le dit, et la pastille « Active » (nouvelle carte `adMetric`).
- La même carte quand Setty explique la métrique : « ✓ messaged you » sur « messaged », « ✗ got an answer » sur le BOOM
  de « Not who got an answer ».
- La lead qui a attendu (mia.fit) : « saw your ad 👀 », « how does it work? », puis « hey! sorry 🙏 » envoyé « +2d »
  qui reste en « Seen ». Son statut passe en rouge à « Active 2d ago » (carte `bigDM` du reel 12).
- Le relais : « your ad → Manychat », puis « they reply → I take over », chacun coché sur son mot (carte `twoWays` du
  reel 14). La tuile Instagram, jamais de logo Manychat.
- La même lead, cette fois avec une réponse dans sa voix : « what's your goal? 🙂 » (tapé), « drop 15 lbs », puis
  « tue 2pm or wed 11am? ».

**La mise en scène.**
- Champ-contrechamp, avec la poussée continue sur celui qui parle et les cartes à côté de lui.
- La musique meurt comme une bande sur « Okay. How do I set you up? », et la caméra recule au plan large : la salle vide.
  La chute (« an empty [bleep]ing boardroom ») tombe dans le silence, et la musique revient après « SETTY ».
- Les deux BOOM : sur « Not who got an answer » et sur « whoever answered first ». Les deux « Fahhh » tombent sur le
  coach, après « guestbook » et après « boardroom ».
- La fin commune du kit : la barre de commentaire tape SETTY, retour au plan large qui reboucle sur l'image 0, la
  notification, le bouton.

## Ce qui a été vérifié

- **Les faits** viennent de `sources/banque-2.md`, idée 14 et faits produit communs :
  - le nom et la définition de la métrique (A1, A2) ;
  - le déclencheur de pub et le premier message gardés par Manychat (A6, A8) ;
  - une question à la fois et l'agenda réservé aux bons leads (P6, P10).
  - « 300 » est la situation du lecteur, et les valeurs du tableau de bord et des cartes sont des démos.
  - Rien sur les publications boostées ni sur WhatsApp (A7, A9).
  - cl007, mc36 et mc37 ne sont pas utilisés.
  - Aucune vitesse vendue, aucun chiffre d'appels, aucun résultat.
- **Whisper sur le mix** : tous les mots sont compris. Seule différence d'orthographe : « guest book » et « board room »
  écrits en deux mots.
- **Contrôle HyperFrames** : 0 erreur, 0 problème de mise en page. Les règles maison passent (tirets, « Manychat »,
  bips, sous-titres, aucun clic sur le début d'un mot).
- **Rendu 30 i/s** : 1080×1920, 54,5 s (moins de 60,0 s), -14,2 LUFS, crête -1,8 dBTP, image 0 non noire (le plan large
  avec le titre-hook et « 300 » à l'écran).
- **Images tirées du MP4** (`studio.py frames`) : 6 sauts, tous voulus (le coup de zoom sur le bip de l'accroche, le
  flash du drop, le BOOM de la réplique 4, la coupe « Fahhh » de la chute, la notification de fin). Aucun retour en
  arrière de la caméra.
- **Le décor** vu sous les cadrages du moteur (plan large, gros plans, plans avec carte à gauche et à droite, côté,
  dessus, bas, droite) :
  - le coach debout ne traverse ni la table ni un fauteuil, et rien n'est devant une bouche ;
  - derrière Setty, le ciel est bleu, jamais d'orange ;
  - aucun `ctx.filter`.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le « 300 » de l'écran était caché par la tête du coach** sur l'image 0. Le tableau de bord est inversé (la courbe à
   gauche, le chiffre à droite) et les personnages sont rapprochés. La miniature montre maintenant « Messaging
   conversations started 300 » en entier.
2. **Le plan large coupait le coach et Setty aux bords**, et le visage de Setty tombait sur les sous-titres. La caméra est
   resserrée et plus basse, et la table est décalée.
3. **Un seul fauteuil vide se voyait** dans le plan large, ce qui affaiblissait la chute. Les fauteuils sont replacés :
   deux sont vides entre le coach et Setty.
4. **Un repère nommé « click » déclenchait un vrai clic** sur le mot « click » (le son prend tous les repères qui
   commencent par « clic »). Il est retiré.
5. **Les cartes apparaissaient pendant le changement de plan**, une fois sur le visage du coach (instantané à 37,5 s).
   Elles apparaissent maintenant quand la caméra est arrivée sur celui qui parle, le clic 0,12 s avant.
6. **Le texte de la carte `adMetric` était trop petit** (80 px). Il passe à 97 px (60 px sur le téléphone), et la
   période « Last 7 days », qui débordait de l'en-tête, est retirée.
7. **« Instagram + Manychat » se lisait comme un seul logo** sur la carte du relais : une flèche les sépare
   (« → Manychat »).
8. **Deux contrastes faibles** : les initiales blanches de la lead sur un fond ambre (le fond passe en violet), et un mot
   orange des sous-titres sur la fenêtre claire (l'accent est retiré de « first. », « whoever » reste en orange).

## Ce qui reste à améliorer

- Le script prévoyait un court panoramique sur les fauteuils vides après le dernier « Fahhh ». Il n'y a pas la place
  (la pause de 0,95 s du « Fahhh » est prise par la coupe sur le coach) : le retour au plan large du CTA montre la salle
  vide à la place.
- Sur le plan large de fin, la notification couvre le « 300 » de l'écran pendant 1,5 s. C'est le placement commun du kit,
  calculé pour ne couvrir aucune tête ; l'image 0 le montre bien.
