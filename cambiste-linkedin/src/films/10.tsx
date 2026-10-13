import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Bank, Layer, Phone, Place} from '../art/objects';
import {Rail} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   10 — UNE COUCHE D'ORCHESTRATION
   Plusieurs entrees, une seule sortie. Le film part d'un faisceau
   desordonne et le resout en un objet unique, vu de trois quarts.
   ========================================================================= */

const ENTRIES = [700, 790, 880, 970, 1060];

export const film10: SceneDef[] = [
  {
    frames: 60,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Svg>
          {ENTRIES.map((y, i) => {
            const t = at(f, 2 + i * 4, 26, EASE.draw);
            const curl = (i - 2) * 46;
            return (
              <path
                key={i}
                d={`M${-40} ${y} C${260} ${y + curl} ${520} ${y - curl} ${-40 + 1120 * t} ${y + curl * 0.4}`}
                fill="none" stroke={i % 2 ? C.green : C.deep} strokeWidth={7}
                strokeLinecap="round" opacity={i % 2 ? 0.9 : 0.4}
              />
            );
          })}
        </Svg>
        <Message lines={['Many payment', 'systems.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const pull = at(f, 8, 40, EASE.move);
      return (
        <>
          <Svg>
            {ENTRIES.map((y, i) => (
              <path
                key={i}
                d={`M${-40} ${y} Q${300} ${y} ${mix(1120, 540, pull)} ${mix(y, 900, pull)}`}
                fill="none" stroke={i % 2 ? C.green : C.deep} strokeWidth={7}
                strokeLinecap="round" opacity={i % 2 ? 0.9 : 0.4}
              />
            ))}
            <g transform="translate(540 900)">
              <Layer skin={{tone: 'light'}} frame={f} from={34} w={660} />
            </g>
            <Place x={540} y={900} o={at(f, 58, 16)} s={mix(0.7, 1, at(f, 58, 16))}>
              <MarkG size={92} />
            </Place>
          </Svg>
          <Message lines={['One orchestration', 'layer.']} tone="light" pos="top" frames={n} max={92} />
        </>
      );
    },
  },
  {
    frames: 110,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'push', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={940} r={740} color={C.deep} alpha={0.75} />
        <Svg>
          <g transform="translate(540 940)">
            <Layer skin={{tone: 'dark'}} frame={f} from={0} w={740} />
          </g>
          <Place x={540} y={940} o={at(f, 24, 16)} s={mix(0.7, 1, at(f, 24, 16))}>
            <MarkG size={104} />
          </Place>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={at(f, 40 + i * 7, 14)}>
              <circle cx={240 + i * 200} cy={1104} r={13} fill={C.leaf} />
              <line x1={240 + i * 200} y1={1104} x2={240 + i * 200} y2={1010}
                    stroke={C.leaf} strokeWidth={4} opacity={0.6} />
            </g>
          ))}
        </Svg>
        <Message lines={['Designed for banks', 'and mobile wallets.']} tone="dark" pos="top" frames={n} max={88} />
      </>
    ),
  },
  {
    frames: 90,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => (
      <>
        <Glow x={540} y={940} r={700} color={C.deep} alpha={0.7} />
        <Svg>
          <Place x={230} y={760} s={0.4}>
            <Bank skin={{tone: 'dark'}} frame={f} from={0} />
          </Place>
          <Place x={540} y={752} s={0.36}>
            <Phone skin={{tone: 'dark'}} frame={f} from={6} rows={2} />
          </Place>
          <Place x={856} y={766} s={0.52} o={at(f, 12, 14)}>
            <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={12} />
          </Place>
          {[230, 540, 856].map((x, i) => (
            <Rail key={i} a={[x, 850]} c={[x, 920]} b={[540 + (x - 540) * 0.18, 960]}
                  t={at(f, 24 + i * 6, 20, EASE.draw)} color={i === 2 ? C.sky : C.leaf} width={5} />
          ))}
          <g transform="translate(540 1030)">
            <Layer skin={{tone: 'dark'}} frame={f} from={30} w={700} />
          </g>
          <Place x={540} y={1030} o={at(f, 54, 14)} s={mix(0.7, 1, at(f, 54, 14))}>
            <MarkG size={92} />
          </Place>
        </Svg>
        <Message lines={['One integration.']} tone="dark" pos="top" frames={n} max={96} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Meet Cambiste.']} cta="Learn more" />,
  },
];
