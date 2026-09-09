import {Easing} from 'remotion';

/* =========================================================================
   Charte et grille du film.
   Une seule source pour les couleurs, les durees et les courbes : le
   decoupage se DERIVE des durees, il n'est jamais saisi deux fois.
   ========================================================================= */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;

/** Marge de securite. Le brief en demande 80 ; on tient 96. */
export const SAFE = 96;
export const CONTENT_W = WIDTH - SAFE * 2;

export const C = {
  offWhite: '#F3F6F2',
  green: '#00A66A',
  deep: '#004D35',
  ink: '#101311',
  mint: '#BCE9D7',
  blue: '#2563EB',
  white: '#FFFFFF',
} as const;

/**
 * Courbes. Le brief demande un mouvement precis et pose, sans rebond :
 * une sortie franche qui decelere longuement, et un accompagnement doux
 * pour les volets.
 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Ressort a rebond quasi nul, pour les entrees qui doivent « se poser ». */
export const SPRING_SETTLE = {damping: 200, mass: 0.6, stiffness: 110} as const;

/* ---- Decoupage ---------------------------------------------------------
   Les six plans du storyboard, en secondes. Total exact : 21,00 s.        */
export const SCENE_SECONDS = {
  mortality: 3.5, // 0,0 – 3,5   « most products don't die all at once »
  attention: 3.5, // 3,5 – 7,0   « they die when people stop caring »
  returning: 4.0, // 7,0 – 11,0  « but if people keep coming back… »
  movement: 3.5, // 11,0 – 14,5  « if money keeps moving… »
  alive: 3.5, // 14,5 – 18,0     « you're not dead yet. »
  signature: 3.0, // 18,0 – 21,0 carton de fin
} as const;

export type SceneId = keyof typeof SCENE_SECONDS;

const ORDER: SceneId[] = [
  'mortality',
  'attention',
  'returning',
  'movement',
  'alive',
  'signature',
];

export type SceneCut = {id: SceneId; start: number; frames: number; end: number};

export const CUTS: SceneCut[] = (() => {
  let t = 0;
  return ORDER.map((id) => {
    const frames = Math.round(SCENE_SECONDS[id] * FPS);
    const cut = {id, start: t, frames, end: t + frames - 1};
    t += frames;
    return cut;
  });
})();

export const cut = (id: SceneId): SceneCut => {
  const found = CUTS.find((c) => c.id === id);
  if (!found) throw new Error(`plan inconnu : ${id}`);
  return found;
};

export const TOTAL_FRAMES = CUTS.reduce((n, c) => n + c.frames, 0);

/** Duree des volets, en images. Ample plutot que sec. */
export const WIPE = 16;

/* ---- Generateur pseudo-aleatoire deterministe --------------------------
   Aucun Math.random nulle part : deux rendus doivent etre identiques.     */
export const rng = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
