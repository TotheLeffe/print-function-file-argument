import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSafePadding, useUnit} from '../layout';
import {COLORS, DISPLAY, SANS} from '../theme';
import {Reveal} from './Reveal';

export type Beat = {
	/** Image de départ dans la timeline du montage. */
	from: number;
	/** Durée d'affichage, en images. */
	duration: number;
	eyebrow: string;
	title: string;
	body: string;
};

/** Synthé bas de cadre : filet doré animé, surtitre, titre et ligne de détail. */
export const LowerThird: React.FC<Omit<Beat, 'from' | 'duration'>> = ({eyebrow, title, body}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const u = useUnit();
	const pad = useSafePadding();

	const bar = spring({frame, fps, config: {damping: 200}, durationInFrames: 30});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'flex-start',
				padding: pad,
			}}
		>
			<div style={{display: 'flex', gap: 30 * u, alignItems: 'stretch'}}>
				<div
					style={{
						width: 3 * u,
						alignSelf: 'stretch',
						transform: `scaleY(${bar})`,
						transformOrigin: 'bottom',
						background: `linear-gradient(to top, ${COLORS.gold}, ${COLORS.goldLight})`,
						boxShadow: `0 0 ${24 * u}px rgba(200,164,92,0.5)`,
					}}
				/>

				<div style={{maxWidth: 1180 * u}}>
					<Reveal delay={2} exitAt={16}>
						<div
							style={{
								fontFamily: SANS,
								fontWeight: 600,
								fontSize: 19 * u,
								letterSpacing: 0.3 * 19 * u,
								textTransform: 'uppercase',
								color: COLORS.goldLight,
							}}
						>
							{eyebrow}
						</div>
					</Reveal>

					<div style={{height: 14 * u}} />

					<Reveal delay={7} exitAt={13}>
						<div
							style={{
								fontFamily: DISPLAY,
								fontWeight: 600,
								fontSize: 78 * u,
								lineHeight: 1.06,
								color: COLORS.ivory,
								textShadow: `0 ${6 * u}px ${34 * u}px rgba(0,0,0,0.6)`,
							}}
						>
							{title}
						</div>
					</Reveal>

					<div style={{height: 14 * u}} />

					<Reveal delay={13} exitAt={10}>
						<div
							style={{
								fontFamily: SANS,
								fontWeight: 400,
								fontSize: 27 * u,
								lineHeight: 1.45,
								color: 'rgba(246,242,233,0.86)',
								textShadow: `0 ${4 * u}px ${22 * u}px rgba(0,0,0,0.55)`,
							}}
						>
							{body}
						</div>
					</Reveal>
				</div>
			</div>
		</AbsoluteFill>
	);
};
