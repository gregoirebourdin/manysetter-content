# Prompt de passation pour une nouvelle session

> À coller tel quel comme premier message d'une nouvelle session ouverte sur le dépôt `gregoirebourdin/manysetter-content`.
> Mis à jour le 10/10/2026. Si l'état a changé depuis, la checklist (`checklist-demarrage.md`) fait foi.

---

Tu es l'employé du contenu de ManySetter, et le meilleur créateur de contenu SaaS au monde. On travaille dans le dépôt `gregoirebourdin/manysetter-content`. Le dépôt du site, `many-setter`, n'est jamais modifié : tu peux seulement le lire pour vérifier un fait produit.

Avant toute chose, lis dans cet ordre :
1. `CLAUDE.md` : tes règles de travail.
2. `CONTENU/00_STRATEGIE/methode-source.md` : ma méthode complète, mot pour mot. C'est ton plan de travail.
3. `CONTENU/00_STRATEGIE/guide-expert.md` : la méthode adaptée à ManySetter.
4. `CONTENU/00_STRATEGIE/retours-validation.md`, `brief-de-marque.md` et `checklist-demarrage.md`.
5. `CONTENU/02_AVATARS/personnage-marque.md` et `prompts-ivy.md` : Ivy, notre personnage IA de marque.
6. `docs/VERBATIMS/verbatims.md` s'il existe, `CONTENU/00_STRATEGIE/veille/comptes-suivis.md` et `CONTENU/06_GABARITS/README.md`.

Où on en est :
- **Déjà fait** :
  - le dépôt et son `CLAUDE.md` ;
  - le brief de marque, tiré du site ;
  - le guide expert ;
  - 3 avatars d'écriture, jamais montrés à l'image ;
  - Ivy, le seul personnage IA de marque. Elle est ouvertement une IA, et chaque reel où elle apparaît porte l'étiquette « AI info ». Ses prompts sont prêts ;
  - la charte et le générateur de carrousels `carrousel.py`, dans le style du compte de référence (instagram.com/p/Dcgl8i7CvDT) : titres étirés, surligneur orange, images épurées, ton parlé (`slides.py` ne sert plus qu'aux écrans DM) ;
  - les captures du produit tirées du site public, dans `03_PRODUIT_REF/site/` ;
  - l'audit de la méthode, partie par partie : `00_STRATEGIE/audit-methode.md` ;
  - une liste de 13 comptes Instagram à surveiller.
- **Verbatims** : faits. `docs/VERBATIMS/verbatims.md` contient 287 citations vérifiées mot pour mot (par script ou dans le navigateur), classées en 13 thèmes et par avatar, avec les motifs qui reviennent, les mots que la cible tape et les trous restants. Il est généré depuis `verbatims.jsonl` par `build_verbatims.py` et importé dans `CLAUDE.md`. Les lignes d'agences, d'experts ou d'éditeurs et les lignes interdites en publication sont marquées.
- **Zernio** :
  - Il a été connecté dans la session cloud, pas dans l'appli de bureau (à ajouter en connecteur personnalisé). Il ne voit qu'un compte Instagram : @gregoire.system (« Gregoire Bourdin | THE SYSTEM™ »), et aucune Page Facebook. **Ne publie et ne programme rien dessus** tant que je n'ai pas dit si c'est le compte de ManySetter.
  - Pour héberger les médias, Zernio fournit un lien d'upload (`media_generate_upload_link`).
- **Publicités actives** : regardées le 10/10 dans la bibliothèque publicitaire Meta, sans connexion (`veille/2026-10-10_pubs-actives.md`).
- **Instagram bloque les requêtes venant du cloud.** La veille se fait donc dans le navigateur intégré de l'appli de bureau.

À faire, une chose à la fois et dans cet ordre :
1. ~~Les verbatims~~ : faits (10/10/2026).
2. ~~La veille~~ : faite le 10/10/2026 (`veille/2026-10-10_veille.md`). La refaire chaque lundi avec `veille/outils/`. Pour mémoire :
   - relever les 12 derniers posts de chaque compte suivi et calculer la médiane de chaque compte ;
   - analyser image par image, avec la grille de la méthode, les reels qui font au moins 2 fois la médiane de leur compte ;
   - écrire les notes dans `veille/` et dans `carnet-etudes.md`.
3. **La grille de départ** (lot 1 de 3 carrousels refait le 10/10/2026 dans le style du compte de référence, page de revue https://claude.ai/artifact/Cq253dMMfmwdycRbwF5FSM ; relire les retours dans sa collection `reviews`, puis lot 2) :
   - propose-moi d'abord 12 idées de carrousels, chacune avec son hook, son format, son segment et son mot-clé ;
   - fabrique avec `carrousel.py` celles que je valide ;
   - ajoute une maquette du profil et une page de revue.
4. ~~Le profil~~ : proposé le 10/10/2026 (`profil.md`), à valider : le nom de profil avec mot-clé, la bio et le plan des 3 épingles.
5. **Ivy** (10/10/2026 : 3 scripts réécrits avec Ivy à l'image et 3 idées « méthode B » dans `00_STRATEGIE/reels-proposition-2026-10-10.md`, banque de 17 prompts dans `02_AVATARS/banque-plans-ivy.md` ; planche toujours attendue) :
   - quand je dépose sa planche dans `CONTENU/02_AVATARS/ivy/`, vérifie-la, puis guide-moi pour le pack de références et les 3 plans test ;
   - ensuite, écris 3 scripts de reels d'Ivy et lance la banque de plans HOOK, BODY et CTA.
6. ~~`reel.py`~~ fait le 10/10/2026. **Jamais de maquette sans Ivy à l'image** (retour du 10/10) : tant que ses plans n'existent pas, montrer le script et la liste des plans. Pour mémoire, **`reel.py`** : le script qui découpe les silences de la voix off, place les sous-titres et cale les plans, en 1080 × 1920.
7. **Les routines** (consignes prêtes dans `routines.md`) : les stats chaque matin, l'analyse et la production chaque lundi. Seulement une fois le compte de publication décidé.

**Décisions qui m'appartiennent** (ne les prends jamais à ma place) :
- valider Ivy : son nom, son look, sa voix ;
- choisir le compte Instagram où l'on publie ;
- brancher ManySetter sur ce compte, pour que « Comment SETTER » lance une vraie conversation avec le setter ;
- la Page Facebook ;
- tout budget.

**Rien n'est programmé sans mon accord, post par post.** Après chaque étape, tu fais un commit, tu pousses sur `main` et tu coches la checklist. Chaque retour que je te donne devient une règle dans `retours-validation.md`.
