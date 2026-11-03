#!/usr/bin/env node
/* =========================================================================
   Rendu des deux formats.

   --concurrency=1 : Remotion repartit sinon les images sur plusieurs
   onglets, et Chromium ne rasterise pas un meme texte au meme sous-pixel
   d'un onglet a l'autre. Sur un film ou le texte reste immobile plusieurs
   secondes, cela se voit.

   Usage : node scripts/render.mjs [wide|tall]
   ========================================================================= */
import {spawnSync} from 'node:child_process';
import {mkdirSync, rmSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const JOBS = [
  {key: 'wide', id: 'cambiste-make-the-connection', out: 'cambiste-make-the-connection-1920x1080.mp4'},
  {key: 'tall', id: 'cambiste-make-the-connection-vertical', out: 'cambiste-make-the-connection-1080x1920.mp4'},
];
const only = process.argv.slice(2);
mkdirSync(join(ROOT, 'out'), {recursive: true});

let failed = 0;
for (const j of JOBS) {
  if (only.length && !only.includes(j.key)) continue;
  process.stdout.write(`${j.out} … `);
  const t0 = Date.now();
  const r = spawnSync(
    join(ROOT, 'node_modules', '.bin', 'remotion'),
    ['render', 'src/index.ts', j.id, `out/.tmp-${j.out}`, '--concurrency=1', '--log=error'],
    {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']}
  );
  if (r.status === 0) {
    /* La piste AAC depasse la video de quelques centiemes : on coupe le
       conteneur a 30,000 s sans toucher aux 900 images. */
    const cut = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', join(ROOT, 'out', `.tmp-${j.out}`),
                                     '-t', '30', '-c', 'copy', '-movflags', '+faststart',
                                     join(ROOT, 'out', j.out)]);
    if (cut.status !== 0) {failed++; console.log('ECHEC (coupe)');}
    rmSync(join(ROOT, 'out', `.tmp-${j.out}`), {force: true});
  }
  if (r.status === 0) {
    console.log(`ok (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  } else {
    failed++;
    console.log('ECHEC');
    process.stderr.write(String(r.stderr ?? '').slice(-2500) + '\n');
  }
}

/* Les trois images cles de direction artistique, en pleine resolution. */
const STILLS = [
  {f: 96, out: 'direction-1-two-systems.png'},
  {f: 352, out: 'direction-2-make-the-connection.png'},
  {f: 648, out: 'direction-3-visibility.png'},
];
if (!only.length || only.includes('stills')) {
  for (const st of STILLS) {
    process.stdout.write(`${st.out} … `);
    const r = spawnSync(
      join(ROOT, 'node_modules', '.bin', 'remotion'),
      ['still', 'src/index.ts', 'cambiste-make-the-connection', `out/${st.out}`,
       `--frame=${st.f}`, '--log=error'],
      {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']}
    );
    console.log(r.status === 0 ? 'ok' : 'ECHEC');
    if (r.status !== 0) failed++;
  }
}

process.exit(failed ? 1 : 0);
