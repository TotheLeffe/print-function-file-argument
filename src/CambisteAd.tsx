import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Scene1Problem} from './scenes/Scene1Problem';
import {Scene2Flow} from './scenes/Scene2Flow';
import {Scene3Benefits} from './scenes/Scene3Benefits';
import {Scene4Outro} from './scenes/Scene4Outro';
import {COLORS, FONT, fadeInOut} from './theme';

// Découpage à 30 i/s : 0–7 s, 7–15 s, 15–24 s, 24–30 s.
export const SCENES = [
  {from: 0, duration: 210, Component: Scene1Problem},
  {from: 210, duration: 240, Component: Scene2Flow},
  {from: 450, duration: 270, Component: Scene3Benefits},
  {from: 720, duration: 180, Component: Scene4Outro},
] as const;

const SceneFade: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({duration, children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fadeInOut(frame, duration)}}>
      {children}
    </AbsoluteFill>
  );
};

export const CambisteAd: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        fontFamily: FONT,
      }}
    >
      {SCENES.map(({from, duration, Component}) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <SceneFade duration={duration}>
            <Component />
          </SceneFade>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
