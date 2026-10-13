import {Easing, interpolate} from 'remotion';

/* =========================================================================
   REGLES D'ANIMATION DE LA SERIE
   Un mouvement principal par plan, des mouvements secondaires discrets, et
   un temps d'arret pour lire. Tout est pilote par le numero d'image : le
   rendu est identique a chaque passage.
   ========================================================================= */

export const EASE = {
  /** Entree franche qui decelere longuement : l'objet se pose. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Deplacement de camera : demarre et s'arrete en douceur. */
  move: Easing.bezier(0.65, 0, 0.35, 1),
  /** Trace d'une ligne : regulier, a peine freine. */
  draw: Easing.bezier(0.4, 0, 0.2, 1),
  /** Sortie : s'en va vite. */
  exit: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

/** Avancement de 0 a 1 d'une animation qui demarre a `from` et dure `dur`. */
export const at = (
  frame: number,
  from: number,
  dur: number,
  ease: (n: number) => number = EASE.out
) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** Avancement qui monte, se maintient, puis redescend. */
export const pulse = (frame: number, from: number, up: number, stay: number, down: number) =>
  at(frame, from, up) * (1 - at(frame, from + up + stay, down, EASE.move));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Decalage entre elements d'une meme famille : le groupe respire. */
export const step = (i: number, frames = 3) => i * frames;

/** Point d'une courbe de Bezier quadratique — sert aux trajets. */
export const quad = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  t: number
): [number, number] => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
};

/** Portion d'une courbe quadratique, de 0 a t — pour la tracer peu a peu. */
export const quadPath = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  t: number
) => {
  if (t <= 0.001) return '';
  const c: [number, number] = [mix(p0[0], p1[0], t), mix(p0[1], p1[1], t)];
  const e = quad(p0, p1, p2, t);
  return `M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${e[0]} ${e[1]}`;
};

/** Longueur approchee d'une courbe quadratique, pour les pointilles. */
export const quadLength = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number]
) => {
  let d = 0;
  let prev = p0;
  for (let i = 1; i <= 24; i++) {
    const p = quad(p0, p1, p2, i / 24);
    d += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  return d;
};

/** Generateur deterministe, repris de la configuration pour les dessins. */
export {rng} from '../config';
