/* =========================================================================
   MAKE THE CONNECTION — configuration unique du film
   Couleurs, durees, textes, cameras, tailles. Rien de tout cela n'est
   ecrit en dur ailleurs.
   ========================================================================= */

export const FPS = 30;
export const DURATION = 900; // 30,000 s exactement

export type Format = 'wide' | 'tall';

export const SIZE = {
  wide: {w: 1920, h: 1080},
  tall: {w: 1080, h: 1920},
} as const;

/* ---- Couleurs -----------------------------------------------------------
   Le brief propose une palette provisoire « a defaut » d'actifs officiels.
   Les actifs officiels existent dans ce depot : le vert et le bleu sont
   ceux de la marque, releves sur la video de marque Cambiste. On garde donc
   la STRUCTURE demandee — fond nuit tres sombre, un accent actif, un bleu
   de profondeur, deux neutres — avec les TEINTES de la marque.

     vert   = le signal actif, ce que Cambiste orchestre ;
     bleu   = la structure et la profondeur, l'infrastructure internationale.

   Aucune autre couleur n'entre dans le film.                               */
export const C = {
  bg: '#07111F', // fond principal, bleu nuit
  bg2: '#0C1B2B', // fond secondaire
  white: '#F4F8FC',
  grey: '#A1B3C5',
  signal: '#0AB064', // vert Cambiste
  signalLit: '#38E39B', // le meme, porte a incandescence
  blue: '#2361EA', // bleu Cambiste
  blueLit: '#69AFFF', // bleu clair — aretes et contours
  metal: '#53708F', // arete metallique discrete
  satin: '#1B3A5C', // surface satinee bleu nuit
} as const;

export const ASSETS = {
  wordmark: 'cambiste-wordmark.png',
  fonts: ['fonts/outfit-latin.woff2', 'fonts/outfit-latin-ext.woff2'],
  family: 'Outfit',
  music: 'score.wav',
} as const;

/* ---- Actes --------------------------------------------------------------
   Le film est continu : ces bornes ne sont pas des diapositives, ce sont
   les moments ou la narration change d'etat.                              */
export const ACT = {
  A: {from: 0, to: 120}, // 0 – 4 s   deux systemes, un vide
  B: {from: 120, to: 210}, // 4 – 7 s   reculer, reveler
  C: {from: 210, to: 390}, // 7 – 13 s  l'intervention Cambiste
  D: {from: 390, to: 510}, // 13 – 17 s une infrastructure coordonnee
  E: {from: 510, to: 690}, // 17 – 23 s les signaux deviennent interface
  F: {from: 690, to: 780}, // 23 – 26 s la promesse
  G: {from: 780, to: 900}, // 26 – 30 s signature
} as const;

/* ---- Textes -------------------------------------------------------------
   Tout le film est en anglais. Chaque bloc declare son entree et sa
   sortie : le montage se lit ici, en une page.                            */
export type Beat = {id: string; lines: string[]; in: number; out: number};

export const BEATS: Beat[] = [
  {id: 'borders', lines: ['Your customers', 'think beyond borders.'], in: 20, out: 150},
  {id: 'connect', lines: ['Your infrastructure', 'should connect them.'], in: 162, out: 252},
  {id: 'orchestration', lines: ['Cambiste', 'Technical orchestration'], in: 266, out: 332},
  {id: 'make', lines: ['Make the connection.'], in: 334, out: 422},
  {id: 'systems', lines: ['Connected systems.', 'Clearer operations.'], in: 432, out: 526},
  {id: 'visibility', lines: ['Visibility', 'at every stage.'], in: 556, out: 676},
  {id: 'serve', lines: ['You serve your customers.'], in: 694, out: 790},
  {id: 'infra', lines: ['We connect the infrastructure.'], in: 722, out: 790},
];

/** Libelles poses dans le decor, petits mais lisibles. */
export const WORLD_LABELS = {
  left: {text: 'African financial institutions', in: 130, out: 330},
  right: {text: 'International payment infrastructure', in: 144, out: 330},
} as const;

/** Les trois natures de signal qui circulent, annoncees l'une apres l'autre. */
export const SIGNAL_LABELS = [
  {text: 'Instructions', in: 404, out: 500},
  {text: 'Status updates', in: 432, out: 506},
  {text: 'Reconciliation data', in: 460, out: 512},
] as const;

export const QUALIFIER = {
  text: 'For banks, mobile money operators and fintechs.',
  in: 744,
  out: 790,
} as const;

/** Mention : Cambiste orchestre, les partenaires executent. */
export const DISCLOSURE = {
  text: 'Financial services provided by the relevant partners.',
  in: 436,
  out: 540,
} as const;

export const SIGNATURE = {
  from: 792,
  tagline: 'Connecting African wallets to Global Banking.',
  cta: "Let's build your next payment corridor.",
  site: 'cambiste.app',
} as const;

/* ---- Interface (sequence E) --------------------------------------------
   Un seul ecran coherent, pas trois captures. Aucun nom de client, aucun
   chiffre de performance, aucun delai annonce.                            */
export const UI = {
  title: 'Payments overview',
  nav: ['Overview', 'Payments', 'Reconciliation', 'Analytics'],
  payment: {
    ref: 'Payment CB-2048',
    kind: 'Business payment',
    destination: 'Destination: Bank account',
  },
  timeline: ['Request received', 'Partner processing', 'Beneficiary credited'],
  reconciliation: {title: 'Reconciliation', state: 'Reference matched'},
  activity: 'Payment activity',
  note: 'Illustrative interface · Demo data',
} as const;

/* ---- Camera -------------------------------------------------------------
   Perspective moderee, presque orthographique. Les positions sont des
   reperes : l'interpolation entre deux reperes est continue, donc la
   camera ne s'arrete jamais net.                                           */
export type Key = {f: number; pos: [number, number, number]; at: [number, number, number]};

export const CAMERA: Record<Format, Key[]> = {
  wide: [
    {f: 0, pos: [-0.5, 0.3, 9.7], at: [-0.5, 0.08, 0]},
    {f: 120, pos: [-0.3, 0.72, 11.3], at: [-0.25, 0.18, 0]},
    {f: 210, pos: [0, 1.0, 13.2], at: [0, 0.35, 0]},
    {f: 300, pos: [0.9, 1.5, 12.2], at: [0.1, 0.7, 0]},
    {f: 390, pos: [0.2, 2.1, 12.6], at: [0, 0.5, 0]},
    {f: 510, pos: [0.1, 2.9, 11.4], at: [0, 0.9, 0]},
    {f: 600, pos: [0.0, 3.4, 10.2], at: [0, 1.4, 0]},
    {f: 690, pos: [0.0, 1.6, 12.8], at: [0, 0.5, 0]},
    {f: 790, pos: [0.0, 0.9, 14.4], at: [0, 0.3, 0]},
    {f: 900, pos: [0.0, 0.8, 15.2], at: [0, 0.3, 0]},
  ],
  tall: [
    {f: 0, pos: [-0.45, 0.25, 8.4], at: [-0.5, 0.05, 0]},
    {f: 120, pos: [-0.3, 0.62, 10.2], at: [-0.25, 0.25, 0]},
    {f: 210, pos: [0, 1.4, 14.6], at: [0, 1.15, 0]},
    {f: 300, pos: [0.46, 1.8, 14.1], at: [0.1, 1.35, 0]},
    {f: 390, pos: [0.2, 2.3, 14.8], at: [0, 1.2, 0]},
    {f: 510, pos: [0.1, 2.9, 13.8], at: [0, 1.35, 0]},
    {f: 600, pos: [0.0, 3.3, 13.2], at: [0, 1.7, 0]},
    {f: 690, pos: [0.0, 1.8, 14.6], at: [0, 1.0, 0]},
    {f: 790, pos: [0.0, 1.2, 15.6], at: [0, 0.7, 0]},
    {f: 900, pos: [0.0, 1.1, 16.2], at: [0, 0.7, 0]},
  ],
};

export const FOV: Record<Format, number> = {wide: 26, tall: 38};

/* ---- Geometrie du decor -------------------------------------------------
   Deux architectures differentes, aussi soignees l'une que l'autre : des
   hauteurs d'interface qui ne tombent pas en face les unes des autres,
   c'est tout le probleme du film.                                          */
export const LEFT_PORTS = [-1.18, 0.0, 1.18]; // hauteurs d'interface, a gauche
export const RIGHT_PORTS = [-0.62, 0.66, 1.84]; // a droite, un autre rythme
export const GAP = {left: -1.72, right: 1.72}; // le vide, en unites de scene
export const SPINE_Y = 2.34; // le plan de coordination, au-dessus du vide
