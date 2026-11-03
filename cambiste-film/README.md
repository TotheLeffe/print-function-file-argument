# Cambiste — « Make the connection. »

Film de marque de **30 secondes**, destiné aux directions d'institutions
financières. Remotion (React + TypeScript) pour la timeline, les textes,
l'interface et le montage ; Three.js via React Three Fiber pour l'espace,
la matière, la lumière et les mouvements de caméra.

**Livrables**

| Fichier | Format |
|---|---|
| `out/cambiste-make-the-connection-1920x1080.mp4` | 16:9 · 1920 × 1080 · 30 ips · 900 images |
| `out/cambiste-make-the-connection-1080x1920.mp4` | 9:16 · 1080 × 1920 · 30 ips · 900 images |
| `out/direction-1-two-systems.png` | image clé — la séparation |
| `out/direction-2-make-the-connection.png` | image clé — la connexion |
| `out/direction-3-visibility.png` | image clé — le tableau de bord |

---

## Le parti pris

**Deux architectures, pas une forte et une faible.** Le système de gauche
est une pile de modules satinés ; celui de droite, une série de rails
horizontaux portés par des mâts. Les deux sont également soignés et
également éclairés une fois révélés. Ce qui les sépare n'est pas un niveau
de sophistication : ce sont **des hauteurs d'interface qui ne tombent pas
en face**. Le film tient entier dans ce détail.

**La couche Cambiste est un plan de coordination, jamais un tunnel.** Elle
apparaît au-dessus du vide, sous la forme d'un cadre mince et de trois
voies orthogonales — sortie de port, montée, traversée, descente, entrée de
port. Trois altitudes distinctes et trois montées décalées : aucune liaison
n'en croise une autre, parce qu'un enchevêtrement ne dirait pas la
coordination. Rien ne converge vers un point central où des fonds seraient
collectés ; les signaux entrent et sortent par les interfaces des deux
systèmes.

**Une seule impulsion porte le film.** Elle monte dans le système de
gauche, attend au bord du vide, franchit la connexion une fois celle-ci
établie, puis revient en réponse. C'est une instruction, pas une monnaie :
aucune pièce, aucun jeton, aucun symbole de valeur.

## Couleurs

Le brief propose une palette provisoire « à défaut » d'actifs officiels.
Les actifs officiels existent dans ce dépôt, et le brief dit qu'ils sont
prioritaires. On garde donc la **structure** demandée — fond bleu nuit très
sombre, un accent actif, un bleu de profondeur, deux neutres — avec les
**teintes de la marque**, relevées sur la vidéo de marque Cambiste.

| Rôle | Valeur |
|---|---|
| Fond principal | `#07111F` |
| Fond secondaire | `#0C1B2B` |
| Blanc principal | `#F4F8FC` |
| Gris bleuté | `#A1B3C5` |
| Signal actif (vert Cambiste) | `#0AB064`, porté à `#38E39B` en émission |
| Structure (bleu Cambiste) | `#2361EA`, arêtes `#69AFFF` |

Le vert ne sert qu'à ce que Cambiste orchestre. Le bleu porte la structure
et l'international. Aucune autre couleur n'entre dans le film.

## Lumière et matière

Studio, pas éclairage uniforme : une source principale large et douce en
haut à gauche, une lumière de contour froide qui **révèle** la structure
opposée entre 2,1 s et 4,8 s, et un accent vert localisé au seul moment où
les deux systèmes se parlent.

L'environnement est calculé en mémoire à partir de la scène de référence de
three.js (`RoomEnvironment` + `PMREMGenerator`) : **rien n'est téléchargé
pendant le rendu**. Sans environnement, une surface métallique n'a rien à
réfléchir et vire au noir — c'est le premier défaut corrigé sur les images
clés.

Ombres douces (carte 1024, `shadows="soft"`, rayon 5) et brouillard
exponentiel pour la profondeur. Un seul panneau de verre dépoli, côté
droit : un accent, pas un décor.

## Son

`public/score.wav` est **écrit par `scripts/score.mjs`** : synthèse additive
déterministe, 48 kHz, stéréo, 30,000 s. Aucune licence à vérifier, et
chaque accent tombe exactement sur l'image qui le demande — montée de
l'impulsion (0,45 s), révélation (2,3 s), parution de la structure (7,1 s),
traversée des trois voies (8,7 / 9,25 / 9,8 s), accent de connexion
(10,05 s), réponse (11,5 s), trois natures de signal (13,5 / 14,4 / 15,3 s),
étapes du suivi (18,5 / 19,2 / 19,9 s), rapprochement (20,35 s), résolution
(23 s), signature (26,35 s). Ni pièce, ni tiroir-caisse, ni glitch, ni
whoosh, ni musique héroïque, ni voix chantée.

**Il n'y a pas de voix off** : aucune ressource vocale sous licence n'est
disponible hors ligne, et je ne livre pas une voix que je n'ai pas produite.
Le film se comprend sans elle. Si vous l'enregistrez, voici le découpage
qui tient avec des respirations :

| Temps | Texte |
|---|---|
| 0,8 – 3,4 s | Your customers think beyond borders. |
| 5,6 – 8,0 s | Your infrastructure should connect them. |
| 11,0 – 12,2 s | *(silence : l'accent de connexion porte seul)* |
| 13,4 – 17,8 s | Cambiste connects African financial institutions to international payment infrastructure. |
| 18,2 – 19,4 s | With technical orchestration. |
| 20,0 – 21,6 s | And visibility at every stage. |
| 23,4 – 24,6 s | You serve your customers. |
| 24,9 – 26,2 s | We connect the infrastructure. |
| 26,8 – 27,6 s | Cambiste. |
| 27,9 – 29,2 s | Let's build your next payment corridor. |

## Exactitude

Cambiste est présenté comme une **couche d'orchestration technique**. Le
tableau de bord porte la mention « Illustrative interface · Demo data », et
le film porte, pendant 3,5 s, « Financial services provided by the relevant
partners. »

Aucune licence, aucune approbation réglementaire, aucun partenariat, aucun
volume, aucun délai, aucun tarif, aucune couverture mondiale. Aucun nom ni
logo de tiers. `scripts/verify.mjs` refuse le film si l'un des termes
interdits réapparaît à l'image.

## Commandes

```bash
npm install
npm start                       # Remotion Studio : aperçu interactif
node scripts/score.mjs          # régénère la bande son
npm run render                  # les deux formats + les trois images clés
node scripts/render.mjs wide    # un seul format
npm run verify                  # contrôle qualité, montage puis fichiers rendus
npm run typecheck
```

Aperçu d'une image précise, sans rendre le film :

```bash
npx remotion still src/index.ts cambiste-make-the-connection image.png --frame=352
```

## Structure

```
src/config.ts          charte, actes, textes, repères de caméra, géométrie
src/anim.ts            easings, progressions, interpolation des repères
src/brand.ts           actifs de marque officiels — généré
src/fonts.ts           chargement d'Outfit avant la première image
src/Film.tsx           la composition : 3D, voile, 2D, son
src/three/parts.tsx    le vocabulaire : module, arête, entretoise, port
src/three/World.tsx    les deux systèmes, la couche, les signaux
src/three/Scene.tsx    studio, lumières, caméra, brouillard
src/ui/type.tsx        titres et libellés
src/ui/Dashboard.tsx   séquence E — l'interface
src/ui/Signature.tsx   séquence G — la signature
src/ui/brandmarks.tsx  logotype officiel et marque vectorielle
scripts/               bande son, rendu, contrôle qualité
```

## Ressources manquantes ou substituées

- **Voix off** — aucune ressource vocale sous licence hors ligne. Le film
  est livré sans voix, avec le découpage de narration ci-dessus.
- **cambiste.app** — inaccessible depuis cette session (la politique réseau
  refuse le domaine). Le branding vient des actifs officiels du dépôt :
  logotype (masque alpha 494 × 85) et marque vectorielle.
- **Police** — Outfit, la police libre la plus proche du logotype, dont la
  police est propriétaire. Le logotype lui-même n'est jamais recomposé :
  c'est l'image d'origine, teintée par masquage.
- **Musique sous licence** — remplacée par une partition écrite dans le
  projet, donc libre d'usage et synchronisée à l'image.
