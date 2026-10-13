import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Place, Token} from '../art/objects';
import {Rail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   11 — LA LIQUIDITE ET LES PAIEMENTS
   Deux flux, deux couleurs, qui se rejoignent. Le film reste dans le noir
   jusqu'a la jonction : la lumiere arrive avec elle.
   ========================================================================= */

const A: [number, number] = [-60, 720];
const B: [number, number] = [1140, 1080];
const J: [number, number] = [540, 900];

export const film11: SceneDef[] = [
  {
    frames: 70,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => {
      const run = at(f, 8, 48, EASE.move);
      const p = along(A, [300, 760], [1140, 900], run);
      return (
        <>
          <Glow x={400} y={860} r={720} color={C.deep} alpha={0.7} />
          <Svg>
            <Rail a={A} c={[300, 760]} b={[1140, 900]} t={at(f, 2, 36, EASE.draw)} color={C.green} width={10} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={20} color={C.green} />
              </g>
            ) : null}
          </Svg>
          <Message lines={['Payments need', 'liquidity.']} tone="dark" pos="top" frames={n} />
        </>
      );
    },
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => {
      const run = at(f, 10, 50, EASE.move);
      const p = along(B, [780, 1140], [-60, 980], run);
      return (
        <>
          <Glow x={700} y={1000} r={740} color={C.deep} alpha={0.7} />
          <Svg>
            <Rail a={A} c={[300, 760]} b={[1140, 900]} t={1} color={C.green} width={10} opacity={0.35} />
            <Rail a={B} c={[780, 1140]} b={[-60, 980]} t={at(f, 4, 38, EASE.draw)} color={C.blue} width={10} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={20} color={C.blue} />
              </g>
            ) : null}
          </Svg>
          <Message lines={['Liquidity needs', 'connections.']} tone="dark" pos="top" frames={n} />
        </>
      );
    },
  },
  {
    frames: 120,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => {
      const braid = at(f, 6, 46, EASE.move);
      return (
        <>
          <Glow x={540} y={900} r={mix(420, 820, braid)} color={C.green} alpha={0.34} />
          <Svg>
            <path
              d={`M${A[0]} ${A[1]} Q${mix(300, 300, braid)} ${mix(760, 880, braid)} ${mix(1140, J[0], braid)} ${mix(900, J[1], braid)}`}
              fill="none" stroke={C.green} strokeWidth={10} strokeLinecap="round"
            />
            <path
              d={`M${B[0]} ${B[1]} Q${mix(780, 780, braid)} ${mix(1140, 920, braid)} ${mix(-60, J[0], braid)} ${mix(980, J[1], braid)}`}
              fill="none" stroke={C.blue} strokeWidth={10} strokeLinecap="round"
            />
            <Place x={J[0]} y={J[1]} o={at(f, 50, 18)} s={mix(0.5, 1, at(f, 50, 18))}>
              <MarkG size={128} />
            </Place>
            {[0, 1, 2].map((i) => {
              const t = at(f, 64 + i * 10, 30, EASE.move);
              const q = along(J, [760, 820], [1120, 760], t);
              return t > 0.02 && t < 0.98 ? (
                <g key={i} transform={`translate(${q[0]} ${q[1]})`}>
                  <Token r={14} color={C.white} />
                </g>
              ) : null;
            })}
            <Rail a={J} c={[760, 820]} b={[1120, 760]} t={at(f, 58, 26, EASE.draw)} color={C.leaf} width={6} />
          </Svg>
          <Message lines={["We're building", 'that bridge.']} tone="dark" pos="top" frames={n} />
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
          <circle cx={540} cy={900} r={400 * at(f, 0, 22, EASE.move)} fill={C.mint} />
          <Rail a={[180, 790]} c={[400, 900]} b={[540, 900]} t={at(f, 10, 22, EASE.draw)} color={C.green} width={9} />
          <Rail a={[900, 1010]} c={[680, 900]} b={[540, 900]} t={at(f, 16, 22, EASE.draw)} color={C.blue} width={9} />
          <Place x={540} y={900} o={at(f, 26, 16)} s={mix(0.7, 1, at(f, 26, 16))}>
            <MarkG size={128} />
          </Place>
        </Svg>
        <Message lines={['Both sides,', 'one rail.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={[]} cta="Talk to us" />,
  },
];
