# Débrief du reel 21 « Human setter or AI setter » (21/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 19 de la banque n° 2, en paire avec le carrousel `261020_CAR_S2_AV2_human-vs-ai-setter`. Le coach
reçoit 30 DM par jour et veut embaucher un setter : il organise un combat, « humain contre IA, le gagnant récupère ma
boîte de réception ». Setty, dans le coin bleu, joue le soigneur honnête :
- round 1, le prix : la fourchette PayScale du setter humain, puis son propre prix ; et il prévient lui-même qu'à
  30 conversations par jour il faut des réponses en plus ;
- round 2, la voix : « in your voice, one question at a time » ;
- puis ce qu'une personne fait mieux, et le match nul : les deux.

Il y a 18 répliques, 3 bips (l'accroche, le ring loué, la chute), 2 « Fahhh », 3 BOOM en plus de celui de l'accroche et
une coupure de musique.

**Le décor (nouveau) : un ring de boxe le soir** (`assets/sets/boxing.js`, banc d'essai `lab/boxing`).
- **Le ring** : toile gris-bleu usée, cordes blanches, poteaux d'angle rembourrés (le coin rouge du coach, le coin bleu
  de Setty) et une rampe de projecteurs noirs au-dessus.
- **La salle** : murs en parpaings sombres, sacs de frappe sur leurs chaînes, affiche « FIGHT NIGHT · HUMAN vs AI »,
  cloche sur la table du chronométreur, minuteur de round au mur.
- **Les personnages** : le coach est sur son tabouret, ses gants rouges pendus à la corde. Setty est sur une pile de
  serviettes posée sur son tabouret, le coin bleu juste derrière sa tête : aucun orange derrière lui.
- **Le minuteur tourne** : « ROUND 1 » démarre sur « Round one », « ROUND 2 » sur « Round two », 3:00 qui descend.

**Les voix** (générées par MANYSETTER REELS) : Setty en Charon (prise 3), le coach en Fenrir (prise 1). Voix : 54,6 s ;
reel : 56,6 s.

**Les cartes, toutes en très gros caractères** : texte de 97 px ou plus dans la scène, soit environ 60 px sur le
téléphone à 62 %. Elles sont à gauche, celui qui parle à droite. Les fiches et l'affiche viennent de la nouvelle carte
`fightCard`.
- **L'affiche du combat** : un compteur Instagram qui monte jusqu'à « 30 DMs a day ». « HUMAN » en rouge et « AI » en
  bleu attendent en fantôme et claquent sur leurs mots, puis le badge VS, puis « 🏆 gets the inbox ».
- **La fiche du setter humain** (bandeau rouge) : « $13-21/hr », « + commission », « $2,250+/mo full time »,
  « PayScale, US ».
- **La fiche du setter IA** (bandeau bleu, logo ManySetter) : « $119/mo per live setter », « 1,500 replies included »,
  sur le BOOM.
- **Le calcul** (bandeau noir, « at 30 a day ») : « ≈ 900 chats a month », « × 4-5 replies », « > 1,500 included » en
  rouge, puis la pastille orange « +500 = $39 ».
- **Un DM dans la voix du coach** (carte `bigDM` du reel 12) : « is this for me? 👀 », puis « yo! for sure 🙌 » et une
  seule question : « what's your goal? ».
- **« a person wins »** (bandeau rouge) : « the sales call », « big deals », « new objections ».
- **« in Manychat »** (carte `twoWays` du reel 14) : « serious ones → booked » avec la tuile Calendly, et
  « hard cases → you + the call », chacun coché sur son mot.

**La mise en scène.**
- Champ-contrechamp, avec la poussée continue sur celui qui parle et les cartes à côté de lui.
- « Knockout. » : le coach lève les deux bras.
- **BOOM** sur le prix de Setty, sur « Nope. » (l'IA qui reconnaît ce que l'humain fait mieux) et sur « Both. ».
- **« Fahhh »** sur le coach après « You rented a boxing ring to hire a setter », et après « You paid for a fight and
  got a group hug » (il lève les yeux au ciel).
- **La musique** meurt comme une bande avant « Okay. How do I set you up? » et revient après « SETTY ».
- **La fin commune du kit** : la barre de commentaire tape SETTY, retour au plan large, la notification, le bouton.

## Ce qui a été vérifié

- **Les faits**, tirés de `sources/banque-2.md`, idée 19 :
  - H1, H2 : PayScale. « over two grand a month » reste sous la fourchette de 2 250 à 3 640 $.
  - H3 : 119 $ et 1 500 réponses.
  - Le piège du quota est dit à l'oral et montré : le prix n'est jamais rattaché seul aux 30 DM.
  - H4, H5 et P11 : ce qu'une personne fait mieux, puis les deux ensemble.
  - P6 : une question à la fois.
- **Aucun mot contre les setters**, rien sur la vitesse ni sur les heures (« any hour » retiré du script validé),
  aucun résultat client.
- **La carte Calendly** montre une réservation (jamais Calendly Free). La légende dit « Not affiliated with Manychat,
  Meta, Calendly or PayScale ».
- **Contrôle HyperFrames** : 0 erreur, 0 problème de mise en page. 3 alertes de contraste passagères :
  - les fantômes « HUMAN » et « AI » avant leur claquement (voulu) ;
  - la tuile emoji de la fiche humaine pendant son apparition.
- **Règles maison** (tirets, « Manychat », bips, sous-titres) : OK.
- **Whisper sur le mix** : tous les mots compris, sauf le « 'd » de « you'd ». Même son, de l'orthographe (déjà relevé
  par MANYSETTER REELS sur la voix).
- **Hauteur des cartes** : elles s'arrêtent toutes au-dessus des sous-titres (bas mesuré à 1 153 px au plus, pour
  1 165 permis).
- **Rendu 30 i/s** (`renders/reel21_v1_30fps.mp4`, la version publiée : plus de final en 60 i/s) : 1080×1920, 56,6 s,
  -14,1 LUFS, crête -2,2 dBTP, image 0 non noire (le plan large avec le titre-hook).
- **Images tirées du MP4** (`studio.py frames`) : 8 sauts, tous voulus :
  - le coup de zoom de l'accroche et le flash du drop ;
  - les deux coupes « Fahhh » ;
  - le passage sur « Round one » ;
  - le BOOM sur « Both. » ;
  - la notification de fin.

  Aucun retour en arrière de la caméra.
- **Le décor sous les cadrages du moteur** (plan large, gros plans, plans avec carte, deux côtés, dessus) : le coach est
  assis sur son tabouret sans le traverser, rien devant une bouche, aucun `ctx.filter` (le mur est peint sans filtre,
  `K.brickTex` en utilise un).

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **Trois cartes sortaient à la fin du reel, par-dessus le CTA.** Un commentaire `#` posé au milieu d'une ligne de
   `build.py` avait avalé trois repères (`clic2`, `clic4`, `clic5`). Avec un `at` absent, GSAP pose la carte à la fin du
   reel, sans erreur. Corrigé, et la règle est notée dans `lot/notes.md` pour les autres sessions.
2. **Les fiches étaient écrasées à 120 px de haut.** Ma classe `.tape` heurtait le ruban du reel 1 (`reel.css`). Toutes
   les classes de la carte sont maintenant préfixées (`.fc-tape`, `.fc-poster`) ; noté aussi dans `lot/notes.md`.
3. **« HUMAN » et « AI » côte à côte ne tenaient pas** (« HUMA » sous le VS) : l'affiche les empile en deux bandes, le VS
   à droite.
4. **L'affiche était vide pendant 1,7 s** avant « Human » : les deux bandes attendent maintenant en fantôme. Le claquement
   est une image clé qui revient en place si on recule dans le temps.
5. **L'affiche couvrait le visage du coach** pendant que la caméra arrivait sur lui : elle pope maintenant sur « DMs »,
   une fois la caméra posée.
6. **Le calcul descendait dans les sous-titres** (bas à 1 232 px) : une ligne de moins (« each ») et des chiffres un cran
   plus petits, bas à 1 153 px.
7. **« new objections » débordait de sa carte** avec son emoji : les trois lignes passent en texte seul, à 100 px.
8. **« who does what » restait vide 2 s** : la première ligne pope sur « Manychat », la seconde sur « He », et la carte
   prend la hauteur de son contenu.
9. **Le décor (phase 1)** :
   - les coussins d'angle ressemblaient à des sacs de frappe : ils sont devenus des coussins carrés plus courts ;
   - une serviette sur la corde faisait une tache blanche au centre : elle est retirée ;
   - le néon orange était coupé au bord : il est remplacé par le minuteur de round ;
   - la pile de serviettes de Setty se lisait comme des disques : elle a maintenant des liserés bleu marine.

## Ce qui peut encore monter le niveau

1. **Un plan de coupe sur le minuteur** quand le coach dit « Round two », la cloche en premier plan. Il faudrait un son
   de cloche, que tu n'as pas fourni (je n'ajoute que tes sons).
2. **Les gants** : le coach pourrait les porter. Ça demande des mains gantées dans `coach.js`, donc le kit
   (MANYSETTER REELS).
3. **Une version de 30 à 35 s** pour la rétention, sans nouvelle voix (`studio.py cut`) : on garderait le round 1, la
   réponse honnête et le CTA, sans le round 2 ni « So you win ».
