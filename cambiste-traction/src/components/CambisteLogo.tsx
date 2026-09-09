import React from 'react';
import {Img, staticFile} from 'remotion';
import {MARK, WORDMARK} from '../brand';
import {C} from '../theme';

/**
 * Contour du carre de marque : une superellipse, pas un rayon simple. Les
 * coefficients R et n sont ajustes sur le profil mesure du logo officiel.
 */
const squirclePath = (w: number, h: number, R: number, n: number, N = 18) => {
  const corner = (t: number): [number, number] => [
    R - R * Math.pow(Math.cos(t), 2 / n),
    R - R * Math.pow(Math.sin(t), 2 / n),
  ];
  const pts: string[] = [];
  const push = (x: number, y: number) =>
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
  for (let i = 0; i <= N; i++) {
    const [x, y] = corner((i / N) * (Math.PI / 2));
    push(x, y);
  }
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

/** La marque seule : carre vert, glyphe blanc a symetrie centrale exacte. */
export const CambisteMark: React.FC<{height: number}> = ({height}) => {
  const width = (height * MARK.vbw) / MARK.vbh;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${MARK.vbw} ${MARK.vbh}`}
      style={{display: 'block'}}
    >
      <path d={SQUIRCLE} fill={C.green} />
      <path d={MARK.lobe} fill={C.white} />
      <path
        d={MARK.lobe}
        fill={C.white}
        transform={`rotate(180 ${MARK.cx} ${MARK.cy})`}
      />
    </svg>
  );
};

/**
 * Verrouillage officiel : logotype + marque, aux proportions relevees sur la
 * video de marque (ecart de 28/84 de la hauteur de capitale).
 *
 * Le logotype est l'image d'origine, jamais recomposee : sa police est
 * proprietaire. Il n'est affiche qu'a sa taille native ou en deca.
 */
export const CambisteLockup: React.FC<{height: number}> = ({height}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: height * (28 / 84)}}>
    <Img
      src={staticFile(WORDMARK.src)}
      style={{height, width: height * WORDMARK.ratio, display: 'block'}}
    />
    <CambisteMark height={height} />
  </div>
);
