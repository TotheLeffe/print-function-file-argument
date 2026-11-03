import React from 'react';
import {staticFile} from 'remotion';
import {MARK, WORDMARK} from '../brand';
import {ASSETS, C} from '../config';

/* =========================================================================
   LE LOGO OFFICIEL
   Le logotype est l'image d'origine, a sa resolution native : sa police
   est proprietaire, on ne la recompose pas. Comme le fichier est un
   masque alpha noir, on le teinte par masquage plutot que de le
   redessiner — la forme reste exactement celle de la marque.
   ========================================================================= */

export const Wordmark: React.FC<{height: number; color?: string; o?: number}> = ({
  height,
  color = C.white,
  o = 1,
}) => (
  <div
    style={{
      width: height * WORDMARK.ratio,
      height,
      background: color,
      opacity: o,
      WebkitMaskImage: `url(${staticFile(ASSETS.wordmark)})`,
      maskImage: `url(${staticFile(ASSETS.wordmark)})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }}
  />
);

/** Contour du carre de marque : une superellipse, pas un rayon simple. */
const squircle = (w: number, h: number, R: number, n: number, N = 18) => {
  const corner = (t: number): [number, number] => [
    R - R * Math.pow(Math.cos(t), 2 / n),
    R - R * Math.pow(Math.sin(t), 2 / n),
  ];
  const pts: string[] = [];
  const push = (x: number, y: number) =>
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
  for (let i = 0; i <= N; i++) push(...corner((i / N) * (Math.PI / 2)));
  for (let i = 0; i <= N; i++) {
    const [x, y] = corner(Math.PI / 2 - (i / N) * (Math.PI / 2));
    push(w - x, y);
  }
  for (let i = 0; i <= N; i++) {
    const [x, y] = corner((i / N) * (Math.PI / 2));
    push(w - x, h - y);
  }
  for (let i = 0; i <= N; i++) {
    const [x, y] = corner(Math.PI / 2 - (i / N) * (Math.PI / 2));
    push(x, h - y);
  }
  return pts.join(' ') + ' Z';
};

const SQUIRCLE = squircle(MARK.vbw, MARK.vbh, (MARK.R * MARK.vbw) / MARK.w, MARK.n);

export const Mark: React.FC<{height: number; o?: number}> = ({height, o = 1}) => (
  <svg
    width={(height * MARK.vbw) / MARK.vbh}
    height={height}
    viewBox={`0 0 ${MARK.vbw} ${MARK.vbh}`}
    style={{display: 'block', opacity: o}}
  >
    <path d={SQUIRCLE} fill={C.signal} />
    <path d={MARK.lobe} fill={C.white} />
    <path d={MARK.lobe} fill={C.white} transform={`rotate(180 ${MARK.cx} ${MARK.cy})`} />
  </svg>
);

/** Verrouillage officiel : logotype + marque, a l'ecart releve (28/84). */
export const Lockup: React.FC<{height: number; color?: string}> = ({
  height,
  color = C.white,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: height * (28 / 84)}}>
    <Wordmark height={height} color={color} />
    <Mark height={height} />
  </div>
);
