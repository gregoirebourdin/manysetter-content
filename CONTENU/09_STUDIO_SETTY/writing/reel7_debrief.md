# Débrief du reel 7 « The Comment GUIDE flow » (20/10/2026)

## Ce qui a été fait

**Le sujet.** L'idée 7 de la ligne éditoriale, en paire avec le carrousel `261019_CAR_S2_AV2_comment-guide-flow`. Le coach
se vante de ses 400 commentaires de la nuit, Setty pose la seule question qui compte (« how many sales? »), et le coach
découvre ce que son flow a fait des réponses : le lead demande « is this guide for beginners? » et le flow, qui voit le
mot « guide », lui renvoie… le guide. Manychat n'est jamais le méchant (Setty le dit : « Manychat did its job ») ; le
méchant, c'est le flow qui s'arrête après le guide. Puis « Keep your Manychat, add me », deux actions, sans code. 16
répliques, 54,9 s, 2 bips, 3 BOOM, 3 Fahhh.

**Le décor (nouveau) : sa cuisine, le matin.** Îlot en marbre blanc, meubles vert sapin à poignées laiton, zellige blanc,
étagères en chêne, machine à espresso, deux suspensions en opaline, une grande fenêtre sur un jardin au soleil (citronnier,
collines), un tapis de cuisine et la lumière de la fenêtre au sol. Le coach debout derrière l'îlot, téléphone en main,
blender et smoothie vert devant lui ; Setty assis sur l'îlot à côté de la corbeille de fruits. Tout le mobilier reste dans
`assets/sets/kitchen.js` (seul ce décor s'en sert).

**Deux gags du décor, en inserts.**
- « like the juicer you bought in January » : coupe sur le carton « JUICER · NEW YEAR, NEW YOU » encore emballé sur
  l'étagère, puis le Fahhh sur le coach qui lève les yeux au ciel.
- « Drink your lawn first, it's turning brown » : coupe en plongée sur son smoothie, qui **vire au marron vase pile sur
  « brown »** (et reste marron jusqu'à la fin).

**Les voix.** Coach en Fenrir, Setty en Charon, 3 prises chacun, vérifiées par Whisper : les prises retenues ont 0 erreur.
La réplique du CTA a été refaite seule (voir plus bas).

**Les cartes.**
- Ses commentaires Instagram : les « GUIDE » s'empilent, le compteur monte à 400, puis « 400 guides sent by Manychat ».
- Le fil de DM avec marcus_lifts : le guide (« Sent by your Manychat flow »), sa vraie question, puis le même guide qui
  revient avec la puce rouge « Keyword: guide » sur le BOOM de « again ».
- Son flow Manychat (« Comment contains GUIDE » → « Send the guide »), puis le même flow où les deux actions ManySetter
  apparaissent avec un contour orange : « Start conversation » sur le BOOM de « add me », « Continue conversation » dans la
  Default Reply sur « actions ».
- Sa boîte de réception : les questions sans réponse depuis 2 à 5 jours, le compteur de non-lus qui grimpe.
- La réponse dans sa voix (« Yes, it's made for beginners 🙌 What are you working on right now? »), « ManySetter · in your
  voice », puis « Your calendar: serious leads only ».

**Ajouté au kit (ajout seul, `regress` : reel1 et reel2 identiques).** `st.igComments` (commentaires Instagram en gros) et
`st.mcFlow` (un flow Manychat en gros, les nœuds ajoutés par ManySetter cerclés d'orange), documentés dans `PROPS.md`.
Le reel réutilise aussi `st.igDM` et `st.igDMs`, ajoutés au kit par une autre session.

## Ce qui a été vérifié

- Chaque fait vient du brief (Manychat garde le déclencheur et envoie le premier message ; « answer the keyword, not the
  question » ; deux actions, « No code and no new flows » ; « Only the right leads get your calendar ») ou du carrousel
  validé (400 commentaires, 0 vente : la situation du coach, pas un résultat). Sources dans `post.json`.
- « Manychat » écrit ainsi à l'écran, jamais son logo (la carte affiche le nom en texte) ; aucun concurrent ; rien sur ce
  que répond le setter si on lui demande s'il est un bot ; aucune promesse de résultat.
- Whisper sur le mix final : tous les mots compris. Les seuls écarts sont de l'orthographe (« key word », « many chat »)
  et « no » pour « Nope » sur le mix entier, alors que le mot passe en isolé (voix seule comme mix) : c'est le contexte de
  Whisper, pas un mot masqué.
- Rendu 30 i/s (`renders/reel7_v1_30fps.mp4`) : 1080×1920, 54,9 s, -14,2 LUFS, crête -2,1 dBTP, image 0 non noire (c'est
  la miniature : le plan large de la cuisine avec le titre-hook). Contrôle HyperFrames et règles maison : OK.
- Le kit après mes ajouts : `regress` donne reel1 et reel2 identiques image par image.

## Ce que j'ai trouvé et corrigé moi-même pendant la revue

1. **SETTY prononcé « setting ».** Dans la prise retenue, Charon disait le mot-clé du CTA comme « setting », même en
   isolé (le reel 3 donne « SETI », l'orthographe connue). Réplique refaite seule avec une consigne de prononciation
   (« SET-tee ») : 3 prises courtes, Whisper entend maintenant « SETI », comme au reel 3.
2. **Deux barres de censure sur le coach** (sa bouche et le sous-titre) en gros plan sur « not one [bip]ing sale » : le
   sous-titre du mot bipé est masqué, la barre sur sa bouche suffit.
3. **Les clics de cartes tombaient sur le premier mot des répliques** : déplacés dans le blanc juste avant chaque réplique.
4. **La carte du flow débordait** à droite (un nœud trop large) : corrigé dans le kit, et les textes raccourcis.
5. **Les cartes de DM avaient un grand vide blanc** sous les messages : hauteurs ajustées au contenu.
6. **L'insert du smoothie était encombré** (le bras du coach en très gros plan) : recadré en plongée sur le marbre.
7. **La pastille « Comment SETTY » chevauchait le dernier sous-titre** : elle arrive une fois le sous-titre parti.
8. **Deux flous de texture** (`ctx.filter`) dans le décor : retirés avant le rendu (nouvelle règle : texture noire au rendu).

## Ce qui peut encore monter le niveau

1. **La boîte de réception de la réplique 9** ne reste que 1,7 s à l'écran avant l'insert du carton : on la lit vite.
2. **Une version de 30 à 35 s** (retirer les répliques 7 à 9) pour la rétention, comme proposé au reel 3.
3. **La notification de fin** recouvre le haut du bonnet du coach dans le plan large (placement commun du kit) : un plan
   large un peu plus bas pour la fin réglerait ça pour tous les reels.

## Ce qui t'attend

- Ton feu vert sur ce rendu, puis le final en 60 i/s et la passation à MANYSETTER POST.
- L'étiquette « AI info » à ajouter dans l'appli après publication, comme pour les reels 2 et 3.
- Rien n'est programmé sans ton go.
