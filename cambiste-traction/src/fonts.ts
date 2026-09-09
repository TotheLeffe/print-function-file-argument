import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

/* Outfit, la police de la serie Cambiste : la plus proche du logotype de
   marque parmi les polices libres testees.

   Elle doit etre prete AVANT la premiere image, sinon le rendu capturerait
   une police de repli. Remotion l'exprime avec delayRender/continueRender —
   qui doivent etre appeles depuis le cycle de rendu, jamais au chargement du
   module. D'ou ce hook plutot qu'un appel de haut niveau. */
const SUBSETS = ['fonts/outfit-latin.woff2', 'fonts/outfit-latin-ext.woff2'];

let ready: Promise<void> | null = null;

const loadOnce = () => {
  if (ready) return ready;
  ready = Promise.all(
    SUBSETS.map((path) =>
      new FontFace('Outfit', `url(${staticFile(path)}) format('woff2')`, {
        weight: '100 900',
        display: 'block',
      })
        .load()
        .then((face) => {
          document.fonts.add(face);
        })
    )
  )
    .then(() => document.fonts.load('900 100px Outfit'))
    .then(() => document.fonts.load('600 30px Outfit'))
    .then(() => undefined);
  return ready;
};

export const useOutfit = () => {
  const [handle] = useState(() => delayRender('Chargement de la police Outfit'));
  useEffect(() => {
    loadOnce()
      .catch(() => undefined)
      .then(() => continueRender(handle));
  }, [handle]);
};
