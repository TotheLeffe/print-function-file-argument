import {loadFont} from '@remotion/fonts';
import {CORMORANT_400, CORMORANT_600, INTER_400, INTER_500, INTER_600} from './fonts.generated';

export const DISPLAY = '"Cormorant Garamond", "Liberation Serif", Georgia, serif';
export const SANS = 'Inter, "Liberation Sans", Helvetica, Arial, sans-serif';

let pending: Promise<unknown> | null = null;

/**
 * Les polices sont embarquées dans le bundle (data URI, cf.
 * scripts/build-fonts.mjs) : le rendu ne dépend ni du réseau ni du serveur de
 * fichiers statiques, et reste identique sur toutes les machines.
 *
 * Le chargement est déclenché depuis `calculateMetadata` plutôt qu'à
 * l'évaluation du module, pour que Remotion attende bien les polices avant de
 * produire la première image.
 */
export const ensureFonts = (): Promise<unknown> => {
	pending ??= Promise.all([
		loadFont({family: 'Cormorant Garamond', url: CORMORANT_400, weight: '400', format: 'woff2'}),
		loadFont({family: 'Cormorant Garamond', url: CORMORANT_600, weight: '600', format: 'woff2'}),
		loadFont({family: 'Inter', url: INTER_400, weight: '400', format: 'woff2'}),
		loadFont({family: 'Inter', url: INTER_500, weight: '500', format: 'woff2'}),
		loadFont({family: 'Inter', url: INTER_600, weight: '600', format: 'woff2'}),
	]);
	return pending;
};

export const COLORS = {
	night: '#08161F',
	navy: '#0E2A3D',
	deep: '#123C56',
	gold: '#C8A45C',
	goldLight: '#E4CB92',
	ivory: '#F6F2E9',
	white: '#FFFFFF',
} as const;

export const VIDEO = 'video/villa-bahari-drone.mp4';
