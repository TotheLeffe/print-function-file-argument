import {Easing, interpolate} from 'remotion';
import {Key} from './config';

/* =========================================================================
   Toute l'animation est pilotee par le numero d'image. Aucune horloge,
   aucun tirage aleatoire, aucune simulation : deux rendus successifs
   donnent le meme fichier.
   ========================================================================= */

export const EASE = {
  /** Entree franche qui decelere longuement : l'objet se pose. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Deplacement : demarre et s'arrete en douceur. Le mouvement de camera. */
  move: Easing.bezier(0.62, 0, 0.3, 1),
  /** Trace : regulier, a peine freine. */
  draw: Easing.bezier(0.4, 0, 0.2, 1),
  /** Sortie : s'en va vite. */
  exit: Easing.bezier(0.6, 0, 0.9, 0.2),
} as const;

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

/**
 * Opacite d'un bloc qui entre, tient, puis sort.
 *
 * `ease` compte : une sortie d'exponentielle bouge enormement des la
 * premiere image, ce qui convient a un texte qui doit se poser vite, mais
 * fait apparaitre d'un coup un grand aplat. Pour une surface large, on
 * prend une courbe qui demarre lentement.
 */
export const band = (
  frame: number,
  from: number,
  to: number,
  enter = 12,
  leave = 10,
  ease: (n: number) => number = EASE.out
) => at(frame, from, enter, ease) * (1 - at(frame, to - leave, leave, EASE.move));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Interpolation continue entre reperes de camera. */
export const sampleKeys = (keys: Key[], frame: number) => {
  let i = 0;
  while (i < keys.length - 2 && frame >= keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = EASE.move(clamp01((frame - a.f) / Math.max(1, b.f - a.f)));
  const lerp3 = (p: [number, number, number], q: [number, number, number]) =>
    [mix(p[0], q[0], t), mix(p[1], q[1], t), mix(p[2], q[2], t)] as [number, number, number];
  return {pos: lerp3(a.pos, b.pos), at: lerp3(a.at, b.at)};
};
