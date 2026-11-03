import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Format, SIGNATURE} from '../config';
import {EASE, at, mix} from '../anim';
import {Lockup} from './brandmarks';
import {SCALE} from './type';

/* =========================================================================
   SEQUENCE G — SIGNATURE
   Tout est pose a l'image 838, soit 0:27,9 : les deux dernieres secondes
   ne bougent plus. Rien ne disparait a la fin, rien ne s'escamote.
   ========================================================================= */
const Line: React.FC<{
  frame: number;
  from: number;
  children: React.ReactNode;
  size: number;
  color: string;
  weight?: number;
}> = ({frame, from, children, size, color, weight = 500}) => {
  const o = at(frame, from, 14, EASE.out);
  return (
    <div
      style={{
        opacity: o,
        transform: o >= 0.999 ? undefined : `translateY(${mix(10, 0, o)}px)`,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: size > 40 ? '-0.015em' : '0.004em',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
};

export const Signature: React.FC<{frame: number; format: Format}> = ({frame, format}) => {
  const s = SCALE[format];
  const o = at(frame, SIGNATURE.from, 16, EASE.out);
  if (o <= 0.002) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          opacity: o,
          transform: o >= 0.999 ? undefined : `translateY(${mix(14, 0, o)}px)`,
          marginBottom: 46 * s,
        }}
      >
        <Lockup height={58 * s} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18 * s, alignItems: 'center'}}>
        <Line frame={frame} from={SIGNATURE.from + 10} size={34 * s} color={C.white} weight={500}>
          {SIGNATURE.tagline}
        </Line>
        <Line frame={frame} from={SIGNATURE.from + 19} size={27 * s} color={C.grey} weight={400}>
          {SIGNATURE.cta}
        </Line>
        <Line frame={frame} from={SIGNATURE.from + 27} size={26 * s} color={C.signalLit} weight={600}>
          {SIGNATURE.site}
        </Line>
      </div>
    </AbsoluteFill>
  );
};
