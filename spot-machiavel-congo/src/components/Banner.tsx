import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Layout} from '../layout';
import {COLORS, FONTS} from '../theme';

type Props = {
  layout: Layout;
  at: number;
  children: React.ReactNode;
};

/** Red slab that wipes across, echoing the brushstroke on the thumbnail. */
export const Banner: React.FC<Props> = ({layout, at, children}) => {
  const frame = useCurrentFrame();
  const {u} = layout;
  const t = frame - at;

  const wipe = interpolate(t, [0, 11], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // The label rides in a touch behind the slab edge.
  const textIn = interpolate(t, [4, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        marginTop: u(22),
        backgroundColor: COLORS.red,
        padding: `${u(12)}px ${u(30)}px ${u(15)}px`,
        transform: 'skewX(-8deg)',
        clipPath: `inset(0 ${wipe}% 0 0)`,
        boxShadow: '0 14px 44px rgba(0,0,0,0.6)',
      }}
    >
      <span
        style={{
          display: 'block',
          transform: `skewX(8deg) translateX(${(1 - textIn) * u(30)}px)`,
          opacity: textIn,
          fontFamily: `${FONTS.ui}, sans-serif`,
          fontWeight: 700,
          fontSize: u(46),
          letterSpacing: u(3),
          color: COLORS.bone,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </div>
  );
};
