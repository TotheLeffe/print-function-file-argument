import React, {useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT, WIDTH, rng} from '../config';

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

type Props = {
  seed: number;
  count: number;
  box: {x0: number; y0: number; x1: number; y1: number};
  /** Fenetre de formation du reseau, relative au plan. */
  forming: [number, number];
  reach?: number;
  opacity?: number;
};

/**
 * Un reseau qui prend forme : les noeuds se posent un a un, puis les liens
 * se tracent entre les plus proches.
 *
 * Le motif est volontairement ABSTRAIT. Il evoque un maillage de partenaires
 * sans jamais nommer ni figurer qui que ce soit : aucun nom, aucun logo,
 * aucun drapeau, aucun compteur. Afficher un partenaire demanderait son
 * accord explicite et ses actifs.
 *
 * Positions et derives viennent d'un generateur graine : le reseau est
 * identique a chaque rendu. Il bouge pendant que le texte, lui, ne bouge pas.
 */
export const NetworkFormation: React.FC<Props> = ({
  seed,
  count,
  box,
  forming,
  reach = 240,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  const nodes = useMemo(() => {
    const r = rng(seed);
    return Array.from({length: count}, () => ({
      x: box.x0 + r() * (box.x1 - box.x0),
      y: box.y0 + r() * (box.y1 - box.y0),
      radius: 4 + r() * 4.5,
      phase: r() * Math.PI * 2,
      speed: 0.011 + r() * 0.014,
      axis: r() * Math.PI * 2,
      rank: r(), // ordre de pose, stable
    }));
  }, [seed, count, box.x0, box.y0, box.x1, box.y1]);

  // avancement global de la formation
  const form = interpolate(frame, forming, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const placed = nodes.map((n) => {
    const t = frame * n.speed + n.phase;
    return {
      ...n,
      px: n.x + Math.cos(t) * Math.cos(n.axis) * 9,
      py: n.y + Math.sin(t) * Math.sin(n.axis) * 9,
      // chaque noeud se pose a son tour, jamais tous ensemble
      on: interpolate(form, [n.rank * 0.55, n.rank * 0.55 + 0.3], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    };
  });

  const links: {a: number; b: number; strength: number}[] = [];
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const d = Math.hypot(placed[i].px - placed[j].px, placed[i].py - placed[j].py);
      if (d <= reach) links.push({a: i, b: j, strength: 1 - d / reach});
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
        // un lien n'existe qu'une fois ses deux extremites posees
        const grow = interpolate(
          form,
          [0.3 + a.rank * 0.45, 0.65 + a.rank * 0.45],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}
        );
        const alpha = l.strength * grow * Math.min(a.on, b.on) * 0.95;
        if (alpha <= 0.01) return null;
        return (
          <line
            key={i}
            x1={a.px}
            y1={a.py}
            x2={a.px + (b.px - a.px) * grow}
            y2={a.py + (b.py - a.py) * grow}
            stroke={COLORS.leaf}
            strokeWidth={2.4}
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
            fill={COLORS.green}
            fillOpacity={0.4 + 0.6 * n.on}
          />
        )
      )}
    </svg>
  );
};
