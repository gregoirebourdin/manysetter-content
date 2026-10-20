# Débrief du reel 11 « The DM script » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 10 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S2_AV2_dm-script`. Le coach colle
à chaque lead le script gratuit d'un PDF trouvé sur YouTube ; Setty lui montre pourquoi ça finit en « Seen » ou en
« I'll think about it », puis lui dicte le vrai script (les 5 étapes du carrousel), et ManySetter arrive parce que le
coach demande qui fera ça pendant qu'il est à la piscine. 16 répliques, 2 bips, 3 « Fahhh », aucun chiffre d'appels.

**Le décor (nouveau) : la piscine d'une villa, l'après-midi.** Terrasse en travertin, piscine turquoise avec caustiques
et une bouée orange, deux transats blancs, un grand parasol, la villa blanche au fond, des palmiers et des collines.
Le coach est assis sur le bord d'un transat, le portable sur les genoux ; Setty est sur une table d'appoint en teck, à
côté d'un spritz orange. Tout le mobilier est dans le fichier du décor (`assets/sets/poolside.js`), rien dans le kit.

**Les voix.** Coach en Fenrir, Setty en Charon, 3 prises chacun. Prises retenues sans aucune erreur Whisper (Charon
prise 2, Fenrir prise 3). Voix : 50,5 s ; reel : 52,5 s.

**Les cartes, une par réplique qui en a besoin, toutes lisibles sur un téléphone.**
- Son PDF (« free_DM_script_FINAL.pdf ») avec l'accroche copiée, surlignée sur « paste » et « every lead ».
- Les DM de Sarah : le même « Hey! Love your energy 🔥 » envoyé par cinq coachs, le sien en dernier.
- Le fil Instagram qui se dégrade : « how much is it? » → son lien d'appel → « Seen » (BOOM, « Active 3d ago ») →
  « i'll think about it » → le pitch → le même pitch en majuscules sur « In caps. ».
- Le script, en deux cartes : les 5 étapes qui se cochent sur les mots de Setty, puis « Save it 📌 ».
- « Your playbook » de ManySetter : script, objections, ton, « Ready in about 2 min ».
- Le même « how much is it? », cette fois avec une vraie réponse (« it's $300 a month 🙂 what made you reach out? »,
  la valeur de démo du carrousel) et une lead qui continue de parler.

**La mise en scène.**
- Champ-contrechamp avec poussée continue sur celui qui parle, cartes à côté de lui.
- Pour les deux grosses cartes (le script, le playbook), Setty passe petit à gauche.
- Deux plans de coupe : la piscine vue d'en haut sur « pool? », la villa sur « villa ».
- « Fahhh » après les trois roasts, caméra sur le coach.
- Le son : son riser au début, BOOM sur « Seen. », « Manychat » et « caps lock » ; ses clics à l'arrivée des cartes. Sa
  musique se coupe sur « caps lock » (la chute tombe dans le silence) et revient après « SETTY ».

## Ce qui a été vérifié

- Chaque fait vient du carrousel validé (slides 3 à 8) ou du brief (§ 2 et 3), sources notées dans `post.json`.
  Aucun résultat, aucun client, « 50+ calls a week » abandonné faute de source.
- Whisper sur le mix final : tous les mots compris, sauf « Seen » entendu « scene » (même son, c'est de l'orthographe).
- Contrôle HyperFrames : 0 erreur ; règles maison (tirets, « Manychat », bips, sous-titres) : OK.
- Rendu 30 i/s : 1080×1920, 52,5 s, -14,2 LUFS, crête -2,0 dBTP, image 0 non noire (c'est la miniature : le plan
  large avec le titre-hook). J'ai aussi relu des images tirées du MP4 lui-même (accroche, bips, inserts, cartes).
- Les deux personnages vus sous tous les angles dans le décor (`lab/poolside` : plan large, gros plans, côté, dessus,
  dos) : le portable reste posé sur ses cuisses, les mains ne le traversent pas.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Les cartes étaient illisibles** à 55 % : chaque carte est maintenant taillée pour sa réplique (plus étroite et
   affichée à 68–72 %). Toutes tiennent sous le titre de 3 lignes et au-dessus des sous-titres.
2. **Le script en 5 étapes tenait en une carte minuscule** : il passe en deux cartes à 72 %, Setty petit à gauche.
3. **Deux barres de censure** (bouche + sous-titre) : le sous-titre du mot bipé est masqué, la barre sur la bouche suffit.
4. **Les BOOM mangeaient les mots** (Whisper entendait « c » pour « Seen » et « cab s » pour « caps ») : les BOOM
   tombent maintenant juste avant ces deux mots, et la musique se coupe sur « caps lock ».
5. **Le zoom du BOOM sortait le visage du coach du cadre** à côté de la carte : la caméra revient aussitôt.
6. **Les plans de coupe n'auraient pas tenu au rendu** : deux mouvements de caméra se chevauchaient, et la caméra
   serait revenue sur Setty en plein insert. Je les ai réécrits pour que chaque mouvement finisse avant le suivant.
   L'accroche avait le même défaut (le lent travelling d'ouverture et le coup de zoom sur Setty) : corrigé aussi.
7. **Le décor** : des boules de buis faisaient des oreilles à Setty (remplacées par une haie). On voyait du vide sous
   l'horizon derrière la villa (une pelouse le remplit). Le plan piscine montrait le haut de la tête de Setty (caméra
   déplacée).
8. **La barre de commentaire et la notification** mordaient sur le titre : elles sont descendues. La notification
   disparaît avant le bouton final, pour une dernière image propre qui boucle sur la première.

## Ce qui peut encore monter le niveau

1. **Le titre sur 3 lignes** (la slide 1 mot pour mot) prend de la hauteur : une version en 2 lignes plus courte
   laisserait plus de place aux visages, si tu acceptes un titre qui ne reprend pas la slide mot pour mot.
2. **Une version de 30 à 35 s** pour la rétention (retirer les répliques 4 à 7).
3. **Le portable qui se ferme** sur « Close the laptop » : demande un petit ajout au moteur (le décor mis à jour à
   chaque image).
4. **Pour le kit (à décider par MANYSETTER REELS)** : le gabarit `templates/reel` a le même chevauchement dans
   l'accroche que celui corrigé ici. Les reels faits avec lui peuvent avoir un petit saut de caméra vers 0,8 s.

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST.
- L'étiquette « AI info » à ajouter dans l'appli après publication.
- Rien n'est programmé sans ton go.
