import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {ASSETS, C, Format} from './config';
import {EASE, at} from './anim';
import {useOutfit} from './fonts';
import {Scene} from './three/Scene';
import {Overlay} from './ui/Overlay';

/* =========================================================================
   MAKE THE CONNECTION — 30 s
   La 3D porte l'espace, la matiere et la lumiere ; la 2D porte le texte
   et l'interface, ou la lisibilite prime. Les deux partagent la meme
   timeline : tout est pilote par le numero d'image.
   ========================================================================= */
export const Film: React.FC<{format: Format}> = ({format}) => {
  useOutfit();
  const frame = useCurrentFrame();
  /* Pendant l'interface, le decor s'estompe au lieu de disparaitre : on
     reste dans le meme espace. */
  const dimE = 0.74 * at(frame, 514, 28, EASE.move) * (1 - at(frame, 674, 30));
  /* Sequence F : la structure se simplifie. Sequence G : elle s'efface
     pour laisser le logotype seul et parfaitement lisible. */
  const dimF = 0.46 * at(frame, 690, 28, EASE.move) * (1 - at(frame, 790, 28));
  const dimG = 0.9 * at(frame, 790, 34, EASE.move);
  const dim = Math.max(dimE, dimF, dimG);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: 'Outfit'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(118% 86% at 50% 36%, ${C.bg2} 0%, ${C.bg} 56%, #04090F 100%)`,
        }}
      />
      <Scene format={format} />
      <AbsoluteFill style={{background: '#040A12', opacity: dim}} />
      <Overlay frame={frame} format={format} />
      <Audio src={staticFile(ASSETS.music)} volume={0.9} />
    </AbsoluteFill>
  );
};
