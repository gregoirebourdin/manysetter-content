# Débrief du reel 20 « The hot lead » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 20 de la banque n° 2, en paire avec le carrousel `261020_CAR_S1_AV1_hot-lead`. À 1 h du matin, le
coach est sûr que sa lead la plus chaude va réserver « ce soir » : elle a écrit « this is exactly what I need ». Setty
lui rappelle que « tonight never comes », puis nomme ce qui s'est passé, l'écart d'empathie chaud-froid (Loewenstein,
2005), avec une lecture par analogie. Il le prouve avec l'étude de la faim (Read et van Leeuwen, 1998), que le coach vit
en direct : il a commandé le burger de demain. ManySetter arrive parce que le coach a peur d'avoir l'air « desperate » :
conclure dans le DM pendant qu'elle est chaude. 16 répliques, 2 bips, 2 « Fahhh », 3 BOOM en plus de celui de
l'accroche, une coupure de musique.

**Le décor (nouveau) : un diner américain à 1 h du matin** (`assets/sets/diner.js`, banc `lab/diner`, planche
`deliverables/duo/diner_v1.jpg`) :
- une banquette turquoise sous une vitrine sur la rue mouillée (néon rose « Motel », « VACANCY » turquoise, laverie,
  réverbère, feu vert, gouttes de pluie sur la vitre) ;
- un pilier inox avec une horloge à 1:04, un néon « EAT » rouge, des suspensions chromées, un sol en damier noir et
  crème ;
- le coach assis derrière sa commande (pancakes, frites, milkshake, café) et un sac « TO GO » avec son ticket « 1
  CHEESEBURGER · TO GO · 1:02 AM » : le burger de demain ;
- Setty assis sur la table, à côté du distributeur de serviettes.

Pas d'orange derrière Setty : son côté de la pièce est turquoise, chrome et rue froide.

**Les voix** (générées par MANYSETTER REELS) : Setty en Charon (prise 2), le coach en Fenrir (prise 1). Voix : 54,2 s ;
reel : 56,2 s.

**Les cartes, toutes en gros caractères** (environ 60 px sur le téléphone à 62 %), à gauche, celui qui parle à droite :
- **Le DM de Jess** (carte `bigDM` du reel 12) : « exactly what i need 😍 », « book a call 👉 📅 », « tonight!! 🙌 »,
  sur ses mots.
- **L'étude** (nouvelle carte `study`, mode article) : « Health Psychology · 2005 », « Hot-cold empathy gap », George
  Loewenstein. Le surligneur orange passe sur « empathy gap » au mot « hot-cold ».
- **Le chaud et le froid** (carte `study`, mode lignes) : 🔥 « In the DM » « “exactly what I need!” », une flèche, 🧊
  « Tomorrow » « “let me think…” ».
- **L'étude de la faim** (carte `study`) : « Hunger study · 1998 », Read & van Leeuwen, 😩 « Hungry » « more junk 🍩 »,
  puis 😌 « Just ate » « less junk 🍎 ».
- **La même conversation, finie dans le DM** : sa question (« how long is it? »), la réponse et une question (« 12
  weeks! your goal? »), deux créneaux (« tue 10am or wed 2pm? »), puis « ✓ booked · her time zone ».

**Trois plans de coupe dans le décor** :
- l'horloge à 1:04 sur « one in the morning » ;
- le sac « TO GO » sur « You ordered tomorrow's burger » ;
- les pancakes sur « Eat your pancakes first ».

**La mise en scène et le son** :
- Champ-contrechamp, avec la poussée continue sur celui qui parle.
- La musique meurt comme une bande juste avant « Psychologists call it… », dit dans le silence ; le BOOM de « gap » la
  ramène.
- BOOM sur « never comes », « gap » et « hot ». « Fahhh » sur le coach après « tomorrow's burger » (il lève les yeux au
  ciel) et après « the [bip]ing study » (il baisse les yeux sur son assiette).
- La fin commune du kit : la barre de commentaire tape SETTY, retour au plan large, la notification, le bouton.

## Ce qui a été vérifié

- **Les faits** reprennent les formulations sûres de `sources/banque-2.md` (idée 20 : L1, L3, L5 ; faits produit P6,
  P9, P9b).
  - Les études sont présentées comme une lecture, sans durée.
  - L'oubli (rd84) reste une autre cause : le « Maybe. » avant l'écart chaud-froid.
  - Écartés : l'étude HBR de 2011, « book later » et rd97.
  - Jamais « instantly » : « right in the chat » dit où la conversation se finit, pas à quelle vitesse.
  - La carte de réservation est une démo (« 12 weeks », les créneaux), sans client ni résultat.
  - « The catch » de la légende dit que Calendly Free ou un autre outil reçoit le lien.
- **Whisper sur le mix** : tous les mots compris.
- **Contrôle HyperFrames** : 0 erreur, 0 problème de mise en page, 37/37 contrastes AA. Une alerte de lint sur le
  surligneur de la carte (`z-index` négatif) est corrigée : il passe sous les mots par l'ordre du DOM.
- **Règles maison** : OK. Seule remarque, le titre sur 3 lignes, validé mot pour mot.
- **Rendu 30 i/s** : 1080×1920, 56,2 s (≤ 60,0 s), -14,2 LUFS, crête -2,2 dBTP, image 0 non noire (le plan large avec le
  titre).
- **Images tirées du MP4** (`studio.py frames`) : 13 sauts, tous voulus (le drop, les trois plans de coupe et leurs
  retours, les BOOM, les deux « Fahhh », le SETTY de la fin). Aucun retour en arrière de la caméra.
- **Le décor sous les cadrages du moteur** (plan large, gros plans, plans avec carte, les trois inserts, côté, dessus,
  bas) :
  - le coach est assis sur la banquette sans la traverser ;
  - rien devant une bouche ;
  - aucun `ctx.filter`.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le bonnet du coach entrait dans le plan de l'horloge** : le plan vient de la droite, assez près pour le laisser
   dehors, et il est calé sous le titre (le titre cachait le 12).
2. **Setty masquait le sac « TO GO »** dans son plan de coupe : le sac est passé entre eux deux, et le plan est serré et
   pris de la gauche.
3. **Le mug cachait le sac** au premier plan : il est reculé.
4. **Le ticket du sac était coupé** (« 1 CHEESEBURGE ») : il est élargi.
5. **Le sol en damier brillait en blanc** sur la droite : il est plus mat.
6. **Les coulures de sirop** ressemblaient à des haricots, puis à des bâtonnets : retirées (le nappage et la flaque
   suffisent).
7. **« ✓ booked · her time zone » ne restait que 0,6 s** : la conversation démarre plus tôt, la ligne reste 1 s.
8. **La coupure de musique** : le script la mettait sur « Maybe. » (5 s de silence). Elle est déplacée sur
   « Psychologists », pour que le silence tombe sur la réplique grave, et elle est plus courte.

## Ce qui peut encore monter le niveau

1. **2 images de trop** : la carte de l'étude sur la faim finit son fondu sur les deux premières images de l'insert du
   sac (28,0 s). Elle doit sortir 0,1 s plus tôt ; je ne l'ai pas refait pour ne pas relancer un rendu de 6 min pour
   2 images.
2. **Le coach ne lève pas son téléphone** en parlant de son DM : sa pose `phone` est dans le kit (MANYSETTER REELS).
3. **Une version de 30 à 35 s** pour la rétention, sans nouvelle voix (`studio.py cut`), en retirant les répliques 7 à 9
   (« Bro, I'm eating » et l'étude de la faim). La blague finale perdrait son rappel, donc il faudrait changer la chute.
4. **Le titre sur 3 lignes** : en 2 lignes, il laisserait plus de place aux visages, si tu acceptes de ne pas reprendre
   la slide 1 mot pour mot.
