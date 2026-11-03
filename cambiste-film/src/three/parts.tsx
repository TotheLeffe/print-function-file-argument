import React, {useMemo} from 'react';
import * as THREE from 'three';
import {C} from '../config';
import {clamp01, mix} from '../anim';

/* =========================================================================
   LES PIECES DU DECOR
   Un vocabulaire volontairement court : un module satine, une arete
   metallique, une entretoise lumineuse, un port d'interface. Tout le
   decor est bati avec ces quatre pieces.
   ========================================================================= */

export type V3 = [number, number, number];

const UP = new THREE.Vector3(0, 1, 0);

/** Materiau satine bleu nuit : la matiere de fond du film. */
export const Satin: React.FC<{color?: string; rough?: number; metal?: number}> = ({
  color = C.satin,
  rough = 0.44,
  metal = 0.16,
}) => <meshStandardMaterial color={color} roughness={rough} metalness={metal} />;

/** Arete metallique discrete : elle attrape la lumiere de contour. */
export const Edge: React.FC = () => (
  <meshStandardMaterial color="#53708F" roughness={0.22} metalness={0.86} />
);

/**
 * Ligne lumineuse. `lit` la porte a incandescence : hors tone mapping, elle
 * garde sa couleur pleine au lieu de virer au blanc.
 */
export const Lumen: React.FC<{color?: string; power?: number; opacity?: number}> = ({
  color = C.signalLit,
  power = 2.4,
  opacity = 1,
}) => (
  <meshStandardMaterial
    color={color}
    emissive={color}
    emissiveIntensity={power}
    toneMapped={false}
    transparent={opacity < 1}
    opacity={opacity}
    roughness={0.4}
  />
);

/**
 * Une entretoise entre deux points. `t` la fait pousser depuis `a` : c'est
 * ainsi que la structure Cambiste se deploie, segment par segment.
 */
export const Strut: React.FC<{
  a: V3;
  b: V3;
  t?: number;
  w?: number;
  children?: React.ReactNode;
}> = ({a, b, t = 1, w = 0.028, children}) => {
  const {pos, quat, len} = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const l = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
    return {pos: va, quat: q, len: l};
  }, [a, b]);
  const k = clamp01(t);
  if (k <= 0.001) return null;
  const grown = len * k;
  const mid = pos.clone().add(
    new THREE.Vector3(0, grown / 2, 0).applyQuaternion(quat)
  );
  return (
    <mesh position={mid} quaternion={quat}>
      <boxGeometry args={[w, grown, w]} />
      {children ?? <Lumen power={1.8} />}
    </mesh>
  );
};

/** Un module : la brique des deux architectures. Coins adoucis par un chanfrein. */
export const Module: React.FC<{
  pos: V3;
  size: V3;
  color?: string;
  edge?: boolean;
  edgeColor?: string;
  o?: number;
}> = ({pos, size, color = C.satin, edge = true, edgeColor = C.blueLit, o = 1}) => (
  <group position={pos}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.44}
        metalness={0.18}
        transparent={o < 1}
        opacity={o}
      />
    </mesh>
    {edge ? (
      <mesh position={[0, size[1] / 2 + 0.004, size[2] / 2 - 0.02]}>
        <boxGeometry args={[size[0] * 0.92, 0.008, 0.012]} />
        <Lumen color={edgeColor} power={0.55} opacity={o} />
      </mesh>
    ) : null}
  </group>
);

/**
 * Un port d'interface : le point ou un systeme accepte d'etre branche.
 * Eteint, c'est une piece ; allume, c'est une connexion.
 */
export const Port: React.FC<{pos: V3; dir: 1 | -1; lit?: number; o?: number}> = ({
  pos,
  dir,
  lit = 0,
  o = 1,
}) => (
  <group position={pos}>
    <mesh castShadow>
      <boxGeometry args={[0.1, 0.2, 0.34]} />
      <meshStandardMaterial
        color="#53708F"
        roughness={0.24}
        metalness={0.84}
        transparent={o < 1}
        opacity={o}
      />
    </mesh>
    <mesh position={[dir * 0.062, 0, 0]}>
      <boxGeometry args={[0.014, 0.07, 0.26]} />
      <Lumen
        color={lit > 0.02 ? C.signalLit : C.blueLit}
        power={mix(0.5, 3.4, clamp01(lit))}
        opacity={o}
      />
    </mesh>
  </group>
);

/** La pastille qui circule : une instruction, jamais une piece de monnaie. */
export const Pulse: React.FC<{pos: V3; s?: number; color?: string; o?: number}> = ({
  pos,
  s = 1,
  color = C.signalLit,
  o = 1,
}) => (
  <group position={pos} scale={s}>
    <mesh>
      <sphereGeometry args={[0.052, 16, 16]} />
      <Lumen color={color} power={4.2} opacity={o} />
    </mesh>
    <mesh>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.17 * o} toneMapped={false} />
    </mesh>
  </group>
);
