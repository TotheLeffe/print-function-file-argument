# Spot commercial Cambiste — 15 s

Film publicitaire de 15 secondes au format carré (1080×1080, 30 fps), destiné à
LinkedIn. Sujet : le produit Cambiste et la conformité intégrée.

**Livrable :** `cambiste-spot-15s.mp4`

---

## Direction

Le langage visuel reprend celui du teaser **Wero × BoursoBank** fourni en
référence : aplats de couleur pleine, typographie cinétique en très gros corps,
coupes franches à un rythme d'environ deux secondes, aucune photographie, et une
explosion de confettis sur la signature finale.

Ce langage est appliqué à la **charte Cambiste**, pas à celle de Wero. Le jaune
Wero est remplacé par le vert Cambiste, qui joue le même rôle de couleur
signature : c'est lui qui porte les temps forts et qui coche la conformité.

Le spot est muet, comme la référence — les vidéos LinkedIn démarrent sans son.

## Découpage

| # | Temps | Fond | Contenu |
|---|-------|------|---------|
| 1 | 0,0 – 2,0 s | Encre | « OPÉRATEURS MOBILE MONEY » · **L'INTERNATIONAL / S'ARRÊTE ICI.** biffé de vert |
| 2 | 2,0 – 3,6 s | Vert | La barre de biffure envahit le cadre · **PLUS MAINTENANT.** |
| 3 | 3,6 – 5,8 s | Blanc | Le logo s'écrit · *Limitless Africa* · la promesse produit |
| 4 | 5,8 – 8,6 s | Encre | **UN SEUL POINT D'INTÉGRATION.** · Wallet → Cambiste → Bénéficiaire, un jeton traverse le rail |
| 5 | 8,6 – 12,0 s | Blanc | **LA CONFORMITÉ N'EST PAS UNE OPTION.** · KYC, screening sanctions, Travel Rule, monitoring |
| 6 | 12,0 – 13,3 s | Vert | **CÔTÉ CLIENT, UN SIMPLE TRANSFERT.** |
| 7 | 13,3 – 15,0 s | Encre | Confettis · logo Cambiste · *Limitless Africa* |

La scène 5 occupe 3,4 secondes, soit près d'un quart du film : c'est le bloc le
plus long, la conformité étant l'argument à retenir.

## Charte respectée

Tous les actifs et toutes les couleurs sont **extraits de la vidéo de marque
officielle**, jamais approximés :

| Élément | Valeur | Origine |
|---|---|---|
| Logotype « Cambiste » | masque alpha 494×85 natif | extrait image par image, teinté noir ou blanc |
| Marque (carré + glyphe) | vectoriel | superellipse ajustée + tracé du glyphe |
| Vert Cambiste | `#0AB064` | relevé sur l'aplat |
| Bleu d'accent | `#2361EA` | relevé sur le bouton « Book a demo » |
| Signature | *Limitless Africa* | reprise telle quelle |

Deux points méritent d'être signalés :

- **Le logotype utilise une police propriétaire.** Aucune police Google ne
  correspond (meilleur recouvrement testé : 0,70). Le logotype est donc employé
  tel quel, en image, et n'est jamais recomposé. Il n'est affiché qu'à sa taille
  native ou en deçà, donc sans perte.
- **La typographie de support est Outfit**, la plus proche du logotype parmi les
  polices libres testées. À remplacer par la police de la charte si elle est
  disponible : un seul `@font-face` à changer dans `spot.html`.

Le glyphe de la marque a une symétrie centrale exacte. Un seul lobe est tracé ;
l'autre en est la rotation à 180°, ce qui garantit la symétrie.

## Ripple

Le spot **ne mentionne pas Ripple**. Le document d'architecture qui l'accompagne
est un projet à valider (« Draft v2 – Cambiste Proposal ») : annoncer
publiquement un partenariat non signé serait prématuré. Les deux arguments
d'infrastructure sont donc formulés côté bénéfice client :

> Aucune infrastructure blockchain à opérer.
> Aucun compte de préfinancement à l'étranger.

Une fois le partenariat acté, un co-marquage « Powered by Ripple » s'ajoute en
scène 4 sans retoucher le reste du montage.

## Reconstruire

```bash
pip install playwright imageio-ffmpeg pillow numpy potracer
python3 render.py                 # 450 images -> cambiste-spot-15s.mp4
python3 preview.py                # planche de contrôle de 16 images clés
python3 tools/extract_brand.py <video-de-marque.mov>   # régénère brand/brand.js
```

`spot.html` s'ouvre aussi directement dans un navigateur ; `play()` dans la
console lance la lecture en temps réel.

## Fonctionnement

L'animation est **déterministe** : `renderFrame(n)` dessine intégralement
l'image `n` sans dépendre de l'horloge. La capture pilote donc le temps au lieu
de le subir, et deux rendus successifs sont identiques au pixel près — ce qu'un
enregistrement d'écran ne garantit pas.

```
spot.html              l'animation (canvas 2D, 7 scènes, 450 images)
brand/brand.js         actifs de marque générés — ne pas éditer à la main
fonts/                 Outfit (variable, sous-ensembles latin et latin-ext)
render.py              capture image par image puis encodage H.264
preview.py             planche de contrôle
tools/extract_brand.py extraction des actifs depuis la vidéo de marque
```

## Variantes

Les textes sont regroupés en haut de chaque fonction de scène dans `spot.html`.

- **Version anglaise** : traduire les sept blocs de texte ; les cadrages
  s'ajustent seuls, chaque titre étant redimensionné automatiquement pour tenir
  dans la marge.
- **Formats 9:16 ou 16:9** : changer `W` et `H` en tête de `spot.html`. Les
  positions sont exprimées en dur et demanderont une reprise.
