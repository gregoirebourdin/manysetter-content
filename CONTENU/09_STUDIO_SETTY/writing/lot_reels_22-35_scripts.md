# Lot des reels 22 à 35 : scripts v1 (à valider)

> Décision du 8/11 : plus de carrousels, 14 reels de Setty, un par jour, chacun dans un décor neuf. Idées validées au formulaire (23, 25, 26, 27, 28, 29, 30, 32, 34, 35, puis B, C, D, E en 22, 24, 31, 33).
> **Pattern v1** (débrief `writing/debrief_stats_reels_2-19.md`) : la phrase la plus forte de 0 à 2 s ; « Comment SETTY » dit et affiché avant 5 s (barre de commentaire sous le titre, `D.ctaEarly()`), puis répété à la fin ; titre-hook de 9 mots et 2 lignes au plus ; une info vraie qu'on a envie d'enregistrer ; un roast avec le Fahhh ; ManySetter en une phrase vraie. `studio.py voice` refuse un script qui casse ce pattern avant de payer.
> Dialogue coach (Fenrir) et Setty (Charon). Deux bips par reel (l'ouverture et le roast). Le CTA, mot pour mot comme validé le 20/10 : « Comment SETTY and I'll send you everything to build your AI setter for free. »
> Source des données : `lot/scripts_22-35.py` (les segments de voix en sortent). Durée estimée = mots ÷ 3,1 + 0,2 s par changement de personnage + 0,95 s par Fahhh + 2,4 s de fin.

## Vue d'ensemble (ordre de publication, 6:30 pm ET, Instagram + Short YouTube)

| Jour | Reel | Titre-hook affiché | Décor neuf | Seg. | Mots | Durée est. |
| --- | --- | --- | --- | --- | --- | --- |
| mar. 10/11 | reel25 | You paid Meta for every DM you ignore | Casino de Las Vegas  | S1 | 103 | ~37 s |
| mer. 11/11 | reel23 | Why your next-day DM replies lose the lead | Salon d'aéroport  | S1 | 113 | ~40 s |
| jeu. 12/11 | reel27 | My reply when a lead says "let me think" | Showroom de voitures de sport  | S2 | 116 | ~41 s |
| ven. 13/11 | reel26 | Lead form or DM ad: which one for coaches? | Salle des marchés  | S1 | 115 | ~41 s |
| sam. 14/11 | reel22 | The 3 questions I ask before sending my calendar | Cabinet médical  | S2 | 116 | ~41 s |
| dim. 15/11 | reel28 | What I reply when a lead just says "info" | Food truck le soir  | S1 | 112 | ~40 s |
| lun. 16/11 | reel34 | Instagram or WhatsApp: where should leads DM you? | Pont d'un yacht  | S1 | 118 | ~42 s |
| mar. 17/11 | reel24 | Booking link or 3 time slots in the DM? | Hall d'hôtel de luxe  | S2 | 112 | ~40 s |
| mer. 18/11 | reel29 | Your free guide is why nobody books a call | Librairie  | S2 | 108 | ~39 s |
| jeu. 19/11 | reel31 | Boost or Ads Manager: which one fills your DMs? | Cinéma drive-in la nuit  | S1 | 116 | ~41 s |
| ven. 20/11 | reel30 | Your 30-line DM is why nobody replies | Laverie automatique la nuit  | S1 | 105 | ~38 s |
| sam. 21/11 | reel33 | Voice note or text: which one wins a lead? | Station de radio FM rétro  | S1 | 120 | ~42 s |
| dim. 22/11 | reel35 | Never ask a lead two questions in one DM | Spa  | S1 | 117 | ~41 s |
| lun. 23/11 | reel32 | Going on vacation? Your DMs need this first | Villa à Bali  | S1 | 115 | ~41 s |

Les durées tombent entre 37 et 43 s : deux CTA complets prennent 28 mots. Une version de 30 s de chaque reel peut se monter ensuite sans nouvelle voix (`studio.py cut`), pour le test « 30 s contre version longue » du débrief.

## reel25 · paid-meta-ignored-dms · mar. 10/11

- **Titre-hook affiché** : You paid *Meta* for every / DM you ignore (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : You paid Meta for 200 DMs this week. How many did you answer?
- **Décor neuf** : Casino de Las Vegas : le coach à une table de craps, ses jetons = son budget pub ; Setty sur le tapis vert. Néons, moquette à motifs, machines à sous au fond.
- **L'info à enregistrer** : Le « Cost per messaging conversation started » du Gestionnaire de publicités = le prix de chaque DM ; les DM laissés sans réponse sont déjà payés (variante du reel18).
- **Sources** : Gestionnaire de publicités Meta (« Messaging conversations started », vérifié pour le reel18) ; définition du coût à revérifier sur l'aide Meta Business.
- **Segment** S1 · avatar AV1 · 103 mots · ~37 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | You paid Meta for every [bip] DM you left on read. | Tu as payé Meta pour chaque putain de DM laissé en vu. | Large, puis coup de zoom sur Setty ; titre | riser → 💥 + drop |  |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre, SETTY tapé | clics sur SETTY | série |
| 3 | Coach | Bro, my ads got me two hundred DMs this week. I answered like forty. | Mes pubs m'ont rapporté 200 DM cette semaine. J'en ai répondu genre 40. | Gros plan coach ; carte Instagram : 200 DM, compteur | clic | rd04, rd01 |
| 4 | Setty | Ads Manager shows your cost per messaging conversation started. You paid that for a hundred and sixty nobody answered. | Le Gestionnaire de pubs affiche ton coût par conversation commencée. Tu l'as payé pour 160 DM sans réponse. | Carte Ads Manager (valeurs de démo) : coût par conversation, 200 → 40 → 160 payés | 💥 sur « a hundred and sixty » | tp01 |
| 5 | Coach | So I'm basically tipping Meta. | Donc en gros, je file des pourboires à Meta. | Gros plan coach, il regarde ses jetons |  |  |
| 6 | Setty | You're feeding a slot machine and walking off before it pays, [bip]. | Tu nourris une machine à sous et tu pars avant qu'elle paie, crétin. | Setty le montre, le coach se fige | 😩 Fahhh |  |
| 7 | Setty | Plug me into Manychat. I answer the DMs you paid for, in your voice. | Branche-moi sur Manychat. Je réponds aux DM que tu as payés, avec ta voix. | Carte ManySetter : conversation en cours |  |  |
| 8 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune : barre de commentaire, notification, pilule | clics | série |

## reel23 · next-day-replies · mer. 11/11

- **Titre-hook affiché** : Why your *next-day* DM / replies lose the lead (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : You'll answer that DM tomorrow? A study of 2,241 companies says no.
- **Décor neuf** : Salon d'aéroport : le coach entre deux vols, valise cabine, téléphone en mode avion ; Setty sur la valise. Grandes baies vitrées sur le tarmac, tableau des départs.
- **L'info à enregistrer** : Étude parue dans la Harvard Business Review (mars 2011) : un faux prospect envoyé à 2 241 entreprises US ; 37 % répondent dans l'heure, 24 % après plus d'un jour, 23 % jamais. Le titre de l'article : « The Short Life of Online Sales Leads ».
- **Sources** : hbr.org/2011/03/the-short-life-of-online-sales-leads (Oldroyd, McElheran, Elkington). Les chiffres « 7 fois » et « 60 fois » ne sont pas utilisés : pas lus sur la page de HBR.
- **Segment** S1 · avatar AV1 · 113 mots · ~40 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | That lead you'll answer tomorrow morning is already [bip] gone. | Ce lead à qui tu répondras demain matin est déjà parti, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | rd19, rd06 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Relax, bro, I'm boarding. I'll answer everyone when I land. | Détends-toi, j'embarque. Je répondrai à tout le monde en atterrissant. | Gros plan coach, carte d'embarquement |  | rd84 |
| 4 | Setty | A study in Harvard Business Review sent a test lead to two thousand two hundred forty-one companies. | Une étude parue dans la Harvard Business Review a envoyé un faux prospect à 2 241 entreprises. | Carte « document » : la vraie page de l'étude, 2 241 | clic |  |
| 5 | Setty | Almost half took more than a day to answer, or never answered at all. | Presque la moitié a mis plus d'un jour à répondre, ou n'a jamais répondu. | Barres : 37 % dans l'heure, 24 % plus d'un jour, 23 % jamais | 💥 sur « never » |  |
| 6 | Setty | The paper is literally called The Short Life of Online Sales Leads. | L'article s'appelle littéralement « La courte vie des leads en ligne ». | Le titre de l'article en grand |  |  |
| 7 | Setty | Your lead is talking to whoever answers first, [bip]. | Ton lead parle à celui qui répond en premier, crétin. | Le coach coincé à la porte d'embarquement | 😩 Fahhh | rd06 |
| 8 | Setty | Plug me into Manychat. I reply within minutes, not seconds, while you fly. | Branche-moi sur Manychat. Je réponds en quelques minutes, pas en secondes, pendant que tu voles. | Carte ManySetter : délai de réponse 30 s à 5 min |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel27 · let-me-think · jeu. 12/11

- **Titre-hook affiché** : My reply when a lead / says "*let me think*" (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : He said "let me think about it" and you said "take your time"? Here's what to reply.
- **Décor neuf** : Showroom de voitures de sport : le coach appuyé contre une voiture rouge sans marque, sol miroir, spots ; Setty sur le capot.
- **L'info à enregistrer** : 3 réponses à copier mot pour mot quand un lead dit « let me think about it ».
- **Sources** : Script (aucun fait chiffré). Le setter gère l'objection « I'll think about it » (CLAUDE.md du studio, § 1).
- **Segment** S2 · avatar AV2 · 116 mots · ~41 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | "Let me think about it" is a polite [bip] no, unless you reply this. | « Je vais réfléchir », c'est un putain de non poli, sauf si tu réponds comme ça. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | rd14 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | He said that after twenty minutes. I said cool, take your time, and never heard back. | Il a dit ça après 20 minutes. J'ai dit cool, prends ton temps, et plus de nouvelles. | Gros plan coach ; bulle « let me think about it » |  | rd93, rd97 |
| 4 | Setty | You said take your time, and he took all of it, [bip]. | Tu as dit prends ton temps, et il l'a pris en entier, crétin. | Setty le montre | 😩 Fahhh |  |
| 5 | Setty | One: what's on your mind, the price or the timing? | Un : qu'est-ce qui te fait hésiter, le prix ou le moment ? | Carte « 1 » : la réponse en bulle orange | clic |  |
| 6 | Setty | Two: if money weren't a thing, would you start Monday? | Deux : si l'argent n'était pas un sujet, tu commencerais lundi ? | Carte « 2 » | clic | rd44 |
| 7 | Setty | Three: no rush, should I check back Thursday, or is it a no for now? | Trois : rien ne presse, je reviens vers toi jeudi, ou c'est non pour l'instant ? | Carte « 3 » | clic, 💥 sur « a no for now » | rd86 |
| 8 | Setty | Plug me into Manychat. I handle that objection in your voice. | Branche-moi sur Manychat. Je gère cette objection avec ta voix. | Carte ManySetter |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel26 · lead-form-vs-dm-ad · ven. 13/11

- **Titre-hook affiché** : *Lead form* or DM ad: / which one for coaches? (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : 300 leads from your form and nobody picks up? Here's why.
- **Décor neuf** : Salle des marchés : le coach en trader devant six écrans de courbes, téléphone fixe ; Setty sur le bureau. Lumière froide, bandeaux de cours qui défilent.
- **L'info à enregistrer** : Le formulaire instantané de Meta est pré-rempli avec le profil, et son type par défaut s'appelle « More volume » (« Higher intent » ajoute une étape de vérification) ; la pub DM ouvre une vraie conversation, à condition que quelqu'un réponde.
- **Sources** : Aide Meta Business (formulaires instantanés, types « More volume » et « Higher intent ») à revérifier ; guide Jon Loomer (jonloomer.com/instant-forms).
- **Segment** S1 · avatar AV1 · 115 mots · ~41 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | Your lead form fills itself, and that's the [bip] problem. | Ton formulaire se remplit tout seul, et c'est ça le putain de problème. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | cl028 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Three hundred form leads, bro. Nobody picks up when I call. | 300 leads par formulaire. Personne ne décroche quand j'appelle. | Gros plan coach ; écran : 300 leads | clic | rd89, cl028 |
| 4 | Setty | Meta fills the form from their profile, so it takes a couple of taps. | Meta remplit le formulaire avec leur profil : ça prend deux clics. | Carte formulaire : champs déjà remplis | clic |  |
| 5 | Setty | And the default form type is literally called More Volume. | Et le type de formulaire par défaut s'appelle littéralement « Plus de volume ». | Zoom sur « More volume » coché | 💥 sur « More Volume » |  |
| 6 | Coach | So I switch to DM ads? | Donc je passe aux pubs DM ? | Gros plan coach |  |  |
| 7 | Setty | A DM ad starts a real conversation, if somebody answers it. | Une pub DM lance une vraie conversation, si quelqu'un y répond. | Carte Instagram : conversation ouverte |  |  |
| 8 | Setty | And last time, somebody was you, at one a.m., in your [bip] boxers. | Et la dernière fois, ce quelqu'un, c'était toi, à 1 h du matin, en caleçon. | Le coach baisse les yeux | 😩 Fahhh | rd61 |
| 9 | Setty | Plug me into Manychat. I answer them and book the right ones. | Branche-moi sur Manychat. Je leur réponds et je prends rendez-vous avec les bons. | Carte ManySetter : appel réservé |  |  |
| 10 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel22 · 3-questions-calendar · sam. 14/11

- **Titre-hook affiché** : The 3 questions I ask / before sending my *calendar* (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : Six calls this week and not one real client? Ask these 3 questions first.
- **Décor neuf** : Cabinet médical : le coach assis sur la table d'examen, papier qui crisse ; Setty en blouse, stéthoscope autour du cou, sur le bureau. Affiche « triage », lumière blanche, plante en plastique.
- **L'info à enregistrer** : Les 3 questions à poser avant d'envoyer l'agenda : ce qu'il veut régler et pourquoi maintenant, ce qu'il a déjà essayé, s'il est prêt à investir ce mois-ci. Les autres reçoivent une réponse utile, pas un appel.
- **Sources** : Script. « Only the right leads get your calendar » et une réponse utile pour les autres (brief, § 2 et § 5).
- **Segment** S2 · avatar AV2 · 116 mots · ~41 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | You send your calendar to anyone who says hi, and it's [bip] killing you. | Tu envoies ton agenda à quiconque dit salut, et ça te tue, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | rd75 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Six calls this week, bro. Not one real client. | Six appels cette semaine. Pas un seul vrai client. | Gros plan coach ; agenda plein | clic | rd43 |
| 4 | Setty | Three questions before the link. One: what are you trying to fix, and why now? | Trois questions avant le lien. Un : qu'est-ce que tu veux régler, et pourquoi maintenant ? | Carte « 1 » en bulle orange | clic | rd94, rd45 |
| 5 | Setty | Two: what have you already tried? Three: if we're a match, are you ready this month? | Deux : qu'est-ce que tu as déjà essayé ? Trois : si ça colle, tu es prêt ce mois-ci ? | Cartes « 2 » et « 3 » | clic, clic, 💥 sur « this month » | rd44 |
| 6 | Setty | The others get your free guide, not your evening. | Les autres reçoivent ton guide gratuit, pas ta soirée. | Bulle « here's my free guide 📘 » |  | rd76 |
| 7 | Setty | You've been running a free walk-in clinic for every guy with a cough, [bip]. | Tu tiens un cabinet sans rendez-vous gratuit pour chaque gars qui tousse, crétin. | Le coach sur la table d'examen | 😩 Fahhh | rd92 |
| 8 | Setty | Plug me into Manychat. Only the right leads get your calendar. | Branche-moi sur Manychat. Seuls les bons leads reçoivent ton agenda. | Carte ManySetter : agenda donné à un seul lead |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel28 · info-reply · dim. 15/11

- **Titre-hook affiché** : What I reply when a / lead just says "*info*" (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : A lead texts you "info" and you send the whole program? Reply this instead.
- **Décor neuf** : Food truck le soir : le coach au comptoir, menu ardoise, guirlande d'ampoules ; Setty sur le comptoir à côté de la caisse.
- **L'info à enregistrer** : La réponse à un DM d'un mot (« info », « price ») : une seule question, pas un pavé.
- **Sources** : Script (aucun fait chiffré). Le setter pose une question à la fois (brief, § 2).
- **Segment** S1 · avatar AV1 · 112 mots · ~40 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | A lead texts you "info" and you send him a [bip] essay. | Un lead t'écrit « info » et tu lui envoies une putain de dissertation. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | rd23 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, I sent the whole thing. Program, price, testimonials, my Calendly link. | J'ai tout envoyé. Programme, prix, témoignages, mon lien Calendly. | Gros plan coach ; bulle orange interminable | clic | rd22 |
| 4 | Setty | He sent one word. He wanted one answer. | Il a envoyé un mot. Il voulait une réponse. | Bulle « info » toute seule |  |  |
| 5 | Setty | Reply this: happy to help, what made you message me today? | Réponds ça : avec plaisir, qu'est-ce qui t'a fait m'écrire aujourd'hui ? | Carte : la réponse en bulle orange, courte | clic, 💥 sur « today » |  |
| 6 | Coach | And if he just says "price"? | Et s'il dit juste « prix » ? | Gros plan coach |  | rd13 |
| 7 | Setty | Same move: what are you trying to fix? | Même technique : qu'est-ce que tu cherches à régler ? | Carte : bulle « price » → réponse | clic |  |
| 8 | Setty | Somebody says "food" and you dump the whole menu on his head, [bip]. | Quelqu'un dit « à manger » et tu lui renverses tout le menu sur la tête, crétin. | Le coach et son ardoise | 😩 Fahhh |  |
| 9 | Setty | Plug me into Manychat. I ask one question at a time, in your voice. | Branche-moi sur Manychat. Je pose une question à la fois, avec ta voix. | Carte ManySetter |  |  |
| 10 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel34 · instagram-or-whatsapp · lun. 16/11

- **Titre-hook affiché** : *Instagram* or WhatsApp: where / should leads DM you? (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : Your mentor says move everything to WhatsApp? Read this first.
- **Décor neuf** : Pont d'un yacht : le coach en transat, un téléphone dans chaque main ; Setty sur une bouée. Mer turquoise, sillage, soleil de midi.
- **L'info à enregistrer** : Les deux canaux ont la même règle : une automatisation a 24 h après le dernier message du lead. Après, Instagram ne permet plus d'écrire et WhatsApp n'accepte qu'un modèle approuvé, facturé par Meta.
- **Sources** : Règles de messagerie Instagram (fenêtre de 24 h) et tarifs de la plateforme WhatsApp Business (developers.facebook.com/docs/whatsapp/pricing) à revérifier avant la voix.
- **Segment** S1 · avatar AV1 · 118 mots · ~42 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | You're picking between Instagram and WhatsApp while your leads [bip] wait on both. | Tu hésites entre Instagram et WhatsApp pendant que tes leads attendent sur les deux, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | rd06 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, my mentor says WhatsApp is way more personal. | Mon mentor dit que WhatsApp, c'est bien plus perso. | Gros plan coach, deux téléphones |  |  |
| 4 | Setty | Same rule on both: your automation gets twenty-four hours after their last message. | Même règle sur les deux : ton automatisation a 24 h après leur dernier message. | Carte duel : deux colonnes, horloge 24 h | clic | mc18 |
| 5 | Setty | After that, your Instagram automation goes quiet, and WhatsApp only takes an approved template, billed by Meta. | Après, ton automatisation Instagram se tait, et WhatsApp n'accepte qu'un modèle approuvé, facturé par Meta. | Colonnes : « silence » / « modèle payant » | 💥 sur « billed by Meta » |  |
| 6 | Setty | So the winner is the one where somebody answers inside those twenty-four hours. | Donc le gagnant, c'est celui où quelqu'un répond dans ces 24 heures. | Coupe sur les deux colonnes |  |  |
| 7 | Setty | You're on a yacht with two phones and you answer neither, [bip]. | Tu es sur un yacht avec deux téléphones et tu ne réponds sur aucun, crétin. | Le coach lève ses deux téléphones | 😩 Fahhh |  |
| 8 | Setty | Plug me into Manychat. I answer on Instagram and WhatsApp, inside that window. | Branche-moi sur Manychat. Je réponds sur Instagram et WhatsApp, dans cette fenêtre. | Carte ManySetter : les deux icônes |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel24 · link-or-slots · mar. 17/11

- **Titre-hook affiché** : *Booking link* or 3 time / slots in the DM? (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : You drop your Calendly link and they never book? Send 3 time slots instead.
- **Décor neuf** : Hall d'hôtel de luxe : le coach au comptoir de la réception, clé à la main ; Setty à côté de la sonnette dorée. Marbre, lustre, horloges des fuseaux horaires au mur.
- **L'info à enregistrer** : Un lien de réservation = des devoirs (une nouvelle page, un agenda, un formulaire, le calcul du fuseau). Deux ou trois créneaux dans son fuseau = une réponse d'un mot, dans le DM où il est déjà.
- **Sources** : Script (avis, aucun chiffre). Le setter propose 2 ou 3 créneaux dans le fuseau du lead avec Cal.com, iClosed ou Calendly payant (brief, § 2).
- **Segment** S2 · avatar AV2 · 112 mots · ~40 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | Your booking link is homework, and nobody does [bip] homework. | Ton lien de réservation, c'est des devoirs, et personne ne fait ses putains de devoirs. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop |  |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, it's one click. They pick a time and done. | C'est un clic. Ils choisissent une heure et c'est fini. | Gros plan coach ; bulle avec le lien |  | rd07 |
| 4 | Setty | One click, a new page, a calendar, a form, and timezone math. | Un clic, une nouvelle page, un agenda, un formulaire, et le calcul du fuseau. | Les étapes qui s'empilent | clic |  |
| 5 | Setty | Or you write: Tuesday at 2 p.m. or Thursday at 10 a.m., your time, which works? | Ou tu écris : mardi 14 h ou jeudi 10 h, chez toi, lequel te va ? | Carte : la bulle orange avec les 2 créneaux | clic, 💥 sur « which works » |  |
| 6 | Coach | Okay, but I'm not doing timezones by hand. | D'accord, mais je ne vais pas calculer les fuseaux à la main. | Gros plan coach |  |  |
| 7 | Setty | Last week you booked a guy in LA at 6 a.m. his time, [bip]. | La semaine dernière, tu as calé un gars de LA à 6 h du matin chez lui, crétin. | Horloges : LA 6:00 | 😩 Fahhh | rd96 |
| 8 | Setty | Plug me into Manychat. I offer slots in his timezone and book the call. | Branche-moi sur Manychat. Je propose des créneaux dans son fuseau et je réserve l'appel. | Carte ManySetter : 3 créneaux, appel réservé |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel29 · free-guide · mer. 18/11

- **Titre-hook affiché** : Your *free guide* is why / nobody books a call (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : 300 people took your free guide and zero booked? Send this right after.
- **Décor neuf** : Librairie : le coach derrière une table de dédicace, une pile de ses guides gratuits que personne ne prend ; Setty en haut de la pile. Rayonnages en bois, lampes vertes.
- **L'info à enregistrer** : Le message à envoyer juste après le guide : une question qui ouvre la conversation, et une relance dans les 24 h, pas mardi prochain.
- **Sources** : Script. Relances : jusqu'à 3, dans la fenêtre de 24 h (brief, § 2).
- **Segment** S2 · avatar AV2 · 108 mots · ~39 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | Your free guide is why nobody books a [bip] call. | Ton guide gratuit, c'est pour ça que personne ne réserve un putain d'appel. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | mc01 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Three hundred people took my guide this week, bro, and zero calls. | 300 personnes ont pris mon guide cette semaine, et zéro appel. | Gros plan coach ; compteur 300 / 0 | clic | mc36 |
| 4 | Setty | Because the guide ended the conversation, when it should start it. | Parce que le guide a fini la conversation, alors qu'il devait la lancer. | Bulle « here's your guide 📘 » puis plus rien |  | mc47 |
| 5 | Setty | Right after the guide, ask: what's the hardest part of this for you? | Juste après le guide, demande : c'est quoi le plus dur pour toi là-dedans ? | Carte : la question en bulle orange | clic, 💥 sur « hardest part » |  |
| 6 | Coach | And if they don't answer? | Et s'ils ne répondent pas ? | Gros plan coach |  | rd08 |
| 7 | Setty | You follow up inside twenty-four hours, not next Tuesday, when they forgot your name, [bip]. | Tu relances dans les 24 heures, pas mardi prochain, quand ils auront oublié ton nom, crétin. | Calendrier : mardi barré | 😩 Fahhh | mc03 |
| 8 | Setty | Plug me into Manychat. I start that conversation and follow up to three times. | Branche-moi sur Manychat. Je lance cette conversation et je relance jusqu'à trois fois. | Carte ManySetter : 3 relances |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel31 · boost-or-ads-manager · jeu. 19/11

- **Titre-hook affiché** : *Boost* or Ads Manager: which / one fills your DMs? (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : Boost or Ads Manager for DM ads? Both work, here's the catch.
- **Décor neuf** : Cinéma drive-in la nuit : le coach dans une décapotable devant l'écran géant qui passe sa pub ; Setty sur le capot, pop-corn. Haut-parleur sur poteau, guirlandes, ciel étoilé.
- **L'info à enregistrer** : Sur Instagram, le bouton Booster a un objectif « More messages » et passe dans la même enchère que le Gestionnaire de publicités ; le Gestionnaire ajoute les tests A/B pour savoir quelle pub apporte les DM.
- **Sources** : Aide Instagram (objectifs du boost : profile visits, website visits, messages) et aide Meta Business (boost et Gestionnaire, même enchère ; tests A/B) à revérifier.
- **Segment** S1 · avatar AV1 · 116 mots · ~41 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | Boost or Ads Manager? Both fill your DMs, and neither [bip] answers them. | Booster ou Gestionnaire de pubs ? Les deux remplissent tes DM, et aucun n'y répond, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop |  |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, everybody says boosting is for amateurs. | Tout le monde dit que booster, c'est pour les amateurs. | Gros plan coach dans la décapotable |  | rd23 |
| 4 | Setty | Instagram's Boost has a More messages goal, in the same auction as Ads Manager. | Le Booster d'Instagram a un objectif « Plus de messages », dans la même enchère que le Gestionnaire. | Carte : l'écran du boost, « More messages » coché | clic |  |
| 5 | Setty | Ads Manager adds A/B tests, so you know which ad brings the DMs. | Le Gestionnaire ajoute les tests A/B, pour savoir quelle pub apporte les DM. | Carte : pub A contre pub B | clic, 💥 sur « which ad » |  |
| 6 | Setty | Boost to start, Ads Manager to test, and somebody to answer either way. | Booster pour commencer, le Gestionnaire pour tester, et quelqu'un pour répondre dans les deux cas. | Les deux colonnes, puis « + someone to answer » |  |  |
| 7 | Setty | You're watching your own ad at a drive-in while the DMs pile up, [bip]. | Tu regardes ta propre pub dans un drive-in pendant que les DM s'empilent, crétin. | L'écran géant, le coach avec son pop-corn | 😩 Fahhh | rd24 |
| 8 | Setty | Plug me into Manychat. I answer the DMs your ads bring, in your voice. | Branche-moi sur Manychat. Je réponds aux DM que tes pubs apportent, avec ta voix. | Carte ManySetter |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel30 · 30-line-dm · ven. 20/11

- **Titre-hook affiché** : Your *30-line DM* is / why nobody replies (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : You sent a lead your whole life story in one DM? Here are the 3 rules.
- **Décor neuf** : Laverie automatique la nuit : le coach assis sur une machine, en train de taper un pavé, le linge tourne ; Setty sur une machine à laver. Néons, tambours qui tournent.
- **L'info à enregistrer** : Les 3 règles d'un DM qui se lit : une idée par message, une seule question à la fin, et si tu ne l'enverrais pas à un pote, tu ne l'envoies pas à un lead.
- **Sources** : Conseil (aucun fait chiffré). Le setter envoie une réponse courte, une fois que le lead a fini d'écrire (brief, § 2).
- **Segment** S1 · avatar AV1 · 105 mots · ~38 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | You wrote a thirty-line DM and wondered why nobody [bip] replied. | Tu as écrit un DM de 30 lignes et tu te demandes pourquoi personne ne répond, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop |  |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, I gave him everything. My story, my method, my price. | Je lui ai tout donné. Mon histoire, ma méthode, mon prix. | Gros plan coach ; le pavé qui défile sur son téléphone |  | rd23 |
| 4 | Setty | He asked one question and you sent him an audiobook, [bip]. | Il a posé une question et tu lui as envoyé un livre audio, crétin. | Setty le montre | 😩 Fahhh |  |
| 5 | Setty | Rule one: one idea per message. Rule two: one question, at the end. | Règle un : une idée par message. Règle deux : une seule question, à la fin. | Cartes « 1 » et « 2 » | clic, clic | mc11 |
| 6 | Setty | Rule three: if you wouldn't text it to a friend, don't send it to a lead. | Règle trois : si tu ne l'enverrais pas à un pote, ne l'envoie pas à un lead. | Carte « 3 » | clic, 💥 sur « to a lead » | rd38 |
| 7 | Setty | Plug me into Manychat. I send one short reply, once the lead has finished writing. | Branche-moi sur Manychat. J'envoie une réponse courte, une fois que le lead a fini d'écrire. | Carte ManySetter : bulle courte |  | mc10 |
| 8 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel33 · voice-note-or-text · sam. 21/11

- **Titre-hook affiché** : *Voice note* or text: which / one wins a lead? (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : You answered "how much?" with a 3-minute voice note? Here's when to use text.
- **Décor neuf** : Station de radio FM rétro : le coach au micro, enseigne « ON AIR » allumée, table de mixage, vinyles au mur ; Setty sur la console. Lumière tamisée rouge et ambre.
- **L'info à enregistrer** : Le texte pour la 1re réponse, l'info, le prix et les liens (ça se lit en deux secondes) ; le vocal, court, quand le lead est chaud et parle déjà.
- **Sources** : Conseil (aucun chiffre). Verbatims rd85 et cl045 (le vocal fait plus humain). Pas de note vocale du setter sur Instagram ni WhatsApp (brief, § 7) : le setter passe la main au coach.
- **Segment** S1 · avatar AV1 · 120 mots · ~42 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | You sent a three-minute voice note to a guy who asked the [bip] price. | Tu as envoyé un vocal de trois minutes à un gars qui demandait le putain de prix. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | rd13 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, voice notes are personal. People love my voice. | Les vocaux, c'est perso. Les gens adorent ma voix. | Gros plan coach au micro, ON AIR |  | rd85 |
| 4 | Setty | First reply, info, price, links: text, he reads it in two seconds. | Première réponse, infos, prix, liens : du texte, il le lit en deux secondes. | Carte duel : colonne TEXT | clic |  |
| 5 | Setty | Voice note once he's warm and talking, so he hears a real person. | Le vocal une fois qu'il est chaud et qu'il parle, pour qu'il entende une vraie personne. | Colonne VOICE | clic | cl045 |
| 6 | Setty | Keep it under a minute, nobody wants your podcast in a DM. | Moins d'une minute, personne ne veut ton podcast dans un DM. | Onde audio coupée à 0:59 | 💥 sur « podcast » |  |
| 7 | Setty | You're the only guy who turned "how much" into a radio show, [bip]. | Tu es le seul à avoir transformé « combien ? » en émission de radio, crétin. | L'enseigne ON AIR clignote | 😩 Fahhh |  |
| 8 | Setty | Plug me into Manychat. I handle the texts, and you jump in with a voice note whenever you want. | Branche-moi sur Manychat. Je gère les textes, et tu reprends la main avec un vocal quand tu veux. | Carte ManySetter : « You took over this conversation » |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel35 · two-questions · dim. 22/11

- **Titre-hook affiché** : Never ask a lead *two / questions* in one DM (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : You asked his goal and his budget in one DM? He answered the easy one.
- **Décor neuf** : Spa : le coach dans un bain froid, vapeur, bois clair, galets ; Setty en serviette sur un banc de sauna.
- **L'info à enregistrer** : Une question par message : l'objectif d'abord, le budget une fois qu'il parle. Deux questions d'un coup, et le lead répond à la plus facile.
- **Sources** : Conseil (aucun fait chiffré). Le setter pose une question à la fois et ne repose jamais une question déjà posée (brief, § 2).
- **Segment** S1 · avatar AV1 · 117 mots · ~41 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | Two questions in one DM, and he answers the easy [bip] one. | Deux questions dans un DM, et il répond à la plus facile, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop |  |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, I asked his goal and his budget. He said lose twenty pounds. | Je lui ai demandé son objectif et son budget. Il a dit perdre dix kilos. | Gros plan coach dans le bain ; bulle à 2 questions, 1 réponse | clic | rd44 |
| 4 | Setty | The budget never came back, and asking again feels pushy. | Le budget n'est jamais revenu, et redemander fait insistant. | La 2e question qui s'efface |  | rd98, mc11 |
| 5 | Setty | One question per message: the goal first, the budget once he's talking. | Une question par message : l'objectif d'abord, le budget quand il parle. | Cartes « 1 » puis « 2 » | clic, clic | rd45 |
| 6 | Setty | It's slower than one DM, and faster than a call with a guy who has forty bucks. | C'est plus lent qu'un seul DM, et plus rapide qu'un appel avec un gars qui a 40 dollars. | Carte : appel de 45 min, budget 40 $ | 💥 sur « forty bucks » | rd43, rd44 |
| 7 | Setty | You're sitting in ice and you're scared of one extra message, [bip]. | Tu es assis dans la glace et tu as peur d'un message de plus, crétin. | Le coach grelotte | 😩 Fahhh |  |
| 8 | Setty | Plug me into Manychat. I ask one question at a time, never twice. | Branche-moi sur Manychat. Je pose une question à la fois, jamais deux fois. | Carte ManySetter |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

## reel32 · vacation-dms · lun. 23/11

- **Titre-hook affiché** : Going on *vacation*? Your / DMs need this first (le mot entre astérisques en orange)
- **Titre YouTube** (phrase de conversation) : Going to Bali and leaving your DMs on read for a week? Do this first.
- **Décor neuf** : Villa à Bali : le coach dans un hamac au bord d'une piscine à débordement, rizières au fond ; Setty sur une bouée donut. Lumière du matin, palmiers.
- **L'info à enregistrer** : Le message d'absence de Meta Business Suite (Boîte de réception, Automatisations) et ce qu'il faut y écrire ; sa limite : il répond une fois, sans question, sans prix, sans rendez-vous.
- **Sources** : Aide Meta Business, « Inbox automations » (facebook.com/business/help/395965998733706) à revérifier : chemin des menus et disponibilité pour Instagram.
- **Segment** S1 · avatar AV1 · 115 mots · ~41 s

| # | Qui | Réplique (EN, à l'écran) | Sens (FR) | Plan et écran | Son | Verbatims |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Setty | You're in Bali, and your DMs think you're [bip] dead. | Tu es à Bali, et tes DM pensent que tu es mort, putain. | Large, coup de zoom sur Setty ; titre | riser → 💥 + drop | cl135 |
| 2 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Barre de commentaire sous le titre | clics sur SETTY | série |
| 3 | Coach | Bro, I'm on vacation. They can wait a week. | Je suis en vacances. Ils peuvent attendre une semaine. | Gros plan coach dans le hamac |  | rd61 |
| 4 | Setty | They won't, so set an away message in Meta Business Suite, under Inbox, Automations. | Ils n'attendront pas, alors règle un message d'absence dans Meta Business Suite, Boîte de réception, Automatisations. | Carte : le chemin des menus | clic |  |
| 5 | Setty | Write: back Monday, tell me what you need and you're first on my list. | Écris : de retour lundi, dis-moi ce qu'il te faut et tu es le premier sur ma liste. | Carte : le message en bulle | clic, 💥 sur « first on my list » |  |
| 6 | Setty | It answers once and that's it: no questions, no price, no booked call. | Il répond une fois et c'est tout : pas de question, pas de prix, pas d'appel réservé. | Trois croix |  |  |
| 7 | Setty | So your hottest lead gets a postcard, and you get a sunburn, [bip]. | Donc ton lead le plus chaud reçoit une carte postale, et toi un coup de soleil, crétin. | Le coach rouge écrevisse | 😩 Fahhh |  |
| 8 | Setty | Plug me into Manychat. I keep it going and book calls while you're away. | Branche-moi sur Manychat. Je fais vivre la conversation et je réserve les appels pendant ton absence. | Carte ManySetter : appel réservé |  |  |
| 9 | Setty | Comment SETTY and I'll send you everything to build your AI setter for free. | Commente SETTY et je t'envoie tout pour créer ton setter IA gratuitement. | Fin commune | clics | série |

