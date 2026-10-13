
import {C} from '../config';
import {EASE, at, mix} from '../lib/anim';
import {Camera, Glow, Message, SceneDef, Svg} from '../lib/Stage';
import {Africa, Globe, globePoint} from '../art/map';
import {Rail, Trail, along} from '../art/flow';
import {Account, Bank, Phone, Ping, Place, Token} from '../art/objects';
import {MarkG} from '../art/Logo';
import {EndCard} from '../art/EndCard';

/* =========================================================================
   01 — L'AFRIQUE ET LE RESTE DU MONDE
   Deux actes : le continent et le globe dans le noir, puis les
   institutions en pleine lumiere. Le film passe d'une echelle a l'autre
   par un iris centre sur le continent : la carte devient le globe sans
   coupure de regard.
   ========================================================================= */

const DARK = C.forest;

/* Points d'arrivee hors du globe : des reperes abstraits, jamais un pays. */
const ANCHORS: [number, number][] = [
  [820, 616],
  [878, 848],
  [796, 1076],
];

export const film01: SceneDef[] = [
  /* 1 — le continent, seul, dans le noir. 2 s */
  {
    frames: 60,
    tone: 'dark',
    bg: DARK,
    enter: {kind: 'none'},
    render: (f, n) => (
      <>
        <Glow x={540} y={590} r={760} color={C.green} alpha={0.26} />
        <Camera scale={mix(1.06, 1, at(f, 0, 58, EASE.move))}>
          <Svg>
            <Africa x={540} y={580} h={700} frame={f} tone="dark" texture />
          </Svg>
        </Camera>
        <Message lines={['Money moves locally', 'in Africa.']} tone="dark" pos="bottom" frames={n} max={96} />
      </>
    ),
  },

  /* 2 — on recule : la carte devient le globe. 3,5 s */
  {
    frames: 105,
    tone: 'dark',
    bg: DARK,
    enter: {kind: 'iris', x: 540, y: 580},
    render: (f, n) => (
      <>
        <Glow x={540} y={760} r={820} color={C.deep} alpha={0.5} />
        <Camera scale={mix(1.12, 1, at(f, 0, 50, EASE.move))}>
          <Svg>
            <Globe x={540} y={790} d={880} frame={f} tone="dark" spin={mix(-5, 0, at(f, 0, 90, EASE.move))} />
          </Svg>
        </Camera>
        <Message
          lines={['International payments', 'run elsewhere.']}
          tone="dark"
          pos="top"
          frames={n}
          max={92}
        />
      </>
    ),
  },

  /* 3 — la connexion se trace, une valeur la parcourt. 3,5 s */
  {
    frames: 105,
    tone: 'dark',
    bg: DARK,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const g = {x: 330, y: 900, d: 740};
      const s = g.d / 1000;
      const start = globePoint(40, 8); // bord est du continent, sur le globe
      const a: [number, number] = [g.x + (start.x - 500) * s, g.y + (start.y - 500) * s];
      return (
        <>
          <Glow x={260} y={930} r={780} color={C.deep} alpha={0.55} />
          <Svg>
            <Globe x={g.x} y={g.y} d={g.d} frame={f} tone="dark" />
            {ANCHORS.map((b, i) => {
              const c: [number, number] = [mix(a[0], b[0], 0.5), mix(a[1], b[1], 0.5) - 120 + i * 60];
              const t = at(f, 8 + i * 6, 30, EASE.draw);
              const run = at(f, 26 + i * 6, 42, EASE.move);
              const p = along(a, c, b, run);
              const blue = run > 0.55;
              return (
                <g key={i}>
                  <Rail a={a} c={c} b={b} t={t} gradient width={6} />
                  {run > 0.01 && run < 0.999 ? (
                    <>
                      <Trail a={a} c={c} b={b} t={run} color={blue ? C.sky : C.leaf} />
                      <g transform={`translate(${p[0]} ${p[1]})`}>
                        <Token r={15} color={blue ? C.blue : C.green} />
                      </g>
                    </>
                  ) : null}
                  <Place x={b[0]} y={b[1]} s={0.58} o={at(f, 26 + i * 6, 14)}>
                    <Account skin={{tone: 'dark', key: 'blue'}} frame={f} from={26 + i * 6} />
                  </Place>
                  <g transform={`translate(${b[0]} ${b[1]})`}>
                    <Ping frame={f} from={52 + i * 6} color={C.sky} r={128} />
                  </g>
                </g>
              );
            })}
          </Svg>
          <Message lines={["We're building", 'the connection.']} tone="dark" pos="top" frames={n} max={96} />
        </>
      );
    },
  },

  /* 4 — pour qui : banques et portefeuilles mobiles. 3 s */
  {
    frames: 90,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f, n) => {
      const bank: [number, number] = [286, 790];
      const wallet: [number, number] = [800, 790];
      const hub: [number, number] = [540, 1096];
      return (
        <>
          <Svg>
            <circle cx={540} cy={870} r={468 * at(f, 0, 26, EASE.move)} fill={C.mint} />
            <Rail a={[bank[0], bank[1] + 112]} c={[400, 1040]} b={hub} t={at(f, 22, 22, EASE.draw)}
                  color={C.green} width={7} />
            <Rail a={[wallet[0], wallet[1] + 196]} c={[700, 1052]} b={hub} t={at(f, 28, 22, EASE.draw)}
                  color={C.green} width={7} />
            <Place x={bank[0]} y={bank[1]} s={0.86}>
              <Bank skin={{tone: 'light'}} frame={f} from={2} />
            </Place>
            <Place x={wallet[0]} y={wallet[1] + 10} s={0.62}>
              <Phone skin={{tone: 'light'}} frame={f} from={8} rows={2} />
            </Place>
            <Place x={hub[0]} y={hub[1]} o={at(f, 42, 16)} s={mix(0.8, 1, at(f, 42, 16))}>
              <MarkG size={104} />
            </Place>
          </Svg>
          <Message lines={['For African banks', 'and mobile wallets.']} tone="light" pos="top" frames={n} max={92} />
        </>
      );
    },
  },

  /* 5 — carton de fin. 3 s */
  {
    frames: 90,
    tone: 'light',
    bg: C.paper,
    enter: {kind: 'wipe', from: 'bottom'},
    render: (f) => <EndCard frame={f} lines={["Let's connect."]} cta="Talk to us" />,
  },
];
