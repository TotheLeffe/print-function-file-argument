# Cambiste — série de 14 films LinkedIn

Quatorze publicités de **15 secondes**, **1080 × 1350** (4:5), **30 ips**,
**450 images exactement**. Copie à l'écran en anglais, films muets.
Remotion (React + TypeScript), rendu déterministe.

**Livrables :** `out/cambiste-linkedin-01.mp4` … `-14.mp4` — H.264, `yuv420p`.

---

## La direction artistique

**Deux couleurs, un sens.** Le vert et le bleu sont tous deux des couleurs de
marque Cambiste. La série leur donne un rôle : le vert est le local africain,
le bleu l'international. Une image où les deux se touchent dit ce que fait
Cambiste sans avoir besoin d'une légende — et c'est la règle qui tient toute
la série.

**Une géographie vraie.** `src/geo.ts` est **généré** à partir des données
Natural Earth (domaine public) du paquet `world-atlas` : les 54 pays
d'Afrique sont fusionnés par `topojson.merge`, ce qui efface les frontières
internes, puis projetés deux fois — azimutale équivalente de Lambert pour la
carte, orthographique pour le globe, graticule compris. Aucune côte n'est
dessinée à main levée. Le continent est montré d'un seul tenant, sans
frontière, sans ville, sans pays nommé : la série ne revendique de présence
nulle part.

**Un mobilier dessiné.** Téléphone, institution, compte, couche
d'orchestration, entreprise, nœud de réseau, pastille de valeur. Ce sont des
illustrations conceptuelles — jamais des captures de produit, jamais un
chiffre, jamais un logo tiers.

**Une mise en scène par film.** Caméra, lueur, message et trois coupes
(volet, poussée, iris) forment les seuls outils de composition. Chaque film a
son découpage et son enchaînement : aucun n'a le même montage, ce que le
contrôle A5 vérifie.

## Le rythme

Cinq plans par film, de 60 à 120 images. Le message entier paraît en 8 images
(0,27 s), puis **ne bouge plus d'un pixel** jusqu'à sa sortie, 6 images avant
la coupe. Les transitions ne sont jamais comptées comme du temps de lecture.
Entre 15 et 25 mots visibles par film.

Deux points trouvés en mesurant le rendu, et non en relisant le code :

- **Les films sont rendus sur un seul onglet** (`--concurrency=1`). Remotion
  répartit sinon les images sur plusieurs onglets, et Chromium ne rastérise
  pas un même texte au même sous-pixel d'un onglet à l'autre : les images
  d'un plan alternaient entre deux rastérisations — 7 000 pixels d'écart une
  image sur deux.
- **La transformation du bloc de texte est retirée** une fois la phrase
  posée, et non mise à zéro : un `transform` résiduel promeut le bloc en
  couche composée sans aucune raison.

## Exactitude commerciale

Rien à l'image ne nomme un partenaire, un prospect ou un client. Aucun
chiffre : ni volume, ni tarif, ni valorisation. Aucune promesse de vitesse,
de prix, de couverture géographique ou réglementaire. Les capacités en
construction se disent « building », « designed to », « toward ». Les mots
interdits sont dans la liste noire de `scripts/verify.mjs`, qui refuse la
série s'ils apparaissent.

## Commandes

```bash
npm install
npm start                       # Remotion Studio
npm run render                  # les 14 -> out/
node scripts/render-all.mjs 03  # un seul
npm run verify -- --render      # les six contrôles, puis les MP4 rendus
npm run typecheck
```

## Structure

```
src/config.ts        charte, grille, échelle typographique, rythme
src/geo.ts           GÉNÉRÉ depuis Natural Earth — ne pas éditer
src/brand.ts         actifs de marque officiels — généré
src/lib/anim.ts      easings, progressions, trajets
src/lib/Stage.tsx    caméra, lueur, message, coupes, calque de dessin
src/art/             le mobilier : objets, carte, parcours, logo, fin
src/films/01…14.tsx  un fichier par film : son découpage, sa mise en scène
scripts/             rendu et contrôles
```

## Points à connaître

**cambiste.app n'a pas pu être consulté** — la politique réseau de la session
refuse le domaine. Le branding vient des actifs officiels du dépôt.

**Les films sont muets**, ce qui reste cohérent avec une diffusion LinkedIn où
la lecture démarre sans son. Chaque film se comprend sans bande-son.
