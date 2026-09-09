import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, EASE_OUT, SPRING_SETTLE} from '../theme';
import {CambisteLockup} from './CambisteLogo';
import {NetworkBackground} from './NetworkBackground';

/** Fleche dessinee : le glyphe U+2192 n'est pas garanti dans le sous-ensemble. */
const Arrow: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size * 1.7} height={size} viewBox="0 0 34 20" style={{display: 'block'}}>
    <path
      d="M2 10 H30 M22 3 L30 10 L22 17"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Carton de fin. Le logo n'a droit qu'a un fondu et a une legere montee :
 * ses lettres ne sont jamais animees separement, et la marque n'est jamais
 * deformee.
 */
export const CambisteEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logo = spring({frame: frame - 4, fps, config: SPRING_SETTLE, durationInFrames: 22});
  const claim = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const promise = interpolate(frame, [36, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const url = interpolate(frame, [46, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  // le reseau continue de vivre sous le logo, tres discretement
  const net = interpolate(frame, [0, 40], [0.35, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <NetworkBackground
        seed={6021}
        count={16}
        box={{x0: 180, y0: 300, x1: 900, y1: 830}}
        connect={net}
        nodeColor={C.green}
        lineColor={C.mint}
        drift={10}
        opacity={0.4}
        reach={210}
      />

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
            opacity: logo,
            transform: `translateY(${(1 - logo) * 26}px)`,
            marginBottom: 54,
          }}
        >
          <CambisteLockup height={78} />
        </div>

        <div
          style={{
            height: 92,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - claim) * 100}%)`,
              fontSize: 86,
              lineHeight: '92px',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: C.ink,
              whiteSpace: 'pre',
            }}
          >
            TRACTION IS LIFE.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 40,
            opacity: promise,
            transform: `translateY(${(1 - promise) * 14}px)`,
            fontSize: 30,
            fontWeight: 600,
            color: C.deep,
            whiteSpace: 'pre',
          }}
        >
          <span>Mobile Money</span>
          <Arrow size={19} color={C.green} />
          <span>Global Banking System</span>
        </div>

        <div
          style={{
            marginTop: 34,
            opacity: url,
            transform: `translateY(${(1 - url) * 12}px)`,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: C.green,
          }}
        >
          cambiste.app
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
