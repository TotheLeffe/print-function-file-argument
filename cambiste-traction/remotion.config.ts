import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(17);
Config.setPixelFormat('yuv420p');
// pas de GPU dans le conteneur : rendu logiciel
Config.setChromiumOpenGlRenderer('swangle');
Config.setEntryPoint('src/index.ts');
