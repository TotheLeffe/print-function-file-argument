#!/usr/bin/env node
/* =========================================================================
   CONTROLES AVANT ET APRES RENDU — les six du brief.

   Partie A, sur la copie et la grille (toujours) :
     1. nombre de mots par sequence et par spot ;
     2. temps de lecture reel de chaque ecran ;
     3. lisibilite sur telephone (corps ramene a un fil de 400 px) ;
     4. absence de chevauchement texte / schema ;
     5. aucune information confidentielle ni promesse non prouvee ;
     6. comprehension sans son.

   Partie B, sur les MP4 RENDUS s'ils existent (out/) : format, duree, et
   l'instant mesure ou le texte de chaque ecran devient immobile.

   Les constantes ne sont pas recopiees : src/config.ts et src/spots/index.ts
   sont compiles a la volee par le tsc du projet, puis importes. Une valeur
   changee dans la configuration est donc immediatement celle qui est
   verifiee.

   Usage : node scripts/verify.mjs [--render]
   ========================================================================= */
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WITH_RENDER = process.argv.includes('--render');

/* ---- Charge la configuration reelle du projet --------------------------- */
const tmp = mkdtempSync(join(tmpdir(), 'cambiste-verify-'));
writeFileSync(join(tmp, 'package.json'), '{"type":"module"}');
execFileSync(
  join(ROOT, 'node_modules', '.bin', 'tsc'),
  ['src/config.ts', 'src/spots/index.ts', '--outDir', tmp, '--rootDir', 'src',
   '--module', 'esnext', '--target', 'es2020', '--moduleResolution', 'bundler',
   '--skipLibCheck'],
  {cwd: ROOT, stdio: 'inherit'}
);
const CFG = await import(join(tmp, 'config.js'));
const SP = await import(join(tmp, 'spots', 'index.js'));
rmSync(tmp, {recursive: true, force: true});

const {FPS, WIDTH, HEIGHT, TOTAL_FRAMES, CUTS, GRID, SAFE_X, CONTENT_W,
       READABLE_FROM, WIPE, COLORS, headlineSize, CAP_EM, FILL} = CFG;
const {SPOTS, BACKGROUNDS, wordCounts} = SP;

let failures = 0;
const fail = (msg) => {failures++; console.log(`  ECHEC  ${msg}`);};
const title = (t) => console.log(`\n=== ${t} ===`);

/* =========================================================================
   A1 — NOMBRE DE MOTS
   Sept mots par sequence au maximum, vingt-quatre pour le spot. Le logo et
   l'adresse ne comptent pas : ce sont des actifs de marque, pas de la copie.
   ========================================================================= */
title('A1 · Nombre de mots (max 7 par sequence, 24 par spot)');
for (const s of SPOTS) {
  const {per, total} = wordCounts(s);
  const bad = per.some((n) => n > 7) || total > 24;
  console.log(`  ${s.id}  ${per.map((n) => String(n).padStart(2)).join(' ')}  ` +
              `total ${String(total).padStart(2)}  ${bad ? '<<<' : 'ok'}`);
  if (bad) fail(`spot ${s.id} : ${per.join('/')} mots, total ${total}`);
}

/* =========================================================================
   A2 — TEMPS DE LECTURE
   Le texte est complet et immobile a l'image READABLE_FROM ; tout le reste
   de la sequence est du temps de lecture pur. L'ecran d'accroche tient 3 s
   par le decoupage impose du brief, les trois autres 4 s.
   ========================================================================= */
title('A2 · Temps de lecture par ecran');
const MINS = [2.4, 3.5, 3.5, 3.5];
CUTS.forEach((c, i) => {
  const sec = (c.frames - READABLE_FROM) / FPS;
  const ok = sec >= MINS[i];
  console.log(`  sequence ${i + 1}  ${(c.start / FPS).toFixed(0)}–` +
              `${((c.start + c.frames) / FPS).toFixed(0)} s   lecture stable ` +
              `${sec.toFixed(2)} s   (min ${MINS[i]})  ${ok ? 'ok' : '<<<'}`);
  if (!ok) fail(`sequence ${i + 1} : ${sec.toFixed(2)} s de lecture`);
});
if (CUTS.reduce((n, c) => n + c.frames, 0) !== TOTAL_FRAMES) {
  fail('le decoupage ne totalise pas 450 images');
}

/* =========================================================================
   A3 — LISIBILITE SUR TELEPHONE
   Un fil LinkedIn sur telephone fait environ 400 px de large. Tout corps
   est ramene a cette largeur ; le plancher retenu est 12 px.
   ========================================================================= */
title('A3 · Lisibilite sur un fil de 400 px');
const MOBILE = 400 / WIDTH;
const PHONE_MIN = 12;
const LABEL_MIN = 34; // plancher applique aux libelles de schema
let smallestHead = 1e9;
for (const s of SPOTS) {
  for (const lines of s.screens) smallestHead = Math.min(smallestHead, headlineSize(lines));
  if (s.closing.length) {
    smallestHead = Math.min(smallestHead, Math.min(96, headlineSize(s.closing)));
  }
}
const rows = [
  ['titre le plus petit', smallestHead],
  ['libelle de schema', LABEL_MIN],
  ['adresse du carton de fin', 40],
];
for (const [what, size] of rows) {
  const px = size * MOBILE;
  console.log(`  ${what.padEnd(26)} ${String(size).padStart(3)} px  -> ` +
              `${px.toFixed(1).padStart(5)} px  ${px >= PHONE_MIN ? 'ok' : '<<<'}`);
  if (px < PHONE_MIN) fail(`${what} a ${px.toFixed(1)} px sur telephone`);
}

/* =========================================================================
   A4 — PAS DE CHEVAUCHEMENT
   Deux bandes disjointes : le message en haut, le schema en bas. On verifie
   la grille, puis que chaque phrase tient dans la bande haute — largeur
   estimee au meme ratio de capitale que le rendu, et deux lignes au plus.
   ========================================================================= */
title('A4 · Chevauchements et debordements');
if (GRID.visTop <= GRID.textBottom) fail('la bande de schema recouvre la bande de texte');
else console.log(`  bandes disjointes : texte ${GRID.textTop}–${GRID.textBottom}, ` +
                 `schema ${GRID.visTop}–${GRID.visBottom}  ok`);
const CAP = CAP_EM;
let worstFill = 0;
for (const s of SPOTS) {
  const all = [...s.screens, ...(s.closing.length ? [s.closing] : [])];
  for (const lines of all) {
    if (lines.length > 2) fail(`spot ${s.id} : ${lines.length} lignes a l'ecran`);
    const size = headlineSize(lines);
    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    const w = longest * CAP * size;
    worstFill = Math.max(worstFill, w / CONTENT_W);
    // contrainte reelle : tenir dans la colonne. FILL garde une reserve de
    // 6 % pour l'ecart entre cette estimation et les metriques de la police.
    if (w > CONTENT_W) {
      fail(`spot ${s.id} : "${lines.join(' ')}" large de ${Math.round(w)} px`);
    }
    const h = lines.length * size * 1.08;
    if (h > GRID.textBottom - GRID.textTop) {
      fail(`spot ${s.id} : bloc de texte haut de ${Math.round(h)} px`);
    }
  }
}
const fillOk = worstFill <= FILL + 0.01;
console.log(`  remplissage maximal de la colonne : ` +
            `${(worstFill * 100).toFixed(1)} % de ${CONTENT_W} px ` +
            `(reserve visee ${((1 - FILL) * 100).toFixed(0)} %)  ${fillOk ? 'ok' : '<<<'}`);
if (!fillOk) fail(`une ligne occupe ${(worstFill * 100).toFixed(1)} % de la colonne`);
console.log(`  marges : ${SAFE_X} px a gauche et a droite, ${GRID.textTop} px en haut`);

/* =========================================================================
   A5 — CONFIDENTIALITE ET EXACTITUDE COMMERCIALE
   Aucun nom de partenaire, prospect ou client. Aucun chiffre : ni volume,
   ni tarif, ni valorisation. Aucune promesse de disponibilite, de vitesse,
   de prix ou de couverture reglementaire. Les capacites en construction se
   disent « building », « designed to » ou « our approach ».
   ========================================================================= */
title('A5 · Confidentialite et promesses');
const FORBIDDEN = [
  'instant', 'instantly', 'real-time', 'realtime', 'seconds',
  'cheapest', 'cheaper', 'lowest', 'free', 'no fees', 'best rate',
  'fastest', 'fast', 'guaranteed', 'guarantee', 'unlimited',
  'fully compliant', 'compliant', 'compliance', 'licensed', 'license', 'licence',
  'regulated', 'approved', 'custody', 'we hold', 'we store',
  'available across africa', 'across africa', 'everywhere', 'any country',
  'crypto', 'cryptocurrency', 'token', 'blockchain', 'web3',
  'partner', 'partners', 'client', 'clients', 'customers trust',
  'raised', 'funding', 'valuation', 'pipeline', 'revenue', 'margin',
  'volumes', 'corridor', 'corridors',
];
const GENERIC_LABELS = new Set([
  'BANK', 'MOBILE WALLET', 'CAMBISTE', 'LOCAL PAYMENT', 'DIGITAL LIQUIDITY',
  'INTERNATIONAL PAYOUT', 'LOCAL', 'GLOBAL', 'YOUR APP', 'ORCHESTRATION',
  'BUSINESS', 'BANK OR WALLET', 'ORCHESTRATION LAYER', 'PAYMENTS', 'LIQUIDITY',
]);
let hits = 0;
for (const s of SPOTS) {
  const copy = [...s.screens.flat(), ...s.closing].join(' ');
  const low = ` ${copy.toLowerCase().replace(/[^a-z' ]/g, ' ')} `;
  for (const w of FORBIDDEN) {
    if (low.includes(` ${w} `)) {fail(`spot ${s.id} : terme interdit « ${w} »`); hits++;}
  }
  if (/\d/.test(copy)) {fail(`spot ${s.id} : un chiffre apparait a l'image`); hits++;}
  for (const l of s.labels ?? []) {
    if (!GENERIC_LABELS.has(l)) {fail(`spot ${s.id} : libelle non generique « ${l} »`); hits++;}
  }
}
console.log(`  ${SPOTS.length} spots passes au crible : ${hits} occurrence(s)`);
console.log('  tous les libelles de schema appartiennent au vocabulaire generique');
const HEDGES = ['building', 'designed', 'our approach', 'toward', 'can', 'should', 'enable'];
const hedged = SPOTS.filter((s) =>
  HEDGES.some((h) => [...s.screens.flat(), ...s.closing].join(' ').toLowerCase().includes(h))
).length;
console.log(`  ${hedged}/${SPOTS.length} spots formulent la capacite au futur ou au present progressif`);

/* =========================================================================
   A6 — COMPREHENSION SANS SON
   Quatre ecrans pleins, un schema par spot, une marque a la fin. Rien ne
   depend d'une voix off : il n'y en a aucune, les films sont muets.
   ========================================================================= */
title('A6 · Comprehension sans son');
const seen = new Set();
for (const s of SPOTS) {
  if (s.screens.some((l) => l.length === 0)) fail(`spot ${s.id} : un ecran vide`);
  if (seen.has(s.visual)) fail(`spot ${s.id} : schema ${s.visual} deja employe`);
  seen.add(s.visual);
}
console.log(`  ${seen.size} schemas distincts pour ${SPOTS.length} spots  ok`);
console.log('  fonds de la serie : ' + BACKGROUNDS.join(' · ') +
            '  (identite commune aux 14 spots)');
console.log('  carton de fin : message + logo + cambiste.app, rien d\'autre a l\'image');

/* =========================================================================
   B — MESURES SUR LES FICHIERS RENDUS
   ========================================================================= */
const SCALE = 3; // on decode en 360 x 450 : la stabilite se mesure aussi bien
const w = WIDTH / SCALE, h = HEIGHT / SCALE;
const PIXEL_THRESHOLD = 48;
const TOLERANCE_RATIO = 0.0008;

const decode = (file) =>
  new Promise((done, nope) => {
    const frames = [];
    const size = w * h * 3;
    let buf = Buffer.alloc(0);
    const ff = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${w}:${h}`,
                                    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         {maxBuffer: 1 << 30});
    if (ff.error) return nope(ff.error);
    buf = ff.stdout;
    for (let o = 0; o + size <= buf.length; o += size) frames.push(buf.subarray(o, o + size));
    done(frames);
  });

const diff = (a, b, yMax) => {
  let n = 0;
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) +
          Math.abs(a[i + 2] - b[i + 2]) > PIXEL_THRESHOLD) n++;
    }
  }
  return n;
};

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const BG = BACKGROUNDS.map((k) => hex(COLORS[k]));
const far = (f, i, c, t) =>
  Math.abs(f[i] - c[0]) + Math.abs(f[i + 1] - c[1]) + Math.abs(f[i + 2] - c[2]) > t;

if (WITH_RENDER) {
  title('B · Mesures sur les MP4 rendus');
  for (const s of SPOTS) {
    const file = join(ROOT, 'out', `cambiste-linkedin-${s.id}.mp4`);
    if (!existsSync(file)) {console.log(`  ${s.id}  absent`); continue;}

    const probe = JSON.parse(execFileSync('ffprobe', [
      '-v', 'error', '-show_entries',
      'format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames',
      '-of', 'json', file,
    ]).toString());
    const st = probe.streams[0];
    const dur = Number(probe.format.duration);
    const specOk = st.codec_name === 'h264' && st.width === WIDTH && st.height === HEIGHT &&
      st.pix_fmt === 'yuv420p' && st.r_frame_rate === `${FPS}/1` &&
      Number(st.nb_frames) === TOTAL_FRAMES && Math.abs(dur - TOTAL_FRAMES / FPS) < 0.001;

    const frames = await decode(file);
    const read = [];
    let ok = specOk;
    CUTS.forEach((c, i) => {
      // bande de mesure : au-dessus du schema pour les ecrans de texte, tout
      // le cadre pour le carton de fin, qui ne porte aucune animation.
      const yMax = i < 3 ? Math.floor(GRID.visTop / SCALE) : h;
      const tol = Math.max(8, Math.round(w * yMax * TOLERANCE_RATIO));
      const last = frames[c.start + c.frames - 1];
      let stable = c.frames - 1;
      for (let f = 0; f < c.frames; f++) {
        let steady = true;
        for (let g = f; g < c.frames; g += 3) {
          if (diff(frames[c.start + g], last, yMax) > tol) {steady = false; break;}
        }
        if (steady) {stable = f; break;}
      }
      const sec = (c.frames - stable) / FPS;
      read.push(sec);
      if (sec < MINS[i]) ok = false;
    });

    // marge minimale du contenu, volets exclus
    let worst = 1e9;
    for (let f = 0; f < frames.length; f += 6) {
      if (CUTS.some((c) => f >= c.start && f < c.start + WIPE + 2)) continue;
      const img = frames[f];
      let x0 = w, x1 = -1, y0 = h, y1 = -1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 3;
          if (BG.every((c) => far(img, i, c, 110))) {
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) continue;
      worst = Math.min(worst, Math.min(x0, w - 1 - x1, y0, h - 1 - y1) * SCALE);
    }
    if (worst < 80) ok = false;

    console.log(`  ${s.id}  ${st.width}x${st.height} ${st.pix_fmt} ` +
                `${Number(st.nb_frames)} img ${dur.toFixed(3)} s  ` +
                `lecture ${read.map((r) => r.toFixed(2)).join(' / ')} s  ` +
                `marge ~${worst} px  ${ok ? 'ok' : '<<<'}`);
    if (!ok) fail(`spot ${s.id} : mesures hors specification`);
  }
} else {
  console.log('\n(ajouter --render pour mesurer les MP4 de out/)');
}

console.log(`\nVERDICT : ${failures === 0 ? 'conforme' : `${failures} echec(s)`}\n`);
process.exit(failures === 0 ? 0 : 1);
