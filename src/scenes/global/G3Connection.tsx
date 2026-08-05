import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Caption} from '../../components/Caption';
import {BankIcon, WalletIcon} from '../../components/icons';
import {COLORS, easeUp, pop} from '../../theme';

const LINE_Y = 470;
const LEFT_X = 420;
const RIGHT_X = 1500;

// Scène 3 — La connexion. La barrière se dissout, un pont lumineux relie le
// Mobile Money au système bancaire, le logo Cambiste apparaît.
export const G3Connection: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bridge = interpolate(frame, [40, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const markIn = pop(frame, fps, 100);
  const textLeft = easeUp(frame, fps, 125, 26);
  const arrowIn = interpolate(frame, [140, 158], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textRight = easeUp(frame, fps, 152, 26);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, ${COLORS.navyScene} 0%, ${COLORS.navyDeep} 72%)`,
      }}
    >
      {/* Nœud Mobile Money */}
      <div
        style={{
          position: 'absolute',
          left: LEFT_X,
          top: LINE_Y,
          opacity: easeUp(frame, fps, 8, 30).opacity,
          transform: `translate(-50%, -50%) ${easeUp(frame, fps, 8, 30).transform}`,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: '50%',
            background: COLORS.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 60px rgba(46, 229, 143, 0.45)`,
          }}
        >
          <WalletIcon size={56} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 152,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            fontSize: 26,
            color: COLORS.textOnDark,
          }}
        >
          Mobile Money
        </div>
      </div>

      {/* Nœud système bancaire */}
      <div
        style={{
          position: 'absolute',
          left: RIGHT_X,
          top: LINE_Y,
          opacity: easeUp(frame, fps, 18, 30).opacity,
          transform: `translate(-50%, -50%) ${easeUp(frame, fps, 18, 30).transform}`,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: '50%',
            background: COLORS.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 60px rgba(77, 141, 255, 0.5)`,
          }}
        >
          <BankIcon size={56} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 152,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            fontSize: 26,
            color: COLORS.textOnDark,
          }}
        >
          Banking System
        </div>
      </div>

      {/* Le pont lumineux */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <defs>
          <linearGradient
            id="bridge"
            gradientUnits="userSpaceOnUse"
            x1={LEFT_X}
            y1={LINE_Y}
            x2={RIGHT_X}
            y2={LINE_Y}
          >
            <stop offset="0%" stopColor={COLORS.glowGreen} />
            <stop offset="100%" stopColor={COLORS.glowBlue} />
          </linearGradient>
        </defs>
        <line
          x1={LEFT_X + 80}
          y1={LINE_Y}
          x2={LEFT_X + 80 + (RIGHT_X - LEFT_X - 160) * bridge}
          y2={LINE_Y}
          stroke="url(#bridge)"
          strokeWidth={7}
          strokeLinecap="round"
          style={{filter: 'drop-shadow(0 0 14px rgba(77, 141, 255, 0.75))'}}
        />
        {/* Particules circulant sur le pont */}
        {[0, 1 / 3, 2 / 3].map((offset) => {
          const cycle = ((frame - 95) / 55 + offset) % 1;
          if (frame < 95 || cycle < 0) {
            return null;
          }
          const x = interpolate(
            cycle,
            [0, 1],
            [LEFT_X + 90, RIGHT_X - 90]
          );
          const opacity = interpolate(cycle, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
          return (
            <circle
              key={offset}
              cx={x}
              cy={LINE_Y}
              r={9}
              fill={COLORS.white}
              opacity={opacity}
              style={{filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.9))'}}
            />
          );
        })}
      </svg>

      {/* Le logo Cambiste se pose sur le pont */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: LINE_Y,
          transform: `translate(-50%, -50%) scale(${markIn})`,
          opacity: markIn,
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 44,
            background: COLORS.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 0 70px rgba(255, 255, 255, 0.35), 0 24px 60px rgba(0, 0, 0, 0.35)',
          }}
        >
          <Img
            src={staticFile('brand/cambiste-mark.png')}
            style={{width: 116, height: 'auto'}}
          />
        </div>
      </div>

      {/* Mobile Money → Banking System */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 720,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 54,
            letterSpacing: -1.2,
            color: COLORS.textOnDark,
            ...textLeft,
          }}
        >
          Mobile Money
        </span>
        <svg width={110} height={34} viewBox="0 0 110 34" style={{opacity: arrowIn}}>
          <line
            x1={4}
            y1={17}
            x2={4 + 84 * arrowIn}
            y2={17}
            stroke={COLORS.glowBlue}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M ${72 * arrowIn + 16} 5 L ${72 * arrowIn + 34} 17 L ${72 * arrowIn + 16} 29`}
            fill="none"
            stroke={COLORS.glowBlue}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontWeight: 800,
            fontSize: 54,
            letterSpacing: -1.2,
            color: COLORS.glowBlue,
            ...textRight,
          }}
        >
          Banking System
        </span>
      </div>

      <Caption text="Cambiste changes that." delay={60} light bottom={70} />
    </AbsoluteFill>
  );
};
