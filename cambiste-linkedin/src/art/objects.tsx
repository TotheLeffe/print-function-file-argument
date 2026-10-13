import React from 'react';
import {C, Tone} from '../config';
import {EASE, at, mix, step} from '../lib/anim';

/* =========================================================================
   LE MOBILIER DE LA SERIE
   Chaque objet est dessine dans son propre repere, centre sur (0, 0), et
   place par l'appelant. Tous partagent la meme logique : aplats, contour
   de 5 px, angles arrondis d'une meme famille, aucune ombre portee.

   Aucun de ces objets ne represente un produit reel : ce sont des
   illustrations conceptuelles, jamais des captures d'ecran.
   ========================================================================= */

export type Skin = {
  tone: Tone;
  /** Couleur de l'objet : vert pour le local africain, bleu pour l'international. */
  key?: 'green' | 'blue';
};

const palette = (s: Skin) => {
  const key = s.key === 'blue' ? C.blue : C.green;
  const soft = s.key === 'blue' ? C.sky : C.leaf;
  return s.tone === 'dark'
    ? {key, soft, face: '#0B4132', line: soft, ink: C.white, quiet: 'rgba(255,255,255,0.32)'}
    : {key, soft, face: C.white, line: C.forest, ink: C.forest, quiet: 'rgba(4,35,26,0.14)'};
};

export const Place: React.FC<{
  x: number;
  y: number;
  s?: number;
  o?: number;
  rotate?: number;
  children: React.ReactNode;
}> = ({x, y, s = 1, o = 1, rotate = 0, children}) =>
  o <= 0.004 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`} opacity={o}>
      {children}
    </g>
  );

/* ---- Le telephone -------------------------------------------------------
   Un portefeuille mobile vu comme une interface conceptuelle : un solde,
   une action, trois mouvements. Aucune marque, aucun chiffre.            */
export const Phone: React.FC<{
  skin: Skin;
  frame: number;
  from?: number;
  /** Sortie du paiement : le bouton s'enfonce et la pastille part. */
  send?: number;
  rows?: number;
}> = ({skin, frame, from = 0, send = 0, rows = 3}) => {
  const p = palette(skin);
  const build = at(frame, from, 18);
  const W = 300, H = 600, R = 42;
  const press = Math.sin(Math.min(1, Math.max(0, send)) * Math.PI) * 6;
  return (
    <g opacity={build}>
      <rect
        x={-W / 2} y={-H / 2 + (1 - build) * 18} width={W} height={H} rx={R}
        fill={p.face} stroke={p.line} strokeWidth={5}
      />
      <rect x={-34} y={-H / 2 + 20} width={68} height={12} rx={6} fill={p.quiet} />
      {/* bandeau du solde */}
      <rect x={-W / 2 + 26} y={-H / 2 + 60} width={120} height={14} rx={7} fill={p.quiet} />
      <rect x={-W / 2 + 26} y={-H / 2 + 90} width={190} height={30} rx={15} fill={p.key} opacity={0.9} />
      {/* mouvements */}
      {Array.from({length: rows}, (_, i) => (
        <g key={i} opacity={at(frame, from + 10 + step(i, 4), 14)}>
          <circle cx={-W / 2 + 48} cy={-60 + i * 74} r={20} fill={p.quiet} />
          <rect x={-W / 2 + 80} y={-72 + i * 74} width={132 - i * 22} height={13} rx={6.5} fill={p.quiet} />
          <rect x={-W / 2 + 80} y={-50 + i * 74} width={88 - i * 14} height={11} rx={5.5} fill={p.quiet} opacity={0.6} />
        </g>
      ))}
      {/* action */}
      <g transform={`translate(0 ${press})`}>
        <rect
          x={-W / 2 + 26} y={H / 2 - 112} width={W - 52} height={62} rx={31}
          fill={p.key} opacity={at(frame, from + 14, 12)}
        />
      </g>
    </g>
  );
};

/* ---- L'institution ------------------------------------------------------
   Une banque reduite a sa silhouette : un socle, des colonnes, un fronton.
   Lisible a toute echelle, sans detail qui ne dise rien.                  */
export const Bank: React.FC<{skin: Skin; frame: number; from?: number; filled?: boolean}> = ({
  skin,
  frame,
  from = 0,
  filled = false,
}) => {
  const p = palette(skin);
  const W = 320;
  const rise = at(frame, from, 20);
  const body = filled ? p.key : p.face;
  const line = filled ? 'none' : p.line;
  return (
    <g opacity={rise}>
      <path
        d={`M${-W / 2 - 14} ${-96} L0 ${-176} L${W / 2 + 14} ${-96} Z`}
        fill={body} stroke={line} strokeWidth={5} strokeLinejoin="round"
      />
      {[0, 1, 2, 3].map((i) => {
        const h = at(frame, from + 6 + step(i, 3), 16);
        return (
          <rect
            key={i}
            x={-W / 2 + 26 + i * 76} y={-86 + (1 - h) * 86} width={48} height={h * 150} rx={12}
            fill={body} stroke={line} strokeWidth={5}
          />
        );
      })}
      <rect
        x={-W / 2 - 10} y={64} width={W + 20} height={44} rx={16}
        fill={body} stroke={line} strokeWidth={5}
      />
    </g>
  );
};

/* ---- Le compte ----------------------------------------------------------
   Une carte de paiement : puce, bande, numero masque. Jamais un vrai
   numero, jamais un logo de reseau.                                       */
export const Account: React.FC<{skin: Skin; frame: number; from?: number}> = ({
  skin,
  frame,
  from = 0,
}) => {
  const p = palette(skin);
  const W = 380, H = 240;
  const build = at(frame, from, 18);
  return (
    <g opacity={build}>
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={26} fill={p.key} />
      <rect x={-W / 2} y={-H / 2 + 44} width={W} height={34} fill="rgba(255,255,255,0.22)" />
      <rect x={-W / 2 + 34} y={-H / 2 + 110} width={62} height={46} rx={10} fill="rgba(255,255,255,0.9)" />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={at(frame, from + 8 + step(i, 3), 12)}>
          {[0, 1, 2, 3].map((j) => (
            <circle key={j} cx={-W / 2 + 128 + i * 76 + j * 17} cy={-H / 2 + 134} r={6}
                    fill="rgba(255,255,255,0.75)" />
          ))}
        </g>
      ))}
      <rect x={-W / 2 + 34} y={H / 2 - 54} width={148} height={14} rx={7} fill="rgba(255,255,255,0.55)" />
    </g>
  );
};

/* ---- La couche d'orchestration -----------------------------------------
   Trois plateaux empiles, legerement decales : la profondeur vient du
   decalage, pas d'une ombre. Le plateau du milieu porte la marque.        */
export const Layer: React.FC<{
  skin: Skin;
  frame: number;
  from?: number;
  w?: number;
  label?: React.ReactNode;
}> = ({skin, frame, from = 0, w = 520, label}) => {
  const p = palette(skin);
  const h = 64, gap = 56;
  return (
    <g>
      {[2, 1, 0].map((i) => {
        const a = at(frame, from + step(2 - i, 5), 20);
        const y = (i - 1) * gap;
        const mid = i === 1;
        return (
          <g key={i} opacity={a} transform={`translate(0 ${mix(28, 0, a)})`}>
            <rect
              x={-w / 2} y={y - h / 2} width={w} height={h} rx={22}
              fill={mid ? p.key : p.face}
              stroke={mid ? 'none' : p.line}
              strokeWidth={5}
              opacity={mid ? 1 : 0.95}
            />
            {!mid ? (
              <>
                <rect x={-w / 2 + 34} y={y - 7} width={120} height={14} rx={7} fill={p.quiet} />
                <rect x={w / 2 - 154} y={y - 7} width={120} height={14} rx={7} fill={p.quiet} />
              </>
            ) : null}
          </g>
        );
      })}
      {label ? <g transform="translate(0 0)">{label}</g> : null}
    </g>
  );
};

/* ---- La pastille de paiement -------------------------------------------
   L'unite qui circule d'un bout a l'autre d'un film. Sa couleur dit de
   quel cote du monde elle se trouve ; elle change au passage de la
   couche.                                                                 */
export const Token: React.FC<{r?: number; color: string; ring?: string; o?: number}> = ({
  r = 26,
  color,
  ring,
  o = 1,
}) => (
  <g opacity={o}>
    {ring ? <circle r={r + 12} fill="none" stroke={ring} strokeWidth={4} opacity={0.5} /> : null}
    <circle r={r} fill={color} />
    <circle r={r * 0.42} fill="rgba(255,255,255,0.95)" />
  </g>
);

/* ---- L'onde d'arrivee ---------------------------------------------------
   Un cercle qui s'ouvre et s'efface : la seule facon dont la serie dit
   « c'est arrive ».                                                        */
export const Ping: React.FC<{frame: number; from: number; color: string; r?: number}> = ({
  frame,
  from,
  color,
  r = 90,
}) => {
  const t = at(frame, from, 24, EASE.move);
  if (t <= 0 || t >= 1) return null;
  return <circle r={mix(12, r, t)} fill="none" stroke={color} strokeWidth={mix(10, 1, t)} opacity={1 - t} />;
};

/* ---- L'entreprise -------------------------------------------------------
   Un commerce ou une societe : un volume simple, des ouvertures, une
   enseigne. Assez generique pour ne designer personne.                    */
export const Shop: React.FC<{skin: Skin; frame: number; from?: number}> = ({
  skin,
  frame,
  from = 0,
}) => {
  const p = palette(skin);
  const build = at(frame, from, 18);
  const W = 300, H = 250;
  return (
    <g opacity={build}>
      <rect x={-W / 2} y={-H / 2 + 44} width={W} height={H - 44} rx={18}
            fill={p.face} stroke={p.line} strokeWidth={5} />
      <path d={`M${-W / 2 - 16} ${-H / 2 + 44} L${-W / 2 + 22} ${-H / 2} L${W / 2 - 22} ${-H / 2} L${W / 2 + 16} ${-H / 2 + 44} Z`}
            fill={p.key} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={-W / 2 + 34 + i * 78} y={-H / 2 + 86} width={54} height={54} rx={10}
              fill={p.quiet} opacity={at(frame, from + 8 + step(i, 3), 12)} />
      ))}
      <rect x={-46} y={H / 2 - 92} width={92} height={92} rx={10} fill={p.quiet} />
    </g>
  );
};

/* ---- Le noeud -----------------------------------------------------------
   L'unite d'un reseau : un disque qui porte un signe, pas un point nu.   */
export const Node: React.FC<{
  r?: number;
  skin: Skin;
  frame: number;
  from?: number;
  kind?: 'bank' | 'wallet' | 'plain';
}> = ({r = 46, skin, frame, from = 0, kind = 'plain'}) => {
  const p = palette(skin);
  const t = at(frame, from, 16);
  if (t <= 0.004) return null;
  return (
    <g opacity={t} transform={`scale(${mix(0.72, 1, t)})`}>
      <circle r={r} fill={p.face} stroke={p.line} strokeWidth={4} />
      {kind === 'bank' ? (
        <g>
          <path d={`M${-r * 0.5} ${-r * 0.1} L0 ${-r * 0.5} L${r * 0.5} ${-r * 0.1} Z`} fill={p.key} />
          <rect x={-r * 0.46} y={r * 0.26} width={r * 0.92} height={r * 0.18} rx={4} fill={p.key} />
          {[-1, 0, 1].map((i) => (
            <rect key={i} x={i * r * 0.3 - r * 0.07} y={-r * 0.06} width={r * 0.14} height={r * 0.3} fill={p.key} />
          ))}
        </g>
      ) : kind === 'wallet' ? (
        <rect x={-r * 0.26} y={-r * 0.46} width={r * 0.52} height={r * 0.92} rx={r * 0.16}
              fill="none" stroke={p.key} strokeWidth={4} />
      ) : (
        <circle r={r * 0.32} fill={p.key} />
      )}
    </g>
  );
};
