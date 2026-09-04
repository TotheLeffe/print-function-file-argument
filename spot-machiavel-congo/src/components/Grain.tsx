import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

const TILE = 220;

/**
 * One turbulence tile, rasterised once by the browser and then tiled and
 * offset every frame. Re-running feTurbulence full-frame on every frame is
 * ruinously slow at 1080x1920 — this looks the same and costs nothing.
 */
const useNoiseTile = () =>
  useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="${TILE}" height="${TILE}" filter="url(#n)"/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, []);

/**
 * Full-frame texture pass: crawling film grain plus faint scanlines. Sits
 * above everything so cuts and type share the same skin.
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.16}) => {
  const frame = useCurrentFrame();
  const tile = useNoiseTile();

  // Jump the tile around each frame so the grain crawls instead of freezing.
  const x = Math.floor(random(`grain-x-${frame}`) * TILE);
  const y = Math.floor(random(`grain-y-${frame}`) * TILE);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          backgroundImage: tile,
          backgroundRepeat: 'repeat',
          backgroundPosition: `${x}px ${y}px`,
          opacity,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 4px)',
          opacity: 0.35,
          mixBlendMode: 'multiply',
        }}
      />
    </AbsoluteFill>
  );
};
