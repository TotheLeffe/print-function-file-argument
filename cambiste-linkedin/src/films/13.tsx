import {C} from '../config';
import {EASE, at, mix, rng} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Layer, Node, Place, Token} from '../art/objects';
import {Rail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   13 — LA TECHNOLOGIE DERRIERE LE PARCOURS
   Devant, un paiement tout simple. Derriere, ce qu'il faut pour qu'il le
   reste. La camera plonge d'un plan a l'autre ; le trait du premier plan
   ne disparait jamais, il devient le fil conducteur.
   ========================================================================= */

const A: [number, number] = [220, 760];
const Bp: [number, number] = [860, 760];
const C2: [number, number] = [540, 660];

const MESH = (() => {
  const r = rng(1313);
  return Array.from({length: 11}, () => ({
    x: 150 + r() * 780,
    y: 880 + r() * 300,
    k: r(),
  }));
})();

export const film13: SceneDef[] = [
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => {
      const run = at(f, 16, 42, EASE.move);
      const p = along(A, C2, Bp, run);
      return (
        <>
          <Svg>
            <Rail a={A} c={C2} b={Bp} t={at(f, 4, 30, EASE.draw)} color={C.green} width={8} />
            <circle cx={A[0]} cy={A[1]} r={18} fill={C.green} opacity={at(f, 2, 12)} />
            <circle cx={Bp[0]} cy={Bp[1]} r={18} fill={C.green} opacity={at(f, 26, 12)} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={22} color={C.green} />
              </g>
            ) : null}
          </Svg>
          <Message lines={['One simple payment.']} tone="light" pos="top" frames={n} max={92} />
        </>
      );
    },
  },
  {
    frames: 120,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'iris', x: 540, y: 760},
    render: (f, n) => (
      <>
        <Glow x={540} y={1000} r={760} color={C.deep} alpha={0.7} />
        <Svg>
          <Rail a={A} c={C2} b={Bp} t={1} color={C.leaf} width={8} opacity={0.9} />
          {MESH.map((m, i) =>
            i === 0 ? null : (
              <line
                key={i}
                x1={MESH[i - 1].x} y1={MESH[i - 1].y} x2={m.x} y2={m.y}
                stroke={C.leaf} strokeWidth={3}
                opacity={0.35 * at(f, 8 + i * 3, 18)}
              />
            )
          )}
          {MESH.map((m, i) => (
            <g key={`n${i}`} transform={`translate(${m.x} ${m.y})`}>
              <Node skin={{tone: 'dark'}} frame={f} from={6 + i * 3} r={28}
                    kind={m.k < 0.4 ? 'bank' : m.k < 0.7 ? 'wallet' : 'plain'} />
            </g>
          ))}
        </Svg>
        <Message lines={['Many systems', 'behind it.']} tone="dark" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => {
      const order = at(f, 6, 46, EASE.move);
      return (
        <>
          <Glow x={540} y={1000} r={760} color={C.deep} alpha={0.72} />
          <Svg>
            {MESH.map((m, i) => {
              const tx = 200 + (i % 4) * 230;
              const ty = 860 + Math.floor(i / 4) * 120;
              return (
                <g key={i} transform={`translate(${mix(m.x, tx, order)} ${mix(m.y, ty, order)})`}>
                  <Node skin={{tone: 'dark'}} frame={f} from={0} r={28}
                        kind={m.k < 0.4 ? 'bank' : m.k < 0.7 ? 'wallet' : 'plain'} />
                </g>
              );
            })}
            <g transform="translate(540 1200)" opacity={at(f, 46, 20)}>
              <Layer skin={{tone: 'dark'}} frame={f} from={46} w={760} />
            </g>
            <Place x={540} y={1200} o={at(f, 70, 14)} s={mix(0.7, 1, at(f, 70, 14))}>
              <MarkG size={86} />
            </Place>
          </Svg>
          <Message lines={["That's what", "we're building."]} tone="dark" pos="top" frames={n} />
        </>
      );
    },
  },
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Svg>
          <circle cx={540} cy={900} r={410 * at(f, 0, 22, EASE.move)} fill={C.mint} />
          <Rail a={[250, 830]} c={[540, 1020]} b={[830, 830]} t={at(f, 10, 26, EASE.draw)} color={C.green} width={8} />
          <Place x={540} y={970} o={at(f, 22, 16)} s={mix(0.7, 1, at(f, 22, 16))}>
            <MarkG size={118} />
          </Place>
          <circle cx={250} cy={830} r={20} fill={C.green} opacity={at(f, 8, 12)} />
          <circle cx={830} cy={830} r={20} fill={C.blue} opacity={at(f, 14, 12)} />
        </Svg>
        <Message lines={['Built to', 'work together.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Connected', 'infrastructure.']} cta="Talk to us" />,
  },
];
