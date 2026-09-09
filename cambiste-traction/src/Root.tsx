import React from 'react';
import {Composition} from 'remotion';
import {TractionSpot} from './TractionSpot';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TractionSpot"
    component={TractionSpot}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
