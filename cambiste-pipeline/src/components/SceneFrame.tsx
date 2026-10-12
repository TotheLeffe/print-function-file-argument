import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, WIPE, WipeDirection} from '../config';

/** Accompagnement doux : le pic de vitesse ne depasse pas 1,5 x la moyenne. */
const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

type Props = {
  background: keyof typeof COLORS;
  direction: WipeDirection;
  children: React.ReactNode;
};

/**
 * Enveloppe d'un ecran : son fond et son volet d'entree.
 *
 * Le volet se deroule au debut de l'ecran qu'il revele et RECOUVRE l'ecran
 * sortant. C'est volontaire : un fondu enchaine ferait cohabiter deux
 * messages a l'image, ce que le brief interdit (un message par ecran).
 *
 * Le volet dure 10 images et la phrase est complete a la 13e : l'ecran est
 * donc entierement decouvert avant que la lecture commence. Le temps de
 * lecture n'est jamais ampute par la transition.
 */
export const SceneFrame: React.FC<Props> = ({background, direction, children}) => {
  const frame = useCurrentFrame();

  const p =
    direction === 'none'
      ? 1
      : interpolate(frame, [0, WIPE], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_INOUT,
        });

  const hidden = (1 - p) * 100;
  const clip =
    direction === 'fromBottom'
      ? `inset(${hidden}% 0 0 0)`
      : direction === 'fromTop'
        ? `inset(0 0 ${hidden}% 0)`
        : direction === 'fromLeft'
          ? `inset(0 ${hidden}% 0 0)`
          : 'none';

  // le contenu accompagne le bord de quelques pixels : glissement, pas rideau
  const drag = 22 * (1 - p);
  const slide =
    direction === 'fromBottom'
      ? `translateY(${drag}px)`
      : direction === 'fromTop'
        ? `translateY(${-drag}px)`
        : direction === 'fromLeft'
          ? `translateX(${drag}px)`
          : 'none';

  return (
    <AbsoluteFill style={{clipPath: clip}}>
      <AbsoluteFill style={{background: COLORS[background]}} />
      <AbsoluteFill style={{transform: slide}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
