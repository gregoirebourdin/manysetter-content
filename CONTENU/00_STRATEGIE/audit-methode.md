# Audit : la méthode source appliquée à ManySetter

> Fait le 10/10/2026, après le retour du fondateur (« je veux que tu le suives »). Chaque partie de `methode-source.md`, son état réel, et ce qui est fait ensuite.
> ✅ fait · ⚠️ partiel ou à refaire · ❌ pas fait · 🔒 attend une décision ou une action du fondateur.

## 2. Les outils à connecter

| Outil | État | Ce qu'il faut |
| --- | --- | --- |
| Claude, appli de bureau | ✅ | |
| **Zernio** | ❌ **pas connecté dans cette session de bureau** : il n'apparaît pas dans les connecteurs (il était branché dans la session cloud du matin). Sans lui : pas de lien d'upload des médias, pas de programmation, pas de statistiques, pas de musique des reels | 🔒 Paramètres → Connecteurs → Ajouter un connecteur personnalisé, nom `Zernio`, URL `https://mcp.zernio.com/mcp`, puis se connecter. Choisir le compte Instagram de publication et y relier la Page Facebook (option de connexion « Facebook » pour la musique) |
| Hébergement des médias | ❌ jamais testé (passe par Zernio) | après Zernio |
| Navigateur intégré | ✅ veille Instagram sans connexion ; les captures image par image passent par un Chromium local sans fenêtre (le panneau ne capture pas quand il est caché) | |
| BrandSearch | ❌ pas connecté | 🔒 selon abonnement (budget). En attendant : la bibliothèque publicitaire Meta, gratuite, dans le navigateur |
| Apify | ❌ pas connecté | normal : seulement sur accord, jamais en routine |
| ChatGPT, Google Flow | ❌ côté humain : **aucune image ni vidéo d'Ivy n'existe encore** | 🔒 générer la planche d'Ivy (étape 1 de `prompts-ivy.md`), puis le pack et les plans test |
| ffmpeg, faster-whisper, Pillow | ✅ installés en local (faster-whisper dans `.venv`) | |

## 3. Le dossier projet ✅

Arborescence et `CLAUDE.md` en place ; les verbatims sont importés dans `CLAUDE.md`. Noms adaptés au SaaS (`docs/VERBATIMS/`, `brief-de-marque.md` au lieu des règles boutique, banque de plans sans dossier produit puisqu'il n'y a qu'un produit).

## 4. Mise en place

| Étape | État |
| --- | --- |
| 1. Brief de marque | ✅ tiré du site · 🔒 validation du fondateur |
| 2. Verbatims | ✅ 287 citations vérifiées mot pour mot |
| 3. Avatars et planches | ⚠️ 3 avatars d'écriture + Ivy décidée ; **aucune planche de référence générée** 🔒 |
| 4. Veille | ✅ 12 comptes, médianes, 8 reels lus et transcrits |
| 5. Grille de départ, 9 à 12 carrousels, maquette du profil | ✅ 3 carrousels **refaits le 10/10** dans le style du compte de référence (`carrousel.py`), page de revue republiée · 🔒 validation post par post. Maquette du profil ✅ |
| 6. Bio et épingles | ✅ proposées · 🔒 choix A/B |
| 7. Programmation et routines | ❌ attend Zernio et le compte 🔒 ; consignes des routines prêtes |
| 8. Banque de plans vidéo | ❌ 13 prompts prêts, rien de généré 🔒 |

## 5. La trame qualité

- ✅ **« Un hook avec du contexte : la photo de la scène et une phrase »** : corrigé le 10/10. Chaque couverture a sa scène (boîte de réception « how much? », note « DM replies (do not delete) ») ou un titre de vécu, et chaque carrousel alterne slides de texte et visuels épurés (graphiques, écrans DM, captures du produit). Les photos d'Ivy viendront s'y ajouter une fois sa planche validée.
- ⚠️ **« Maximiser les posts photo en piochant d'abord dans l'existant »** : les captures du produit sont rassemblées (`03_PRODUIT_REF/site/`, 5 maquettes du site en haute définition, déjà utilisées dans les 3 carrousels). Reste à demander au fondateur les fichiers d'origine des visuels LinkedIn et de la vidéo « From 126 unanswered DMs to booked calls ».
- ✅ verbatims à la 1re personne, raison de commenter, produit en dernier, légendes pensées pour la recherche, 3 hashtags maximum.
- ✅ pas de tiret cadratin ; ⚠️ phrases de 2 ou 3 mots : à revérifier slide par slide dans la nouvelle version.

## 6. Les reels

- ❌ **La règle n°1 n'était pas respectée** : « une vraie personne filmée qui fait quelque chose ». Ma maquette était faite d'écrans et de cartons, sans Ivy : refusée, à juste titre. Plus aucune vidéo ne sera montrée sans Ivy à l'image.
- ✅ Les 3 scripts **réécrits le 10/10** : Ivy sur 10 à 11 plans sur 12, une coupe toutes les 2,5 s, 29 à 30 s, titre fixe dès 0 s, une blague par reel. Découpage plan par plan dans `reels-proposition-2026-10-10.md` · 🔒 validation, puis plans d'Ivy à générer.
- ✅ **Méthode B proposée le 10/10** : 3 copies plan par plan (R8 Brian Mark ×2,3, R1 Inrō ×5,0, R5 Neil Patel × HighLevel ×12,6), avec source et chiffres, rien de fabriqué · 🔒 choix du fondateur.
- ✅ `reel.py` : découpe des silences, horaire des mots, calage des plans et des sous-titres (la chaîne de la méthode), mais inutile tant que les plans d'Ivy n'existent pas.

## 8. La veille

- ✅ relevé, médianes, grille d'analyse, transcription.
- ⚠️ étape 5 : récupérer aussi la piste vidéo en meilleure qualité (seul l'audio a été téléchargé ; les images ont été lues dans la page).
- ✅ publicités actives regardées le 10/10 dans la bibliothèque publicitaire Meta, sans connexion (`veille/2026-10-10_pubs-actives.md`) : tout le marché vend « remplace ton setter humain » et la vitesse ; on garde notre angle. À refaire chaque lundi.
- ❌ sons tendance : attend Zernio.

## 9. Specs ⚠️

Carrousels en 1080 × 1350 ✅. Reels : moins de 30 s et une coupe toutes les 2 à 3 s, pas respecté dans la maquette ❌. Horaires (12:00 pm ET feed, 6:30 pm ET reels) notés dans le guide ✅.

## 10. Routines ❌

Pas créées : attendent le compte de publication et Zernio (consigne du fondateur). Consignes prêtes dans `routines.md`.

## 11. Le circuit d'un post

✅ slides en Python, légende, page de revue façon Instagram avec OK / À corriger, copie des retours et version floutée. ❌ hébergement et programmation (Zernio).

## 12. Le profil ✅

Nom avec mot-clé, bio, 3 épingles : proposés dans `profil.md`, maquette dans la page de revue.

## 13. Les prompts

✅ prompts d'Ivy un par un avec nom de fichier. ❌ aucun prompt d'image de feed pour les carrousels : à donner pour les images d'Ivy une fois sa planche validée.

## 14. Façon de travailler ✅

Retours notés en règles avant correction, mémoire de Claude tenue à jour, rien publié sans validation.

## Ce que je fais maintenant, dans l'ordre

1. ~~Refaire les 3 carrousels dans le style du compte de référence et republier la page de revue~~ : fait le 10/10.
2. ~~Rassembler les captures du produit dans `03_PRODUIT_REF/`~~ : fait le 10/10.
3. ~~Réécrire les 3 scripts de reels avec Ivy à l'image, et proposer 3 copies « méthode B »~~ : fait le 10/10 (`reels-proposition-2026-10-10.md`).
4. ~~Regarder les publicités actives des concurrents dans la bibliothèque publicitaire Meta~~ : fait le 10/10.

## Ce qui débloque tout le reste (fondateur)

1. Connecter Zernio dans l'appli de bureau et choisir le compte de publication.
2. Générer la planche d'Ivy (étape 1 de `prompts-ivy.md`).
3. Choisir la voix d'Ivy.
