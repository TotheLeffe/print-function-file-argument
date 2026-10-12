import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ClosingCard} from './components/ClosingCard';
import {NetworkFormation} from './components/NetworkFormation';
import {PhraseReveal} from './components/PhraseReveal';
import {SceneFrame} from './components/SceneFrame';
import {ASSETS, COLORS, CUTS, Cut, SAFE, WIPE} from './config';
import {useOutfit} from './fonts';

/* =========================================================================
   Cambiste — 15 s

   Un message par ecran, et rien d'autre a l'image :

     0 – 3 s    Our pre-seed traction
     3 – 7 s    is becoming a structured sales pipeline.
     7 – 11 s   With world-class partners.
     11 – 15 s  logo, signature, adresse

   Priorite du brief : la lecture. Chaque phrase apparait en 0,30 s puis ne
   bouge plus ; seuls les graphismes de soutien continuent de vivre.
   ========================================================================= */

/** Bloc de texte : cale a gauche sur la marge, centre verticalement. */
const Centred: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{justifyContent: 'center', padding: `0 ${SAFE}px`, alignItems: 'flex-start'}}
  >
    {children}
  </AbsoluteFill>
);

const SceneBody: React.FC<{cut: Cut}> = ({cut}) => {
  if (cut.id === 'closing') return <ClosingCard />;

  if (cut.id === 'partners') {
    return (
      <AbsoluteFill>
        {/* le reseau se forme dans la bande basse : le texte garde un fond net */}
        <NetworkFormation
          seed={7731}
          count={22}
          box={{x0: 150, y0: 640, x1: 930, y1: 940}}
          forming={[10, 84]}
          reach={240}
        />
        <AbsoluteFill style={{padding: `286px ${SAFE}px 0 ${SAFE}px`}}>
          <PhraseReveal lines={cut.lines!} fontSize={cut.fontSize!} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <Centred>
      <PhraseReveal lines={cut.lines!} fontSize={cut.fontSize!} />
    </Centred>
  );
};

export const PipelineSpot: React.FC = () => {
  useOutfit();

  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        fontFamily: `${ASSETS.fontFamily}, sans-serif`,
        fontKerning: 'normal',
      }}
    >
      {CUTS.map((cut, i) => (
        <Sequence
          key={cut.id}
          from={cut.start}
          /* Chaque ecran deborde exactement de la duree du volet suivant :
             il reste visible DESSOUS pendant que le suivant se decouvre.
             Le dernier s'arrete net a la fin du film. */
          durationInFrames={cut.frames + (i < CUTS.length - 1 ? WIPE : 0)}
          name={`${i + 1} · ${cut.id}`}
        >
          <SceneFrame background={cut.background} direction={cut.wipe}>
            <SceneBody cut={cut} />
          </SceneFrame>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
