import React from 'react';
import {Composition} from 'remotion';
import {DURATION, FPS, SIZE} from './config';
import {Film} from './Film';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="cambiste-make-the-connection"
      component={Film}
      durationInFrames={DURATION}
      fps={FPS}
      width={SIZE.wide.w}
      height={SIZE.wide.h}
      defaultProps={{format: 'wide' as const}}
    />
    <Composition
      id="cambiste-make-the-connection-vertical"
      component={Film}
      durationInFrames={DURATION}
      fps={FPS}
      width={SIZE.tall.w}
      height={SIZE.tall.h}
      defaultProps={{format: 'tall' as const}}
    />
  </>
);
