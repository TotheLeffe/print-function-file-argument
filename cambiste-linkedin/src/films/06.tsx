import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Account, Ping, Place, Token} from '../art/objects';
import {Rail, along} from '../art/flow';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   06 — LES STABLECOINS, SIMPLEMENT
   Un seul objet traverse le film et se transforme : monnaie locale, puis
   unite stable, puis credit sur un compte international. La transformation
   remplace les transitions.
   ========================================================================= */

export const film06: SceneDef[] = [
  {
    frames: 70,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Svg>
          <circle cx={540} cy={840} r={420 * at(f, 0, 22, EASE.move)} fill={C.mint} />
          <g transform={`translate(540 840) scale(${mix(0.6, 1, at(f, 4, 26))})`}>
            <Token r={132} color={C.green} />
          </g>
          <g transform="translate(540 840)">
            <Ping frame={f} from={34} color={C.green} r={260} />
          </g>
        </Svg>
        <Message lines={['Local money.']} tone="light" pos="top" frames={n} />
      </>
    ),
  },
  {
    frames: 110,
    tone: 'light',
    bg: C.mint,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const t = at(f, 10, 34, EASE.move);
      return (
        <>
          <Svg>
            <circle cx={540} cy={860} r={mix(132, 104, t)} fill={mix(1, 0, t) > 0.5 ? C.green : C.white} />
            <circle cx={540} cy={860} r={mix(132, 104, t)} fill={C.white} opacity={t} />
            <circle cx={540} cy={860} r={mix(132, 148, t)} fill="none" stroke={C.green}
                    strokeWidth={mix(0, 14, t)} />
            <rect x={540 - mix(0, 96, t)} y={852} width={mix(0, 192, t)} height={16} rx={8} fill={C.green} />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={540 + Math.cos((i / 4) * Math.PI * 2) * 230}
                      cy={860 + Math.sin((i / 4) * Math.PI * 2) * 230} r={10}
                      fill={C.deep} opacity={0.3 * at(f, 40 + i * 4, 14)} />
            ))}
          </Svg>
          <Message lines={['A stable', 'digital unit.']} tone="light" pos="top" frames={n} />
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
      const a: [number, number] = [160, 1014];
      const c: [number, number] = [540, 640];
      const b: [number, number] = [920, 1014];
      const run = at(f, 30, 48, EASE.move);
      const p = along(a, c, b, run);
      const span = at(f, 8, 30, EASE.draw);
      return (
        <>
          <Glow x={540} y={980} r={740} color={C.deep} alpha={0.7} />
          <Svg>
            {/* deux rives, un tablier */}
            {/* deux rives, et non deux blocs : elles descendent jusqu'au bord */}
            <path d="M0 1350 L0 1050 Q0 1014 36 1014 L286 1014 Q322 1014 322 1050 L322 1350 Z"
                  fill={C.green} opacity={at(f, 0, 16)}
                  transform={`translate(0 ${mix(60, 0, at(f, 0, 20, EASE.move))})`} />
            <path d="M1080 1350 L1080 1050 Q1080 1014 1044 1014 L794 1014 Q758 1014 758 1050 L758 1350 Z"
                  fill={C.blue} opacity={at(f, 6, 16)}
                  transform={`translate(0 ${mix(60, 0, at(f, 6, 20, EASE.move))})`} />
            <Rail a={a} c={c} b={b} t={span} gradient width={12} />
            {[0.2, 0.4, 0.6, 0.8].map((u, i) => {
              const q = along(a, c, b, u);
              return (
                <line key={i} x1={q[0]} y1={q[1]} x2={q[0]} y2={1020}
                      stroke={i < 2 ? C.leaf : C.sky} strokeWidth={6}
                      opacity={0.5 * at(f, 16 + i * 4, 14) * (span > u ? 1 : 0)} />
              );
            })}
            {run > 0.02 && run < 0.99 ? (
              <g transform={`translate(${p[0]} ${p[1]})`}>
                <Token r={42} color={C.white} ring={run > 0.5 ? C.sky : C.leaf} />
              </g>
            ) : null}
          </Svg>
          <Message lines={['Designed to move', 'value across borders.']} tone="dark" pos="top" frames={n} max={84} />
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
        <Glow x={540} y={900} r={660} color={C.deep} alpha={0.66} />
        <Svg>
          <Place x={540} y={900} s={1.05} o={at(f, 4, 16)}>
            <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={4} />
          </Place>
          <g transform="translate(540 900)">
            <Ping frame={f} from={26} color={C.sky} r={240} />
          </g>
        </Svg>
        <Message lines={['Infrastructure,', 'not speculation.']} tone="dark" pos="top" frames={n} max={96} />
      </>
    ),
  },
  {
    frames: 80,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={['Infrastructure', 'by Cambiste.']} cta="Learn more" />,
  },
];
