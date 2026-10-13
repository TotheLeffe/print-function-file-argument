import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Layer, Phone, Ping, Place, Token} from '../art/objects';
import {Rail, Trail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   05 — COMMENT NOUS RELIONS
   Une seule valeur traverse le film entier. Elle quitte un telephone,
   franchit la couche, atterrit sur un compte international : c'est elle
   qui fait la continuite d'un plan a l'autre, pas une transition.
   ========================================================================= */

const GREEN_TO_BLUE = (t: number) => (t > 0.5 ? C.blue : C.green);

export const film05: SceneDef[] = [
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => {
      const up = at(f, 30, 36, EASE.move);
      return (
        <>
          <Svg>
            <circle cx={540} cy={900} r={420 * at(f, 0, 20, EASE.move)} fill={C.mint} />
            <Place x={540} y={940} s={0.95}>
              <Phone skin={{tone: 'light'}} frame={f} from={0} send={at(f, 26, 16)} rows={2} />
            </Place>
            {up > 0.01 ? (
              <g transform={`translate(540 ${mix(650, 470, up)})`} opacity={Math.min(1, up * 3)}>
                <Token r={26} color={C.green} />
              </g>
            ) : null}
          </Svg>
          <Message lines={['A local payment.']} tone="light" pos="top" frames={n} max={96} />
        </>
      );
    },
  },
  {
    frames: 110,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'iris', x: 540, y: 470},
    render: (f, n) => {
      const drop = at(f, 2, 26, EASE.move);
      const cross = at(f, 36, 30, EASE.move);
      const y = mix(470, 806, drop);
      return (
        <>
          <Svg>
            <g transform="translate(540 870)">
              <Layer skin={{tone: 'light'}} frame={f} from={0} w={800} />
            </g>
            <Place x={540} y={870} o={at(f, 24, 14)} s={mix(0.7, 1, at(f, 24, 14))}>
              <MarkG size={92} />
            </Place>
            {/* la valeur se pose sur la couche, puis change de bord du monde */}
            <g transform={`translate(540 ${y})`}>
              <Token r={36} color={GREEN_TO_BLUE(cross)} ring={cross > 0.5 ? C.sky : undefined} />
            </g>
            <g transform="translate(540 806)">
              <Ping frame={f} from={28} color={C.green} r={190} />
            </g>
          </Svg>
          <Message lines={['Digital liquidity.']} tone="light" pos="top" frames={n} max={96} />
        </>
      );
    },
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const a: [number, number] = [540, 470];
      const c: [number, number] = [760, 650];
      const b: [number, number] = [660, 960];
      const run = at(f, 6, 44, EASE.move);
      const p = along(a, c, b, run);
      return (
        <>
          <Glow x={620} y={960} r={700} color={C.deep} alpha={0.72} />
          <Svg>
            <Rail a={a} c={c} b={b} t={at(f, 2, 26, EASE.draw)} color={C.sky} width={6} dashed />
            {run > 0.02 && run < 0.985 ? (
              <>
                <Trail a={a} c={c} b={b} t={run} color={C.sky} />
                <g transform={`translate(${p[0]} ${p[1]})`}>
                  <Token r={34} color={C.blue} />
                </g>
              </>
            ) : null}
            <Place x={660} y={990} s={1} o={at(f, 14, 14)}>
              <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={14} />
            </Place>
            <g transform="translate(660 990)">
              <Ping frame={f} from={54} color={C.sky} r={220} />
            </g>
          </Svg>
          <Message lines={['An international', 'payout.']} tone="dark" pos="top" frames={n} max={100} />
        </>
      );
    },
  },
  {
    frames: 80,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={900} r={660} color={C.deep} alpha={0.65} />
        <Svg>
          <Rail a={[260, 760]} c={[540, 1000]} b={[820, 760]} t={at(f, 18, 30, EASE.draw)} gradient width={6} />
          <Place x={250} y={756} s={0.46}>
            <Phone skin={{tone: 'dark'}} frame={f} from={0} rows={2} />
          </Place>
          <Place x={540} y={940} o={at(f, 12, 14)} s={mix(0.7, 1, at(f, 12, 14))}>
            <MarkG size={96} />
          </Place>
          <Place x={826} y={756} s={0.68} o={at(f, 20, 14)}>
            <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={20} />
          </Place>
        </Svg>
        <Message lines={['One connected path.']} tone="dark" pos="top" frames={n} max={92} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Connected', 'orchestration.']} cta="See the approach" />,
  },
];
