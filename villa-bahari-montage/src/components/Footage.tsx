import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, VIDEO} from '../theme';

/**
 * Le rush drone est en 848x480 : on l'affiche en `cover` avec un très léger
 * push-in et un étalonnage doux (contraste / saturation / chaleur) pour éviter
 * l'aspect « fichier source brut » une fois agrandi en 1080p.
 */
export const Footage: React.FC<{
	/** Durée totale du plan, utilisée pour cadencer le push-in. */
	durationInFrames: number;
	/** Image à laquelle le fondu de sortie commence. */
	fadeFrom?: number;
}> = ({durationInFrames, fadeFrom}) => {
	const frame = useCurrentFrame();

	const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.12], {
		extrapolateRight: 'clamp',
	});

	// Le fondu se termine exactement sur la dernière image du rush : le carton
	// de fin a fini de recouvrir l'image avant que la vidéo ne s'arrête.
	const opacity =
		fadeFrom === undefined
			? 1
			: interpolate(frame, [fadeFrom, durationInFrames - 1], [1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night}}>
			<AbsoluteFill style={{opacity}}>
				<OffthreadVideo
					src={staticFile(VIDEO)}
					muted
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${scale})`,
						filter: 'contrast(1.08) saturate(1.14) brightness(1.02)',
					}}
				/>
			</AbsoluteFill>

			{/* Étalonnage : voile chaud + vignettage + amorces de dégradé haut / bas */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(120% 90% at 50% 45%, rgba(255,196,120,0.10) 0%, rgba(8,22,31,0) 55%)',
					mixBlendMode: 'screen',
					opacity: 0.8,
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(78% 68% at 50% 48%, rgba(0,0,0,0) 40%, rgba(4,12,18,0.55) 100%)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: `linear-gradient(to bottom, rgba(8,22,31,0.55) 0%, rgba(8,22,31,0) 22%, rgba(8,22,31,0) 52%, rgba(8,22,31,0.78) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
