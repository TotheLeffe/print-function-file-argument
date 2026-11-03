import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';
import {C, CAMERA, FOV, Format, SIZE, SPINE_Y} from '../config';
import {EASE, at, mix, sampleKeys} from '../anim';
import {World} from './World';

/* =========================================================================
   LA PRISE DE VUE
   Une lumiere de studio, pas un eclairage uniforme : une source principale
   large, un contour froid, et un accent vert au seul moment ou les deux
   systemes se parlent. La camera suit des reperes : elle ne tourne jamais
   autour des objets et ne cherche jamais son sujet.
   ========================================================================= */

const Rig: React.FC<{frame: number; format: Format}> = ({frame, format}) => {
  const {camera} = useThree();
  const k = sampleKeys(CAMERA[format], frame);
  camera.position.set(k.pos[0], k.pos[1], k.pos[2]);
  camera.lookAt(k.at[0], k.at[1], k.at[2]);
  camera.updateMatrixWorld();
  return null;
};

/**
 * Un studio, pas un ciel : l'environnement est calcule une fois, en
 * memoire, a partir de la scene de reference de three.js. Sans lui, une
 * surface metallique n'a rien a reflechir et vire au noir — c'est ce qui
 * arrive des qu'on monte `metalness` sans environnement.
 *
 * Aucune ressource n'est telechargee : le rendu reste hors reseau.
 */
const Studio: React.FC<{intensity: number}> = ({intensity}) => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.035);
    scene.environment = target.texture;
    pmrem.dispose();
  }, [gl, scene]);
  /* L'intensite, elle, suit le film : au debut le studio n'eclaire presque
     rien, et seule la source principale tombe sur le systeme de gauche.
     C'est ainsi que la structure opposee reste dans la penombre sans etre
     truquee. */
  scene.environmentIntensity = intensity;
  return null;
};

const Lights: React.FC<{frame: number}> = ({frame}) => {
  /* La structure opposee n'est pas « allumee » par un interrupteur : c'est
     la lumiere qui la revele, entre 1,7 s et 4,2 s. */
  const reveal = at(frame, 64, 80, EASE.move);
  /* L'accent vert n'existe que pendant l'echange. */
  const link =
    at(frame, 286, 30) * (1 - at(frame, 540, 60, EASE.move)) +
    at(frame, 300, 20) * 0.4 * (1 - at(frame, 420, 90));
  return (
    <>
      <ambientLight intensity={0.42} color="#1E3350" />
      {/* la source principale : large, douce, posee en haut a gauche */}
      <pointLight
        position={[-3.4, 2.6, 5.2]}
        intensity={34}
        distance={19}
        decay={2}
        color="#D7E6F7"
      />
      <directionalLight
        position={[-4.2, 8.6, 7.6]}
        intensity={3.1}
        color="#E8F1FB"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-bias={-0.0012}
        shadow-radius={5}
      />
      <directionalLight
        position={[6.5, 2.6, -5.2]}
        intensity={mix(0.06, 2.0, reveal)}
        color={C.blueLit}
      />
      <pointLight
        position={[4.6, 1.2, 3.4]}
        intensity={mix(0.2, 15, reveal)}
        distance={14}
        decay={2}
        color="#7FA6D8"
      />
      <pointLight
        position={[0, SPINE_Y - 0.5, 1.1]}
        intensity={link * 26}
        distance={9}
        decay={2}
        color={C.signalLit}
      />
    </>
  );
};

export const Scene: React.FC<{format: Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {w, h} = SIZE[format];
  return (
    <ThreeCanvas
      width={w}
      height={h}
      linear={false}
      flat={false}
      shadows="soft"
      gl={{antialias: true, alpha: true}}
      camera={{fov: FOV[format], near: 0.5, far: 60, position: CAMERA[format][0].pos}}
      style={{position: 'absolute', inset: 0}}
    >
      <Studio intensity={mix(0.13, 0.46, at(frame, 60, 84, EASE.move))} />
      <fogExp2 attach="fog" args={[C.bg, 0.042]} />
      <Rig frame={frame} format={format} />
      <Lights frame={frame} />
      <World frame={frame} dx={format === 'tall' ? 0.66 : 0} />
    </ThreeCanvas>
  );
};
