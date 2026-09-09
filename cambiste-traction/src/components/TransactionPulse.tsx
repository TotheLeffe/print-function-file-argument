import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_INOUT, EASE_OUT} from '../theme';
import {CambisteMark} from './CambisteLogo';

type Point = {x: number; y: number; label: string};

type Props = {
  from: Point;
  to: Point;
  /** Fenetre de trace du rail. */
  rail: [number, number];
  /** Fenetre de trajet de la carte. */
  travel: [number, number];
  /** Fenetre d'apparition des deux noeuds. */
  nodes: [number, number];
};

const Node: React.FC<{p: Point; show: number}> = ({p, show}) => (
  <div
    style={{
      position: 'absolute',
      left: p.x,
      top: p.y,
      transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * show})`,
      opacity: show,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        background: C.green,
        boxShadow: `0 0 0 ${8 * show}px ${C.mint}`,
      }}
    />
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: '0.09em',
        color: C.ink,
        whiteSpace: 'pre',
      }}
    >
      {p.label}
    </div>
  </div>
);

/**
 * Une carte de transaction Cambiste parcourt le rail d'un noeud a l'autre,
 * precedee d'une impulsion qui court le long du trait. C'est la seule
 * sequence du film ou l'on voit la valeur se deplacer.
 *
 * Aucun chiffre : la carte ne porte que la marque et la nature du flux.
 * Afficher un montant ou un volume inventes serait une donnee fabriquee.
 */
export const TransactionPulse: React.FC<Props> = ({from, to, rail, travel, nodes}) => {
  const frame = useCurrentFrame();

  const railP = interpolate(frame, rail, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const nodeA = interpolate(frame, nodes, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const nodeB = interpolate(frame, [nodes[0] + 8, nodes[1] + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const t = interpolate(frame, travel, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_INOUT,
  });

  const railX0 = from.x + 34;
  const railX1 = to.x - 34;
  const cardX = railX0 + (railX1 - railX0) * t;

  // la carte entre et sort en douceur au lieu de surgir
  const cardIn = interpolate(
    frame,
    [travel[0] - 10, travel[0] + 6, travel[1] - 6, travel[1] + 8],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // l'impulsion precede la carte sur le trait
  const pulseT = Math.min(1, t + 0.16);

  return (
    <>
      <svg
        width={1080}
        height={1080}
        viewBox="0 0 1080 1080"
        style={{position: 'absolute', inset: 0}}
      >
        <line
          x1={railX0}
          y1={from.y}
          x2={railX0 + (railX1 - railX0) * railP}
          y2={from.y}
          stroke={C.mint}
          strokeWidth={4}
          strokeLinecap="round"
        />
        {t > 0 && t < 1 ? (
          <>
            <circle
              cx={railX0 + (railX1 - railX0) * pulseT}
              cy={from.y}
              r={26}
              fill={C.green}
              fillOpacity={0.16}
            />
            <circle
              cx={railX0 + (railX1 - railX0) * pulseT}
              cy={from.y}
              r={9}
              fill={C.green}
            />
          </>
        ) : null}
      </svg>

      <Node p={from} show={nodeA} />
      <Node p={to} show={nodeB} />

      {cardIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: cardX,
            top: from.y - 86,
            transform: `translate(-50%, -50%) scale(${0.92 + 0.08 * cardIn})`,
            opacity: cardIn,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 24px',
            borderRadius: 22,
            background: C.white,
            border: `2px solid ${C.mint}`,
            whiteSpace: 'pre',
          }}
        >
          <CambisteMark height={30} />
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '0.07em',
              color: C.ink,
            }}
          >
            PAYMENT
          </span>
        </div>
      ) : null}
    </>
  );
};
