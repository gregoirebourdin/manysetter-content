# Débrief du reel 16 « The $600 setter » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 13 de la banque n° 2 (l'idée du fondateur), en paire avec le carrousel
`261020_CAR_S2_AV2_600-setter`. Le coach est fier du setter qu'il paie 600 $ par mois plus 5 % (« Best hire ever,
bro »). Setty lui pose une seule question : quand a-t-il répondu à ton dernier lead ? Elle a demandé à 14 h, il a
répondu à 17 h, et à 17 h elle était déjà dans les DM d'un autre coach. Le coach veut le virer, Setty le défend (d'autres
clients, une vie, du sommeil : le méchant, c'est le délai, jamais le setter), puis ManySetter arrive parce que le coach
demande s'il doit répondre lui-même depuis le bureau de son setter. 16 répliques, 3 bips (l'accroche, le coach sur
« six hundred [bip]ing bucks », la chute), 2 « Fahhh », 3 BOOM en plus de celui de l'accroche, une coupure de musique.

**Le décor (nouveau) : l'open space d'une agence de setting, au crépuscule** (`assets/sets/callcenter.js`, banc
`lab/callcenter`). Des rangées de postes vides à cloisons basses, des écrans en veille, des casques sur les bureaux, un
plafond à dalles, un tableau LED « CALLS WAITING 47 · LONGEST WAIT 3:03:12 · AGENTS AVAILABLE 0 », une horloge à 7:12,
une fontaine à eau, et une baie vitrée sur la ville au crépuscule (la lueur à gauche, le ciel violet derrière Setty :
jamais d'orange sur orange). Le coach est dans le fauteuil de son setter ; derrière lui, l'écran verrouillé « 7:12 PM »
et un post-it « back tomorrow 9 AM :) ». Setty est perché sur la cloison du poste voisin.

**Les voix** (générées par MANYSETTER REELS, répliques 4 et 11 refaites) : Setty en Charon, le coach en Fenrir.
Voix : 48,7 s ; reel : 50,7 s.

**Les cartes, toutes en très gros caractères** (environ 60 px sur le téléphone ou plus), à côté de celui qui parle :
- Le contrat (réplique 1) : l'étiquette « $600 a month », puis la pastille « + 5% of sales » sur « five » (carte
  `priceTag` du reel 12).
- Son lead (répliques 3 et 4) : « still available? », puis « yes, still open! » marqué « +3 h » sur « five », et son
  statut qui passe à « Active 3h ago » en rouge ; la caméra reste sur le coach pendant « By five, » puis coupe sur Setty
  pour « she was in another coach's DMs » (BOOM) (carte `bigDM` du reel 12).
- La slide noire du carrousel (réplique 5) : « $600 a month / for a reply / 3 hours late », la dernière ligne au
  surligneur orange (nouvelle carte `bigText`).
- « other clients, / a life, / sleep. » (réplique 6), en version claire de la même carte, après « It's not his fault. ».
- Le même lead, toujours « Active now » (réplique 8) : les trois points sur « plug », puis une seule réponse avec une
  seule question, « yes! what's your goal? » sur « answer », sans heure affichée (on ne vend jamais la vitesse).
- « tricky ones? → your team + the context » (répliques 9 et 10), la caméra reste sur Setty pendant la question du coach.
- La même étiquette que le contrat, cette fois « $119 a month », et la pastille « no commission » sur « and I don't
  take five percent » (BOOM sur « five »).

**La mise en scène.** Champ-contrechamp avec la poussée continue sur celui qui parle. Le coach en réaction sur le
statut rouge de son lead. La musique meurt sur « Okay, how do I set you up? » (plan large, silence) ; la chute coupe sur
le post-it du setter (« back tomorrow 9 AM :) ») pendant « he went home like a normal human », puis « Fahhh » sur le
coach. La fin commune du kit : la barre de commentaire tape SETTY, retour au plan large, la notification, le bouton.

## Ce qui a été vérifié

- Les faits viennent de `sources/banque-2.md` (idée 13) : 600 $ plus 5 % et « 14 h → 17 h » sont la situation du
  coach, dite par lui, jamais un prix du marché ni un fait sur les setters ; « while she's still in the chat » est la
  formulation sûre (P4, P5) ; le passage à l'équipe avec le contexte (P11) ; 119 $ par setter live, sans commission
  (P1). Aucune réponse instantanée, aucun résultat, aucun client. rd19 (une boutique) sert pour l'émotion seulement.
- Le setter n'est jamais le méchant : Setty le défend deux fois (réplique 6 et la chute).
- Whisper sur le mix : tous les mots compris, sauf le mot bipé de l'accroche (« fuck set her » : c'est le bip) et
  « dollars » ajouté (de l'orthographe, déjà relevé par MANYSETTER REELS).
- Contrôle HyperFrames : 0 erreur, 0 problème de mise en page, 29 textes sur 29 au contraste AA ; règles maison : OK.
- Rendu 30 i/s (`renders/reel16_v2_30fps.mp4`, livré) : 1080×1920, 50,7 s, -14,2 LUFS, crête -1,8 dBTP, image 0 non
  noire (le plan large : le titre-hook, le tableau LED lisible dessous, le coach et Setty).
- Images tirées du MP4 (`studio.py frames`) : 13 sauts, tous voulus (la prise de vue de l'accroche, le flash du drop,
  les 3 BOOM, la coupe vers Setty sur « she », les deux coupes « Fahhh », la coupe franche sur le post-it, le retour au
  coach, la notification de fin). Aucun retour en arrière de la caméra.
- Le décor vu sous les cadrages du moteur (large, coach, Setty, cartes à gauche et à droite, poussées, côté, bas) : le
  coach assis sans traverser son fauteuil, rien devant une bouche, aucun `ctx.filter`, pas d'orange derrière Setty.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **La carte « Not his fault » (liste à icônes) avait un texte trop petit** et mordait sur la tête de Setty : elle
   devient une carte de texte en très gros caractères (version claire de `bigText`).
2. **La carte du passage à l'équipe (la carte « hand-off » du kit) était illisible** à cette taille : même remplacement
   (« tricky ones? → your team + the context »).
3. **La réponse de Setty dans le DM arrivait à la fin de la réplique** et ne restait que 0,3 s : elle tombe maintenant
   sur « answer », et reste plus de 2 s.
4. **Le nouveau prix « $119 » était une petite pastille** au-dessus de « $600 » barré : c'est maintenant l'étiquette
   elle-même qui dit « $119 a month » (le rappel visuel du contrat de la réplique 1).
5. **Les cartes de Setty touchaient le haut de sa tête**, et sa bouche passait sous le haut des sous-titres en fin de
   poussée : Setty est cadré un peu plus petit, la carte au-dessus de lui.
6. **La main du coach entrait dans les gros plans de Setty** (bord gauche) : le coach est décalé de 0,2 vers la gauche
   et le gros plan de Setty est plus frontal.
7. **La notification de fin touchait le bonnet du coach** : le plan large regarde un peu plus haut ; en image 0, le
   tableau LED se lit maintenant sous le titre.
8. **Un clic tombait sur « And »** (réplique 9) : avancé de 0,05 s.
9. **Le plan de coupe sur le post-it passait par la tête du coach** pendant quelques images (vu sur les images du MP4,
   41,1 s, jamais sur les instantanés) : c'est maintenant une coupe franche.
10. **Un claquement dans la prise du coach** (réplique 5, dans le silence entre « late? » et « I'm », 30 ms presque à
    pleine échelle) : l'AAC en faisait une crête à -0,1 dBTP et on l'entendait. Ce silence est coupé dans `audio.py`
    (fondus de 3 ms), sans toucher au fichier de voix ni refaire de prise.

## Ce qui peut encore monter le niveau

1. **Deux bouts de réplique dits hors champ** (la question du coach « And the tricky ones? », et le « By five, » de
   Setty au début de la réplique 4) : c'est voulu pour garder les cartes 2,5 s au moins, mais une version qui coupe sur le coach pendant 0,7 s
   donnerait plus de rythme si les cartes pouvaient rester moins longtemps.
2. **Une version de 30 à 35 s** pour la rétention, sans nouvelle voix (`studio.py cut`), en retirant les répliques 9 à 11.
3. **Le tableau LED** pourrait clignoter (le « 0 » d'« AGENTS AVAILABLE ») sur la chute : une animation de texture,
   à faire dans le décor si le fondateur aime l'idée.
