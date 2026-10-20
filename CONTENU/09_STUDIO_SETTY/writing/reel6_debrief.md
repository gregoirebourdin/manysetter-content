# Débrief du reel 6 « The 5-day challenge » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 2 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S1_AV1_5-day-challenge`, refaite en
dialogue (l'ancien monologue du reel 1 ne compte plus). La nuit du jour 6, le coach a pitché son offre en live la veille ;
ses DM ont explosé, il en a traité vingt sur des centaines et il veut arrêter les challenges. Setty retourne la situation :
« The challenge worked… What's outdated is answering every DM by hand. » Le produit arrive parce que le coach demande
« So who answers them? » (et le traite de bulle de BD au passage). 16 répliques, 164 mots, 57 s, 2 bips.

**Le décor (nouveau) : le salon du coach la nuit.**
- un canapé bas en velours bleu canard, Setty assis sur l'accoudoir ;
- le ring light encore monté derrière le canapé, et allumé ;
- une pizza froide (trois parts) et des canettes sur la table basse ;
- son plan du challenge scotché au mur (DAY 1 à DAY 5 barrés, « DAY 6 ??? » entouré en rouge) ;
- la ville la nuit par une grande baie, la lumière bleue de la télé sur leurs visages, une lampe globe, un lampadaire.

Les meubles sont dans le fichier du décor (`assets/sets/livingroom.js`) : aucun fichier du kit n'a été modifié pour lui.

**Les voix.** Setty en Charon et le coach en Fenrir, 3 prises chacun, vérifiées par Whisper.
- Setty : la prise 3 est parfaite (0 erreur).
- Coach : dans la meilleure prise, la réplique 2 sortait en « pitch » au lieu de « Pitched » et « panger » au lieu de
  « Banger ». Je l'ai refaite seule (3 courtes prises, consigne de bien prononcer le « -ed » et le B) et gardé la prise
  sans erreur.

**Les cartes.**
- son challenge coché : « 5 days live », « Offer pitched live », puis « Banger 🔥 » ;
- sa boîte Instagram qui déborde : « link?? », « price? », « is it still open? », « can I pay in 2 parts? », le compteur
  de non-lus qui grimpe jusqu'à 214 ;
- la conversation de la lead qui a suivi les 5 jours (« is the offer still open? ») et le tampon « ON READ » ;
- la carte « Your setter » : branché sur Manychat sans nouveau flow, apprend l'offre depuis la page de vente, répond avec
  sa voix ;
- la confirmation Calendly avec le résumé du lead « added by ManySetter ».

Toutes les valeurs des cartes sont des exemples.

**La mise en scène.**
- champ-contrechamp avec poussée continue sur celui qui parle ;
- deux plans de coupe : la pizza froide sur « cold pizza », le ring light à côté de son visage sur « ring light » ;
- un BOOM sur « read. », « by hand. » et « Manychat » ;
- trois « Fahhh », dont un sur Setty quand le coach le traite de « speech bubble » ;
- la musique meurt sous « How many did you answer? » (silence sur « Like twenty. ») et revient sur le BOOM de « read. » ;
- à la toute fin, le ring light s'éteint enfin (un clic).

## Ce qui a été vérifié

- Whisper sur le mix final comprend chaque mot ; seul « twenty » est écrit « 20 », c'est de l'orthographe.
- -14,2 LUFS, crête -2,3 dBTP ; le contrôle HyperFrames passe (0 erreur ; les avertissements de contraste tombent pendant
  les fondus d'entrée et de sortie des cartes).
- Règles maison OK : pas de tiret long, « Manychat » écrit ainsi à l'écran, 2 bips, chaque mot sous-titré, la dernière
  réplique est le CTA mot pour mot.
- Les faits viennent de l'idée 2, du carrousel validé et du brief (sources dans `reel.json` et `post.json`). Rien sur la
  vitesse, aucune promesse de résultat, aucun concurrent.
- Les deux personnages ont été vérifiés sous 9 angles dans le banc d'essai `lab/livingroom` avant la première image.

## Ce que j'ai trouvé et corrigé moi-même

1. **Les jambes du coach traversaient le canapé.** Le canapé est devenu un canapé bas : il est assis sur le coussin, les
   genoux au bord et les baskets sur le tapis.
2. **Le couvercle de la pizza cachait le coach**, puis barrait les gros plans de Setty : il est maintenant ouvert à plat.
3. **Une tache violette sur la table basse** (le reflet de l'éclairage d'ambiance) : la table est devenue mate.
4. **Les cartes étaient trop petites** pour un téléphone : elles passent à 60 % au lieu de 55 %, toujours dans le cadre et
   à côté du visage, jamais dessus. La carte Calendly a aussi un texte plus gros.
5. **Deux cartes apparaissaient vides** une seconde avant leur contenu : elles arrivent maintenant avec leur première ligne.
6. **Le tampon « LEFT ON READ » débordait de l'image** : il est devenu « ON READ ».
7. **Les lignes de la carte « Your setter » étaient coupées** : textes raccourcis.
8. **Setty paraissait minuscule** à côté des cartes (l'accoudoir est bas, le cadrage par défaut montrait surtout le sol) :
   cadrage propre à ce décor, plus serré.

## Ce qui peut encore monter le niveau

1. **Setty frôle le bord gauche de l'image** à la fin de ses répliques avec une carte à droite (la poussée le grossit).
   C'est lisible, mais un cadrage un peu plus large serait plus propre.
2. **La boucle** : le ring light s'éteint à la fin et se rallume à l'image 0. C'est un petit saut à la relecture en
   boucle, mais la chute visuelle valait le coup.
3. **Une version de 30 à 35 s** en parallèle (retirer les répliques 9 à 12), pour la rétention.
4. **Le lip-sync en vraies formes de bouche**, déjà proposé aux reels 2 et 3.

## Point technique

Le reel utilise deux cartes du kit ajoutées par les autres sessions : `st.igDM` (commitée par le reel 8) et `st.igDMs`
(pas encore commitée quand j'ai rendu). Si `st.igDMs` change avant le 60 i/s, il faudra regarder ses deux passages
(12 à 16 s et 26 à 28 s).

## Final 60 i/s (validé le 20/10)

Rendu avec la piste caméra du moteur (`"cam_track": true`), seule différence avec le 30 i/s validé. Vérifié image par
image sur le MP4 : l'accroche ne recule plus (plan serré stable de 0,6 à 1,6 s), la coupe sur la pizza tient environ 1 s,
la coupe sur le ring light environ 1,3 s, et les trois réactions « Fahhh » tombent sur le bon visage. QA : 1080×1920,
60 i/s, 57,1 s, -14,2 LUFS, crête -2,0 dBTP.

## Ce qui t'attend

- La programmation par MANYSETTER POST, avec son carrousel, le même jour (reel à 6:30 pm ET).
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- Rien n'est programmé sans ton go.
