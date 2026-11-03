import React from 'react';
import {C, Format} from '../config';
import {band, mix} from '../anim';

/* =========================================================================
   LA TYPOGRAPHIE
   Un seul caractere, deux graisses. Les blocs entrent d'un bloc et
   restent parfaitement immobiles : la transformation est RETIREE une fois
   la phrase posee, car un transform residuel promeut le bloc en couche
   composee que Chromium ne rasterise pas deux fois au meme sous-pixel.
   ========================================================================= */

export const SCALE: Record<Format, number> = {wide: 1, tall: 0.78};

export const Title: React.FC<{
  lines: string[];
  frame: number;
  from: number;
  to: number;
  size: number;
  format: Format;
  align?: 'left' | 'center';
  color?: string;
  weight?: number;
}> = ({lines, frame, from, to, size, format, align = 'left', color = C.white, weight = 600}) => {
  const o = band(frame, from, to, 14, 12);
  if (o <= 0.002) return null;
  const s = size * SCALE[format];
  return (
    <div
      style={{
        opacity: o,
        transform: o >= 0.999 ? undefined : `translateY(${mix(10, 0, o)}px)`,
        textAlign: align,
      }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontSize: s,
            lineHeight: 1.12,
            fontWeight: weight,
            letterSpacing: s > 60 ? '-0.022em' : '-0.012em',
            color,
            whiteSpace: 'pre',
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

/** Un libelle pose dans le decor : petit, mais jamais illisible. */
export const Label: React.FC<{
  text: string;
  frame: number;
  from: number;
  to: number;
  format: Format;
  color?: string;
  size?: number;
  rule?: 'left' | 'right' | 'none';
}> = ({text, frame, from, to, format, color = C.grey, size = 26, rule = 'none'}) => {
  const o = band(frame, from, to, 12, 10);
  if (o <= 0.002) return null;
  const s = size * SCALE[format];
  const line = band(frame, from + 4, to, 16, 10);
  return (
    <div style={{opacity: o, display: 'flex', alignItems: 'center', gap: 14}}>
      {rule === 'left' ? (
        <div style={{height: 1, width: 54 * line, background: C.blueLit, opacity: 0.6}} />
      ) : null}
      <div
        style={{
          fontSize: s,
          fontWeight: 500,
          letterSpacing: '0.012em',
          color,
          whiteSpace: 'pre',
        }}
      >
        {text}
      </div>
      {rule === 'right' ? (
        <div style={{height: 1, width: 54 * line, background: C.blueLit, opacity: 0.6}} />
      ) : null}
    </div>
  );
};
