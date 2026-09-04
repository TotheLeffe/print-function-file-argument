import {
  CPS,
  FPS,
  LATENCY,
  TAIL,
  framesToRead,
  readSequence,
  toFrames,
} from './reading';

export {FPS} from './reading';

export const CHANNEL = 'SANGWA YAN';

export const KEYWORDS = [
  'POUVOIR',
  'OPPOSITION',
  'DIALOGUE NATIONAL',
  'ÉLECTIONS 2028',
] as const;

/* ------------------------------------------------------------------ *
 * Plan 1 — l'accroche
 * ------------------------------------------------------------------ */

const hookLines = ['Et si Le Prince', 'était congolais ?'];

const hookRead = readSequence(
  [
    {text: hookLines[0], cps: CPS.display, latency: LATENCY.first},
    {text: hookLines[1], cps: CPS.display},
  ],
  // Un quart de seconde d'image seule avant le premier mot.
  toFrames(0.25),
);

export const HOOK = {
  lines: hookLines.map((text, i) => ({text, at: hookRead.cues[i].at})),
  duration: hookRead.end + TAIL,
};

/* ------------------------------------------------------------------ *
 * Plan 2 — le titre
 * ------------------------------------------------------------------ */

const titleWords = ['Machiavel', 'au Congo'];
const tagline = "Le pouvoir sans l'État";

const titleRead = readSequence(
  [
    {text: titleWords[0], cps: CPS.display, latency: LATENCY.first},
    {text: titleWords[1], cps: CPS.display},
    {text: tagline, cps: CPS.body, latency: 0.3},
  ],
  toFrames(0.1),
);

export const TITLE = {
  words: titleWords.map((text, i) => ({text, at: titleRead.cues[i].at})),
  tagline: {text: tagline, at: titleRead.cues[2].at},
  duration: titleRead.end + TAIL,
};

/* ------------------------------------------------------------------ *
 * Plan 3 — les mots-clés
 * ------------------------------------------------------------------ */

/** Les quatre entrées se posent vite : on balaie une liste, on l'enchaîne pas. */
export const KEYWORD_STAGGER = toFrames(0.3);

const keywordsRead = Math.max(
  // Le temps de parcourir la liste entière, une fois qu'elle est là.
  framesToRead(KEYWORDS.join('  '), {cps: CPS.list, latency: LATENCY.first}),
  // …sans jamais couper la dernière entrée avant qu'elle soit lisible.
  (KEYWORDS.length - 1) * KEYWORD_STAGGER +
    framesToRead(KEYWORDS[KEYWORDS.length - 1], {cps: CPS.list}),
);

export const KEYWORDS_BEAT = {
  items: KEYWORDS.map((label, i) => ({label, at: i * KEYWORD_STAGGER})),
  duration: keywordsRead + TAIL,
};

/* ------------------------------------------------------------------ *
 * Plan 4 — l'outro
 * ------------------------------------------------------------------ */

/** Choréographie d'entrée : la carte, puis la mention, le nom, le bouton. */
export const OUTRO_CUES = {card: 0, copy: 8, name: 18, button: 30} as const;

const outroRead = Math.max(
  framesToRead(['Vidéo complète sur', 'YouTube', CHANNEL, "S'abonner"].join(' '), {
    cps: CPS.list,
    latency: LATENCY.first,
  }),
  OUTRO_CUES.button + framesToRead("S'abonner", {cps: CPS.body}),
);

export const OUTRO = {
  duration: outroRead + TAIL,
  /** En fin de réel, on laisse en plus le temps du geste vers le bouton. */
  standaloneDuration: outroRead + TAIL + toFrames(0.8),
};

/* ------------------------------------------------------------------ *
 * Montage
 * ------------------------------------------------------------------ */

/** Le plan suivant mord de deux images sur le précédent : c'est la coupe. */
const OVERLAP = 2;

const assemble = (durations: number[]) => {
  let cursor = 0;
  return durations.map((duration) => {
    const from = cursor;
    cursor += duration - OVERLAP;
    return {from, duration};
  });
};

const [hook, title, keywords, outro] = assemble([
  HOOK.duration,
  TITLE.duration,
  KEYWORDS_BEAT.duration,
  OUTRO.duration,
]);

export const BEATS = {hook, title, keywords, outro} as const;

/** Frames where we hard-cut between beats — a 2-frame flash sells the cut. */
export const CUTS = [title.from, keywords.from, outro.from];

export const DURATION_IN_FRAMES = outro.from + outro.duration;
export const OUTRO_DURATION_IN_FRAMES = OUTRO.standaloneDuration;

/** Récapitulatif imprimé par `npm run timing`. */
export const TIMING_REPORT = () =>
  [
    ['Accroche', HOOK.duration],
    ['Titre', TITLE.duration],
    ['Mots-clés', KEYWORDS_BEAT.duration],
    ['Outro', OUTRO.duration],
  ]
    .map(([name, d]) => `${name}: ${d} images (${((d as number) / FPS).toFixed(2)} s)`)
    .concat([
      `Spot: ${DURATION_IN_FRAMES} images (${(DURATION_IN_FRAMES / FPS).toFixed(2)} s)`,
      `Outro autonome: ${OUTRO_DURATION_IN_FRAMES} images (${(
        OUTRO_DURATION_IN_FRAMES / FPS
      ).toFixed(2)} s)`,
    ])
    .join('\n');
