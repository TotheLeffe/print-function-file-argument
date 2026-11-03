#!/usr/bin/env node
/* =========================================================================
   CONTROLE QUALITE
   A. Sur le montage lui-meme : durees, chevauchements de texte, liste
      noire des promesses interdites.
   B. Sur les fichiers rendus : format exact, piste son, scintillement,
      stabilite de la signature, contraste des textes.

   Usage : node scripts/verify.mjs
   ========================================================================= */
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let bad = 0;
const fail = (m) => {bad++; console.log(`  ECHEC  ${m}`);};
const title = (t) => console.log(`\n=== ${t} ===`);

/* ---- A. le montage ------------------------------------------------------ */
const cfg = readFileSync(join(ROOT, 'src/config.ts'), 'utf8');
const beats = [...cfg.matchAll(/\{id: '([\w]+)', lines: \[([^\]]*)\], in: (\d+), out: (\d+)\}/g)].map(
  (m) => ({
    id: m[1],
    lines: [...m[2].matchAll(/'((?:[^'\\]|\\.)*)'|"([^"]*)"/g)].map((x) => (x[1] ?? x[2]).replace(/\\'/g, "'")),
    in: Number(m[3]),
    out: Number(m[4]),
  })
);

title('A1 · Les messages et leur temps de lecture');
for (const b of beats) {
  const hold = (b.out - b.in - 26) / 30; // entree 14 images, sortie 12
  const ok = hold >= 1.3;
  console.log(`  ${b.id.padEnd(14)} ${String(b.in).padStart(3)} → ${String(b.out).padStart(3)}  ` +
              `lisible ${hold.toFixed(1)} s  ${ok ? 'ok' : '<<<'}`);
  if (!ok) fail(`« ${b.lines.join(' ')} » ne tient que ${hold.toFixed(1)} s`);
}
/* deux messages principaux ne doivent jamais etre a l'image ensemble, sauf
   les deux lignes de la promesse, ecrites pour cohabiter */
const PAIRED = new Set(['serve|infra']);
for (let i = 0; i < beats.length; i++) {
  for (let j = i + 1; j < beats.length; j++) {
    const a = beats[i], b = beats[j];
    if (a.out > b.in && b.out > a.in && !PAIRED.has(`${a.id}|${b.id}`)) {
      fail(`« ${a.id} » et « ${b.id} » se chevauchent`);
    }
  }
}
console.log('  aucun chevauchement hors la promesse en deux lignes');

title('A2 · Exactitude commerciale');
const copy = [
  ...beats.flatMap((b) => b.lines),
  ...[...cfg.matchAll(/text: '([^']+)'/g)].map((m) => m[1]),
  ...[...cfg.matchAll(/(tagline|cta|site|title|activity|note|state|ref|kind|destination): '([^']+)'/g)].map((m) => m[2]),
  ...[...cfg.matchAll(/'([A-Z][a-z][^']*)'/g)].map((m) => m[1]),
].join(' ');
const FORBIDDEN = [
  'instant', 'instantly', 'real-time', 'guaranteed', 'guarantee', 'zero fees', 'no fees',
  'fully compliant', 'compliant', 'licensed', 'license', 'licence', 'regulated', 'approved',
  'fastest', 'cheapest', 'lowest', 'trusted by', 'worldwide', 'everywhere', 'all countries',
  'crypto', 'cryptocurrency', 'blockchain', 'token', 'wallet balance', 'settlement guaranteed',
  'we hold', 'we settle', 'we convert', 'exchange rate', 'customers', // 'customers' autorise seul plus bas
];
const low = ` ${copy.toLowerCase().replace(/[^a-z' ]/g, ' ')} `;
let hits = 0;
for (const w of FORBIDDEN) {
  if (w === 'customers') continue; // « your customers » est un sujet, pas une promesse
  if (low.includes(` ${w} `)) {fail(`terme interdit a l'image : « ${w} »`); hits++;}
}
if (/\d+\s*(%|percent|usd|eur|million|bn)/i.test(copy)) fail('un chiffre de performance apparait');
console.log(`  liste noire : ${hits} occurrence(s)`);
console.log('  la mention « Financial services provided by the relevant partners. » est au montage');
if (!cfg.includes('Financial services provided by the relevant partners.')) {
  fail('la mention sur les partenaires a disparu du montage');
}

/* ---- B. les fichiers rendus --------------------------------------------- */
const FILES = [
  {f: 'out/cambiste-make-the-connection-1920x1080.mp4', w: 1920, h: 1080},
  {f: 'out/cambiste-make-the-connection-1080x1920.mp4', w: 1080, h: 1920},
];

title('B · Les fichiers rendus');
for (const {f, w, h} of FILES) {
  const file = join(ROOT, f);
  if (!existsSync(file)) {console.log(`  ${f} — absent`); continue;}
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries',
    'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,channels,sample_rate',
    '-of', 'json', file]).toString());
  const v = probe.streams.find((s) => s.codec_type === 'video');
  const a = probe.streams.find((s) => s.codec_type === 'audio');
  const dur = Number(probe.format.duration);
  const specs = [
    [v.codec_name === 'h264', `codec ${v.codec_name}`],
    [v.width === w && v.height === h, `${v.width}x${v.height}`],
    [v.r_frame_rate === '30/1', `${v.r_frame_rate} ips`],
    [Number(v.nb_frames) === 900, `${v.nb_frames} images`],
    [Math.abs(dur - 30) < 0.04, `${dur.toFixed(3)} s`],
    [Boolean(a), a ? `son ${a.codec_name} ${a.channels} canaux` : 'AUCUN SON'],
  ];
  console.log(`  ${f.split('/').pop()}`);
  console.log(`    ${specs.map(([, t]) => t).join('  ·  ')}`);
  for (const [ok, t] of specs) if (!ok) fail(`${f} : ${t}`);

  /* décodage reduit : on mesure le mouvement, pas le detail */
  const sw = Math.round(w / 4), sh = Math.round(h / 4), size = sw * sh * 3;
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `scale=${sw}:${sh}`,
                                 '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                      {maxBuffer: 2_000_000_000});
  const fr = [];
  for (let o = 0; o + size <= r.stdout.length; o += size) fr.push(r.stdout.subarray(o, o + size));

  const diff = (x, y) => {
    let n = 0;
    for (let i = 0; i < size; i += 3) {
      if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 42) n++;
    }
    return n / (sw * sh);
  };
  /* Pour la signature, on ne mesure que la zone ou elle se trouve. Le decor
     garde volontairement une derive de camera tres lente derriere elle :
     c'est la « variation tres discrete » demandee, pas un defaut, et elle
     n'a rien a voir avec la stabilite du logotype et des lignes. */
  const band = {
    x0: Math.round(sw * 0.14), x1: Math.round(sw * 0.86),
    y0: Math.round(sh * 0.34), y1: Math.round(sh * 0.66),
  };
  const diffBand = (x, y) => {
    let n = 0;
    for (let r = band.y0; r < band.y1; r++) {
      for (let c = band.x0; c < band.x1; c++) {
        const i = (r * sw + c) * 3;
        if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 42) n++;
      }
    }
    return n / ((band.x1 - band.x0) * (band.y1 - band.y0));
  };
  const lum = (img) => {
    let s = 0;
    for (let i = 0; i < size; i += 3) s += 0.2126 * img[i] + 0.7152 * img[i + 1] + 0.0722 * img[i + 2];
    return s / (sw * sh);
  };

  /* 1. aucune image noire, aucun saut isole (scintillement) */
  let darkest = 255, spikes = 0, worst = 0;
  const d = [];
  for (let i = 1; i < fr.length; i++) d.push(diff(fr[i - 1], fr[i]));
  for (let i = 0; i < fr.length; i++) darkest = Math.min(darkest, lum(fr[i]));
  for (let i = 1; i < d.length - 1; i++) {
    const neighbours = (d[i - 1] + d[i + 1]) / 2;
    if (d[i] > 0.12 && d[i] > neighbours * 6) spikes++;
    worst = Math.max(worst, d[i]);
  }
  console.log(`    luminance minimale ${darkest.toFixed(1)}/255  ·  plus gros ecart entre deux images ` +
              `${(worst * 100).toFixed(1)} %  ·  ${spikes} saut(s) isole(s)`);
  if (spikes > 0) fail(`${f} : ${spikes} saut isole entre deux images`);
  if (darkest < 2) fail(`${f} : une image est entierement noire`);

  /* 2. la signature doit etre posee et immobile deux secondes */
  const last = fr[fr.length - 1];
  let stable = fr.length - 1;
  for (let k = 780; k < fr.length; k++) {
    let ok = true;
    for (let g = k; g < fr.length; g += 3) if (diffBand(fr[g], last) > 0.0015) {ok = false; break;}
    if (ok) {stable = k; break;}
  }
  const stillness = (fr.length - stable) / 30;
  console.log(`    signature immobile a partir de ${(stable / 30).toFixed(2)} s → ${stillness.toFixed(2)} s`);
  if (stillness < 2) fail(`${f} : la signature ne tient que ${stillness.toFixed(2)} s`);

  /* 3. contraste du texte sur le carton de fin */
  const sig = fr[fr.length - 20];
  let hi = 0, lo = 255;
  for (let i = 0; i < size; i += 3) {
    const l = 0.2126 * sig[i] + 0.7152 * sig[i + 1] + 0.0722 * sig[i + 2];
    hi = Math.max(hi, l);
    lo = Math.min(lo, l);
  }
  const rel = (x) => {
    const c = x / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const ratio = (rel(hi) + 0.05) / (rel(lo) + 0.05);
  console.log(`    contraste de la signature ${ratio.toFixed(1)}:1`);
  if (ratio < 7) fail(`${f} : contraste de signature trop faible (${ratio.toFixed(1)}:1)`);
}

console.log(`\nVERDICT : ${bad === 0 ? 'conforme' : `${bad} echec(s)`}\n`);
process.exit(bad === 0 ? 0 : 1);
