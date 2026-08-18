import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSafePadding, useUnit} from '../layout';
import {COLORS, DISPLAY, SANS} from '../theme';
import {Reveal} from './Reveal';

export type TitleCardContent = {
	eyebrow: string;
	title: string;
	subtitle: string;
	badge?: string;
};

/**
 * Carton d'ouverture posé sur le rush : un voile sombre couvre l'image puis se
 * lève progressivement pour laisser apparaître le survol du site.
 */
export const TitleCard: React.FC<TitleCardContent> = ({eyebrow, title, subtitle, badge}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const u = useUnit();
	const pad = useSafePadding();

	// Le voile part de quasi opaque et se lève sur toute la durée du carton.
	const scrim = interpolate(frame, [0, 18, durationInFrames], [0.94, 0.78, 0.16], {
		extrapolateRight: 'clamp',
	});

	const rule = spring({frame: frame - 8, fps, config: {damping: 200}, durationInFrames: 34});

	const tracking = interpolate(frame, [0, 60], [0.34, 0.14], {extrapolateRight: 'clamp'});

	const exit = interpolate(frame, [durationInFrames - 22, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `linear-gradient(160deg, ${COLORS.night} 0%, ${COLORS.navy} 55%, ${COLORS.deep} 100%)`,
					opacity: scrim,
				}}
			/>

			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					padding: pad,
					textAlign: 'center',
					opacity: exit,
				}}
			>
				<Reveal delay={4}>
					<div
						style={{
							fontFamily: SANS,
							fontWeight: 500,
							fontSize: 22 * u,
							letterSpacing: 0.42 * 22 * u,
							textTransform: 'uppercase',
							color: COLORS.goldLight,
							paddingLeft: 0.42 * 22 * u,
						}}
					>
						{eyebrow}
					</div>
				</Reveal>

				<div
					style={{
						width: 260 * u * rule,
						height: 1.5 * u,
						background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
						margin: `${44 * u}px 0 ${40 * u}px`,
					}}
				/>

				<Reveal delay={12}>
					<h1
						style={{
							fontFamily: DISPLAY,
							fontWeight: 600,
							fontSize: 132 * u,
							lineHeight: 1.02,
							margin: 0,
							color: COLORS.ivory,
							letterSpacing: tracking * 132 * u * 0.4,
							paddingLeft: tracking * 132 * u * 0.4,
							textShadow: `0 ${8 * u}px ${44 * u}px rgba(0,0,0,0.55)`,
						}}
					>
						{title}
					</h1>
				</Reveal>

				<div style={{height: 34 * u}} />

				<Reveal delay={22}>
					<p
						style={{
							fontFamily: SANS,
							fontWeight: 400,
							fontSize: 30 * u,
							lineHeight: 1.5,
							margin: 0,
							maxWidth: 1080 * u,
							color: 'rgba(246,242,233,0.88)',
						}}
					>
						{subtitle}
					</p>
				</Reveal>

				{badge ? (
					<div style={{marginTop: 46 * u, opacity: interpolate(frame, [34, 52], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					})}}>
						<span
							style={{
								fontFamily: SANS,
								fontWeight: 500,
								fontSize: 17 * u,
								letterSpacing: 0.22 * 17 * u,
								textTransform: 'uppercase',
								color: COLORS.goldLight,
								border: `${1 * u}px solid rgba(200,164,92,0.55)`,
								borderRadius: 999,
								padding: `${12 * u}px ${28 * u}px`,
								whiteSpace: 'nowrap',
							}}
						>
							{badge}
						</span>
					</div>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
