import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Caption} from '../../components/Caption';
import {
  BankIcon,
  GraduationIcon,
  InvoiceIcon,
  LaptopIcon,
} from '../../components/icons';
import {COLORS, pop} from '../../theme';

// Réseau : l'Afrique reliée à l'Europe, l'Amérique et l'Asie.
const HUB = {x: 860, y: 640};
const DESTINATIONS = [
  {label: 'Europe', x: 1210, y: 250, delay: 20},
  {label: 'America', x: 330, y: 280, delay: 38},
  {label: 'Asia', x: 1650, y: 430, delay: 56},
];

const CARDS = [
  {
    icon: <BankIcon size={40} />,
    iconBg: COLORS.blue,
    title: 'Supplier paid',
    subtitle: 'Rotterdam · €8,500',
    x: 190,
    y: 560,
    delay: 70,
  },
  {
    icon: <GraduationIcon size={40} />,
    iconBg: '#7C5CFF',
    title: 'Tuition paid',
    subtitle: 'Toronto · $12,000',
    x: 1330,
    y: 620,
    delay: 115,
  },
  {
    icon: <LaptopIcon size={40} />,
    iconBg: COLORS.green,
    title: 'Freelance income received',
    subtitle: 'From Berlin · €3,200',
    x: 190,
    y: 800,
    delay: 160,
  },
  {
    icon: <InvoiceIcon size={40} />,
    iconBg: '#0EA5C4',
    title: 'Invoice settled',
    subtitle: 'Dubai · $5,400',
    x: 1330,
    y: 860,
    delay: 205,
  },
];

// Point sur une courbe de Bézier quadratique.
const bezier = (
  t: number,
  p0: {x: number; y: number},
  p1: {x: number; y: number},
  p2: {x: number; y: number}
) => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
});

const controlFor = (dest: {x: number; y: number}) => ({
  x: (HUB.x + dest.x) / 2,
  y: Math.min(HUB.y, dest.y) - 180,
});

// Scène 4 — Possibilités. Des lignes bancaires animées relient les continents
// pendant que les usages défilent.
export const G4Possibilities: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Trois répliques de voix off qui s'enchaînent.
  const captions = [
    {text: 'One connection.', from: 25, to: 130},
    {text: 'Global banking access.', from: 130, to: 235},
    {text: 'Powered directly from Mobile Money.', from: 235, to: 345},
  ];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 45% 55%, ${COLORS.navyScene} 0%, ${COLORS.navyDeep} 75%)`,
      }}
    >
      {/* Grille de points, façon carte du monde abstraite */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, opacity: 0.35}}
      >
        {Array.from({length: 14}).map((_, row) =>
          Array.from({length: 26}).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={70 + col * 72}
              cy={60 + row * 74}
              r={2}
              fill="rgba(255,255,255,0.14)"
            />
          ))
        )}
      </svg>

      {/* Arcs lumineux */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        {DESTINATIONS.map((dest) => {
          const ctrl = controlFor(dest);
          const draw = interpolate(
            frame,
            [dest.delay, dest.delay + 45],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          const cycle = ((frame - dest.delay - 45) / 70) % 1;
          const dot =
            frame > dest.delay + 45 && cycle >= 0
              ? bezier(cycle, HUB, ctrl, dest)
              : null;
          return (
            <g key={dest.label}>
              <path
                d={`M ${HUB.x} ${HUB.y} Q ${ctrl.x} ${ctrl.y} ${dest.x} ${dest.y}`}
                fill="none"
                stroke={COLORS.glowBlue}
                strokeWidth={3.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
                opacity={0.85}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(77, 141, 255, 0.65))',
                }}
              />
              {dot ? (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={7}
                  fill={COLORS.white}
                  opacity={interpolate(
                    cycle,
                    [0, 0.1, 0.9, 1],
                    [0, 1, 1, 0]
                  )}
                  style={{
                    filter: 'drop-shadow(0 0 9px rgba(255,255,255,0.9))',
                  }}
                />
              ) : null}
              <circle
                cx={dest.x}
                cy={dest.y}
                r={11}
                fill={COLORS.glowBlue}
                opacity={draw}
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(77, 141, 255, 0.9))',
                }}
              />
              <text
                x={dest.x}
                y={dest.y - 26}
                textAnchor="middle"
                fill={COLORS.mutedOnDark}
                fontSize={22}
                fontWeight={600}
                opacity={draw}
              >
                {dest.label}
              </text>
            </g>
          );
        })}
        {/* Nœud Afrique */}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={16}
          fill={COLORS.glowGreen}
          style={{filter: 'drop-shadow(0 0 18px rgba(46, 229, 143, 0.9))'}}
        />
        <text
          x={HUB.x}
          y={HUB.y + 44}
          textAnchor="middle"
          fill={COLORS.textOnDark}
          fontSize={24}
          fontWeight={700}
        >
          Africa
        </text>
      </svg>

      {/* Vignettes d'usages */}
      {CARDS.map((card) => {
        const p = pop(frame, fps, card.delay);
        return (
          <div
            key={card.title}
            style={{
              position: 'absolute',
              left: card.x,
              top: card.y,
              width: 400,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              background: 'rgba(255, 255, 255, 0.97)',
              borderRadius: 22,
              padding: '20px 26px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              opacity: p,
              transform: `scale(${0.75 + 0.25 * p})`,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 16,
                background: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{fontWeight: 700, fontSize: 24, color: COLORS.navy}}>
                {card.title}
              </div>
              <div style={{fontWeight: 500, fontSize: 19, color: COLORS.slate}}>
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}

      {/* Voix off en trois temps */}
      {captions.map((c) => {
        if (frame < c.from || frame >= c.to) {
          return null;
        }
        const fadeOut = interpolate(frame, [c.to - 8, c.to], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={c.text} style={{opacity: fadeOut}}>
            <Caption text={c.text} delay={c.from} light bottom={70} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
