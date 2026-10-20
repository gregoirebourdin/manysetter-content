# Débrief du reel 9 « ChatGPT or Claude » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 9 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S1_AV1_chatgpt-or-claude`. Le coach
anime son podcast et lance le débat : « ChatGPT ou Claude, c'est qui le meilleur setter ? ». Setty arbitre round par
round, comme le carrousel :
- round 1, écrire la réponse : les deux sont bons, égalité ;
- round 2, lire le DM : c'est le coach qui copie le DM et recolle la réponse, donc le setter, c'est lui (« a human
  clipboard with a podcast ») ;
- le verdict : « Whoever wins, you're still the setter. »

Puis ce qu'est un vrai setter (tout ce qu'il y a autour du modèle), le propre modèle de Setty dans Manychat, et la
chute : « Stop recording first, your listeners heard all that [bip]. » 18 répliques, 59,9 s, 2 bips. Aucun des deux
outils n'est dénigré, et aucune affirmation n'est faite sur ce qu'ils savent faire ou non : le reel décrit seulement
l'usage par copier-coller, comme le carrousel.

**Le décor (nouveau).** Le studio podcast du coach, le soir :
- mousse acoustique et néon « SCALE TALK » derrière lui ; hexagones en feutre derrière Setty ;
- un caisson rouge ON AIR, des ampoules Edison, une table en noyer avec une console et un casque ;
- deux micros broadcast sur bras articulés, placés sous la bouche et sur le côté pour ne jamais la cacher ;
- le coach dans un fauteuil en cuir cognac, téléphone en main ; Setty sur un tabouret haut, face à lui.

Les meubles sont dans `assets/sets/podcast.js` (micro sur bras, table, fauteuil, tabouret, mousse, hexagones, ON AIR,
ampoule Edison, lampe arc, console) : à passer dans le kit si un autre reel en a besoin.

**Les voix.** Le coach en Fenrir et Setty en Charon, 3 prises chacun, vérifiées par Whisper. Fenrir sans vraie erreur
(« Chat GPT » n'est qu'une orthographe). Deux répliques de Setty refaites seules :
- la ligne 14 : « ManyChat » sortait en « mini chat » dans les trois prises ; la nouvelle prise est nette ;
- la ligne 17 (le CTA) : « SETTY » était entendu « Sadie » (le reel 3 donnait « SETI ») ; les trois nouvelles prises
  passent, la voix complète est validée par Whisper sans erreur.

**Les cartes (deux nouvelles, dans le kit).**
- `st.duel` : le tableau du débat en direct (LIVE, « Scale Talk », ChatGPT VS Claude écrits sans logo), les deux coches
  vertes sur « Both are great », puis les rounds tamponnés : TIE, ?, puis « YOU 📋 » pile sur « So the setter is you ».
- `st.copyPaste` : la boucle copier-coller. Le DM de la lead sur Instagram, « Copy », collé dans ChatGPT, la réponse,
  recopiée et renvoyée ; le compteur « copy-pastes » passe de 0 à 1 puis 2. Sa version setter montre la même lead,
  la réponse qui arrive toute seule dans le DM, « Its own setting model », « Years of setting work » et le compteur
  qui reste à 0, en vert.
- La checklist du kit pour « Everything around the model » : ton offre et ta voix, attendre la fin du message, une
  question à la fois, la réservation et les relances, chaque ligne sur son mot.

**La mise en scène.**
- Champ-contrechamp avec poussée continue sur celui qui parle, cartes à côté de lui.
- Sur « Whoever wins, you're still the setter », la lumière tombe, la caméra se rapproche, BOOM sur « setter ».
- BOOM sur « nobody pastes anything ».
- Trois « Fahhh » : après « human clipboard » (sur le coach), après « little bubble » (cette fois sur Setty, vexé),
  après la chute (le coach en panique, en sueur).
- Sur « your listeners », plan de coupe sur le caisson ON AIR qui clignote, puis retour sur Setty pour le bip.
- La musique meurt sur « How do I set you up? » (plan large, silence) et revient après « SETTY ».

## Ce qui a été vérifié

- Chaque fait vient du brief ou du carrousel validé, sources dans `post.json`. Pas de chiffre, pas de résultat, pas de
  concurrent, rien sur la vitesse de réponse (Setty dit qu'il attend la fin du message). « Manychat » est écrit ainsi à
  l'écran. Aucun fait du reel 3 n'est repris.
- Whisper sur le mix final reconnaît chaque mot du script, dans l'ordre (le « you » en trop signalé par le contrôle
  automatique n'apparaît pas dans la transcription complète : hallucination connue de Whisper).
- Contrôle HyperFrames : 0 erreur, contrastes OK, règles maison OK.
- QA du rendu 30 i/s (`deliver`) : 1080×1920, 30 i/s, 60,0 s, -14,1 LUFS, crête -2,1 dBTP, image 0 non noire (c'est la
  miniature : le plan large avec le titre-hook et le caisson ON AIR).
- Le reel 1 et le reel 2 restent identiques image par image après mes ajouts au kit (`regress`).

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Les micros cachaient les bouches** dans les gros plans : ils sont passés sous la bouche, sur le côté de la table.
2. **Le plan large coupait Setty** et le néon apparaissait à moitié : personnages rapprochés, caméra reculée, néon
   déplacé hors du plan large (il ne se voit que derrière le coach).
3. **Des hexagones orange derrière Setty** (orange sur orange, le défaut du reel 3) : passés en gris, crème et ardoise.
4. **Les cartes étaient trop petites et à moitié vides** : je les ai refaites avec un texte beaucoup plus gros et sans
   espace mort.
5. **Le tampon « TIE » restait 0,2 s** : il tombe maintenant sur « it's a tie » et reste lisible.
6. **« YOU 📋 » arrivait sur « clipboard »** : il tombe pile sur « So the setter is you ».
7. **La barre de commentaire du CTA couvrait le front de Setty** : il est cadré plus bas.
8. **« ChatGPT » débordait de sa tuile** : police réduite.
9. **« ManyChat » et « SETTY » mal prononcés** : lignes refaites seules (quelques centimes).
10. **60,1 s** : la fin tenue est raccourcie de 0,2 s, le reel fait 59,9 s.

## Ce qui peut encore monter le niveau

1. **Les cartes des lignes 5 et 7 passent vite** (environ 1 s chacune, les répliques sont courtes) : un plan à deux les
   garderait plus longtemps, mais ça casse la règle « la caméra va sur celui qui parle ». À trancher par toi.
2. **Une version de 30 à 35 s** (sans les lignes 11 à 14) pour la rétention.
3. **Le lip-sync en vraies formes de bouche**, déjà proposé aux reels 2 et 3.

## Le final (validé le 20/10)

- Rendu en 60 i/s avec la piste caméra du moteur (`"cam_track": true`) : chaque mouvement de caméra prend la main sur
  le précédent. Vérifié sur des images tirées du MP4 : l'accroche avance sans à-coup de 0,5 à 1,6 s, le plan de coupe
  sur le caisson ON AIR tient 1,1 s (50,2 à 51,3 s), les trois réactions des « Fahhh » tiennent de 0,9 à 1 s, le plan
  large de la ligne 15 et le retour au large final sont nets. Rien d'autre n'a changé.
- QA : 1080×1920, 60 i/s, 59,95 s, -14,1 LUFS, crête -2,1 dBTP. Transmis à MANYSETTER POST pour la programmation avec
  son carrousel, le même jour (reel à 6:30 pm ET).

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST.
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- Rien n'est programmé sans ton go.
