# Spot « Machiavel au Congo » — chaîne Sangwa Yan

Deux pièces animées en [Remotion](https://remotion.dev), déclinées en trois formats :

| Pièce | Durée | Usage |
|---|---|---|
| **Spot** | 5 s | Bande-annonce de la vidéo, à publier telle quelle en réel |
| **Outro** | 3 s | Séquence de fin, à coller au bout de **chaque** réel de la série |

Formats disponibles pour les deux : **9:16** (TikTok / Instagram Reels / YouTube Shorts),
**16:9** (chaîne YouTube) et **1:1** (fil Instagram / Facebook).

## Le spot, plan par plan (150 images à 30 fps)

| Images | Plan | Contenu |
|---|---|---|
| 0–46 | Accroche | Gros plan sur Machiavel — « Et si Le Prince était congolais ? » |
| 45–95 | Titre | **MACHIAVEL AU CONGO** + bandeau rouge « Le pouvoir sans l'État » |
| 94–120 | Mots-clés | Pouvoir · Opposition · Dialogue national · Élections 2028 |
| 119–150 | Outro | Miniature entière, logo YouTube, **SANGWA YAN**, bouton S'abonner |

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
ffmpeg -i mon-reel.mp4 -i out/outro-sangwa-yan-reel-1080x1920.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" reel-avec-outro.mp4
```

Les rendus portent une piste audio silencieuse, donc `concat` fonctionne
directement même si votre réel a du son.

## Modifier

- **Textes et minutage** : `src/timeline.ts` (nom de chaîne, mots-clés, durées).
- **Couleurs et polices** : `src/theme.ts`.
- **Accroche** : `src/beats/Hook.tsx`.
- **Cadrages dans la miniature** : `SHOTS` dans `src/components/Backdrop.tsx`.
- **Miniature** : remplacez `public/thumbnail.png` (attendue en 1536×1024 ; si
  vous changez le rapport, ajustez `SRC_W` / `SRC_H` dans `Backdrop.tsx`).

Polices : Anton et Oswald (SIL Open Font License), embarquées dans
`public/fonts/` pour que le rendu ne dépende d'aucun réseau.

Les fichiers déjà rendus sont dans `renders/` ; `out/` est le dossier de travail
et n'est pas versionné.
