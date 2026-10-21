# Débrief du reel 17 « Make and ChatGPT » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 17 de la banque n° 2, en paire avec le carrousel `261020_CAR_S2_AV2_make-chatgpt-setter`. Le coach a
passé son week-end à monter son propre setter IA dans Make : Manychat envoie le DM à Make, ChatGPT écrit la réponse, Make
la renvoie. Setty le démonte : trois messages d'affilée donnent trois réponses, il a redemandé son prénom à la lead, la
mémoire ne se branche pas toute seule, les questions, la réservation et les relances restent à construire, et ça coûte des
crédits Make, des tokens OpenAI et ses samedis soirs. Le coach lâche « I didn't want another thing to maintain » (rd67),
et Setty retourne la liste : tout ça est déjà construit. 14 répliques, 2 bips, 2 « Fahhh », 3 BOOM en plus de celui de
l'accroche, une coupure de musique.

**Le décor (nouveau) : le garage du coach, un samedi soir** (`assets/sets/garage.js`, banc `lab/garage`). Sol en béton,
mur en parpaings peints, porte sectionnelle à moitié levée sur la rue la nuit (une voiture garée, les maisons d'en face,
un réverbère LED), un établi en bois sous un panneau à outils, trois écrans avec son scénario Make (« 3 » exécutions sur
chaque module), une réglette LED, une lampe à pince, un néon cyan « SHIP IT », une pile de pneus, une boîte à pizza au
sol. Le coach est sur un tabouret à roulettes devant l'établi ; Setty est sur une servante d'atelier noire, devant la
porte (du gris-bleu derrière lui, jamais d'orange).

**Les voix** (générées par MANYSETTER REELS) : Setty en Charon, le coach en Fenrir. Les répliques 2 (coach) et 11 (Setty)
ont été refaites avec une consigne de prononciation, après la revue (voir plus bas). Voix : 56,1 s ; reel : 58,1 s.

**Les cartes, toutes en très gros caractères** (texte de 97 px dans la scène, soit environ 60 px sur le téléphone à
62 %), à gauche, celui qui parle à droite :
- Son scénario, étape par étape sur ses mots : « my AI setter », puis Manychat → Make webhook → ChatGPT → back to DM,
  reliées par un pointillé (nouvelle carte `makeFlow` ; aucune marque dessinée, les outils sont nommés).
- Le DM de la lead : « hey! », « saw your reel 🔥 », « how much is it? » (carte `bigDM` du reel 12).
- Les trois réponses de son bot, une par bulle : « hey! 👋 », « thanks! 😊 », « how can I help? » (il rate la question du
  prix), BOOM sur « espresso ».
- Le champ Manychat « Conversation ID » vide en rouge, puis tapé (« conv_8f3a ») sur « save », et « every message » sur
  « send it back » (nouvelle carte `memoryField`, « Manychat » écrit, sans logo).
- « still on you » : questions, booking, follow-ups, chacune avec une case rouge vide (nouvelle carte `todoList`), BOOM sur
  « too ».
- Les compteurs : « Make credits », « OpenAI tokens » qui montent, « weekends left » qui descend à 0 en rouge (nouvelle
  carte `costMeter`, valeurs de démonstration).
- La même liste, cochée sur ses mots : waits, remembers, one question, books, follows up, sous « already built » et la
  tuile ManySetter (carte `todoList`), BOOM sur « I am ».

**La mise en scène.** Champ-contrechamp avec la poussée continue sur celui qui parle, les cartes à côté de lui. Le coach
passe de fier à paniqué sur « robot », penaud sur « her name twice », vaincu sur « another thing to maintain ». La musique
meurt comme une bande avant « Okay. How do I set you up? », dit en plan large dans le silence, et revient après « SETTY ».
« Fahhh » sur le coach après « Saturday nights in a garage » et après « fucking webhooks ». La fin commune du kit : la
barre de commentaire tape SETTY, retour au plan large, la notification, le bouton.

## Ce qui a été vérifié

- Chaque fait vient de `sources/banque-2.md` (idée 17 et faits produit communs). Les étapes Make sont présentées comme le
  montage du coach d'après la doc, jamais comme un tuto testé (la légende le dit : « not a tested tutorial »). « Trois
  messages, trois réponses » est une déduction, que le coach découvre en parlant. On écrit « memory doesn't wire itself »,
  jamais « no memory ». Les coûts sont les crédits Make et les tokens OpenAI, jamais « par opération ». Aucun nom de plan
  Manychat, aucun module DM Instagram attribué à Make, aucune promesse de vitesse. La réservation est dite « books », sans
  agenda nommé. mc22, mc23 et mc11 parlent de l'IA de Manychat : ils servent d'inspiration seulement, sans attribution.
- Les nombres des cartes (1,284 crédits, 48,210 tokens, conv_8f3a) sont des valeurs de démonstration, notées dans
  `post.json`. Aucune marque n'est dessinée : les outils sont nommés, avec des icônes Lucide neutres et la tuile Instagram
  du kit, jamais le logo de Manychat.
- Whisper sur le mix final : tous les mots sont compris, sauf deux points sans conséquence. « wait » est écrit
  « weight » (un homophone, levé par le sous-titre), et le « uh » de la réplique 6 est sauté.
- Le contrôle HyperFrames donne 0 erreur et 0 alerte, et le contraste passe (34 textes sur 34). Les règles maison sont OK :
  tirets, « Manychat », bips, sous-titres, durée. Il reste deux infos de recouvrement : le fondu entre deux cartes à
  23,6 s (corrigé, voir plus bas) et deux mots d'un même sous-titre à 34,9 s (normal).
- Le rendu 30 i/s fait 1080×1920, 58,1 s, -14,1 LUFS, crête -2,0 dBTP, et l'image 0 n'est pas noire (plan large et
  titre-hook). C'est la version publiée : pas de final en 60 i/s.
- Images tirées du MP4 (`studio.py frames`) : 8 sauts, tous voulus. Ce sont la poussée sur Setty au bip, le drop, le BOOM
  de « too », les deux coupes « Fahhh », et trois coupes de début de réplique. Aucun retour en arrière de la caméra.
- Toutes les cartes respectent les règles du lot. Leur texte fait environ 60 px à l'écran et chacune reste au moins
  2,5 s (la plus courte, le DM du bot, reste 3 s). Elles sortent avant que la caméra change de personnage, ne passent ni
  sur un visage ni dans les sous-titres, et commencent sous le titre.
- Le décor a été vu sous les cadrages du moteur : plan large, gros plans, plans avec carte, de dessus, de côté et de dos.
  Le coach est assis sans traverser son tabouret, rien ne passe devant une bouche, il n'y a pas d'orange derrière Setty et
  aucun `ctx.filter`.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Deux mots mal prononcés dans la voix elle-même.** « ChatGPT » sortait « ChachiBT » (le coach) et le « ManyChat » de
   Setty sortait « mini-chat ». J'ai passé Whisper sur des extraits de la voix seule, du mix sans musique et du mix : même
   résultat sur les trois, donc ni la musique ni un son n'était en cause. MANYSETTER REELS a refait les deux répliques
   avec une consigne de prononciation, et les deux mots passent maintenant.
2. **Une classe de style en collision avec le kit.** `.cm`, la classe de ma carte des coûts, existe déjà dans `stage.css`
   (les bulles de chat). Elle est renommée `.cmt`, et chaque carte n'a plus que des règles à son propre nom.
3. **Deux cartes se chevauchaient pendant leur relais** (le champ Conversation ID et « still on you ») : la première
   sort maintenant avant que la seconde entre.
4. **Dans la carte du scénario, « Make webhook » touchait le bord droit et les pointillés étaient trop pâles** : les
   pastilles sont un peu plus petites, et le trait plus foncé et plus épais.
5. **En phase 1, sur le décor** : la rue était cachée derrière le mur, la scène faisait jour et le néon se perdait sous le
   titre. La vue est passée devant le mur, la lumière est plus nocturne et le néon est descendu. L'écran du scénario Make
   est passé à gauche, pour se voir à côté du coach en gros plan.

## Ce qui reste à améliorer

- La réplique 6 du coach (« Uh, it asked her name twice. ») n'a pas de carte : elle dure 1,5 s, trop peu pour une carte
  de 2,5 s. Seul son visage la joue.
- La dernière étape du scénario (« back to DM ») ne reste que 0,7 s avant que la carte sorte, parce que la réplique
  suivante arrive vite.
- La carte des réponses du bot s'ouvre une demi-seconde avant la première bulle (en-tête seul).
- Les 4 nouvelles cartes (`makeFlow`, `todoList`, `costMeter`, `memoryField`) sont dans le kit, chacune dans son fichier.
  Elles restent à inscrire au catalogue (`PROPS.md`) par MANYSETTER REELS, qui tient le kit.
