import React from 'react';
import {C, GAP, LEFT_PORTS, RIGHT_PORTS, SPINE_Y} from '../config';
import {EASE, at, clamp01, mix} from '../anim';
import {Edge, Lumen, Module, Port, Pulse, Satin, Strut, V3} from './parts';

/* =========================================================================
   LE DECOR
   A gauche, une architecture de modules empiles : les institutions
   financieres africaines. A droite, une architecture de rails horizontaux :
   l'infrastructure de paiement internationale. Deux systemes aussi
   soignes l'un que l'autre, batis autrement — et dont les hauteurs
   d'interface ne tombent pas en face.

   Entre les deux, un vide. Au-dessus du vide, et seulement au-dessus,
   la structure Cambiste : un plan de coordination qui aligne des
   interfaces. Jamais un tunnel, jamais un reservoir.
   ========================================================================= */

/* Les jonctions sont prises a l'envers des hauteurs : le port le plus bas
   rejoint la jonction la plus eloignee. Sans cela les liaisons se croisent
   en X au milieu du cadre, et un enchevetrement ne dit pas la
   coordination. */
/* ---- Le routage ---------------------------------------------------------
   Chaque canal suit un trace orthogonal : il sort du port, monte a son
   altitude, traverse, redescend, entre dans le port d'en face. Trois
   altitudes distinctes et trois montees decalees : aucune liaison n'en
   croise une autre. Un enchevetrement ne dirait pas la coordination.     */
const RAIL_Y = [2.18, 2.5, 2.82];
const RISE_L = [-1.46, -1.32, -1.18];
const RISE_R = [1.46, 1.32, 1.18];

type P2 = [number, number];

/* En format vertical les deux systemes se rapprochent : le cadre est deux
   fois moins large, et le vide doit rester lisible sans sortir du champ. */
export const channelPath = (i: number, dx = 0): P2[] => [
  [GAP.left + dx, LEFT_PORTS[i]],
  [RISE_L[i] + dx * 0.5, LEFT_PORTS[i]],
  [RISE_L[i] + dx * 0.5, RAIL_Y[i]],
  [RISE_R[i] - dx * 0.5, RAIL_Y[i]],
  [RISE_R[i] - dx * 0.5, RIGHT_PORTS[i]],
  [GAP.right - dx, RIGHT_PORTS[i]],
];

/** Point d'un trace, de 0 a 1, mesure en longueur parcourue. */
export const channelPoint = (i: number, u: number, dx = 0): V3 => {
  const pts = channelPath(i, dx);
  const seg = pts.slice(1).map((p, k) => Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = clamp01(u) * total;
  for (let k = 0; k < seg.length; k++) {
    if (d <= seg[k] || k === seg.length - 1) {
      const t = seg[k] < 1e-6 ? 0 : clamp01(d / seg[k]);
      return [mix(pts[k][0], pts[k + 1][0], t), mix(pts[k][1], pts[k + 1][1], t), 0];
    }
    d -= seg[k];
  }
  return [pts[0][0], pts[0][1], 0];
};

/* ---- Le systeme de gauche ---------------------------------------------- */
const LeftSystem: React.FC<{frame: number; dx: number}> = ({frame, dx}) => {
  const rows = [-1.62, -0.78, 0.06, 0.9];
  return (
    <group position={[dx, 0, 0]}>
      <Module pos={[-3.05, -2.14, 0]} size={[2.75, 0.22, 2.1]} edge={false} />
      {rows.map((y, i) => (
        <Module
          key={i}
          pos={[-3.05, y, i % 2 ? 0.07 : -0.07]}
          size={[2.52, 0.6, 1.66]}
          edgeColor={C.blueLit}
        />
      ))}
      {LEFT_PORTS.map((y, i) => (
        <Port
          key={i}
          pos={[GAP.left - 0.04, y, 0]}
          dir={1}
          lit={at(frame, 296 + i * 10, 22)}
        />
      ))}
      {/* quelques points secondaires s'allument quand la camera recule */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-3.85 + (i % 2) * 0.55, rows[i] + 0.355, 0.845]}>
          <boxGeometry args={[0.22, 0.016, 0.014]} />
          <Lumen color={C.blueLit} power={mix(0.2, 1.6, at(frame, 128 + i * 9, 26))} />
        </mesh>
      ))}
    </group>
  );
};

/* ---- Le systeme de droite ----------------------------------------------- */
const RightSystem: React.FC<{frame: number; dx: number}> = ({frame, dx}) => {
  const lit = at(frame, 52, 76, EASE.move);
  return (
    <group position={[-dx, 0, 0]}>
      <Module pos={[3.35, -2.14, 0]} size={[3.3, 0.22, 2.5]} edge={false} />
      {[2.12, 4.56].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 4.0, 0.34]} />
          <Satin rough={0.44} metal={0.52} />
        </mesh>
      ))}
      {RIGHT_PORTS.map((y, i) => (
        <group key={i}>
          <Module
            pos={[3.35, y, 0]}
            size={[3.1, 0.28, 2.3]}
            color={C.satin}
            edgeColor={C.blueLit}
          />
          <Port pos={[GAP.right + 0.04, y, 0]} dir={-1} lit={at(frame, 330 + i * 12, 24)} />
        </group>
      ))}
      {/* un seul panneau de verre depoli : un accent, pas un decor */}
      <mesh position={[3.35, 0.6, -1.08]}>
        <boxGeometry args={[2.7, 2.5, 0.04]} />
        <meshPhysicalMaterial
          color={C.bg2}
          roughness={0.42}
          metalness={0.1}
          transmission={0}
          transparent
          opacity={0.42}
        />
      </mesh>
      {/* interfaces de destination : elles apparaissent quand on recule */}
      {RIGHT_PORTS.map((y, i) =>
        [0, 1].map((j) => (
          <mesh key={`${i}-${j}`} position={[2.66 + j * 1.3, y + 0.21, 1.12]}>
            <boxGeometry args={[0.5, 0.025, 0.02]} />
            <Lumen color={C.blueLit} power={mix(0.1, 1.5, lit * at(frame, 140 + i * 10 + j * 5, 24))} />
          </mesh>
        ))
      )}
    </group>
  );
};

/* ---- La structure Cambiste ---------------------------------------------
   Elle se deploie en trois temps : une arete fine parait au-dessus du
   vide, elle s'etend, puis des liaisons descendent vers les interfaces
   des deux cotes. Elle reste au-dessus : elle coordonne, elle ne recoit
   pas les fonds.                                                           */
const Orchestration: React.FC<{frame: number; dx: number}> = ({frame, dx}) => {
  const frame0 = at(frame, 212, 30, EASE.out);
  /* Sequence F : la structure revient « epuree, presque graphique ». Les
     montees et les entrees de port s'effacent, les trois voies et le cadre
     restent. Le texte passe alors devant un fond calme. */
  const calm = at(frame, 688, 34, EASE.move);
  const quiet = 1 - 0.88 * calm;
  /* Trois temps par canal : il sort du systeme de gauche, il traverse —
     c'est le geste du film —, puis il entre a droite. */
  const outL = (i: number) => at(frame, 238 + i * 14, 24, EASE.out);
  const across = (i: number) => at(frame, 258 + i * 16, 36, EASE.draw);
  const intoR = (i: number) => at(frame, 292 + i * 16, 26, EASE.out);
  if (frame0 <= 0.001) return null;
  const postTop = SPINE_Y + 0.3;
  const postBase = 1.84;
  return (
    <group>
      {/* le cadre de coordination : deux montants, une arete de marque */}
      {[-1.58 + dx * 0.5, 1.58 - dx * 0.5].map((x, i) => (
        <mesh
          key={i}
          position={[x, mix(postTop, (postBase + postTop) / 2, frame0), 0]}
          scale={[1, frame0, 1]}
          castShadow
        >
          <boxGeometry args={[0.07, postTop - postBase, 0.2]} />
          <Satin color="#13304A" rough={0.34} metal={0.55} />
        </mesh>
      ))}
      <mesh position={[0, postTop, 0]} scale={[frame0, 1, 1]} castShadow>
        <boxGeometry args={[3.3 - dx, 0.07, 0.26]} />
        <Satin color="#0C2335" rough={0.36} metal={0.42} />
      </mesh>
      <mesh position={[0, postTop + 0.042, 0.135]} scale={[frame0, 1, 1]}>
        <boxGeometry args={[3.24 - dx, 0.012, 0.012]} />
        <Lumen color={C.signalLit} power={1.6} />
      </mesh>

      {[0, 1, 2].map((i) => {
        const p = channelPath(i, dx);
        const a = (k: number): V3 => [p[k][0], p[k][1], 0];
        return (
          <group key={i}>
            <Strut a={a(0)} b={a(1)} t={outL(i)}>
              <Lumen color={C.signalLit} power={0.9 * quiet} opacity={quiet} />
            </Strut>
            <Strut a={a(1)} b={a(2)} t={outL(i)}>
              <Lumen color={C.signalLit} power={0.9 * quiet} opacity={quiet} />
            </Strut>
            <Strut a={a(2)} b={a(3)} t={across(i)} w={0.026}>
              <Lumen color={C.signalLit} power={mix(1.15, 0.8, calm)} />
            </Strut>
            <Strut a={a(3)} b={a(4)} t={intoR(i)}>
              <Lumen color={C.signalLit} power={0.9 * quiet} opacity={quiet} />
            </Strut>
            <Strut a={a(4)} b={a(5)} t={intoR(i)}>
              <Lumen color={C.signalLit} power={0.9 * quiet} opacity={quiet} />
            </Strut>
            {/* les aligneurs : les pieces qui font coincider deux hauteurs */}
            <mesh position={[p[2][0], p[2][1], 0]} scale={clamp01(across(i) * 4) * mix(1, 0.7, calm)}>
              <boxGeometry args={[0.13, 0.1, 0.22]} />
              <Edge />
            </mesh>
            <mesh position={[p[3][0], p[3][1], 0]} scale={clamp01(intoR(i) * 4) * mix(1, 0.7, calm)}>
              <boxGeometry args={[0.13, 0.1, 0.22]} />
              <Edge />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/* ---- Le trajet operationnel --------------------------------------------
   Une liaison directe, en bas et en bleu, entre les deux systemes
   financiers. Elle ne passe pas par la couche Cambiste et ne monte jamais
   vers elle : les operations financieres restent entre les partenaires,
   Cambiste coordonne les echanges techniques au-dessus. C'est la
   difference la plus importante du film, et elle se voit.              */
const OperationalPath: React.FC<{frame: number; dx: number}> = ({frame, dx}) => {
  /* Devant les deux systemes et sous les interfaces : on la voit, elle ne
     touche jamais la couche du dessus. */
  const y = -1.18;
  const z = 1.32;
  const a: V3 = [GAP.left + dx - 0.9, y, z];
  const b: V3 = [GAP.right - dx + 0.9, y, z];
  const draw = at(frame, 392, 40, EASE.draw);
  const fade = 1 - 0.55 * at(frame, 688, 34, EASE.move);
  if (draw <= 0.001) return null;
  return (
    <group>
      <Strut a={a} b={b} t={draw} w={0.034}>
        <Lumen color={C.blueLit} power={mix(1.9, 0.9, 1 - fade)} />
      </Strut>
      {[a, b].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} scale={clamp01(draw * 6)}>
          <boxGeometry args={[0.1, 0.16, 0.16]} />
          <Edge />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => {
        const t = at(frame, 416 + i * 44, 52, EASE.move);
        if (t <= 0.02 || t >= 0.98 || frame > 560) return null;
        const u = i % 2 ? 1 - t : t;
        return (
          <Pulse key={i} pos={[mix(a[0], b[0], u), y, z]} s={0.72} color={C.blueLit} />
        );
      })}
    </group>
  );
};

/* ---- Les signaux --------------------------------------------------------
   Une seule impulsion porte le film. Elle monte d'abord dans le systeme
   de gauche et attend au bord du vide ; une fois la connexion etablie,
   elle la franchit ; puis d'autres la suivent, dans les deux sens.       */
const Signals: React.FC<{frame: number; dx: number}> = ({frame, dx}) => {
  const out: React.ReactNode[] = [];

  // 1. la montee dans le systeme de gauche, puis l'attente au bord du vide
  if (frame < 300) {
    const climb = at(frame, 12, 58, EASE.move);
    const exit = at(frame, 74, 26, EASE.move);
    const y = mix(-1.78, LEFT_PORTS[1], climb);
    const x = mix(-1.9 + dx, GAP.left + dx - 0.12, exit);
    const z = mix(0.96, 0, exit);
    out.push(<Pulse key="wait" pos={[x, y, z]} />);
  }

  // 2. la traversee, une fois la structure en place
  const cross = at(frame, 300, 46, EASE.move);
  if (cross > 0.001 && cross < 0.999) {
    out.push(<Pulse key="cross" pos={channelPoint(1, cross, dx)} s={1.15} />);
  }

  // 3. la reponse du systeme de droite : plus discrete, en bleu
  const back = at(frame, 352, 40, EASE.move);
  if (back > 0.001 && back < 0.999) {
    out.push(<Pulse key="back" pos={channelPoint(1, 1 - back * 0.52, dx)} s={0.8} color={C.blueLit} />);
  }

  // 4. la circulation coordonnee : trois canaux, deux sens
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const start = 396 + i * 16 + k * 36;
      const t = at(frame, start, 52, EASE.move);
      if (t > 0.001 && t < 0.999 && frame < 540) {
        const outbound = (i + k) % 3 !== 2;
        out.push(
          <Pulse
            key={`d${i}-${k}`}
            pos={channelPoint(i, outbound ? t : 1 - t, dx)}
            s={outbound ? 0.86 : 0.7}
            color={outbound ? C.signalLit : C.blueLit}
          />
        );
      }
    }
  }

  // 5. le signal de statut qui monte vers la couche Cambiste, puis au-dela
  const rise = at(frame, 494, 44, EASE.move);
  if (rise > 0.001) {
    const up = at(frame, 524, 34, EASE.move);
    const base = channelPoint(2, mix(1, 0.5, rise), dx);
    out.push(
      <Pulse
        key="rise"
        pos={[base[0], base[1] + up * 2.6, base[2]]}
        s={mix(1, 1.7, up)}
        o={1 - at(frame, 548, 18)}
      />
    );
  }

  return <>{out}</>;
};

/* ---- Le decor complet --------------------------------------------------- */
export const World: React.FC<{frame: number; dx?: number}> = ({frame, dx = 0}) => (
  <group>
    <LeftSystem frame={frame} dx={dx} />
    <RightSystem frame={frame} dx={dx} />
    <Orchestration frame={frame} dx={dx} />
    <OperationalPath frame={frame} dx={dx} />
    <Signals frame={frame} dx={dx} />
    {/* sol : il ne se voit pas, il recoit les ombres de contact */}
    <mesh position={[0, -2.26, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 40]} />
      <meshStandardMaterial color="#050A12" roughness={0.98} metalness={0} />
    </mesh>
  </group>
);
