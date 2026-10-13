import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Camera, Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Bank, Layer, Phone, Ping, Place, Token} from '../art/objects';
import {Rail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   02 — CONSTRUIT POUR LES INSTITUTIONS
   Deux clients nommes l'un apres l'autre, chacun seul a l'image, puis
   reunis par une meme couche. Le film va du gros plan a la vue d'ensemble.
   ========================================================================= */

export const film02: SceneDef[] = [
  {
    frames: 60,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Camera scale={mix(1, 1.05, at(f, 0, 58, EASE.move))}>
          <Svg>
            <circle cx={540} cy={870} r={430 * at(f, 0, 22, EASE.move)} fill={C.mint} />
            <Place x={540} y={880} s={1.18}>
              <Bank skin={{tone: 'light'}} frame={f} from={2} />
            </Place>
          </Svg>
        </Camera>
        <Message lines={['Banks.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 90,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'wipe', from: 'right'},
    render: (f, n) => (
      <>
        <Camera scale={mix(1, 1.04, at(f, 0, 86, EASE.move))}>
          <Svg>
            <circle cx={540} cy={860} r={400 * at(f, 0, 20, EASE.move)} fill={C.paper} />
            <Place x={540} y={860} s={1}>
              <Phone skin={{tone: 'light'}} frame={f} from={2} send={at(f, 44, 16)} />
            </Place>
          </Svg>
        </Camera>
        <Message lines={['Mobile wallets.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 120,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'push', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={1000} r={720} color={C.deep} alpha={0.75} />
        <Svg>
          <Place x={266} y={650} s={0.68}>
            <Bank skin={{tone: 'dark'}} frame={f} from={4} />
          </Place>
          <Place x={814} y={652} s={0.58}>
            <Phone skin={{tone: 'dark'}} frame={f} from={10} rows={2} />
          </Place>
          <Rail a={[262, 724]} c={[340, 880]} b={[430, 992]} t={at(f, 30, 22, EASE.draw)} color={C.leaf} width={6} />
          <Rail a={[818, 806]} c={[742, 900]} b={[650, 992]} t={at(f, 36, 22, EASE.draw)} color={C.leaf} width={6} />
          <g transform="translate(540 1022)">
            <Layer skin={{tone: 'dark'}} frame={f} from={42} w={600} />
          </g>
          <Place x={540} y={1022} o={at(f, 70, 14)} s={mix(0.7, 1, at(f, 70, 14))}>
            <MarkG size={86} />
          </Place>
        </Svg>
        <Message lines={['One technology', 'for both.']} tone="dark" pos="top" frames={n} max={100} />
      </>
    ),
  },
  {
    frames: 90,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const a: [number, number] = [430, 848];
      const c: [number, number] = [600, 756];
      const b: [number, number] = [792, 848];
      const run = at(f, 22, 40, EASE.move);
      const p = along(a, c, b, run);
      return (
        <>
          <Glow x={540} y={900} r={700} color={C.deep} alpha={0.7} />
          <Svg>
            {/* la couche du plan precedent, vue de plus pres */}
            <g transform="translate(286 900)">
              <Layer skin={{tone: 'dark'}} frame={f} from={0} w={420} />
            </g>
            <Place x={286} y={900} o={at(f, 10, 14)} s={mix(0.7, 1, at(f, 10, 14))}>
              <MarkG size={96} />
            </Place>
            <Rail a={a} c={c} b={b} t={at(f, 14, 26, EASE.draw)} gradient width={6} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={17} color={run > 0.5 ? C.blue : C.green} />
              </g>
            ) : null}
            <Place x={792} y={900} s={0.98} o={at(f, 30, 14)}>
              <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={30} />
            </Place>
            <g transform="translate(790 900)">
              <Ping frame={f} from={56} color={C.sky} r={190} />
            </g>
          </Svg>
          <Message lines={['Designed for', 'cross-border.']} tone="dark" pos="top" frames={n} max={100} />
        </>
      );
    },
  },
  {
    frames: 90,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Build it', 'with Cambiste.']} cta="Talk to us" />,
  },
];
