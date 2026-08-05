import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, easeUp} from '../../theme';

const REVEAL_FRAMES = 120;

// Scène 5 — Clôture. Révélation officielle du logo, grande typographie,
// fondu au noir et carton final.
export const G5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const toBlack = interpolate(frame, [148, 170], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const endCard = easeUp(frame, fps, 172, 26);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.white}}>
      <Img
        src={staticFile('brand/cambiste-reveal-last.png')}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      />
      {frame < REVEAL_FRAMES ? (
        <OffthreadVideo
          src={staticFile('brand/cambiste-reveal.mp4')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 150,
          display: 'flex',
          justifyContent: 'center',
          ...easeUp(frame, fps, 62, 40),
        }}
      >
        <h1
          style={{
            margin: 0,
            maxWidth: 1560,
            textAlign: 'center',
            fontSize: 62,
            lineHeight: 1.16,
            fontWeight: 800,
            letterSpacing: -1.6,
            color: COLORS.navy,
          }}
        >
          Mobile Money. Connected to the Global Banking System.
        </h1>
      </div>

      {/* Fondu au noir puis carton final */}
      <AbsoluteFill
        style={{
          backgroundColor: '#000',
          opacity: toBlack,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 30,
            ...endCard,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <span
              style={{
                fontWeight: 800,
                fontSize: 84,
                letterSpacing: -2,
                color: COLORS.white,
              }}
            >
              Cambiste
            </span>
            <Img
              src={staticFile('brand/cambiste-mark-alpha.png')}
              style={{width: 84, height: 'auto'}}
            />
          </div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 32,
              letterSpacing: -0.4,
              color: 'rgba(255, 255, 255, 0.72)',
            }}
          >
            Connecting Africa to Global Finance.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
