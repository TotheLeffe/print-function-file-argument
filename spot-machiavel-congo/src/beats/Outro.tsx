import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Stage} from '../components/Stage';
import {YouTubeLogo} from '../components/YouTubeMark';
import type {Layout} from '../layout';
import {COLORS, FONTS} from '../theme';
import {CHANNEL} from '../timeline';

/**
 * Outro — the payoff, and the reusable end card for every reel of the
 * series: the thumbnail shown whole (its own lettering is the point here),
 * the YouTube logo, the channel, the call to action.
 *
 * Entrance is over by frame ~30, so the same component serves both the
 * 1-second tail of the 5-second spot and the standalone 3-second outro.
 */
export const Outro: React.FC<{layout: Layout}> = ({layout}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {u, isVertical} = layout;

  const enter = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: {damping: 14, mass: 0.6, stiffness: 160},
      durationInFrames: 20,
    });

  const card = enter(0);
  const copy = enter(6);
  const name = enter(12);
  const button = enter(20);

  // The card keeps drifting after it lands, so a long hold never freezes.
  const drift = interpolate(frame, [0, 90], [0, 1], {extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin(Math.max(0, frame - 24) * 0.32) * 0.028;

  const cardWidth = isVertical ? u(880) : u(700);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      {/* Out-of-focus wash of the artwork so the card sits in the same world. */}
      <AbsoluteFill>
        <Img
          src={staticFile('thumbnail.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(52px) saturate(1.25)',
            transform: `scale(${1.24 + drift * 0.06})`,
            opacity: 0.55,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity: 0.74}} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(110% 75% at 50% 45%, transparent 30%, rgba(0,0,0,0.92) 100%)',
        }}
      />

      <Stage layout={layout} align="center" impacts={[0]}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isVertical ? u(58) : u(76),
          }}
        >
          {/* La miniature, entière et encadrée. */}
          <div
            style={{
              width: cardWidth,
              flexShrink: 0,
              padding: u(8),
              backgroundColor: COLORS.bone,
              opacity: card,
              transform: `scale(${interpolate(card, [0, 1], [0.84, 1])})
                          rotate(${interpolate(card, [0, 1], [-5, -1.8]) + drift * 0.9}deg)`,
              boxShadow: '0 34px 90px rgba(0,0,0,0.8)',
            }}
          >
            <Img
              src={staticFile('thumbnail.png')}
              style={{width: '100%', display: 'block'}}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isVertical ? 'center' : 'flex-start',
              textAlign: isVertical ? 'center' : 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isVertical ? 'center' : 'flex-start',
                opacity: copy,
                transform: `translateY(${interpolate(copy, [0, 1], [u(30), 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: `${FONTS.ui}, sans-serif`,
                  fontWeight: 500,
                  fontSize: u(29),
                  letterSpacing: u(7),
                  color: COLORS.ash,
                  textTransform: 'uppercase',
                }}
              >
                Vidéo complète sur
              </span>
              <div style={{marginTop: u(16)}}>
                <YouTubeLogo size={u(86)} color={COLORS.bone} />
              </div>
            </div>

            <div
              style={{
                marginTop: u(20),
                opacity: name,
                transform: `translateY(${interpolate(name, [0, 1], [u(26), 0])}px)`,
                fontFamily: `${FONTS.display}, Impact, sans-serif`,
                fontSize: u(104) * layout.titleScale,
                lineHeight: 0.92,
                letterSpacing: u(-1),
                color: COLORS.yellow,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: '0 12px 44px rgba(0,0,0,0.8)',
              }}
            >
              {CHANNEL}
            </div>

            {/* Bouton s'abonner. */}
            <div
              style={{
                marginTop: u(30),
                display: 'flex',
                alignItems: 'center',
                gap: u(18),
                padding: `${u(15)}px ${u(38)}px`,
                backgroundColor: '#FF0000',
                borderRadius: u(999),
                opacity: button,
                transform: `scale(${interpolate(button, [0, 1], [0.7, 1]) * pulse})`,
                boxShadow: `0 0 ${u(54)}px rgba(255,0,0,0.45)`,
              }}
            >
              <span
                style={{
                  fontFamily: `${FONTS.ui}, sans-serif`,
                  fontWeight: 700,
                  fontSize: u(40),
                  letterSpacing: u(3),
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                S&apos;abonner
              </span>
            </div>
          </div>
        </div>
      </Stage>

      {/* Liseré aux couleurs du drapeau, en pied. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: u(10),
          display: 'flex',
          opacity: copy,
        }}
      >
        <div style={{flex: 1, backgroundColor: COLORS.blue}} />
        <div style={{flex: 1, backgroundColor: COLORS.yellow}} />
        <div style={{flex: 1, backgroundColor: COLORS.red}} />
      </div>
    </AbsoluteFill>
  );
};
