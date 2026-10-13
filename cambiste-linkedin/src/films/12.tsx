import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Phone, Ping, Place, Token} from '../art/objects';
import {Globe} from '../art/map';
import {Rail, along} from '../art/flow';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   12 — L'AMBITION MONDIALE D'UN CLIENT
   Un jeu d'echelles : des besoins lointains gravitent, se rapprochent,
   puis le cadre recule jusqu'au globe ou le telephone n'est qu'un point.
   ========================================================================= */

const ORBIT = [0, 1, 2, 3, 4].map((i) => {
  const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
  return {ux: Math.cos(a), uy: Math.sin(a) * 0.72, i};
});

export const film12: SceneDef[] = [
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Svg>
          <ellipse cx={540} cy={880} rx={430} ry={310} fill="none" stroke={C.deep}
                   strokeWidth={4} strokeDasharray="3 22" opacity={0.3 * at(f, 6, 20)} />
          <Place x={540} y={880} s={0.9}>
            <Phone skin={{tone: 'light'}} frame={f} from={0} rows={2} />
          </Place>
          {ORBIT.map((o) => (
            <g key={o.i} transform={`translate(${540 + o.ux * 430} ${880 + o.uy * 430})`}
               opacity={at(f, 14 + o.i * 4, 16)}>
              <circle r={22} fill={C.blue} />
            </g>
          ))}
        </Svg>
        <Message lines={['Your customer', 'thinks globally.']} tone="light" pos="top" frames={n} max={96} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const pull = at(f, 8, 44, EASE.move);
      return (
        <>
          <Svg>
            {ORBIT.map((o) => {
              const r = mix(430, 236, pull);
              const x = 540 + o.ux * r;
              const y = 880 + o.uy * r;
              return (
                <g key={o.i}>
                  <line x1={540} y1={880} x2={x} y2={y} stroke={C.blue} strokeWidth={4}
                        opacity={0.5 * at(f, 30 + o.i * 4, 18)} />
                  <circle cx={x} cy={y} r={22} fill={C.blue} />
                </g>
              );
            })}
            <Place x={540} y={880} s={0.9}>
              <Phone skin={{tone: 'light'}} frame={f} from={0} rows={2} send={at(f, 56, 16)} />
            </Place>
          </Svg>
          <Message lines={['Your payment', 'offer can too.']} tone="light" pos="top" frames={n} max={96} />
        </>
      );
    },
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'iris', x: 540, y: 880},
    render: (f, n) => (
      <>
        <Glow x={540} y={940} r={780} color={C.deep} alpha={0.7} />
        <Svg>
          <Globe x={540} y={940} d={760} frame={f} tone="dark" />
          <Place x={540} y={760} s={0.3} o={at(f, 26, 16)}>
            <Phone skin={{tone: 'dark'}} frame={f} from={26} rows={2} />
          </Place>
          <g transform="translate(540 760)">
            <Ping frame={f} from={44} color={C.leaf} r={150} />
          </g>
        </Svg>
        <Message lines={['For African banks', 'and mobile wallets.']} tone="dark" pos="top" frames={n} max={88} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const a: [number, number] = [300, 880];
      const c: [number, number] = [540, 780];
      const b: [number, number] = [800, 920];
      const run = at(f, 20, 40, EASE.move);
      const p = along(a, c, b, run);
      return (
        <>
          <Glow x={540} y={900} r={700} color={C.deep} alpha={0.68} />
          <Svg>
            <Place x={296} y={880} s={0.74}>
              <Phone skin={{tone: 'dark'}} frame={f} from={0} rows={2} />
            </Place>
            <Rail a={a} c={c} b={b} t={at(f, 12, 26, EASE.draw)} gradient width={6} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={16} color={run > 0.5 ? C.blue : C.green} />
              </g>
            ) : null}
            <Place x={806} y={920} s={0.88} o={at(f, 34, 14)}>
              <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={34} />
            </Place>
          </Svg>
          <Message lines={['One connected', 'experience.']} tone="dark" pos="top" frames={n} />
        </>
      );
    },
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Explore Cambiste.']} cta="Get in touch" />,
  },
];
