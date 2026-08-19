import type {Beat} from './components/LowerThird';
import type {OutroContent} from './components/OutroCard';
import type {Stat} from './components/StatPanel';
import type {TitleCardContent} from './components/TitleCard';

export type MontageScript = {
	watermark: string;
	/**
	 * Habillage sonore optionnel. Déposer le fichier dans `public/audio/` puis
	 * renseigner `{file: 'audio/mon-morceau.mp3'}` : le montage gère les fondus
	 * d'entrée et de sortie. Aucun morceau n'est fourni ici — le rush drone est
	 * muet par défaut, ce qui convient à la lecture sans son de LinkedIn.
	 */
	music?: {file: string; volume?: number};
	confidentialMark?: string;
	title: TitleCardContent;
	titleDuration: number;
	beats: Beat[];
	panel: {from: number; duration: number; heading: string; stats: Stat[]};
	outro: OutroContent & {from: number; duration: number};
};

/** Rush drone : 1800 images (60 s à 30 fps). Le carton de fin déborde ensuite. */
export const FOOTAGE_END = 1800;
export const OUTRO_FROM = 1700;
export const TOTAL_FRAMES = 1940; // 64,7 s

/**
 * Le minutage est commun à toutes les versions : il est calé sur les mouvements
 * du drone, pas sur la langue. Seuls les textes changent d'un script à l'autre,
 * ce qui garantit que les versions restent synchrones image par image.
 */
const TITLE_DURATION = 160;

const SLOTS: ReadonlyArray<{from: number; duration: number}> = [
	{from: 200, duration: 200},
	{from: 470, duration: 200},
	{from: 750, duration: 200},
	{from: 1330, duration: 200},
	{from: 1545, duration: 150},
];

const PANEL_SLOT = {from: 1020, duration: 270};

/** Texte d'un synthé, sans son minutage. */
export type BeatCopy = Omit<Beat, 'from' | 'duration'>;

export type ScriptCopy = {
	watermark: string;
	confidentialMark?: string;
	title: TitleCardContent;
	beats: BeatCopy[];
	panel: {heading: string; stats: Stat[]};
	outro: OutroContent;
};

/** Assemble un script complet en posant les textes sur le minutage commun. */
export const composeScript = (copy: ScriptCopy): MontageScript => {
	if (copy.beats.length !== SLOTS.length) {
		throw new Error(
			`Le montage attend ${SLOTS.length} synthés, ${copy.beats.length} ont été fournis.`,
		);
	}

	return {
		watermark: copy.watermark,
		confidentialMark: copy.confidentialMark,
		title: copy.title,
		titleDuration: TITLE_DURATION,
		beats: copy.beats.map((beat, i) => ({...beat, ...SLOTS[i]})),
		panel: {...PANEL_SLOT, ...copy.panel},
		outro: {...copy.outro, from: OUTRO_FROM, duration: TOTAL_FRAMES - OUTRO_FROM},
	};
};

export const CONTACT = {
	contactName: 'Yan Sangwa Lumbu',
	contactRole: 'Assistant Manager — Villa Bahari Resort',
	contactLines: ['yanlumbusangwa@gmail.com', '+32 488 99 30 97'],
};
