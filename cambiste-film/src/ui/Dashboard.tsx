import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Format, UI} from '../config';
import {EASE, at, band, clamp01, mix} from '../anim';
import {Wordmark} from './brandmarks';

/* =========================================================================
   SEQUENCE E — LES SIGNAUX DEVIENNENT UNE INTERFACE
   Un seul ecran coherent : un paiement, son suivi, son rapprochement, son
   activite. Le regard va du paiement au rapprochement sans qu'on ait a
   lire une application entiere.

   Rien ici n'est un vrai client, un vrai montant ni un delai annonce :
   l'ecran le dit lui-meme en pied de panneau.
   ========================================================================= */

const T = {
  panel: 514,
  head: 526,
  payment: 540,
  steps: [556, 576, 596],
  recon: 586,
  matched: 610,
  chart: 600,
  note: 626,
  out: 684,
} as const;

const Card: React.FC<{
  children: React.ReactNode;
  o: number;
  pad?: number;
  grow?: number;
}> = ({children, o, pad = 26, grow}) => (
  <div
    style={{
      background: 'rgba(14,30,48,0.72)',
      border: `1px solid rgba(90,126,164,${0.26 * o})`,
      borderRadius: 12,
      padding: pad,
      opacity: o,
      flexGrow: grow,
      transform: o >= 0.999 ? undefined : `translateY(${mix(12, 0, o)}px)`,
    }}
  >
    {children}
  </div>
);

const Step: React.FC<{text: string; frame: number; from: number; last: boolean; s: number}> = ({
  text,
  frame,
  from,
  last,
  s,
}) => {
  const done = at(frame, from, 16, EASE.move);
  const fill = at(frame, from + 8, 22, EASE.move);
  return (
    <div style={{display: 'flex', gap: 18 * s, alignItems: 'flex-start'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            width: 14 * s,
            height: 14 * s,
            borderRadius: '50%',
            background: done > 0.5 ? C.signal : 'transparent',
            border: `2px solid ${done > 0.5 ? C.signal : 'rgba(120,150,180,0.5)'}`,
          }}
        />
        {last ? null : (
          <div style={{width: 2, height: 56 * s, background: 'rgba(120,150,180,0.22)'}}>
            <div style={{width: 2, height: `${fill * 100}%`, background: C.signal}} />
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 23 * s,
          fontWeight: 500,
          color: done > 0.5 ? C.white : C.grey,
          opacity: mix(0.45, 1, done),
          marginTop: -3 * s,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Dashboard: React.FC<{frame: number; format: Format}> = ({frame, format}) => {
  const wide = format === 'wide';
  const s = wide ? 1 : 0.92;
  const o = band(frame, T.panel, T.out, 22, 16, EASE.move);
  if (o <= 0.002) return null;

  const draw = at(frame, T.panel, 28, EASE.move);
  const head = at(frame, T.head, 16);
  const pay = at(frame, T.payment, 16);
  const recon = at(frame, T.recon, 16);
  const match = at(frame, T.matched, 20, EASE.move);
  const chart = at(frame, T.chart, 18);
  const note = at(frame, T.note, 16);

  const box = wide
    ? {left: 628, top: 186, width: 1168, height: 708}
    : {left: 66, top: 470, width: 948, height: 1010};

  return (
    <AbsoluteFill style={{opacity: o}}>
      <div
        style={{
          position: 'absolute',
          ...box,
          background: 'rgba(8,19,33,0.90)',
          border: `1px solid rgba(90,126,164,${0.3 * draw})`,
          borderRadius: 16,
          transform: `scaleY(${mix(0.92, 1, draw)}) scaleX(${mix(0.97, 1, draw)})`,
          transformOrigin: '50% 30%',
          display: 'flex',
          flexDirection: 'column',
          padding: 34 * s,
          gap: 22 * s,
        }}
      >
        {/* bandeau */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: head,
          }}
        >
          <Wordmark height={22 * s} color={C.white} />
          <div style={{display: 'flex', gap: 26 * s}}>
            {UI.nav.map((n, i) => (
              <div
                key={n}
                style={{
                  fontSize: 19 * s,
                  fontWeight: 500,
                  color: i === 1 ? C.white : C.grey,
                  opacity: i === 1 ? 1 : 0.62,
                  borderBottom: i === 1 ? `2px solid ${C.signal}` : '2px solid transparent',
                  paddingBottom: 5,
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
        <div style={{height: 1, background: 'rgba(90,126,164,0.2)', opacity: head}} />

        <div style={{fontSize: 38 * s, fontWeight: 600, color: C.white, opacity: head, letterSpacing: '-0.015em'}}>
          {UI.title}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: wide ? 'row' : 'column',
            gap: 22 * s,
            flexGrow: 1,
          }}
        >
          {/* colonne du paiement */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 22 * s, flex: wide ? 1.25 : 1}}>
            <Card o={pay}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontSize: 27 * s, fontWeight: 600, color: C.white}}>
                    {UI.payment.ref}
                  </div>
                  <div style={{fontSize: 20 * s, color: C.grey, marginTop: 6}}>
                    {UI.payment.kind}
                  </div>
                </div>
                <div style={{fontSize: 20 * s, color: C.grey}}>{UI.payment.destination}</div>
              </div>
            </Card>
            <Card o={pay} grow={1}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  height: '100%',
                  justifyContent: 'center',
                }}
              >
                {UI.timeline.map((t, i) => (
                  <Step
                    key={t}
                    text={t}
                    frame={frame}
                    from={T.steps[i]}
                    last={i === UI.timeline.length - 1}
                    s={s}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* colonne du rapprochement et de l'activite */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 22 * s, flex: 1}}>
            <Card o={recon}>
              <div style={{fontSize: 22 * s, fontWeight: 600, color: C.white}}>
                {UI.reconciliation.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12 * s,
                  marginTop: 18 * s,
                }}
              >
                <div
                  style={{
                    fontSize: 18 * s,
                    fontFamily: 'monospace',
                    color: C.grey,
                    padding: `${7 * s}px ${12 * s}px`,
                    border: '1px solid rgba(90,126,164,0.3)',
                    borderRadius: 7,
                    transform: `translateX(${mix(-22, 0, match)}px)`,
                  }}
                >
                  CB-2048
                </div>
                <div
                  style={{
                    width: 26 * s,
                    height: 1,
                    background: C.signal,
                    opacity: match,
                  }}
                />
                <div
                  style={{
                    fontSize: 18 * s,
                    fontFamily: 'monospace',
                    color: C.grey,
                    padding: `${7 * s}px ${12 * s}px`,
                    border: '1px solid rgba(90,126,164,0.3)',
                    borderRadius: 7,
                    transform: `translateX(${mix(22, 0, match)}px)`,
                  }}
                >
                  STL-2048
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10 * s,
                  marginTop: 18 * s,
                  opacity: at(frame, T.matched + 10, 14),
                }}
              >
                <svg width={20 * s} height={20 * s} viewBox="0 0 20 20">
                  <path
                    d="M4 10.5 L8.4 15 L16 6"
                    fill="none"
                    stroke={C.signal}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={20}
                    strokeDashoffset={20 * (1 - clamp01(at(frame, T.matched + 10, 16)))}
                  />
                </svg>
                <div style={{fontSize: 21 * s, fontWeight: 500, color: C.white}}>
                  {UI.reconciliation.state}
                </div>
              </div>
            </Card>

            <Card o={chart} grow={1}>
              <div style={{fontSize: 22 * s, fontWeight: 600, color: C.white}}>{UI.activity}</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 10 * s,
                  height: 92 * s,
                  marginTop: 20 * s,
                }}
              >
                {[0.42, 0.63, 0.5, 0.78, 0.6, 0.86, 0.7].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h * 100 * at(frame, T.chart + i * 3, 18, EASE.out)}%`,
                      background: i === 5 ? C.signal : 'rgba(105,175,255,0.42)',
                      borderRadius: 3,
                    }}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div style={{fontSize: 16 * s, color: C.grey, opacity: 0.72 * note}}>{UI.note}</div>
      </div>
    </AbsoluteFill>
  );
};
