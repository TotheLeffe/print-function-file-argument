import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Camera, Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Phone, Ping, Place, Token} from '../art/objects';
import {Africa, Globe} from '../art/map';
import {Rail, along} from '../art/flow';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   03 — AU-DELA DU PORTEFEUILLE
   Un seul mouvement de camera porte le film : on part d'un telephone en
   gros plan et on recule jusqu'au globe. Le cadre s'elargit a chaque plan,
   comme le propos.
   ========================================================================= */

export const film03: SceneDef[] = [
  {
    frames: 75,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Camera scale={mix(1.06, 1, at(f, 0, 70, EASE.move))}>
          <Svg>
            <circle cx={540} cy={820} r={440 * at(f, 0, 20, EASE.move)} fill={C.mint} />
            <Place x={540} y={820} s={1.22}>
              <Phone skin={{tone: 'light'}} frame={f} from={0} send={at(f, 40, 18)} />
            </Place>
          </Svg>
        </Camera>
        <Message lines={['Your wallet', 'works at home.']} tone="light" pos="top" frames={n} max={100} />
      </>
    ),
  },
  {
    frames: 105,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'wipe', from: 'top'},
    render: (f, n) => (
      <>
        <Svg>
          <g opacity={0.14}>
            <Africa x={540} y={880} h={620} frame={f} tone="light" fill={C.deep} outline={false} />
          </g>
          <circle
            cx={540} cy={880} r={330}
            fill="none" stroke={C.deep} strokeWidth={6} strokeDasharray="4 26"
            opacity={0.55 * at(f, 18, 22)}
          />
          <Place x={540} y={880} s={0.62}>
            <Phone skin={{tone: 'light'}} frame={f} from={0} rows={2} />
          </Place>
        </Svg>
        <Message lines={['Local payments', 'stop at the border.']} tone="light" pos="top" frames={n} max={88} />
      </>
    ),
  },
  {
    frames: 105,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'iris', x: 540, y: 880},
    render: (f, n) => {
      const a: [number, number] = [540, 880];
      const targets: [number, number][] = [
        [250, 620],
        [838, 672],
        [800, 1120],
      ];
      return (
        <>
          <Glow x={540} y={880} r={700} color={C.deep} alpha={0.7} />
          <Svg>
            {targets.map((b, i) => {
              const c: [number, number] = [mix(a[0], b[0], 0.5) + (i - 1) * 70, mix(a[1], b[1], 0.5) - 60];
              const t = at(f, 10 + i * 6, 28, EASE.draw);
              const run = at(f, 24 + i * 6, 40, EASE.move);
              const p = along(a, c, b, run);
              return (
                <g key={i}>
                  <Rail a={a} c={c} b={b} t={t} gradient width={6} />
                  {run > 0.02 && run < 0.99 ? (
                    <g transform={`translate(${p[0]} ${p[1]})`}>
                      <Token r={14} color={run > 0.5 ? C.blue : C.green} />
                    </g>
                  ) : null}
                  <Place x={b[0]} y={b[1]} s={0.62} o={at(f, 30 + i * 6, 14)}>
                    <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={30 + i * 6} />
                  </Place>
                  <g transform={`translate(${b[0]} ${b[1]})`}>
                    <Ping frame={f} from={46 + i * 6} color={C.sky} r={120} />
                  </g>
                </g>
              );
            })}
            <Place x={540} y={880} s={0.58}>
              <Phone skin={{tone: 'dark'}} frame={f} from={0} rows={2} />
            </Place>
          </Svg>
          <Message lines={["We're building", 'the way out.']} tone="dark" pos="top" frames={n} max={100} />
        </>
      );
    },
  },
  {
    frames: 75,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={420} y={1020} r={760} color={C.deep} alpha={0.65} />
        <Svg>
          <Globe x={420} y={1000} d={700} frame={f} tone="dark" />
          <Place x={856} y={742} s={0.62}>
            <Phone skin={{tone: 'dark'}} frame={f} from={14} rows={2} />
          </Place>
          <Rail a={[690, 866]} c={[800, 800]} b={[856, 790]} t={at(f, 30, 20, EASE.draw)} color={C.leaf} width={5} />
        </Svg>
        <Message lines={['For mobile wallets', 'in Africa.']} tone="dark" pos="top" frames={n} max={92} />
      </>
    ),
  },
  {
    frames: 90,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Explore Cambiste.']} cta="See how" />,
  },
];
