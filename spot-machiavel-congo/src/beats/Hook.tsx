import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, SHOTS} from '../components/Backdrop';
import {ChannelTag} from '../components/ChannelTag';
import {SlamText} from '../components/SlamText';
import {Stage} from '../components/Stage';
import type {Layout} from '../layout';
import {COLORS} from '../theme';

/** Beat 1 — the question that stops the thumb, over Machiavelli's face. */
export const Hook: React.FC<{layout: Layout; durationInFrames: number}> = ({
  layout,
  durationInFrames,
}) => {
  const {u, titleScale} = layout;
  const size = u(102) * titleScale;

  return (
    <AbsoluteFill>
      <Backdrop
        layout={layout}
        shot={SHOTS.machiavel}
        from={0.42}
        to={0.35}
        darken={0.55}
        durationInFrames={durationInFrames}
      />
      <Stage layout={layout} impacts={[7, 21]}>
        <ChannelTag layout={layout} />
        <SlamText at={7} fontSize={size} color={COLORS.bone}>
          Et si Le Prince
        </SlamText>
        <SlamText at={21} fontSize={size} color={COLORS.yellow}>
          était congolais&nbsp;?
        </SlamText>
      </Stage>
    </AbsoluteFill>
  );
};
