import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');   // apercu rapide ; le build final force png
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(17);
Config.setPixelFormat('yuv420p');
Config.setChromiumOpenGlRenderer('swangle');  // pas de GPU dans le conteneur
Config.setEntryPoint('src/index.ts');
