import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Node, Place} from '../art/objects';
import {Rail} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   14 — L'INVITATION
   Le reseau se construit sous nos yeux, une place reste libre, puis deux
   institutions la prennent. Le film finit en pleine lumiere : c'est une
   invitation, pas une demonstration.
   ========================================================================= */

const NET = [
  {x: 540, y: 900},
  {x: 320, y: 760},
  {x: 770, y: 760},
  {x: 300, y: 1080},
  {x: 790, y: 1080},
  {x: 540, y: 660},
];

export const film14: SceneDef[] = [
  {
    frames: 60,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Glow x={540} y={900} r={700} color={C.deep} alpha={0.72} />
        <Svg>
          {NET.slice(1).map((p, i) => (
            <Rail key={i} a={[540, 900]} c={[mix(540, p.x, 0.5), mix(900, p.y, 0.5)]} b={[p.x, p.y]}
                  t={at(f, 6 + i * 4, 22, EASE.draw)} color={C.leaf} width={4} opacity={0.6} />
          ))}
          {NET.slice(1).map((p, i) => (
            <g key={`n${i}`} transform={`translate(${p.x} ${p.y})`}>
              <Node skin={{tone: 'dark'}} frame={f} from={4 + i * 4} r={34} />
            </g>
          ))}
          <Place x={540} y={900} o={at(f, 2, 16)} s={mix(0.6, 1, at(f, 2, 16))}>
            <MarkG size={110} />
          </Place>
        </Svg>
        <Message lines={["Building Africa's", 'payment connections.']} tone="dark" pos="top" frames={n} max={86} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Glow x={540} y={900} r={700} color={C.deep} alpha={0.72} />
        <Svg>
          {NET.slice(1).map((p, i) => (
            <Rail key={i} a={[540, 900]} c={[mix(540, p.x, 0.5), mix(900, p.y, 0.5)]} b={[p.x, p.y]}
                  t={1} color={C.leaf} width={4} opacity={0.4} />
          ))}
          {NET.slice(1).map((p, i) => (
            <g key={`n${i}`} transform={`translate(${p.x} ${p.y})`}>
              <Node skin={{tone: 'dark'}} frame={f} from={0} r={34} />
            </g>
          ))}
          <Rail a={[540, 900]} c={[300, 1010]} b={[190, 1120]} t={at(f, 16, 26, EASE.draw)}
                color={C.green} width={6} />
          <g transform="translate(190 1120)">
            <Node skin={{tone: 'dark'}} frame={f} from={30} r={58} kind="bank" />
          </g>
          <Place x={540} y={900}>
            <MarkG size={110} />
          </Place>
        </Svg>
        <Message lines={['For banks.']} tone="dark" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Glow x={540} y={900} r={700} color={C.deep} alpha={0.72} />
        <Svg>
          {NET.slice(1).map((p, i) => (
            <Rail key={i} a={[540, 900]} c={[mix(540, p.x, 0.5), mix(900, p.y, 0.5)]} b={[p.x, p.y]}
                  t={1} color={C.leaf} width={4} opacity={0.4} />
          ))}
          {NET.slice(1).map((p, i) => (
            <g key={`n${i}`} transform={`translate(${p.x} ${p.y})`}>
              <Node skin={{tone: 'dark'}} frame={f} from={0} r={34} />
            </g>
          ))}
          <Rail a={[540, 900]} c={[300, 1010]} b={[190, 1120]} t={1} color={C.green} width={6} />
          <g transform="translate(190 1120)">
            <Node skin={{tone: 'dark'}} frame={f} from={0} r={58} kind="bank" />
          </g>
          <Rail a={[540, 900]} c={[790, 1010]} b={[890, 1120]} t={at(f, 14, 26, EASE.draw)}
                color={C.green} width={6} />
          <g transform="translate(890 1120)">
            <Node skin={{tone: 'dark'}} frame={f} from={28} r={58} kind="wallet" />
          </g>
          <Place x={540} y={900}>
            <MarkG size={110} />
          </Place>
        </Svg>
        <Message lines={['For mobile wallets.']} tone="dark" pos="top" frames={n} max={92} />
      </>
    ),
  },
  {
    frames: 90,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'iris', x: 540, y: 900},
    render: (f, n) => (
      <>
        <Svg>
          <circle cx={540} cy={900} r={460 * at(f, 0, 26, EASE.move)} fill={C.mint} />
          {NET.slice(1).map((p, i) => (
            <Rail key={i} a={[540, 900]} c={[mix(540, p.x, 0.5), mix(900, p.y, 0.5)]} b={[p.x, p.y]}
                  t={at(f, 4 + i * 3, 20, EASE.draw)} color={C.green} width={5} opacity={0.5} />
          ))}
          {NET.slice(1).map((p, i) => (
            <g key={`n${i}`} transform={`translate(${p.x} ${p.y})`}>
              <Node skin={{tone: 'light'}} frame={f} from={2 + i * 3} r={34} />
            </g>
          ))}
          <Place x={540} y={900} o={at(f, 20, 16)} s={mix(0.7, 1, at(f, 20, 16))}>
            <MarkG size={124} />
          </Place>
        </Svg>
        <Message lines={['Join the build.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={["Let's build together."]} cta="Talk to us" />,
  },
];
