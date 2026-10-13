import React from 'react';
import {C} from '../config';
import {EASE, at, mix, quad, quadLength, quadPath} from '../lib/anim';

/* =========================================================================
   LES PARCOURS
   Une connexion se dessine ; une valeur la parcourt. Le vert part du
   local, le bleu arrive a l'international : la ligne change de couleur en
   chemin, et c'est tout le propos de Cambiste dit sans legende.
   ========================================================================= */

let uid = 0;
const nextId = () => `fl${++uid}`;

export type Pt = [number, number];

/** Degrade local -> international, declare une fois par trace. */
export const RailGradient: React.FC<{id: string; a: Pt; b: Pt; from?: string; to?: string}> = ({
  id,
  a,
  b,
  from = C.green,
  to = C.blue,
}) => (
  <defs>
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  </defs>
);

/** Une liaison qui se trace. `t` va de 0 a 1. */
export const Rail: React.FC<{
  a: Pt;
  c: Pt;
  b: Pt;
  t: number;
  color?: string;
  gradient?: boolean;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}> = ({a, c, b, t, color = C.green, gradient = false, width = 6, dashed = false, opacity = 1}) => {
  const id = React.useMemo(nextId, []);
  if (t <= 0.004) return null;
  return (
    <>
      {gradient ? <RailGradient id={id} a={a} b={b} /> : null}
      <path
        d={quadPath(a, c, b, t)}
        fill="none"
        stroke={gradient ? `url(#${id})` : color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '2 18' : undefined}
        opacity={opacity}
      />
    </>
  );
};

/** Position sur un parcours, pour y poser un objet qui avance. */
export const along = (a: Pt, c: Pt, b: Pt, t: number) => quad(a, c, b, Math.min(1, Math.max(0, t)));

/** Trainee derriere l'objet en mouvement : trois points qui s'effacent. */
export const Trail: React.FC<{a: Pt; c: Pt; b: Pt; t: number; color: string}> = ({
  a,
  c,
  b,
  t,
  color,
}) => (
  <>
    {[0.05, 0.1, 0.16].map((d, i) => {
      const u = t - d;
      if (u <= 0) return null;
      const [x, y] = quad(a, c, b, u);
      return <circle key={i} cx={x} cy={y} r={mix(14, 5, i / 2)} fill={color} opacity={0.4 - i * 0.12} />;
    })}
  </>
);

/** Longueur d'un parcours — sert a cadencer un pointille regulier. */
export const railLength = quadLength;

/** Fleche de direction discrete, posee sur un parcours. */
export const Chevron: React.FC<{a: Pt; c: Pt; b: Pt; t: number; color: string; o?: number}> = ({
  a,
  c,
  b,
  t,
  color,
  o = 1,
}) => {
  const p = quad(a, c, b, t);
  const q = quad(a, c, b, Math.min(1, t + 0.02));
  const ang = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${p[0]} ${p[1]}) rotate(${ang})`} opacity={o}>
      <path d="M-9 -11 L9 0 L-9 11" fill="none" stroke={color} strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** Barre de progression d'un parcours, utilisee comme respiration de plan. */
export const Pace: React.FC<{frame: number; from: number; dur: number; color: string; w: number; x: number; y: number}> = ({
  frame,
  from,
  dur,
  color,
  w,
  x,
  y,
}) => {
  const t = at(frame, from, dur, EASE.move);
  return (
    <>
      <rect x={x} y={y} width={w} height={5} rx={2.5} fill={color} opacity={0.18} />
      <rect x={x} y={y} width={w * t} height={5} rx={2.5} fill={color} />
    </>
  );
};
