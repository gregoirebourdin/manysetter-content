# Verbatims de la cible

> Les mots exacts des gens qui vendent par DM. **Source n°1 de tout texte** (voir `CLAUDE.md`). Relue avant chaque production.
> Version du 10/10/2026. Fichier **généré** par `build_verbatims.py` à partir de `verbatims.jsonl` : on enrichit le `.jsonl` (une citation par ligne), puis on relance le script. Ne pas modifier ce `.md` à la main.

## D'où viennent ces mots

Deux recherches menées le même jour, fusionnées ici :

- **Recherche cloud** (préfixe `cl`) : forum public de la communauté Manychat (environ 130 fils lus), Trustpilot (avis de Manychat 1 à 3★, d'outils de setting IA et d'agences de setters), offres d'emploi de setters sur Freelancer, LinkedIn, Skool. Reddit était bloqué depuis le cloud.
- **Recherche depuis l'appli de bureau** (préfixes `mc` forum Manychat, `rd` Reddit, `tp` Trustpilot) : forum Manychat (57 fils), Reddit par flux RSS publics (environ 160 posts et 20 fils de commentaires, surtout r/personaltraining, r/InstagramMarketing, r/smallbusiness, r/Coaching), Trustpilot. Elle a comblé le trou principal de la première : la voix des coachs eux-mêmes.
- **Sources gratuites uniquement, sans compte**, aucun outil payant. **Aucune donnée personnelle** : ni pseudo, ni nom, ni handle. Le lien mène à la discussion.
- **Chaque citation est vérifiée mot pour mot** (colonne « Vérif. ») : par **script** contre le texte source téléchargé, ou dans le **navigateur** intégré (recherche exacte de la phrase dans la page affichée, 10/10/2026). Seuls les espaces et les apostrophes typographiques sont normalisés. Les fautes d'origine sont gardées. Dans une citation, « (…) » marque une coupe et « / » un retour à la ligne du message d'origine.
- Arrêt quand les mêmes motifs revenaient d'une source à l'autre. Les doublons entre les deux recherches ont été retirés. Outils et marche à suivre pour enrichir : `outils/README.md`.

## Comment s'en servir

1. **À la 1re personne, jamais comme un avis client** : pas de prénom, pas d'étoiles, pas de « a coach told us ». La citation devient la pensée du personnage du post (Maya, Jordan, Sam) ou la phrase que Seth dit avoir « vue dans une boîte de réception ». Aucune de ces personnes n'est cliente de ManySetter.
2. **On adapte la ponctuation, pas le sens** : en publication, aucun tiret cadratin ni demi-cadratin, US English, pas de phrase de 2 ou 3 mots. Si on réécrit, ce n'est plus un verbatim : c'est un hook inspiré, sans guillemets.
3. **Rien contre Manychat** : ManySetter s'ajoute à Manychat. Une citation négative qui nomme Manychat ne se publie jamais telle quelle ; si l'émotion est utile, on écrit « [my automation] », crochets visibles, ou on garde seulement la douleur (leads laissés en plan, air pas professionnel).
4. **Aucun nom de concurrent** : les noms d'outils présents dans une citation sont retirés.
5. **Le thème « Quand l'automatisation lâche » (T13)** sert à comprendre la peur et la fatigue de la cible. ManySetter ne change ni les déclencheurs de Manychat ni les règles de Meta : on ne promet jamais d'éviter un ban, une demande de message ou un déclencheur raté.
6. **Voix d'agence, d'expert ou d'éditeur** (notées en commentaire) : inspiration seulement, jamais présentées comme la voix d'un client.
7. **Aucun chiffre d'une citation** n'est présenté comme une statistique ou un résultat ManySetter : ce sont des anecdotes.
8. **Inbound seulement** : une citation notée « prospection » sert pour l'émotion, jamais pour son contexte de DM à froid.
9. **Pas d'indétectable** : les citations sur « paraître naturel » servent à parler de ton et de voix de marque. Les lignes notées « INTERDIT EN PUBLICATION » ne sortent jamais.
10. **Traçabilité** : chaque post note dans sa fiche l'avatar et les numéros de citations utilisées (exemple : `"verbatims": ["rd04", "cl027"]`).

## Les motifs qui reviennent

Ce que les deux recherches répètent d'une source à l'autre (numéros entre parenthèses). C'est la matière des hooks.

1. **Le post marche, la boîte déborde.** Le volume dépasse une seule personne, et c'est vécu comme un bon problème qui tourne mal : « I'm getting more DMs than I can handle » (rd04), « replying in a timely manner is almost impossible » (rd17), « He cannot keep up with them » (mc26). Le reel viral est à la fois le rêve et la panique : « 40K views… and over 400 comments » (cl005). → S1, hook « Do you have… ? ».
2. **« Je perds des leads », dit tel quel.** Ils ne parlent pas de taux de conversion : « I'm losing a lot of potential leads » (cl002), « wasted leads » (cl018), « I replied too late and lost the sale » (rd19), « leads just move on to whoever responds first » (rd06).
3. **Le lead s'évapore juste après le prix ou la première réponse.** « Asked for the price and disappeared » (rd13), « this is exactly what I need… and then vanished » (rd47), « the convo just sits there collecting dust » (mc47), « disappears into the inbox void » (mc01), « people enquiring and then ghosting ( I hate people wasting my damn time) » (rd88), « ghosted after I sent my rates » (rd91). → La série « 4 replies » et la relance (jusqu'à 3, dans la fenêtre de 24 h).
4. **Le mot-clé n'est pas une conversation.** Le flow répond au mot, pas à la question : « jumped in just because it recognized a word, not based on user intent » (mc07), « it sends automatic message ever time when they write course » (rd22), il redemande ce que le lead a déjà dit (mc11), les gens écrivent en plusieurs messages (mc10). → Le setter attend la fin du message, pose une question à la fois, jamais deux fois.
5. **Trop rapide, donc bot.** « I respond immediately, which is too fast » (mc19), « Instant AI replies break immersion » (cl095), « way too fast at the moment Lol » (cl145). → Le setter attend que le lead ait fini d'écrire. Ne jamais vendre la vitesse instantanée.
6. **La peur de sonner robot ou amateur.** « without sounding robotic or spammy » (rd38), « look like amater to my leads » (rd23), « robotic, cringey messages » (mc05), « not just canned or templated replies » (cl097). Même quand ils recrutent un humain, c'est le critère : « without sounding robotic » (rd31). Leurs ruses : minuscules exprès (cl043), notes vocales (rd85, cl045). → « Your leads hear your brand, not a generic bot ». Jamais « indétectable ».
7. **L'objection n°1 : « un message automatique fait fuir ».** Chez les coachs sportifs surtout : « The fastest way to lose a lead is for the first interaction they have with you be an automated message » (rd57), « it's just a big turn off » (rd62), « My mature clients don't expect a reply at 2am » (rd61), « AI right now for DMs? No. » (rd53). Le désir est juste à côté : « I just want the repetitive first step handled faster […] while still keeping the actual interaction human » (rd65). → Vendre la conversation qui sonne comme la marque et qui passe la main à un humain, pas la réponse à 3 h du matin. La série « 3 a.m. shift » de Seth reste une blague sur la vie du coach, pas une promesse de vitesse.
8. **Les mauvais appels et les curieux coûtent du temps.** « 6 consult calls booked. None of them turned into a real client » (rd43), « 15+ conversations over DM and email. Ended up with 2 actual clients » (rd90), « what feels like free consulting » (rd92), « the inbox doesn't discriminate » (cl026). Certains coachs ont déjà la bonne logique : une offre à 30 $ pour ceux qui n'ont pas le budget (rd76). → « Only the right leads get your calendar », et une réponse utile pour les autres.
9. **Le setter humain : instable, cher, fatigant à former.** « people would come and go, results would vary » (cl056), « $10k+ in commissions - for quite average returns » (cl057), « he completely disappeared » (cl058), « tired of training a human setter » (cl123), « trusting someone else to have sales conversations on your behalf » (rd35). → S2, sans jamais dénigrer les setters comme personnes.
10. **Le bot et l'humain se marchent dessus.** Le bot répond par-dessus l'humain (mc41, mc21), personne ne sait qui doit reprendre (mc15), seul au volant sans équipe à appeler (cl030). → « A person when it matters », le relais vers l'équipe.
11. **Les agences portent la conversation de leurs clients.** Clients non techniques qui veulent tout déléguer (mc38, mc39, rd25), plus de 20 comptes à suivre (mc13), la réputation auprès du client en jeu (cl140). → S3, « You built the flow. Who handles the reply? »
12. **Seuls face à l'outil et à Meta.** Déclencheurs ratés, demandes de message, comptes restreints : « Meta isn't responsible. / Manychat isn't responsible. / Nobody is responsible. » (cl149), « We were NEVER told to switch ManyChat off. » (cl076). → Matière à empathie seulement (règle 5).
13. **Les contournements font rire parce qu'ils sont vrais.** 40 DM à la main après un bon post (rd01), un ami payé 50 $ par mois pour répondre (rd40), « manually doing everything defeats the purpose » (cl033), le « hey, did you still want me to send that over? » (mc03), et l'autodérision des coachs ghostés : « ones that magically disappear like your situation lol » (rd82), « I thought if they wanted a coach, they would find me. Ya, I was wrong. » (rd99). → Format « Things I did before ».

## Ce qui manque encore

- **Le setter vu par le coach** : mieux couvert (offres d'emploi, avis), mais presque aucun coach ne raconte en public un setter qui ghoste ou des no-shows dus au setter.
- **Agences (S3)** : surtout des voix techniques. Il manque la relation client (« le client demande ce que ça a rapporté »).
- **La culpabilité et le burn-out** : une seule note de culpabilité (cl135) et un burn-out (rd75).
- **L'objection prix d'un setter IA** (« une IA à 119 $ par mois contre un setter ») : rien encore.
- **WhatsApp, trading, santé, marché francophone** : presque absents.
- **Pistes** : commentaires sous les annonces de recrutement de setters, r/OnlinePersonalTrainer et r/sales en commentaires, et 5 à 10 entretiens courts avec des utilisateurs de l'essai gratuit, avec la même grille de thèmes.

## Les mots qu'ils tapent (pour les légendes)

DMs, inbox, leads, losing leads, follow up, ghosted, "how much", consult calls, discovery call, booked calls, no-shows, setter, DM setter, AI setter, appointment setter, Manychat, comment keyword, comment to DM, qualify leads, sound robotic, bot-like, high ticket, online coach.

