# Sources vérifiées : banque d'idées n° 2 (idées 11 à 20)

> Vérification faite le 20/10/2026, pour les posts des idées 11 à 20 de `ligne-edito.md`. Chaque fait a une **formulation sûre en anglais** (prête pour un post), sa source, la date de consultation et un niveau.
> Rien ici n'est publié. Avant d'écrire un post, on reprend la formulation telle quelle ou on reste plus prudent qu'elle.

## Comment lire ce fichier

**Niveaux**
- **vérifié** : lu à la source, la formulation anglaise dit la même chose que la source.
- **en partie** : la source dit l'essentiel mais pas tout (date différente d'une source à l'autre, page payante lue par une reprise, assemblage de briques documentées séparément, réglage présent dans le code mais pas sur les pages publiques).
- **non trouvé** : aucune source officielle, ou déduction de Claude. À ne pas présenter comme un fait.

**Sources**
- **Site ManySetter** : dépôt GitHub `gregoirebourdin/MANY-SETTER`, commit `4437fc1` du 17/10/2026, lu en lecture seule (copie temporaire hors des deux dépôts, rien n'a été modifié). Noté `site:` suivi du chemin et de la ligne. Attention : le dossier local `/Users/gregoire/Projects/ManySetter` est une ancienne version de l'app (dernier commit du 27/08/2026), il n'a pas servi.
- **Pages officielles** (Meta, Manychat, Make, PayScale) : lues le 20/10/2026, dans le navigateur intégré quand la lecture web était refusée (Manychat renvoie 403 aux robots). Les citations font moins de 15 mots, le reste est paraphrasé.
- **Articles scientifiques** : notices Crossref, Europe PMC et RePEc (auteurs, revue, volume, pages, DOI, résumé).

Toutes les consultations : **20/10/2026**.

---

## Faits produit communs (idées 11, 13, 15, 18, 19, 20)

| # | Formulation sûre (EN) | Source | Niveau |
| --- | --- | --- | --- |
| P1 | "ManySetter costs $119 a month per live setter, or $1,190 a year." | `site:src/config/plans.ts:62-63` | vérifié |
| P2 | "Each live setter includes 1,500 AI replies a month, and one reply is one message the setter sends, follow-ups included." | `site:src/config/plans.ts:64` ; `site:src/content/pricing.ts:458` ; options `+500 replies $39` : `plans.ts:83` | vérifié |
| P3 | "Building and testing your setter is free, with no card. Going live starts a 14-day trial." | `site:src/config/plans.ts:7-10, 72-79` | vérifié |
| P4 | "It waits until the lead has finished typing, then sends one reply to everything they wrote." | Page publique : `site:src/content/how-it-works.ts:232` (« once they've finished typing »). Mécanisme : `site:src/features/engine/lib/policy.ts:28-34` (au moins 30 s de silence, chaque nouveau message relance l'attente, cinq messages d'affilée reçoivent une seule réponse) ; `site:src/features/engine/server/reply-time.ts:25-27` | vérifié |
| P5 | "You choose how long it waits after the lead's last message, from 30 seconds to 5 minutes." | `site:src/features/setters/lib/config.ts:186-190` ; `site:src/content/guides/ai-vs-human-appointment-setter.ts:373` | vérifié (à ne jamais vendre comme de la vitesse) |
| P6 | "It asks your fit questions one at a time." | `site:src/content/how-it-works.ts:240` ; règle d'écriture « At most one question per reply » : `site:src/features/setters/lib/human-texting.ts:96` | vérifié |
| P7 | "It remembers what the lead already told you, so it never asks the same question twice." | `site:src/content/ai-dm-setter.ts:151` ; `site:src/content/manychat-whatsapp-bot.ts:227` ; mémoire relue avant chaque réponse, critères met / not met / unknown : `site:src/features/engine/lib/memory.ts:6-10, 60-68` | vérifié (affirmation du site et mécanisme ; comportement non testé en conversation) |
| P8 | "If a lead goes quiet, it sends up to 3 follow-ups, between 1 and 23 hours after their last message, so every one lands inside the 24-hour window." | `site:src/features/setters/lib/follow-ups.ts:14-20` (3 relances, délais de 1 à 23 h après le dernier message du lead) ; `site:src/config/plans.ts:43` ; page publique « within the 24 hours each channel allows » : `site:src/content/pricing.ts:467` | vérifié |
| P8b | "Follow-ups stop as soon as the lead replies or books." | `site:src/content/pricing.ts:467` ; `site:src/content/calendar-connect.ts:35` | vérifié |
| P8c | "You can write the follow-ups yourself, or let the AI write them." | Modes « AI writes it », « I write it », « Voice note » : `site:src/features/setters/lib/follow-ups.ts:27-31` | vérifié |
| P8d | "Out of the box, it sends two follow-ups, 4 hours and 20 hours after the lead's last message." | `site:src/features/setters/lib/follow-ups.ts:56-66` | vérifié |
| P8e | "A voice-note follow-up plays as audio on Messenger. On Instagram and WhatsApp, it goes out as text." | `site:src/content/manychat-whatsapp-bot.ts:310` | vérifié |
| P8f | Règle des relances écrites par l'IA : une question au plus, sans pression ni culpabilité, jamais un lien déjà envoyé. EN : "Each follow-up asks one question at most, with no pressure and no guilt trip." | `site:src/features/engine/lib/follow-up-timing.ts:231` | vérifié (règle du modèle, pas une page publique) |
| P9 | "It offers two or three open times in the lead's time zone, confirms their email, then books the call on Cal.com, Calendly or iClosed." | `site:src/content/calendar-connect.ts:9-15, 27, 32-33` | vérifié |
| P9b | "On Calendly Free, or with any other booking tool, it sends your booking link instead." | `site:src/content/calendar-connect.ts:56` ; `site:src/content/how-it-works.ts:359-361` | vérifié |
| P10 | "Leads who don't fit get a helpful answer instead of your calendar." | `site:src/content/how-it-works.ts:369-371` ; exemple (démo) du guide gratuit envoyé à la place d'un appel : `site:src/content/home.ts:80-102` | vérifié |
| P11 | "When a lead asks for a person, seems upset, or asks something your sources don't cover, it hands the chat to your team, and your teammate gets an email with the context." | Déclencheurs request / upset / unknown : `site:src/features/engine/lib/handoff.ts:4-12` ; `site:src/content/how-it-works.ts:298-300` | vérifié |
| P11b | "You can take over any chat from the inbox. The setter pauses until you hand it back." | `site:src/content/how-it-works.ts:287-289` | vérifié |
| P12 | "It answers the price from your playbook. If your playbook has no price, it says the price is covered on the call." | Section « Price and payment » du playbook généré : `site:src/features/setters/lib/writer-prompts.ts:183-189` | en partie (règle du générateur de playbook ; le propriétaire peut la changer) |
| P13 | Heures de réponse. Par défaut : "It replies at any hour." Un réglage « When it replies » (réponses et relances seulement pendant les heures actives, à l'heure du lead) existe dans le code. | Défaut : `site:src/content/guides/ai-vs-human-appointment-setter.ts:131, 373`. Réglage : `site:src/features/setters/lib/config.ts:192-215` | en partie (le réglage n'est sur aucune page publique : demander au fondateur avant d'écrire « only during your hours ») |
| P14 | Phrase exacte du site : "A US appointment setter earns about $13 to $21 an hour in base pay, plus commission (PayScale, May 2026)." | `site:src/content/guides/ai-vs-human-appointment-setter.ts:130` ; tableau (moyenne $16.08, commission $9k à $15k par an, mise à jour du 12/05/2026) : lignes 235-239 ; FAQ : ligne 673 ; source citée : `https://www.payscale.com/research/US/Job=Appointment_Setter/Salary` (lignes 46-47) | vérifié (relu sur PayScale le 20/10/2026 : $16.08 de moyenne, $13 à $21, commission $9k à $15k, mise à jour du 12 mai 2026) |

Limites de P14 : PayScale s'appuie sur **76 profils** seulement, et l'intitulé « Appointment Setter » couvre aussi les setters au téléphone, pas seulement les setters en DM.

---

## Idée 11 · Le prix qui fait fuir

**Faits à utiliser** : P12 (le prix depuis le playbook), P6 (une question à la fois), P7, P10, P8 (jusqu'à 3 relances dans les 24 h).

- Le hook « If 9 out of 10 leads ghost after you send your price » décrit **la situation du lecteur**, pas une statistique. Aucune source ne donne un taux de fuite après le prix. Niveau : non trouvé, à garder comme miroir (forme 4 du fondateur).
- Formulation sûre du produit : "It answers the price from your playbook, then asks one question to keep the chat going." Niveau : en partie (P12 + P6).

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| rd91 | oui | Oui : « ghosted after I sent my rates » (coach). |
| rd13 | oui | Oui pour « Asked for the price and disappeared », mais c'est une **agence de design** qui vend par DM, pas un coach. |
| rd14 | oui | **Écart** : contexte de **prospection à froid** d'une agence marketing. On ne garde que la réaction au prix (« let me think about it »), jamais le contexte (règle 8, inbound seulement). |
| rd88 | oui | En partie : ghosting après une demande, pas spécialement après le prix. |
| rd97 | oui | **Écart** : après des **séances d'essai gratuites** (« free tasters »), pas après un prix envoyé en DM. Utilisable pour « they'll go home and think », pas pour le prix. |

---

## Idée 12 · Le coaching gratuit en DM

**Faits à utiliser** : P10 (réponse utile pour ceux qui ne collent pas), P6, P7, P9 (l'agenda seulement pour les bons).

- Formulation sûre : "It checks fit first. Leads who don't fit get a helpful answer, like your free guide, instead of your calendar." Niveau : vérifié (P10 ; l'exemple du guide gratuit vient de la démo du site).
- Le hook « 5 hours of free coaching » est la situation du lecteur, pas un chiffre sourcé.

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| rd93 | oui | Oui : « break down his entire program », puis il va « think about it ». **Petit écart** : `ligne-edito.md` écrit « I'll think about it » ; l'original dit he'll "think about it". Entre guillemets, on écrit "think about it". |
| rd92 | oui | Oui : « what feels like free consulting ». |
| rd89 | oui | Oui : du temps passé sur des gens jamais sérieux. |
| rd49 | oui | Oui : des ados qui ne peuvent pas payer (coach fitness en ligne). |
| rd50 | oui | Oui, nuance : ils ne **veulent** pas payer (pas « ne peuvent pas »). |
| rd76 | oui | Oui : la communauté à 30 $ par mois pour ceux qui n'ont pas le budget (la logique de P10). |

---

## Idée 13 · Le setter à 600 $ par mois

**Faits à utiliser** : P1 (119 $), P4 et P5 (la réponse part pendant que le lead est encore dans la conversation), P11 et P11b (une personne reprend), P14 (fourchette PayScale si on parle de coût).

- « 600 $ par mois plus 5 % de commission » : **aucune source**. C'est une situation de lecteur (idée du fondateur). Le site cite une seule offre d'emploi de setter en DM à « $1,500/mo, 7 days a week » et « 5% on deals from calls booked » (`site:src/content/guides/ai-vs-human-appointment-setter.ts:250-256`, une offre OnlineJobs.ph, pas une moyenne). Niveau : non trouvé comme prix du marché.
- « La réponse part 3 h après » : scénario, aucune source. On l'écrit au conditionnel ou comme une situation (« when the reply goes out 3 hours later »), jamais comme un fait sur les setters.
- Formulation sûre : "ManySetter answers while the lead is still in the chat, in your voice, and a person on your team takes over when it matters. It costs $119 a month per live setter." Niveau : vérifié (P1, P4, P11).
- Comparaison de prix honnête : "$600 a month at $13 to $21 an hour is about 29 to 46 hours of work." Calcul de Claude à partir de PayScale (600 / 21 = 28,6 ; 600 / 13 = 46,2). Niveau : en partie (calcul, pas une source).

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| rd06 | oui | Oui : les leads partent chez celui qui répond en premier. |
| rd19 | oui | Oui, mais **boutique Instagram**, hors coaching. |
| rd63 | oui | Oui : une réponse tardive ne reçoit plus de réponse (entreprise de service). |
| cl027 | oui | **Écart de statut** : voix d'agence dans un post promotionnel. Inspiration seulement (règle 6), jamais comme la voix d'un client. |
| cl056 | oui | Oui : des setters qui viennent et partent. Vient d'un avis 5★ sur un outil concurrent : ne jamais nommer l'outil. |
| cl057 | oui | Oui : plus de 10 000 $ de commissions par mois pour une équipe. Anecdote, pas une statistique (règle 7). |

Aucun de ces verbatims ne parle d'un délai de 3 h ni d'un salaire de 600 $.

---

## Idée 14 · Les pubs vers les DM

| # | Formulation sûre (EN) | Source | Niveau |
| --- | --- | --- | --- |
| A1 | "In Ads Manager, Meta calls it Messaging conversations started. It counts people who messaged you after your ad, for the first time or after 7 days of silence." | Meta Business Help Center, https://www.facebook.com/business/help/2038363993156008 (nom exact : « Messaging conversations started ») | vérifié |
| A2 | "A conversation started only means the lead sent a message. It doesn't tell you if anyone answered." | Lecture de la définition A1 (la métrique compte les comptes qui vous ont écrit) | vérifié pour la définition ; la phrase est une lecture logique |
| A3 | Limites de la métrique : elle exclut les pubs diffusées vers ou depuis l'Europe et le Japon ; sur WhatsApp, elle ne compte que les conversations ouvertes par un clic sur la pub. | même page | vérifié |
| A4 | "Meta's click to message ads open a chat with your business on Messenger, Instagram or WhatsApp." | https://www.facebook.com/business/ads/click-to-message-ads | vérifié |
| A5 | "After a click to message ad, Meta gives you up to 7 days to reply, counted from the lead's first message." | Meta, Send a message : https://developers.facebook.com/documentation/business-messaging/messenger-platform/send-messages ; Instagram : https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api | vérifié |
| A6 | "Manychat can start an automation when someone clicks your Instagram or Facebook ad." | Manychat, Instagram Ads Trigger (mis à jour le 27/08/2026) : https://help.manychat.com/hc/en-us/articles/14281321942428-Instagram-Ads-Trigger ; Facebook Ads Trigger : https://help.manychat.com/hc/en-us/articles/14281372007196-Facebook-Ads-Trigger | vérifié |
| A7 | Détails Manychat : le premier message doit avoir au moins un bouton ou une réponse rapide ; sur Instagram, la personne ne devient contact qu'après un clic ou une réponse ; le déclencheur Instagram ne marche qu'avec les pubs créées dans le Gestionnaire de publicités (pas les publications boostées), en campagne Traffic, Engagement ou Sales. | Instagram Ads Trigger, même page | vérifié |
| A8 | "Your Manychat flow keeps the ad trigger and sends the first message. The setter takes over when the lead replies." | Brief, section 2 ; site : « An ad, a comment or a direct message starts your Manychat flow » (`site:src/content/facebook-messenger-automation.ts:192`) | en partie (le site le dit sur la page Messenger ; le mécanisme général est l'action « Start conversation » du brief) |
| A9 | Déclencheur de pub WhatsApp dans Manychat | non cherché en détail | non trouvé : ne pas promettre WhatsApp pour ce post sans vérifier |

- Le hook « even with 300 conversations started » reprend le **vrai nom de la métrique** (A1) : c'est un chiffre de situation du lecteur, à ne pas présenter comme une moyenne.

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| cl007 | oui | **Écart** : la moitié de l'audience de la pub ne reçoit aucune réponse parce que **les demandes de message ne déclenchent pas l'automatisation** (thème T13). Ce n'est pas un problème de délai, et ManySetter ne change rien aux demandes de message (règle 5). Émotion seulement. |
| cl028 | oui | Oui : beaucoup de clics sur la pub sans vrai besoin (menuiserie). |
| rd42 | oui | En partie : temps de réponse trop lents avec une boîte gérée à la main, mais les leads viennent du **contenu**, pas des pubs. |
| mc36 | oui | **Écart** : « 280 sends and 140 clicks but not one sale » parle de **liens envoyés après un commentaire** (affiliation), pas de pubs. |
| mc37 | oui | **Écart** : « paying monthly for this » vise l'abonnement **Manychat**, pas Meta. Ne pas l'utiliser sous « you paid Meta », et jamais contre Manychat (règle 3). |

---

## Idée 15 · La relance

**Faits à utiliser** : P8, P8b, P8c (il peut envoyer les relances écrites par le coach), P8d, P8e, P8f.

- Formulation sûre : "Write your 3 follow-ups once. The setter sends them for you, between 1 and 23 hours after the lead's last message, and stops the moment they reply or book." Niveau : vérifié (P8, P8b, P8c).
- Pour la peur d'avoir l'air « pushy » : "Each follow-up asks one question at most, with no guilt trip." Niveau : vérifié pour les relances écrites par l'IA (P8f). Si le coach écrit lui-même ses relances, c'est son texte qui part.

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| rd86 | oui | Oui : relancer « comes off desperate ». |
| rd98 | oui | Oui : ne pas vouloir être « pushy ». Contexte : relance de gens qui ont interagi, on garde l'émotion seulement. |
| rd09 | oui | Oui : combien de relances avant de laisser tomber. |
| rd48 | oui | Oui : relancer ou laisser filer. |
| mc47 | oui | Oui : la conversation qui prend la poussière. Voix proche des agences (forum Manychat, idée de fonction). |

---

## Idée 16 · La règle des 24 heures

| # | Formulation sûre (EN) | Source | Niveau |
| --- | --- | --- | --- |
| R1 | "When a lead messages you on Instagram or Messenger, a 24-hour window opens. Inside it, you can reply freely, even with an offer." | Meta, Messenger Platform and IG Messaging API policy : https://developers.facebook.com/docs/messenger-platform/policy/policy-overview (« For most user actions, it lasts 24 hours » ; les messages dans la fenêtre « may contain promotional content ») | vérifié |
| R2 | "Every new message from the lead restarts the 24 hours." | Manychat, Understanding messaging windows (mis à jour le 27/08/2026) : https://help.manychat.com/hc/en-us/articles/23358636027932-Understanding-messaging-windows (la fenêtre s'ouvre après la dernière interaction) ; WhatsApp, Meta : « the timer resets to 24 hours » (https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages) | vérifié (Manychat et WhatsApp le disent ; pour Instagram et Messenger, Meta dit seulement que chaque action du lead ouvre la fenêtre) |
| R3 | "After 24 hours, automated messages are no longer allowed." | Manychat, même page : envoyer des messages automatiques hors de la fenêtre « is not allowed under Meta's messaging policy » | vérifié |
| R4 | "For 7 more days, a person on your team can still reply by hand. Meta calls this the Human Agent tag, and it's for people, not bots." | Meta, Human Agent : https://developers.facebook.com/docs/features-reference/human-agent?locale=en_US (« within 7 days of a user's message », pour un problème qui ne se règle pas dans la fenêtre normale, exemple : le week-end) ; Meta, Send a message (« to manually respond ») ; Manychat, How to send messages outside the 24-hour and 7-day windows (mis à jour le 27/08/2026) : https://help.manychat.com/hc/en-us/articles/14281199732892 (« Automated messages are not allowed during the 7-day window », marche sur Instagram et Messenger, posé seul sur les messages envoyés à la main depuis l'Inbox) | vérifié |
| R5 | Côté app : le tag Human Agent demande la revue d'app de Meta et la vérification de l'entreprise. | Meta, Human Agent (même page) | vérifié (détail technique, utile seulement pour le tuto) |
| R6 | "Message tags can't carry promotions, like deals, offers, coupons or discounts." | Meta, Send a message ; Manychat, même article | vérifié |
| R7 | "Most of Meta's old message tags stopped working in 2026." | Meta, Send a message : à partir du 27/04/2026, les requêtes avec CONFIRMED_EVENT_UPDATE, ACCOUNT_UPDATE ou POST_PURCHASE_UPDATE reçoivent l'erreur 100. Manychat : Meta retire les Message Tags sur Messenger le lundi 9/02/2026. | en partie (les deux sources ne donnent pas la même date ; ne pas écrire de date) |
| R8 | Après 24 h, ce qui reste : sur Messenger, les Messenger Lists (avec l'accord préalable du contact) et les messages sponsorisés ; sur Instagram, les DM Lists sont fermées aux nouveaux comptes depuis février 2024 ; sur WhatsApp, seulement des modèles approuvés à l'avance. EN : "On WhatsApp, after 24 hours, you can only send a pre-approved template." | Meta policy (messages sponsorisés hors fenêtre, absents de l'API Instagram) ; Manychat, même article (Messenger Lists, DM Lists en pause depuis février 2024) ; Meta WhatsApp, Service messages (« you can only send pre-approved template messages ») | vérifié |
| R9 | "The 24-hour rule comes from Meta, not from Manychat." | Manychat, Understanding messaging windows (« These rules are set by Meta ») | vérifié |
| R10 | "Manychat won't send your scheduled automated messages once the 24 hours are up." | Manychat, même page | vérifié |
| R11 | Ce qui arrive si on triche : avertissements, envois bloqués un temps, Page Facebook dépubliée, compte Instagram désactivé. | Manychat, même page (renvoie à la page de Meta sur les restrictions) | vérifié (selon Manychat) |
| R12 | "Every ManySetter follow-up goes out inside the 24-hour window." | P8 ; marge de 10 minutes avant la fin de la fenêtre : `site:src/features/engine/lib/policy.ts:11-26` | vérifié |
| R13 | Exception à connaître : après une pub « click to message », la fenêtre peut durer jusqu'à 7 jours (A5). | Meta, Send a message | vérifié |

- Le hook « If you have 10,000 Manychat contacts and nobody buys » : situation du lecteur (mc17 parle de 13 000 contacts). Le lien de cause « nobody buys » n'est pas sourcé : le post explique pourquoi on ne peut plus leur écrire librement, pas pourquoi ils n'achètent pas.

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| mc17 | oui | Oui : 13 000 contacts Instagram dans Manychat, sans savoir quoi en faire. |
| mc18 | oui | Oui : « I cant even message them anymore » (sans apostrophe dans l'original, citation exacte dans `ligne-edito.md`). |
| mc30 | oui | Oui : relances hebdomadaires sur 4 semaines bloquées par la règle des 24 h. Nuance : « non-sales, relationship-based ». |
| cl047 | oui | **Écart de statut** : voix d'expert d'agence (règle 6). Le fond est juste (une réponse du lead rouvre les 24 h, R2), mais « find an excuse » ne se présente pas comme une astuce : on dit simplement que la conversation continue tant que le lead répond. |

---

## Idée 17 · Le setter maison avec Make et ChatGPT

### Ce que la documentation dit (noms exacts)

| # | Formulation sûre (EN) ou fait | Source | Niveau |
| --- | --- | --- | --- |
| K1 | "Make bills in credits. Most modules use one credit each time they run." | Make Help Center, Credits : https://help.make.com/credits (non-AI apps : un crédit par opération) | vérifié |
| K2 | "With your own OpenAI connection, you also pay OpenAI for every token." | même page (crédits comptés par opération, tokens payés au fournisseur) | vérifié |
| K3 | Les crédits ont remplacé les opérations le 27/08/2025, à raison de 1 pour 1. | Make Help Center, « Introducing credits » (résumé par la recherche web, page non relue en entier) | en partie |
| K4 | App **Webhooks** : modules « Custom webhook » (déclenche un scénario depuis un autre service) et « Webhook Response » (renvoie une réponse à l'appelant). | https://apps.make.com/gateway | vérifié |
| K5 | App **Manychat** (compte Manychat Pro et jeton d'API obligatoires). Déclencheur « Watch Incoming Data » : il part quand le lead **clique un bouton ou une réponse rapide** portant l'action « Trigger Make », pas sur un message libre. Actions : « Get Subscriber's info », « Manage Tags », « Perform an Action », « Send a Flow », « Send Messages », « Send a Text », « Send a Text with a File », « Send a Text with an Image », « Set a Custom Field ». Recherche : « Find Subscribers by a Custom Field ». | https://apps.make.com/manychat (mis à jour le 20/10/2026) | vérifié |
| K5b | Piège : « Send a Text » a un champ **Message Tag** obligatoire, « required from January 15th, 2020 ». Or Meta a retiré la plupart des tags en 2026 (R7). | même page | en partie (à tester avant d'en faire un tuto) |
| K6 | App **OpenAI (ChatGPT, Whisper)** : module « Generate a response » (champs « Instructions », « Conversation ID », « Create a new conversation », « Previous Response ID »), module « Generate a completion », module « Simple text prompt » (sans compte OpenAI). | https://apps.make.com/openai-modules (mis à jour le 20/10/2026) | vérifié |
| K7 | App **Instagram for Business (Facebook login)** : modules d'événements, de statistiques, de publications, de commentaires et de stories. **Aucun module pour lire ou envoyer un DM.** Compte Instagram business relié à une Page Facebook ; comptes créateur non pris en charge. | https://apps.make.com/instagram-business | vérifié (à la date du 20/10/2026) |
| K8 | Côté Manychat : l'action **External Request** (Dev Tools, certains plans payants) envoie une requête HTTPS (POST, GET, PUT, DELETE) avec les données du contact, et peut ranger la réponse dans des champs personnalisés. | https://help.manychat.com/hc/en-us/articles/14281285374364-Dev-Tools-External-request (mis à jour le 17/02/2026) | vérifié |
| K9 | Le module Sleep de Make met un scénario en pause **300 secondes au plus**. Pour attendre plus, Make conseille deux scénarios et un data store. | Make Help Center, Tools (lu par la recherche web) | en partie |

### Les vraies étapes d'un setter maison (assemblage de briques documentées)

Formulation sûre pour le tuto, niveau **en partie** (chaque brique est documentée, l'assemblage est le nôtre et n'a pas été testé) :
1. "In Manychat, add an External Request to your Default Reply. It sends the lead's message to a Make Custom webhook." (K8, K4)
2. "In Make, a Generate a response module writes the reply with your instructions." (K6)
3. "Make sends the reply back with Webhook Response, and Manychat posts it in the chat." (K4, K8 : la réponse est rangée dans un champ, puis envoyée par le flow)
4. "To give it memory, save each lead's Conversation ID in a Manychat custom field and send it back every time." (K6, K5 « Set a Custom Field »)

Non vérifié : le délai maximal qu'une External Request de Manychat attend avant d'abandonner (une réponse d'OpenAI lente pourrait le dépasser).

### Ce qu'un tel scénario ne fait pas tout seul

| Point | Ce qui est documenté | Ce qui est déduit | Niveau |
| --- | --- | --- | --- |
| Attendre la fin du message | Rien dans ces modules. Sleep met une seule exécution en pause (K9). | Chaque message du lead envoie sa propre requête, donc lance sa propre exécution : trois bouts de message, trois réponses, sauf logique maison avec un data store. | non trouvé (déduction) |
| Mémoire de la conversation | Le champ « Conversation ID » existe (K6). | Elle ne se branche pas seule : il faut stocker l'identifiant par lead et le renvoyer à chaque message. Sans ça, chaque message est traité sans contexte. | en partie |
| Qualifier, une question à la fois | Rien de spécifique. | Tout passe par le prompt, à écrire et à tester soi-même. | non trouvé (déduction) |
| Réserver un appel | Rien dans ces trois apps. | Il faut ajouter une app d'agenda et sa logique (non vérifié). | non trouvé |
| Relancer après quelques heures | Sleep plafonne à 300 s ; au-delà, deux scénarios et un data store (K9). | Il faut aussi suivre soi-même la fenêtre de 24 h (R3). | en partie |
| Passer la main à un humain | Rien dans ces modules. | Rien n'empêche le bot de répondre par-dessus un humain (douleur déjà dans les verbatims mc41, mc21). | non trouvé (déduction) |
| Coût | Crédits Make par exécution (K1), tokens OpenAI à part (K2), Manychat Pro pour l'API (K5). | | vérifié |

Formulation sûre de la chute : "The model isn't the setter. Waiting, memory, fit questions, booking, follow-ups and handoff are all yours to build and maintain." Niveau : en partie (s'appuie sur le tableau ci-dessus).

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| rd67 | oui | Oui : « another thing to maintain ». Retirer les noms d'outils de la citation (note de la base). |
| mc24 | oui | **Écart** : parle de l'**AI Step de Manychat**, pas d'un montage Make + ChatGPT. Jamais attribué à Manychat (règle 3) ; on l'écrit comme « my AI ». |
| mc22 | oui | **Écart** : même chose, l'IA de Manychat qui répond trop vite. |
| mc23 | oui | **Écart** : même fil (peu ou pas de mémoire), à propos de l'IA de Manychat. |
| mc34 | oui | Oui : quelqu'un qui a construit son propre setter IA ; il ne dit pas qu'il a utilisé Make. |

---

## Idée 18 · L'IA qui répond en 2 secondes

**Faits à utiliser** : P4, P5, P6, P7, P13.

- Formulation sûre : "It waits until the lead has finished typing, reads every message, then sends one reply with one question at most." Niveau : vérifié (P4, P6).
- "It never replies sooner than 30 seconds after the lead's last message." Niveau : vérifié (`policy.ts:28-34`, `config.ts:186-190`).
- Le hook « If your AI replies in 2 seconds » : situation du lecteur. Ne jamais retourner l'argument en « ours is faster ».

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| mc22 | oui | Oui : la réponse instantanée, plainte n°1. Vise l'IA de Manychat : écrire « my AI » (règle 3). |
| cl095 | oui | Oui : les réponses instantanées font automatique. |
| mc19 | oui | Oui : répondre tout de suite, c'est trop rapide. |
| mc10 | oui | Oui : les gens écrivent en plusieurs bouts. |
| mc11 | oui | Oui : redemander une info déjà donnée. |
| rd61 | oui | Oui, avec prudence : objection à la réponse à 2 h du matin. Par défaut, ManySetter répond à toute heure (P13) : ne pas s'en servir pour dire que le setter attend les heures de bureau, sauf accord du fondateur sur le réglage « When it replies ». |

---

## Idée 19 · Setter humain ou setter IA

**Faits à utiliser** : P1, P2, P14, P11, P11b.

| # | Formulation sûre (EN) | Source | Niveau |
| --- | --- | --- | --- |
| H1 | "PayScale puts a US appointment setter at $13 to $21 an hour in base pay, plus $9k to $15k a year in commission." | P14 | vérifié |
| H2 | "Full time at $13 to $21 an hour is roughly $2,250 to $3,640 a month, before commission." | Calcul de Claude : 40 h × 52 semaines / 12 = 173 h par mois | en partie (calcul) |
| H3 | "ManySetter costs $119 a month per live setter, with 1,500 AI replies included." | P1, P2 | vérifié |
| H4 | "A person is still better at the hard cases, the sales call, high-value deals and spotting new objections." | Site, « What a person does best » : `site:src/content/guides/ai-vs-human-appointment-setter.ts:299-340` | vérifié |
| H5 | "Best of both: the AI answers, qualifies and books. A person takes the hard cases and the call." | `site:src/content/guides/ai-vs-human-appointment-setter.ts:132` | vérifié |

**Piège du quota** : « 30 DMs a day » peut vouloir dire 30 nouveaux leads par jour. Avec 4 ou 5 messages du setter par conversation, relances comprises, cela fait de 3 600 à 4 500 réponses par mois, bien au-delà des 1 500 incluses (options à 39 $ les 500 de plus, P2). Calcul de Claude. Avant d'écrire « $119 for 30 DMs a day », on compte les réponses ; sinon on écrit le prix sans le rattacher au volume.

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| cl056 | oui | Oui : des setters qui viennent et partent (avis 5★ d'un outil concurrent, ne jamais le nommer). |
| cl057 | oui | Oui : plus de 10 000 $ de commissions par mois pour une équipe ; anecdote. |
| cl058 | oui | **Écart** : « he completely disappeared » parle d'un **closer** recruté par une agence (3 000 $ de frais), pas d'un setter. Utilisable pour la douleur « il a disparu », sans dire « setter ». |
| rd35 | oui | Oui : confier ses conversations de vente à quelqu'un d'autre. |
| cl123 | oui | En partie : « tired of training a human setter » vient d'un **avis 5★ sur un setter IA concurrent**. En pensée à la 1re personne seulement, jamais comme un avis. |
| rd72 | oui | **Écart** : ce qu'une personne serait prête à payer (« 1-2k/month if the person is good enough at closing ») en 2019, pas un prix du marché. |

À noter : la base contient aussi « 30 DMs a day » (cl051), mais c'est une offre d'emploi de **prospection sortante** payée en roupies : ne pas s'en servir pour ce hook.

---

## Idée 20 · La tête d'un lead chaud

### Les références (vérifiées)

| # | Référence | Source | Niveau |
| --- | --- | --- | --- |
| L1 | Loewenstein, G. (2005). Hot-cold empathy gaps and medical decision making. *Health Psychology*, 24(4, Suppl.), S49-S56. doi:10.1037/0278-6133.24.4.S49 | Europe PMC, PMID 16045419 (résumé lu) | vérifié |
| L2 | Van Boven, L., & Loewenstein, G. (2003). Social projection of transient drive states. *Personality and Social Psychology Bulletin*, 29(9), 1159-1168. doi:10.1177/0146167203254597 | Crossref (résumé lu) | vérifié |
| L3 | Loewenstein, G., O'Donoghue, T., & Rabin, M. (2003). Projection bias in predicting future utility. *Quarterly Journal of Economics*, 118(4), 1209-1248. doi:10.1162/003355303322552784 | Crossref, RePEc (résumé lu) | vérifié |
| L4 | Loewenstein, G. (1996). Out of control: Visceral influences on behavior. *Organizational Behavior and Human Decision Processes*, 65(3), 272-292. doi:10.1006/obhd.1996.0028 | Crossref (référence seulement, texte non lu) | vérifié (référence) |
| L5 | Read, D., & van Leeuwen, B. (1998). Predicting hunger: The effects of appetite and delay on choice. *Organizational Behavior and Human Decision Processes*, 76(2), 189-205. doi:10.1006/obhd.1998.2803 | Europe PMC, PMID 9831521 (résumé lu) | vérifié |

### Ce que disent vraiment ces travaux

- **L1** : quand on est « à froid », on sous-estime l'effet qu'un état « chaud » (envie, faim, douleur, peur) aura sur ses propres choix ; quand on est « à chaud », on croit que ses préférences du moment vont durer. Le même écart joue entre deux personnes : celui qui est calme sous-estime l'effet d'un état chaud sur l'autre.
- **L3** : la projection : on exagère à quel point nos goûts de demain ressembleront à ceux d'aujourd'hui.
- **L2** : on prédit ce que ressentent les autres à partir de son propre état du moment (des gens assoiffés par le sport jugeaient la soif plus pénible pour des randonneurs perdus).
- **L5** : des participants affamés ont choisi plus d'en-cas malsains pour la semaine suivante que des participants rassasiés.

Formulations sûres (EN) :
- "Psychologists call it the hot-cold empathy gap. When we're calm, we underestimate how much a strong feeling drives our choices." Niveau : vérifié (L1).
- "And in the heat of the moment, we think we'll still feel the same tomorrow." Niveau : vérifié (L1, L3).
- "In one study, hungry people picked more junk food for next week than people who had just eaten." Niveau : vérifié (L5).

### Jusqu'où on peut l'appliquer à un lead qui refroidit

- Ces travaux portent sur des états **viscéraux ou affectifs** (faim, soif, douleur, excitation, peur), en laboratoire ou en santé. **Aucune de ces études ne porte sur un prospect en DM** ni sur une vente.
- Lecture honnête, à présenter comme une lecture et pas comme un résultat : "That's a good way to read a lead who said 'this is exactly what I need' and went quiet. In the DM they felt it. The next day, they don't feel it the same way." Niveau : en partie (application par analogie).
- Le versant le plus solide pour le post : à chaud, le lead croit qu'il voudra toujours la même chose demain (L1, L3), donc « let me think about it » lui paraît sans risque.
- Ce n'est pas la seule cause : les verbatims donnent aussi l'oubli (rd84), la peur du conflit (rd87), le budget. Le post ne doit pas faire de l'écart chaud-froid l'unique explication.
- Rien ne dit **combien de temps** un lead met à refroidir : aucune durée ne s'écrit.

### L'étude sur le temps de réponse aux leads (HBR 2011)

| Point | Contenu | Niveau |
| --- | --- | --- |
| Référence | Oldroyd, J. B., McElheran, K., & Elkington, D. (2011). The Short Life of Online Sales Leads. *Harvard Business Review*, 89(3), p. 28. https://hbr.org/2011/03/the-short-life-of-online-sales-leads | vérifié (page HBR et notice BYU ScholarsArchive) |
| Ce qu'elle mesure | Un audit de 2 241 entreprises américaines (délai de réponse à un lead de test envoyé par formulaire web) : 37 % répondent en moins d'une heure, 16 % entre 1 et 24 h, 24 % après plus de 24 h, 23 % jamais ; 42 h en moyenne chez celles qui répondent sous 30 jours. Puis 1,25 million de leads reçus par 42 entreprises (29 B2C, 13 B2B) : celles qui tentent un contact dans l'heure ont près de 7 fois plus de chances de « qualifier » le lead que celles qui attendent une heure de plus, et plus de 60 fois plus que celles qui attendent 24 h ou plus. « Qualifier » veut dire avoir une vraie conversation avec un décideur. | en partie (article payant : chiffres lus dans la reprise de SmartCompany du 04/07/2011, https://www.smartcompany.com.au/marketing/20110704-are-you-letting-online-leads-go-cold/) |
| Limites | Leads de **formulaires web** en 2011, pas des DM ; corrélation, pas expérience ; un des auteurs dirige InsideSales.com, un éditeur de logiciels de vente (bio HBR) ; les écarts portent sur des **heures**, pas des secondes. | vérifié pour les limites visibles |
| Usage | Ne sert jamais à vendre la vitesse (brief, motifs 5 et 7). Au mieux, en légende : "Even back in 2011, Harvard Business Review found web leads go cold within hours." Mieux encore : ne pas l'utiliser et rester sur L1. | conseil |

**Faits produit pour la solution** : P9 et P9b (2 ou 3 créneaux dans son fuseau, Cal.com, Calendly payant, iClosed ; sinon le lien), P6, P7, P8.

**Verbatims cités**

| # | Existe | Dit bien ce qu'on lui fait dire ? |
| --- | --- | --- |
| rd47 | oui | Oui : « this is exactly what I need », puis il disparaît (coach en ligne). |
| rd78 | oui | Oui, et c'est le meilleur pour ce post : « excited and feel ready, and then get cold feet ». |
| rd97 | oui | Oui pour « go home and think » et « pay check » (contexte : séances d'essai, pas un DM). |
| rd84 | oui | Oui : trop occupés, ils oublient. |
| rd87 | oui | Oui : éviter la confrontation. |
| rd93 | oui | Oui : « think about it », puis plus rien. |

`ligne-edito.md` cite aussi le lien « book later » comme cause : aucun verbatim ne le dit, c'est une déduction.

---

## À ne pas écrire

Affirmations tentantes, mais fausses ou non sourcées :

1. "ManySetter replies instantly" ou "in seconds" : faux (30 s au moins après le dernier message, P4, P5) et interdit par le brief.
2. "After 24 hours, you can never message them again" : faux. Une personne peut encore répondre à la main pendant 7 jours (R4), WhatsApp garde les modèles approuvés, Messenger les listes avec accord (R8).
3. "The window is always 24 hours" : faux après une pub « click to message », jusqu'à 7 jours (A5, R13).
4. "The 24-hour rule is a Manychat rule" : faux, c'est Meta (R9).
5. "Use a message tag or the Human Agent tag to automate your follow-ups" : faux. Pas de messages automatiques sous Human Agent (R4), pas de promotion dans un tag (R6), la plupart des tags ont disparu en 2026 (R7).
6. "Messaging conversations started means people talked to your team" ou "qualified conversations" : faux, la métrique compte les gens qui vous ont écrit après la pub (A1, A2).
7. "300 conversations started, 0 replies" ou "9 out of 10 leads ghost after the price" présentés comme des statistiques : ce sont des situations de lecteur, aucune source.
8. "A setter costs $600 a month" comme prix du marché : non sourcé. La fourchette sourcée est PayScale (P14, 76 profils).
9. "$119 a month for 30 DMs a day" sans compter les réponses : peut dépasser les 1 500 réponses incluses (idée 19).
10. "Make has an Instagram DM module" : pas dans l'app officielle Instagram for Business (Facebook login) au 20/10/2026 (K7).
11. "ChatGPT in Make has no memory" : trop absolu. Le champ Conversation ID existe ; il faut le brancher soi-même (K6). On écrit "memory doesn't wire itself".
12. "Make charges per operation" : dépassé, Make facture en crédits (K1).
13. "Loewenstein proved leads go cold" ou "desire drops X% per hour" : aucune étude ne le dit (idée 20).
14. "Reply within 5 minutes and you're 100x more likely to reach the lead" : ce chiffre n'est pas dans l'article HBR de 2011, il vient d'une autre source non vérifiée ici, et il vend la vitesse.
15. "Human setters are unreliable" ou "lazy" : on ne dénigre jamais les setters (brief). cl058 parle d'un closer.
16. "Voice-note follow-ups play as audio on Instagram and WhatsApp" : faux, audio sur Messenger seulement (P8e).
17. "It books on any calendar", "Google Calendar" ou "Calendly Free" : faux. Cal.com, Calendly payant et iClosed ; sinon le lien (P9, P9b).
18. "It only replies during business hours" : par défaut il répond à toute heure (P13). Le réglage existe dans le code, à confirmer avec le fondateur avant d'en parler.
19. "ManySetter fixes message requests", "unblocks your automation" ou "keeps you from getting banned" : ManySetter ne change ni les déclencheurs de Manychat ni les règles de Meta (brief, règle 5 des verbatims). Vaut pour cl007.
20. "Manychat's AI is bad" ou toute phrase qui attribue mc22, mc23 ou mc24 à Manychat : règle 3 (rien contre Manychat).
21. "Manychat's ad trigger works with boosted posts" : faux (A7).
22. "A comment opens a 24-hour window to send anything" : Meta range le commentaire parmi les actions qui ouvrent la fenêtre, mais la réponse privée à un commentaire reste un seul message, dans les 7 jours. Trop ambigu pour un post.
23. "Harvard proved you must reply in the first minute" : l'étude HBR porte sur des heures, des formulaires web, en 2011, et ne mesure pas les DM.
24. "Find an excuse to message them at 23 hours to reset the window" présenté comme une astuce : la fenêtre ne rouvre que si le lead répond (R2), et on ne pousse pas à contourner les règles de Meta.
