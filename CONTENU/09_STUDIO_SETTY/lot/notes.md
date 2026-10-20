# Notes du lot en cours (reels 12 à 21)

Chaque session relit ce fichier à chaque phase et y ajoute une ligne **avant** de créer un décor ou une carte : on évite
les doublons et on réutilise ce qui existe. MANYSETTER REELS y publie les règles découvertes en route.

## Décors (assets/sets/<nom>.js)

| Reel | Décor | Fichier | Statut |
|---|---|---|---|
| reel15 | salle de serveurs la nuit (allées de baies, LED, faux plancher, le coach sur une caisse de matériel, Setty sur un serveur sorti de sa baie) | `assets/sets/serverroom.js` (banc : `lab/serverroom`) | phase 1 prête, script envoyé à MANYSETTER REELS |
| reel19 | banc dans un parc en ville, au coucher du soleil (allée de gravier, arbres d'automne, réverbère vert allumé, pigeons, tours de la ville au-dessus des arbres ; le coach et Setty sur le même banc en fonte et lattes de bois) | `assets/sets/park.js` | phase 1 prête (commit 1b21889), en attente des voix |
| reel20 | diner américain à 1 h du matin (banquette turquoise sous une vitrine sur la rue mouillée, néon EAT, horloge à 1:04, sac « TO GO ») | `assets/sets/diner.js` (+ `lab/diner`, planche `deliverables/duo/diner_v1.jpg`) | phase 1 prête, script à valider |
| reel21 | ring de boxe dans une salle de boxe le soir (cordes, poteaux, projecteurs au-dessus du ring ; le coach assis sur le tabouret de son coin, Setty perché sur le poteau d'angle bleu en face) | `assets/sets/boxing.js` | phase 1 prête (planche `deliverables/duo/boxing_v1.jpg`, banc `lab/boxing`) |
| reel12 | coworking la nuit (verrière sur le centre-ville, longue table commune en chêne, suspensions sur détecteur de mouvement (`power(v)`), cabine téléphonique vitrée, néon « GOOD VIBES ONLY », tableau blanc « THE PLAN », le coach seul en bout de table devant son portable, Setty sur un pouf en feutre) | `assets/sets/coworking.js` (+ `lab/coworking`) | phase 1 prête, à valider |
| reel13 | studio de tournage avec fond vert, la nuit (cyclo vert à croix de tracking, voilages noirs, grille et cyc lights, softbox, fresnel, panneau LED, C-stand ; moniteur de retour sur chariot avec la fausse promo « Lambo » ; le coach sur un apple box, Setty sur deux flight cases) | `assets/sets/greenscreen.js` | phase 1 prête (lab/greenscreen, planche greenscreen_v1) |
| reel17 | atelier dans un garage, samedi soir (porte sectionnelle à moitié levée sur la rue la nuit, établi en bois sous un panneau à outils perforé, trois écrans avec le scénario Make, réglette LED, néon cyan SHIP IT, le coach sur un tabouret à roulettes devant l'établi, Setty sur une servante d'atelier noire) ; banc d'essai `lab/garage` | `assets/sets/garage.js` | phase 1 faite, attend la validation des scripts |
| reel18 | salle de réunion en haut d'une tour, en fin d'après-midi (longue table laquée, fauteuils de direction, grand écran mural avec les stats de la pub « 300 conversations started », baie vitrée sur la ville, plante, tableau blanc ; le coach debout au bout de la table, à côté de l'écran, comme s'il présentait ; Setty assis sur la table, seul participant) | `assets/sets/boardroom.js` | phase 1 prête (script envoyé) |
| reel16 | open space de call center le soir (rangées de postes avec cloisons basses, casques sur les bureaux, écrans, grand tableau mural « avg. response time », baie vitrée sur la ville au crépuscule ; le coach assis à un poste avec son casque au cou, Setty perché sur la cloison du poste voisin) | `assets/sets/callcenter.js` | phase 1 prête (script + décor, à valider) ; plans de coupe `R.camOf("note")` (post-it) et `R.camOf("board")` (tableau LED) |
| reel14 | cabinet de coach dans un brownstone, lumière douce du matin (fauteuil club en cuir, divan, bibliothèque, lampadaire, diplôme encadré, plante, fenêtre à petits carreaux sur une rue arborée ; le coach affalé sur le divan des clients, son téléphone en main, Setty dans le fauteuil du coach comme un psy, bloc-notes posé sur l'accoudoir) | `assets/sets/coachoffice.js` | phase 1 prête (planche `deliverables/duo/coachoffice_v1.jpg`, banc `lab/coachoffice`) |

## Cartes (assets/engine/card_<nom>.js)

| Carte | Créée par | Ce qu'elle montre | Statut |
|---|---|---|---|

## Règles trouvées en route

- (aucune pour l'instant)
- 21/10 (MANYSETTER REELS) : `commit-mine --also` résolvait les liens symboliques ; un `lab/<décor>/assets` emportait tout
  `assets/` (commit 554a210 a pris les décors en cours de 9 sessions). Corrigé : un lien est commité comme lien, un dossier
  est refusé (nommez les fichiers un par un). Votre prochain `commit-mine` enregistre la vraie version de votre décor.
