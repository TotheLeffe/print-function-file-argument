import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Layout} from '../layout';
import {shake} from '../shake';

type Props = {
  layout: Layout;
  /** Frames (relative to the beat) where the stage should get kicked. */
  impacts?: number[];
  align?: 'top' | 'center' | 'bottom';
  children: React.ReactNode;
};

/**
 * Safe-area padded content box. Vertical formats sit the copy low, where
 * the eye lands on a phone; 16:9 centres it.
 */
export const Stage: React.FC<Props> = ({layout, impacts = [], align, children}) => {
  const frame = useCurrentFrame();
  const {x, y, rot} = shake(frame, impacts, layout.u(13));

  const resolved = align ?? (layout.isVertical ? 'bottom' : 'center');
  const justify =
    resolved === 'bottom' ? 'flex-end' : resolved === 'top' ? 'flex-start' : 'center';

  return (
    <AbsoluteFill
      style={{
        padding: `${layout.padTop}px ${layout.padX}px ${layout.padBottom}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
        alignItems: 'flex-start',
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
