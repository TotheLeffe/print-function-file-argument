import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import {G1Africa} from './scenes/global/G1Africa';
import {G2Barrier} from './scenes/global/G2Barrier';
import {G3Connection} from './scenes/global/G3Connection';
import {G4Possibilities} from './scenes/global/G4Possibilities';
import {G5Closing} from './scenes/global/G5Closing';
import {COLORS, FONT} from './theme';

// Chaque scène chevauche la précédente de 15 images et fond en entrée,
// pour des transitions croisées sans passage par le blanc.
const FadeIn: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 15], [0, 1], {
          extrapolateRight: 'clamp',
        }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Spot international 40 s : 5 scènes à 30 i/s (1200 images).
export const CambisteGlobalAd: React.FC = () => {
  return (
    <AbsoluteFill
      style={{backgroundColor: COLORS.white, fontFamily: FONT}}
    >
      <Sequence from={0} durationInFrames={210}>
        <G1Africa />
      </Sequence>
      <Sequence from={195} durationInFrames={225}>
        <FadeIn>
          <G2Barrier />
        </FadeIn>
      </Sequence>
      <Sequence from={405} durationInFrames={270}>
        <FadeIn>
          <G3Connection />
        </FadeIn>
      </Sequence>
      <Sequence from={660} durationInFrames={345}>
        <FadeIn>
          <G4Possibilities />
        </FadeIn>
      </Sequence>
      <Sequence from={990} durationInFrames={210}>
        <FadeIn>
          <G5Closing />
        </FadeIn>
      </Sequence>
    </AbsoluteFill>
  );
};
