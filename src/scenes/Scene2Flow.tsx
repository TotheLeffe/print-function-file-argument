import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background, BrandTag} from '../components/Background';
import {CambisteMark} from '../components/CambisteLogo';
import {Caption} from '../components/Caption';
import {BankIcon, GlobeIcon, WalletIcon} from '../components/icons';
import {CARD_SHADOW, COLORS, easeUp, pop} from '../theme';

const LINE_Y = 470;
const NODES = [
  {x: 330, label: 'Mobile Money', color: COLORS.green, icon: <WalletIcon size={56} />},
  {x: 790, label: 'Cambiste', color: null, icon: null},
  {x: 1250, label: 'Paiement international', color: COLORS.blue, icon: <GlobeIcon size={56} />},
  {x: 1710, label: 'Fournisseur', color: COLORS.navy, icon: <BankIcon size={56} />},
];

const CURRENCIES = [
  {label: 'CFA', bg: COLORS.greenSoft, fg: COLORS.greenDark, offset: 0},
  {label: 'USD', bg: COLORS.blueSoft, fg: COLORS.blueDark, offset: 1 / 3},
  {label: 'EUR', bg: '#EDEBFF', fg: '#5B4FD8', offset: 2 / 3},
];

export const Scene2Flow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lineProgress = interpolate(frame, [14, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const startX = NODES[0].x;
  const endX = NODES[3].x;

  return (
    <AbsoluteFill>
      <Background />
      <BrandTag />

      {/* Ligne de connexion tracée progressivement */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <line
          x1={startX}
          y1={LINE_Y}
          x2={startX + (endX - startX) * lineProgress}
          y2={LINE_Y}
          stroke={COLORS.border}
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Chevrons directionnels entre les nœuds */}
        {[560, 1020, 1480].map((x, i) => {
          const visible = pop(frame, fps, 60 + i * 8);
          return (
            <path
              key={x}
              d={`M ${x - 10} ${LINE_Y - 14} L ${x + 10} ${LINE_Y} L ${x - 10} ${LINE_Y + 14}`}
              fill="none"
              stroke={COLORS.slateLight}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={visible}
            />
          );
        })}
      </svg>

      {/* Pastilles de devises qui circulent instantanément */}
      {CURRENCIES.map((c) => {
        const cycle = ((frame - 85) / 85 + c.offset) % 1;
        const active = frame >= 85 && cycle >= 0;
        if (!active) {
          return null;
        }
        const x = interpolate(cycle, [0, 1], [startX + 30, endX - 30]);
        const opacity = interpolate(
          cycle,
          [0, 0.08, 0.88, 1],
          [0, 1, 1, 0]
        );
        return (
          <div
            key={c.label}
            style={{
              position: 'absolute',
              left: x,
              top: LINE_Y,
              transform: 'translate(-50%, -50%)',
              background: c.bg,
              color: c.fg,
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: 0.5,
              borderRadius: 999,
              padding: '10px 24px',
              boxShadow: '0 8px 22px rgba(10, 37, 64, 0.12)',
              border: `1.5px solid ${COLORS.white}`,
              opacity,
            }}
          >
            {c.label}
          </div>
        );
      })}

      {/* Nœuds du parcours */}
      {NODES.map((node, i) => {
        const p = pop(frame, fps, 8 + i * 16);
        const isCambiste = node.label === 'Cambiste';
        const size = isCambiste ? 168 : 136;
        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: node.x,
              top: LINE_Y,
              transform: `translate(-50%, -50%) scale(${p})`,
              opacity: p,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: isCambiste ? 42 : '50%',
                background: isCambiste ? COLORS.white : node.color!,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: CARD_SHADOW,
                border: isCambiste ? `1.5px solid ${COLORS.border}` : 'none',
              }}
            >
              {isCambiste ? <CambisteMark size={104} /> : node.icon}
            </div>
            <div
              style={{
                position: 'absolute',
                top: size + 20,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontWeight: isCambiste ? 800 : 600,
                fontSize: isCambiste ? 32 : 27,
                color: COLORS.navy,
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      <Caption
        text="Cambiste connecte les portefeuilles Mobile Money au réseau mondial des paiements."
        delay={40}
      />
    </AbsoluteFill>
  );
};
