import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, SHOTS} from '../components/Backdrop';
import {ChannelTag} from '../components/ChannelTag';
import {SlamText} from '../components/SlamText';
import {Stage} from '../components/Stage';
import type {Layout} from '../layout';
import {COLORS} from '../theme';
import {HOOK} from '../timeline';

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
      <Stage layout={layout} impacts={HOOK.lines.map((l) => l.at)}>
        <ChannelTag layout={layout} />
        {HOOK.lines.map((line, i) => (
          <SlamText
            key={line.text}
            at={line.at}
            fontSize={size}
            color={i === 0 ? COLORS.bone : COLORS.yellow}
            // Looser than the title lockup: the accent on É would otherwise
            // collide with the line above.
            lineHeight={1.02}
          >
            {line.text.replace(' ?', '\u00a0?')}
          </SlamText>
        ))}
      </Stage>
    </AbsoluteFill>
  );
};
