import {useVideoConfig} from 'remotion';

/**
 * Toutes les tailles sont exprimées en « u » : 1 u = 1 px sur une maquette
 * 1920x1080. Les compositions carrées ou verticales héritent donc de la même
 * hiérarchie typographique, à l'échelle près.
 */
export const useUnit = (): number => {
	const {width, height} = useVideoConfig();
	return Math.min(width, height * (16 / 9)) / 1920;
};

/** Marge de sécurité intérieure, plus généreuse sur les formats carrés. */
export const useSafePadding = (): number => {
	const {width, height} = useVideoConfig();
	const u = useUnit();
	return (width === height ? 72 : 96) * u;
};
