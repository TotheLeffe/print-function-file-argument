#!/usr/bin/env node
/* =========================================================================
   Verification du film RENDU — pas du code qui le produit.

   Decode le MP4 en RVB brut et mesure, image par image :
     1. le format et la duree ;
     2. l'instant ou le texte de chaque ecran devient STABLE, et combien de
        temps il le reste — c'est la seule mesure qui compte pour le brief ;
     3. la marge de securite du contenu ;
     4. la hauteur du plus petit texte, ramenee a une largeur mobile.

   Usage : node scripts/verify.mjs ../cambiste-pipeline-spot.mp4
   ========================================================================= */
import {spawn, execFileSync} from 'node:child_process';

const FILE = process.argv[2] ?? '../cambiste-pipeline-spot.mp4';
const W = 1080, H = 1080, FPS = 30;

/* Doit rester aligne sur src/config.ts */
const SCENES = [
  {id: 'traction', start: 0, frames: 90, bg: [0xff, 0xff, 0xff], min: null},
  {id: 'pipeline', start: 90, frames: 120, bg: [0x0a, 0xb0, 0x64], min: 3.5},
  {id: 'partners', start: 210, frames: 120, bg: [0xe8, 0xf6, 0xef], min: 3.5},
  {id: 'closing', start: 330, frames: 120, bg: [0xff, 0xff, 0xff], min: 3.5},
];
const BACKGROUNDS = SCENES.map((s) => s.bg);
const WIPE = 8;
/* Le reseau du 3e ecran bouge en permanence par construction : la mesure de
   stabilite du TEXTE l'exclut, la bande basse lui etant reservee. */
const TEXT_ONLY_ABOVE = {partners: 620};

const probe = JSON.parse(
  execFileSync('ffprobe', [
    '-v', 'error', '-show_entries',
    'format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames',
    '-of', 'json', FILE,
  ]).toString()
);
const st = probe.streams[0];

const frames = [];
await new Promise((resolve, reject) => {
  const ff = spawn('ffmpeg', ['-v', 'error', '-i', FILE, '-f', 'rawvideo',
                              '-pix_fmt', 'rgb24', '-']);
  let buf = Buffer.alloc(0);
  const size = W * H * 3;
  ff.stdout.on('data', (d) => {
    buf = buf.length ? Buffer.concat([buf, d]) : d;
    while (buf.length >= size) {
      frames.push(buf.subarray(0, size));
      buf = buf.subarray(size);
    }
  });
  ff.on('error', reject);
  ff.on('close', resolve);
});

const far = (f, i, c, t) =>
  Math.abs(f[i] - c[0]) + Math.abs(f[i + 1] - c[1]) + Math.abs(f[i + 2] - c[2]) > t;

/**
 * Nombre de pixels qui different entre deux images, sur une zone donnee.
 *
 * Le seuil doit distinguer un MOUVEMENT du bruit de compression. Un texte
 * fixe encode en H.264 varie de quelques centaines de pixels sur ses bords
 * anticrenelés d'un groupe d'images a l'autre — mesure : 235 px, soit 0,02 %
 * du cadre. Un decalage d'un seul pixel du meme texte en changerait des
 * milliers. Le seuil par pixel et la tolerance ci-dessous passent entre les
 * deux : ils ignorent le codec, jamais une animation.
 */
const PIXEL_THRESHOLD = 48;
const TOLERANCE_RATIO = 0.0005; // 0,05 % du cadre

const diff = (a, b, yMax) => {
  let n = 0;
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3;
      if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) +
          Math.abs(a[i + 2] - b[i + 2]) > PIXEL_THRESHOLD) n++;
    }
  }
  return n;
};

console.log('\n=== Format ===');
console.log(`${st.codec_name}  ${st.width}x${st.height}  ${st.pix_fmt}  ` +
            `${st.r_frame_rate} ips  ${st.nb_frames} images  ` +
            `${Number(probe.format.duration).toFixed(3)} s`);
const specOk = st.codec_name === 'h264' && st.width === 1080 && st.height === 1080 &&
  st.pix_fmt === 'yuv420p' && st.r_frame_rate === '30/1' &&
  Number(st.nb_frames) === 450 && Math.abs(Number(probe.format.duration) - 15) < 0.001;
console.log(specOk ? 'conforme : 450 images, 15,000 s exactes' : 'NON CONFORME');

console.log('\n=== Temps de lecture stable, mesure sur le rendu ===');
let allOk = specOk;
for (const s of SCENES) {
  const yMax = TEXT_ONLY_ABOVE[s.id] ?? H;
  const last = frames[s.start + s.frames - 1];
  const tol = Math.round(W * yMax * TOLERANCE_RATIO);
  let stable = s.frames - 1;
  for (let f = 0; f < s.frames; f++) {
    let ok = true;
    for (let g = f; g < s.frames; g += 3) {
      if (diff(frames[s.start + g], last, yMax) > tol) {ok = false; break;}
    }
    if (ok) {stable = f; break;}
  }
  const seconds = (s.frames - stable) / FPS;
  const verdict = s.min === null ? '(pas de minimum)'
    : seconds >= s.min ? `ok (>= ${s.min} s)` : `SOUS LE SEUIL de ${s.min} s`;
  if (s.min !== null && seconds < s.min) allOk = false;
  console.log(`${s.id.padEnd(9)} stable des ${(stable / FPS).toFixed(2)} s  ` +
              `-> ${seconds.toFixed(2)} s de lecture   ${verdict}`);
}

console.log('\n=== Marges de securite (volets exclus) ===');
let worst = 1e9, worstF = null;
for (let f = 0; f < frames.length; f += 3) {
  if (SCENES.some((s) => f >= s.start && f < s.start + WIPE + 2)) continue;
  const img = frames[f];
  let x0 = W, x1 = -1, y0 = H, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3;
      if (BACKGROUNDS.every((c) => far(img, i, c, 110))) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) continue;
  const m = Math.min(x0, W - 1 - x1, y0, H - 1 - y1);
  if (m < worst) {worst = m; worstF = f;}
}
console.log(`marge minimale : ${worst} px (image ${worstF})`);

console.log('\n=== Lisibilite mobile ===');
/* Hauteur de chaque bloc de l'ecran final, ramenee a 400 px de large — la
   largeur typique d'un fil LinkedIn sur telephone. Les bandes sont trouvees,
   pas supposees : on lit le profil vertical du contenu. */
const card = frames[330 + 100];
const bands = [];
let open = null;
for (let y = 0; y < H; y++) {
  let count = 0;
  for (let x = 0; x < W; x++) {
    if (far(card, (y * W + x) * 3, [0xff, 0xff, 0xff], 150)) count++;
  }
  if (count > 0) {
    if (open && y === open.y1 + 1) open.y1 = y;
    else {open = {y0: y, y1: y}; bands.push(open);}
  }
}
const LABEL = ['logo', 'signature', 'adresse'];
let smallest = 1e9;
bands.forEach((b, i) => {
  const h = b.y1 - b.y0 + 1;
  smallest = Math.min(smallest, h);
  console.log(`${(LABEL[i] ?? 'bloc').padEnd(10)} ${String(h).padStart(3)} px sur 1080` +
              `  -> ${(h * 400 / 1080).toFixed(1).padStart(5)} px sur un ecran de 400 px`);
});
if (smallest * 400 / 1080 < 12) {
  console.log('ATTENTION : un bloc passe sous 12 px a la taille mobile');
  allOk = false;
}

console.log(`\nVERDICT GLOBAL : ${allOk ? 'conforme' : 'NON CONFORME'}\n`);
process.exit(allOk ? 0 : 1);
