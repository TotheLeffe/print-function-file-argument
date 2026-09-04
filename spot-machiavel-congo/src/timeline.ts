/**
 * The whole spot is 5 seconds. Every number below is a frame at 30 fps,
 * kept in one place so the four beats can be re-timed without hunting
 * through the components.
 */
export const FPS = 30;
export const DURATION_IN_FRAMES = 5 * FPS; // 150

export const BEATS = {
  hook: {from: 0, duration: 47},
  title: {from: 45, duration: 51},
  keywords: {from: 94, duration: 27},
  outro: {from: 119, duration: 31},
} as const;

/** Frames where we hard-cut between beats — a 2-frame flash sells the cut. */
export const CUTS = [BEATS.title.from, BEATS.keywords.from, BEATS.outro.from];

export const KEYWORDS = [
  'POUVOIR',
  'OPPOSITION',
  'DIALOGUE NATIONAL',
  'ÉLECTIONS 2028',
] as const;

export const CHANNEL = 'SANGWA YAN';

/** Standalone end card, to append to every reel of the series. */
export const OUTRO_DURATION_IN_FRAMES = 3 * FPS; // 90
