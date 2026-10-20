# Débrief du reel 10 « The big coaches' DMs » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 5 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S1_AV1_big-coaches-dms`.

- Le coach a loué un jet privé pour une heure, « pour vivre comme les gros coachs ». Il en passe quarante minutes dans
  ses DM : c'est le premier roast.
- Setty lui montre comment les gros comptes gèrent vraiment leurs DM : ils recrutent des gens pour ça. Preuve à l'appui,
  une vraie offre d'emploi publique, citée mot pour mot (un coach à 363K abonnés, la source du carrousel).
- Il lui montre le système des gros comptes : le coach filme, le setter répond, le closer signe. Le coach, lui, fait
  les trois.
- Puis « copy their system, not their payroll » : un setter aux États-Unis coûte 13 à 21 $ de l'heure plus commission
  (PayScale). Suivent Manychat, sa voix, l'agenda réservé aux leads sérieux, la reprise de la conversation quand il
  veut, et 119 $ par mois.
- La chute : « ce jet redevient un Uber dans dix minutes ».

18 répliques, 59,9 s, 2 bips.

**Le décor (nouveau).** Une cabine de jet privé au coucher du soleil :
- sièges club en cuir crème (Setty sur deux coussins, il est petit, le siège non) ;
- une table en noyer avec deux flûtes et une bouteille au frais ;
- une moulure en noyer le long de la cabine ;
- sept hublots ovales sur une mer de nuages dorés, et le soleil qui entre en faisceaux.

Toutes les pièces restent dans `assets/sets/jet.js` : le kit des décors n'a pas bougé.

**Les voix.** Le coach en Fenrir, Setty en Charon, 3 prises chacun. Whisper comprend chaque mot des prises retenues :
il écrit seulement les nombres en chiffres (363K, 119, 10). Aucune réplique n'a dû être refaite.

**Les cartes.**
- Sa boîte Instagram qui déborde. C'est une nouvelle carte du kit, `st.igDMs` : les rangées arrivent en haut avec le
  point bleu, et le compteur de non-lus grimpe jusqu'à 40. Les reels 6, 7 et 11 s'en servent aussi.
- L'offre d'emploi citée mot pour mot, « 363K followers » et « a ton of leads » surlignés au moment où il les lit.
- Le système des gros comptes en trois lignes, puis sa propre version : « you, you, you ».
- Ce que coûte un setter (PayScale), le tuyau Instagram, WhatsApp, Messenger → Manychat → ManySetter → Calendly
  (« Serious leads only »), puis « You jump in » et « $119/month, per live setter ».
- Une pastille rouge « Jet rental: 10 min left » sur la chute.

**La mise en scène et le son.**
- Champ-contrechamp avec la poussée continue sur celui qui parle.
- Un BOOM sur « someone? », « payroll. » et « month. ».
- Un « Fahhh » après les trois roasts, la caméra sur le coach.
- Ses clics quand une carte arrive.
- Sa musique, qui meurt sur « How do I set you up? » et revient après « SETTY ».

## Ce qui a été vérifié

- Chaque fait est à sa source, notée dans `post.json`. Personne de réel n'est nommé ni montré ; rien ne relie
  l'auteur de l'offre d'emploi à ManySetter. Setty ne prétend pas repérer seul les « gros deals » : le coach reprend la
  main quand il veut (brief).
- Règles maison sans alerte : pas de tiret, « Manychat » à l'écran, 2 bips. Vérifications HyperFrames passées.
- Les deux personnages sont regardés sous tous les cadrages du reel : le plan large, les gros plans, les cadrages avec
  une carte à gauche ou à droite, la poussée. Je n'ai vu aucune pièce qui traverse ni aucun visage sous une carte.
- Rendu 30 i/s (`renders/reel10_v1_30fps.mp4`, livré dans `07_PRET_A_PUBLIER/261020_REEL_S1_AV1_big-coaches-dms/`) :
  1080×1920, 59,9 s, -14,2 LUFS, crête -2,1 dBTP. L'image 0 n'est pas noire : c'est la miniature, le plan large avec le
  titre-hook.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Les hublots étaient vides** : la vue passait derrière la paroi.
2. **Les hublots sont devenus noirs** avec un flou de canvas (`ctx.filter`), que le Chrome de rendu ignore. La règle est
   ajoutée au guide du studio.
3. **Les nuages ressemblaient à des boules** et étaient étirés à l'horizontale. Ils sont redessinés en dômes doux, une
   tranche de vue par hublot, sans étirement.
4. **Des bouts orange dépassaient du coussin de Setty** : remplacé par deux coussins crème empilés.
5. **La boîte Instagram du kit était illisible à 55 %** : nouvelle carte en gros caractères (`st.igDMs`).
6. **Le bonnet du coach passait sous le titre** en gros plan : son cadrage est descendu.
7. **Sur « I don't even like coaching anymore »**, sa tête tombe et sa bouche descendait dans les sous-titres. Cette
   réplique est cadrée plus haut, avec moins de poussée.
8. **La pastille « Jet rental », la barre de commentaire et la notification de fin touchaient la tête de Setty.** La
   fin est cadrée plus large, la barre arrive une fois la caméra posée sur lui, la notification une fois revenue sur le
   plan large.
9. **La carte « Your DMs » apparaissait vide** une seconde : elle arrive juste avant sa première ligne.
10. **Un clic tombait juste avant « an Uber »** : il est retiré, la pastille arrive sans son.
11. **Le script** : la réplique 15 disait « I hand you the chat » en réponse aux « gros deals », comme si Setty les
    repérait seul. Elle dit maintenant « You jump in whenever you want », ce qui est vrai.

## Ce qui peut encore monter le niveau

1. **Whisper sur le mix** signale des mots qui changent d'un passage à l'autre, avec les mêmes sons : un « should » en
   trop, « bah » sur les « Fahhh », « setter » entendu « center ». Sur la voix seule, chaque mot est juste.
   Je n'ai pas fait de vérification Whisper séparée, à ta demande : à écouter sur le rendu.
2. **Le tuyau Manychat** reste la carte la moins lisible (sombre, petites légendes), comme au reel 3.
3. **Une version de 30 à 35 s** en parallèle (sans les répliques 3 à 5), pour la rétention.
4. **Le lip-sync en vraies formes de bouche**, déjà proposé aux reels 2 et 3.

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST (même jour que son carrousel,
  6:30 pm ET).
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- La source précise de la musique, à noter quand tu l'as.
- Rien n'est programmé sans ton go.
