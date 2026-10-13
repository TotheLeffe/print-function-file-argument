# Cambiste — série de 14 spots LinkedIn

Quatorze films publicitaires de **15 secondes**, **1080 × 1350** (4:5),
**30 ips**, **450 images exactement**. Copie à l'écran en anglais.
Remotion (React + TypeScript), rendu déterministe.

**Livrables :** `out/cambiste-linkedin-01.mp4` … `out/cambiste-linkedin-14.mp4`
— H.264, `yuv420p`, muets.

---

## Le principe de montage

Une idée par spot. Quatre séquences : **0–3 s, 3–7 s, 7–11 s, 11–15 s**.
Sept mots au maximum par séquence, vingt-quatre par spot, logo et adresse
exclus.

**La phrase entière paraît en 0,30 s**, toutes les lignes ensemble, puis ne
bouge plus d'un pixel. Ni machine à écrire, ni révélation lettre à lettre, ni
défilement : chacun repousserait le moment où la phrase devient lisible. En
fin de fenêtre les interpolations sont bornées, donc la transformation vaut
exactement l'identité.

**Le volet recouvre, il ne fond pas.** Un fondu enchaîné ferait cohabiter deux
messages à l'image. Le plan entrant se découvre derrière un bord qui monte,
par-dessus le plan sortant — qui reste affiché pendant ces 0,30 s, sans quoi
le volet découvrirait le vide et la série clignoterait en blanc à chaque
coupe.

**Le schéma ne bouge qu'après le texte.** Il démarre à l'image 18, soit quatre
images après que la phrase est posée : aucune animation ne commence avant que
le message soit lisible.

| Séquence | Temps | Lecture stable, par construction | Mesurée sur les 14 rendus |
|---|---|---|---|
| 1 · accroche | 0 – 3 s | 2,53 s | **2,67 s** |
| 2 | 3 – 7 s | 3,53 s | **3,67 s** |
| 3 | 7 – 11 s | 3,53 s | **3,67 s** |
| 4 · carton de fin | 11 – 15 s | 3,53 s | **3,67 s** |

La colonne mesurée est la vraie : elle vient du décodage des MP4, image par
image, et elle est un peu meilleure que la garantie du découpage parce que
le volet dégage la bande de texte avant la fin de la pose.

## L'identité de la série

Le même rythme de fonds pour les quatorze films — **blanc, vert Cambiste,
vert pâle, blanc** — la même grille, la même typographie, le même carton de
fin. C'est ce qui fait qu'un spot est reconnaissable avant d'être lu.

La page est tenue par deux bandes qui ne se chevauchent jamais : le message
en haut (120 – 740 px), le schéma en bas (770 – 1215 px). La taille du titre
se déduit de la ligne la plus longue, sans mesure DOM — donc identique à
chaque rendu — avec 6 % de réserve dans la colonne.

## Branding

Couleurs et logo viennent des **actifs de marque officiels** fournis dans ce
dépôt, relevés sur les aplats de la vidéo de marque — jamais estimés.

| Rôle | Valeur |
|---|---|
| Vert Cambiste | `#0AB064` |
| Vert pâle (fond de la 3ᵉ séquence) | `#E8F6EF` |
| Vert clair (liens des schémas) | `#7FD9AE` |
| Vert sombre (blocs pleins sur fond vert) | `#055731` |
| Encre | `#0B0B0C` |

Le **logotype** est l'image d'origine à sa résolution native (masque alpha
494 × 85), jamais recomposée : sa police est propriétaire. Il est affiché à
76 px de hauteur de capitale, toujours en deçà de sa taille native. La
**marque** est vectorielle — carré en superellipse ajustée sur le profil
mesuré, glyphe dont le second lobe est la rotation exacte du premier.

La typographie est **Outfit**, retenue pour toute la série Cambiste parce
qu'elle est la plus proche du logotype parmi les polices libres. Elle est
chargée avant la première image.

## Confidentialité et exactitude commerciale

Rien à l'image ne nomme un partenaire, un prospect ou un client. Aucun
chiffre : ni volume, ni tarif, ni valorisation, ni pipeline. Aucune promesse
de vitesse, de prix, de couverture géographique ou réglementaire — les mots
« instant », « cheapest », « fully compliant », « available across Africa »
sont dans la liste noire du script de contrôle, qui refuse le rendu s'ils
apparaissent.

Les capacités en construction se disent « building », « designed to »,
« toward », « our approach ». Les schémas illustrent un fonctionnement
général : aucun ne figure une transaction réellement réalisée.

Les blocs des schémas ne portent que des libellés **génériques** — `BANK`,
`MOBILE WALLET`, `LOCAL PAYMENT`, `ORCHESTRATION LAYER`… — tirés d'un
vocabulaire fermé que le script vérifie.

## Les contrôles

```bash
npm run verify              # copie, grille, lisibilité, confidentialité
npm run verify -- --render  # + mesures sur les MP4 de out/
```

Le script ne recopie aucune constante : il compile `src/config.ts` et
`src/spots/index.ts` avec le `tsc` du projet, puis les importe. Une valeur
changée dans la configuration est donc immédiatement celle qui est vérifiée.

Les six contrôles du brief :

1. **nombre de mots** par séquence et par spot ;
2. **temps de lecture réel** de chaque écran, déduit du découpage ;
3. **lisibilité sur téléphone** : tout corps ramené à un fil de 400 px de
   large doit tenir 12 px — le plus petit titre en fait 21, les libellés des
   schémas 12,6, l'adresse 14,8 ;
4. **chevauchements** : bandes disjointes, deux lignes au maximum, largeur de
   ligne tenue dans la colonne ;
5. **confidentialité et promesses** : liste noire, aucun chiffre, libellés
   génériques ;
6. **compréhension sans son** : quatre écrans pleins, un schéma distinct par
   spot, une marque à la fin.

Avec `--render`, le script décode chaque MP4 et mesure sur le fichier — pas
sur le code qui le produit — le format, la durée, l'instant où le texte
devient immobile et la marge minimale du contenu. Le seuil de détection
distingue un mouvement du bruit de compression : un texte fixe encodé en
H.264 varie de quelques centaines de pixels sur ses bords anticrénelés, alors
qu'un décalage d'un seul pixel en changerait des milliers.

**Les 14 films sont rendus sur un seul onglet** (`--concurrency=1`).
Remotion répartit sinon les images sur plusieurs onglets de rendu, et
Chromium ne rastérise pas un même texte au même sous-pixel d'un onglet à
l'autre : les images d'un même plan alternaient entre deux rastérisations du
même texte — invisible à l'œil, mais 7 000 pixels d'écart une image sur
deux, et contraire à la promesse d'un texte rigoureusement immobile. Un seul
onglet rend toutes les images : elles sont identiques au pixel près. Le coût
est de 42 s par spot au lieu de 26.

Dans le même esprit, la transformation du bloc de texte est **retirée** une
fois la phrase posée, et non mise à zéro : un `transform: translateY(0px)`
résiduel promeut le bloc en couche composée, ce qui n'a aucune raison
d'être. Ces deux points ont été trouvés en mesurant le fichier rendu ; la
relecture du code ne les aurait pas trouvés.

## Structure

```
src/config.ts                 CONFIGURATION UNIQUE : charte, grille, rythme,
                              chemins d'actifs. Aucun composant ne contient
                              de couleur ni de durée en dur.
src/spots/index.ts            les 14 spots : copie, schéma, libellés
src/brand.ts                  actifs de marque — généré, ne pas éditer
src/fonts.ts                  chargement d'Outfit avant la première image
src/Root.tsx                  les 14 compositions
src/SpotFilm.tsx              le montage commun
src/components/
  PhraseScreen.tsx            la phrase entière en 0,30 s, puis immobile
  SceneFrame.tsx              fond et volet d'entrée
  EndCard.tsx                 message final, logo, cambiste.app
  CambisteLogo.tsx            logotype officiel + marque vectorielle
  visuals/index.tsx           les 14 schémas et leurs primitives
scripts/render-all.mjs        rendu des 14 films
scripts/verify.mjs            les six contrôles
```

## Commandes

```bash
npm install
npm start                      # Remotion Studio
npm run render                 # les 14 -> out/
node scripts/render-all.mjs 03 # un seul
npm run typecheck
```

## Points à connaître

**Le carton de fin des spots 07 et 11 ne porte que le logo et l'adresse.**
Leur message final est la marque seule — « Cambiste. » — et le logo *est* ce
mot : l'écrire deux fois serait une faute de marque. Quand « Cambiste » est
pris dans une phrase (« Meet Cambiste. », « Build with Cambiste. »), la
phrase est conservée entière.

**Aucune carte d'Afrique.** Le spot 01 ouvre sur un foyer d'activité relié à
plusieurs destinations, pas sur un continent dessiné : un contour approché
par le code serait géographiquement faux, et le brief écarte les clichés
visuels sur l'Afrique. Si une carte officielle en SVG est fournie, elle se
substitue au schéma `arcsOut` sans toucher au reste.

**cambiste.app n'a pas pu être consulté.** La politique réseau de cette
session refuse le domaine (403 sur CONNECT). Le branding vient donc
entièrement des actifs officiels présents dans le dépôt. Si le site porte des
valeurs différentes, tout est centralisé dans `src/config.ts`.

**Les films sont muets.** Aucun actif audio sous licence n'est disponible, ce
qui reste cohérent avec une diffusion LinkedIn où la lecture démarre sans
son.

**La signature officielle de la marque est « Limitless Africa ».** Elle ne
figure sur aucun carton de fin : chaque spot porte son propre message final,
et ajouter la signature ferait un second texte en parallèle, que le brief
exclut.
