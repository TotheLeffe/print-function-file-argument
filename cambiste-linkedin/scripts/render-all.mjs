#!/usr/bin/env node
/* =========================================================================
   Rendu des 14 spots : out/cambiste-linkedin-01.mp4 … -14.mp4

   --muted : sans cela Remotion ajoute une piste audio silencieuse dont le
   dernier paquet allonge le conteneur de deux images. Les films sont muets
   par choix — LinkedIn demarre la lecture sans son — donc la piste n'a
   aucune raison d'exister.

   Un seul rendu a la fois : chaque navigateur de rendu occupe beaucoup de
   memoire, et la serie n'est pas pressee.

   Usage : node scripts/render-all.mjs [01 05 12]
   ========================================================================= */
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const only = process.argv.slice(2).filter((a) => /^\d{2}$/.test(a));
const ids = only.length
  ? only
  : Array.from({length: 14}, (_, i) => String(i + 1).padStart(2, '0'));

mkdirSync(join(ROOT, 'out'), {recursive: true});

let failed = 0;
for (const id of ids) {
  const name = `cambiste-linkedin-${id}`;
  process.stdout.write(`${name} … `);
  const t0 = Date.now();
  const r = spawnSync(
    join(ROOT, 'node_modules', '.bin', 'remotion'),
    ['render', 'src/index.ts', name, `out/${name}.mp4`, '--muted', '--log=error'],
    {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']}
  );
  if (r.status === 0) {
    console.log(`ok (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  } else {
    failed++;
    console.log('ECHEC');
    process.stderr.write(String(r.stderr ?? '').slice(-2000) + '\n');
  }
}

console.log(failed ? `\n${failed} rendu(s) en echec` : `\n${ids.length} rendus termines`);
process.exit(failed ? 1 : 0);
