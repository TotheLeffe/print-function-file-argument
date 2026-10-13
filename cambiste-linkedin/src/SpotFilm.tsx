import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {ASSETS, COLORS, CUTS, GRID, SAFE_X, WIPE, textOn} from './config';
import {useOutfit} from './fonts';
import {BACKGROUNDS, SPOTS, Spot} from './spots';
import {EndCard} from './components/EndCard';
import {PhraseScreen} from './components/PhraseScreen';
import {SceneFrame} from './components/SceneFrame';
import {VISUALS} from './components/visuals';

/* -------------------------------------------------------------------------
   UN ECRAN DE TEXTE
   Le message occupe la bande haute, le schema la bande basse : les deux ne
   se chevauchent jamais, c'est la grille qui le garantit et non le hasard
   des longueurs de phrase.
   ------------------------------------------------------------------------- */
const TextScreen: React.FC<{spot: Spot; stage: number}> = ({spot, stage}) => {
  const frame = useCurrentFrame();
  const bg = BACKGROUNDS[stage];
  const Visual = VISUALS[spot.visual];

  return (
    <>
      <Visual stage={stage} frame={frame} bg={bg} labels={spot.labels} />
      <AbsoluteFill
        style={{
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingTop: GRID.textTop,
          height: GRID.textBottom,
          justifyContent: 'center',
        }}
      >
        <PhraseScreen lines={spot.screens[stage]} color={textOn(bg)} />
      </AbsoluteFill>
    </>
  );
};

/* -------------------------------------------------------------------------
   LE FILM
   Quatre sequences : 0–3 s, 3–7 s, 7–11 s, 11–15 s. Les bornes viennent de
   CUTS, derive des durees : elles ne sont jamais saisies deux fois, donc
   l'origine locale d'une sequence ne peut pas diverger du montage — c'est
   exactement la faute qui avait fige les animations d'une version
   precedente.
   ------------------------------------------------------------------------- */
export type SpotFilmProps = {spotId: string};

export const SpotFilm: React.FC<SpotFilmProps> = ({spotId}) => {
  useOutfit();
  const spot = SPOTS.find((s) => s.id === spotId);
  if (!spot) throw new Error(`spot inconnu : ${spotId}`);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        fontFamily: ASSETS.fontFamily,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {CUTS.map((cut) => (
        <Sequence
          key={cut.index}
          from={cut.start}
          // Un ecran reste a l'image pendant le volet du suivant : sans ce
          // prolongement le volet decouvrirait le vide, et la serie
          // clignoterait en blanc a chaque coupe. Les animations etant
          // bornees, ces images supplementaires sont rigoureusement
          // identiques a la derniere.
          durationInFrames={cut.frames + (cut.index < CUTS.length - 1 ? WIPE : 0)}
          layout="none"
        >
          <SceneFrame background={BACKGROUNDS[cut.index]} wipe={cut.index > 0}>
            {cut.index < 3 ? (
              <TextScreen spot={spot} stage={cut.index} />
            ) : (
              <EndCard lines={spot.closing} bg={BACKGROUNDS[3]} />
            )}
          </SceneFrame>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
