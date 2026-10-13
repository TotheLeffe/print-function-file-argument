import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config';
import {SPOTS} from './spots';
import {SpotFilm} from './SpotFilm';

/* Quatorze compositions, un seul composant : cambiste-linkedin-01 a -14.
   Chacune fait 1080 x 1350, 30 ips, 450 images — 15,000 s exactement. */
export const RemotionRoot: React.FC = () => (
  <>
    {SPOTS.map((spot) => (
      <Composition
        key={spot.id}
        id={`cambiste-linkedin-${spot.id}`}
        component={SpotFilm}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{spotId: spot.id}}
      />
    ))}
  </>
);
