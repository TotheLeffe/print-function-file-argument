import {interpolate} from 'remotion';

/**
 * Decaying camera kick after an impact frame. Returns pixel offsets so the
 * whole stage can lurch when a title word lands.
 */
export const shake = (frame: number, impacts: number[], amount = 14) => {
  let x = 0;
  let y = 0;
  let rot = 0;

  for (const impact of impacts) {
    const t = frame - impact;
    if (t < 0 || t > 12) {
      continue;
    }
    const decay = interpolate(t, [0, 12], [1, 0], {extrapolateRight: 'clamp'});
    const energy = decay * decay * amount;
    x += Math.sin(t * 2.1) * energy;
    y += Math.cos(t * 2.7) * energy * 0.6;
    rot += Math.sin(t * 1.7) * decay * decay * 0.35;
  }

  return {x, y, rot};
};
