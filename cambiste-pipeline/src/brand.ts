/* Actifs de marque Cambiste — EXTRAITS de la video de marque officielle,
   jamais redessines. Genere par cambiste-spot/tools/extract_brand.py.
   Le logotype est un masque alpha a sa resolution native (public/…png) ;
   la marque est vectorielle : carre en superellipse ajustee sur le profil
   mesure, et glyphe dont le second lobe est la rotation exacte du premier. */
export const MARK = {
  w: 110, h: 84,          // boite native
  R: 21, n: 1.6,          // coin en superellipse (squircle)
  cx: 49.545, cy: 37.727,      // centre de symetrie, unites viewBox
  vbw: 100, vbh: 76.364,
  lobe: 'M29.02 55.21 C29.68 54.89 30.28 54.32 31.23 53.06 C31.7 52.44 32.15 51.94 33.2 50.86 C34.28 49.77 34.7 49.3 35.17 48.67 C35.5 48.24 36.03 47.6 36.36 47.26 C36.68 46.92 37.23 46.27 37.58 45.81 C38.07 45.16 38.49 44.69 39.55 43.61 C40.95 42.18 41.27 41.8 41.82 40.89 C42.36 40.0 42.74 39.53 44.12 38.13 C45.5 36.73 45.82 36.34 46.36 35.44 C46.9 34.54 47.28 34.08 48.69 32.65 C49.74 31.58 50.15 31.12 50.62 30.49 C50.95 30.05 51.49 29.42 51.81 29.08 C52.14 28.74 52.68 28.1 53.01 27.65 C53.4 27.13 53.96 26.5 54.55 25.89 C55.54 24.86 55.86 24.46 56.36 23.62 C56.93 22.68 57.29 22.25 59.14 20.38 C61.0 18.49 61.22 18.24 61.81 17.27 C62.0 16.95 62.32 16.44 62.52 16.14 C63.51 14.62 63.12 13.84 61.31 13.68 C60.19 13.59 36.96 13.65 36.55 13.75 C34.61 14.23 35.31 16.28 38.01 18.06 C40.67 19.81 41.1 22.31 39.09 24.52 C38.68 24.97 37.48 26.54 36.47 27.94 C36.18 28.34 35.51 29.04 33.66 30.91 C31.52 33.07 31.16 33.45 30.62 34.17 C30.22 34.69 29.68 35.32 29.06 35.97 C28.09 36.98 27.77 37.37 27.15 38.39 C26.96 38.71 26.65 39.17 26.47 39.42 C25.82 40.32 25.63 40.78 25.45 41.89 C25.33 42.68 25.28 42.88 24.93 43.86 C23.94 46.63 24.28 50.08 25.84 53.21 C26.61 54.75 28.06 55.66 29.02 55.21 Z',
} as const;

export const WORDMARK = {
  src: 'cambiste-wordmark.png',
  ratio: 5.8118,   // largeur / hauteur de capitale, natif 494x85
} as const;

export const TAGLINE = 'Limitless Africa';
