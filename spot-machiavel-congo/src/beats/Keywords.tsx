import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Backdrop, SHOTS} from '../components/Backdrop';
import {ChannelTag} from '../components/ChannelTag';
import {Stage} from '../components/Stage';
import type {Layout} from '../layout';
import {COLORS, FONTS} from '../theme';
import {KEYWORDS_BEAT} from '../timeline';

const TICKS = [COLORS.blue, COLORS.yellow, COLORS.red, COLORS.bone];

const Keyword: React.FC<{
  layout: Layout;
  label: string;
  index: number;
  at: number;
}> = ({layout, label, index, at}) => {
  const frame = useCurrentFrame();
  const {u} = layout;
  const t = frame - at;

  const p = interpolate(t, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: u(16),
        opacity: p,
        transform: `translateX(${(1 - p) * u(46)}px)`,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    >
      <div
        style={{
          width: u(11),
          height: u(44),
          backgroundColor: TICKS[index % TICKS.length],
          transform: 'skewX(-8deg)',
        }}
      />
      <span
        style={{
          fontFamily: `${FONTS.ui}, sans-serif`,
          fontWeight: 700,
          // Four items have to sit on one line in 16:9.
          fontSize: u(60) * (layout.isVertical ? 1 : 0.9),
          letterSpacing: u(2),
          color: COLORS.bone,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          textShadow: '0 8px 30px rgba(0,0,0,0.85)',
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Beat 3 — the four fronts the video covers, over the empty throne. */
export const Keywords: React.FC<{layout: Layout; durationInFrames: number}> = ({
  layout,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {u} = layout;

  // A single narrow flag-coloured glint crosses the frame on the cut —
  // enough to feel like a transition, not enough to tint the picture.
  const sweep = interpolate(frame, [0, 18], [-45, 135], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sweepOpacity = interpolate(frame, [0, 4, 14, 19], [0, 0.5, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Backdrop
        layout={layout}
        shot={SHOTS.ville}
        from={0.42}
        to={0.36}
        panX={0.02}
        darken={0.58}
        durationInFrames={durationInFrames}
      />

      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            inset: `0 0 0 ${sweep}%`,
            width: '13%',
            opacity: sweepOpacity,
            background: `linear-gradient(90deg, transparent, ${COLORS.blue}33, ${COLORS.yellow}55, ${COLORS.red}33, transparent)`,
            transform: 'skewX(-12deg)',
            mixBlendMode: 'screen',
          }}
        />
      </AbsoluteFill>

      <Stage layout={layout} impacts={[0]}>
        <ChannelTag layout={layout} appearAt={0} />
        <div
          style={{
            display: 'flex',
            flexDirection: layout.isVertical ? 'column' : 'row',
            alignItems: layout.isVertical ? 'flex-start' : 'center',
            gap: layout.isVertical ? u(22) : u(36),
            flexWrap: 'wrap',
          }}
        >
          {KEYWORDS_BEAT.items.map((item, i) => (
            <Keyword
              key={item.label}
              layout={layout}
              label={item.label}
              index={i}
              at={item.at}
            />
          ))}
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
