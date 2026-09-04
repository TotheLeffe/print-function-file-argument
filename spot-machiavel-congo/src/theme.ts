import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Palette lifted from the video thumbnail: weathered DRC flag over a
 * charcoal Kinshasa skyline.
 */
export const COLORS = {
  ink: '#0A0A0C',
  inkSoft: '#141418',
  bone: '#F3EFE7',
  yellow: '#F5C518',
  red: '#C4122F',
  blue: '#12639F',
  ash: '#9A948A',
} as const;

export const FONTS = {
  display: 'Anton',
  ui: 'Oswald',
} as const;

const handle = delayRender('Chargement des polices du spot');

Promise.all([
  loadFont({
    family: FONTS.display,
    url: staticFile('fonts/Anton-400.woff2'),
    weight: '400',
    format: 'woff2',
  }),
  loadFont({
    family: FONTS.ui,
    url: staticFile('fonts/Oswald-500.woff2'),
    weight: '500',
    format: 'woff2',
  }),
  loadFont({
    family: FONTS.ui,
    url: staticFile('fonts/Oswald-700.woff2'),
    weight: '700',
    format: 'woff2',
  }),
])
  .then(() => continueRender(handle))
  .catch((err) => {
    // Never hard-fail a render over a font: fall back to the system stack.
    console.warn('Polices indisponibles, fallback système', err);
    continueRender(handle);
  });
