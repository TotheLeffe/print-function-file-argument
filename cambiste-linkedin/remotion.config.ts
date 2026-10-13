import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');   // aplats nets, pas d'artefacts JPEG
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setChromiumOpenGlRenderer('swangle');
Config.setEntryPoint('src/index.ts');
