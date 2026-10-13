/* =========================================================================
   PARAMETRES CENTRALISES DE LA SERIE
   Charte, grille, rythme. Aucun composant ne contient de couleur, de duree
   ni de chemin d'actif en dur.
   ========================================================================= */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1350; // 4:5, le format vertical de LinkedIn

/** 450 images exactement = 15,000 s. Une assertion le verifie plus bas. */
export const TOTAL_FRAMES = 450;

/** Marges confortables : le contenu ne s'en approche jamais. */
export const SAFE_X = 96;
export const SAFE_Y = 120;
export const CONTENT_W = WIDTH - SAFE_X * 2;

/* ---- Couleurs officielles ----------------------------------------------
   Relevees sur les aplats de la video de marque Cambiste fournie, jamais
   estimees. Le site cambiste.app reste inaccessible depuis cette session
   (la politique reseau refuse le domaine), donc rien n'en est tire.       */
export const COLORS = {
  green: '#0AB064', // vert Cambiste, releve sur le carre de la marque
  mint: '#E8F6EF', // vert de marque eclairci — fonds de schema
  leaf: '#7FD9AE', // vert clair — liens et traits secondaires
  deep: '#055731', // vert de marque assombri — plans de chute
  ink: '#0B0B0C', // encre, relevee sur le logotype
  slate: '#6B7A72', // gris-vert — libelles secondaires des schemas
  white: '#FFFFFF',
} as const;

export type ColorKey = keyof typeof COLORS;

/* ---- Grille verticale ---------------------------------------------------
   Deux bandes qui ne se chevauchent jamais : le message en haut, le schema
   en bas. Les composants lisent ces valeurs, ils ne les redefinissent pas.  */
export const GRID = {
  textTop: SAFE_Y, // 120
  textBottom: 740, // le bloc de texte est centre dans 120 – 740
  visTop: 770, // 30 px de respiration sous le texte
  visBottom: HEIGHT - SAFE_Y - 15, // 1215
} as const;

/** Encre sur fonds clairs, blanc sur le vert : le contraste est impose. */
export const textOn = (bg: ColorKey) =>
  bg === 'green' || bg === 'deep' ? COLORS.white : COLORS.ink;

export const ASSETS = {
  wordmark: 'cambiste-wordmark.png', // logotype officiel, masque alpha 494 x 85
  fonts: ['fonts/outfit-latin.woff2', 'fonts/outfit-latin-ext.woff2'],
  fontFamily: 'Outfit',
  website: 'cambiste.app',
} as const;

/* ---- Rythme -------------------------------------------------------------
   Quatre sequences imposees : 0–3 s, 3–7 s, 7–11 s, 11–15 s.

   REVEAL : la phrase entiere parait en 9 images = 0,30 s. Toutes les lignes
   ensemble — jamais de machine a ecrire, jamais de defilement.

   WIPE : 9 images = 0,30 s. Le plan entrant se decouvre PAR-DESSUS le
   sortant : un fondu ferait cohabiter deux messages a l'image.

   VISUAL_START : le schema ne commence a s'animer qu'une fois la phrase
   posee ET le volet termine. Jamais d'animation avant que le texte soit lu. */
export const REVEAL = 9;
export const WIPE = 9;
export const REVEAL_START = 5; // phrase complete a l'image 14
export const READABLE_FROM = Math.max(WIPE, REVEAL_START + REVEAL); // 14
export const VISUAL_START = READABLE_FROM + 4; // 18 : le texte a eu le temps

export const SEQUENCE_FRAMES = [90, 120, 120, 120] as const;

const total = SEQUENCE_FRAMES.reduce((a, b) => a + b, 0);
if (total !== TOTAL_FRAMES) {
  throw new Error(`sequences a ${total} images, attendu ${TOTAL_FRAMES}`);
}

/** Bornes derivees des durees : jamais saisies deux fois. */
export const CUTS = SEQUENCE_FRAMES.map((frames, i) => {
  const start = SEQUENCE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0);
  return {index: i, start, frames, end: start + frames - 1};
});

/* ---- Typographie --------------------------------------------------------
   Le corps se deduit de la ligne la plus longue : aucune mesure DOM, donc
   un resultat identique a chaque rendu. Deux lignes au maximum.           */
/** Largeur moyenne d'un caractere d'Outfit 800, en fraction du corps. */
export const CAP_EM = 0.545;

/** Part de la colonne qu'une ligne occupe au plus : 6 % de reserve absorbe
    l'ecart entre cette estimation et les metriques reelles de la police. */
export const FILL = 0.94;

export const headlineSize = (lines: string[]) => {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  const fitted = (CONTENT_W * FILL) / (longest * CAP_EM);
  return Math.round(Math.max(56, Math.min(112, fitted)));
};

/* ---- Generateur pseudo-aleatoire deterministe -------------------------- */
export const rng = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
