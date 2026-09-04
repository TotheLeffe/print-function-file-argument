import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Layout} from '../layout';
import {CHANNEL} from '../timeline';
import {COLORS, FONTS} from '../theme';

/** Persistent top-corner watermark: whose channel this is. */
export const ChannelTag: React.FC<{layout: Layout; appearAt?: number}> = ({
  layout,
  appearAt = 4,
}) => {
  const frame = useCurrentFrame();
  const {u} = layout;
  const opacity = interpolate(frame, [appearAt, appearAt + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(frame, [appearAt, appearAt + 10], [u(-20), 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: Math.max(u(44), layout.padTop - u(56)),
        left: layout.padX,
        display: 'flex',
        alignItems: 'center',
        gap: u(12),
        opacity,
        transform: `translateX(${slide}px)`,
      }}
    >
      <div style={{width: u(6), height: u(24), backgroundColor: COLORS.red}} />
      <span
        style={{
          fontFamily: `${FONTS.ui}, sans-serif`,
          fontWeight: 700,
          fontSize: u(21),
          letterSpacing: u(4),
          color: COLORS.bone,
          textTransform: 'uppercase',
          textShadow: '0 4px 18px rgba(0,0,0,0.9)',
        }}
      >
        {CHANNEL}
      </span>
    </div>
  );
};
