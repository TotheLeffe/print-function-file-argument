# Villa Bahari Resort — montage vidéo (Remotion)

Montage de présentation construit autour du survol drone de la propriété
(60 s, 848×480). Le plan aérien reste **continu** du début à la fin : les
cartons, synthés et chiffres clés viennent s'y poser plutôt que de couper
l'image, ce qui évite de découper un rush déjà court et de faire ressortir sa
définition d'origine.

Durée : **64,7 s** (1 940 images à 30 i/s).

## Les six versions

Trois montages, en français et en anglais. Le minutage est **strictement
identique** d'une langue à l'autre : il est calé sur les mouvements du drone,
défini une seule fois dans `src/timeline.ts` et partagé par tous les scripts.

| Composition | Format | Usage | Contenu |
| --- | --- | --- | --- |
| `VillaBahariLinkedIn` | 1920×1080 | LinkedIn, site, prospection | Le lieu et le produit hôtelier. **Aucune donnée financière, aucune mention de marque tierce.** |
| `VillaBahariRadisson` | 1920×1080 | Échanges avec Radisson Hotel Group | Discours d'investissement : capital engagé, marché de Kinshasa, alignement Radisson Individuals. Porte la mention « Confidentiel ». |
| `VillaBahariCarre` | 1080×1080 | Fil d'actualité mobile | Version publique recadrée. |
| `VillaBahariLinkedInEN` | 1920×1080 | Diffusion internationale | Version publique, en anglais. |
| `VillaBahariRadissonEN` | 1920×1080 | Radisson Hotel Group | Version dossier, en anglais. |
| `VillaBahariSquareEN` | 1080×1080 | Fil d'actualité mobile | Version publique anglaise, recadrée. |

La séparation public / dossier est volontaire : le dossier source est marqué
*strictement confidentiel* et préparé pour un destinataire unique. Les versions
publiables ne reprennent donc ni les montants investis, ni les projections, ni
le nom de Radisson.

## Démarrer

```bash
npm install
npm run studio     # aperçu interactif sur http://localhost:3000
```

## Rendre les vidéos

```bash
npm run render               # out/villa-bahari-linkedin.mp4
npm run render:radisson      # out/villa-bahari-radisson.mp4
npm run render:square        # out/villa-bahari-carre.mp4

npm run render:en            # out/villa-bahari-linkedin-en.mp4
npm run render:en:radisson   # out/villa-bahari-radisson-en.mp4
npm run render:en:square     # out/villa-bahari-square-en.mp4

npm run render:fr:all        # les trois versions françaises
npm run render:en:all        # les trois versions anglaises
npm run render:all           # les six
```

Chaque fichier pèse environ 25 Mo (12 Mo en carré). Le rush d'origine étant en
848×480, descendre le CRF sous 23 (`remotion.config.ts`) alourdit le fichier
sans gain visible.

Le rendu a besoin d'un Chrome ; Remotion en télécharge un au premier lancement.
Si une version est déjà installée sur la machine, on peut la réutiliser :

```bash
npx remotion render VillaBahariLinkedIn out/villa-bahari-linkedin.mp4 \
  --browser-executable=/chemin/vers/chrome
```

## Modifier le contenu

Les textes vivent dans **`src/script.fr.ts`** et **`src/script.en.ts`**, un objet
par version — il n'y a pas de texte codé en dur dans les composants. Le minutage,
lui, est dans **`src/timeline.ts`** : `SLOTS` donne l'image de départ et la durée
de chacun des cinq synthés, `PANEL_SLOT` celles du panneau de chiffres, à 30
images par seconde. Modifier un créneau le décale dans **toutes** les langues à
la fois, ce qui est justement le but.

Pour ajouter une langue, copier `script.en.ts`, traduire, puis inscrire les
compositions dans le tableau `VARIANTS` de `src/Root.tsx`.

Les chiffres et formulations proviennent du dossier *Villa Bahari Resort —
Dossier confidentiel, juin 2026* : 46 chambres extensibles à 70, 4 900 m² de
terrain riverain, 26,4 m² de surface moyenne par chambre, 150 à 200 invités en
événementiel, ouverture cible T4 2027, 5 150 000 USD investis sans dette. La
piscine y est indiquée « en projet », ce que le commentaire reprend tel quel.

## Remplacer le rush

Déposer le nouveau fichier dans `public/video/` et ajuster `VIDEO` dans
`src/theme.ts`. Si sa durée diffère de 60 s, mettre à jour `FOOTAGE_END`,
`OUTRO_FROM` et `TOTAL_FRAMES` en tête de `src/timeline.ts`, puis vérifier que
les créneaux de `SLOTS` restent dans le plan.

## Ajouter une musique

Le rush est monté **muet** : le son d'origine n'est que du bruit d'hélices, et
LinkedIn démarre les vidéos sans son. Pour ajouter un habillage sonore, déposer
le fichier dans `public/audio/` puis renseigner le champ `music` de la version
concernée dans `src/script.fr.ts` ou `src/script.en.ts` :

```ts
music: {file: 'audio/mon-morceau.mp3', volume: 0.5},
```

Les fondus d'entrée et de sortie sont gérés automatiquement. Penser aux droits
d'utilisation du morceau.

## Polices

Cormorant Garamond (titres) et Inter (texte) sont **embarquées dans le bundle**
en data URI, générées par `scripts/build-fonts.mjs` depuis les paquets
`@fontsource`. Aucun appel réseau au rendu, donc un résultat identique partout.
Après un changement de graisse ou de famille :

```bash
node scripts/build-fonts.mjs
```

## Structure

```
src/
  timeline.ts             minutage commun, types, assemblage des scripts
  script.fr.ts            textes des trois versions françaises
  script.en.ts            textes des trois versions anglaises
  theme.ts                couleurs, familles de polices, chargement des polices
  layout.ts               unité « u » : mise à l'échelle 1920×1080 → autres formats
  Root.tsx                déclaration des six compositions
  VillaBahariMontage.tsx  assemblage de la timeline
  components/
    Footage.tsx           rush drone, étalonnage, push-in, fondu de sortie
    TitleCard.tsx         carton d'ouverture
    LowerThird.tsx        synthés bas de cadre
    StatPanel.tsx         panneau de chiffres clés
    OutroCard.tsx         carton de fin et coordonnées
    Chrome.tsx            filigrane, mention de confidentialité, barre de progression
    Grain.tsx             grain photochimique
    Reveal.tsx            révélation de texte par volet
```
