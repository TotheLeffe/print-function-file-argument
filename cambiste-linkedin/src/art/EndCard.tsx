import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ASSETS, C, COL, ENTER, PAD, Tone, ink, typeSize} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {CambisteLockup} from './Logo';

/* =========================================================================
   LE CARTON DE FIN
   Message court, logo Cambiste, cambiste.app. Rien d'autre a l'image.
   Le trait vert qui se tire sous le logotype est le seul geste : il donne
   un point d'arrivee au film, et il est commun aux quatorze.
   ========================================================================= */
export const EndCard: React.FC<{
  frame: number;
  lines: string[];
  tone?: Tone;
  cta?: string;
}> = ({frame, lines, tone = 'light', cta}) => {
  const t = (d: number, n = ENTER + 4) => at(frame, d, n);
  const size = Math.min(92, typeSize(lines, 92, 54));
  const rule = at(frame, 16, 22, EASE.move);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: COL,
          marginLeft: PAD,
          marginRight: PAD,
          textAlign: 'center',
          marginBottom: 104,
          opacity: t(0),
          transform: t(0) >= 1 ? undefined : `translateY(${mix(16, 0, t(0))}px)`,
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: size,
              lineHeight: 1.06,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: ink(tone),
              whiteSpace: 'pre',
            }}
          >
            {l}
          </div>
        ))}
      </div>

      <div style={{opacity: t(8), position: 'relative'}}>
        <CambisteLockup height={74} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: -26,
            height: 5,
            width: `${rule * 100}%`,
            background: C.green,
            borderRadius: 3,
          }}
        />
      </div>

      {cta ? (
        <div
          style={{
            marginTop: 44,
            fontSize: 38,
            fontWeight: 700,
            /* Encre, pas vert : le vert Cambiste sur fond clair ne donne que
               2,5:1 de contraste, sous le seuil d'un texte de cette taille.
               Le vert reste l'accent du trait sous le logotype. */
            color: tone === 'dark' ? C.leaf : C.forest,
            opacity: t(14),
          }}
        >
          {cta}
        </div>
      ) : null}

      <div
        style={{
          marginTop: cta ? 16 : 56,
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: '0.01em',
          color: tone === 'dark' ? C.leaf : C.deep,
          opacity: t(18),
        }}
      >
        {ASSETS.website}
      </div>
    </AbsoluteFill>
  );
};
