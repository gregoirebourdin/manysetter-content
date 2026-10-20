# Débrief du reel 8 « The DM funnel stuck in 2015 » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 4 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S1_AV1_dm-funnel-2015`.
- Le coach, affalé dans son fauteuil sur un rooftop, défend son funnel « link in bio » et s'arrête au milieu de sa phrase (« I tell them, and... ») quand il s'entend le décrire.
- Setty le démonte avec les mots des coachs : « the inbox void », le lead qui réfléchit depuis deux semaines (« a missing person »), la relance de minuit « hey, you up? » comme un ex bourré.
- Puis la version 2026 arrive parce que le coach demande : Manychat garde le déclencheur, Setty répond à la vraie question avec sa voix, une question à la fois, l'agenda pour les bons, jusqu'à 3 relances dans les 24 h (« and sober »).
- La chute : « stop rewatching your own [bip]ing reel, the sunset's right there », sur le plan large où le soleil se couche derrière lui.

16 répliques, 168 mots, 59,5 s, 2 bips (l'accroche et la chute).

**Le décor (nouveau).** Un rooftop au coucher du soleil :
- terrasse en teck, garde-corps en verre ;
- skyline à la golden hour, avec le soleil posé dans une trouée entre les tours ;
- guirlandes allumées, jardinières d'herbes hautes et de plumeaux, un olivier, des lanternes.

Le coach est dans un fauteuil lounge en teck, téléphone en main. Setty est assis sur une table basse en béton, avec un spritz au bout côté coach. Le décor et ses meubles sont dans `assets/sets/rooftop.js` ; le test d'apparence est dans `lab/rooftop/` (6 angles : large, deux gros plans, côté du fauteuil, Setty sur la table, vue de dessus).

**Les voix.** 3 prises Fenrir (coach) et 3 prises Charon (Setty). Une prise de chaque est parfaite dans Whisper (0 erreur) : c'est elles que j'ai gardées. Assemblées, elles faisaient 58,2 s, soit un reel de 60,6 s. J'ai resserré l'écart entre deux répliques (0,2 → 0,15 s) en réassemblant les mêmes prises, sans rien régénérer : 57,5 s de voix, 59,5 s de reel.

**Les cartes.**
- **Son funnel 2015** en liste qui se coche toute seule (« Post a reel », « Link in bio », « how much? »), puis la dernière ligne arrive seule sur « and... » : « …and hope 🙏 ».
- **La conversation qui meurt** : « hey how much is it », « It's $1,500 for the 12 weeks! », « Seen », puis plus rien. C'est la même conversation que le carrousel, avec les valeurs d'exemple du carrousel.
- **La même conversation deux semaines plus tard** : l'en-tête passe en rouge « Active 2w ago » et un tampon **MISSING** tombe sur le BOOM.
- **« hey, you up? 👀 »** envoyé le « Thu 11:58 PM », trois jours plus tard.
- **Le tuyau** Instagram, WhatsApp, Messenger → Manychat → ManySetter → Calendly.
- **La vraie réponse du setter** : le prix, puis une question (« How many clients do you have now? »), la réponse du lead, et la pastille « Call booked · Thu 2:00 PM » sur « calendar ».
- **Les 3 relances** à 2 h, 9 h et 21 h après le dernier message, posées sur « three », « twenty-four », « hours ».

**Le son.**
- Son riser jusqu'au BOOM et à sa musique, sur « right? ».
- **La coupure de musique (le temps comique)** : la musique meurt comme une bande sur « and... ». Setty dit sa phrase grave dans le silence, la lumière baisse, et le BOOM de « void » ramène la musique.
- Un BOOM sur « void », « missing person » et « sober » ; un Fahhh après « Like a drunk ex » et après la chute, la caméra sur le coach.
- Son clic à chaque carte ; la musique s'arrête sous « Comment SETTY » et revient après.

## Ce qui a été vérifié

- Chaque fait vient du brief ou de la source du carrousel :
  - relances jusqu'à 3, entre 1 et 23 h, dans la fenêtre de 24 h ;
  - une question à la fois, l'agenda seulement pour les bons leads ;
  - Manychat garde le déclencheur, inbound seulement.
- Les montants des cartes sont les valeurs d'exemple du carrousel, jamais un client. « Manychat » est écrit ainsi à l'écran. Aucun concurrent n'est nommé, et rien ne touche à la question « es-tu un bot ».
- Contrôle HyperFrames : mise en page, mouvement et contraste, 0 erreur (35 textes sur 35 au contraste AA). Règles maison OK.
- Son : -14,1 LUFS, crête -2,3 dBTP (versions avec et sans musique).
- Whisper sur le mix final comprend chaque mot, avec deux nuances :
  - « link in bio », dit vite par le coach, est transcrit « Lincoln bio ». Ce sont les mêmes sons (comme « Seti » pour SETTY), et la réplique est juste dans la prise seule.
  - Le « you » ajouté en fin est l'hallucination connue sur la queue de musique.
- Le kit a été touché en ajout seulement, puis `regress` a été lancé (les résultats sont dans le rapport de rendu).

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Le titre-hook avait deux lignes courtes**, donc il montait à 120 px et descendait jusqu'à y 610 : il recouvrait l'en-tête des cartes, la barre de commentaire et la notification de fin. Je l'ai plafonné à 100 px ; il reste énorme et finit vers y 545.
2. **Les cartes passaient sous le titre** : elles sont descendues (y -70 au lieu de -110) et finissent toutes au-dessus des sous-titres (vérifié sur les moments les plus chargés).
3. **La carte de conversation du kit (`st.igChat`) a du texte de 29 px**, illisible à 55 %. J'ai ajouté au kit une carte faite pour les décors, `st.igDM` : bulles en 60 px, heure entre deux bulles, pastille sous une bulle, statut qui passe au rouge, tampon. Les conversations courtes sont affichées à 70 % (texte d'environ 42 px).
4. **Les cartes de relances et du setter débordaient** : je les ai raccourcies pour que tout tienne.
5. **Le soleil se cachait derrière le titre** dans le plan large de la chute : je l'ai descendu dans une trouée entre les tours. On le voit maintenant sur la miniature et sur « the sunset's right there ».
6. **« Manychat » était entendu « minichab »** sous la musique : un silence d'un instant sous le mot, puis la musique revient sur l'étincelle du tuyau.
7. **« ghost » était entendu « goes to »** : la musique baisse sous « And when they ghost you? ».
8. **La poussée de caméra vers Setty sur la chute** aurait ramené la caméra sur lui après la coupe sur le plan large. J'ai monté cette réplique à la main.
9. **Le décor, avant la planche** : un verre traversait Setty, la table était trop petite, un coussin orange faisait une bosse sur le côté du coach, et les tours étaient trop géantes.

## Ce qui peut encore monter le niveau

1. **Le tuyau Manychat** reste la carte la moins lisible (texte du kit en petit, comme au reel 3). On peut en faire une version « décor » en gros, comme `st.igDM`.
2. **Le lip-sync en vraies formes de bouche**, déjà proposé aux reels 2 et 3.
3. **Une version de 30 à 35 s**, pour la rétention : on enlève les répliques 3 à 7 avec `studio.py cut`, sans nouvelle voix.
4. **Le coach « skeptical »** lève les deux poings devant lui ; une pose plus nonchalante, bras sur l'accoudoir, irait mieux au fauteuil.

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST.
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- La source précise de la musique, à noter dans `post.json` quand tu la donnes.
- Rien n'est programmé sans ton go.
