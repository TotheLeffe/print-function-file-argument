import {interpolate, spring} from 'remotion';

export const COLORS = {
  navy: '#0A2540',
  blue: '#2563EB',
  blueDark: '#1D4FD7',
  blueSoft: '#EAF1FF',
  green: '#1FBF71',
  greenDark: '#149A5B',
  greenSoft: '#E7F8F0',
  red: '#E5484D',
  redSoft: '#FDEBEC',
  slate: '#5B6B7F',
  slateLight: '#94A3B8',
  white: '#FFFFFF',
  bg: '#F7FAFD',
  border: '#E3EAF3',
};

export const FONT = `'Inter', 'Helvetica Neue', Arial, sans-serif`;

export const CARD_SHADOW = '0 18px 50px rgba(10, 37, 64, 0.10)';
export const CARD_SHADOW_SOFT = '0 10px 30px rgba(10, 37, 64, 0.07)';

// Entrée douce : fondu + translation verticale pilotés par un spring amorti.
export const easeUp = (
  frame: number,
  fps: number,
  delay: number,
  distance = 40
): {opacity: number; transform: string} => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 110},
    durationInFrames: 34,
  });
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

// Apparition avec léger rebond, pour les éléments "pop" (badges, pastilles).
export const pop = (frame: number, fps: number, delay: number): number => {
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, stiffness: 170, mass: 0.7},
  });
};

// Progression 0 → 1 du sourire des avatars.
export const interpolateSmile = (frame: number, delay: number): number => {
  return interpolate(frame, [delay, delay + 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const fadeInOut = (
  frame: number,
  duration: number,
  fade = 12
): number => {
  return interpolate(
    frame,
    [0, fade, duration - fade, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
};
