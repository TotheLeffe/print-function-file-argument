import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Camera, Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Bank, Layer, Ping, Place, Token} from '../art/objects';
import {Chevron, Rail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   04 — LA CONNEXION BANCAIRE
   Un travelling lateral : la banque reste a gauche, la route s'etire vers
   la droite, et le film suit la route jusqu'au compte international.
   ========================================================================= */

export const film04: SceneDef[] = [
  {
    frames: 60,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Svg>
          <rect x={0} y={560 + (1 - at(f, 0, 22, EASE.move)) * 480} width={1080} height={790} fill={C.mint} />
          <Place x={520} y={900} s={1.34}>
            <Bank skin={{tone: 'light'}} frame={f} from={2} />
          </Place>
        </Svg>
        <Message lines={['African banks.']} tone="light" pos="top" frames={n} />
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
        <Camera x={mix(40, -130, at(f, 10, 86, EASE.move))}>
          <Svg>
            <Place x={352} y={800} s={0.9}>
              <Bank skin={{tone: 'light'}} frame={f} from={0} />
            </Place>
            {[0, 1, 2].map((i) => {
              const y = 700 + i * 104;
              const t = at(f, 16 + i * 8, 40, EASE.draw);
              return (
                <g key={i}>
                  <circle cx={528} cy={y} r={11} fill={C.green} opacity={at(f, 14 + i * 8, 12)} />
                  <line x1={528} y1={y} x2={528 + (860 - 528) * t} y2={y}
                        stroke={C.green} strokeWidth={8} strokeLinecap="round" />
                  <line x1={528 + (860 - 528) * t} y1={y} x2={1140} y2={y}
                        stroke={C.deep} strokeWidth={5} strokeLinecap="round"
                        strokeDasharray="2 22" opacity={0.28} />
                  <g opacity={t > 0.25 ? 1 : 0}>
                    <Chevron a={[528, y]} c={[700, y]} b={[860, y]} t={Math.min(0.96, t)} color={C.deep} />
                  </g>
                </g>
              );
            })}
          </Svg>
        </Camera>
        <Message lines={['New routes', 'for payments.']} tone="light" pos="top" frames={n} max={100} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'left'},
    render: (f, n) => {
      const a: [number, number] = [250, 900];
      const c: [number, number] = [540, 760];
      const b: [number, number] = [830, 900];
      const run = at(f, 26, 46, EASE.move);
      const p = along(a, c, b, run);
      return (
        <>
          <Glow x={540} y={900} r={720} color={C.deep} alpha={0.72} />
          <Svg>
            <Place x={250} y={900} s={0.62}>
              <Bank skin={{tone: 'dark'}} frame={f} from={0} />
            </Place>
            <Rail a={a} c={c} b={b} t={at(f, 14, 30, EASE.draw)} gradient width={7} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={18} color={run > 0.5 ? C.blue : C.green} />
              </g>
            ) : null}
            <Place x={830} y={900} s={0.92} o={at(f, 40, 14)}>
              <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={40} />
            </Place>
            <g transform="translate(830 900)">
              <Ping frame={f} from={70} color={C.sky} r={160} />
            </g>
          </Svg>
          <Message lines={['Connected', 'infrastructure.']} tone="dark" pos="top" frames={n} max={104} />
        </>
      );
    },
  },
  {
    frames: 90,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={1020} r={700} color={C.deep} alpha={0.7} />
        <Svg>
          <Place x={300} y={770} s={0.54}>
            <Bank skin={{tone: 'dark'}} frame={f} from={4} />
          </Place>
          <Place x={790} y={782} s={0.74} o={at(f, 10, 14)}>
            <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={10} />
          </Place>
          <Rail a={[300, 850]} c={[400, 960]} b={[480, 1010]} t={at(f, 24, 20, EASE.draw)} color={C.leaf} width={5} />
          <Rail a={[790, 870]} c={[700, 960]} b={[608, 1010]} t={at(f, 30, 20, EASE.draw)} color={C.sky} width={5} />
          <g transform="translate(540 1050)">
            <Layer skin={{tone: 'dark'}} frame={f} from={34} w={720} />
          </g>
          <Place x={540} y={1050} o={at(f, 60, 14)} s={mix(0.7, 1, at(f, 60, 14))}>
            <MarkG size={82} />
          </Place>
        </Svg>
        <Message lines={['Designed to', 'integrate.']} tone="dark" pos="top" frames={n} max={104} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Build with Cambiste.']} cta="Talk to us" />,
  },
];
