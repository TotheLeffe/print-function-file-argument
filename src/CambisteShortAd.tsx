import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from './components/Background';
import {Caption} from './components/Caption';
import {
  BankIcon,
  GraduationIcon,
  InvoiceIcon,
  LaptopIcon,
  LockIcon,
  WalletIcon,
} from './components/icons';
import {CARD_SHADOW, COLORS, FONT, easeUp, pop} from './theme';

// Spot 15 s : clair, rythmé, cuts francs. 450 images à 30 i/s.
// 1) 0–3 s  : le Mobile Money s'arrête à la frontière.
// 2) 3–7 s  : Cambiste le connecte au système bancaire mondial.
// 3) 7–11 s : tout devient possible (4 usages éclair).
// 4) 11–15 s: révélation officielle du logo + CTA.

const BARRIER_X = 1210;

const S1Blocked: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chipX = interpolate(frame, [8, 32], [620, BARRIER_X - 235], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hit = pop(frame, fps, 32);
  const shake = frame >= 32 && frame < 44 ? Math.sin(frame * 2.8) * 4 : 0;
  const barrierIn = pop(frame, fps, 4);

  return (
    <AbsoluteFill>
      <Background />
      {/* Portefeuille */}
      <div
        style={{
          position: 'absolute',
          left: 230,
          top: 350,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: COLORS.white,
          border: `1.5px solid ${COLORS.border}`,
          borderRadius: 26,
          padding: '26px 34px',
          boxShadow: CARD_SHADOW,
          ...easeUp(frame, fps, 0, 40),
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: COLORS.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WalletIcon size={38} />
        </div>
        <div>
          <div style={{fontWeight: 700, fontSize: 28, color: COLORS.navy}}>
            Mobile Money
          </div>
          <div style={{fontWeight: 500, fontSize: 20, color: COLORS.slate}}>
            2,450,000 F CFA
          </div>
        </div>
      </div>

      {/* Barrière + cadenas */}
      <div
        style={{
          position: 'absolute',
          left: BARRIER_X - 9,
          top: 210,
          width: 18,
          height: 400,
          borderRadius: 12,
          background:
            'linear-gradient(180deg, rgba(91,107,127,0.16), rgba(91,107,127,0.4), rgba(91,107,127,0.16))',
          opacity: barrierIn,
          transform: `scaleY(${barrierIn}) translateX(${shake}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BARRIER_X - 30,
          top: 152,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: COLORS.white,
          border: `1.5px solid ${COLORS.border}`,
          boxShadow: CARD_SHADOW,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: barrierIn,
          transform: `scale(${barrierIn})`,
        }}
      >
        <LockIcon size={28} />
      </div>

      {/* Paiement bloqué */}
      <div
        style={{
          position: 'absolute',
          left: chipX,
          top: 408,
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
          opacity: interpolate(frame, [6, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        € 2,400 · Supplier · Europe
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

      <Caption text="Your Mobile Money stops at the border." delay={6} />
    </AbsoluteFill>
  );
};

const S2Connect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [4, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chips = [
    {label: 'CFA', bg: COLORS.greenSoft, fg: COLORS.greenDark, offset: 0},
    {label: 'EUR', bg: '#EDEBFF', fg: '#5B4FD8', offset: 1 / 3},
    {label: 'USD', bg: COLORS.blueSoft, fg: COLORS.blueDark, offset: 2 / 3},
  ];

  return (
    <AbsoluteFill>
      <Background />
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <line
          x1={400}
          y1={450}
          x2={400 + 1120 * line}
          y2={450}
          stroke={COLORS.border}
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>

      {chips.map((c) => {
        const cycle = ((frame - 32) / 42 + c.offset) % 1;
        if (frame < 32 || cycle < 0) {
          return null;
        }
        const x = interpolate(cycle, [0, 1], [430, 1490]);
        return (
          <div
            key={c.label}
            style={{
              position: 'absolute',
              left: x,
              top: 450,
              transform: 'translate(-50%, -50%)',
              background: c.bg,
              color: c.fg,
              fontWeight: 800,
              fontSize: 24,
              borderRadius: 999,
              padding: '10px 24px',
              boxShadow: '0 8px 22px rgba(10, 37, 64, 0.12)',
              border: `1.5px solid ${COLORS.white}`,
              opacity: interpolate(cycle, [0, 0.08, 0.88, 1], [0, 1, 1, 0]),
            }}
          >
            {c.label}
          </div>
        );
      })}

      {/* Nœuds : wallet, Cambiste, banque */}
      {[
        {x: 400, color: COLORS.green, icon: <WalletIcon size={52} />, label: 'Mobile Money', delay: 0},
        {x: 960, color: null, icon: null, label: 'Cambiste', delay: 8},
        {x: 1520, color: COLORS.blue, icon: <BankIcon size={52} />, label: 'Banking System', delay: 16},
      ].map((node) => {
        const p = pop(frame, fps, node.delay);
        const isCambiste = node.color === null;
        const size = isCambiste ? 164 : 126;
        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: node.x,
              top: 450,
              transform: `translate(-50%, -50%) scale(${p})`,
              opacity: p,
            }}
          >
            <div
              style={{
                width: size,
                height: size,
                borderRadius: isCambiste ? 42 : '50%',
                background: isCambiste ? COLORS.white : node.color!,
                border: isCambiste ? `1.5px solid ${COLORS.border}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: CARD_SHADOW,
              }}
            >
              {isCambiste ? (
                <Img
                  src={staticFile('brand/cambiste-mark.png')}
                  style={{width: 108, height: 'auto'}}
                />
              ) : (
                node.icon
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                top: size + 18,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontWeight: isCambiste ? 800 : 600,
                fontSize: isCambiste ? 30 : 26,
                color: COLORS.navy,
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      <Caption
        text="Cambiste connects it to the world’s banking system."
        delay={12}
      />
    </AbsoluteFill>
  );
};

const S3Possible: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cards = [
    {icon: <BankIcon size={38} />, bg: COLORS.blue, title: 'Supplier paid', sub: 'Rotterdam · €8,500', delay: 2},
    {icon: <GraduationIcon size={38} />, bg: '#7C5CFF', title: 'Tuition paid', sub: 'Toronto · $12,000', delay: 12},
    {icon: <LaptopIcon size={38} />, bg: COLORS.green, title: 'Freelance income', sub: 'From Berlin · €3,200', delay: 22},
    {icon: <InvoiceIcon size={38} />, bg: '#0EA5C4', title: 'Invoice settled', sub: 'Dubai · $5,400', delay: 32},
  ];

  return (
    <AbsoluteFill>
      <Background />
      {/* Arcs décoratifs bleus */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, opacity: 0.5}}
      >
        {[0, 1, 2].map((i) => {
          const draw = interpolate(frame, [4 + i * 8, 40 + i * 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <path
              key={i}
              d={`M ${260 + i * 120} 900 Q 960 ${140 + i * 90} ${1660 - i * 120} 900`}
              fill="none"
              stroke={COLORS.blueSoft}
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 170,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 560px)',
            gap: 30,
          }}
        >
          {cards.map((card) => {
            const p = pop(frame, fps, card.delay);
            return (
              <div
                key={card.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  background: COLORS.white,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 24,
                  padding: '24px 30px',
                  boxShadow: CARD_SHADOW,
                  opacity: p,
                  transform: `scale(${0.75 + 0.25 * p})`,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <div
                    style={{fontWeight: 700, fontSize: 27, color: COLORS.navy}}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{fontWeight: 500, fontSize: 21, color: COLORS.slate}}
                  >
                    {card.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Caption text="Fast. Compliant. Borderless." delay={40} accent />
    </AbsoluteFill>
  );
};

const S4Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ctaIn = pop(frame, fps, 78);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.white}}>
      <Img
        src={staticFile('brand/cambiste-reveal-last.png')}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      />
      {frame < 120 ? (
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

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 105,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 50,
            letterSpacing: -1.2,
            color: COLORS.navy,
            ...easeUp(frame, fps, 58, 34),
          }}
        >
          Mobile Money → Banking System
        </div>
        <div
          style={{
            opacity: ctaIn,
            transform: `scale(${0.8 + 0.2 * ctaIn})`,
            background: COLORS.blue,
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 28,
            borderRadius: 16,
            padding: '20px 50px',
            boxShadow: '0 18px 44px rgba(37, 99, 235, 0.35)',
          }}
        >
          Book a demo
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CambisteShortAd: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.white, fontFamily: FONT}}>
      <Sequence from={0} durationInFrames={90}>
        <S1Blocked />
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <S2Connect />
      </Sequence>
      <Sequence from={210} durationInFrames={120}>
        <S3Possible />
      </Sequence>
      <Sequence from={330} durationInFrames={120}>
        <S4Reveal />
      </Sequence>
    </AbsoluteFill>
  );
};
