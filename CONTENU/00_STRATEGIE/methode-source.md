# Méthode source (texte fourni par le fondateur, 10/10/2026)

> Méthode générique écrite pour une marque e-commerce Instagram + Facebook. Elle est gardée ici **telle quelle**, comme référence.
> L'adaptation à ManySetter (SaaS) est dans `guide-expert.md`. En cas de conflit, `guide-expert.md` et `retours-validation.md` priment.

Une méthode complète et réutilisable pour produire, publier et améliorer chaque semaine du contenu organique Instagram et Facebook pour **n'importe quelle marque e-commerce**, avec Claude comme employé du contenu. Elle a été éprouvée sur une vraie boutique. Remplace simplement « ta marque », « tes produits » et « ta cible » par les tiens.

## La méthode en 10 étapes

1. **Écouter le client** : rassembler ses mots exacts (Reddit, forums, avis) dans une base que Claude relit avant chaque texte.
2. **Définir la cible et les personnages** : les segments, et 2 à 4 avatars qui les incarnent, avec toujours le même visage et la même voix.
3. **Regarder ce qui marche** : chaque semaine, une veille gratuite sur les comptes publics de la niche, en lisant les vidéos image par image.
4. **Créer le contenu** : des carrousels, et des reels avec une personne filmée (banque de plans + voix off, ou copie plan par plan d'un reel qui cartonne). On parle de la vie de la cliente, le produit vient en dernier.
5. **Respecter la trame qualité** : un hook avec contexte, les mots des clientes, une raison de commenter, des légendes pensées pour la recherche, aucune phrase de 2 ou 3 mots, jamais de tiret cadratin.
6. **Valider** : chaque post est montré tel qu'il apparaîtra sur Instagram, et rien ne part sans accord.
7. **Programmer** : Claude publie gratuitement sur Instagram et Facebook avec Zernio, à l'heure de la cible.
8. **Mesurer** : chaque matin, une routine relève les statistiques et vérifie qu'aucun post n'a échoué.
9. **Analyser** : chaque lundi, Claude compare les posts, garde ce qui marche, arrête le reste, teste une seule nouveauté et prépare la semaine suivante.
10. **Apprendre** : chaque correction devient une règle écrite, appliquée à tous les contenus suivants.

---

## 1. Le principe

- **Claude travaille comme un employé du contenu** : il s'organise seul, prépare tout (recherche, textes, visuels, montage, programmation, analyse), et la fondatrice ou le fondateur **valide chaque post avant qu'il parte**.
- **Le contenu parle de la cliente, pas du produit.** Le sentiment visé : « je me sens enfin comprise ». Le produit arrive en dernier, comme la solution discrète.
- **On copie ce qui marche** (veille organique), on écrit **avec les mots exacts des clientes** (verbatims), et **chaque retour devient une règle** que Claude applique ensuite.
- **Boucle hebdomadaire** : veille → production → validation → publication → statistiques → apprentissages → veille.

## 2. Les outils à connecter

| Outil | Rôle | Coût et remarques |
| --- | --- | --- |
| **Claude** (appli de bureau, onglet Code) | L'employé : recherche, écriture, montage, programmation, routines automatiques | Abonnement Claude. L'appli doit être ouverte pour les routines. |
| **Zernio** (connecteur Claude) | Publication et programmation Instagram + Facebook, statistiques, commentaires, messages privés, musique des reels, reels d'essai | Gratuit pour les 2 premiers comptes connectés, posts illimités. Ne pas connecter de 3e compte (payant). |
| **Hébergement des médias** (Fichiers Shopify ou autre CDN) | Donne une adresse publique à chaque image ou vidéo, exigée par Instagram | Inclus avec Shopify |
| **Navigateur intégré** de l'appli Claude | Veille organique gratuite sur les pages publiques Instagram | Gratuit, sans clé, sans connexion à un compte |
| **BrandSearch** (connecteur) | Complément de veille : publicités Meta actives des concurrents | Selon abonnement |
| **Apify** (connecteur) | Grosses recherches ponctuelles : corpus Reddit, forums, scraping massif | Crédit mensuel limité : jamais dans les routines, toujours sur accord, coût annoncé avant |
| **ChatGPT** | Images fixes du feed (personnages, tenues à plat, scènes de vie) | Fait par l'humain à partir des prompts de Claude |
| **Google Flow** (Veo, Nano Banana) | Plans vidéo 9:16 des reels, personnages récurrents avec voix fixe | Inclus dans l'abonnement Google. Fait par l'humain à partir des prompts de Claude. |
| Outils locaux gratuits : ffmpeg, faster-whisper, Pillow (Python) | Composition des slides, montage, découpe des silences, transcription, analyse vidéo | Gratuit, sur le PC |

**Sécurité** : Claude ne crée jamais de compte, ne saisit jamais de mot de passe ni de jeton, et ne valide jamais une autorisation à la place de l'humain. Les clés éventuelles restent dans un fichier local, jamais dans le chat. Aucune génération payante (vidéo IA par API, par exemple) n'est lancée sans accord explicite pour ce lancement précis.

### Connecter Zernio (5 minutes)

1. Créer un compte sur zernio.com (gratuit, sans carte) et y connecter **uniquement** le compte Instagram professionnel et la Page Facebook.
2. Pour Instagram, choisir l'option de connexion **« Facebook »** : c'est elle qui donne accès au catalogue musical d'Instagram (sons tendance) pour les reels.
3. Dans l'appli Claude : **Paramètres → Connecteurs → Ajouter un connecteur personnalisé**, nom `Zernio`, URL `https://mcp.zernio.com/mcp`, sans clé. Se connecter et approuver dans le navigateur.
4. Ouvrir une nouvelle conversation et demander à Claude de vérifier les comptes vus et de faire un brouillon test.
5. Les connexions expirent environ tous les 2 mois : la routine quotidienne vérifie leur état et prévient.

## 3. L'organisation du dossier projet

- `CLAUDE.md` à la racine : les instructions que toute session Claude lit en premier. Il importe la base de verbatims.
- `docs/VERBATIMS-CLIENTES/` : la base des mots exacts des clientes. **Source n°1 de tout texte.**
- `docs/REGLES-BOUTIQUE.md` : les règles propres à la marque (produits, offre, mentions validées).
- `CONTENU/00_STRATEGIE/` : brief de marque, guide expert, veille, carnet d'études, **retours de validation**, méthodes, outils, revues, rapports hebdo, suivi des stats.
- `CONTENU/02_AVATARS/` : les planches des personnages.
- `CONTENU/03_PRODUITS_REF/` : photos produit de référence pour les générations.
- `CONTENU/04_BANQUE_BROLL/<PRODUIT>/<HOOK|BODY|CTA>/` : la banque de plans des reels.
- `CONTENU/05_BANQUE_IMAGES/` : les images générées pour le feed.
- `CONTENU/06_GABARITS/` : les scripts de fabrication (slides, carrousels, reels).
- `CONTENU/07_PRET_A_PUBLIER/<id>/` : un dossier par post (slides, légende, fiche JSON).
- **Nommage** : `AAMMJJ_FORMAT_PRODUIT_AVATAR_slug`, par exemple `261007_CAR_P01_AV1_black-dress-again`.

## 4. Mise en place, étape par étape

1. **Brief de marque** : la cible décrite comme une situation (ce qu'elle a essayé, ce qu'elle n'a jamais essayé, ce qu'elle refuse), la promesse, le ton, les garde-fous. **Préciser les segments** : souvent, celle qui n'a jamais utilisé la catégorie (on parle de ses contournements du quotidien) et celle qui a été déçue (on parle de ces échecs).
2. **Recherche de verbatims** (une fois, puis enrichie) : Reddit, forums, Quora, avis 1 à 3 étoiles, commentaires sous les posts concurrents. On relève les phrases mot pour mot, avec la source, classées par thème et par avatar. Voir la partie 7.
3. **Les avatars** : 2 à 4 personnages qui incarnent chacun un segment de la cible (âge, situation, morphologie, style, ton, voix). Une planche de référence par personnage, jamais modifiée ensuite.
4. **Veille et étude des grands comptes de la niche** : ce qui fait l'engagement, la grille, les formats. Voir la partie 8.
5. **Grille de départ** : 9 à 12 carrousels qui donnent au profil sa cohérence et sa crédibilité avant de chercher la portée. Maquette réaliste du profil avant validation.
6. **Bio et épingles** (partie 12).
7. **Programmation** de la grille, puis **routines automatiques** (partie 10).
8. **Banque de plans vidéo** pour les reels (partie 6).

## 5. La trame d'un contenu de qualité

Avant d'écrire quoi que ce soit, Claude relit la base de verbatims, le fichier des retours de validation (toutes les règles apprises), son carnet d'études et le guide expert.

1. **Partir de la cible, pas du produit** : une situation vécue, un contournement, une émotion. Le but est qu'elle pense « this is literally me ».
2. **Écrire avec les mots exacts des clientes**, à la 1re personne, jamais présentés comme un avis client (pas de prénom, pas d'étoiles).
3. **Copier ce qui marche** dans la veille organique : archétype, hook, rythme, structure, appel à l'action.
4. **Un hook avec du contexte** dans la 1re seconde ou la 1re slide : la photo de la scène et une phrase qui dit de quoi on parle. Le hook texte le plus efficace : **une question de vécu en gros** (« Do you have a… ? »).
5. **Une raison de commenter ou de partager** dans chaque post : vote chiffré (« 1, 2, 3 or 4? »), question, liste à compléter, « send this to a friend who… ».
6. **Le produit en dernier**, comme la base cachée de la tenue ou de la routine, jamais comme le sujet.
7. **Règles d'écriture** : pas de phrase de 2 ou 3 mots (on relie avec des virgules), **jamais de tiret cadratin**, langue naturelle du marché visé.
8. **Légende pensée pour la recherche Instagram** : la 1re ligne contient les mots que la cible tape dans la recherche, puis le texte les reprend naturellement. Les hashtags n'apportent presque plus rien : 3 maximum.
9. **Ton** : jamais culpabiliser la personne ou son corps. Le méchant, c'est ce qu'on lui a vendu ou ce qu'elle doit contourner. Gratitude et frustration en même temps, autodérision, humour de niche.
10. **Validation** humaine de chaque post avant programmation, et chaque retour noté comme règle.

### Les formats qui marchent (modèles)

- **POV** : une situation vécue racontée à la 2e personne, par exemple dans la mode « POV: the dress you bought for the wedding is still in your closet with the tag on ».
- **GRWM** (get ready with me) : la personne s'habille ou se prépare devant la caméra, une coupe toutes les 2 s, résultat final, « Yay or nay? ».
- **Face caméra** avec une question de vécu en gros titre et de l'autodérision.
- **« Things I did before »** : la liste des contournements que la cible reconnaît.
- **Avant/après du même vêtement ou de la même tenue**, jamais du corps.
- **Essayage chiffré** : 4 tenues, un chiffre à l'écran, vote en commentaire.
- **Listes in/out, notes de téléphone, conversation de copines, liste manuscrite.**
- **Lo-fi et humour de niche** : ils battent le contenu trop léché. Une grille magnifique sans raison d'interagir fait zéro engagement.

### Les règles de format apprises

- **Toujours un carrousel**, jamais une image seule. Seule exception : **l'image « vidéo »**, une image fixe de 5 à 7 s publiée **en reel** avec une musique tendance et le hook écrit dessus, pour que l'image passe dans l'onglet Reels.
- **Maximiser les posts photo en piochant d'abord dans l'existant** : images de la boutique, visuels publicitaires validés, shootings, banque d'images. On ne demande une nouvelle image que si rien ne convient.
- **Jamais de contenu de créatrices tierces ou de concurrents republié** : risque de droits d'auteur, et Instagram réduit la diffusion des contenus non originaux.
- Si la marque utilise des personnages IA : jamais dans une tenue suggestive, jamais présentés comme des clientes, pas de résultat chiffré « vécu ». L'étiquette « contenu IA » est un choix de la marque, à décider explicitement (Instagram peut limiter la portée des comptes qui montrent des personnes générées sans le signaler).

## 6. Les reels : deux méthodes

**La leçon la plus importante** : les reels qui explosent ont presque tous **une vraie personne filmée qui fait quelque chose** (s'habiller, essayer, parler). Observé dans une niche : les reels « démo produit » d'une marque leader font 150 à 300 likes, le GRWM d'une créatrice pour la même marque en fait 70 000. Les montages d'images fixes et les vidéos fournisseur ne prennent pas.

### Méthode A (pour démarrer) : banque de plans + voix off

1. **Une banque de plans vidéo muets**, en trois familles d'une vingtaine de plans chacune : **HOOK** (ce qui arrête le pouce dans la 1re seconde), **BODY** (le vécu, la démonstration, le mécanisme), **CTA** (la fin, le produit, l'invitation à commenter ou à cliquer).
2. **Un script de voix off par reel**, écrit à partir de la veille, des verbatims et des formats qui marchent. **C'est la voix off qui donne la durée de la vidéo.**
3. **On coupe les blancs** (respirations) de la voix off pour garder le dynamisme.
4. **On pose les plans sur la voix**, chaque phrase illustrée par un plan cohérent avec ce qui est dit.
5. Avec des scripts différents et 20 × 20 × 20 plans, **les combinaisons sont presque infinies**. Chaque reel garde son propre hook, son ordre et son texte, pour ne pas être vu comme un doublon.

**Chaîne de fabrication gratuite** : plans dans Google Flow, voix off toujours identique par personnage, découpe des silences avec ffmpeg (`silenceremove`), horaire de chaque mot avec faster-whisper, calage automatique des plans et des sous-titres, musique tendance très basse choisie au moment de programmer.

### Méthode B : copier plan par plan un reel qui a cartonné

1. Dans la veille, repérer un reel organique très au-dessus de la moyenne de son compte.
2. Le **lire image par image** : archétype, hook à 0 s, rythme des coupes, structure, texte à l'écran, place du produit, appel à l'action.
3. Le **refaire à l'identique** avec ses personnages et ses produits.
4. Toujours **proposer les idées avant de fabriquer**, en citant le reel source et ses chiffres.

**Trois modèles qui ont fait leurs preuves** :

- **GRWM sans parole** (2,27 M de vues observées) : caméra fixe, une pièce intrigante en main dans la 1re seconde, habillage couche par couche avec une coupe toutes les 2 s, look final, « Yay or nay? Vote below ».
- **Essayage chiffré** (645 000 vues observées) : plan fixe au miroir, le produit montré 3 s, puis 4 tenues de 3,5 s numérotées, « 1, 2, 3 or 4? ».
- **Face caméra « Do you have a… ? »** (meilleur taux de commentaires observé, 0,74 %) : cadrage très proche, question en gros, débit rapide, autodérision, appel à commenter.

## 7. Les verbatims clientes

- **Où chercher** : Reddit (subreddits de la cible), forums spécialisés, Quora, Mumsnet ou équivalent, avis 1 à 3 étoiles (les tiens et ceux des concurrents), commentaires sous les pubs et posts concurrents.
- **Combien** : jusqu'à ce que les motifs se répètent (30 à 100 discussions minimum ; un corpus de 2 000 posts et commentaires est idéal).
- **Comment ranger** : une base unique, par thème (la douleur mère, les contournements, les vêtements, les objections, les désirs, les émotions, l'humour), avec la source et l'avatar concerné.
- **Règles d'usage** : citer tel quel, jamais comme un avis client, aucun détail médical repris, aucun nom de concurrent, préciser le segment visé.
- La base est **importée dans `CLAUDE.md`** pour être lue automatiquement à chaque session.

## 8. La veille

### Veille organique (la priorité)

1. **Navigateur intégré** de l'appli Claude, pages publiques Instagram, sans se connecter. Bannière cookies : « Refuser les cookies optionnels ».
2. **Comptes suivis** : 8 à 10 marques de la niche, plus les créatrices qui reviennent dans leurs collaborations.
3. **Relever les 12 derniers posts** de chaque compte : likes, commentaires, date, légende.
4. **Comparer chaque post à la médiane de son compte** : un post à 2 fois la médiane est un signal.
5. **Récupérer la vidéo des reels retenus** (pistes vidéo et audio, assemblées avec ffmpeg sans réencodage).
6. **Analyser la vidéo, pas la légende** (la légende ne compte que pour 20 %) : découpage des plans (ffmpeg, détection de scène), transcription (faster-whisper), planche d'images, puis la grille d'analyse.
7. Une page à la fois, quelques secondes entre deux pages : Instagram bloque les rafales.

### La grille d'analyse d'un post

Archétype · hook à 0 s (visuel et texte) · rythme (coupes, durée moyenne d'un plan) · structure et récompense finale · texte à l'écran, sous-titres, voix ou musique · place du produit · appel à l'action et ce qui fait commenter · pourquoi ça marche, et **notre version**.

### Compléments

- **Publicités actives** (BrandSearch ou bibliothèque publicitaire Meta) : une pub qui tourne depuis des semaines est une pub qui convertit.
- **Sons tendance** : le catalogue musical Instagram via Zernio.
- **Apify** : seulement pour les grosses recherches ponctuelles, sur accord.

## 9. Les formats et leurs specs

- **Carrousel et image** : 1080 × 1350 (4:5). L'API Instagram refuse plus haut que 4:5. La grille du profil recadre les vignettes en 3:4 : garder l'essentiel au centre.
- **Reel** : 1080 × 1920 (9:16). Rien d'important dans les 270 px du haut ni dans les 650 px du bas. Moins de 30 s, une coupe toutes les 2 à 3 s.
- **Horaires** : midi dans le fuseau de la cible pour le feed, début de soirée pour les reels.
- **Rythme** : 1 carrousel par jour, puis 1 à 2 reels par jour en montant progressivement si la portée tient.
- **Les reels** sont le seul format qui va chercher des non-abonnés. **Les carrousels** font le meilleur engagement et les enregistrements. Les partages en message privé comptent plus que les likes.

## 10. Les routines automatiques

- **Chaque jour, le matin** : statistiques de chaque post publié (portée, vues, likes, commentaires, partages, enregistrements, abonnés gagnés) via Zernio, ajoutées à un CSV ; vérifier qu'aucun post n'a échoué et qu'aucun compte n'est à reconnecter.
- **Chaque lundi** : analyse de la semaine (une seule variable à tester), veille organique (jamais d'outil payant), production des 7 carrousels de la semaine suivante (la routine ne programme rien : elle prépare une page de revue), 3 scripts de reels ou 3 idées copiées, prompts d'images manquantes.

## 11. Le circuit d'un post

1. Claude prépare les slides (script Python, 1080 × 1350) et la légende.
2. Claude publie une **page de revue** qui rend chaque post comme sur Instagram : slides, légende complète, cases « OK / À corriger », bouton pour copier les retours.
3. L'humain valide ou corrige. Claude corrige et **note chaque leçon** dans le fichier des retours de validation.
4. Claude héberge les médias et programme sur Zernio, dans le fuseau de la cible.
5. La routine du matin vérifie la publication, puis relève les statistiques.

## 12. Le profil

- **Champ « Nom »** : le nom de la marque, une barre verticale, puis la catégorie que la cible cherche. Modifiable 2 fois tous les 14 jours.
- **Bio** (150 caractères) : qui on est, pour qui, ce qu'on vend concrètement, un appel vers le lien.
- **3 épingles** : une présentation (« this page is for you »), le meilleur post, puis le produit ou une preuve réelle.

## 13. Les prompts

Toujours **un par un, en copier-coller**, avec le nom de fichier à utiliser. Images du feed (ChatGPT, 4:5) : format, planche du personnage comme seule référence d'identité, scène de vie banale et précise, rendu smartphone, cadrage décentré, palette, zone calme pour le texte, marge de sécurité, interdits. Plans vidéo (Google Flow) : un projet par personnage, pack de 3 références, Frames to Video, même voix, blocs de fin de prompt (9:16, pas de texte, pas de musique, visage identique).

## 14. La façon de travailler avec Claude

- **Une chose à la fois.** Claude organise lui-même l'arborescence et le nommage, sans demander de validation.
- **Les décisions qui engagent la marque appartiennent à l'humain** : offre, promesses, ce qu'on dit d'un défaut, étiquette IA, budget.
- **Un chiffre ou un libellé validé ne se rediscute plus.**
- **Rien n'est publié sans validation**, post par post.
- **Chaque retour devient une règle écrite**, relue avant chaque nouvelle production.
- **Mémoire** : les règles durables sont dans les fichiers du projet, pour qu'une nouvelle conversation reparte avec tout.

## 15. Checklist de démarrage

Voir `checklist-demarrage.md` (version ManySetter, cochée au fil de l'eau).
