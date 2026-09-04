import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONTS} from '../theme';

type Props = {
  children: React.ReactNode;
  /** Frame (relative to the enclosing Sequence) where the word lands. */
  at: number;
  fontSize: number;
  color: string;
  lineHeight?: number;
  letterSpacing?: number;
  skew?: number;
  style?: React.CSSProperties;
};

/**
 * Display type that arrives like a stamp: overscaled and blurred, snapped
 * to size by a stiff spring.
 */
export const SlamText: React.FC<Props> = ({
  children,
  at,
  fontSize,
  color,
  lineHeight = 0.86,
  letterSpacing = -0.5,
  skew = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame - at;

  const s = spring({
    frame: t,
    fps,
    config: {damping: 13, mass: 0.55, stiffness: 190},
    durationInFrames: 22,
  });

  const scale = interpolate(s, [0, 1], [1.45, 1]);
  const blur = interpolate(s, [0, 0.45, 1], [22, 4, 0], {extrapolateRight: 'clamp'});
  const opacity = interpolate(t, [0, 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontFamily: `${FONTS.display}, Impact, sans-serif`,
        fontSize,
        lineHeight,
        color,
        letterSpacing,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        opacity,
        filter: `blur(${blur}px)`,
        transform: `scale(${scale}) skewX(${skew}deg)`,
        transformOrigin: 'left center',
        textShadow: '0 10px 40px rgba(0,0,0,0.75)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
