import React from 'react';
import {Easing, interpolate} from 'remotion';
import {COLORS, ColorKey, GRID, VISUAL_START, rng} from '../../config';
import {VisualKey} from '../../spots';

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/* Zone reservee au schema, sous le bloc de texte. */
export const VIS = {
  x0: 120,
  y0: GRID.visTop,
  x1: 960,
  y1: GRID.visBottom,
  cx: 540,
  cy: Math.round((GRID.visTop + GRID.visBottom) / 2),
};

export type VisualProps = {
  /** Ecran courant, 0 a 3 : le schema se construit d'un ecran au suivant. */
  stage: number;
  /** Image locale dans l'ecran. */
  frame: number;
  bg: ColorKey;
  labels?: string[];
};

/**
 * Avancement d'un element apparu a l'ecran `at`.
 * Avant : rien. Pendant : il se construit, mais seulement une fois le texte
 * pose (VISUAL_START). Apres : il est acquis et ne rejoue pas.
 */
const grow = (p: VisualProps, at: number, delay = 0, dur = 26) => {
  if (p.stage > at) return 1;
  if (p.stage < at) return 0;
  return interpolate(
    p.frame,
    [VISUAL_START + delay, VISUAL_START + delay + dur],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT}
  );
};

/** Le vert vif sature demande des traits clairs ; les fonds pales, l'inverse. */
const palette = (bg: ColorKey) =>
  bg === 'green'
    ? {node: COLORS.white, line: COLORS.white, card: COLORS.white, text: COLORS.ink,
       accent: COLORS.deep, faint: 0.45}
    : {node: COLORS.green, line: COLORS.leaf, card: COLORS.white, text: COLORS.ink,
       accent: COLORS.green, faint: 0.85};

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg
    width={1080}
    height={1350}
    viewBox="0 0 1080 1350"
    style={{position: 'absolute', inset: 0}}
  >
    {children}
  </svg>
);

/* ---- Primitives --------------------------------------------------------- */

/* Largeur moyenne d'une capitale d'Outfit 800, en fraction du corps. Sert a
   dimensionner les libelles sans mesure DOM : le rendu reste identique a
   chaque passage. */
const CAP_RATIO = 0.6;

/* Plancher de corps des libelles de schema. 34 px sur 1080 valent 12,6 px sur
   un fil LinkedIn de 400 px de large : c'est la limite basse de lisibilite
   sur telephone, et elle commande la taille des blocs, pas l'inverse. */
const LABEL_MIN = 34;
const LABEL_MAX = 38;

/**
 * Met un libelle dans un bloc : une ligne si elle tient, sinon deux, coupees
 * a l'espace qui equilibre le mieux. Jamais en dessous de LABEL_MIN — si un
 * libelle n'y tient pas, c'est le bloc qu'il faut elargir.
 */
const labelLayout = (label: string, w: number, h: number) => {
  const maxW = w - 36;
  const fit = (lines: string[]) => {
    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    return Math.min(
      LABEL_MAX,
      maxW / (longest * CAP_RATIO),
      (h - 20) / (lines.length * 1.18)
    );
  };
  let best = [label];
  let size = fit(best);
  if (size < LABEL_MIN && label.includes(' ')) {
    const words = label.split(' ');
    for (let i = 1; i < words.length; i++) {
      const candidate = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
      const s2 = fit(candidate);
      if (s2 > size) {
        best = candidate;
        size = s2;
      }
    }
  }
  return {lines: best, size};
};

const Card: React.FC<{
  x: number; y: number; w: number; h: number; label?: string;
  p: number; filled?: boolean; pal: ReturnType<typeof palette>; bump?: number;
}> = ({x, y, w, h, label, p, filled, pal, bump = 1}) => {
  if (p <= 0.01) return null;
  const s = (0.86 + 0.14 * p) * bump;
  const lay = label ? labelLayout(label, w, h) : null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`} opacity={p}>
      <rect
        x={x - w / 2} y={y - h / 2} width={w} height={h} rx={Math.min(26, h * 0.26)}
        fill={filled ? pal.accent : pal.card}
        stroke={filled ? 'none' : pal.line}
        strokeWidth={filled ? 0 : 2.5}
      />
      {lay
        ? lay.lines.map((line, i) => (
            <text
              key={i}
              x={x}
              y={y + lay.size * 0.36 + (i - (lay.lines.length - 1) / 2) * lay.size * 1.18}
              textAnchor="middle"
              fontSize={lay.size} fontWeight={800} letterSpacing="0.03em"
              fill={filled ? COLORS.white : pal.text}
            >
              {line}
            </text>
          ))
        : null}
    </g>
  );
};

const Link: React.FC<{
  x1: number; y1: number; x2: number; y2: number; p: number;
  pal: ReturnType<typeof palette>; dashed?: boolean; width?: number;
}> = ({x1, y1, x2, y2, p, pal, dashed, width = 3}) =>
  p <= 0.01 ? null : (
    <line
      x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p}
      stroke={pal.line} strokeWidth={width} strokeOpacity={pal.faint}
      strokeLinecap="round" strokeDasharray={dashed ? '2 14' : undefined}
    />
  );

const Arc: React.FC<{
  x1: number; y1: number; x2: number; y2: number; lift: number; p: number;
  pal: ReturnType<typeof palette>;
}> = ({x1, y1, x2, y2, lift, p, pal}) => {
  if (p <= 0.01) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - lift;
  // on raccourcit la courbe en deplacant son extremite le long du parametre
  const t = p;
  const ex = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
  const ey = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
  const cx = x1 + (mx - x1) * t;
  const cy = y1 + (my - y1) * t;
  return (
    <path
      d={`M${x1} ${y1} Q${cx} ${cy} ${ex} ${ey}`}
      fill="none" stroke={pal.line} strokeWidth={3}
      strokeOpacity={pal.faint} strokeLinecap="round"
    />
  );
};

const Dot: React.FC<{x: number; y: number; r: number; p: number; fill: string}> = ({
  x, y, r, p, fill,
}) => (p <= 0.01 ? null : <circle cx={x} cy={y} r={r * p} fill={fill} />);

/**
 * Nuage de points deterministe, sans aucune reference geographique : un
 * foyer d'activite, jamais un continent dessine.
 *
 * Les rayons partent de 7 px : en dessous, un point disparait sur un fil
 * LinkedIn de 400 px de large, ou il ne mesurerait plus que deux pixels.
 */
const cloud = (seed: number, n: number, box: {x0: number; y0: number; x1: number; y1: number}) => {
  const r = rng(seed);
  return Array.from({length: n}, () => ({
    x: box.x0 + r() * (box.x1 - box.x0),
    y: box.y0 + r() * (box.y1 - box.y0),
    s: 7 + r() * 6,
    rank: r(),
  }));
};

/* =========================================================================
   LES 14 SCHEMAS
   Tous abstraits : aucun nom, aucun logo, aucun drapeau, aucun chiffre.
   Ils illustrent une vision et un fonctionnement general, jamais une
   transaction reellement realisee.
   ========================================================================= */

/** 01 — un foyer d'activite, puis des liaisons vers plusieurs regions. */
const ArcsOut: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const origin = {x: 300, y: 1060};
  const dests = [
    {x: 820, y: 840},
    {x: 900, y: 1000},
    {x: 840, y: 1170},
  ];
  const home = cloud(101, 11, {x0: 200, y0: 950, x1: 410, y1: 1170});
  return (
    <Svg>
      {home.map((d, i) => (
        <Dot key={i} x={d.x} y={d.y} r={d.s} p={grow(p, 0, d.rank * 10)} fill={pal.node} />
      ))}
      {dests.map((d, i) => (
        <Arc key={i} x1={origin.x} y1={origin.y} x2={d.x} y2={d.y}
             lift={120 - i * 40} p={grow(p, 2, i * 9, 30)} pal={pal} />
      ))}
      {dests.map((d, i) => (
        <Dot key={`d${i}`} x={d.x} y={d.y} r={11} p={grow(p, 2, 18 + i * 9)} fill={pal.node} />
      ))}
    </Svg>
  );
};

/** 02 — deux blocs institutionnels convergent vers la couche Cambiste. */
const Converge: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const a = {x: 270, y: 850};
  const b = {x: 270, y: 1130};
  const hub = {x: 790, y: 992};
  return (
    <Svg>
      <Link x1={a.x + 130} y1={a.y} x2={hub.x - 140} y2={hub.y} p={grow(p, 2, 0, 24)} pal={pal} />
      <Link x1={b.x + 130} y1={b.y} x2={hub.x - 140} y2={hub.y} p={grow(p, 2, 6, 24)} pal={pal} />
      <Card x={a.x} y={a.y} w={260} h={104} label={L[0]} p={grow(p, 0)} pal={pal} />
      <Card x={b.x} y={b.y} w={260} h={104} label={L[1]} p={grow(p, 1)} pal={pal} />
      <Card x={hub.x} y={hub.y} w={280} h={120} label={L[2]} p={grow(p, 2, 14)} filled pal={pal} />
    </Svg>
  );
};

/** 03 — une interface fictive s'ouvre sur un reseau plus large. */
const WalletOpen: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const w = {x: 300, y: 992};
  const out = cloud(303, 9, {x0: 620, y0: 820, x1: 940, y1: 1170});
  return (
    <Svg>
      <g opacity={grow(p, 0)}>
        <rect x={w.x - 110} y={w.y - 170} width={220} height={340} rx={30}
              fill={pal.card} stroke={pal.line} strokeWidth={2.5} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={w.x - 70} y={w.y - 110 + i * 54} width={140 - i * 34} height={18}
                rx={9} fill={pal.accent} opacity={0.22 + i * 0.1} />
        ))}
        <rect x={w.x - 70} y={w.y + 60} width={140} height={44} rx={22} fill={pal.accent} />
      </g>
      {out.map((d, i) => (
        <React.Fragment key={i}>
          <Link x1={w.x + 110} y1={w.y} x2={d.x} y2={d.y} p={grow(p, 2, i * 5, 26)} pal={pal} width={2.2} />
          <Dot x={d.x} y={d.y} r={d.s} p={grow(p, 2, 10 + i * 5)} fill={pal.node} />
        </React.Fragment>
      ))}
    </Svg>
  );
};

/** 04 — une banque abstraite rayonne vers plusieurs destinations. */
const BankFanOut: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const bank = {x: 250, y: 992};
  const layer = {x: 560, y: 992};
  const dests = [
    {x: 880, y: 840},
    {x: 920, y: 992},
    {x: 880, y: 1144},
  ];
  return (
    <Svg>
      <Link x1={bank.x + 120} y1={bank.y} x2={layer.x - 100} y2={layer.y} p={grow(p, 1, 0, 22)} pal={pal} />
      {dests.map((d, i) => (
        <Link key={i} x1={layer.x + 100} y1={layer.y} x2={d.x} y2={d.y}
              p={grow(p, 2, i * 7, 24)} pal={pal} />
      ))}
      {dests.map((d, i) => (
        <Dot key={`d${i}`} x={d.x} y={d.y} r={12} p={grow(p, 2, 14 + i * 7)} fill={pal.node} />
      ))}
      <Card x={bank.x} y={bank.y} w={240} h={110} label={(p.labels ?? [])[0]} p={grow(p, 0)} pal={pal} />
      <Card x={layer.x} y={layer.y} w={200} h={96} p={grow(p, 1, 10)} filled pal={pal} />
    </Svg>
  );
};

/** 05 — trois etapes reliees l'une apres l'autre. */
const ThreeSteps: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const ys = [850, 992, 1134];
  return (
    <Svg>
      {[0, 1].map((i) => (
        <Link key={i} x1={540} y1={ys[i] + 46} x2={540} y2={ys[i + 1] - 46}
              p={grow(p, i + 1, 0, 20)} pal={pal} />
      ))}
      {ys.map((y, i) => (
        <Card key={i} x={540} y={y} w={520} h={92} label={L[i]} p={grow(p, i)}
              filled={i === 1} pal={pal} />
      ))}
    </Svg>
  );
};

/** 06 — deux systemes relies par un pont numerique abstrait. */
const Bridge: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const a = {x: 230, y: 1060};
  const b = {x: 850, y: 1060};
  const span = grow(p, 1, 0, 30);
  return (
    <Svg>
      <Arc x1={a.x} y1={a.y - 56} x2={b.x} y2={b.y - 56} lift={150} p={span} pal={pal} />
      {[0, 1, 2, 3].map((i) => {
        const t = 0.2 + i * 0.2;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y - 56 - Math.sin(Math.PI * t) * 150 * 0.75;
        return <Dot key={i} x={x} y={y} r={8} p={grow(p, 2, i * 6)} fill={pal.node} />;
      })}
      <Card x={a.x} y={a.y} w={230} h={104} label={L[0]} p={grow(p, 0)} pal={pal} />
      <Card x={b.x} y={b.y} w={230} h={104} label={L[1]} p={grow(p, 2, 10)} pal={pal} />
    </Svg>
  );
};

/** 07 — des blocs isoles s'alignent en un flux clair. */
const Reorder: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const scattered = [
    {x: 230, y: 850}, {x: 820, y: 900}, {x: 330, y: 1150}, {x: 760, y: 1160},
  ];
  const ordered = [
    {x: 230, y: 992}, {x: 437, y: 992}, {x: 643, y: 992}, {x: 850, y: 992},
  ];
  const t = p.stage >= 2
    ? interpolate(p.frame, [VISUAL_START, VISUAL_START + 34], [0, 1],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_INOUT})
    : 0;
  const move = p.stage > 2 ? 1 : t;
  return (
    <Svg>
      {ordered.slice(0, 3).map((o, i) => (
        <Link key={i} x1={o.x + 62} y1={992} x2={ordered[i + 1].x - 62} y2={992}
              p={Math.max(0, (move - 0.75) * 4)} pal={pal} />
      ))}
      {scattered.map((s, i) => (
        <Card key={i}
              x={s.x + (ordered[i].x - s.x) * move}
              y={s.y + (ordered[i].y - s.y) * move}
              w={124} h={88} p={grow(p, 0, i * 6)} pal={pal} />
      ))}
    </Svg>
  );
};

/** 08 — l'interface de l'institution devant, notre couche derriere. */
const BehindLayer: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const back = grow(p, 2, 0, 30);
  return (
    <Svg>
      <g opacity={back * 0.9}>
        <rect x={300} y={830} width={620} height={300} rx={28}
              fill="none" stroke={pal.accent} strokeWidth={3} strokeOpacity={0.55} />
        <text x={898} y={1104} textAnchor="end" fontSize={LABEL_MIN} fontWeight={800}
              letterSpacing="0.04em" fill={pal.accent} opacity={0.85}>
          {L[1]}
        </text>
      </g>
      <g opacity={grow(p, 0)}>
        <rect x={160} y={880} width={400} height={300} rx={30}
              fill={pal.card} stroke={pal.line} strokeWidth={2.5} />
        <text x={200} y={944} fontSize={LABEL_MIN} fontWeight={800} letterSpacing="0.04em"
              fill={pal.text} opacity={grow(p, 1)}>
          {L[0]}
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={200} y={975 + i * 46} width={300 - i * 70} height={20} rx={10}
                fill={pal.accent} opacity={(0.24 + i * 0.1) * grow(p, 1, i * 4)} />
        ))}
      </g>
    </Svg>
  );
};

/** 09 — une entreprise, son institution, un correspondant international. */
const Chain: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const xs = [250, 540, 830];
  return (
    <Svg>
      {[0, 1].map((i) => (
        <Link key={i} x1={xs[i] + 108} y1={992} x2={xs[i + 1] - 108} y2={992}
              p={grow(p, i + 1, 0, 22)} pal={pal} />
      ))}
      {xs.map((x, i) => (
        <Card key={i} x={x} y={992} w={216} h={116} label={L[i]} p={grow(p, i)}
              filled={i === 1} pal={pal} />
      ))}
    </Svg>
  );
};

/** 10 — plusieurs systemes de paiement vers une couche unique. */
const ManyToOne: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const srcY = [838, 950, 1062, 1174];
  const hub = {x: 790, y: 1006};
  return (
    <Svg>
      {srcY.map((y, i) => (
        <Link key={i} x1={352} y1={y} x2={hub.x - 170} y2={hub.y} p={grow(p, 1, i * 6, 24)} pal={pal} />
      ))}
      {srcY.map((y, i) => (
        <Card key={i} x={250} y={y} w={204} h={80} p={grow(p, 0, i * 6)} pal={pal} />
      ))}
      <Card x={hub.x} y={hub.y} w={330} h={132} label={(p.labels ?? [])[0]}
            p={grow(p, 1, 16)} filled pal={pal} />
    </Svg>
  );
};

/** 11 — deux flux qui se rejoignent en une jonction. */
const Merge: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const a = {x: 240, y: 866};
  const b = {x: 240, y: 1118};
  const j = {x: 820, y: 992};
  return (
    <Svg>
      <Arc x1={a.x + 120} y1={a.y} x2={j.x - 40} y2={j.y} lift={-40} p={grow(p, 2, 0, 28)} pal={pal} />
      <Arc x1={b.x + 120} y1={b.y} x2={j.x - 40} y2={j.y} lift={40} p={grow(p, 2, 6, 28)} pal={pal} />
      <Card x={a.x} y={a.y} w={240} h={96} label={L[0]} p={grow(p, 0)} pal={pal} />
      <Card x={b.x} y={b.y} w={240} h={96} label={L[1]} p={grow(p, 1)} pal={pal} />
      <Dot x={j.x} y={j.y} r={26} p={grow(p, 2, 22)} fill={pal.accent} />
    </Svg>
  );
};

/** 12 — des besoins internationaux gravitent autour d'une interface. */
const Orbit: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const c = {x: 540, y: 1000};
  const pts = [0, 1, 2, 3, 4].map((i) => {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    return {x: c.x + Math.cos(a) * 310, y: c.y + Math.sin(a) * 190, i};
  });
  return (
    <Svg>
      {pts.map((q) => (
        <Link key={q.i} x1={c.x} y1={c.y} x2={q.x} y2={q.y}
              p={grow(p, 2, q.i * 5, 22)} pal={pal} width={2.2} />
      ))}
      {pts.map((q) => (
        <Dot key={`d${q.i}`} x={q.x} y={q.y} r={13} p={grow(p, 1, q.i * 6)} fill={pal.node} />
      ))}
      <g opacity={grow(p, 0)}>
        <rect x={c.x - 112} y={c.y - 124} width={224} height={248} rx={28}
              fill={pal.card} stroke={pal.line} strokeWidth={2.5} />
        <text x={c.x} y={c.y - 66} textAnchor="middle" fontSize={LABEL_MIN} fontWeight={800}
              letterSpacing="0.03em" fill={pal.text}>
          {(p.labels ?? [])[0]}
        </text>
        {[0, 1].map((i) => (
          <rect key={i} x={c.x - 60} y={c.y - 40 + i * 44} width={120 - i * 36} height={18}
                rx={9} fill={pal.accent} opacity={0.3 + i * 0.12} />
        ))}
      </g>
    </Svg>
  );
};

/** 13 — un flux simple devant, des systemes coordonnes derriere. */
const LayeredFlow: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const back = grow(p, 1, 0, 30);
  const net = cloud(1313, 12, {x0: 190, y0: 820, x1: 890, y1: 1180});
  return (
    <Svg>
      <g opacity={back * 0.55}>
        {net.map((d, i) =>
          i === 0 ? null : (
            <line key={i} x1={net[i - 1].x} y1={net[i - 1].y} x2={d.x} y2={d.y}
                  stroke={pal.line} strokeWidth={2} strokeOpacity={0.7} />
          )
        )}
        {net.map((d, i) => (
          <circle key={`c${i}`} cx={d.x} cy={d.y} r={d.s} fill={pal.node} opacity={0.75} />
        ))}
      </g>
      <g>
        <Link x1={266} y1={992} x2={814} y2={992} p={grow(p, 0, 0, 26)} pal={pal} width={4} />
        {[250, 540, 830].map((x, i) => (
          <Card key={i} x={x} y={992} w={150} h={94} p={grow(p, 0, i * 7)}
                filled={i === 1} pal={pal} />
        ))}
      </g>
    </Svg>
  );
};

/** 14 — banque et wallet rejoignent un meme reseau abstrait. */
const JoinNetwork: React.FC<VisualProps> = (p) => {
  const pal = palette(p.bg);
  const L = p.labels ?? [];
  const net = cloud(1414, 10, {x0: 620, y0: 830, x1: 940, y1: 1160});
  const a = {x: 260, y: 880};
  const b = {x: 260, y: 1110};
  return (
    <Svg>
      {net.map((d, i) =>
        i === 0 ? null : (
          <line key={i} x1={net[i - 1].x} y1={net[i - 1].y} x2={d.x} y2={d.y}
                stroke={pal.line} strokeWidth={2} strokeOpacity={pal.faint * 0.8 * grow(p, 0, i * 4)} />
        )
      )}
      {net.map((d, i) => (
        <Dot key={`c${i}`} x={d.x} y={d.y} r={d.s} p={grow(p, 0, i * 4)} fill={pal.node} />
      ))}
      <Link x1={a.x + 120} y1={a.y} x2={640} y2={930} p={grow(p, 1, 0, 24)} pal={pal} />
      <Link x1={b.x + 120} y1={b.y} x2={640} y2={1080} p={grow(p, 2, 0, 24)} pal={pal} />
      <Card x={a.x} y={a.y} w={240} h={100} label={L[0]} p={grow(p, 1)} pal={pal} />
      <Card x={b.x} y={b.y} w={240} h={100} label={L[1]} p={grow(p, 2)} pal={pal} />
    </Svg>
  );
};

export const VISUALS: Record<VisualKey, React.FC<VisualProps>> = {
  arcsOut: ArcsOut,
  converge: Converge,
  walletOpen: WalletOpen,
  bankFanOut: BankFanOut,
  threeSteps: ThreeSteps,
  bridge: Bridge,
  reorder: Reorder,
  behindLayer: BehindLayer,
  chain: Chain,
  manyToOne: ManyToOne,
  merge: Merge,
  orbit: Orbit,
  layeredFlow: LayeredFlow,
  joinNetwork: JoinNetwork,
};
