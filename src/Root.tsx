import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {CambisteAd} from './CambisteAd';
import {CambisteGlobalAd} from './CambisteGlobalAd';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CambisteLinkedIn"
        component={CambisteAd}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CambisteGlobal"
        component={CambisteGlobalAd}
        durationInFrames={1200}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
