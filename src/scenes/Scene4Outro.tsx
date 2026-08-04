import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, easeUp, pop} from '../theme';

// Durée de l'animation officielle du logo (4 s à 30 i/s).
const REVEAL_FRAMES = 120;

export const Scene4Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ctaIn = pop(frame, fps, 100);
  // Légère pulsation du bouton une fois affiché.
  const pulse = 1 + 0.02 * Math.sin((frame - 100) / 9) * ctaIn;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.white}}>
      {/* Image du dernier plan, pour tenir le logo après la fin de la vidéo */}
      <Img
        src={staticFile('brand/cambiste-reveal-last.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
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

      {/* Slogan, sous-titre et CTA dans la moitié basse, sous le logo animé */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 78,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <h1
          style={{
            margin: 0,
            maxWidth: 1500,
            textAlign: 'center',
            fontSize: 58,
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: -1.4,
            color: COLORS.navy,
            ...easeUp(frame, fps, 56, 40),
          }}
        >
          Le Mobile Money ne s’arrête plus aux frontières.
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 29,
            fontWeight: 500,
            color: COLORS.slate,
            letterSpacing: -0.4,
            ...easeUp(frame, fps, 74, 32),
          }}
        >
          Infrastructure de paiements transfrontaliers pour opérateurs Mobile
          Money.
        </p>

        <div
          style={{
            marginTop: 10,
            opacity: ctaIn,
            transform: `scale(${(0.8 + 0.2 * ctaIn) * pulse})`,
          }}
        >
          <div
            style={{
              background: COLORS.blue,
              color: COLORS.white,
              fontWeight: 700,
              fontSize: 30,
              borderRadius: 16,
              padding: '22px 54px',
              boxShadow: '0 18px 44px rgba(37, 99, 235, 0.35)',
            }}
          >
            Book a demo
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
