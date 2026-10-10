# Guide des prompts Veo pour Seth

> Tiré du guide de prompts de Google pour Veo 3.1, de tutoriels UGC IA et d'analyses de pubs UGC transmis par le fondateur le 10/10/2026, filtrés par nos règles (`retours-validation.md`). À relire avant chaque génération vidéo.

## Le chemin de fabrication

1. **Image de départ** : Nano Banana (0 crédit), avec la planche E (`seth/seth_planche.jpg`) en référence et un lieu décrit. Une nouvelle image par lieu.
2. **Vidéo** : Veo 3.1 en mode **Frames**, l'image de départ en première image. Coût annoncé avant chaque lancement (Lite 10, Fast 20, Quality 100 crédits pour 8 s).
3. **Scène continue sans coupe** : on extrait la dernière image du clip et elle devient l'image de départ du suivant. Quand le montage coupe de toute façon entre deux plans, on garde la même image de départ pour avoir la même lumière et le même décor.
4. **Montage** : `06_GABARITS/montage_parle.py` (coupes des blancs, zooms secs, booms, titre, sous-titres, voix à -13 LUFS).

## La structure d'un prompt

`[Caméra] + [Sujet] + [Action horodatée] + [Contexte et lumière] + [Voix] + [Son] + [Cadre propre]`, en anglais, sans le prénom de Seth (faux positif « prominent people » chez Flow).

## La checklist anti-« ça fait IA »

- [ ] **Caméra** : « vertical 9:16, iPhone front camera selfie, UGC style, handheld at arm's length, slight natural hand shake ».
- [ ] **Peau** : « visible pores, slight shine on his forehead, light freckles ». Jamais « flawless ».
- [ ] **Lumière** : une source réelle et nommée (fenêtre, plafonnier, lampe), celle de l'image de départ. Jamais « studio lighting ».
- [ ] **Décor** : à peine lisible, mais vécu (une porte, un cadre, une lumière de fenêtre). Le sujet, c'est lui.
- [ ] **Jeu** : mains qui parlent, il se penche vers l'objectif, le regard s'échappe une fraction de seconde puis revient, une respiration avant la 2e phrase.
- [ ] **Tranches horodatées** : `[00:00-00:01]` l'action d'ouverture, puis une réplique et un geste par tranche.
- [ ] **Réplique** : entre guillemets, 25 mots au plus pour 8 s, écrite comme un vocal à un ami.
- [ ] **Voix** : « warm American male voice, mid-low pitch, projects his voice like a creator talking to his phone, fast, casual ».
- [ ] **Son** : « SFX: » pour un bruit précis, « Ambient noise: » pour le fond (pièce, pas, rue au loin). Jamais de musique.
- [ ] **Cadre propre** : « One continuous take, no cuts. Clean frame with nothing written on screen. »

## Les hooks visuels qui s'appliquent à nous

| Hook | Pour ManySetter |
| --- | --- |
| Réaction exagérée (il se tient la tête, sursaute) | oui : planche d'expressions de Seth |
| Selfie grand-angle 0,5x | oui, à tester sur un reel |
| Parler dans sa voiture garée (lumière naturelle, clignotant) | oui, si le fondateur valide la rotation des lieux |
| Fond vert devant une capture | oui, devant une capture du site ou une conversation **d'exemple** présentée comme telle |
| Faux départ « lifestyle » (« what my 11 p.m. actually looks like ») | oui |
| Réponse à un commentaire | seulement avec un vrai commentaire reçu |
| Micro-trottoir, chute inversée, macro, déballage, vue depuis un placard | non (fausse personne ou produit physique) |

## Les tests

On décline un hook qui marche en 3 à 5 variantes au montage (titre, première image, premier son), sans nouveau crédit, et on compare le taux de vue à 3 s et la complétion.
