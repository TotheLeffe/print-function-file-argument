import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Caption} from '../../components/Caption';
import {WalletIcon} from '../../components/icons';
import {CARD_SHADOW, COLORS, easeUp, pop} from '../../theme';

// Scène 1 — Afrique. Gros plan sur un téléphone qui ouvre l'app Mobile Money,
// lumière naturelle chaude, lent zoom avant.
export const G1Africa: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const zoom = interpolate(frame, [0, 210], [1, 1.06]);
  // Splash « Mobile Money » qui laisse place à l'interface du portefeuille.
  const splashOut = interpolate(frame, [55, 80], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const uiIn = interpolate(frame, [65, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const balancePop = pop(frame, fps, 95);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.bg} 100%)`,
      }}
    >
      {/* Lumière naturelle chaude en haut à gauche */}
      <div
        style={{
          position: 'absolute',
          width: 1400,
          height: 1400,
          borderRadius: '50%',
          left: -420,
          top: -640,
          background:
            'radial-gradient(circle, rgba(255, 196, 110, 0.16) 0%, rgba(255, 196, 110, 0) 62%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          right: -380,
          bottom: -520,
          background:
            'radial-gradient(circle, rgba(31, 191, 113, 0.08) 0%, rgba(31, 191, 113, 0) 65%)',
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${zoom})`,
        }}
      >
        <div style={{...easeUp(frame, fps, 8, 60), marginBottom: 90}}>
          <div
            style={{
              width: 380,
              height: 760,
              borderRadius: 54,
              background: COLORS.navy,
              padding: 13,
              boxShadow: CARD_SHADOW,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 43,
                background: COLORS.white,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Interface du portefeuille */}
              <div style={{opacity: uiIn, height: '100%'}}>
                <div
                  style={{
                    background: COLORS.green,
                    padding: '34px 26px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <WalletIcon size={32} />
                  <span
                    style={{color: COLORS.white, fontWeight: 700, fontSize: 24}}
                  >
                    Mobile Money
                  </span>
                </div>
                <div style={{padding: '26px 24px 0'}}>
                  <div
                    style={{
                      background: COLORS.greenSoft,
                      borderRadius: 20,
                      padding: '20px 22px',
                      transform: `scale(${0.9 + 0.1 * balancePop})`,
                      opacity: balancePop,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        color: COLORS.slate,
                        fontWeight: 500,
                      }}
                    >
                      Available balance
                    </div>
                    <div
                      style={{
                        fontSize: 30,
                        color: COLORS.navy,
                        fontWeight: 800,
                        marginTop: 6,
                        letterSpacing: -0.5,
                      }}
                    >
                      2,450,000 F CFA
                    </div>
                  </div>
                  {['Send money', 'Pay a bill', 'Airtime'].map((label, i) => {
                    const p = pop(frame, fps, 115 + i * 10);
                    return (
                      <div
                        key={label}
                        style={{
                          marginTop: 16,
                          border: `1.5px solid ${COLORS.border}`,
                          borderRadius: 16,
                          padding: '16px 20px',
                          fontWeight: 600,
                          fontSize: 19,
                          color: COLORS.navy,
                          opacity: p,
                          transform: `translateY(${(1 - p) * 14}px)`,
                        }}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Écran d'accueil de l'app */}
              <AbsoluteFill
                style={{
                  background: COLORS.green,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 22,
                  opacity: splashOut,
                }}
              >
                <WalletIcon size={84} />
                <span
                  style={{color: COLORS.white, fontWeight: 800, fontSize: 34}}
                >
                  Mobile Money
                </span>
              </AbsoluteFill>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Caption
        text="Mobile Money transformed how Africa moves money."
        delay={30}
      />
    </AbsoluteFill>
  );
};
