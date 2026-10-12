/* =========================================================================
   CONFIGURATION UNIQUE DU FILM
   Textes, couleurs, durees et chemins d'actifs vivent ici et nulle part
   ailleurs. Les composants ne contiennent aucune chaine de caractere ni
   aucune couleur en dur.
   ========================================================================= */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;

/** 450 images exactement, soit 15,000 s. Verifie par assertion plus bas. */
export const TOTAL_FRAMES = 450;

/** Marge de securite genereuse : le texte ne s'en approche jamais. */
export const SAFE = 96;
export const CONTENT_W = WIDTH - SAFE * 2;

/* ---- Couleurs officielles ----------------------------------------------
   Relevees sur les aplats de la video de marque Cambiste fournie, jamais
   estimees. Le site cambiste.app n'a pas pu etre consulte : la politique
   reseau de cette session refuse le domaine (403 sur CONNECT).            */
export const COLORS = {
  green: '#0AB064', // vert Cambiste, releve sur le carre de la marque
  mint: '#E8F6EF', // vert de marque eclairci — fond du plan reseau
  leaf: '#7FD9AE', // vert clair — liens du reseau
  ink: '#0B0B0C', // encre, releve sur le logotype
  white: '#FFFFFF',
} as const;

export const ASSETS = {
  wordmark: 'cambiste-wordmark.png', // logotype officiel, masque alpha 494 x 85
  fonts: ['fonts/outfit-latin.woff2', 'fonts/outfit-latin-ext.woff2'],
  fontFamily: 'Outfit',
} as const;

/* ---- Rythme -------------------------------------------------------------
   Priorite absolue du brief : le temps de lecture confortable.

   REVEAL : la phrase entiere apparait en 9 images = 0,30 s. Toutes les
   lignes ensemble, jamais lettre a lettre, jamais de defilement.

   WIPE : le plan entrant se decouvre derriere un bord qui glisse. Il se
   deroule AU DEBUT du plan et recouvre le plan sortant, ce qui evite tout
   fondu ou les deux messages coexisteraient.

   La phrase devient lisible au plus tard a max(WIPE, REVEAL_START+REVEAL),
   d'ou REVEAL_START choisi pour que les deux s'achevent ensemble.          */
export const REVEAL = 9; // 0,30 s
export const WIPE = 8; // 0,27 s
export const REVEAL_START = 5; // phrase complete a l'image 14

export type WipeDirection = 'none' | 'fromBottom' | 'fromTop' | 'fromLeft';

export type Scene = {
  id: string;
  frames: number;
  background: keyof typeof COLORS;
  wipe: WipeDirection;
  /** Lignes equilibrees d'une seule et meme phrase. */
  lines?: string[];
  fontSize?: number;
  /** Image a laquelle la phrase est complete et stable, relative au plan. */
  readableFrom: number;
};

/* ---- Decoupage ----------------------------------------------------------
   Les quatre ecrans du brief. Un message par ecran, rien d'autre a l'image. */
export const SCENES: Scene[] = [
  {
    id: 'traction',
    frames: 90, // 0 – 3 s
    background: 'white',
    wipe: 'none',
    lines: ['Our pre-seed', 'traction'],
    fontSize: 126,
    readableFrom: REVEAL_START + REVEAL, // 14
  },
  {
    id: 'pipeline',
    frames: 120, // 3 – 7 s
    background: 'green',
    wipe: 'fromBottom',
    lines: ['is becoming', 'a structured', 'sales pipeline.'],
    fontSize: 100,
    readableFrom: Math.max(WIPE, REVEAL_START + REVEAL), // 14
  },
  {
    id: 'partners',
    frames: 120, // 7 – 11 s
    background: 'mint',
    wipe: 'fromTop',
    lines: ['With world-class', 'partners.'],
    fontSize: 96,
    readableFrom: Math.max(WIPE, REVEAL_START + REVEAL), // 14
  },
  {
    id: 'closing',
    frames: 120, // 11 – 15 s
    background: 'white',
    wipe: 'fromLeft',
    readableFrom: 14, // carton complet : logo, signature et adresse poses
  },
];

/** Textes du carton de fin. Aucune autre mention n'apparait a l'image. */
export const CLOSING = {
  tagline: 'Connecting Africa to global payments.',
  website: 'cambiste.app',
  logoHeight: 108,
  taglineSize: 46,
  websiteSize: 38,
  /** Fenetres de pose, relatives au plan : tout est en place a l'image 13. */
  logoIn: [3, 12] as const,
  taglineIn: [5, 14] as const,
  websiteIn: [6, 14] as const,
} as const;

/* ---- Decoupage derive ---------------------------------------------------
   Les bornes se calculent a partir des durees : elles ne sont jamais
   saisies deux fois, donc ne peuvent pas diverger du montage.             */
export type Cut = Scene & {start: number; end: number};

export const CUTS: Cut[] = (() => {
  let t = 0;
  return SCENES.map((s) => {
    const c = {...s, start: t, end: t + s.frames - 1};
    t += s.frames;
    return c;
  });
})();

const sum = CUTS.reduce((n, c) => n + c.frames, 0);
if (sum !== TOTAL_FRAMES) {
  throw new Error(`decoupage a ${sum} images, attendu ${TOTAL_FRAMES}`);
}

/** Temps de lecture stable de chaque ecran, en secondes. */
export const readableSeconds = (c: Cut) => (c.frames - c.readableFrom) / FPS;

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
