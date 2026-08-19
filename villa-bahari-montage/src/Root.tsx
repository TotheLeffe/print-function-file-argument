import React from 'react';
import {Composition} from 'remotion';
import {publicScriptEn, radissonScriptEn} from './script.en';
import {publicScriptFr, radissonScriptFr} from './script.fr';
import {ensureFonts} from './theme';
import {TOTAL_FRAMES, type MontageScript} from './timeline';
import {VillaBahariMontage} from './VillaBahariMontage';

type Variant = {
	id: string;
	script: MontageScript;
	width: number;
	height: number;
};

/**
 * Six montages pour deux langues : le format 16/9 pour la diffusion et la
 * présentation, le carré pour le fil mobile. Le minutage est commun (cf.
 * timeline.ts), seuls les textes changent.
 */
const VARIANTS: Variant[] = [
	// Français
	{id: 'VillaBahariLinkedIn', script: publicScriptFr, width: 1920, height: 1080},
	{id: 'VillaBahariRadisson', script: radissonScriptFr, width: 1920, height: 1080},
	{id: 'VillaBahariCarre', script: publicScriptFr, width: 1080, height: 1080},
	// English
	{id: 'VillaBahariLinkedInEN', script: publicScriptEn, width: 1920, height: 1080},
	{id: 'VillaBahariRadissonEN', script: radissonScriptEn, width: 1920, height: 1080},
	{id: 'VillaBahariSquareEN', script: publicScriptEn, width: 1080, height: 1080},
];

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{VARIANTS.map((variant) => (
				<Composition
					key={variant.id}
					id={variant.id}
					component={VillaBahariMontage}
					durationInFrames={TOTAL_FRAMES}
					fps={30}
					width={variant.width}
					height={variant.height}
					defaultProps={{script: variant.script}}
					calculateMetadata={async () => {
						await ensureFonts();
						return {};
					}}
				/>
			))}
		</>
	);
};
