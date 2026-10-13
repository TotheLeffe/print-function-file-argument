/* =========================================================================
   SYSTEME GRAPHIQUE CAMBISTE — parametres communs aux 14 films.
   Charte, grille, echelle typographique, rythme. Aucun composant ne
   contient de couleur, de duree ni de chemin d'actif en dur.
   ========================================================================= */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1350; // 4:5 vertical, le format LinkedIn
export const TOTAL_FRAMES = 450; // 15,000 s exactement

/* ---- Couleurs -----------------------------------------------------------
   Relevees sur les aplats de la video de marque officielle. Le vert et le
   bleu sont tous deux des couleurs Cambiste : la serie leur donne un sens.

     vert  = ce qui est local, africain, deja en place ;
     bleu  = ce qui est international, de l'autre cote de la connexion.

   Une image ou le vert et le bleu se touchent dit donc, sans legende, ce
   que fait Cambiste. C'est la regle qui tient toute la direction
   artistique.                                                              */
export const C = {
  green: '#0AB064', // vert Cambiste
  deep: '#055731', // vert sombre — plans de fond
  forest: '#04231A', // vert quasi noir — fond profond et encre sur clair
  mint: '#E8F6EF', // vert eclairci — papier
  leaf: '#7FD9AE', // vert clair — traits secondaires
  paper: '#F6FBF8', // blanc legerement vert — fond clair par defaut
  blue: '#2361EA', // bleu Cambiste — l'international
  sky: '#9DBCFB', // bleu clair — traits internationaux sur fond sombre
  white: '#FFFFFF',
} as const;

export type Tone = 'light' | 'dark';

/** Encre et traits selon le fond : le contraste n'est jamais laisse au hasard. */
export const ink = (tone: Tone) => (tone === 'dark' ? C.white : C.forest);
export const dim = (tone: Tone) => (tone === 'dark' ? C.leaf : C.deep);

export const ASSETS = {
  wordmark: 'cambiste-wordmark.png', // logotype officiel, masque alpha 494 x 85
  fonts: ['fonts/outfit-latin.woff2', 'fonts/outfit-latin-ext.woff2'],
  fontFamily: 'Outfit',
  website: 'cambiste.app',
} as const;

/* ---- Grille -------------------------------------------------------------
   Marges larges. Le texte vit dans une colonne de 888 px ; l'illustration
   peut deborder jusqu'au bord, jamais le texte.                           */
export const PAD = 96;
export const COL = WIDTH - PAD * 2;

/* ---- Typographie --------------------------------------------------------
   Outfit, la police libre la plus proche du logotype Cambiste. Un seul
   caractere pour toute la serie : la hierarchie vient du corps et de la
   graisse, pas d'un second alphabet.

   Le corps se deduit de la ligne la plus longue — aucune mesure DOM, donc
   un resultat identique a chaque rendu. CAP_EM est la largeur moyenne d'un
   caractere, FILL la part de colonne qu'une ligne occupe au plus.          */
export const CAP_EM = 0.545;
export const FILL = 0.94;

export const typeSize = (lines: string[], max = 108, min = 54) => {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  return Math.round(Math.max(min, Math.min(max, (COL * FILL) / (longest * CAP_EM))));
};

/* ---- Rythme -------------------------------------------------------------
   ENTER : le texte entier parait en 8 images (0,27 s), puis ne bouge plus.
   LEAVE : il sort 6 images avant la coupe.
   Tout le reste du plan est du temps de lecture. Les transitions ne sont
   jamais comptees comme du temps de lecture.                               */
export const ENTER = 8;
export const LEAVE = 6;
export const CUT = 10; // duree d'une transition entre deux plans

/** Temps pendant lequel un texte est entierement lisible, en secondes. */
export const readSeconds = (sceneFrames: number) =>
  (sceneFrames - ENTER - LEAVE) / FPS;

/* ---- Generateur pseudo-aleatoire deterministe -------------------------- */
export const rng = (seed: number) => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
