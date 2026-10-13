import React from 'react';
import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Bank, Place, Token} from '../art/objects';
import {Pt, Rail, along} from '../art/flow';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   11 — LA LIQUIDITE ET LES PAIEMENTS
   Deux courants, pas deux traits : chacun est fait de plusieurs brins qui
   ne se superposent jamais tout a fait. Ils arrivent de deux bords
   opposes, se tressent au centre et repartent en un seul.
   ========================================================================= */

/** Un courant : des brins paralleles, le plus epais au milieu. */
const Stream: React.FC<{
  a: Pt; c: Pt; b: Pt; t: number; color: string;
  n?: number; spread?: number; width?: number; o?: number;
}> = ({a, c, b, t, color, n = 5, spread = 44, width = 11, o = 1}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const k = i - (n - 1) / 2;
      const far = Math.abs(k) / ((n - 1) / 2);
      return (
        <Rail
          key={i}
          a={[a[0], a[1] + k * spread]}
          c={[c[0], c[1] + k * spread * 1.5]}
          b={[b[0], b[1] + k * spread * 0.6]}
          t={Math.max(0, Math.min(1, t * (1.15 - far * 0.2)))}
          color={color}
          width={width - far * 5}
          opacity={o * (1 - far * 0.55)}
        />
      );
    })}
  </>
);

const GA: Pt = [-80, 760], GC: Pt = [420, 700], GB: Pt = [1160, 980];
const BA: Pt = [1160, 1120], BC: Pt = [660, 1180], BB: Pt = [-80, 1000];
const J: Pt = [540, 920];

export const film11: SceneDef[] = [
  {
    frames: 70,
    tone: 'dark',
    bg: C.forest,
    enter: {kind: 'none'},
    render: (f, n) => {
      const t = at(f, 0, 34, EASE.draw);
      return (
        <>
          <Glow x={420} y={840} r={760} color={C.deep} alpha={0.72} />
          <Svg>
            <Stream a={GA} c={GC} b={GB} t={t} color={C.green} />
            {[0, 1, 2].map((i) => {
              const run = at(f, 10 + i * 10, 44, EASE.move);
              if (run <= 0.02 || run >= 0.99) return null;
              const k = (i - 1) * 44;
              const p = along([GA[0], GA[1] + k], [GC[0], GC[1] + k * 1.5], [GB[0], GB[1] + k * 0.6], run);
              return (
                <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
                  <Token r={19 - Math.abs(i - 1) * 4} color={C.green} />
                </g>
              );
            })}
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
      const t = at(f, 0, 36, EASE.draw);
      return (
        <>
          <Glow x={660} y={1020} r={780} color={C.deep} alpha={0.72} />
          <Svg>
            <Stream a={GA} c={GC} b={GB} t={1} color={C.green} o={0.3} />
            <Stream a={BA} c={BC} b={BB} t={t} color={C.blue} />
            {[0, 1, 2].map((i) => {
              const run = at(f, 12 + i * 12, 48, EASE.move);
              if (run <= 0.02 || run >= 0.99) return null;
              const k = (i - 1) * 44;
              const p = along([BA[0], BA[1] + k], [BC[0], BC[1] + k * 1.5], [BB[0], BB[1] + k * 0.6], run);
              return (
                <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
                  <Token r={19 - Math.abs(i - 1) * 4} color={C.blue} />
                </g>
              );
            })}
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
      const pull = at(f, 4, 44, EASE.move);
      const gc: Pt = [mix(GC[0], 300, pull), mix(GC[1], 860, pull)];
      const gb: Pt = [mix(GB[0], J[0], pull), mix(GB[1], J[1], pull)];
      const bc: Pt = [mix(BC[0], 780, pull), mix(BC[1], 980, pull)];
      const bb: Pt = [mix(BB[0], J[0], pull), mix(BB[1], J[1], pull)];
      const out = at(f, 52, 40, EASE.draw);
      return (
        <>
          <Glow x={540} y={920} r={mix(500, 820, pull)} color={C.green} alpha={0.3} />
          <Svg>
            <Stream a={GA} c={gc} b={gb} t={1} color={C.green} spread={mix(44, 16, pull)} />
            <Stream a={BA} c={bc} b={bb} t={1} color={C.blue} spread={mix(44, 16, pull)} />
            <Rail a={J} c={[760, 740]} b={[1080, 700]} t={out} color={C.leaf} width={10} />
            {[0, 1].map((i) => {
              const run = at(f, 64 + i * 14, 36, EASE.move);
              if (run <= 0.02 || run >= 0.98) return null;
              const p = along(J, [760, 740], [1080, 700], run);
              return (
                <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
                  <Token r={16} color={C.white} />
                </g>
              );
            })}
            <Place x={J[0]} y={J[1]} o={at(f, 44, 18)} s={mix(0.5, 1, at(f, 44, 18))}>
              <MarkG size={136} />
            </Place>
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
          <circle cx={540} cy={930} r={430 * at(f, 0, 22, EASE.move)} fill={C.mint} />
          <Rail a={[250, 800]} c={[400, 930]} b={[540, 930]} t={at(f, 8, 22, EASE.draw)} color={C.green} width={10} />
          <Rail a={[850, 1060]} c={[690, 930]} b={[540, 930]} t={at(f, 14, 22, EASE.draw)} color={C.blue} width={10} />
          <Place x={250} y={740} s={0.4}>
            <Bank skin={{tone: 'light'}} frame={f} from={2} />
          </Place>
          <Place x={852} y={1092} s={0.6} o={at(f, 10, 14)}>
            <Account skin={{tone: 'light', key: 'blue'}} frame={f} from={10} />
          </Place>
          <Place x={540} y={930} o={at(f, 24, 16)} s={mix(0.7, 1, at(f, 24, 16))}>
            <MarkG size={130} />
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
