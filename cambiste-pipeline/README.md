# Cambiste — « Our pre-seed traction » · 15 s

Film publicitaire de 15 secondes, carré 1080 × 1080, 30 fps, en anglais.
Remotion (React + TypeScript), rendu déterministe.

**Livrable :** `../cambiste-pipeline-spot.mp4` — H.264, `yuv420p`,
**450 images exactement**, 15,000 s.

> Our pre-seed traction is becoming a structured sales pipeline.
> With world-class partners.

---

## Priorité : le temps de lecture

Le brief place la lecture au-dessus de tout : comprendre dès la première
vision, sur mobile et sans le son. Trois conséquences dans le code.

**Un message par écran.** Quatre écrans, quatre messages, aucun texte en plus.

**La phrase entière apparaît en 0,30 s**, puis ne bouge plus d'un pixel.
Toutes les lignes montent ensemble — ni décalage ligne à ligne, ni révélation
lettre à lettre, ni défilement. En fin de fenêtre les interpolations sont
bornées, donc la transformation vaut *exactement* l'identité : le texte est
rigoureusement immobile pendant toute la lecture.

**Le volet recouvre, il ne fond pas.** Un fondu enchaîné ferait cohabiter deux
messages à l'image. Le plan entrant se découvre derrière un bord qui glisse,
par-dessus le plan sortant.

### Mesures prises sur le fichier rendu

`node scripts/verify.mjs ../cambiste-pipeline-spot.mp4` décode le MP4 et
mesure l'instant où le texte de chaque écran devient **stable**, puis combien
de temps il le reste :

| Écran | Temps | Stable à partir de | Lecture stable | Minimum |
|---|---|---|---|---|
| Our pre-seed traction | 0 – 3 s | 0,37 s | **2,63 s** | — |
| is becoming a structured sales pipeline. | 3 – 7 s | 0,33 s | **3,67 s** | 3,5 s |
| With world-class partners. | 7 – 11 s | 0,40 s | **3,60 s** | 3,5 s |
| Carton de fin | 11 – 15 s | 0,33 s | **3,67 s** | 3,5 s |

Et aussi : marge de sécurité **97 px** au plus près (80 demandés) ; plus petit
bloc du carton de fin à **13,3 px** une fois ramené à un écran de 400 px de
large, la largeur typique d'un fil LinkedIn sur téléphone.

Le seuil de détection distingue un mouvement du bruit de compression : un
texte fixe encodé en H.264 varie de quelques centaines de pixels sur ses bords
anticrénelés d'un groupe d'images à l'autre, alors qu'un décalage d'un seul
pixel en changerait des milliers. Le script passe entre les deux, et le
documente.

## Branding

Couleurs et logo viennent des **actifs de marque officiels** fournis dans ce
dépôt, relevés sur les aplats de la vidéo de marque — jamais estimés.

| Rôle | Valeur |
|---|---|
| Vert Cambiste | `#0AB064` |
| Vert pâle (fond du plan réseau) | `#E8F6EF` |
| Vert clair (liens du réseau) | `#7FD9AE` |
| Encre | `#0B0B0C` |
| Blanc | `#FFFFFF` |

Le **logotype** est l'image d'origine à sa résolution native (masque alpha
494 × 85), jamais recomposée : sa police est propriétaire. La **marque** est
vectorielle — carré en superellipse ajustée sur le profil mesuré, glyphe dont
le second lobe est la rotation exacte du premier. Les proportions du
verrouillage tiennent à un seul rapport (`28/84` de la hauteur de capitale) :
changer la taille ne peut pas les déformer.

La typographie est **Outfit**, retenue pour toute la série Cambiste parce
qu'elle est la plus proche du logotype parmi les polices libres. Elle est
chargée avant la première image : sans cela le rendu capturerait une police de
repli.

## Exactitude commerciale

Le film dit qu'un pipeline commercial **se structure**, et rien d'autre.
Aucun montant levé, aucun contrat signé, aucun nombre de clients, aucun volume
de transactions. Le réseau du troisième écran est volontairement **abstrait** :
il évoque un maillage sans nommer ni figurer qui que ce soit — afficher un
partenaire demanderait son accord explicite et ses actifs.

## Structure

```
src/config.ts                 CONFIGURATION UNIQUE : textes, couleurs,
                              durées, chemins d'actifs. Les composants ne
                              contiennent aucune chaîne ni couleur en dur.
src/brand.ts                  actifs de marque — généré, ne pas éditer
src/fonts.ts                  chargement d'Outfit avant la première image
src/PipelineSpot.tsx          les quatre écrans et le montage
src/components/
  PhraseReveal.tsx            la phrase entière en 0,30 s, puis immobile
  SceneFrame.tsx              fond et volet d'entrée
  NetworkFormation.tsx        le réseau qui prend forme
  ClosingCard.tsx             logo, signature, adresse
  CambisteLogo.tsx            logotype officiel + marque vectorielle
scripts/verify.mjs            contrôle du MP4 rendu, sans dépendance
public/                       logotype et sous-ensembles Outfit
```

Le découpage se **dérive** des durées déclarées dans `config.ts` : les bornes
ne sont jamais saisies deux fois, et une assertion au chargement refuse tout
découpage qui ne totaliserait pas 450 images.

## Commandes

```bash
npm install
npm run preview                                   # aperçu basse résolution
npm run build                                     # -> ../cambiste-pipeline-spot.mp4
node scripts/verify.mjs ../cambiste-pipeline-spot.mp4   # contrôle du rendu
npm start                                         # Remotion Studio
npm run typecheck
```

## Points à connaître

**cambiste.app n'a pas pu être consulté.** La politique réseau de la session
refuse le domaine (403 sur CONNECT, `connect_rejected`). Le branding vient
donc entièrement des actifs officiels déjà présents dans le dépôt. Si le site
porte des valeurs différentes, tout est centralisé dans `src/config.ts`.

**Le vert.** `#0AB064` est la valeur relevée sur la vidéo de marque. Un brief
précédent indiquait `#00A66A` ; l'écart est faible mais réel, et c'est la
valeur mesurée sur l'actif officiel qui est appliquée ici.

**La casse.** Les textes sont repris **exactement** comme fournis, en bas de
casse. Le reste de la série Cambiste emploie des capitales pour les titres ;
basculer serait une modification de la copie, pas une décision de mise en
forme, donc elle n'a pas été prise.

**La signature officielle de la marque est « Limitless Africa ».** Le carton
de fin porte « Connecting Africa to global payments. », la signature demandée
pour ce film.

**Le film est muet.** Aucun actif audio sous licence n'est disponible, ce qui
reste cohérent avec une diffusion LinkedIn où la lecture démarre sans son.
