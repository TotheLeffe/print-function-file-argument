import React from 'react';
import {Composition} from 'remotion';
import {PipelineSpot} from './PipelineSpot';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PipelineSpot"
    component={PipelineSpot}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
