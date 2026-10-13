import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, COL, ENTER, HEIGHT, LEAVE, PAD, Tone, WIDTH, ink, typeSize} from '../config';
import {EASE, at, mix} from './anim';

/* =========================================================================
   LA MISE EN SCENE
   Un plan = un fond, une illustration, un message. Les quatre elements
   ci-dessous sont les seuls outils de composition de la serie : les films
   different par ce qu'ils y mettent, jamais par des regles propres.
   ========================================================================= */

/* ---- Camera -------------------------------------------------------------
   Toute l'illustration d'un plan passe par la. Une echelle et un
   deplacement suffisent a accompagner un flux, se rapprocher d'un detail
   ou devoiler un ensemble.                                                */
export const Camera: React.FC<{
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({scale = 1, x = 0, y = 0, rotate = 0, origin = '50% 50%', children}) => (
  <AbsoluteFill
    style={{
      transform:
        scale === 1 && x === 0 && y === 0 && rotate === 0
          ? undefined
          : `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: origin,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ---- Profondeur ---------------------------------------------------------
   Une seule source de lumiere par plan sombre, jamais un degrade
   decoratif : elle donne du volume au fond et rien d'autre.               */
export const Glow: React.FC<{x: number; y: number; r: number; color?: string; alpha?: number}> = ({
  x,
  y,
  r,
  color = C.green,
  alpha = 0.5,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(${r}px ${r}px at ${x}px ${y}px, ${color}, transparent 70%)`,
      opacity: alpha,
    }}
  />
);

/* ---- Le message ---------------------------------------------------------
   La phrase entiere parait en 8 images, puis ne bouge plus d'un pixel. Pas
   de machine a ecrire, pas de revelation mot a mot : chacune repousserait
   le moment ou la phrase devient lisible.

   La transformation est RETIREE une fois la phrase posee, et non mise a
   zero : un transform residuel promeut le bloc en couche composee, que
   Chromium ne rasterise pas au meme sous-pixel d'une image a l'autre.     */
export type TextPos = 'top' | 'center' | 'bottom';

export const Message: React.FC<{
  lines: string[];
  tone: Tone;
  pos?: TextPos;
  align?: 'left' | 'center';
  frames: number;
  max?: number;
  min?: number;
  accent?: number; // indice de la ligne portee par la couleur d'accent
  accentColor?: string;
  delay?: number;
}> = ({
  lines,
  tone,
  pos = 'top',
  align = 'left',
  frames,
  max = 108,
  min = 54,
  accent = -1,
  accentColor = C.green,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const size = typeSize(lines, max, min);
  const p = at(frame, delay, ENTER);
  const out = 1 - at(frame, frames - LEAVE, LEAVE, EASE.move);
  const o = p * out;

  const box: React.CSSProperties =
    pos === 'top'
      ? {top: 132, alignItems: 'flex-start'}
      : pos === 'bottom'
        ? {bottom: 150, alignItems: 'flex-end'}
        : {top: 0, height: HEIGHT, justifyContent: 'center'};

  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        width: COL,
        display: 'flex',
        flexDirection: 'column',
        ...box,
        opacity: o,
        transform: p >= 1 ? undefined : `translateY(${mix(14, 0, p)}px)`,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize: size,
            lineHeight: 1.04,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: i === accent ? accentColor : ink(tone),
            textAlign: align,
            width: '100%',
            whiteSpace: 'pre',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

/* ---- Les coupes ---------------------------------------------------------
   Trois facons d'entrer dans un plan, choisies selon ce que dit le plan
   precedent. Aucune n'est un fondu : un fondu ferait cohabiter deux
   messages a l'image.

     volet  — un bord traverse l'ecran et decouvre le plan entrant ;
     pousse — le plan entrant chasse le sortant ;
     iris   — un cercle s'ouvre sur un point precis, pour enchainer deux
              plans par continuite de forme.                               */
/** Un plan : une duree, un fond, une entree, et ce qu'on y voit. */
export type SceneDef = {
  frames: number;
  tone: Tone;
  bg: string;
  enter: Enter;
  /** `f` est l'image locale du plan, `n` sa duree. */
  render: (f: number, n: number) => React.ReactNode;
};

export type Enter =
  | {kind: 'none'}
  | {kind: 'wipe'; from?: 'bottom' | 'top' | 'left' | 'right'}
  | {kind: 'push'; from?: 'bottom' | 'right'}
  | {kind: 'iris'; x: number; y: number};

export const enterStyle = (e: Enter, frame: number, cut: number): React.CSSProperties => {
  if (e.kind === 'none') return {};
  const t = at(frame, 0, cut, EASE.move);
  if (t >= 1) return {};
  if (e.kind === 'wipe') {
    const d = e.from ?? 'bottom';
    const v = (1 - t) * 100;
    const inset =
      d === 'bottom'
        ? `${v}% 0 0 0`
        : d === 'top'
          ? `0 0 ${v}% 0`
          : d === 'left'
            ? `0 ${v}% 0 0`
            : `0 0 0 ${v}%`;
    return {clipPath: `inset(${inset})`};
  }
  if (e.kind === 'push') {
    const d = e.from ?? 'bottom';
    const off = (1 - t) * (d === 'bottom' ? HEIGHT : WIDTH);
    return {transform: d === 'bottom' ? `translateY(${off}px)` : `translateX(${off}px)`};
  }
  const r = mix(0, Math.hypot(WIDTH, HEIGHT), t);
  return {clipPath: `circle(${r}px at ${e.x}px ${e.y}px)`};
};

/* ---- Le calque de dessin ------------------------------------------------
   Toutes les illustrations partagent le meme repere que le cadre : un
   point du dessin est un pixel de l'image.                                */
export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <svg
    width={WIDTH}
    height={HEIGHT}
    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);
