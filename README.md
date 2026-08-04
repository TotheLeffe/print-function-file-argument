# Cambiste — Spot publicitaire LinkedIn (30 s)

Spot vidéo corporate premium réalisé avec [Remotion](https://www.remotion.dev/) :
1920×1080, 30 i/s, 900 images. Style minimaliste bleu/blanc, accent vert repris
du logo Cambiste.

## Découpage

| Scène | Temps | Contenu |
|---|---|---|
| 1 | 0–7 s | Un commerçant à Abidjan ne peut pas payer son fournisseur en Europe depuis son portefeuille Mobile Money (route bloquée). |
| 2 | 7–15 s | Animation du flux : Mobile Money → Cambiste → Paiement international → Fournisseur, avec devises (CFA, USD, EUR) qui circulent. |
| 3 | 15–24 s | Le fournisseur reçoit le virement en euros, les deux parties sourient. Bénéfices : paiement rapide, conforme, intégration API, sans changer les habitudes. |
| 4 | 24–30 s | Logo + slogan « Le Mobile Money ne s’arrête plus aux frontières. » + CTA « Book a demo ». |

## Commandes

```bash
npm install
npm run dev      # Remotion Studio (prévisualisation)
npm run render   # rend out/cambiste-linkedin-30s.mp4
```

Les textes de voix off sont affichés à l’écran en sous-titres ; une piste
audio (voix off + musique) peut être ajoutée via le composant `<Audio>` de
Remotion dans `src/CambisteAd.tsx`.
