import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {
  ASSETS,
  COLORS,
  ColorKey,
  CONTENT_W,
  READABLE_FROM,
  REVEAL,
  REVEAL_START,
  headlineSize,
  textOn,
} from '../config';
import {CambisteLockup} from './CambisteLogo';

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/* Hauteurs du carton de fin. Le logotype reste tres en deca de sa taille
   native (85 px de hauteur de capitale) : il n'est jamais agrandi. */
const LOGO_H = 76;
const URL_SIZE = 40;

type Props = {
  /** Message final. Vide = carton reduit au logo et a l'adresse. */
  lines: string[];
  bg: ColorKey;
};

/**
 * Quatrieme sequence : message final, logo Cambiste, cambiste.app. Rien
 * d'autre a l'image — aucun petit texte en parallele, le brief l'exclut.
 *
 * Tout est pose a l'image 14 (READABLE_FROM), comme sur les trois ecrans de
 * texte : les 106 images restantes sont du temps de lecture pur, 3,53 s.
 *
 * Le logotype officiel est noir sur transparent ; le carton de fin de la
 * serie est blanc, donc il s'affiche tel quel, jamais recolore.
 */
export const EndCard: React.FC<Props> = ({lines, bg}) => {
  const frame = useCurrentFrame();
  const color = textOn(bg);

  const msg = interpolate(frame, [REVEAL_START, REVEAL_START + REVEAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const logo = interpolate(frame, [2, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });
  const url = interpolate(frame, [6, READABLE_FROM], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT,
  });

  const size = Math.min(96, headlineSize(lines));

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {lines.length > 0 ? (
        <div
          style={{
            width: CONTENT_W,
            marginBottom: 96,
            opacity: msg,
            transform: `translateY(${(1 - msg) * 16}px)`,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: size,
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: '-0.025em',
                textAlign: 'center',
                color,
                whiteSpace: 'pre',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      ) : null}

      <div style={{opacity: logo, transform: `translateY(${(1 - logo) * 12}px)`}}>
        <CambisteLockup height={LOGO_H} />
      </div>

      <div
        style={{
          marginTop: 34,
          fontSize: URL_SIZE,
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: COLORS.green,
          opacity: url,
        }}
      >
        {ASSETS.website}
      </div>
    </AbsoluteFill>
  );
};
