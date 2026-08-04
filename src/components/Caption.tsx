import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, easeUp} from '../theme';

// Sous-titre « voix off » : grande phrase centrée en bas de scène.
export const Caption: React.FC<{
  text: string;
  delay?: number;
  bottom?: number;
  accent?: boolean;
}> = ({text, delay = 0, bottom = 92, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const anim = easeUp(frame, fps, delay, 28);
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        ...anim,
      }}
    >
      <p
        style={{
          margin: 0,
          maxWidth: 1420,
          textAlign: 'center',
          fontSize: 44,
          lineHeight: 1.35,
          fontWeight: 600,
          letterSpacing: -0.6,
          color: accent ? COLORS.blue : COLORS.navy,
        }}
      >
        {text}
      </p>
    </div>
  );
};
