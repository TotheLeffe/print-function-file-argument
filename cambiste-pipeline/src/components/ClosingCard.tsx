import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CLOSING, COLORS} from '../config';
import {CambisteLockup} from './CambisteLogo';

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const rise = (frame: number, win: readonly [number, number], px: number) => {
  const p = interpolate(frame, [win[0], win[1]], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  return {opacity: p, transform: `translateY(${(1 - p) * px}px)`};
};

/**
 * Carton de fin : logo officiel, signature, adresse. Rien d'autre.
 *
 * Les trois elements se posent presque ensemble et sont TOUS en place a
 * l'image 13 du plan, qui en compte 120 : le carton complet reste donc
 * lisible et parfaitement immobile pendant 3,57 s.
 *
 * Le logo n'a droit qu'a un fondu et a une legere montee — ses lettres ne
 * sont jamais animees separement, ses proportions jamais touchees.
 */
export const ClosingCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
    >
      <div style={{...rise(frame, CLOSING.logoIn, 18), marginBottom: 58}}>
        <CambisteLockup height={CLOSING.logoHeight} />
      </div>

      <div
        style={{
          ...rise(frame, CLOSING.taglineIn, 14),
          fontSize: CLOSING.taglineSize,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: COLORS.ink,
          textAlign: 'center',
          whiteSpace: 'pre',
        }}
      >
        {CLOSING.tagline}
      </div>

      <div
        style={{
          ...rise(frame, CLOSING.websiteIn, 12),
          marginTop: 34,
          fontSize: CLOSING.websiteSize,
          fontWeight: 700,
          letterSpacing: '0.035em',
          color: COLORS.green,
        }}
      >
        {CLOSING.website}
      </div>
    </AbsoluteFill>
  );
};
