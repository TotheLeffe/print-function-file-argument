import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, CONTENT_W, REVEAL, REVEAL_START} from '../config';

/** Sortie franche qui decelere longuement : le texte se pose, il ne rebondit pas. */
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

type Props = {
  lines: string[];
  fontSize: number;
  color?: string;
  /** Image de depart, relative au plan. */
  start?: number;
  align?: 'left' | 'center';
};

/**
 * La phrase ENTIERE apparait en 0,30 s, puis ne bouge plus d'un pixel.
 *
 * Toutes les lignes montent ensemble : il n'y a ni decalage ligne a ligne,
 * ni revelation lettre a lettre, ni defilement — le brief les exclut, et
 * chacun repousserait le moment ou la phrase devient lisible.
 *
 * Le geste est un fondu avec une montee de 14 px et un soupcon d'echelle.
 * A la fin de la fenetre, les interpolations sont bornees : la transformation
 * vaut exactement l'identite, donc le texte est rigoureusement stable pendant
 * tout le temps de lecture.
 */
export const PhraseReveal: React.FC<Props> = ({
  lines,
  fontSize,
  color = COLORS.ink,
  start = REVEAL_START,
  align = 'left',
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [start, start + REVEAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        width: CONTENT_W,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px) scale(${0.99 + 0.01 * p})`,
        transformOrigin: align === 'center' ? 'center bottom' : 'left bottom',
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize,
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color,
            textAlign: align,
            whiteSpace: 'pre',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
