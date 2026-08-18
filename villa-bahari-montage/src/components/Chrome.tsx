import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useSafePadding, useUnit} from '../layout';
import {COLORS, SANS} from '../theme';

/** Filigrane discret en haut de cadre, présent une fois le générique passé. */
export const Watermark: React.FC<{label: string; from: number; until: number}> = ({
	label,
	from,
	until,
}) => {
	const frame = useCurrentFrame();
	const u = useUnit();
	const pad = useSafePadding();

	const opacity =
		interpolate(frame, [from, from + 20], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}) * interpolate(frame, [until - 20, until], [1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

	return (
		<AbsoluteFill style={{padding: pad, opacity, pointerEvents: 'none'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14 * u}}>
				<div
					style={{
						width: 7 * u,
						height: 7 * u,
						borderRadius: 999,
						background: COLORS.gold,
						boxShadow: `0 0 ${16 * u}px rgba(200,164,92,0.8)`,
					}}
				/>
				<div
					style={{
						fontFamily: SANS,
						fontWeight: 600,
						fontSize: 17 * u,
						letterSpacing: 0.34 * 17 * u,
						textTransform: 'uppercase',
						color: 'rgba(246,242,233,0.82)',
						textShadow: `0 ${2 * u}px ${14 * u}px rgba(0,0,0,0.6)`,
					}}
				>
					{label}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/** Mention de confidentialité, réservée à la version dossier. */
export const ConfidentialMark: React.FC<{label: string}> = ({label}) => {
	const u = useUnit();
	const pad = useSafePadding();

	return (
		<AbsoluteFill style={{padding: pad, alignItems: 'flex-end', pointerEvents: 'none'}}>
			<div
				style={{
					fontFamily: SANS,
					fontWeight: 500,
					fontSize: 15 * u,
					letterSpacing: 0.3 * 15 * u,
					textTransform: 'uppercase',
					color: 'rgba(200,164,92,0.62)',
				}}
			>
				{label}
			</div>
		</AbsoluteFill>
	);
};

/** Fine barre de progression dorée, calée sur la durée totale du montage. */
export const ProgressBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const u = useUnit();

	const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', pointerEvents: 'none'}}>
			<div style={{height: 3 * u, background: 'rgba(246,242,233,0.12)'}}>
				<div
					style={{
						width: `${progress * 100}%`,
						height: '100%',
						background: `linear-gradient(to right, ${COLORS.gold}, ${COLORS.goldLight})`,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
