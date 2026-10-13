import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, ColorKey, WIPE} from '../config';

const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

type Props = {
  background: ColorKey;
  /** Le premier ecran n'a pas de volet. */
  wipe: boolean;
  children: React.ReactNode;
};

/**
 * Volet d'entree d'un ecran : 0,30 s, un bord qui monte et recouvre l'ecran
 * sortant. Un fondu enchaine ferait cohabiter deux messages a l'image, ce
 * que le brief interdit.
 *
 * Le volet s'acheve a l'image 9 et la phrase est complete a la 14e : l'ecran
 * est entierement decouvert avant que la lecture commence, donc le temps de
 * lecture n'est jamais ampute par la transition.
 */
export const SceneFrame: React.FC<Props> = ({background, wipe, children}) => {
  const frame = useCurrentFrame();
  const p = wipe
    ? interpolate(frame, [0, WIPE], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE_INOUT,
      })
    : 1;

  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - p) * 100}% 0 0 0)`}}>
      <AbsoluteFill style={{background: COLORS[background]}} />
      <AbsoluteFill style={{transform: `translateY(${22 * (1 - p)}px)`}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
