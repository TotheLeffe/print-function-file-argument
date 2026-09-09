import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT, HEIGHT, WIDTH, rng} from '../theme';

type Box = {x0: number; y0: number; x1: number; y1: number};

type Props = {
  seed: number;
  count: number;
  box?: Box;
  /** 0 = aucun lien, 1 = reseau pleinement connecte. */
  connect: number;
  /** 0 = aucun noeud visible, 1 = tous. Sert a faire decrocher le reseau. */
  presence?: number;
  nodeColor?: string;
  lineColor?: string;
  /** Amplitude de la derive, en pixels. */
  drift?: number;
  opacity?: number;
  /** Portee de connexion entre deux noeuds, en pixels. */
  reach?: number;
};

/**
 * Le reseau est le motif recurrent de Cambiste : des points relies par des
 * traits fins. Il porte ici toute la dramaturgie du film — il se defait
 * quand l'attention se perd, il se retisse quand les usagers reviennent.
 *
 * Positions et rythmes de derive sont tires d'un generateur graine : le
 * reseau est identique a chaque rendu.
 */
export const NetworkBackground: React.FC<Props> = ({
  seed,
  count,
  box = {x0: 120, y0: 150, x1: WIDTH - 120, y1: HEIGHT - 150},
  connect,
  presence = 1,
  nodeColor = C.green,
  lineColor = C.mint,
  drift = 14,
  opacity = 1,
  reach = 230,
}) => {
  const frame = useCurrentFrame();

  const nodes = useMemo(() => {
    const r = rng(seed);
    return Array.from({length: count}, () => ({
      x: box.x0 + r() * (box.x1 - box.x0),
      y: box.y0 + r() * (box.y1 - box.y0),
      radius: 4 + r() * 5,
      // chaque noeud derive sur sa propre phase et sa propre periode
      phase: r() * Math.PI * 2,
      speed: 0.012 + r() * 0.018,
      axis: r() * Math.PI * 2,
      // ordre d'apparition et de disparition
      rank: r(),
    }));
  }, [seed, count, box.x0, box.y0, box.x1, box.y1]);

  const placed = nodes.map((n) => {
    const t = frame * n.speed + n.phase;
    return {
      ...n,
      px: n.x + Math.cos(t) * Math.cos(n.axis) * drift,
      py: n.y + Math.sin(t) * Math.sin(n.axis) * drift,
      // les noeuds entrent et sortent dans un ordre stable, jamais tous ensemble
      on: interpolate(presence, [n.rank * 0.75, n.rank * 0.75 + 0.25], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    };
  });

  const links: {a: number; b: number; strength: number}[] = [];
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const d = Math.hypot(placed[i].px - placed[j].px, placed[i].py - placed[j].py);
      if (d > reach) continue;
      links.push({a: i, b: j, strength: 1 - d / reach});
    }
  }

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{position: 'absolute', inset: 0, opacity}}
    >
      {links.map((l, i) => {
        const a = placed[l.a];
        const b = placed[l.b];
        // un lien n'existe que si ses deux extremites sont la
        const live = Math.min(a.on, b.on);
        const grow = interpolate(
          connect,
          [a.rank * 0.6, a.rank * 0.6 + 0.4],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}
        );
        const alpha = l.strength * grow * live * 0.9;
        if (alpha <= 0.01) return null;
        return (
          <line
            key={i}
            x1={a.px}
            y1={a.py}
            x2={a.px + (b.px - a.px) * grow}
            y2={a.py + (b.py - a.py) * grow}
            stroke={lineColor}
            strokeWidth={2}
            strokeOpacity={alpha}
            strokeLinecap="round"
          />
        );
      })}
      {placed.map((n, i) =>
        n.on <= 0.01 ? null : (
          <circle
            key={i}
            cx={n.px}
            cy={n.py}
            r={n.radius * n.on}
            fill={nodeColor}
            fillOpacity={0.35 + 0.65 * n.on}
          />
        )
      )}
    </svg>
  );
};
