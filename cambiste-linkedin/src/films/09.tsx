import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Bank, Ping, Place, Shop, Token} from '../art/objects';
import {Africa} from '../art/map';
import {Rail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   09 — DES ENTREPRISES AFRICAINES, DES BESOINS MONDIAUX
   Une chaine qui s'allonge d'un plan a l'autre : l'entreprise, son
   institution, le correspondant international. Le cadre recule a mesure
   que la chaine grandit.
   ========================================================================= */

export const film09: SceneDef[] = [
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Svg>
          <g opacity={0.12}>
            <Africa x={540} y={880} h={640} frame={f} tone="light" fill={C.deep} outline={false} />
          </g>
          <Place x={540} y={880} s={1.3}>
            <Shop skin={{tone: 'light'}} frame={f} from={2} />
          </Place>
        </Svg>
        <Message lines={['African businesses', 'trade globally.']} tone="light" pos="top" frames={n} max={92} />
      </>
    ),
  },
  {
    frames: 105,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'push', from: 'right'},
    render: (f, n) => {
      const a: [number, number] = [300, 880];
      const c: [number, number] = [540, 760];
      const b: [number, number] = [790, 880];
      const run = at(f, 30, 42, EASE.move);
      const p = along(a, c, b, run);
      return (
        <>
          <Svg>
            <Place x={300} y={880} s={0.8}>
              <Shop skin={{tone: 'light'}} frame={f} from={0} />
            </Place>
            <Rail a={a} c={c} b={b} t={at(f, 18, 28, EASE.draw)} color={C.green} width={7} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={20} color={C.green} />
              </g>
            ) : null}
            <Place x={790} y={880} s={0.72} o={at(f, 20, 16)}>
              <Bank skin={{tone: 'light'}} frame={f} from={20} />
            </Place>
          </Svg>
          <Message lines={['Their payments', 'should follow.']} tone="light" pos="top" frames={n} max={96} />
        </>
      );
    },
  },
  {
    frames: 115,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'iris', x: 790, y: 880},
    render: (f, n) => {
      const a: [number, number] = [280, 920];
      const c: [number, number] = [540, 780];
      const b: [number, number] = [820, 920];
      const run = at(f, 26, 46, EASE.move);
      const p = along(a, c, b, run);
      return (
        <>
          <Glow x={540} y={940} r={720} color={C.deep} alpha={0.72} />
          <Svg>
            <Place x={280} y={920} s={0.46}>
              <Bank skin={{tone: 'dark'}} frame={f} from={0} />
            </Place>
            <Rail a={a} c={c} b={b} t={at(f, 14, 30, EASE.draw)} gradient width={7} />
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={18} color={run > 0.5 ? C.blue : C.green} />
              </g>
            ) : null}
            <Place x={820} y={920} s={0.72} o={at(f, 50, 14)}>
              <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={50} />
            </Place>
            <g transform="translate(820 920)">
              <Ping frame={f} from={68} color={C.sky} r={170} />
            </g>
          </Svg>
          <Message lines={['Banks and wallets', 'open the way.']} tone="dark" pos="top" frames={n} max={88} />
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
        <Glow x={540} y={940} r={700} color={C.deep} alpha={0.68} />
        <Svg>
          <Rail a={[220, 820]} c={[540, 1040]} b={[860, 820]} t={at(f, 16, 30, EASE.draw)} gradient width={6} />
          <Place x={220} y={820} s={0.42}>
            <Shop skin={{tone: 'dark'}} frame={f} from={0} />
          </Place>
          <Place x={540} y={990} o={at(f, 14, 16)} s={mix(0.7, 1, at(f, 14, 16))}>
            <MarkG size={96} />
          </Place>
          <Place x={860} y={820} s={0.46} o={at(f, 22, 14)}>
            <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={22} />
          </Place>
        </Svg>
        <Message lines={['One connected', 'journey.']} tone="dark" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Built for', 'African business.']} cta="Talk to us" />,
  },
];
