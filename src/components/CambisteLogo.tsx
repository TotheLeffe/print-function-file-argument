import React from 'react';
import {COLORS, FONT} from '../theme';

// Pictogramme : carré arrondi vert avec le monogramme blanc stylisé
// (deux barres opposées formant un « Z » d'échange, clin d'œil au change de devises).
export const CambisteMark: React.FC<{size?: number}> = ({size = 96}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      style={{display: 'block'}}
    >
      <rect x="0" y="0" width="96" height="96" rx="26" fill={COLORS.green} />
      <path d="M28 30 H70 L48 50 H34 Z" fill={COLORS.white} />
      <path d="M68 66 H26 L48 46 H62 Z" fill={COLORS.white} />
    </svg>
  );
};

export const CambisteLogo: React.FC<{
  height?: number;
  color?: string;
}> = ({height = 72, color = '#0B0B0F'}) => {
  const markSize = height * 0.92;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: height * 0.28,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: height,
          letterSpacing: -height * 0.03,
          color,
          lineHeight: 1,
        }}
      >
        Cambiste
      </span>
      <CambisteMark size={markSize} />
    </div>
  );
};
