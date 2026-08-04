import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from '../components/Background';
import {CambisteLogo} from '../components/CambisteLogo';
import {COLORS, easeUp, pop} from '../theme';

export const Scene4Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoIn = pop(frame, fps, 6);
  const ctaIn = pop(frame, fps, 72);
  // Légère pulsation du bouton une fois affiché.
  const pulse = 1 + 0.02 * Math.sin((frame - 72) / 9) * ctaIn;

  return (
    <AbsoluteFill>
      <Background plain />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <div
          style={{
            opacity: logoIn,
            transform: `scale(${0.8 + 0.2 * logoIn})`,
          }}
        >
          <CambisteLogo height={84} />
        </div>

        <h1
          style={{
            margin: '70px 0 0',
            maxWidth: 1500,
            textAlign: 'center',
            fontSize: 76,
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: -2,
            color: COLORS.navy,
            ...easeUp(frame, fps, 30, 44),
          }}
        >
          Le Mobile Money ne s’arrête
          <br />
          plus aux frontières.
        </h1>

        <p
          style={{
            margin: '34px 0 0',
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.slate,
            letterSpacing: -0.4,
            ...easeUp(frame, fps, 52, 36),
          }}
        >
          Infrastructure de paiements transfrontaliers pour opérateurs Mobile
          Money.
        </p>

        <div
          style={{
            marginTop: 58,
            opacity: ctaIn,
            transform: `scale(${(0.8 + 0.2 * ctaIn) * pulse})`,
          }}
        >
          <div
            style={{
              background: COLORS.blue,
              color: COLORS.white,
              fontWeight: 700,
              fontSize: 32,
              borderRadius: 18,
              padding: '24px 58px',
              boxShadow: '0 18px 44px rgba(37, 99, 235, 0.35)',
            }}
          >
            Book a demo
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
