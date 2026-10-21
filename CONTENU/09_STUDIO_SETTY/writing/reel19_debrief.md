# Débrief du reel 19 « The follow-up » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 15 de la banque n° 2, en paire avec le carrousel `261020_CAR_S1_AV1_follow-up`. Un lead a demandé
comment marche le programme du coach, il a répondu, puis plus rien. Le coach ne relance pas, parce qu'il ne veut pas
« passer pour un désespéré ». Setty casse cette croyance (« A quiet lead didn't say no. He got busy and forgot. »), lui
donne les trois relances du carrousel mot pour mot, puis ManySetter arrive parce que le coach demande qui va envoyer ça à
chaque lead. 15 répliques, 2 bips, 2 « Fahhh », 2 BOOM en plus de celui de l'accroche, une seconde de musique coupée sous
la question piège et la musique coupée sous la chute.

**Le décor (nouveau) : un banc dans un parc en ville, au coucher du soleil, en octobre** (`assets/sets/park.js`, banc
`lab/park`). Banc en fonte et lattes de bois au bord d'une allée de gravier, arbres d'automne dorés et rouille à gauche
(le soleil bas derrière eux), réverbère vert allumé entre les deux personnages, haie et sapins foncés à droite (jamais
d'orange derrière Setty), tours de la ville au-dessus des arbres dans un ciel rose et or, feuilles mortes, un second banc
vide au loin. Le coach est assis sur la moitié gauche, téléphone en main, un sac kraft avec une baguette à côté de lui ;
Setty est perché sur la traverse du dossier. Cinq pigeons picorent des miettes devant ses baskets : c'est la chute.

**Les voix** (générées par MANYSETTER REELS) : Setty en Charon, le coach en Fenrir ; la réplique 13 a été refaite seule
(« them » sortait « 'em », entendu « him »). Voix : 54,0 s ; reel : 56,0 s.

**Les cartes, en très gros caractères** (texte de 96 à 97 px dans la scène, environ 60 px sur le téléphone à 62 %) :
- Le DM du lead, à gauche du coach : « how does your program work? 👀 », sa réponse « so here's how it works 👇 », puis
  « Seen » et le statut qui passe à « Active 3h ago » sur « Then nothing » (carte `bigDM` du reel 12).
- Les trois relances, une carte chacune, à droite de Setty, tapées dans sa bulle : « 1 · a few hours later »,
  « 2 · a bit later », « 3 · the last one », avec le texte du carrousel mot pour mot.
- Ses relances, sur la réplique produit : « you write / them once », « I send them / inside 24 h », « he replies /
  I stop », chacune cochée sur son mot (carte `twoWays` du reel 14).

**La mise en scène.** Champ-contrechamp avec la poussée continue sur celui qui parle. Les cartes du coach sont à sa
gauche ; celles de Setty à sa droite, cadrage qui sort le coach de l'image (sinon la carte lui cachait le visage). BOOM
sur « didn't say no » et juste après « Manychat » ; « Fahhh » sur le coach après « like he's your ex » et après les
pigeons. Sur « pigeons », coupe sur les pigeons qui picorent ses miettes, retour sur Setty qui rit, puis le visage du
coach. La fin commune du kit : la barre de commentaire tape SETTY, retour au plan large, la notification, le bouton.

## Ce qui a été vérifié

- Les faits viennent de `sources/banque-2.md` (idée 15 : P8, P8b, P8c, R12) : jusqu'à 3 relances, dans les 24 h, écrites
  une fois par le coach, arrêtées dès que le lead répond ou réserve. Rien sur la vitesse, ni sur les notes vocales, ni
  sur les heures de réponse. Les relances sont celles du carrousel, mot pour mot. Aucun client, aucun résultat ; le DM
  de « marcus.fit » est une fiction d'exemple. La phrase exacte de rd47 reste au reel 20.
- Whisper : « So you followed up? » était juste dans la voix mais masqué par la musique (coupée une seconde sous la
  question) ; « Manychat » était déformé en « mini chat » par le BOOM posé sur le mot (déplacé juste après). Sur le mix
  final, tous les mots sont compris.
- Contrôle HyperFrames : 0 erreur, 0 problème de mise en page, 42/42 contrastes ; règles maison : OK. Titre sur 2 lignes.
- Rendu 30 i/s (la version publiée) : 1080×1920, 56,0 s, -14,3 LUFS, crête -1,9 dBTP, image 0 non noire (le plan
  large avec le titre-hook). Le premier rendu à 2 workers a calé à 61 % (mémoire du Mac saturée) ; le second, à 1 worker,
  est passé en 5 min.
- Images tirées du MP4 (`studio.py frames`) : 5 sauts, tous voulus (le flash du drop, l'entrée de la 2e relance, la
  coupe sur les pigeons et le retour sur Setty, la notification de fin). Aucun retour en arrière de la caméra. Seul détail :
  la carte de la 2e relance montre son titre seul pendant 0,1 s avant ses points de saisie.
- Le décor vu sous les cadrages du moteur (plan large, gros plans, poussées, plans avec carte, profils exacts du banc,
  dessus) : le coach assis sur l'assise sans la traverser, Setty posé sur la traverse du dossier, rien devant une
  bouche, aucun `ctx.filter`.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Les cartes des relances cachaient le visage du coach** (assis à la gauche de Setty) : elles passent à droite de
   Setty, avec un cadrage qui sort le coach du champ.
2. **La carte du DM s'ouvrait vide** pendant près d'une seconde : la question du lead apparaît avec la carte.
3. **La carte produit en liste était illisible** (texte trop petit) : remplacée par la carte `twoWays` en gros
   caractères, qui prend la hauteur de ses lignes (sa troisième ligne était coupée), avec des lignes plus courtes (la
   coche mordait sur le texte).
4. **Deux cartes se chevauchaient** au passage d'une relance à la suivante : chacune sort avant l'entrée de la suivante.
5. **Le son** : la musique masquait « So you followed up? », le BOOM masquait « Manychat » (voir plus haut).
6. **La voix** : « them » avalé deux fois dans la réplique produit ; refaite par MANYSETTER REELS.
7. **Le décor (phase 1)** : le gros plan de Setty pris de face à gauche montrait la main et le téléphone du coach devant
   lui (caméra passée à droite) ; le réverbère et un tronc tombaient derrière la tête du coach (déplacés) ; les pigeons
   avaient une boule verte à la place du cou (refaits : poitrine grise, reflet discret) ; le sac de pain ressemblait à un
   bidon (sac kraft roulé et baguette).

## Ce qui peut encore monter le niveau

1. **Les trois cartes de relance** reprennent la même forme : une version où les trois bulles s'empilent dans une seule
   conversation, avec l'heure entre chaque, montrerait mieux le rythme (attention : le reel 12 fait déjà ça en petit).
2. **Les points de Setty** (ses « ... » au-dessus de la tête) passent sous le titre dans ses gros plans : son cadrage
   pourrait descendre un peu, au prix d'un visage plus près des sous-titres.
3. **Le téléphone du coach** se voit peu dans ses gros plans : il pourrait le lever sur « Then nothing ». Ça demande de
   régler la pose `phone` du coach, donc le kit (MANYSETTER REELS).
4. **Une version de 30 à 35 s** pour la rétention, sans nouvelle voix (`studio.py cut`), en gardant l'accroche, une
   relance et la chute des pigeons.
