import React from 'react';
import {Composition} from 'remotion';
import {OutroCard} from './OutroCard';
import {Spot} from './Spot';
import {DURATION_IN_FRAMES, FPS, OUTRO_DURATION_IN_FRAMES} from './timeline';
import './theme';

const FORMATS = [
  {suffix: 'Reel', format: 'reel' as const, width: 1080, height: 1920},
  {suffix: 'YouTube', format: 'youtube' as const, width: 1920, height: 1080},
  {suffix: 'Square', format: 'square' as const, width: 1080, height: 1080},
];

/**
 * Les durées viennent de `timeline.ts`, qui les calcule à partir du temps
 * de lecture de chaque texte (voir `reading.ts`) — elles ne sont pas
 * fixées à la main.
 *
 * Deux pièces, trois formats chacune :
 *  - Spot…  : le spot complet de 5 s (accroche → titre → mots-clés → outro)
 *  - Outro… : la séquence de fin de 3 s, à réutiliser sur chaque réel
 *
 * Reel 9:16 → TikTok / Instagram Reels / YouTube Shorts
 * YouTube 16:9 → bande-annonce sur la chaîne
 * Square 1:1 → fil Instagram / Facebook
 */
export const RemotionRoot: React.FC = () => (
  <>
    {FORMATS.map(({suffix, format, width, height}) => (
      <Composition
        key={`spot-${suffix}`}
        id={`Spot${suffix}`}
        component={Spot}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={width}
        height={height}
        defaultProps={{format}}
      />
    ))}
    {FORMATS.map(({suffix, format, width, height}) => (
      <Composition
        key={`outro-${suffix}`}
        id={`Outro${suffix}`}
        component={OutroCard}
        durationInFrames={OUTRO_DURATION_IN_FRAMES}
        fps={FPS}
        width={width}
        height={height}
        defaultProps={{format}}
      />
    ))}
  </>
);
