# Spot publicitaire — *Manuscrit : Titre Inconnu*

`spot-manuscrit-titre-inconnu-1080x1080.mp4` — 38,7 s, 1080×1080, H.264 + AAC.

## Déroulé

| Temps | Plan |
|---|---|
| 0,0 – 5,0 s | Couverture, zoom lent, ouverture en fondu depuis le noir |
| 5,0 – 28,7 s | Le rituel — image restaurée, **aucun texte incrusté** |
| 28,7 – 33,4 s | Fiche Amazon : « Disponible maintenant », broché 10,76 € |
| 33,4 – 38,7 s | Carton de fin : titre, auteur, « Commandez sur Amazon.fr », fermeture au noir |

Transitions : fondu enchaîné, puis passage au noir avant la partie commerciale,
puis fondu enchaîné.

## Traitement de l'image du rituel

Le master fourni est en 1080×1080 mais l'image utile n'occupe que 1080×864
(bandes noires de 108 px), et elle portait des artefacts de compression
visibles dans les aplats sombres. La chaîne appliquée :

1. recadrage sur l'image utile (1080×864) — aucune perte de résolution ;
2. `hqdn3d` — débruitage spatio-temporel léger, qui efface les blocs de
   compression sans effacer la matière du visage ;
3. `deband` — supprime les cercles de postérisation dans les fumées ;
4. sur-échantillonnage ×2, `unsharp`, retour en 1080×864 — accentuation plus
   propre qu'un masque flou appliqué directement ;
5. `curves` — remonte légèrement les basses lumières pour rouvrir les ombres
   que le contraste bouchait ;
6. `eq` + `cas` — contraste, saturation et netteté adaptative de finition ;
7. les bandes noires sont comblées par une copie floutée et assombrie du plan,
   plus riche qu'un simple noir ;
8. vignettage et grain fin discrets.

## Bande-son

Nappe d'ambiance synthétisée (bourdon grave, quinte, souffle, pulsation lente),
normalisée à −19 LUFS. La séquence source était muette. C'est un lit
volontairement neutre, prévu pour être remplacé par une musique sous licence.

## Reconstruire

```sh
SRCDIR=/chemin/vers/sources ./build/build.sh
```

`SRCDIR` doit contenir `cover.jpg`, `amazon.jpg` et `rituel.mov`.
Dépendances : `ffmpeg` (≥ 6) et `python3` + `pillow`.

Le prix, la mention d'éditeur et les textes des cartons sont dans
`build/make_scenes.py`.
