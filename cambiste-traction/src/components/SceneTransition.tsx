import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EASE_INOUT} from '../theme';

export type WipeDirection = 'fromBottom' | 'fromTop' | 'fromLeft' | 'fromRight' | 'none';

type Props = {
  direction: WipeDirection;
  /** Duree du volet, en images. */
  frames: number;
  background: string;
  children: React.ReactNode;
};

/**
 * Volet d'entree d'un plan : le plan entrant se decouvre derriere un bord
 * qui glisse, pendant que le plan sortant reste visible dessous.
 *
 * Le volet se deroule AU DEBUT du plan qu'il revele : l'allonger ne rallonge
 * donc pas le film. En contrepartie chaque plan retarde son entree pour ne
 * pas naitre sous le volet.
 *
 * Le contenu accompagne le bord de quelques pixels — c'est ce leger
 * entrainement qui donne le glissement controle de la reference, la ou un
 * masque seul aurait l'air d'un rideau.
 */
export const SceneTransition: React.FC<Props> = ({
  direction,
  frames,
  background,
  children,
}) => {
  const frame = useCurrentFrame();

  const p =
    direction === 'none' || frames <= 0
      ? 1
      : interpolate(frame, [0, frames], [0, 1], {
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
          : direction === 'fromRight'
            ? `inset(0 0 0 ${hidden}%)`
            : 'none';

  const slide = 26 * (1 - p);
  const drag =
    direction === 'fromBottom'
      ? `translateY(${slide}px)`
      : direction === 'fromTop'
        ? `translateY(${-slide}px)`
        : direction === 'fromLeft'
          ? `translateX(${slide}px)`
          : direction === 'fromRight'
            ? `translateX(${-slide}px)`
            : 'none';

  return (
    <AbsoluteFill style={{clipPath: clip}}>
      <AbsoluteFill style={{background}} />
      <AbsoluteFill style={{transform: drag}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
