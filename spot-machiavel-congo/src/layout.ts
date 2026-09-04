import {useVideoConfig} from 'remotion';

export type SpotFormat = 'reel' | 'youtube' | 'square';

export type Layout = {
  format: SpotFormat;
  width: number;
  height: number;
  isVertical: boolean;
  /** Design unit: 1 = the size it has on a 1080-wide reel. */
  u: (n: number) => number;
  /** Extra multiplier for display type, so 16:9 does not look timid. */
  titleScale: number;
  /** Tightens the backdrop crop on wide formats, to stay off the baked-in
   * lettering of the thumbnail. */
  cropScale: number;
  /** Safe-area inset — TikTok/Instagram chrome eats the edges. */
  padX: number;
  padTop: number;
  padBottom: number;
};

export const useLayout = (format: SpotFormat): Layout => {
  const {width, height} = useVideoConfig();
  const u = (n: number) => (n * Math.min(width, height)) / 1080;
  const isVertical = height > width;

  return {
    format,
    width,
    height,
    isVertical,
    u,
    titleScale: format === 'youtube' ? 1.18 : 1,
    cropScale: format === 'youtube' ? 0.86 : format === 'square' ? 0.93 : 1,
    padX: u(72),
    // Reels: keep the top clear of the app header and the bottom clear of
    // the caption / action rail.
    padTop: isVertical ? u(230) : u(70),
    padBottom: isVertical ? u(360) : u(70),
  };
};
