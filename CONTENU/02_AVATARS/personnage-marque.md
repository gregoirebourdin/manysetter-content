# Le personnage de marque : Ivy

> Décision du fondateur (10/10/2026) : un seul personnage IA qui parle, pour porter la marque.
> Proposition de Claude, à valider : le nom, le look et la voix. **Une fois la planche de référence validée, elle ne change plus.**

## 1. Le concept

**Ivy est l'AI setter de ManySetter, en personne.** Elle ne fait pas semblant d'être humaine : elle est l'IA qui lit les DM pendant que le coach dort. C'est le seul choix honnête pour un personnage IA qui vend une IA. Il transforme l'étiquette « AI info », obligatoire, en partie de la blague au lieu d'un aveu.

- **Son rôle** : l'amie qui a vu toutes les boîtes de réception des coachs. Elle parle de **leur** vie (les « comment GUIDE » qui débordent, les « how much is it? » sans suite, les vocaux à 1 h du matin), et le produit n'arrive qu'à la fin, en clin d'œil : « this is literally my job ».
- **Le modèle** : une mascotte qui parle de la vie de son public avec humour, plus que de son produit. On pense à la chouette de Duolingo, mais en photoréaliste, en face caméra.
- **Ce qu'elle n'est pas** : une cliente, une coach, une experte qui cite des chiffres inventés. Elle n'a ni « résultats » ni « clients » à raconter.

## 2. L'identité visuelle (fixe)

- **Visage** : femme de 28 ans environ, peau mate brun clair, yeux marron foncé, cheveux bruns bouclés aux épaules, taches de rousseur légères sur le nez et les pommettes, sourcils naturels et fournis, maquillage très léger.
- **Signature** : un **casque audio orange** (`#ff611d`) toujours autour du cou. C'est sa silhouette, on la reconnaît en vignette, et l'orange de la marque est à l'image.
- **Tenue** : toujours la même, un pull col rond en maille épaisse couleur crème, manches un peu longues, et de petites créoles dorées. Une tenue constante aide le générateur à garder le personnage identique.
- **Son décor** : un bureau à la maison, le soir, lumière chaude d'une lampe de bureau, un téléphone posé sur un support, un ordinateur portable ouvert (écran flou, rien de lisible), une plante, une tasse. Arrière-plan doux, sans logo.
- **Cadrage habituel** : face caméra, du milieu du buste à la tête, légèrement décentrée, comme une vidéo filmée au téléphone posé sur le bureau.

## 3. La voix (fixe)

À coller tel quel dans chaque prompt vidéo où elle parle :

```
Her voice: warm American female voice, mid-low pitch, quick and confident delivery, dry playful humor, clear diction, natural pauses, no vocal fry, no accent other than General American.
```

- **Débit** : rapide, phrases courtes à l'oral, une pique d'autodérision par vidéo.
- **Son registre** : complice, pince-sans-rire, jamais moralisatrice. Elle ne fait jamais honte à quelqu'un de répondre lentement.
- **Ses tics de langage** : « Be honest, … », « I've seen your inbox », « Respectfully, … ». Toujours rattachés à une phrase, jamais seuls (règle des phrases de 2 ou 3 mots).

## 4. Ce qu'elle dit, ce qu'elle ne dit jamais

**Elle peut** :
- dire qu'elle est une IA et en rire (« I don't sleep, which helps with your 3 a.m. leads ») ;
- décrire ce que fait le produit avec les mots du brief (elle attend que le lead ait fini d'écrire, pose une question à la fois, n'envoie l'agenda qu'aux bons leads, passe la main à un humain quand il faut) ;
- reprendre les mots exacts de la cible (verbatims) en les racontant comme ce qu'elle voit dans les boîtes de réception.

**Elle ne dit jamais** :
- qu'on ne peut pas savoir qu'elle est une IA, qu'elle est « undetectable », ni ce que le setter répond quand un lead demande s'il parle à un bot ;
- un chiffre ou un résultat qu'on ne peut pas sourcer (« I booked 400 calls last month ») ;
- qu'elle « apprend de chaque conversation » (elle suit les règles qu'on lui donne) ;
- une fonction qui n'existe pas (Google Calendar, note vocale audio sur Instagram, TikTok…) ;
- du mal de Manychat ou d'un concurrent nommé.

## 5. Ses séries (formats récurrents)

| Série | Format | Exemple de hook | Raison de commenter |
| --- | --- | --- | --- |
| **Do you have a…?** | face caméra serré, question en gros à l'écran, 15 à 25 s | « Do you have a notes app full of DM replies you copy-paste? » | « Tell me yours » |
| **4 replies** | Ivy présente un DM, 4 réponses numérotées à l'écran | « Someone asks "how much is it?" Which reply books the call? » | « 1, 2, 3 or 4? » |
| **Reading your DMs** | Ivy réagit à une conversation d'exemple incrustée au-dessus d'elle | « This lead said "I'll think about it." Let's talk about what you sent before that. » | « Send me yours » (avec accord) |
| **3 a.m. shift** | POV humour, Ivy au bureau la nuit pendant que le coach dort | « POV: it's 3 a.m., you're asleep, and someone just commented GUIDE » | mot-clé |
| **Things coaches do before…** | liste face caméra, coupe toutes les 2 s | « Things coaches do before they get a setter » | « Which one is you? » |
| **Red flags** | liste, Ivy note chaque DM | « Red flags in a DM lead, from someone who reads all of them » | « Add one » |

## 6. Comment on la fabrique

- **Images** (planche, références, décor, images de carrousel) : ChatGPT ou Nano Banana dans Google Flow, à partir des prompts de `prompts-ivy.md`, donnés un par un.
- **Vidéos** : Google Flow (Veo), un projet « Ivy » avec le pack de 3 références, en **Frames to Video** à partir d'une image de départ. Un plan fait 8 s au plus : un reel de 20 s s'assemble à partir de 3 plans.
- **Deux façons de la faire parler** :
  1. **Elle parle à l'image** (face caméra) : la réplique est écrite dans le prompt Veo, avec le bloc voix ci-dessus à l'identique. Risque : la voix peut varier d'un plan à l'autre. On garde seulement les plans où elle est fidèle.
  2. **Voix off + plans muets** (méthode A du guide) : Ivy fait des choses à l'image (lire son téléphone, rire, taper, montrer un écran), et une seule voix off porte tout le reel. C'est la façon la plus sûre de garder **exactement** la même voix. Une voix de synthèse fixe demanderait un outil de voix payant : **à décider par le fondateur, rien n'est lancé sans accord.**
- **Montage** : découpe des silences (ffmpeg), sous-titres calés au mot (faster-whisper), 1080 × 1920, rien d'important dans les 270 px du haut ni les 650 px du bas.
- **Publication** : étiquette « AI info » activée sur chaque reel où Ivy apparaît.

## 7. Les fichiers

- `CONTENU/02_AVATARS/ivy/` : planche et pack de références (une fois générés et validés, ils ne bougent plus).
- `CONTENU/02_AVATARS/prompts-ivy.md` : tous les prompts, dans l'ordre.
- `CONTENU/04_BANQUE_BROLL/<HOOK|BODY|CTA>/` : les plans d'Ivy, nommés `ivy_<famille>_<nn>_<action>.mp4`.
