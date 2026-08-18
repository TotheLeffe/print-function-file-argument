import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSafePadding, useUnit} from '../layout';
import {COLORS, DISPLAY, SANS} from '../theme';
import {Reveal} from './Reveal';

export type OutroContent = {
	title: string;
	tagline: string;
	location: string;
	contactName: string;
	contactRole: string;
	contactLines: string[];
	footnote?: string;
};

/** Carton de fin : le rush s'efface derrière un dégradé nuit et la signature. */
export const OutroCard: React.FC<OutroContent> = ({
	title,
	tagline,
	location,
	contactName,
	contactRole,
	contactLines,
	footnote,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const u = useUnit();
	const pad = useSafePadding();

	const veil = interpolate(frame, [0, 62], [0, 1], {extrapolateRight: 'clamp'});
	const rule = spring({frame: frame - 30, fps, config: {damping: 200}, durationInFrames: 40});
	const contact = interpolate(frame, [56, 84], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const fadeOut = interpolate(frame, [durationInFrames - 26, durationInFrames - 2], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `linear-gradient(165deg, ${COLORS.night} 0%, ${COLORS.navy} 60%, ${COLORS.deep} 100%)`,
					opacity: veil,
				}}
			/>

			<AbsoluteFill
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					padding: pad,
					opacity: fadeOut,
				}}
			>
				<Reveal delay={22}>
					<h2
						style={{
							fontFamily: DISPLAY,
							fontWeight: 600,
							fontSize: 104 * u,
							lineHeight: 1.04,
							margin: 0,
							color: COLORS.ivory,
							letterSpacing: 0.05 * 104 * u,
							paddingLeft: 0.05 * 104 * u,
						}}
					>
						{title}
					</h2>
				</Reveal>

				<div
					style={{
						width: 320 * u * rule,
						height: 1.5 * u,
						background: `linear-gradient(to right, transparent, ${COLORS.gold}, transparent)`,
						margin: `${32 * u}px 0`,
					}}
				/>

				<Reveal delay={34}>
					<p
						style={{
							fontFamily: DISPLAY,
							fontWeight: 400,
							fontStyle: 'italic',
							fontSize: 42 * u,
							lineHeight: 1.35,
							margin: 0,
							maxWidth: 1200 * u,
							color: 'rgba(246,242,233,0.92)',
						}}
					>
						{tagline}
					</p>
				</Reveal>

				<Reveal delay={44}>
					<div
						style={{
							marginTop: 26 * u,
							fontFamily: SANS,
							fontWeight: 500,
							fontSize: 20 * u,
							letterSpacing: 0.3 * 20 * u,
							textTransform: 'uppercase',
							color: COLORS.goldLight,
						}}
					>
						{location}
					</div>
				</Reveal>

				<div
					style={{
						marginTop: 62 * u,
						opacity: contact,
						transform: `translateY(${(1 - contact) * 18 * u}px)`,
						fontFamily: SANS,
						color: 'rgba(246,242,233,0.86)',
					}}
				>
					<div style={{fontSize: 26 * u, fontWeight: 600, color: COLORS.ivory}}>
						{contactName}
					</div>
					<div style={{fontSize: 21 * u, marginTop: 6 * u, color: 'rgba(246,242,233,0.72)'}}>
						{contactRole}
					</div>
					<div style={{fontSize: 23 * u, marginTop: 16 * u, lineHeight: 1.6}}>
						{contactLines.map((line) => (
							<div key={line}>{line}</div>
						))}
					</div>
				</div>

				{footnote ? (
					<div
						style={{
							marginTop: 54 * u,
							opacity: contact * 0.75,
							fontFamily: SANS,
							fontSize: 16 * u,
							letterSpacing: 0.18 * 16 * u,
							textTransform: 'uppercase',
							color: 'rgba(200,164,92,0.85)',
						}}
					>
						{footnote}
					</div>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
