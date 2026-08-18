import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {ConfidentialMark, ProgressBar, Watermark} from './components/Chrome';
import {Footage} from './components/Footage';
import {Grain} from './components/Grain';
import {LowerThird} from './components/LowerThird';
import {OutroCard} from './components/OutroCard';
import {StatPanel} from './components/StatPanel';
import {TitleCard} from './components/TitleCard';
import {FOOTAGE_END, OUTRO_FROM, TOTAL_FRAMES, type MontageScript} from './script';
import {COLORS} from './theme';

/**
 * Le montage garde le survol drone en continu comme colonne vertébrale : les
 * cartons et synthés viennent s'y poser, plutôt que de couper le plan. Seul le
 * carton de fin recouvre l'image, en fondu.
 */
export const VillaBahariMontage: React.FC<{script: MontageScript}> = ({script}) => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<Sequence durationInFrames={FOOTAGE_END} name="Rush drone">
				<Footage durationInFrames={FOOTAGE_END} fadeFrom={OUTRO_FROM + 20} />
			</Sequence>

			<Sequence durationInFrames={script.titleDuration} name="Carton titre">
				<TitleCard {...script.title} />
			</Sequence>

			<Watermark
				label={script.watermark}
				from={script.titleDuration + 10}
				until={OUTRO_FROM}
			/>

			{script.beats.map((beat) => (
				<Sequence
					key={beat.from}
					from={beat.from}
					durationInFrames={beat.duration}
					name={`Synthé — ${beat.title}`}
				>
					<LowerThird eyebrow={beat.eyebrow} title={beat.title} body={beat.body} />
				</Sequence>
			))}

			<Sequence
				from={script.panel.from}
				durationInFrames={script.panel.duration}
				name="Chiffres clés"
			>
				<StatPanel heading={script.panel.heading} stats={script.panel.stats} />
			</Sequence>

			<Sequence
				from={script.outro.from}
				durationInFrames={script.outro.duration}
				name="Carton de fin"
			>
				<OutroCard {...script.outro} />
			</Sequence>

			{script.confidentialMark ? (
				<Sequence
					from={script.titleDuration + 10}
					durationInFrames={OUTRO_FROM - script.titleDuration - 10}
					name="Mention"
				>
					<ConfidentialMark label={script.confidentialMark} />
				</Sequence>
			) : null}

			{script.music ? (
				<Audio
					src={staticFile(script.music.file)}
					volume={(f) =>
						interpolate(
							f,
							[0, 45, TOTAL_FRAMES - 110, TOTAL_FRAMES - 10],
							[0, script.music?.volume ?? 0.55, script.music?.volume ?? 0.55, 0],
							{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
						)
					}
				/>
			) : null}

			<Grain />
			<ProgressBar />
		</AbsoluteFill>
	);
};
