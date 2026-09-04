import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

/**
 * The 2-frame blink that sits on top of a hard cut. Without it the beats
 * read as dissolves on a phone screen; with it they punch.
 */
export const FlashCut: React.FC<{at: number[]}> = ({at}) => {
  const frame = useCurrentFrame();
  const nearest = at.reduce(
    (best, f) => (Math.abs(frame - f) < Math.abs(frame - best) ? f : best),
    at[0] ?? -999,
  );
  const opacity = interpolate(Math.abs(frame - nearest), [0, 1, 3], [0.85, 0.3, 0], {
    extrapolateRight: 'clamp',
  });

  if (opacity <= 0) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{backgroundColor: COLORS.bone, opacity, mixBlendMode: 'screen'}}
    />
  );
};
