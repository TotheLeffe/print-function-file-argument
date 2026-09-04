import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Reels are watched full-screen on phones: keep the grain and the hard cuts
// from turning to mush.
Config.setCrf(17);
Config.setChromiumOpenGlRenderer('angle');
// Fonts are loaded from public/ behind a delayRender(); give a cold, busy
// machine room to finish it.
Config.setDelayRenderTimeoutInMilliseconds(120000);

// Normally Remotion downloads its own Chrome Headless Shell. On locked-down
// machines, point at an existing Chromium instead:
//   REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run build:reel
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
