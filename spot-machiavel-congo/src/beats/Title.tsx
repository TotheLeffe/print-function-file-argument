import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, SHOTS} from '../components/Backdrop';
import {Banner} from '../components/Banner';
import {ChannelTag} from '../components/ChannelTag';
import {SlamText} from '../components/SlamText';
import {Stage} from '../components/Stage';
import type {Layout} from '../layout';
import {COLORS} from '../theme';
import {TITLE} from '../timeline';

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
      <Stage layout={layout} impacts={TITLE.words.map((w) => w.at)}>
        <ChannelTag layout={layout} appearAt={0} />
        {TITLE.words.map((word, i) => (
          <SlamText
            key={word.text}
            at={word.at}
            fontSize={size}
            color={i === 0 ? COLORS.bone : COLORS.yellow}
            letterSpacing={u(-2)}
          >
            {word.text}
          </SlamText>
        ))}
        <Banner layout={layout} at={TITLE.tagline.at}>
          {TITLE.tagline.text}
        </Banner>
      </Stage>
    </AbsoluteFill>
  );
};
