import React from 'react';
import {Composition} from 'remotion';
import {publicScript, radissonScript, TOTAL_FRAMES} from './script';
import {ensureFonts} from './theme';
import {VillaBahariMontage} from './VillaBahariMontage';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Version publique — LinkedIn, site, prospection */}
			<Composition
				id="VillaBahariLinkedIn"
				component={VillaBahariMontage}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{script: publicScript}}
				calculateMetadata={async () => {
					await ensureFonts();
					return {};
				}}
			/>

			{/* Version dossier — échanges avec Radisson Hotel Group */}
			<Composition
				id="VillaBahariRadisson"
				component={VillaBahariMontage}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{script: radissonScript}}
				calculateMetadata={async () => {
					await ensureFonts();
					return {};
				}}
			/>

			{/* Version carrée — fil d'actualité LinkedIn sur mobile */}
			<Composition
				id="VillaBahariCarre"
				component={VillaBahariMontage}
				durationInFrames={TOTAL_FRAMES}
				fps={30}
				width={1080}
				height={1080}
				defaultProps={{script: publicScript}}
				calculateMetadata={async () => {
					await ensureFonts();
					return {};
				}}
			/>
		</>
	);
};
