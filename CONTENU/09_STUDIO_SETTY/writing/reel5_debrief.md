# Débrief du reel 5 « Calendly and the no-shows » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 8 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S2_AV2_calendly-no-shows`. Le coach
est fier de sa semaine pleine, mais son rendez-vous de 9 h ne vient pas. Setty démonte le tuto avec les points du carrousel :
- le lien ne demande rien (ni budget, ni objectif) ;
- un appel gratuit est gratuit à réserver, donc gratuit à rater.

Puis la solution : faire mériter le lien. Setty pose tes questions d'abord ; ceux qui ne correspondent pas reçoivent un
truc utile (ton guide gratuit) ; les bons reçoivent 2 ou 3 créneaux dans leur fuseau, et avec Calendly payant, l'appel
est réservé avec le résumé du lead dans l'événement. 18 répliques, 162 mots, 2 bips.

**Le décor (nouveau).** Un café de quartier, le matin :
- plâtre crème, lambris vert bouteille, carrelage en damier crème et vert ;
- une grande vitrine sur une rue (briques et façades pastel, store rayé orange, escalier de secours, taxi jaune) ;
- un néon « but first, coffee. » sur un mur vert, une étagère de tasses, un menu à la craie.

Le coach est sur une chaise bistrot à côté d'une table en marbre ; Setty est assis sur la table, entre le latte et le
croissant. La blague du décor : son portable est ouvert sur un appel Zoom où personne ne vient (« Waiting for Tyler to
join… », 15:02). Tout le mobilier reste dans `assets/sets/cafe.js`.

**Les voix.** 6 prises : 3 du coach en Fenrir, 3 de Setty en Charon, vérifiées par Whisper.
- J'ai gardé la prise 3 de Setty : dans la 1, « make them earn it » sortait en « make him earn it » ; dans la 2, « SETTY »
  était épelé.
- La réplique 4 (« waving at yourself on Zoom », entendue « your cell phone ») a été refaite seule : 3 prises, aucune erreur.

**Les cartes.**
- La semaine Calendly qui se remplit.
- La même semaine où tombent 3 « No-show » rouges, et le total.
- Le DM automatique qui répond à une vraie question du lead par le lien.
- La première question de Setty (« quick one first: what are you trying to fix? »).
- Le tri : le guide gratuit d'un côté, ton Calendly de l'autre.
- Les deux créneaux proposés, puis « You are scheduled » et le résumé du lead ajouté par ManySetter.

S'y ajoute un plan sur l'écran 3D du portable, sur « fifteen minutes » et sur « Close the Zoom ».

**Le kit.** Les cartes Calendly, le chat Instagram et le tri des leads gagnent une variante « xl » en gros caractères
(lisible à 55 % à côté d'un personnage), réutilisable dans les autres reels.

**Le son.**
- Ton riser, puis BOOM et ta musique sur « right? ».
- Un BOOM sur « ghost » et sur « earn it ».
- Un « Fahhh » après « In public. » et après « He's still asleep. ».
- La musique meurt sur « Wait, so I stop sending the link? » (le coach perdu, en silence), revient avec le BOOM de
  « earn it », puis se coupe sous « SETTY ».

## Ce qui a été vérifié

- Chaque fait vient du carrousel validé ou du brief (§ 2). Setty dit « Paid Calendly? » pour que la réservation reste
  vraie (sans Calendly payant, il envoie le lien). Rien ne promet de supprimer les no-shows : la légende le dit dans
  « The catch ». Tyler, Kayla, 15:02 et « third no-show this week » sont des valeurs de démo.
- Whisper sur le mix final comprend chaque mot, sauf « stop », entendu « stopped » dans « so I stop sending the link? »
  (la liaison avec « sending », sous la coupure de musique ; le sous-titre affiche bien « stop »). « 15 » est de l'orthographe.
- Rendu 30 i/s : 1080×1920, 55,8 s, -14,2 LUFS, crête -1,9 dBTP, image 0 non noire (c'est la miniature : le plan large avec le titre-hook). Rendu en 3 min 17 s.
- Les deux personnages vus sous 7 angles dans `lab/cafe` (large, gros plans, écran, deux profils, vue de dessus) : rien
  ne flotte ni ne traverse.
- Le reel 1 et le reel 2 restent identiques image par image après l'ajout au kit.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le grand plan était trop loin** (la moitié de l'image en carrelage) : caméra rapprochée.
2. **Le plan sur l'écran passait à travers le coach** : le portable est passé au fond de la table, face à la salle.
3. **Le néon sur le mur crème sortait en blanc délavé** : il est sur un mur vert foncé.
4. **Le coin du portable dépassait de la table**, et la queue de Setty touchait le portable : table agrandie, objets réespacés.
5. **La texture du marbre utilisait un flou de canvas**, qui sort noir au rendu (règle trouvée par le reel 10) : refaite sans.
6. **Les cartes Calendly auraient été à 11–14 px sur un téléphone** : variante « xl », texte à 24–28 px.
7. **Une étiquette de temps nommée « total » faisait croire au son que le reel durait 17 s** : renommée.
8. **Sur « Close the Zoom », le bras du coach cachait l'écran** : ses bras reviennent au repos pendant la réplique.
9. **La carte « You are scheduled » ne restait que 1,7 s** : elle arrive plus tôt, le résumé reste lisible plus longtemps.
10. **La barre de commentaire touchait les sourcils de Setty** : il est cadré plus bas sur le CTA.
11. **Au final (après ta validation)** : dans le rendu 30 i/s, deux mouvements de caméra se battaient (le zoom de l'accroche
    reculait d'un coup vers 1 s, et le plan sur l'écran de « Close the Zoom » ne durait que quelques images), un défaut que
    les instantanés ne montrent pas. Le final 60 i/s passe avec la piste caméra (`"cam_track": true`, règle du 20/10) :
    les deux plans sur l'écran durent ce qui était prévu, rien d'autre ne change.

## Ce qui peut encore monter le niveau

1. **Le résumé du lead reste environ 1,5 s à l'écran** : pour le laisser plus longtemps, il faudrait rallonger la
   réplique 14 (nouvelle voix) ou garder la carte pendant la réplique du coach qui suit.
2. **Le tri des leads, sur fond sombre**, reste la carte la moins lisible : une version claire en gros caractères irait mieux.
3. **Une version de 30 à 35 s** en parallèle (retirer les répliques 7 à 9), pour la rétention.
4. **« stop » entendu « stopped »** : je peux refaire la réplique 9 seule (quelques dixièmes de centime) si tu l'entends aussi.

## Ce qui t'attend

- Validé le 20/10 : final en 60 i/s (piste caméra), passé à MANYSETTER POST pour la programmation avec son carrousel.
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- Rien n'est programmé sans ton go.
