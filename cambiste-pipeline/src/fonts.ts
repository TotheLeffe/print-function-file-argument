import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {ASSETS} from './config';

/* Outfit : la police de la serie Cambiste, retenue parce qu'elle est la plus
   proche du logotype de marque parmi les polices libres.

   Elle doit etre prete AVANT la premiere image, sinon le rendu capturerait
   une police de repli. delayRender/continueRender doivent etre appeles depuis
   le cycle de rendu, jamais au chargement du module : d'ou ce hook. */
let ready: Promise<void> | null = null;

const loadOnce = () => {
  if (ready) return ready;
  ready = Promise.all(
    ASSETS.fonts.map((path) =>
      new FontFace(ASSETS.fontFamily, `url(${staticFile(path)}) format('woff2')`, {
        weight: '100 900',
        display: 'block',
      })
        .load()
        .then((face) => {
          document.fonts.add(face);
        })
    )
  )
    .then(() => document.fonts.load(`800 100px ${ASSETS.fontFamily}`))
    .then(() => document.fonts.load(`600 46px ${ASSETS.fontFamily}`))
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
