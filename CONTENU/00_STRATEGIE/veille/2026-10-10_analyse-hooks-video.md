# Analyse des hooks vidéo : publicités qui tournent et reel de Seth (10/10/2026)

> Demande du fondateur : « que la voix porte plus, plus naturel, et des améliorations tellement précises que c'est sûr que ça va hook ».
> Méthode : vidéos des publicités actives (bibliothèque publicitaire Meta, sans connexion, US), choisies parce qu'elles **tournent depuis des mois** (une publicité qui perd de l'argent est coupée). Fichiers téléchargés pour l'analyse interne seulement, hors Git, jamais republiés. Mesures : `ffmpeg ebur128` (niveau), `scdet` (coupes), faster-whisper (débit des 12 premières secondes).

## Les mesures

| Vidéo | Active depuis | Durée | Niveau voix | Débit | Coupes | Les 2 premières secondes |
| --- | --- | --- | --- | --- | --- | --- |
| Setter IA pour coachs (« Is your setter underperforming? ») | juin 2026 (plus d'une dizaine de variantes) | 28 s | -13,2 LUFS | 3,3 mots/s | 1 | parle dès 0,0 s ; question fixe en haut, blanc sur noir ; il montre un écran de chiffres |
| Créateur « DM me INFO » | juin 2026 | 69 s | -12,3 LUFS | **5,2 mots/s** | **41** (une toutes les 1,7 s) | image choc (un ouvrier qui chute) ; « If you're 18 to 30 and … scares you, listen » |
| Créateur avec Manychat | août 2026 | 49 s | -14,5 LUFS | 3,7 mots/s | 14 | question « is it possible? » + chiffre animé « 5000 » |
| Concurrent direct, « POV: you're firing your human setter » | 7/10/2026 | 20 s | -20,2 LUFS | musique | 6 | selfie serré, geste fort (il arrache ses lunettes) |
| **Notre hook v1** | | 6,7 s | **-23,7 LUFS** | **2,2 mots/s** | 4 | la phrase forte n'arrive qu'à 3,3 s |

## Ce qu'on corrige, précisément

1. **Volume** : voix à **-13 LUFS** (les pubs qui tournent : -12 à -14,5), passe-haut 75 Hz, +3,5 dB à 3,2 kHz (présence), compression 3,5:1. *Fait dans `montage_parle.py`, hook v2 à -14,3 LUFS.*
2. **La phrase choc à 0,0 s** : on ouvre directement sur « do not fire your human setter », le doigt pointé, zoom sec 126 % puis 138 %. *Fait (hook v2).* Toutes les pubs qui tournent parlent dès la 1re image.
3. **Titre = une question qui interpelle** (« Is your setter underperforming? » tourne depuis juin) : « about to fire your **setter**? ». *Fait.*
4. **Débit** : viser **3,5 à 4 mots/s** (nous : 2,2). Dans le prompt Veo : « talks fast, no pauses between sentences ». Le montage coupe déjà les blancs de plus de 0,25 s.
5. **Un geste fort à la 1re image** (lunettes arrachées, chute, doigt pointé) : le doigt pointé ouvre la v2 ; pour le plan 2, un geste de rupture au début (il s'arrête net et rapproche le téléphone).
6. **Une preuve visuelle d'une seconde** (la pub depuis juin montre un écran de chiffres) : on incruste 1 s la capture « Why this reply? » du site au moment de « your human takes the calls » (capture produit, pas un résultat client).
7. **Contre-pied assumé** : le concurrent dit « POV: you're firing your human setter » ; nous disons « do not fire your human setter ». Les deux tournent dans le même fil : le contraste fait réagir.
8. **Plus naturel** : dans le prompt Veo, « casual, slightly breathy, natural imperfections, one small self-correction », bruit de pièce et pas dans le couloir ; aucune musique sous la voix.

## Le plan 2 proposé (Veo 3.1 Fast, 20 crédits)

> « Every ad says replace your setter with AI. Let the AI take the 11 p.m. "how much", your human takes the calls. That's exactly why we built ManySetter. »

28 mots en 8 s (3,5 mots/s). Seth parle **au nom de la marque** (« we built »), jamais comme le fondateur, et ne dit pas qu'il est une IA (étiquette « AI info » activée à la publication). Jeu : il s'arrête net, rapproche le téléphone, roule des yeux sur « every ad », compte sur ses doigts sur « 11 p.m. », geste net de la main sur « takes the calls ».
