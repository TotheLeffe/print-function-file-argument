import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BEATS, C, DISCLOSURE, Format, QUALIFIER, SIGNAL_LABELS, WORLD_LABELS} from '../config';
import {Label, Title} from './type';
import {Dashboard} from './Dashboard';
import {Signature} from './Signature';

/* =========================================================================
   LA COUCHE 2D
   Le texte et l'interface ne sont jamais poses dans la 3D : ils vivent
   au-dessus, parfaitement nets. Chaque bloc occupe un espace negatif de
   la composition et ne recouvre jamais l'action.

   Le format vertical n'est pas un recadrage : les blocs changent de
   place et de taille.
   ========================================================================= */

type Spot = React.CSSProperties;

const L: Record<Format, Record<string, Spot>> = {
  wide: {
    beat: {left: 132, top: 118},
    hero: {left: 0, right: 0, bottom: 92, alignItems: 'center'},
    orchestration: {left: 132, top: 150},
    beatD: {left: 132, bottom: 132},
    leftLabel: {left: 132, top: 560},
    rightLabel: {right: 132, top: 404, alignItems: 'flex-end'},
    signals: {right: 132, bottom: 150, alignItems: 'flex-end'},
    visibility: {left: 112, top: 404, width: 452},
    disclosure: {left: 132, bottom: 86},
    promise: {left: 0, right: 0, top: 380, alignItems: 'center'},
  },
  tall: {
    beat: {left: 84, top: 210},
    hero: {left: 0, right: 0, bottom: 230, alignItems: 'center'},
    orchestration: {left: 84, top: 240},
    beatD: {left: 84, bottom: 320},
    leftLabel: {left: 84, top: 1210},
    rightLabel: {right: 84, top: 1040, alignItems: 'flex-end'},
    signals: {left: 84, bottom: 240},
    visibility: {left: 84, top: 212, width: 912},
    disclosure: {left: 84, bottom: 150},
    promise: {left: 0, right: 0, top: 700, alignItems: 'center'},
  },
};

const At: React.FC<{spot: Spot; children: React.ReactNode}> = ({spot, children}) => (
  <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', ...spot}}>
    {children}
  </div>
);

const beat = (id: string) => BEATS.find((b) => b.id === id)!;

export const Overlay: React.FC<{frame: number; format: Format}> = ({frame, format}) => {
  const p = L[format];
  const wide = format === 'wide';
  const b = (id: string) => beat(id);
  return (
    <AbsoluteFill>
      {/* A et B : le manque de connexion */}
      <At spot={p.beat}>
        <Title
          lines={b('borders').lines}
          frame={frame}
          from={b('borders').in}
          to={b('borders').out}
          size={60}
          format={format}
        />
        <Title
          lines={b('connect').lines}
          frame={frame}
          from={b('connect').in}
          to={b('connect').out}
          size={60}
          format={format}
        />
      </At>

      <At spot={p.leftLabel}>
        <Label
          text={WORLD_LABELS.left.text}
          frame={frame}
          from={WORLD_LABELS.left.in}
          to={WORLD_LABELS.left.out}
          format={format}
          rule="left"
        />
      </At>
      <At spot={p.rightLabel}>
        <Label
          text={WORLD_LABELS.right.text}
          frame={frame}
          from={WORLD_LABELS.right.in}
          to={WORLD_LABELS.right.out}
          format={format}
          rule={wide ? 'right' : 'left'}
        />
      </At>

      {/* C : l'intervention, puis le geste du film */}
      <At spot={p.orchestration}>
        <Title
          lines={[b('orchestration').lines[0]]}
          frame={frame}
          from={b('orchestration').in}
          to={b('orchestration').out}
          size={34}
          format={format}
          weight={600}
        />
        <div style={{height: 6}} />
        <Label
          text={b('orchestration').lines[1]}
          frame={frame}
          from={b('orchestration').in + 8}
          to={b('orchestration').out}
          format={format}
          size={24}
        />
      </At>

      <At spot={p.hero}>
        <Title
          lines={b('make').lines}
          frame={frame}
          from={b('make').in}
          to={b('make').out}
          size={84}
          format={format}
          align="center"
          weight={600}
        />
      </At>

      {/* D : une infrastructure coordonnee */}
      <At spot={p.beatD}>
        <Title
          lines={b('systems').lines}
          frame={frame}
          from={b('systems').in}
          to={b('systems').out}
          size={56}
          format={format}
        />
      </At>
      <At spot={p.signals}>
        {SIGNAL_LABELS.map((sl) => (
          <div key={sl.text} style={{marginTop: 10}}>
            <Label
              text={sl.text}
              frame={frame}
              from={sl.in}
              to={sl.out}
              format={format}
              size={25}
              color={C.white}
              rule={wide ? 'right' : 'left'}
            />
          </div>
        ))}
      </At>
      <At spot={p.disclosure}>
        <Label
          text={DISCLOSURE.text}
          frame={frame}
          from={DISCLOSURE.in}
          to={DISCLOSURE.out}
          format={format}
          size={21}
          color={C.grey}
        />
      </At>

      {/* E : l'interface */}
      <At spot={p.visibility}>
        <Title
          lines={b('visibility').lines}
          frame={frame}
          from={b('visibility').in}
          to={b('visibility').out}
          size={52}
          format={format}
        />
      </At>
      <Dashboard frame={frame} format={format} />

      {/* F : la promesse */}
      <At spot={p.promise}>
        <Title
          lines={b('serve').lines}
          frame={frame}
          from={b('serve').in}
          to={b('serve').out}
          size={60}
          format={format}
          align="center"
          color={C.grey}
          weight={500}
        />
        <div style={{height: 22}} />
        <Title
          lines={b('infra').lines}
          frame={frame}
          from={b('infra').in}
          to={b('infra').out}
          size={74}
          format={format}
          align="center"
          weight={600}
        />
        <div style={{height: 30}} />
        <Label
          text={QUALIFIER.text}
          frame={frame}
          from={QUALIFIER.in}
          to={QUALIFIER.out}
          format={format}
          size={24}
        />
      </At>

      {/* G : signature */}
      <Signature frame={frame} format={format} />
    </AbsoluteFill>
  );
};
