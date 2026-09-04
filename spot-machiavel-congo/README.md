# Spot « Machiavel au Congo » — chaîne Sangwa Yan

Deux pièces animées en [Remotion](https://remotion.dev), déclinées en trois formats :

| Pièce | Durée | Usage |
|---|---|---|
| **Spot** | 12,70 s | Bande-annonce de la vidéo, à publier telle quelle en réel |
| **Outro** | 4,03 s | Séquence de fin, à coller au bout de **chaque** réel de la série |

Formats disponibles pour les deux : **9:16** (TikTok / Instagram Reels / YouTube Shorts),
**16:9** (chaîne YouTube) et **1:1** (fil Instagram / Facebook).

## Les durées sont calculées, pas choisies

Un plan dure le temps qu'il faut pour lire son texte. `src/reading.ts` pose le
modèle — vitesse de lecture en caractères par seconde, délai avant que l'œil se
pose sur un texte qui apparaît — et `src/timeline.ts` en déduit le top
d'apparition de chaque ligne, la durée de chaque plan et celle du spot entier.

```bash
npm run timing
```
```
Accroche: 81 images (2.70 s)
Titre: 100 images (3.33 s)
Mots-clés: 109 images (3.63 s)
Outro: 97 images (3.23 s)
Spot: 381 images (12.70 s)
Outro autonome: 121 images (4.03 s)
```

Conséquence pratique : **retouchez un texte et le minutage suit**. Une accroche
plus longue rallonge son plan et le spot, sans rien régler à la main.

Les vitesses retenues (20 caractères/seconde pour un gros titre, 18 pour une
phrase ou une liste) visent une lecture confortable. Un sous-titre de streaming
plafonne vers 17 c/s parce que le spectateur suit l'action en même temps ; un
titre plein cadre se lit plus vite. Pour un spot plus nerveux ou plus posé,
c'est la constante `CPS` de `src/reading.ts` qu'il faut bouger — tout le reste
se recalcule.

## Le spot, plan par plan

| Plan | Contenu |
|---|---|
| Accroche | Gros plan sur Machiavel — « Et si Le Prince était congolais ? » |
| Titre | **MACHIAVEL AU CONGO** + bandeau rouge « Le pouvoir sans l'État » |
| Mots-clés | Pouvoir · Opposition · Dialogue national · Élections 2028 |
| Outro | Miniature entière, logo YouTube, **SANGWA YAN**, bouton S'abonner |

Les trois premiers plans recadrent la miniature dans sa bande supérieure, qui ne
porte aucun texte : le lettrage d'origine n'apparaît qu'à l'outro, où il sert de
récompense. Le recadrage est calculé en coordonnées de l'image source
(`src/components/Backdrop.tsx`), donc le cadrage vertical est identique dans les
trois formats.

## Rendu

```bash
npm install
npm run dev              # studio Remotion, prévisualisation et réglages
npm run build:all        # les 6 fichiers dans out/
npm run build:outro      # les 3 outros seulement
```

Sur une machine sans accès au téléchargement de Chrome, pointez Remotion vers un
Chromium déjà installé :

```bash
REMOTION_BROWSER_EXECUTABLE=/chemin/vers/chrome npm run build:all
```

## Coller l'outro à la fin d'un réel

L'outro est un fichier vidéo autonome : il se glisse en dernière piste dans
n'importe quel montage (CapCut, Premiere, DaVinci). En ligne de commande :

```bash
ffmpeg -i mon-reel.mp4 -i renders/outro-sangwa-yan-reel-1080x1920.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" reel-avec-outro.mp4
```

Les rendus portent une piste audio silencieuse, donc `concat` fonctionne
directement même si votre réel a du son.

## Modifier

- **Textes** : `src/timeline.ts` — accroche, titre, slogan, mots-clés, nom de chaîne.
- **Vitesse de lecture** : `src/reading.ts`.
- **Couleurs et polices** : `src/theme.ts`.
- **Cadrages dans la miniature** : `SHOTS` dans `src/components/Backdrop.tsx`.
- **Miniature** : remplacez `public/thumbnail.png` (attendue en 1536×1024 ; si
  vous changez le rapport, ajustez `SRC_W` / `SRC_H` dans `Backdrop.tsx`).

Polices : Anton et Oswald (SIL Open Font License), embarquées dans
`public/fonts/` pour que le rendu ne dépende d'aucun réseau.

Les fichiers déjà rendus sont dans `renders/` ; `out/` est le dossier de travail
et n'est pas versionné.
