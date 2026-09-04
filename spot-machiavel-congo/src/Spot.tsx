import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Outro} from './beats/Outro';
import {Hook} from './beats/Hook';
import {Keywords} from './beats/Keywords';
import {Title} from './beats/Title';
import {FlashCut} from './components/FlashCut';
import {Grain} from './components/Grain';
import {useLayout, type SpotFormat} from './layout';
import {BEATS, CUTS} from './timeline';
import {COLORS} from './theme';

export type SpotProps = {
  format: SpotFormat;
};

/**
 * Five seconds, four beats, hard cuts between them:
 * hook → titre → mots-clés → appel à l'action.
 */
export const Spot: React.FC<SpotProps> = ({format}) => {
  const layout = useLayout(format);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.duration}>
        <Hook layout={layout} durationInFrames={BEATS.hook.duration} />
      </Sequence>

      <Sequence from={BEATS.title.from} durationInFrames={BEATS.title.duration}>
        <Title layout={layout} durationInFrames={BEATS.title.duration} />
      </Sequence>

      <Sequence from={BEATS.keywords.from} durationInFrames={BEATS.keywords.duration}>
        <Keywords layout={layout} durationInFrames={BEATS.keywords.duration} />
      </Sequence>

      <Sequence from={BEATS.outro.from} durationInFrames={BEATS.outro.duration}>
        <Outro layout={layout} />
      </Sequence>

      <FlashCut at={CUTS} />
      <Grain />
    </AbsoluteFill>
  );
};
