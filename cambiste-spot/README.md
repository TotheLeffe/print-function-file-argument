# Cambiste — série de spots LinkedIn

Six films carrés (1080×1080, 30 fps, muets) bâtis sur **un seul langage
visuel**, produits par un moteur commun. Ajouter un spot à la série coûte un
fichier de quatre-vingts lignes, pas un nouveau projet.

**Positionnement central :** *Mobile Money → Global Banking System.*

> Mobile Money is already Africa's financial interface.
> Cambiste connects it to the rest of the world.

---

## La série

| # | Fichier | Durée | Une idée, une seule |
|---|---|---|---|
| 01 | `cambiste-01.mp4` | 25,0 s | **Manifeste.** 1,5 milliard de comptes existent déjà, mais restent locaux. Cambiste les relie au système bancaire mondial. *C'est le spot de vision — celui à produire en premier.* |
| 02 | `cambiste-02.mp4` | 23,5 s | **Aux opérateurs.** Vos clients ont déjà un wallet. Et s'il pouvait devenir mondial ? |
| 03 | `cambiste-03.mp4` | 21,0 s | **À contre-pied.** L'Afrique n'a pas un problème d'adoption, elle a un problème de connexion. |
| 04 | `cambiste-04.mp4` | 20,0 s | **Conformité.** Un paiement transfrontalier demande plus qu'une API. Se réutilise en pièce d'après-contact. |
| 05 | `cambiste-05.mp4` | 19,0 s | **Infrastructure.** Plusieurs opérateurs entrent, un monde de rails sort. Cambiste n'est pas une application de transfert. |
| 06 | `cambiste-06.mp4` | 21,5 s | **Vision.** Imaginez cent millions de wallets connectés. Le spot de personal branding du fondateur. |

Soit **130 secondes** de matière, déclinables en publications texte et en
schémas fixes — une idée produit trois ou quatre contenus.

## Ligne éditoriale

Quatre règles, qui valent autant pour les prochains spots que pour ceux-ci.

1. **Un spot, une idée.** Ne jamais essayer d'expliquer tout Cambiste dans une
   vidéo. Chaque film porte une seule friction du paiement africain et s'arrête
   là.
2. **Parler connexion, infrastructure, conformité, accès mondial** — jamais
   crypto, jamais la plomberie technique. Le produit devient beaucoup plus
   simple à comprendre.
3. **Moins de texte par écran, plus de temps par écran.** Trois à quatre
   secondes minimum pour un message important. C'est ce qui donne un rendu
   premium et rend le contenu réellement lisible dans un fil LinkedIn.
4. **Commencer par une accroche qui retient le défilement** — une donnée, une
   question, ou une phrase à contre-pied.

## La règle de montage

**Aucun écran ne se coupe avant que sa composition soit complète depuis environ
une seconde.** C'est cette seconde d'assimilation, et non le temps d'animation,
qui dimensionne chaque plan. Les écrans qui *expliquent* — un schéma, une liste
de contrôles — pèsent systématiquement le double d'une accroche.

Les **volets** entre plans durent 0,50 à 0,67 s et suivent une courbe
d'accompagnement quadratique : le mouvement est ample plutôt que sec. Un volet
se déroule au début du plan qu'il révèle, pendant que le plan sortant reste
figé ; l'allonger ne rallonge donc pas le film.

## Le langage visuel

Repris du teaser **Wero × BoursoBank** donné en référence — aplats pleins,
typographie cinétique en très gros corps, aucune photographie, confettis sur la
signature — mais **appliqué à la charte Cambiste**, et à un rythme plus lent :
Wero n'a rien à expliquer, il annonce.

**Les fonds ne prennent que quatre valeurs, toutes blanc ou vert.** Aucun aplat
sombre. Les couleurs vives vivent dans la typographie et les détails.

| Rôle | Valeur | Emploi |
|---|---|---|
| Blanc | `#FFFFFF` | accroches et signature |
| Vert Cambiste | `#0AB064` | aplat signature, temps forts |
| Vert pâle | `#E8F6EF` | fond des schémas — vert de marque éclairci |
| Vert profond | `#055731` | plans de chute — vert de marque assombri |
| Encre | `#0B0B0C` | titres |
| Bleu | `#2361EA` | la valeur en mouvement (jeton, sorties) |
| Vert clair | `#7FD9AE` | filets et flèches sur vert profond |

**Pas d'or, pas d'ornement.** Une version antérieure ponctuait chaque temps
fort d'étoiles dorées scintillantes, sur fonds verts, et terminait sur des
confettis dorés. Chaque élément se défendait isolément ; ensemble, **vert + or
+ étoiles + confettis** produisait une lecture de fête de fin d'année, à
l'opposé du registre voulu. Le semis d'étoiles a été supprimé, l'or a quitté la
palette, et les confettis de signature sont revenus aux seules couleurs de
marque.

La règle qui en découle : **le mouvement porte l'énergie, pas l'ornement.**
Les titres qui se construisent mot à mot, le jeton qui traverse le rail, la
carte Cambiste qui tressaille à son passage, les coches qui tombent une à une —
c'est là que vit la vivacité du film, et rien de tout cela ne coûte un signal
visuel parasite.

Les **lignes de chute** se posent en blanc sur vert profond (8,7:1), soulignées
d'un filet vert clair. Ce fond leur donne une identité distincte du vert vif
employé ailleurs.

**Les titres se construisent mot à mot**, chaque mot montant derrière son propre
masque avec un décalage et un léger rebond. Les textes secondaires montent de
quelques pixels au lieu d'apparaître sur place.

## Le moteur

```
engine/engine.js   la charte, la typographie animée, les blocs, le montage
engine/brand.js    actifs de marque générés — ne pas éditer à la main
spots/01.js … 06   un fichier par spot : durées, fonds, contenu
spot.html          chargeur — spot.html?spot=03
fonts/             Outfit (variable, sous-ensembles latin et latin-ext)
render.py          capture image par image puis encodage H.264
preview.py         planche de contrôle
tools/             extraction des actifs depuis la vidéo de marque
```

Un spot ne décrit que son contenu ; le moteur tient tout le reste :

```js
window.SPOT = { name: '…', scenes: [
  { name: 'accroche', sec: 4.5, bg: 'white',
    draw: l => E.headline(['ONE LINE.', 'THEN ANOTHER.'], M, 500, 110,
                          { w: 800, tr: -3, color: C.ink }, l, 8, 13, 17) },
  { name: 'schema', sec: 6.0, bg: 'mint', tin: 20, wipe: 'right',
    draw: l => { … E.card(…); E.rail(…); E.token(…); } },
  E.closer(['WE BUILD THE BRIDGE.'], 3.5),
  E.signature(3.0)
]};
```

**Les bornes de plans sont dérivées des durées**, jamais saisies deux fois.
C'est délibéré : les avoir écrites à deux endroits avait laissé, dans une
version antérieure, tous les plans démarrer avec leur animation déjà terminée —
les textes apparaissaient posés au lieu de s'animer, sans que rien ne le
signale.

### Vocabulaire de schéma

`card` `rail` `token` `arrowDown` `arrowRight` `check` `counter` `fanIn`
`network` — plus `headline` `revealWords` `textRise`
`burst` `lockup`, et les deux plans communs `closer` et `signature`.

### Ajouter un spot

1. Copier `spots/03.js` sous un nouveau numéro.
2. Réécrire les textes et les durées. Une phrase importante : 3 à 4 s.
3. `python3 preview.py --spot 07` — la planche prend deux images par plan, une
   en pleine animation et une en tenue, ce qui montre d'un coup d'œil qu'un
   plan **s'anime** et qu'il **se pose**.
4. `python3 render.py --spot 07`.

## Charte respectée

Tous les actifs et toutes les couleurs sont **extraits de la vidéo de marque
officielle**, jamais approximés : le logotype en masque alpha 494×85 natif
(teinté noir ou blanc), la marque en vectoriel — carré en superellipse ajustée
sur le profil mesuré, glyphe tracé dont le second lobe est la rotation exacte du
premier —, et les couleurs relevées sur les aplats.

Deux points à signaler :

- **Le logotype utilise une police propriétaire.** Aucune police libre ne
  correspond (meilleur recouvrement testé sur dix-huit candidates : 0,70). Il
  est donc employé tel quel, en image, jamais recomposé, et jamais affiché
  au-delà de sa taille native.
- **La typographie de support est Outfit**, la plus proche du logotype parmi
  les libres. À remplacer par la police de la charte si elle est disponible :
  un seul `@font-face` à changer dans `spot.html`.

## Ripple

Les spots **ne mentionnent pas Ripple**. Le document d'architecture qui les
accompagne est un projet à valider (« Draft v2 – Cambiste Proposal ») :
annoncer publiquement un partenariat non signé serait prématuré. Les arguments
d'infrastructure sont formulés côté bénéfice client :

> No blockchain to operate. No pre-funded accounts abroad.

Une fois le partenariat acté, un co-marquage s'ajoute au plan de schéma sans
retoucher le reste.

## Version française

`cambiste-fr-24s.mp4` est le film français de 24,5 s produit avant la série, à
partir de `spot-fr-24s.html` — autonome, antérieur au moteur, conservé tel
quel. `cambiste-spot-15s.mp4` en est le montage court de 15 s, pour un usage de
notoriété pure ; il se régénère depuis le commit `7cb9669`.

## Reconstruire

```bash
pip install playwright imageio-ffmpeg pillow numpy potracer fonttools brotli
python3 render.py --all                       # toute la série
python3 render.py --spot 01                   # un seul spot
python3 render.py --page spot-fr-24s.html --out cambiste-fr-24s.mp4
python3 preview.py --spot 01                  # planche de contrôle
python3 tools/extract_brand.py <video.mov>    # régénère engine/brand.js
```

`spot.html?spot=01` s'ouvre aussi dans un navigateur ; `play()` dans la console
lance la lecture en temps réel.

L'animation est **déterministe** : `renderFrame(n)` dessine intégralement
l'image `n` sans dépendre de l'horloge. La capture pilote donc le temps au lieu
de le subir, et deux rendus successifs sont identiques au pixel près.
