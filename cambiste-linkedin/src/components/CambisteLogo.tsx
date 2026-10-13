import React from 'react';
import {Img, staticFile} from 'remotion';
import {MARK, WORDMARK} from '../brand';
import {ASSETS, COLORS} from '../config';

/**
 * Contour du carre de marque : une superellipse, pas un rayon simple. Les
 * coefficients sont ajustes sur le profil mesure du logo officiel.
 */
const squirclePath = (w: number, h: number, R: number, n: number, N = 18) => {
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

const SQUIRCLE = squirclePath(
  MARK.vbw,
  MARK.vbh,
  (MARK.R * MARK.vbw) / MARK.w,
  MARK.n
);

/** La marque : carre vert, glyphe blanc a symetrie centrale exacte. */
export const CambisteMark: React.FC<{height: number}> = ({height}) => (
  <svg
    width={(height * MARK.vbw) / MARK.vbh}
    height={height}
    viewBox={`0 0 ${MARK.vbw} ${MARK.vbh}`}
    style={{display: 'block'}}
  >
    <path d={SQUIRCLE} fill={COLORS.green} />
    <path d={MARK.lobe} fill={COLORS.white} />
    <path
      d={MARK.lobe}
      fill={COLORS.white}
      transform={`rotate(180 ${MARK.cx} ${MARK.cy})`}
    />
  </svg>
);

/**
 * Verrouillage officiel : logotype + marque, a l'ecart releve sur la video
 * de marque (28/84 de la hauteur de capitale). Les proportions sont tenues
 * par ce seul rapport : changer `height` ne peut pas les deformer.
 *
 * Le logotype est l'image d'origine, jamais recomposee — sa police est
 * proprietaire — et n'est affiche qu'a sa taille native ou en deca.
 */
export const CambisteLockup: React.FC<{height: number}> = ({height}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: height * (28 / 84)}}>
    <Img
      src={staticFile(ASSETS.wordmark)}
      style={{height, width: height * WORDMARK.ratio, display: 'block'}}
    />
    <CambisteMark height={height} />
  </div>
);
