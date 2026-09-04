import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {Layout} from '../layout';
import {COLORS} from '../theme';

/** Intrinsic size of public/thumbnail.png. */
const SRC_W = 1536;
const SRC_H = 1024;
const SRC_ASPECT = SRC_W / SRC_H;

/**
 * The thumbnail already carries its own baked-in typography in the lower
 * two thirds. Every moving shot therefore stays inside the text-free top
 * band (y <= 0.42) and simply pans across it: visage -> drapeau -> ville.
 * The artwork is only ever shown whole in the outro, where its lettering
 * is the point.
 */
export const SHOTS = {
  machiavel: {cx: 0.145, cy: 0.2},
  drapeau: {cx: 0.45, cy: 0.2},
  // A 16:9 window is wide enough to reach back into the title lettering,
  // so the wide cut of this shot stays higher up the skyline.
  ville: {cx: 0.83, cy: 0.44, cyWide: 0.2},
} as const;

type Props = {
  layout: Layout;
  shot: {cx: number; cy: number; cyWide?: number};
  /** Crop height as a fraction of the source image, start -> end. */
  from?: number;
  to?: number;
  /** Horizontal pan across the beat, in fractions of the source width. */
  panX?: number;
  darken?: number;
  durationInFrames: number;
};

const clamp = (v: number, min: number, max: number) =>
  max < min ? (min + max) / 2 : Math.min(Math.max(v, min), max);

export const Backdrop: React.FC<Props> = ({
  layout,
  shot,
  from = 0.42,
  to = 0.36,
  panX = 0,
  darken = 0.52,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = layout;

  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // ch = visible slice of the source height; cw follows from the output
  // aspect so the vertical framing (and therefore the text-free band) is
  // identical in 9:16, 1:1 and 16:9.
  const ch = interpolate(p, [0, 1], [from, to]) * layout.cropScale;
  const cw = (ch * (width / height)) / SRC_ASPECT;

  // Keep the crop window inside the artwork.
  const cx = clamp(shot.cx + interpolate(p, [0, 1], [0, panX]), cw / 2, 1 - cw / 2);
  const isWide = width / height >= 1.4;
  const cy = clamp(
    isWide && shot.cyWide !== undefined ? shot.cyWide : shot.cy,
    ch / 2,
    1 - ch / 2,
  );

  const imgW = width / cw;
  const imgH = imgW / SRC_ASPECT;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, overflow: 'hidden'}}>
      <Img
        src={staticFile('thumbnail.png')}
        style={{
          position: 'absolute',
          width: imgW,
          height: imgH,
          left: width / 2 - cx * imgW,
          top: height / 2 - cy * imgH,
          maxWidth: 'none',
        }}
      />

      {/* Grade: crushed blacks, a red bruise top-left, cold blue bottom-right. */}
      <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity: darken}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 12% 8%, ${COLORS.red}40 0%, transparent 55%),
                       radial-gradient(120% 90% at 92% 92%, ${COLORS.blue}3D 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(115% 78% at 50% 42%, transparent 34%, rgba(0,0,0,0.9) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
