import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../theme';

// Fond premium : dégradé très doux + halos discrets bleu/vert, style fintech.
export const Background: React.FC<{plain?: boolean}> = ({plain}) => {
  if (plain) {
    return <AbsoluteFill style={{backgroundColor: COLORS.white}} />;
  }
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.bg} 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: -320,
          top: -520,
          background:
            'radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, rgba(37, 99, 235, 0) 65%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          right: -350,
          bottom: -480,
          background:
            'radial-gradient(circle, rgba(31, 191, 113, 0.07) 0%, rgba(31, 191, 113, 0) 65%)',
        }}
      />
    </AbsoluteFill>
  );
};

// Petit rappel de marque en haut à gauche des scènes 1 à 3.
export const BrandTag: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: 70,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: 0.92,
      }}
    >
      <svg width={34} height={34} viewBox="0 0 96 96">
        <rect width="96" height="96" rx="26" fill={COLORS.green} />
        <path d="M28 30 H70 L48 50 H34 Z" fill={COLORS.white} />
        <path d="M68 66 H26 L48 46 H62 Z" fill={COLORS.white} />
      </svg>
      <span
        style={{
          fontWeight: 700,
          fontSize: 28,
          color: COLORS.navy,
          letterSpacing: -0.5,
        }}
      >
        Cambiste
      </span>
    </div>
  );
};
