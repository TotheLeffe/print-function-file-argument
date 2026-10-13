import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, CONTENT_W, REVEAL, REVEAL_START, headlineSize} from '../config';

/** Sortie franche qui decelere : le texte se pose, il ne rebondit pas. */
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

type Props = {
  lines: string[];
  color?: string;
  align?: 'left' | 'center';
  /** Corps impose ; sinon deduit de la ligne la plus longue. */
  size?: number;
};

/**
 * La phrase ENTIERE parait en 0,30 s, puis ne bouge plus d'un pixel.
 *
 * Toutes les lignes montent ensemble : ni machine a ecrire, ni revelation
 * lettre a lettre, ni defilement — le brief les exclut, et chacun
 * repousserait le moment ou la phrase devient lisible.
 *
 * En fin de fenetre les interpolations sont bornees : la transformation vaut
 * exactement l'identite, donc le texte est rigoureusement immobile pendant
 * tout le temps de lecture.
 */
export const PhraseScreen: React.FC<Props> = ({
  lines,
  color = COLORS.ink,
  align = 'left',
  size,
}) => {
  const frame = useCurrentFrame();
  const fontSize = size ?? headlineSize(lines);

  const p = interpolate(frame, [REVEAL_START, REVEAL_START + REVEAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        width: CONTENT_W,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
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
