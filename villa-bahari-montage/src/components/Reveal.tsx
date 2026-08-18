import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Révélation d'une ligne de texte : le contenu remonte derrière un masque,
 * comme un volet de générique. `delay` permet de cascader les lignes.
 */
export const Reveal: React.FC<{
	delay?: number;
	children: React.ReactNode;
	/** Images avant la fin du plan où la ligne repart. 0 = pas de sortie. */
	exitAt?: number;
}> = ({delay = 0, children, exitAt = 0}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const enter = spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, mass: 0.7},
		durationInFrames: 26,
	});

	const exit = exitAt
		? interpolate(frame, [durationInFrames - exitAt, durationInFrames - exitAt + 12], [0, 1], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
			<div
				style={{
					transform: `translateY(${(1 - enter) * 105 - exit * 105}%)`,
					opacity: 1 - exit * 0.4,
				}}
			>
				{children}
			</div>
		</div>
	);
};
