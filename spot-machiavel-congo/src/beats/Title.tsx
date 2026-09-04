import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, SHOTS} from '../components/Backdrop';
import {Banner} from '../components/Banner';
import {ChannelTag} from '../components/ChannelTag';
import {SlamText} from '../components/SlamText';
import {Stage} from '../components/Stage';
import type {Layout} from '../layout';
import {COLORS} from '../theme';

/** Beat 2 — the title lands, word by word, over the flag. */
export const Title: React.FC<{layout: Layout; durationInFrames: number}> = ({
  layout,
  durationInFrames,
}) => {
  const {u, titleScale} = layout;
  const size = u(158) * titleScale;

  return (
    <AbsoluteFill>
      <Backdrop
        layout={layout}
        shot={SHOTS.drapeau}
        from={0.34}
        to={0.42}
        panX={-0.03}
        darken={0.5}
        durationInFrames={durationInFrames}
      />
      <Stage layout={layout} impacts={[3, 14]}>
        <ChannelTag layout={layout} appearAt={0} />
        <SlamText at={3} fontSize={size} color={COLORS.bone} letterSpacing={u(-2)}>
          Machiavel
        </SlamText>
        <SlamText at={14} fontSize={size} color={COLORS.yellow} letterSpacing={u(-2)}>
          au Congo
        </SlamText>
        <Banner layout={layout} at={26}>
          Le pouvoir sans l&apos;État
        </Banner>
      </Stage>
    </AbsoluteFill>
  );
};
