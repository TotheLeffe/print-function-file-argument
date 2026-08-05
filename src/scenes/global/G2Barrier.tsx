import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Caption} from '../../components/Caption';
import {BankIcon, LockIcon, WalletIcon} from '../../components/icons';
import {CARD_SHADOW, COLORS, easeUp, pop} from '../../theme';

const BARRIER_X = 960;

// Scène 2 — Réalité. Le paiement s'arrête net contre une barrière entre le
// Mobile Money et le réseau bancaire mondial.
export const G2Barrier: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // La pastille de paiement part du portefeuille et bute sur la barrière.
  const chipX = interpolate(frame, [40, 85], [500, BARRIER_X - 240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hit = pop(frame, fps, 85);
  const shake = frame >= 85 && frame < 100 ? Math.sin(frame * 2.6) * 3 : 0;
  const barrierIn = easeUp(frame, fps, 22, 30);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.bg} 100%)`,
      }}
    >
      {/* Portefeuille Mobile Money, côté Afrique */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 330,
          width: 380,
          ...easeUp(frame, fps, 6, 44),
        }}
      >
        <div
          style={{
            background: COLORS.white,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: 26,
            boxShadow: CARD_SHADOW,
            padding: '30px 34px',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: COLORS.green,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WalletIcon size={36} />
            </div>
            <div>
              <div style={{fontWeight: 700, fontSize: 26, color: COLORS.navy}}>
                Mobile Money
              </div>
              <div style={{fontWeight: 500, fontSize: 19, color: COLORS.slate}}>
                Abidjan · Côte d’Ivoire
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Réseau bancaire mondial, côté international */}
      <div
        style={{
          position: 'absolute',
          left: 1290,
          top: 330,
          width: 380,
          ...easeUp(frame, fps, 14, 44),
        }}
      >
        <div
          style={{
            background: COLORS.white,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: 26,
            boxShadow: CARD_SHADOW,
            padding: '30px 34px',
            opacity: 0.92,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: COLORS.navy,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BankIcon size={36} />
            </div>
            <div>
              <div style={{fontWeight: 700, fontSize: 26, color: COLORS.navy}}>
                Global banking
              </div>
              <div style={{fontWeight: 500, fontSize: 19, color: COLORS.slate}}>
                SEPA · SWIFT · Card rails
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ligne interrompue */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <line
          x1={530}
          y1={400}
          x2={BARRIER_X - 60}
          y2={400}
          stroke={COLORS.border}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <line
          x1={BARRIER_X + 60}
          y1={400}
          x2={1280}
          y2={400}
          stroke={COLORS.border}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="2 26"
        />
      </svg>

      {/* La barrière */}
      <div
        style={{
          position: 'absolute',
          left: BARRIER_X - 9,
          top: 190,
          width: 18,
          height: 430,
          borderRadius: 12,
          background:
            'linear-gradient(180deg, rgba(91,107,127,0.16), rgba(91,107,127,0.38), rgba(91,107,127,0.16))',
          boxShadow: '0 0 0 1px rgba(91,107,127,0.18)',
          opacity: barrierIn.opacity,
          transform: `${barrierIn.transform} translateX(${shake}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BARRIER_X - 31,
          top: 132,
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: COLORS.white,
          border: `1.5px solid ${COLORS.border}`,
          boxShadow: CARD_SHADOW,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: barrierIn.opacity,
        }}
      >
        <LockIcon size={30} />
      </div>

      {/* La pastille de paiement bloquée */}
      <div
        style={{
          position: 'absolute',
          left: chipX,
          top: 400,
          transform: `translate(-50%, -50%) translateX(${shake}px)`,
          background: COLORS.white,
          border: `1.5px solid ${hit > 0.4 ? COLORS.red : COLORS.border}`,
          borderRadius: 999,
          padding: '14px 28px',
          boxShadow: CARD_SHADOW,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 700,
          fontSize: 24,
          color: COLORS.navy,
          opacity: interpolate(frame, [36, 44], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        € 2,400 · Supplier payment
        {hit > 0.4 ? (
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: COLORS.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${hit})`,
            }}
          >
            <svg width={14} height={14} viewBox="0 0 14 14">
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke={COLORS.white}
                strokeWidth={2.6}
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : null}
      </div>

      <Caption
        text="But the global economy still runs on banking infrastructure."
        delay={55}
      />
    </AbsoluteFill>
  );
};
