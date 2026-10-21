# Débrief du reel 15 « AI in 2 seconds » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 18 de la banque n° 2, en paire avec le carrousel `261020_CAR_S2_AV2_ai-2-seconds`. Le coach est
fier que son IA réponde à chaque DM en deux secondes, et il « upgrade ses serveurs » pour descendre à une. Setty lui
montre, bulle par bulle, ce que deux secondes font à un lead qui écrit encore : le bot répond à chaque morceau, envoie le
lien de réservation avant la fin de la phrase, puis redemande l'objectif que le lead vient de donner. ManySetter arrive
parce que le coach demande s'il doit « ralentir » son IA : non, il attend que le lead ait fini, une réponse, une
question. 16 répliques, 2 bips, 2 « Fahhh », 3 BOOM en plus de celui du hook. On ne vend jamais la vitesse.

**Le décor (nouveau) : une salle de serveurs, la nuit** (`assets/sets/serverroom.js`, banc `lab/serverroom`). Une allée
froide entre deux rangées de baies noires, des centaines de LED qui clignotent au temps du reel (vertes, bleues,
blanches ; aucune orange derrière Setty), un faux plancher perforé avec du ruban jaune et noir, des chemins de câbles
et des gaines de fibre jaunes au plafond, les portes vitrées du confinement au fond. Le coach est assis sur une caisse
de transport noire devant sa propre baie, dont l'écran affiche « AUTO-REPLY 2.0 s » ; un chariot de console plus loin
affiche « upgrading servers… 47% ». Setty est assis sur un serveur sorti de sa baie sur ses rails. Tout le décor est
dans son fichier : rien dans `kit.js`.

**Les voix** (générées par MANYSETTER REELS) : coach en Fenrir (prise 2), Setty en Charon (prise 3) ; la réplique 2 du
coach refaite le 21/10 au matin (« make it one » sortait « make it run »). Voix : 51,8 s ; reel : 53,8 s.

**Les cartes, à côté de celui qui parle, en gros caractères.**
- Son auto-reply (réplique 2) : « Every DM », « 2 seconds », puis « Upgrading to 1s 🚀 ».
- La démo (réplique 5), en deux cartes de deux bulles pour garder le texte gros : « hey » → « How can I help? 😊 », puis
  « so i saw your… » (« still typing ») → « Booking link! 📅 ».
- L'objectif redemandé (réplique 8) : « i wanna drop 20 lbs 🙏 » → « What's your goal? 😊 » → « they just told you ».
- ManySetter (réplique 11) : deux messages du lead, puis une seule réponse, « yes, fully online 🙂 how many days can you
  train? », et « 1 reply, 1 question ».
- Ce qu'il retient (réplique 13) : « 20 lbs, their goal », « Online, already answered », « Never asks twice ».

**La mise en scène.** Champ-contrechamp avec poussée continue sur celui qui parle ; BOOM sur « too. », « emojis. » et
« Manychat. » ; « Fahhh » sur le coach après « already proposed » et après la chute. La chute coupe sur l'écran
« AUTO-REPLY 2.0 s » de sa baie sur « servers », puis revient sur son visage sur « wrong faster ». La musique meurt
comme une cassette sur « Never. » : « How do I set you up? » et la chute tombent dans le silence, la musique revient
après « SETTY ».

## Ce qui a été vérifié

- Chaque fait vient de `sources/banque-2.md` (P4, P5, P6, P7) ou du brief (§ 2 et 3) ; sources notées dans `reel.json`.
  Les conversations des cartes sont les exemples du carrousel. mc22 est dit par le coach en « my AI », rien ne vise
  Manychat.
- Contrôle HyperFrames : 0 erreur ; règles maison : OK (aucun clic sur un début de mot après correction).
- Rendu 30 i/s (`renders/reel15_v4_30fps.mp4`, avec la réplique 2 refaite) : 1080×1920, 53,8 s, -14,2 LUFS, crête
  -2,0 dBTP, image 0 non noire
  (c'est la miniature : le plan large avec le titre-hook). Images tirées du MP4 (`studio.py frames`) : aucun retour en
  arrière de caméra ; les sauts signalés sont voulus (flash du hook, coups de zoom des BOOM, coupes du « Fahhh », coupe
  franche sur l'écran « 2.0 s », arrivée de la notification).
- Whisper sur le mix sans musique (v3) : tout est compris, sauf « that's » entendu « it's » et « bought » collé au bip
  (voir plus bas) ; SETTY entendu « SETI » (orthographe).
- Le décor vu sous les cadrages du moteur (large, coach, Setty, coach avec carte à gauche, Setty avec carte à droite,
  poussée, insert de l'écran) et depuis le côté et l'arrière (assises du coach et de Setty).

## Ce que j'ai trouvé et corrigé moi-même

1. **Les cartes de chat étaient trop petites** (texte d'environ 37 px à l'écran) : cartes plus étroites, affichées à
   70–90 %, et la démo coupée en deux cartes de deux bulles.
2. **La carte « I remember » passait un instant sur le visage du coach** (elle arrivait avant que la caméra quitte
   le coach) : elle arrive pendant le mouvement vers Setty et part juste avant le plan large, 2,5 s à l'écran.
3. **La main de Setty flottait à côté de lui** quand il levait le bras droit tout droit (BOOM « emojis » et « Manychat ») :
   geste remplacé par le bras en avant, déjà sans défaut ailleurs.
4. **Un tampon « 2 SECONDS » trop large** coupait la carte et cachait « Booking link! » : retiré.
5. **L'insert de l'écran « 2.0 s » laissait voir un bout de la tête du coach** : caméra décalée. Au rendu v1, le
   passage de Setty à l'écran durait 0,1 s et la caméra traversait la tête du coach sur une image (43,93 s) : les deux
   passages de la chute sont devenus des coupes franches (v2). Au rendu v3, la coupe vers le coach commençait pile sur
   une image (44,933 s) et cette image montrait la caméra à 30 % du chemin, son visage au bord de l'écran : les coupes
   finissent maintenant juste avant une frontière d'image, en 30 comme en 60 i/s (`cutAt`, v4).
6. **Deux clics tombaient sur le début d'un mot** (« Lead: », « I ») : avancés de 0,25 s, la carte garde son moment.
7. **Le décor** : sol trop clair qui faisait un reflet blanc dans le plan large (assombri, moins brillant) ; écran
   « 2.0 s » déplacé au bord de la baie pour ne pas être caché par sa tête.

## Ce qui reste à décider ou à améliorer

1. **« make it one » sonnait « make it run »** (réplique 2, le coach) dans la v2 : MANYSETTER REELS a refait la
   réplique, Whisper entend maintenant « make it one » (v3).
2. Whisper entend « it's » pour le second « that's » de la réplique 9 (« that's a form with emojis »), avec ou sans
   musique. Le sens est le même et le sous-titre est juste ; MANYSETTER REELS a choisi de laisser ainsi.
3. Sur le mix, Whisper colle « bought » au bip qui le suit (« buttf*** »). Sur la voix brute, il entend bien
   « bought », et le sous-titre l'écrit en toutes lettres : c'est le bip, qui laisse passer le « f », pas la voix.
4. Une version de 30 à 35 s (hook, démo, « form with emojis », ManySetter, CTA) se ferait avec `studio.py cut`, sans
   nouvelle voix, pour tester la rétention.
5. Les cartes de chat restent autour de 45 à 54 px à l'écran : la carte `bigDM` du reel 12 (≈ 60 px) pourra les
   remplacer quand elle sera dans le kit.
