import {C} from '../config';
import {EASE, at, mix, rng} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Node, Place} from '../art/objects';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   07 — DE LA FRAGMENTATION A LA CONNEXION
   Le mouvement est le propos : des systemes epars se rangent en cercle et
   se relient. Rien d'autre ne bouge pendant qu'ils se deplacent.
   ========================================================================= */

/* Positions de depart, tirees une fois d'une graine fixe : le desordre est
   le meme a chaque rendu. */
const SCATTER = (() => {
  const r = rng(7007);
  return Array.from({length: 8}, () => ({
    x: 170 + r() * 740,
    y: 580 + r() * 640,
    k: r(),
  }));
})();

const RING = SCATTER.map((_, i) => {
  const a = -Math.PI / 2 + (i / SCATTER.length) * Math.PI * 2;
  return {x: 540 + Math.cos(a) * 340, y: 910 + Math.sin(a) * 340};
});

const kindOf = (k: number) => (k < 0.33 ? 'bank' : k < 0.66 ? 'wallet' : 'plain');

export const film07: SceneDef[] = [
  {
    frames: 60,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Svg>
          {SCATTER.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <Node skin={{tone: 'light'}} frame={f} from={2 + i * 3} r={58} kind={kindOf(s.k)} />
            </g>
          ))}
        </Svg>
        <Message lines={['Many payment', 'systems.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Svg>
          {[[0, 3], [1, 5], [2, 6], [4, 7]].map(([a, b], i) => {
            const flick = Math.max(0, Math.sin(at(f, 14 + i * 9, 40) * Math.PI));
            return (
              <line
                key={i}
                x1={SCATTER[a].x} y1={SCATTER[a].y} x2={SCATTER[b].x} y2={SCATTER[b].y}
                stroke={C.deep} strokeWidth={4} strokeDasharray="6 20"
                opacity={0.4 * flick}
              />
            );
          })}
          {SCATTER.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <Node skin={{tone: 'light'}} frame={f} from={0} r={58} kind={kindOf(s.k)} />
            </g>
          ))}
        </Svg>
        <Message lines={['Few connections', 'between them.']} tone="light" pos="top" frames={n} max={96} />
      </>
    ),
  },
  {
    frames: 120,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'iris', x: 540, y: 900},
    render: (f, n) => {
      const move = at(f, 6, 40, EASE.move);
      return (
        <>
          <Glow x={540} y={910} r={700} color={C.deep} alpha={0.72} />
          <Svg>
            {RING.map((r, i) => {
              const q = RING[(i + 1) % RING.length];
              const t = at(f, 46 + i * 4, 18, EASE.draw);
              return (
                <line key={i} x1={r.x} y1={r.y} x2={mix(r.x, q.x, t)} y2={mix(r.y, q.y, t)}
                      stroke={C.leaf} strokeWidth={5} opacity={0.75 * move} />
              );
            })}
            {RING.map((r, i) => (
              <line key={`s${i}`} x1={540} y1={910} x2={mix(540, r.x, at(f, 64 + i * 3, 16, EASE.draw))}
                    y2={mix(910, r.y, at(f, 64 + i * 3, 16, EASE.draw))}
                    stroke={C.green} strokeWidth={4} opacity={0.55} />
            ))}
            {SCATTER.map((s, i) => (
              <g key={i} transform={`translate(${mix(s.x, RING[i].x, move)} ${mix(s.y, RING[i].y, move)})`}>
                <Node skin={{tone: 'dark'}} frame={f} from={0} r={58} kind={kindOf(s.k)} />
              </g>
            ))}
            <Place x={540} y={910} o={at(f, 58, 16)} s={mix(0.6, 1, at(f, 58, 16))}>
              <MarkG size={112} />
            </Place>
          </Svg>
          <Message lines={["We're building", 'the links.']} tone="dark" pos="top" frames={n} />
        </>
      );
    },
  },
  {
    frames: 70,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => {
      const sweep = at(f, 4, 56, EASE.move);
      return (
        <>
          <Glow x={540} y={910} r={700} color={C.deep} alpha={0.72} />
          <Svg>
            {RING.map((r, i) => {
              const q = RING[(i + 1) % RING.length];
              return <line key={i} x1={r.x} y1={r.y} x2={q.x} y2={q.y} stroke={C.leaf} strokeWidth={5} opacity={0.6} />;
            })}
            {RING.map((r, i) => (
              <line key={`s${i}`} x1={540} y1={910} x2={r.x} y2={r.y} stroke={C.green} strokeWidth={4} opacity={0.5} />
            ))}
            {SCATTER.map((s, i) => {
              const lit = Math.max(0, 1 - Math.abs(sweep * RING.length - i));
              return (
                <g key={i} transform={`translate(${RING[i].x} ${RING[i].y}) scale(${mix(1, 1.14, lit)})`}>
                  <Node skin={{tone: 'dark'}} frame={f} from={0} r={58} kind={kindOf(s.k)} />
                </g>
              );
            })}
            <Place x={540} y={910}>
              <MarkG size={112} />
            </Place>
          </Svg>
          <Message lines={['Connection', 'by design.']} tone="dark" pos="top" frames={n} />
        </>
      );
    },
  },
  {
    frames: 90,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={[]} cta="Talk to us" />,
  },
];
