import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const WEIGHTS = ['400', '500', '600', '700', '800'] as const;

for (const weight of WEIGHTS) {
  loadFont({
    family: 'Inter',
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}
