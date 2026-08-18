import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSafePadding, useUnit} from '../layout';
import {COLORS, DISPLAY, SANS} from '../theme';

export type Stat = {value: string; label: string};

/**
 * Panneau de chiffres clés qui glisse depuis la droite, en verre dépoli sur
 * l'image. Chaque ligne arrive en cascade puis l'ensemble repart en fondu.
 */
export const StatPanel: React.FC<{heading: string; stats: Stat[]}> = ({heading, stats}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames, width, height} = useVideoConfig();
	const u = useUnit();
	const pad = useSafePadding();
	const isSquare = width === height;

	const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 32});
	const exit = interpolate(frame, [durationInFrames - 20, durationInFrames - 4], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: isSquare ? 'stretch' : 'flex-end',
				padding: pad,
			}}
		>
			<div
				style={{
					transform: `translateX(${(1 - enter) * 60 + exit * 40}px)`,
					opacity: enter * (1 - exit),
					width: isSquare ? '100%' : 640 * u,
					maxHeight: height - pad * 2,
					background: 'rgba(10, 32, 46, 0.62)',
					backdropFilter: `blur(${18 * u}px)`,
					WebkitBackdropFilter: `blur(${18 * u}px)`,
					border: `${1 * u}px solid rgba(200,164,92,0.30)`,
					borderRadius: 4 * u,
					padding: `${44 * u}px ${46 * u}px`,
					boxShadow: `0 ${28 * u}px ${80 * u}px rgba(0,0,0,0.45)`,
				}}
			>
				<div
					style={{
						fontFamily: SANS,
						fontWeight: 600,
						fontSize: 19 * u,
						letterSpacing: 0.28 * 19 * u,
						textTransform: 'uppercase',
						color: COLORS.goldLight,
					}}
				>
					{heading}
				</div>

				<div
					style={{
						height: 1 * u,
						background: 'rgba(200,164,92,0.35)',
						margin: `${28 * u}px 0 ${8 * u}px`,
					}}
				/>

				{stats.map((stat, i) => {
					const rowIn = spring({
						frame: frame - 10 - i * 5,
						fps,
						config: {damping: 200},
						durationInFrames: 26,
					});
					return (
						<div
							key={stat.label}
							style={{
								display: 'flex',
								alignItems: 'baseline',
								justifyContent: 'space-between',
								gap: 24 * u,
								padding: `${20 * u}px 0`,
								borderBottom:
									i === stats.length - 1 ? 'none' : `${1 * u}px solid rgba(246,242,233,0.10)`,
								opacity: rowIn,
								transform: `translateY(${(1 - rowIn) * 14 * u}px)`,
							}}
						>
							<span
								style={{
									fontFamily: SANS,
									fontWeight: 400,
									fontSize: 24 * u,
									color: 'rgba(246,242,233,0.80)',
								}}
							>
								{stat.label}
							</span>
							<span
								style={{
									fontFamily: DISPLAY,
									fontWeight: 600,
									fontSize: 46 * u,
									lineHeight: 1,
									color: COLORS.ivory,
									whiteSpace: 'nowrap',
								}}
							>
								{stat.value}
							</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
