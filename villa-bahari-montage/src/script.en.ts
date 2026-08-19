import {composeScript, CONTACT, type MontageScript} from './timeline';

const LOCATION = 'Kinsuka Pêcheurs · Ngaliema · Kinshasa, DR Congo';

/**
 * Public cut (LinkedIn, website, outreach): the place and the hotel product,
 * with no financial figures and no third-party brand named.
 */
export const publicScriptEn: MontageScript = composeScript({
	watermark: 'Villa Bahari Resort',
	title: {
		eyebrow: 'Kinsuka Pêcheurs · Kinshasa · DR Congo',
		title: 'Villa Bahari Resort',
		subtitle: 'A boutique hotel and lifestyle resort on the banks of the Congo River',
	},
	beats: [
		{
			eyebrow: 'The site',
			title: 'On the Congo River',
			body: '4,900 m² of riverfront land with direct access to the river, in Kinsuka Pêcheurs — a location with no equivalent in metropolitan Kinshasa.',
		},
		{
			eyebrow: 'Accommodation',
			title: '46 rooms across three floors',
			body: 'Rooms average 26.4 m², each with a terrace and views over the river or the gardens. The structure is built to extend to 70 rooms.',
		},
		{
			eyebrow: 'Dining',
			title: 'Rooftop and riverside',
			body: 'A restaurant with a riverside terrace and a panoramic rooftop bar-lounge, built around the art of Congolese living.',
		},
		{
			eyebrow: 'Events',
			title: 'Weddings and receptions',
			body: 'A modular hall and outdoor space in the gardens for 150 to 200 guests — business the site already hosts.',
		},
		{
			eyebrow: 'Leisure & wellness',
			title: 'Gardens and river views',
			body: 'Landscaped tropical gardens, a fitness room opening onto the river, and a pool with a panoramic terrace planned.',
		},
	],
	panel: {
		heading: 'The project at a glance',
		stats: [
			{value: '4,900 m²', label: 'Riverfront land'},
			{value: '46', label: 'Rooms — phase 1'},
			{value: '70', label: 'Rooms — phase 2'},
			{value: '150–200', label: 'Event guests'},
			{value: 'Q4 2027', label: 'Target opening'},
		],
	},
	outro: {
		title: 'Villa Bahari Resort',
		tagline: 'The art of Congolese living, on the banks of the Congo River.',
		location: LOCATION,
		...CONTACT,
	},
});

/**
 * Dossier cut, for the conversation with Radisson Hotel Group: same images,
 * an investment case (capital committed, market, brand fit).
 */
export const radissonScriptEn: MontageScript = composeScript({
	watermark: 'Villa Bahari Resort',
	confidentialMark: 'Confidential',
	title: {
		eyebrow: 'Kinsuka Pêcheurs · Kinshasa · DR Congo',
		title: 'Villa Bahari Resort',
		subtitle: 'A 46-room boutique hotel on the Congo River, in advanced pre-opening',
		badge: 'Confidential dossier — prepared for Radisson Hotel Group',
	},
	beats: [
		{
			eyebrow: 'The site',
			title: 'An asset with no comparable',
			body: '4,900 m² of riverfront land with direct access to the Congo River. No comparable riverside hotel site exists in metropolitan Kinshasa.',
		},
		{
			eyebrow: 'The asset',
			title: '46 rooms, extending to 70',
			body: 'Reinforced concrete structure complete, interior fit-out under way. Rooms average 26.4 m²; target opening Q4 2027.',
		},
		{
			eyebrow: 'The commitment',
			title: 'USD 5,150,000 invested',
			body: '100% family equity, with no debt and no encumbrance. Land acquired in 2012, and the development self-funded throughout.',
		},
		{
			eyebrow: 'The market',
			title: 'Kinshasa is underserved',
			body: 'Fewer than 1,500 internationally branded rooms for 17 million people, and no branded leisure hotel outside the business district.',
		},
		{
			eyebrow: 'The brand',
			title: 'Radisson Individuals',
			body: 'A collection asset with strong local character, complementary to Radisson Blu Kinshasa: a different place, for a different occasion.',
		},
	],
	panel: {
		heading: 'Key figures',
		stats: [
			{value: 'USD 5.15M', label: 'Invested to date'},
			{value: 'None', label: 'Existing debt'},
			{value: '46 → 70', label: 'Rooms, phases 1 and 2'},
			{value: 'Q3 2026', label: 'Target letter of intent'},
			{value: 'Q4 2027', label: 'Target opening'},
		],
	},
	outro: {
		title: 'Villa Bahari Resort',
		tagline: 'A technical site visit can be arranged at short notice.',
		location: LOCATION,
		...CONTACT,
		footnote: 'Confidential — Radisson Hotel Group',
	},
});
