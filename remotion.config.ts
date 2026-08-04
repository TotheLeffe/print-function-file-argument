import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Le Chromium fourni n'a plus l'ancien mode headless : utiliser le nouveau.
Config.setChromeMode('chrome-for-testing');
// Marge confortable pour le chargement des polices locales pendant le rendu.
Config.setTimeoutInMilliseconds(120000);

if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
