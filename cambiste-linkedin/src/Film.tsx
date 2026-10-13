import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ASSETS, C, CUT, TOTAL_FRAMES} from './config';
import {SceneDef, enterStyle} from './lib/Stage';
import {useOutfit} from './fonts';
import {FILMS} from './films';

/* =========================================================================
   LE MONTAGE
   Un film est une suite de plans. Chaque plan reste a l'image pendant la
   transition du suivant : sans ce prolongement, la coupe decouvrirait le
   vide. Les durees sont declarees une fois ; les bornes s'en deduisent.
   ========================================================================= */

/* Les plans d'un film ne peuvent pas transiter par les proprietes d'une
   composition : Remotion les serialise, et une fonction ne survit pas au
   passage. Le film est donc designe par son numero, et retrouve ici. */

const Scene: React.FC<{def: SceneDef; last: boolean}> = ({def, last}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: def.bg, ...enterStyle(def.enter, f, CUT)}}>
      {def.render(f, def.frames)}
    </AbsoluteFill>
  );
};

export const Film: React.FC<{id: string}> = ({id}) => {
  useOutfit();
  const scenes: SceneDef[] = FILMS[id];
  if (!scenes) throw new Error(`film inconnu : ${id}`);
  const total = scenes.reduce((n, s) => n + s.frames, 0);
  if (total !== TOTAL_FRAMES) {
    throw new Error(`montage a ${total} images, attendu ${TOTAL_FRAMES}`);
  }
  let t = 0;
  const cuts = scenes.map((s) => {
    const start = t;
    t += s.frames;
    return {start, s};
  });
  return (
    <AbsoluteFill
      style={{
        background: C.paper,
        fontFamily: ASSETS.fontFamily,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {cuts.map(({start, s}, i) => (
        <Sequence
          key={i}
          from={start}
          durationInFrames={s.frames + (i < cuts.length - 1 ? CUT : 0)}
          layout="none"
        >
          <Scene def={s} last={i === cuts.length - 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
