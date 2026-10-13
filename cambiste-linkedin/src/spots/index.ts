import {ColorKey} from '../config';

/* =========================================================================
   LES 14 SPOTS
   Une seule idee par spot. Quatre ecrans. Les textes sont ceux du brief ;
   seules les coupes de ligne sont decidees ici.

   REGLE EDITORIALE APPLIQUEE AU DERNIER ECRAN
   Le logo Cambiste figure sur le carton de fin. Quand le message final se
   reduit a la marque seule — « Cambiste. » — il n'est pas repris en texte :
   le logo EST ce mot, et l'ecrire deux fois est une faute de marque, pas un
   choix de copie. Quand « Cambiste » est pris dans une phrase (« Meet
   Cambiste. », « Build with Cambiste. »), la phrase est conservee entiere.
   Les spots 7 et 11 finissent donc sur le logo et l'adresse seuls.
   ========================================================================= */

export type VisualKey =
  | 'arcsOut'
  | 'converge'
  | 'walletOpen'
  | 'bankFanOut'
  | 'threeSteps'
  | 'bridge'
  | 'reorder'
  | 'behindLayer'
  | 'chain'
  | 'manyToOne'
  | 'merge'
  | 'orbit'
  | 'layeredFlow'
  | 'joinNetwork';

export type Spot = {
  id: string;
  slug: string;
  title: string;
  /** Angle creatif, en francais : sert la relecture, pas le rendu. */
  angle: string;
  /** Trois ecrans de texte, deux lignes au maximum chacun. */
  screens: [string[], string[], string[]];
  /** Message final. Vide = carton de fin reduit au logo et a l'adresse. */
  closing: string[];
  visual: VisualKey;
  /** Libelles des blocs du schema. Jamais de nom reel. */
  labels?: string[];
};

/** Rythme de fonds commun a toute la serie : c'est lui qui fait l'identite. */
export const BACKGROUNDS: [ColorKey, ColorKey, ColorKey, ColorKey] = [
  'white',
  'green',
  'mint',
  'white',
];

export const SPOTS: Spot[] = [
  {
    id: '01',
    slug: 'africa-to-the-world',
    title: 'AFRICA → THE WORLD',
    angle: "Poser l'ambition d'emblee.",
    screens: [
      ['African finance.', 'Global ambitions.'],
      ['Local payment systems.'],
      ['Building connections', 'to global payments.'],
    ],
    closing: ["Let's connect."],
    visual: 'arcsOut',
  },
  {
    id: '02',
    slug: 'built-for-institutions',
    title: 'BUILT FOR INSTITUTIONS',
    angle: 'Nommer clairement nos clients.',
    screens: [['Banks.'], ['Mobile wallets.'], ['Your next', 'cross-border chapter.']],
    closing: ['Build it with Cambiste.'],
    visual: 'converge',
    labels: ['BANK', 'MOBILE WALLET', 'CAMBISTE'],
  },
  {
    id: '03',
    slug: 'beyond-the-wallet',
    title: 'BEYOND THE WALLET',
    angle: 'Elargir le champ des mobile wallets.',
    screens: [
      ['Your wallet.', 'Bigger possibilities.'],
      ['Beyond local payments.'],
      ['Toward international', 'connections.'],
    ],
    closing: ['Explore Cambiste.'],
    visual: 'walletOpen',
  },
  {
    id: '04',
    slug: 'the-banking-connection',
    title: 'THE BANKING CONNECTION',
    angle: 'Parler directement aux banques africaines.',
    screens: [
      ['African banks.', 'Global opportunity.'],
      ['Expand your', 'payment possibilities.'],
      ['With connected', 'infrastructure.'],
    ],
    closing: ['Build with Cambiste.'],
    visual: 'bankFanOut',
    labels: ['BANK'],
  },
  {
    id: '05',
    slug: 'how-we-connect',
    title: 'HOW WE CONNECT',
    angle: 'Expliquer le fonctionnement en trois mots.',
    screens: [['Local payment.'], ['Digital liquidity.'], ['International payout.']],
    closing: ['Our approach:', 'connected orchestration.'],
    visual: 'threeSteps',
    labels: ['LOCAL PAYMENT', 'DIGITAL LIQUIDITY', 'INTERNATIONAL PAYOUT'],
  },
  {
    id: '06',
    slug: 'stablecoins-explained',
    title: 'STABLECOINS, EXPLAINED SIMPLY',
    angle: 'Situer leur role dans notre approche.',
    screens: [
      ['Local money.'],
      ['Stablecoins as a bridge.'],
      ['Toward international', 'payments.'],
    ],
    closing: ['Infrastructure by Cambiste.'],
    visual: 'bridge',
    labels: ['LOCAL', 'GLOBAL'],
  },
  {
    id: '07',
    slug: 'fragmentation-to-connection',
    title: 'FROM FRAGMENTATION TO CONNECTION',
    angle: 'Montrer le probleme auquel nous repondons.',
    screens: [
      ['Different systems.'],
      ['Disconnected', 'payment journeys.'],
      ["We're building", 'the connections.'],
    ],
    closing: [],
    visual: 'reorder',
  },
  {
    id: '08',
    slug: 'your-brand-our-technology',
    title: 'YOUR BRAND, OUR TECHNOLOGY',
    angle: "Garder l'institution au premier plan.",
    screens: [['Your customers.'], ['Your brand.'], ['Our orchestration', 'technology.']],
    closing: ['Build together.'],
    visual: 'behindLayer',
    labels: ['YOUR APP', 'ORCHESTRATION'],
  },
  {
    id: '09',
    slug: 'african-businesses',
    title: 'AFRICAN BUSINESSES, GLOBAL NEEDS',
    angle: 'Relier notre infrastructure a un besoin concret.',
    screens: [
      ['African businesses', 'trade globally.'],
      ['Their payments', 'should follow.'],
      ['Banks and wallets', 'enable access.'],
    ],
    closing: ['Cambiste builds', 'the connections.'],
    visual: 'chain',
    labels: ['BUSINESS', 'BANK OR WALLET', 'GLOBAL'],
  },
  {
    id: '10',
    slug: 'one-orchestration-layer',
    title: 'ONE ORCHESTRATION LAYER',
    angle: 'Rendre notre role technologique concret.',
    screens: [
      ['Multiple payment systems.'],
      ['One orchestration layer.'],
      ['Designed for banks', 'and wallets.'],
    ],
    closing: ['Meet Cambiste.'],
    visual: 'manyToOne',
    labels: ['ORCHESTRATION LAYER'],
  },
  {
    id: '11',
    slug: 'liquidity-meets-payments',
    title: 'LIQUIDITY MEETS PAYMENTS',
    angle: 'Expliquer pourquoi relier liquidite et paiements.',
    screens: [
      ['Payments need liquidity.'],
      ['Liquidity needs', 'connections.'],
      ["We're building", 'that bridge.'],
    ],
    closing: [],
    visual: 'merge',
    labels: ['PAYMENTS', 'LIQUIDITY'],
  },
  {
    id: '12',
    slug: 'customer-global-ambition',
    title: "A CUSTOMER'S GLOBAL AMBITION",
    angle: 'Montrer le besoin final sans virer au B2C.',
    screens: [
      ['Your customer', 'thinks globally.'],
      ['Your payment offer', 'can too.'],
      ['For African banks', 'and wallets.'],
    ],
    closing: ['Explore Cambiste.'],
    visual: 'orbit',
    labels: ['YOUR APP'],
  },
  {
    id: '13',
    slug: 'technology-behind-the-journey',
    title: 'TECHNOLOGY BEHIND THE JOURNEY',
    angle: 'Dire la sophistication sans jargon.',
    screens: [
      ['Behind every', 'payment journey.'],
      ['Systems must', 'work together.'],
      ["That's what", "we're building."],
    ],
    closing: ['Connected infrastructure.'],
    visual: 'layeredFlow',
  },
  {
    id: '14',
    slug: 'partnership-invitation',
    title: 'THE PARTNERSHIP INVITATION',
    angle: "Transformer l'attention en prise de contact.",
    screens: [
      ["Building Africa's", 'payment connections.'],
      ['For banks.'],
      ['For mobile wallets.'],
    ],
    closing: ["Let's build together."],
    visual: 'joinNetwork',
    labels: ['BANK', 'MOBILE WALLET'],
  },
];

/** Compte les mots affiches, logo et adresse exclus. */
export const wordCounts = (s: Spot) => {
  const count = (lines: string[]) =>
    lines.join(' ').trim().split(/\s+/).filter(Boolean).length;
  const per = [...s.screens.map(count), count(s.closing)];
  return {per, total: per.reduce((a, b) => a + b, 0)};
};
