# Checklist de démarrage (ManySetter)

Légende : **[F]** = le fondateur (compte, accès, décision de marque), **[C]** = Claude.

## Fait le 10/10/2026

- [x] [C] Dossier contenu créé hors du site, avec son `CLAUDE.md`
- [x] [C] Méthode source enregistrée, guide expert adapté au SaaS
- [x] [C] Brief de marque tiré du site (offre, libellés, garde-fous)
- [x] [C] Avatars d'écriture définis (AV1, AV2, AV3)
- [x] [C] Charte visuelle et gabarit de carrousel (`06_GABARITS/carrousel.py`, style du compte de référence depuis le 10/10 ; `slides.py` reste pour les écrans DM)
- [x] [C] Base de verbatims (`docs/VERBATIMS/verbatims.md`) : 287 citations vérifiées mot pour mot (script ou navigateur), fusion de la recherche cloud et de la recherche depuis l'appli de bureau, importée dans `CLAUDE.md`
- [x] [C] Première liste de comptes à surveiller (`veille/comptes-suivis.md`)
- [x] [F] Dépôt GitHub privé `manysetter-content` créé, tout y est poussé
- [x] [F] Décision : un seul personnage IA de marque qui parle → [C] fiche d'Ivy et prompts (`02_AVATARS/`)

## À faire par le fondateur

- [ ] [F] Valider ou corriger le brief de marque et le guide expert
- [ ] [F] Créer le compte Instagram professionnel et la Page Facebook de ManySetter
- [x] [F] Zernio connecté à Claude (10/10/2026, session cloud). Il ne voit qu'un compte Instagram, @gregoire.system (« Gregoire Bourdin | THE SYSTEM™ »), et aucune Page Facebook
- [x] [F] Zernio connecté dans l'appli de bureau aussi (vérifié le 10/10 : Instagram @gregoire.system et YouTube « manysetter », en bonne santé)
- [ ] [F] Décider : publie-t-on le contenu ManySetter sur @gregoire.system, ou sur un compte ManySetter dédié à créer et connecter à Zernio ?
- [ ] [F] Décider : brancher ManySetter sur le compte Instagram de la marque (le CTA « Comment SETTER » devient une démo en direct)
- [ ] [F] Valider Ivy (nom, look, voix), puis générer sa planche avec l'étape 1 de `02_AVATARS/prompts-ivy.md`
- [ ] [F] Générer le pack de références et les 3 plans test (étapes 2 à 4), les déposer dans `02_AVATARS/ivy/`
- [ ] [F] Hébergement des médias : Zernio fournit un lien d'upload (`media_generate_upload_link`), à confirmer au premier post

## Ensuite, côté Claude

- [x] [C] Enrichir les verbatims avec la voix des coachs depuis l'appli de bureau, jusqu'à ce que les motifs se répètent (10/10/2026). Trous restants listés dans le fichier
- [x] [C] Veille des 12 derniers posts de chaque compte suivi, analyse des reels au-dessus de 2 × la médiane (10/10/2026 : 12 comptes sur 13, 8 reels lus image par image, `veille/2026-10-10_veille.md`)
- [x] [F] Lot 1 de 3 carrousels validé (10/10, version 3)
- [ ] [C] Grille de départ : 9 à 12 carrousels, maquette réaliste du profil, page de revue. 10/10/2026 : 12 idées proposées, **lot 1 de 3 carrousels refait le 10/10 dans le style du compte de référence** après le retour du fondateur (`carrousel.py`, captures du produit dans `03_PRODUIT_REF/site/`), maquette du profil et page de revue republiées (https://claude.ai/artifact/Cq253dMMfmwdycRbwF5FSM). Lot 1 validé ; lot 2 = 3 carrousels TOFU (Harvard, Hormozi, Zig Ziglar) à valider
- [x] [C] Nom de profil avec mot-clé, bio, plan des 3 épingles (10/10/2026, `00_STRATEGIE/profil.md`, à valider ; appliqué par le fondateur une fois le compte choisi)
- [ ] [C] Routines : stats chaque matin, analyse et production chaque lundi. Consignes prêtes (`00_STRATEGIE/routines.md`), création dès que le compte de publication est choisi
- [x] [C] Gabarit de reel `reel.py` (10/10/2026 : découpe des silences, faster-whisper, plans calés, sous-titres, 1080 × 1920). Les maquettes sans Ivy ont été refusées et supprimées : un reel ne se monte qu'avec ses plans à elle
- [ ] [C] Banque de plans HOOK / BODY / CTA : 3 scripts et 13 prompts prêts (`02_AVATARS/banque-plans-ivy.md`), génération après validation de la planche d'Ivy
- [ ] [F] Choisir la voix d'Ivy pour la voix off : Flow (gratuit, peut varier) ou voix de synthèse fixe (payant)
