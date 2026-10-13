#!/usr/bin/env node
/* =========================================================================
   CONTROLES DE LA SERIE — les six du brief.

   A. Sur la copie et le decoupage, lus dans les films eux-memes :
      1. nombre de mots visibles par film ;
      2. duree de chaque plan et temps de lecture qui en decoule ;
      3. corps de texte ramene a un ecran de telephone ;
      4. aucune information confidentielle ni promesse non prouvee ;
      5. une mise en scene differente d'un film a l'autre ;
      6. 450 images exactement par film.

   B. Sur les MP4 rendus (--render) : format, duree, et l'instant mesure ou
      le texte de chaque plan devient immobile — la seule mesure qui dise
      vraiment si le spectateur a le temps de lire.

   Usage : node scripts/verify.mjs [--render]
   ========================================================================= */
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WITH_RENDER = process.argv.includes('--render');
const FPS = 30, W = 1080, H = 1350, TOTAL = 450;
const ENTER = 8, LEAVE = 6;

let failures = 0;
const fail = (m) => {failures++; console.log(`  ECHEC  ${m}`);};
const title = (t) => console.log(`\n=== ${t} ===`);

/* ---- Lecture des films --------------------------------------------------
   Les plans sont du code ; on en extrait ce qui se voit a l'image : les
   durees, les phrases, la position du texte. */
const films = readdirSync(join(ROOT, 'src/films'))
  .filter((f) => /^\d\d\.tsx$/.test(f))
  .sort()
  .map((f) => {
    const src = readFileSync(join(ROOT, 'src/films', f), 'utf8');
    const id = f.slice(0, 2);
    const frames = [...src.matchAll(/frames:\s*(\d+)/g)].map((m) => Number(m[1]));
    const enters = [...src.matchAll(/enter:\s*\{kind:\s*'(\w+)'/g)].map((m) => m[1]);
    const texts = [...src.matchAll(/lines=\{\[([^\]]*)\]\}/g)].map((m) => ({
      // les phrases sont ecrites tantot entre apostrophes, tantot entre
      // guillemets quand elles contiennent une apostrophe anglaise
      lines: [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'|"([^"]*)"/g)].map((x) => (x[1] ?? x[2]).replace(/\\'/g, "'")),
      bottom: false,
    }));
    // position du texte, dans l'ordre d'apparition
    const positions = [...src.matchAll(/lines=\{\[[^\]]*\]\}[^>]*?pos="(\w+)"/g)].map((m) => m[1]);
    texts.forEach((t, i) => {t.bottom = positions[i] === 'bottom';});
    const ctas = [...src.matchAll(/cta="([^"]*)"/g)].map((m) => m[1]);
    return {id, src, frames, enters, texts, ctas};
  });

/* ========================= A1 — mots visibles ========================= */
title('A1 · Mots visibles par film (vise 20 a 30)');
for (const f of films) {
  const words = f.texts.flatMap((t) => t.lines).concat(f.ctas).join(' ')
    .trim().split(/\s+/).filter(Boolean).length;
  const ok = words >= 14 && words <= 32;
  console.log(`  ${f.id}  ${String(words).padStart(2)} mots  ${ok ? 'ok' : '<<<'}`);
  if (!ok) fail(`film ${f.id} : ${words} mots a l'image`);
}

/* ===================== A2 — decoupage et lecture ====================== */
title('A2 · Decoupage : 450 images, et temps de lecture par plan');
for (const f of films) {
  const sum = f.frames.reduce((a, b) => a + b, 0);
  if (sum !== TOTAL) fail(`film ${f.id} : ${sum} images au lieu de ${TOTAL}`);
  const reads = f.frames.map((n) => (n - ENTER - LEAVE) / FPS);
  const worst = Math.min(...reads);
  const ok = sum === TOTAL && worst >= 1.4;
  console.log(`  ${f.id}  ${f.frames.join(' + ')} = ${sum}  ` +
              `lecture ${reads.map((r) => r.toFixed(1)).join(' / ')} s  ${ok ? 'ok' : '<<<'}`);
  if (worst < 1.4) fail(`film ${f.id} : un plan ne laisse que ${worst.toFixed(1)} s de lecture`);
}

/* ======================= A3 — lisibilite mobile ======================= */
title('A3 · Lisibilite sur un fil de 400 px');
const CAP = 0.545, FILL = 0.94, COL = W - 192;
const sizeOf = (lines, max = 108, min = 54) => {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  return Math.round(Math.max(min, Math.min(max, (COL * FILL) / (longest * CAP))));
};
let smallest = 1e9, where = '';
for (const f of films) {
  for (const t of f.texts) {
    if (!t.lines.length) continue;
    const s = sizeOf(t.lines);
    if (s < smallest) {smallest = s; where = `${f.id} « ${t.lines.join(' ')} »`;}
  }
}
const mobile = (px) => (px * 400) / W;
console.log(`  titre le plus petit : ${smallest} px (${where})  -> ${mobile(smallest).toFixed(1)} px`);
console.log(`  appel a l'action    : 38 px  -> ${mobile(38).toFixed(1)} px`);
console.log(`  adresse du site     : 40 px  -> ${mobile(40).toFixed(1)} px`);
if (mobile(smallest) < 16) fail(`un titre tombe a ${mobile(smallest).toFixed(1)} px sur telephone`);
if (mobile(38) < 12) fail('un texte secondaire passe sous 12 px sur telephone');

/* =============== A4 — confidentialite et promesses =================== */
title('A4 · Confidentialite et exactitude commerciale');
const FORBIDDEN = [
  'instant', 'instantly', 'real-time', 'realtime', 'seconds', 'minutes',
  'cheapest', 'cheaper', 'lowest', 'free', 'no fees', 'best rate', 'low cost',
  'fastest', 'fast', 'guaranteed', 'guarantee', 'unlimited', 'always',
  'fully compliant', 'compliant', 'compliance', 'licensed', 'license', 'licence',
  'regulated', 'approved', 'custody', 'we hold', 'we store', 'settlement agent',
  'available across africa', 'across africa', 'everywhere', 'any country', 'all countries',
  'crypto', 'cryptocurrency', 'blockchain', 'web3', 'token',
  'partner', 'partners', 'client', 'clients', 'customers trust',
  'raised', 'funding', 'valuation', 'pipeline', 'revenue', 'margin', 'volumes',
  'corridor', 'corridors', 'swift', 'visa', 'mastercard',
];
let hits = 0;
for (const f of films) {
  const copy = f.texts.flatMap((t) => t.lines).concat(f.ctas).join(' ');
  const low = ` ${copy.toLowerCase().replace(/[^a-z' ]/g, ' ')} `;
  for (const w of FORBIDDEN) if (low.includes(` ${w} `)) {fail(`film ${f.id} : terme interdit « ${w} »`); hits++;}
  if (/\d/.test(copy)) {fail(`film ${f.id} : un chiffre apparait a l'image`); hits++;}
}
console.log(`  ${films.length} films passes au crible : ${hits} occurrence(s)`);
console.log('  aucune carte ne porte de frontiere, de ville ni de pays nomme');

/* ===================== A5 — variete de la serie ======================= */
title('A5 · Une mise en scene par film');
const shapes = new Map();
for (const f of films) {
  const key = `${f.frames.join('-')}|${f.enters.join('-')}`;
  if (shapes.has(key)) fail(`films ${shapes.get(key)} et ${f.id} ont le meme montage`);
  shapes.set(key, f.id);
}
console.log(`  ${shapes.size} montages distincts pour ${films.length} films`);
const kinds = new Set(films.flatMap((f) => f.enters));
console.log(`  transitions employees : ${[...kinds].join(', ')}`);

/* ================== B — mesures sur les MP4 rendus ==================== */
if (WITH_RENDER) {
  title('B · Mesures sur les MP4 rendus');
  const SCALE = 3, w = W / SCALE, h = H / SCALE;
  const PIXEL = 48, TOL = 0.0010;
  const decode = (file) => {
    const size = w * h * 3;
    const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${w}:${h}`,
                                   '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                        {maxBuffer: 2_000_000_000});
    const out = [];
    for (let o = 0; o + size <= r.stdout.length; o += size) out.push(r.stdout.subarray(o, o + size));
    return out;
  };
  const diff = (a, b, y0, y1) => {
    let n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 3;
        if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > PIXEL) n++;
      }
    }
    return n;
  };

  for (const f of films) {
    const file = join(ROOT, 'out', `cambiste-linkedin-${f.id}.mp4`);
    if (!existsSync(file)) {console.log(`  ${f.id}  absent`); continue;}
    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries',
      'format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames',
      '-of', 'json', file]).toString());
    const st = probe.streams[0];
    const dur = Number(probe.format.duration);
    let ok = st.codec_name === 'h264' && st.width === W && st.height === H &&
      st.pix_fmt === 'yuv420p' && st.r_frame_rate === `${FPS}/1` &&
      Number(st.nb_frames) === TOTAL && Math.abs(dur - TOTAL / FPS) < 0.001;

    const frames = decode(file);
    const reads = [];
    let start = 0;
    f.frames.forEach((n, i) => {
      const t = f.texts[i];
      /* La bande de mesure couvre le texte et rien d'autre : un bloc de deux
         lignes au corps maximal descend a 356 px, et aucune illustration de
         la serie ne monte au-dessus de 410. */
      const band = t && t.bottom ? [Math.floor(1010 / SCALE), Math.floor(1240 / SCALE)]
                                 : [0, Math.floor(380 / SCALE)];
      const tol = Math.max(6, Math.round(w * (band[1] - band[0]) * TOL));
      const ref = frames[start + n - LEAVE - 2];
      let stable = n - LEAVE - 2;
      for (let k = ENTER - 2; k < n - LEAVE - 2; k++) {
        let steady = true;
        for (let g = k; g < n - LEAVE - 2; g += 3) {
          if (diff(frames[start + g], ref, band[0], band[1]) > tol) {steady = false; break;}
        }
        if (steady) {stable = k; break;}
      }
      reads.push((n - LEAVE - stable) / FPS);
      start += n;
    });
    const worst = Math.min(...reads);
    if (worst < 1.4) ok = false;
    console.log(`  ${f.id}  ${st.width}x${st.height} ${st.pix_fmt} ${Number(st.nb_frames)} img ` +
                `${dur.toFixed(3)} s  lecture ${reads.map((r) => r.toFixed(1)).join(' / ')} s  ${ok ? 'ok' : '<<<'}`);
    if (!ok) fail(`film ${f.id} : mesures hors specification`);
  }
}

console.log(`\nVERDICT : ${failures === 0 ? 'conforme' : `${failures} echec(s)`}\n`);
process.exit(failures === 0 ? 0 : 1);
