/**
 * Combien de temps un texte doit rester à l'écran pour être lu.
 *
 * Le minutage du spot n'est pas fixé à la main : chaque plan dure ce que
 * son texte demande. Changez une phrase dans `timeline.ts` et la durée du
 * plan — et celle du spot — suit toute seule.
 *
 * Repères : un sous-titre de streaming plafonne vers 17 caractères par
 * seconde, parce que le spectateur suit l'action en même temps. Un titre
 * plein cadre se lit plus vite : rien d'autre ne réclame le regard. D'où
 * des vitesses un peu plus hautes ici, sans aller jusqu'au flash illisible.
 */
export const FPS = 30;

/** Caractères par seconde, selon le rôle du texte. */
export const CPS = {
  /** Gros titre, une ligne, plein cadre. */
  display: 20,
  /** Phrase courte en corps moyen — accroche, slogan. */
  body: 18,
  /** Liste : on balaie, on ne lit pas mot à mot. */
  list: 18,
} as const;

/** Délai avant que l'œil se pose sur un texte qui vient d'apparaître. */
export const LATENCY = {
  /** Premier texte du plan : il faut d'abord le trouver. */
  first: 0.45,
  /** Suivant : le regard est déjà dans la bonne zone. */
  next: 0.22,
} as const;

/** Respiration en fin de plan, pour ne pas couper sur le dernier mot lu. */
export const TAIL = 5;

export const toFrames = (seconds: number) => Math.round(seconds * FPS);

export type ReadOptions = {
  cps?: number;
  latency?: number;
  /** Plancher : un mot très court a quand même besoin d'exister. */
  min?: number;
};

export const framesToRead = (
  text: string,
  {cps = CPS.body, latency = LATENCY.next, min = 0.5}: ReadOptions = {},
) => toFrames(Math.max(min, latency + [...text].length / cps));

export type Cue = {at: number; duration: number};

/**
 * Enchaîne des textes : chacun apparaît quand le précédent a eu le temps
 * d'être lu. Renvoie les tops d'apparition et la fin de la série.
 */
export const readSequence = (
  items: (ReadOptions & {text: string})[],
  startAt = 0,
) => {
  let at = startAt;
  const cues = items.map((item) => {
    const duration = framesToRead(item.text, item);
    const cue: Cue = {at, duration};
    at += duration;
    return cue;
  });
  return {cues, end: at};
};
