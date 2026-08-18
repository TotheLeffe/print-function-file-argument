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

const CONTACT = {
	contactName: 'Yan Sangwa Lumbu',
	contactRole: 'Assistant Manager — Villa Bahari Resort',
	contactLines: ['yanlumbusangwa@gmail.com', '+32 488 99 30 97'],
};

const LOCATION = 'Kinsuka Pêcheurs · Ngaliema · Kinshasa, RDC';

/**
 * Version publique (LinkedIn, site, prospection) : elle raconte le lieu et le
 * produit hôtelier, sans aucune donnée financière ni mention de marque.
 */
export const publicScript: MontageScript = {
	watermark: 'Villa Bahari Resort',
	title: {
		eyebrow: 'Kinsuka Pêcheurs · Kinshasa · RDC',
		title: 'Villa Bahari Resort',
		subtitle: 'Un hôtel boutique et resort lifestyle sur les rives du fleuve Congo',
	},
	titleDuration: 150,
	beats: [
		{
			from: 190,
			duration: 200,
			eyebrow: 'Le site',
			title: 'En bord du fleuve Congo',
			body: "4 900 m² de terrain riverain avec accès direct au fleuve, à Kinsuka Pêcheurs — un emplacement sans équivalent dans l'aire métropolitaine de Kinshasa.",
		},
		{
			from: 470,
			duration: 200,
			eyebrow: 'Hébergement',
			title: '46 chambres sur trois étages',
			body: 'Surface moyenne de 26,4 m², vue fleuve ou jardins et terrasse par chambre. La structure est conçue pour une extension à 70 chambres.',
		},
		{
			from: 750,
			duration: 200,
			eyebrow: 'Restauration',
			title: 'Rooftop et bord de fleuve',
			body: "Restaurant avec terrasse sur le fleuve et bar-lounge panoramique sur le toit, autour du concept « L'art de vivre congolais ».",
		},
		{
			from: 1330,
			duration: 200,
			eyebrow: 'Événements',
			title: 'Mariages et réceptions',
			body: 'Une salle modulable et des espaces extérieurs dans les jardins, de 150 à 200 invités — une activité que le site accueille déjà.',
		},
		{
			from: 1545,
			duration: 150,
			eyebrow: 'Loisirs & bien-être',
			title: 'Jardins et vue fleuve',
			body: 'Jardin tropical paysager, salle de fitness ouverte sur le fleuve, et piscine avec terrasse panoramique en projet.',
		},
	],
	panel: {
		from: 1020,
		duration: 270,
		heading: 'Le projet en bref',
		stats: [
			{value: '4 900 m²', label: 'Terrain riverain'},
			{value: '46', label: 'Chambres — phase 1'},
			{value: '70', label: 'Chambres — phase 2'},
			{value: '150–200', label: 'Invités en événementiel'},
			{value: 'T4 2027', label: 'Ouverture cible'},
		],
	},
	outro: {
		from: OUTRO_FROM,
		duration: TOTAL_FRAMES - OUTRO_FROM,
		title: 'Villa Bahari Resort',
		tagline: "« L'art de vivre congolais », sur les rives du fleuve Congo.",
		location: LOCATION,
		...CONTACT,
	},
};

/**
 * Version dossier, destinée aux échanges avec Radisson Hotel Group : mêmes
 * images, mais un discours d'investissement (capital engagé, marché, marque).
 */
export const radissonScript: MontageScript = {
	watermark: 'Villa Bahari Resort',
	confidentialMark: 'Confidentiel',
	title: {
		eyebrow: 'Kinsuka Pêcheurs · Kinshasa · RDC',
		title: 'Villa Bahari Resort',
		subtitle: 'Hôtel boutique de 46 chambres en bord du fleuve Congo, en phase avancée de pré-ouverture',
		badge: 'Dossier confidentiel — préparé pour Radisson Hotel Group',
	},
	titleDuration: 165,
	beats: [
		{
			from: 205,
			duration: 200,
			eyebrow: 'Le site',
			title: 'Un actif sans comparable',
			body: "4 900 m² de terrain riverain avec accès direct au fleuve Congo. Aucun site hôtelier équivalent en bord de fleuve n'existe dans l'aire métropolitaine de Kinshasa.",
		},
		{
			from: 470,
			duration: 200,
			eyebrow: "L'actif",
			title: '46 chambres, extensible à 70',
			body: 'Structure en béton armé achevée, aménagement intérieur en cours. Surface moyenne de 26,4 m² par chambre, ouverture cible T4 2027.',
		},
		{
			from: 750,
			duration: 200,
			eyebrow: "L'engagement",
			title: '5 150 000 USD investis',
			body: "100 % de fonds propres familiaux, aucune dette ni nantissement. Terrain acquis en 2012 et développement autofinancé de bout en bout.",
		},
		{
			from: 1330,
			duration: 200,
			eyebrow: 'Le marché',
			title: 'Kinshasa, marché sous-approvisionné',
			body: "Moins de 1 500 chambres de marque internationale pour 17 millions d'habitants, et aucun hôtel de loisirs de marque hors du quartier d'affaires.",
		},
		{
			from: 1545,
			duration: 150,
			eyebrow: 'La marque',
			title: 'Radisson Individuals',
			body: 'Un actif de collection au caractère local fort, complémentaire du Radisson Blu Kinshasa : un autre lieu, pour une autre occasion.',
		},
	],
	panel: {
		from: 1020,
		duration: 270,
		heading: 'Chiffres clés',
		stats: [
			{value: '5,15 M USD', label: 'Investis à ce jour'},
			{value: 'Zéro', label: 'Dette existante'},
			{value: '46 → 70', label: 'Chambres, phases 1 et 2'},
			{value: 'T3 2026', label: "Cible lettre d'intention"},
			{value: 'T4 2027', label: 'Ouverture cible'},
		],
	},
	outro: {
		from: OUTRO_FROM,
		duration: TOTAL_FRAMES - OUTRO_FROM,
		title: 'Villa Bahari Resort',
		tagline: 'Une visite technique du site peut être organisée à court préavis.',
		location: LOCATION,
		...CONTACT,
		footnote: 'Document confidentiel — Radisson Hotel Group',
	},
};
