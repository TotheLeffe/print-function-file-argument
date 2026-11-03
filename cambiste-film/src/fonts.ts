import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {ASSETS} from './config';

/* Outfit, chargee avant la premiere image : sans cela le rendu capturerait
   une police de repli. delayRender doit etre appele depuis le cycle de
   rendu, jamais au chargement du module — d'ou ce hook. */
let ready: Promise<void> | null = null;

const loadOnce = () => {
  if (ready) return ready;
  ready = Promise.all(
    ASSETS.fonts.map((path) =>
      new FontFace(ASSETS.family, `url(${staticFile(path)}) format('woff2')`, {
        weight: '100 900',
        display: 'block',
      })
        .load()
        .then((face) => {
          document.fonts.add(face);
        })
    )
  )
    .then(() => Promise.all([
      document.fonts.load(`700 100px ${ASSETS.family}`),
      document.fonts.load(`500 40px ${ASSETS.family}`),
      document.fonts.load(`300 28px ${ASSETS.family}`),
    ]))
    .then(() => undefined);
  return ready;
};

export const useOutfit = () => {
  const [handle] = useState(() => delayRender('Chargement de la police Outfit'));
  useEffect(() => {
    loadOnce().catch(() => undefined).then(() => continueRender(handle));
  }, [handle]);
};
