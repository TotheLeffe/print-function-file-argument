import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Outro} from './beats/Outro';
import {FlashCut} from './components/FlashCut';
import {Grain} from './components/Grain';
import {useLayout, type SpotFormat} from './layout';
import {COLORS} from './theme';

export type OutroCardProps = {
  format: SpotFormat;
};

/**
 * Séquence outro autonome — à coller à la fin de chaque réel de la série.
 * Même carte que la fin du spot de 5 s, mais sur 3 s pour laisser le temps
 * de lire le nom de la chaîne et de cliquer.
 */
export const OutroCard: React.FC<OutroCardProps> = ({format}) => {
  const layout = useLayout(format);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      <Outro layout={layout} />
      <FlashCut at={[0]} />
      <Grain />
    </AbsoluteFill>
  );
};
