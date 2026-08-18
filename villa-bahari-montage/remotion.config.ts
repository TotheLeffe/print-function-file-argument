import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
// 23 tient le fichier autour de 25 Mo pour 65 s. Le rush d'origine est en
// 848x480 : un CRF plus bas ne gagne rien de visible et double le poids.
Config.setCrf(23);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
