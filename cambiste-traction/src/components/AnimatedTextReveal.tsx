import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EASE_OUT} from '../theme';

export type RevealLine = {
  text: string;
  /** Couleur propre a la ligne ; sinon celle du bloc. */
  color?: string;
  /** Facteur de corps applique a cette ligne seulement (1 = corps du bloc). */
  scale?: number;
  /** Filet trace sous la ligne une fois celle-ci posee.
   *  `offset` : ecart entre le bas du masque et le filet, en pixels. */
  underline?: {color: string; thickness?: number; offset?: number; after?: number};
};

type Props = {
  lines: RevealLine[];
  /** Image de depart de la premiere ligne, relative au plan. */
  delay?: number;
  /** Decalage d'une ligne a la suivante. */
  stagger?: number;
  /** Duree de montee d'une ligne. */
  duration?: number;
  fontSize: number;
  lineHeight?: number;
  color?: string;
  weight?: number;
  letterSpacing?: number;
  align?: 'left' | 'center';
};

/**
 * Revelation par masque vertical : chaque ligne monte derriere une fenetre
 * qui la decouvre, avec un decalage sur la precedente. C'est le geste de la
 * reference — un fragment de sens a la fois, jamais un bloc entier d'un coup.
 *
 * Le masque est un simple `overflow: hidden` a la hauteur exacte de la
 * ligne : rien a mesurer, donc rien qui puisse varier d'une image a l'autre.
 */
export const AnimatedTextReveal: React.FC<Props> = ({
  lines,
  delay = 0,
  stagger = 22,
  duration = 20,
  fontSize,
  lineHeight = 1.06,
  color = C.ink,
  weight = 900,
  letterSpacing = -0.03,
  align = 'left',
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      {lines.map((line, i) => {
        const start = delay + i * stagger;
        const p = interpolate(frame, [start, start + duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_OUT,
        });
        const size = fontSize * (line.scale ?? 1);
        const box = size * lineHeight;

        // le filet se trace une fois la ligne posee
        const u = line.underline;
        const uStart = start + duration + (u?.after ?? 6);
        const up = u
          ? interpolate(frame, [uStart, uStart + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: EASE_OUT,
            })
          : 0;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: align === 'center' ? 'center' : 'flex-start',
            }}
          >
            {/* Ce conteneur est inline-block : il epouse exactement la largeur
                du texte, ce qui donne au filet sa longueur sans mesure. Il vit
                HORS du masque, sinon `overflow: hidden` le rognerait. */}
            <div style={{position: 'relative', display: 'inline-block'}}>
              <div style={{height: box, overflow: 'hidden'}}>
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${(1 - p) * 100}%)`,
                    opacity: p === 0 ? 0 : 1,
                    fontSize: size,
                    lineHeight: `${box}px`,
                    fontWeight: weight,
                    letterSpacing: `${letterSpacing}em`,
                    color: line.color ?? color,
                    whiteSpace: 'pre',
                  }}
                >
                  {line.text}
                </span>
              </div>
              {u && up > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: box + (u.offset ?? 10),
                    height: u.thickness ?? 8,
                    width: `${up * 100}%`,
                    background: u.color,
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
