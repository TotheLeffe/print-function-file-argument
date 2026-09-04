import React from 'react';
import {FONTS} from '../theme';

/** The play badge, drawn rather than imported so it stays crisp at any size. */
export const YouTubeBadge: React.FC<{size: number}> = ({size}) => (
  <svg
    width={size}
    height={(size * 20) / 28}
    viewBox="0 0 28 20"
    style={{display: 'block', filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.65))'}}
  >
    <rect width="28" height="20" rx="5" fill="#FF0000" />
    <path d="M11.2 5.6 L19.2 10 L11.2 14.4 Z" fill="#FFFFFF" />
  </svg>
);

/** Badge + wordmark, locked up the way the platform sets it. */
export const YouTubeLogo: React.FC<{size: number; color?: string}> = ({
  size,
  color = '#FFFFFF',
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.22}}>
    <YouTubeBadge size={size} />
    <span
      style={{
        fontFamily: `${FONTS.ui}, sans-serif`,
        fontWeight: 700,
        fontSize: size * 0.62,
        letterSpacing: -size * 0.02,
        color,
        lineHeight: 1,
      }}
    >
      YouTube
    </span>
  </div>
);
