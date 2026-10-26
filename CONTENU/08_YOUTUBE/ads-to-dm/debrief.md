# « ADS TO DM » : débrief du montage dynamique (26/10/2026)

Source : `~/Movies/ADS TO DM.mov` (9 min 15, écran 2880 × 1800 à 60 i/s, bulle webcam en bas à droite, voix en français).
Sortie : `ads-to-dm.mp4` (hors Git), 1920 × 1080, 30 i/s, voix à -14 LUFS. Gabarit : `06_GABARITS/montage_ecran.py`, plan : `montage.json`.

## Ce qui a été fait

1. **Jump cuts** : 9 min 15 → 8 min 07. Tous les blancs de plus de 0,45 s sont raccourcis (0,12 s gardés de chaque côté des mots), les 5 premières secondes muettes sont retirées, chaque coupe est calée sur un vrai creux de la voix (règle du 11/10). 93 sauts au total.
2. **Faux départs et reprises retirés** (temps de la source) :
   - 1:11 « Alors bien évidemment, quand je vous l'ai dit, ça peut être WhatsApp, comme ça peut être Instagram, comme ça peut être Messenger » : redite de 0:29 (le seul retrait qui touche une phrase entière ; à remettre si tu la veux) ;
   - 2:02 « ils vont directement, » ;
   - 3:30 « Si il n'est pas donc dans ce cas là si » ;
   - 4:29 le « donc » doublé ;
   - 5:23 « dans les, » ;
   - 6:25 « donc ça veut dire que vous ».
3. **Cadrage** : la page plein cadre, sans la barre d'outils du lecteur PDF, ta bulle entière. À chaque jump cut, le plan alterne cadre normal et léger zoom vers ta bulle (108 %), pour que le saut se lise comme un choix de montage.
4. **28 zooms secs** sur l'élément de la page dont tu parles (la boîte Meta Ad quand tu dis « il vous faut une ad Meta », la boîte « A FIT » sur « ça book l'appel », les deux réglages Manychat, la règle des 24 h, manysetter.com…). Un zoom ne coupe jamais une ligne de texte par le haut ou le bas, et garde ta bulle entière ou l'évite.
5. **9 plans visage** : ta bulle en grand au centre, sur la page floutée, aux moments forts (l'intro, « un outil que j'ai créé », « pic d'émotion », « tout ça c'est fini », « l'humaniser », « tout se passe sur WhatsApp », « un truc débile en mode "Hey…" », « vous devez absolument tester », la conclusion).
6. **Son** : voix nettoyée et compressée, **10 BOOM** (ton son) sur « rendez-vous qualifiés », « exactement comme vous », « le job des setters », « l'appel est programmé », « c'est fini », « bookés », « WhatsApp », « débile », « gratuitement », « cinq minutes » ; ton **clic** à chacun des 4 changements de page.

## Contrôles

- Coupes : niveau de la voix mesuré à chaque point de coupe (`coupes.json`). Une coupe tombait dans un mot (« ligne » / « dans les, ») : recalée sur le creux à 5:23,74 avant le rendu. Plus aucune coupe dans la voix.
- Cadres : planche de tous les zooms (`apercu_zooms.jpg`) relue ; titres coupés, fond d'écran visible et bulle en double sur les plans visage corrigés avant le rendu.
- Rendu : 14 595 images, exactement le nombre prévu ; image et son de même durée (8:06,5) ; -14,1 LUFS.
- Synchro : le son de 8 plans répartis sur la vidéo tombe à moins de 13 ms de sa place dans la source ; l'image (bulle webcam comparée à la source) à 17 à 50 ms, soit 1 à 3 images à 60 i/s, en dessous de ce qui se voit sur les lèvres.
- Heures de sortie (secondes) : BOOM à 42,3 · 111,5 · 129,4 · 181,7 · 231,6 · 293,5 · 313,9 · 417,4 · 444,5 · 477,9 ; clics de page à 235,6 · 318,6 · 380,7 · 434,2.

## Ce qui reste à décider ou à améliorer

- Pas de musique de fond ni de sous-titres incrustés dans cette version (à ajouter si tu veux : musique « cloudy » très basse, sous-titres anglais phrase par phrase).
- La transcription vient de Whisper « small » en local : les heures des mots sont approchées, mais chaque coupe est recalée sur le son.
