import React from 'react';
import {Img, staticFile} from 'remotion';

// Assets officiels extraits de l'animation de marque fournie
// (public/brand/cambiste-reveal.mp4). Le blend "multiply" rend le fond
// blanc des crops invisible sur nos fonds clairs.

export const CambisteMark: React.FC<{size?: number}> = ({size = 96}) => {
  return (
    <Img
      src={staticFile('brand/cambiste-mark.png')}
      style={{
        width: size,
        height: 'auto',
        display: 'block',
        mixBlendMode: 'multiply',
      }}
    />
  );
};

export const CambisteLogo: React.FC<{height?: number}> = ({height = 72}) => {
  return (
    <Img
      src={staticFile('brand/cambiste-logo.png')}
      style={{
        height,
        width: 'auto',
        display: 'block',
        mixBlendMode: 'multiply',
      }}
    />
  );
};
