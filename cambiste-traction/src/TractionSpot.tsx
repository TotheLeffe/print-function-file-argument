import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {AnimatedTextReveal} from './components/AnimatedTextReveal';
import {CambisteEndCard} from './components/CambisteEndCard';
import {NetworkBackground} from './components/NetworkBackground';
import {SceneTransition} from './components/SceneTransition';
import {TransactionPulse} from './components/TransactionPulse';
import {useOutfit} from './fonts';
import {C, SAFE, WIPE, cut} from './theme';

/* =========================================================================
   « If your product has traction, you're not dead yet. »

   Progression : les produits meurent -> l'attention disparait -> les usagers
   reviennent -> l'argent circule -> la traction est un signe de vie ->
   Cambiste.

   Chaque plan est dimensionne sur le TEMPS DE LECTURE, pas sur le temps
   d'animation : sa composition est complete au moins une seconde avant la
   coupe. Les fenetres notees en commentaire donnent cette marge.
   ========================================================================= */

const M = {left: SAFE, right: SAFE};

/* -- 1. Les produits ne meurent pas d'un coup ---------------------------- */
const SceneMortality: React.FC = () => (
  <AbsoluteFill style={{padding: `212px ${M.right}px 0 ${M.left}px`}}>
    <AnimatedTextReveal
      lines={[
        {text: 'MOST PRODUCTS'},
        {text: 'DON’T DIE'},
        {text: 'ALL AT ONCE.', color: C.green},
      ]}
      delay={4}
      stagger={22}
      duration={20}
      fontSize={108}
      color={C.ink}
    />
  </AbsoluteFill>
);
// texte pose a l'image 68 sur 105 -> 1,23 s de tenue

/* -- 2. Ils meurent quand l'attention se perd ---------------------------- */
const SceneAttention: React.FC = () => {
  const frame = useCurrentFrame();
  // le reseau se defait au moment exact ou « STOP CARING. » se pose
  const connect = interpolate(frame, [70, 98], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const presence = interpolate(frame, [74, 104], [1, 0.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <NetworkBackground
        seed={2202}
        count={20}
        box={{x0: 150, y0: 190, x1: 930, y1: 890}}
        connect={connect}
        presence={presence}
        nodeColor={C.deep}
        lineColor={C.deep}
        drift={12}
        opacity={0.42}
        reach={250}
      />
      <AbsoluteFill style={{justifyContent: 'center', padding: `0 ${M.right}px`}}>
        <AnimatedTextReveal
          lines={[{text: 'THEY DIE'}, {text: 'WHEN PEOPLE'}, {text: 'STOP CARING.'}]}
          delay={16}
          stagger={20}
          duration={18}
          fontSize={112}
          color={C.ink}
          align="center"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
// texte pose a l'image 74 sur 105 -> 1,03 s de tenue, pendant que le reseau lache

/* -- 3. Mais s'ils reviennent -------------------------------------------- */
const SceneReturning: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', padding: `0 ${M.right}px`}}>
    <AnimatedTextReveal
      lines={[
        {text: 'BUT IF PEOPLE'},
        {
          text: 'KEEP COMING BACK…',
          underline: {color: C.green, thickness: 9, offset: 6, after: 6},
        },
      ]}
      delay={18}
      stagger={22}
      duration={20}
      fontSize={84}
      color={C.ink}
      align="center"
    />
  </AbsoluteFill>
);
// texte pose a l'image 60 sur 120 -> 2,0 s de tenue

/* -- 4. Et si l'argent circule ------------------------------------------- */
const SceneMovement: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{padding: `236px ${M.right}px 0 ${M.left}px`}}>
      <AnimatedTextReveal
        lines={[{text: 'IF MONEY'}, {text: 'KEEPS MOVING…'}]}
        delay={8}
        stagger={20}
        duration={18}
        fontSize={104}
        color={C.ink}
      />
    </AbsoluteFill>
    <TransactionPulse
      from={{x: 212, y: 772, label: 'AFRICA'}}
      to={{x: 858, y: 772, label: 'GLOBAL BANKING'}}
      nodes={[4, 24]}
      rail={[10, 40]}
      travel={[46, 96]}
    />
  </AbsoluteFill>
);
// texte pose a l'image 46 sur 105 ; la carte finit sa course a 96

/* -- 5. Vous n'etes pas mort ---------------------------------------------- */
const SceneAlive: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', padding: `0 ${M.right}px`}}>
    <AnimatedTextReveal
      lines={[
        {text: 'YOU’RE', color: C.mint, scale: 0.62},
        {
          text: 'NOT DEAD YET.',
          color: C.white,
          underline: {color: C.green, thickness: 6, offset: 22, after: 10},
        },
      ]}
      delay={16}
      stagger={24}
      duration={20}
      fontSize={106}
      align="center"
    />
  </AbsoluteFill>
);
// texte pose a l'image 60 sur 105 -> 1,5 s de tenue ; le filet suit a 70

/* =========================================================================
   Montage
   ========================================================================= */
export const TractionSpot: React.FC = () => {
  useOutfit();

  const s1 = cut('mortality');
  const s2 = cut('attention');
  const s3 = cut('returning');
  const s4 = cut('movement');
  const s5 = cut('alive');
  const s6 = cut('signature');

  /* Les plans 3 et 4 partagent un meme fond ET un meme reseau : le brief
     demande que le reseau « devienne plus dense », pas qu'il reparaisse.
     Ils vivent donc dans une seule sequence, sans coupe entre eux, et la
     densite progresse d'un bout a l'autre. */
  const bridgeFrames = s3.frames + s4.frames;

  return (
    <AbsoluteFill
      style={{
        background: C.offWhite,
        fontFamily: 'Outfit, sans-serif',
        fontKerning: 'normal',
      }}
    >
      <Sequence from={s1.start} durationInFrames={s1.frames + WIPE} name="1 · mortality">
        <SceneTransition direction="none" frames={0} background={C.offWhite}>
          <SceneMortality />
        </SceneTransition>
      </Sequence>

      <Sequence from={s2.start} durationInFrames={s2.frames + WIPE} name="2 · attention">
        <SceneTransition direction="fromBottom" frames={WIPE} background={C.green}>
          <SceneAttention />
        </SceneTransition>
      </Sequence>

      <Sequence
        from={s3.start}
        durationInFrames={bridgeFrames + WIPE}
        name="3+4 · le reseau se retisse"
      >
        <SceneTransition direction="fromTop" frames={WIPE} background={C.offWhite}>
          <BridgeNetwork span={bridgeFrames} />
          <Sequence from={0} durationInFrames={s3.frames} name="3 · returning">
            <SceneReturning />
          </Sequence>
          <Sequence
            from={s3.frames}
            durationInFrames={s4.frames + WIPE}
            name="4 · movement"
          >
            <SceneMovement />
          </Sequence>
        </SceneTransition>
      </Sequence>

      <Sequence from={s5.start} durationInFrames={s5.frames + WIPE} name="5 · alive">
        <SceneTransition direction="fromBottom" frames={WIPE} background={C.deep}>
          <SceneAlive />
        </SceneTransition>
      </Sequence>

      <Sequence from={s6.start} durationInFrames={s6.frames} name="6 · signature">
        <SceneTransition direction="fromTop" frames={WIPE} background={C.offWhite}>
          <CambisteEndCard />
        </SceneTransition>
      </Sequence>
    </AbsoluteFill>
  );
};

/** Le reseau qui se retisse, puis se densifie, sur toute la duree 3 + 4. */
const BridgeNetwork: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const connect = interpolate(frame, [10, span * 0.72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const presence = interpolate(frame, [0, 70], [0.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <NetworkBackground
      seed={3304}
      count={30}
      box={{x0: 130, y0: 180, x1: 950, y1: 930}}
      connect={connect}
      presence={presence}
      nodeColor={C.green}
      lineColor={C.mint}
      drift={13}
      opacity={0.62}
      reach={235}
    />
  );
};
