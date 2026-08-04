import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
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

// Petit rappel de marque en haut à gauche des scènes 1 à 3 (logo officiel).
export const BrandTag: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: 70,
      }}
    >
      <Img
        src={staticFile('brand/cambiste-logo.png')}
        style={{height: 42, width: 'auto', mixBlendMode: 'multiply'}}
      />
    </div>
  );
};
