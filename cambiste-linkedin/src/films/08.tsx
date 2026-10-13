import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Camera, Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Layer, Phone, Place} from '../art/objects';
import {Rail} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   08 — VOTRE MARQUE, NOTRE TECHNOLOGIE
   Un jeu de premier et d'arriere-plan : l'interface du client reste
   devant, notre couche passe derriere, puis la camera change de place et
   montre ce qui porte l'ensemble.
   ========================================================================= */

export const film08: SceneDef[] = [
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Camera scale={mix(1.04, 1, at(f, 0, 64, EASE.move))}>
          <Svg>
            <circle cx={540} cy={840} r={430 * at(f, 0, 20, EASE.move)} fill={C.mint} />
            <Place x={540} y={840} s={1.18}>
              <Phone skin={{tone: 'light'}} frame={f} from={0} send={at(f, 38, 16)} />
            </Place>
          </Svg>
        </Camera>
        <Message lines={['Your customers', 'see you.']} tone="light" pos="top" frames={n} />
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
          <g opacity={0.5 * at(f, 10, 26)} transform={`translate(0 ${mix(40, 0, at(f, 10, 26, EASE.move))})`}>
            <g transform="translate(540 860)">
              <Layer skin={{tone: 'light'}} frame={f} from={10} w={880} />
            </g>
          </g>
          <Place x={540} y={840} s={1.02}>
            <Phone skin={{tone: 'light'}} frame={f} from={0} rows={3} />
          </Place>
        </Svg>
        <Message lines={['Your brand', 'stays in front.']} tone="light" pos="top" frames={n} max={96} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'push', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={960} r={760} color={C.deep} alpha={0.75} />
        <Svg>
          <g transform={`translate(540 ${mix(1020, 960, at(f, 0, 34, EASE.move))})`}>
            <Layer skin={{tone: 'dark'}} frame={f} from={2} w={820} />
          </g>
          <Place x={540} y={960} o={at(f, 36, 16)} s={mix(0.7, 1, at(f, 36, 16))}>
            <MarkG size={104} />
          </Place>
          <Place x={540} y={700} s={0.5} o={at(f, 20, 16)}>
            <Phone skin={{tone: 'dark'}} frame={f} from={20} rows={2} />
          </Place>
          <Rail a={[540, 858]} c={[540, 890]} b={[540, 908]} t={at(f, 46, 16, EASE.draw)} color={C.leaf} width={5} />
        </Svg>
        <Message lines={['Our technology', 'works behind.']} tone="dark" pos="top" frames={n} max={96} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={940} r={700} color={C.deep} alpha={0.7} />
        <Svg>
          <Place x={330} y={880} s={0.66}>
            <Phone skin={{tone: 'dark'}} frame={f} from={0} rows={2} />
          </Place>
          <Rail a={[450, 880]} c={[560, 880]} b={[680, 880]} t={at(f, 18, 22, EASE.draw)} color={C.leaf} width={6} />
          <Place x={790} y={880} o={at(f, 26, 16)} s={mix(0.7, 1, at(f, 26, 16))}>
            <MarkG size={132} />
          </Place>
        </Svg>
        <Message lines={['You own', 'the experience.']} tone="dark" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Build together.']} cta="Talk to us" />,
  },
];
