# Débrief du reel 12 « The price ghost » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 11 de la ligne éditoriale, en paire avec le carrousel `261020_CAR_S1_AV1_price-ghost`. Le coach a
envoyé son prix (1 500 $ pour 12 semaines), il est en « Seen » depuis mardi, et il veut baisser à 999 $. Setty démonte
l'idée :
- ce n'est pas le prix : le lead ne sait pas encore ce que ça règle pour lui ;
- dire non est gênant, alors il disparaît ;
- la réponse : le prix, plus une question (« what made you reach out today? »), et une relance s'il se tait.

Puis Manychat : Setty donne le prix depuis l'offre, pose la question suivante et relance jusqu'à 3 fois en 24 h.
17 répliques, 165 mots, 2 bips, 2 Fahhh, 3 BOOM.

**Le décor (nouveau).** Un coworking vide la nuit (`assets/sets/coworking.js`) :
- une longue table commune en chêne sous une rangée de suspensions noires ;
- des chaises coque poussées sous la table et des portables fermés ;
- une cabine téléphonique vitrée, un néon orange « GOOD VIBES ONLY » et le tableau blanc du coach (« THE PLAN… 4. ??? ») ;
- une verrière sur le centre-ville la nuit, bleu nuit derrière Setty.

Le coach est seul en bout de table devant son portable (le DM « Seen » à l'écran), et Setty est sur un pouf en feutre.
Le gag du décor : les lumières sont sur détecteur de mouvement (`R.set.power(v)` éteint les suspensions une à une).

**Les cartes (nouvelles, un fichier chacune).**
- `bigDM` : un DM Instagram en très gros caractères (bulles de 96 px, environ 60 px sur le téléphone). On y voit le
  « Seen », le statut qui passe au rouge et le prix barré, avec « $999? » écrit par-dessus. Il sert trois fois : son DM
  (« how much? », « $1,500, 12 weeks », « Seen Tuesday »), la bonne réponse (le prix, « what made you reach out? », le
  lead qui écrit), puis les trois relances (« +3 h still keen? », « +9 h busy week? », « +20 h no rush »). Le reel 14 a
  annoncé qu'il la réutilise.
- `priceTag` : une étiquette de prix seule, « $1,500 / 12 weeks », des « ? » qui popent autour et la pastille
  « fixes… what? ».
- La checklist du kit pour « Plug me in » : Manychat (vos flows restent), puis le prix et la question, depuis votre offre.

**La mise en scène.**
- Répliques 1 à 3 : la caméra reste sur le coach et son DM. Setty dit « And he said? » hors champ, pendant que le DM
  continue sous nos yeux.
- Champ-contrechamp avec poussée continue sur celui qui parle, et cartes à côté de lui, sous le titre de 3 lignes.
- Un BOOM sur « not your price », « zero words » et « Manychat ».
- Un Fahhh après les deux roasts (« at a discount », « since Tuesday »), avec la caméra sur le coach.
- La musique meurt sur « Okay. How do I get you? ». Pendant « The lights are on a motion sensor », un plan en contre-plongée
  sur les suspensions qui s'éteignent une à une, avec un clic chacune. Le coach apparaît dans le noir, éclairé par son
  portable, puis Setty dans le noir pour « You haven't moved since [bip] Tuesday ». Au Fahhh, le coach agite les bras, la
  lumière revient, et la musique avec elle.
- La fin commune : le clin d'œil, la barre de commentaire « SETTY », le plan large et la notification.

## Ce qui a été vérifié

- Chaque fait est à sa source (`sources/banque-2.md`, idée 11, P8 et P12) et noté dans `post.json`.
  - « 9 out of 10 » est la situation du lecteur, jamais une statistique.
  - Setty dit « up to three times ».
  - Rien sur la vitesse de réponse.
- Le décor a été vérifié sous les cadrages du moteur (`lab/coworking`) :
  - le plan large, les gros plans poussés, les cadrages avec carte à gauche et à droite, l'insert sur le portable ;
  - des vues de côté, de dessus et en contre-plongée ;
  - pas de `ctx.filter`, rien devant une bouche, le coach assis sans traverser sa chaise.
- `check` passe : pas d'erreur de mise en page ni de contraste. Les sons respectent les règles : aucun clic sur le début
  d'un mot, et les Fahhh tombent dans les pauses.
- Rendu 30 i/s livré (`deliver`) : 1080×1920, 54,1 s (60,0 s au plus), -14,2 LUFS, crête à -2,3 dBTP. L'image 0 n'est
  pas noire : c'est la miniature (le plan large avec le titre-hook).
- `frames` sur le MP4 : un seul aller-retour signalé, à 48,07 s. C'est la pulsation voulue du titre sur « SETTY », pas
  deux mouvements de caméra qui se battent.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le titre de 3 lignes mangeait le haut des gros plans.** Les cadrages du décor sont plus bas : le coach à y 850, et
   Setty à y 1000 avec une distance de 11,5.
2. **Les lumières ne s'éteignaient pas à l'image.** `R.onFrame` passe après le rendu de l'image. Le détecteur est donc
   piloté par un tween de la timeline `act`, rejouée avant chaque image : n'importe quelle image se rend seule.
3. **On ne voyait pas les lampes s'éteindre** dans le plan large, car elles étaient cachées par le titre. J'ai ajouté le
   plan `lamps` dans le décor.
4. **Les cartes de droite sortaient de l'écran** et Setty y était minuscule. Les cartes ont maintenant une marge de
   24 px, et Setty est cadré comme dans son gros plan.
5. **Le tuyau Manychat était illisible à 62 %.** Je l'ai remplacé par la checklist du kit, en gros.
6. **Les « ? » de l'étiquette couvraient le prix.** Ils sont autour, au-dessus de l'étiquette.
7. **Le « $999? » chevauchait la bulle d'au-dessus.** C'est voulu : je l'ai marqué comme superposition autorisée.
8. **Les initiales blanches sur bleu clair** ne passaient pas le contraste : le bleu est plus foncé.
9. **La traîne du 3e BOOM masquait « then »** deux secondes plus tard : elle est raccourcie à 1,6 s.
10. **Deux clics tombaient sur le début d'un mot** (« Plug », « motion ») : ils sont déplacés dans des creux.

## Ce qui reste

- **La voix des répliques 3, 12 et 14** (Setty) est à reprendre par MANYSETTER REELS, vers 9 h 05 :
  - « And you said? » au lieu de « And he said? » ;
  - « praise » au lieu de « price » ;
  - « Maybe you just forgot » au lieu de « Maybe he just forgot ».

  Une fois la voix installée : `go`, un nouveau rendu, `frames`, puis la livraison. Tout est calé sur des noms de repères.
- La notification de fin n'a pas de place entre le titre de 3 lignes et les têtes. La solution de secours du kit la
  pose petite, juste sous le titre, et elle touche le haut du bonnet.

## Ce qui peut encore monter le niveau

1. **Une version de 30 à 35 s**, sans les répliques 6 à 10 (`studio.py cut`), pour la rétention.
2. **Le plan des lampes** : une vue en enfilade le long de la table, plus graphique, si le rendu actuel paraît sage.
3. **La checklist « Plug me in »** reste en 66 px (41 px à l'écran) : une version `xl` dans le kit la mettrait au niveau
   des autres cartes.
