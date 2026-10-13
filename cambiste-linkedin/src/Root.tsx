import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config';
import {Film} from './Film';
import {FILMS} from './films';

/* Les quatorze films : meme format, meme systeme graphique, une mise en
   scene propre a chacun. */
export const RemotionRoot: React.FC = () => (
  <>
    {Object.keys(FILMS).map((id) => (
      <Composition
        key={id}
        id={`cambiste-linkedin-${id}`}
        component={Film}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{id}}
      />
    ))}
  </>
);
