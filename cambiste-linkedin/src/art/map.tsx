import React from 'react';
import {AFRICA, GLOBE, onGlobe} from '../geo';
import {C, Tone} from '../config';
import {EASE, at, mix, step} from '../lib/anim';

/* =========================================================================
   LA GEOGRAPHIE
   Le continent et le globe viennent de donnees Natural Earth projetees :
   aucune cote n'est dessinee a main levee. Le continent est montre d'un
   seul tenant, sans frontieres ni villes — la serie ne revendique aucune
   presence dans aucun pays.
   ========================================================================= */

let uid = 0;
const nextId = () => `cm${++uid}`;

/* Trame reguliere, posee une fois pour toutes : elle ne designe aucun
   lieu, elle donne une matiere au continent. */
const DOTS = (() => {
  const out: {x: number; y: number}[] = [];
  for (let y = 40; y < AFRICA.h; y += 62) {
    for (let x = (y / 62) % 2 ? 40 : 71; x < AFRICA.w; x += 62) out.push({x, y});
  }
  return out;
})();

/** Le continent, a l'echelle et a la position voulues. */
export const Africa: React.FC<{
  x: number;
  y: number;
  h: number;
  frame: number;
  from?: number;
  tone: Tone;
  fill?: string;
  outline?: boolean;
  /** Trame de points a l'interieur du continent : la densite des systemes
      locaux, sans designer aucun lieu. */
  texture?: boolean;
  children?: React.ReactNode; // elements places dans le repere du continent
}> = ({x, y, h, frame, from = 0, tone, fill, outline = true, texture = false, children}) => {
  const s = h / AFRICA.h;
  const w = AFRICA.w * s;
  const id = React.useMemo(nextId, []);
  const t = at(frame, from, 28, EASE.move);
  const body = fill ?? (tone === 'dark' ? C.green : C.green);
  return (
    <g transform={`translate(${x - w / 2} ${y - h / 2}) scale(${s})`}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={AFRICA.h * (1 - t)} width={AFRICA.w} height={AFRICA.h} />
        </clipPath>
        <clipPath id={`${id}m`}>
          <path d={AFRICA.path} />
        </clipPath>
      </defs>
      {outline ? (
        <path
          d={AFRICA.path}
          fill="none"
          stroke={tone === 'dark' ? C.leaf : C.deep}
          strokeWidth={6 / s}
          opacity={0.35 * at(frame, from, 14)}
          strokeLinejoin="round"
        />
      ) : null}
      <g clipPath={`url(#${id})`}>
        <path d={AFRICA.path} fill={body} />
        {texture ? (
          <g clipPath={`url(#${id}m)`}>
            {DOTS.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={14 * at(frame, from + 16 + (d.x + d.y) / 120, 18)}
                fill={tone === 'dark' ? C.forest : C.white}
                opacity={0.22}
              />
            ))}
          </g>
        ) : null}
      </g>
      {children}
    </g>
  );
};

/** Coordonnees d'un point dans le repere du continent, en pourcentage. */
export const africaPoint = (fx: number, fy: number) => ({
  x: AFRICA.w * fx,
  y: AFRICA.h * fy,
});

/* ---- Le globe -----------------------------------------------------------
   Projection orthographique : la Terre vue de l'espace, centree sur
   l'Afrique. Le graticule est calcule, pas decore.                        */
export const Globe: React.FC<{
  x: number;
  y: number;
  d: number; // diametre a l'ecran
  frame: number;
  from?: number;
  tone: Tone;
  spin?: number; // degres de rotation apparente, pour accompagner un mouvement
  children?: React.ReactNode;
}> = ({x, y, d, frame, from = 0, tone, spin = 0, children}) => {
  const s = d / GLOBE.box;
  const t = at(frame, from, 26);
  const sphere = tone === 'dark' ? '#07372A' : C.mint;
  const grat = tone === 'dark' ? 'rgba(127,217,174,0.38)' : 'rgba(5,87,49,0.22)';
  return (
    <g transform={`translate(${x} ${y}) scale(${s * mix(0.94, 1, t)}) translate(${-GLOBE.cx} ${-GLOBE.cy})`}
       opacity={t}>
      <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.r} fill={sphere} />
      <g transform={`rotate(${spin} ${GLOBE.cx} ${GLOBE.cy})`}>
        {GLOBE.graticule.map((p, i) => (
          <path
            key={i} d={p} fill="none" stroke={grat} strokeWidth={3}
            opacity={at(frame, from + 6 + step(i, 1), 16)}
          />
        ))}
      </g>
      <path d={GLOBE.africa} fill={C.green} opacity={at(frame, from + 10, 20)} />
      <circle cx={GLOBE.cx} cy={GLOBE.cy} r={GLOBE.r} fill="none"
              stroke={tone === 'dark' ? C.leaf : C.deep} strokeWidth={4} opacity={0.4} />
      {children}
    </g>
  );
};

/** Point du globe, dans le repere interne de 1000 x 1000. */
export const globePoint = (lon: number, lat: number) => onGlobe(lon, lat);
