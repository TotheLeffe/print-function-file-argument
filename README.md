# Cambiste — Spots publicitaires Remotion

Deux spots vidéo corporate premium réalisés avec
[Remotion](https://www.remotion.dev/), en 1920×1080 à 30 i/s. Style minimaliste
bleu/blanc, accent vert repris du logo Cambiste.

- **`CambisteLinkedIn`** — spot français 30 s pour LinkedIn (4 scènes).
- **`CambisteGlobal`** — spot international anglais 40 s, façon film de marque
  (5 scènes, transitions croisées, scènes sombres « réseau mondial »).

## CambisteLinkedIn — découpage (30 s)

| Scène | Temps | Contenu |
|---|---|---|
| 1 | 0–7 s | Un commerçant à Abidjan ne peut pas payer son fournisseur en Europe depuis son portefeuille Mobile Money (route bloquée). |
| 2 | 7–15 s | Animation du flux : Mobile Money → Cambiste → Paiement international → Fournisseur, avec devises (CFA, USD, EUR) qui circulent. |
| 3 | 15–24 s | Le fournisseur reçoit le virement en euros, les deux parties sourient. Bénéfices : paiement rapide, conforme, intégration API, sans changer les habitudes. |
| 4 | 24–30 s | Animation officielle du logo (« Limitless Africa », avec son) + slogan « Le Mobile Money ne s’arrête plus aux frontières. » + CTA « Book a demo ». |

Le branding provient de la vidéo officielle fournie (`public/brand/`) :
l'animation de révélation est jouée telle quelle dans la scène 4, et le
logo/pictogramme utilisés dans les scènes 1 à 3 en sont extraits.

## CambisteGlobal — découpage (40 s)

| Scène | Temps | Contenu |
|---|---|---|
| 1 — Africa | 0–7 s | Gros plan sur l'ouverture de l'app Mobile Money, lumière naturelle, lent zoom. « Mobile Money transformed how Africa moves money. » |
| 2 — Reality | 6,5–14 s | Le paiement fournisseur bute sur une barrière entre Mobile Money et le réseau bancaire. « But the global economy still runs on banking infrastructure. » |
| 3 — The Connection | 13,5–22,5 s | La barrière disparaît, un pont lumineux relie les deux mondes, le logo se pose dessus. « Mobile Money → Banking System ». « Cambiste changes that. » |
| 4 — Possibilities | 22–33,5 s | Arcs lumineux Afrique ↔ Europe/Amérique/Asie et vignettes d'usages (fournisseur, scolarité, freelance, facture). « One connection. Global banking access. Powered directly from Mobile Money. » |
| 5 — Closing | 33–40 s | Révélation officielle du logo (avec son), « Mobile Money. Connected to the Global Banking System. », fondu au noir, carton « Connecting Africa to Global Finance. » |

## Commandes

```bash
npm install
npm run dev            # Remotion Studio (prévisualisation)
npm run render         # rend out/cambiste-linkedin-30s.mp4
npm run render:global  # rend out/cambiste-global-40s.mp4
```

Astuce : si un long rendu échoue en fin de parcours sur un timeout de police
(onglet Chromium gelé), rendre en deux moitiés avec `--frames=0-599` puis
`--frames=600-1199` et `--enforce-audio-track`, et concaténer les deux MP4
(`ffmpeg -f concat -c copy`).

Les textes de voix off sont affichés à l’écran en sous-titres ; une piste
audio (voix off + musique) peut être ajoutée via le composant `<Audio>` de
Remotion dans `src/CambisteAd.tsx`.
