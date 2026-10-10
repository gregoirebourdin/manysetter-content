# Les routines (prêtes, pas encore créées)

> Préparées le 10/10/2026. **Elles ne sont créées qu'une fois le compte de publication choisi par le fondateur** (consigne du fondateur). Elles se créent dans l'appli Claude, rubrique Routines, et ne tournent que si l'ordinateur est allumé et l'appli ouverte. Les lancer une première fois à la main (« Exécuter maintenant ») pour approuver d'avance leurs autorisations.
> Aucune routine ne publie ni ne programme quoi que ce soit : la programmation reste validée post par post.

## 1. Chaque jour à 8 h 00 (heure de Paris) : les statistiques

Consigne à coller :

```
Tu es l'employé du contenu de ManySetter. Dépôt : gregoirebourdin/manysetter-content (lis CLAUDE.md).
1. Avec Zernio, vérifie l'état de la connexion du compte Instagram de publication <@compte> : si elle expire ou a expiré, écris-le EN TÊTE de ta réponse.
2. Liste les posts programmés et publiés depuis hier : si un post a échoué, écris-le EN TÊTE, avec l'heure prévue et le message d'erreur.
3. Pour chaque post publié depuis moins de 30 jours, relève portée, vues, likes, commentaires, partages, enregistrements et abonnés gagnés, et ajoute une ligne datée par post à CONTENU/00_STRATEGIE/suivi-stats.csv (ne réécris pas les lignes existantes).
4. Si un post fait au moins 2 fois la médiane de nos posts du même format, note-le en une ligne dans carnet-etudes.md, marqué « à confirmer ».
5. Commit « Daily stats AAAA-MM-JJ » et push sur main.
Ne publie rien, ne programme rien, ne modifie aucun post. Aucun outil payant (Apify interdit).
```

## 2. Chaque lundi à 9 h 00 (heure de Paris) : analyse, veille, production

Consigne à coller :

```
Tu es l'employé du contenu de ManySetter. Dépôt : gregoirebourdin/manysetter-content. Relis dans l'ordre : retours-validation.md, docs/VERBATIMS/verbatims.md, brief-de-marque.md, carnet-etudes.md, guide-expert.md.
1. Analyse de la semaine (suivi-stats.csv) : compare nos posts par format (portée, partages et enregistrements par compte atteint, commentaires, abonnés gagnés). Écris CONTENU/00_STRATEGIE/rapports-hebdo/AAAA-MM-JJ.md : ce qu'on refait, ce qu'on arrête, et UNE seule variable à tester la semaine suivante. Mets à jour carnet-etudes.md.
2. Veille organique dans le navigateur intégré, sans connexion, avec CONTENU/00_STRATEGIE/veille/outils/ : 12 derniers posts de chaque compte suivi, médianes, reels à 2 × la médiane lus image par image et transcrits. Note dans veille/AAAA-MM-JJ_veille.md. Jamais d'outil payant.
3. Production : 7 carrousels de la semaine suivante avec carrousel.py, dans le style du compte de référence (par lots validés, règle du fondateur), légendes, fiches post.json ; 3 scripts de reels d'Ivy (Ivy à l'image presque tout le temps, hook à 0 s, une coupe toutes les 2 à 3 s), montés avec reel.py seulement si ses plans existent : sinon le script et la liste des plans, jamais une maquette sans Ivy ; les prompts des images manquantes, un par un, avec le nom de fichier.
4. Page de revue : revue.py, publiée en Artifact avec la capacité db ; donne le lien.
5. Commit et push. NE PROGRAMME RIEN : la programmation attend la validation du fondateur, post par post.
```

## Ce qu'il manque pour les créer

- [ ] Le compte Instagram de publication (décision du fondateur), connecté à Zernio.
- [ ] La première publication validée, pour vérifier l'hébergement des médias par le lien d'upload de Zernio.
