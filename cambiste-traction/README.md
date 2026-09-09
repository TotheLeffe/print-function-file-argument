# Cambiste — « Traction is life » · 21 s

Film de marque de 21 secondes, carré 1080 × 1080, 30 fps, en anglais.
Construit avec **Remotion** (React + TypeScript), rendu déterministe.

**Livrable :** `../cambiste-traction-spot.mp4` — H.264, `yuv420p`, 21,00 s exactes.

> Most products don't die all at once. They die when people stop caring.
> But if people keep coming back, and if money keeps moving — you're not dead yet.

---

## Progression

L'enchaînement porte tout le film : **les produits meurent → l'attention
disparaît → les usagers reviennent → l'argent circule → la traction est un
signe de vie → Cambiste.**

| # | Temps | Durée | Fond | Contenu |
|---|---|---|---|---|
| 1 | 0,0 – 3,5 | 3,5 s | Blanc cassé | *MOST PRODUCTS / DON'T DIE /* **ALL AT ONCE.** (vert) — bloc haut-gauche |
| 2 | 3,5 – 7,0 | 3,5 s | Vert Cambiste | *THEY DIE / WHEN PEOPLE / STOP CARING.* — le réseau se **défait** sur la dernière ligne |
| 3 | 7,0 – 11,0 | 4,0 s | Blanc cassé | *BUT IF PEOPLE / KEEP COMING BACK…* souligné de vert — le réseau se **retisse** |
| 4 | 11,0 – 14,5 | 3,5 s | Blanc cassé | *IF MONEY / KEEPS MOVING…* — une carte Cambiste traverse le rail Afrique → Global banking |
| 5 | 14,5 – 18,0 | 3,5 s | Vert profond | *YOU'RE* (menthe) / **NOT DEAD YET.** (blanc, plus grand) + filet vert |
| 6 | 18,0 – 21,0 | 3,0 s | Blanc cassé | Logo · *TRACTION IS LIFE.* · Mobile Money → Global Banking System · cambiste.app |

**Les plans 3 et 4 ne sont pas séparés par une coupe.** Le brief demande que le
réseau « devienne plus dense », pas qu'il réapparaisse : ils partagent donc une
seule séquence, un seul fond et un seul réseau dont la densité progresse d'un
bout à l'autre.

## La règle de lecture

**Aucun plan ne se coupe avant que sa composition soit complète depuis environ
une seconde.** C'est le temps de lecture, et non le temps d'animation, qui
dimensionne chaque plan. Marges mesurées sur le film rendu :

| Plan | Texte posé à | Tenue avant la coupe |
|---|---|---|
| 1 mortality | 2,27 s | **1,23 s** |
| 2 attention | 2,47 s | **1,03 s** (le réseau lâche pendant la tenue) |
| 3 returning | 2,00 s | **2,00 s** |
| 4 movement | 1,53 s | **1,97 s** (la carte finit sa course à 3,2 s) |
| 5 alive | 2,00 s | **1,50 s** |
| 6 signature | 2,00 s | **1,00 s** |

Les **volets** durent 16 images (0,53 s) et suivent une cubic-bézier
d'accompagnement. Un volet se déroule au début du plan qu'il révèle, pendant
que le plan sortant reste visible dessous : l'allonger ne rallonge pas le film.

## Contrôles passés

- **Durée** : 630 images / 30 fps = **21,00 s exactes** (piste audio supprimée —
  la piste silencieuse ajoutée par défaut portait le conteneur à 21,06 s).
- **Format de pixel** : `yuv420p` en plage limitée. Les images intermédiaires
  sont en PNG ; en JPEG, ffmpeg produisait `yuvj420p` (pleine plage), ce qui
  décale les niveaux sur certains lecteurs et marque les aplats.
- **Marges de sécurité** : contenu vérifié image par image sur le MP4 final,
  **95 px minimum** contre 80 demandés.
- **Déterminisme** : aucun `Math.random`, aucune horloge. Les positions et
  dérives du réseau viennent d'un générateur graine.

## Structure

```
src/theme.ts                    charte, découpage, courbes, générateur graine
src/brand.ts                    actifs de marque — généré, ne pas éditer
src/fonts.ts                    chargement d'Outfit avant la première image
src/TractionSpot.tsx            les six plans et le montage
src/components/
  AnimatedTextReveal.tsx        révélation par masque vertical, ligne à ligne
  NetworkBackground.tsx         le réseau : se défait, se retisse, se densifie
  TransactionPulse.tsx          rail, impulsion et carte de transaction
  SceneTransition.tsx           volets glissés
  CambisteEndCard.tsx           carton de fin
  CambisteLogo.tsx              logotype officiel + marque vectorielle
public/                         logotype PNG et sous-ensembles Outfit
```

## Rendu

```bash
npm install
npm run preview   # basse résolution, pour vérifier le rythme
npm run build     # -> ../cambiste-traction-spot.mp4
npm start         # Remotion Studio, pour ajuster image par image
```

## Décisions à connaître

**La vidéo de référence est le même fichier que le teaser Wero fourni plus
tôt** (empreinte MD5 identique). Son analyse — aplats pleins, typographie
cinétique, fragments révélés un à un, masques verticaux, grande respiration —
avait déjà été faite ; elle a été réutilisée plutôt que refaite.

**Le vert.** Le brief fixe `#00A66A`. Le vert relevé sur la vidéo de marque
officielle est `#0AB064`. L'écart est faible mais réel ; c'est la valeur du
brief qui est appliquée. Une ligne dans `src/theme.ts` pour revenir à l'autre.

**La typographie.** Le brief demande « bold geometric sans-serif » en citant
Arial Black, Inter Black et Helvetica Neue Heavy — qui sont des grotesques, pas
des géométriques. C'est **Outfit 900** qui est employé : géométrique, c'est la
police de toute la série Cambiste, retenue parce qu'elle est la plus proche du
logotype de marque. Un seul `@font-face` à changer pour basculer.

**Le logo** est l'actif officiel, jamais recomposé : le logotype est le masque
alpha extrait de la vidéo de marque à sa résolution native, la marque est
vectorielle (carré en superellipse ajustée, glyphe dont le second lobe est la
rotation exacte du premier). Il n'a droit qu'à un fondu et à une légère montée.

**Aucun chiffre inventé.** La carte de transaction ne porte que la marque et la
nature du flux — pas de montant, pas de volume, pas de nombre d'utilisateurs.

**Le son n'est pas livré.** Aucun actif audio sous licence n'est disponible
dans le projet et je ne peux pas générer de musique. Le film est muet, ce qui
reste cohérent avec une diffusion LinkedIn, où la lecture démarre sans son.
Le montage laisse la place pour une nappe, une pulsation basse et un impact
sur « NOT DEAD YET. » si tu fournis les pistes.
