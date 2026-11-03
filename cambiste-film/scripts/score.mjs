#!/usr/bin/env node
/* =========================================================================
   LA BANDE SON
   Une texture electronique minimale, ecrite ici plutot que prise ailleurs :
   aucune licence a verifier, et chaque accent tombe exactement sur l'image
   qui le demande. Synthese additive, enveloppes douces, aucun bruit de
   piece, de tiroir-caisse ni de glitch.

   Sortie : public/score.wav — 48 kHz, stereo, 16 bits, 30,000 s.
   ========================================================================= */
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SR = 48000;
const DUR = 30;
const N = SR * DUR;
const L = new Float64Array(N);
const R = new Float64Array(N);

/* Generateur deterministe : le meme fichier a chaque execution. */
let seed = 20481;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296 - 0.5;
};

const add = (i, l, r) => {
  if (i < 0 || i >= N) return;
  L[i] += l;
  R[i] += r;
};

/** Enveloppe douce : attaque, maintien, chute exponentielle. */
const env = (t, a, d, s, r, dur) => {
  if (t < 0) return 0;
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - s) * ((t - a) / d);
  if (t < dur - r) return s;
  if (t < dur) return s * (1 - (t - (dur - r)) / r);
  return 0;
};

/** Une voix sinusoidale, legerement desaccordee et placee dans le champ. */
const tone = (start, dur, freq, gain, pan = 0, a = 0.6, r = 1.2, detune = 0.15) => {
  const i0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  const lg = Math.cos(((pan + 1) * Math.PI) / 4);
  const rg = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const e = env(t, a, dur * 0.3, 0.82, r, dur);
    const v =
      (Math.sin(2 * Math.PI * freq * t) +
        0.5 * Math.sin(2 * Math.PI * (freq + detune) * t + 1.1) +
        0.22 * Math.sin(4 * Math.PI * freq * t)) *
      e *
      gain;
    add(i0 + k, v * lg, v * rg);
  }
};

/** Une cloche feutree : l'accent d'alignement, jamais un carillon. */
const bell = (start, freq, gain, pan = 0, decay = 1.6) => {
  const i0 = Math.floor(start * SR);
  const n = Math.floor(decay * SR);
  const lg = Math.cos(((pan + 1) * Math.PI) / 4);
  const rg = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const e = Math.exp(-t * (3.4 / decay)) * Math.min(1, t / 0.004);
    const v =
      (Math.sin(2 * Math.PI * freq * t) +
        0.42 * Math.sin(2 * Math.PI * freq * 2.01 * t) +
        0.18 * Math.sin(2 * Math.PI * freq * 3.02 * t)) *
      e *
      gain;
    add(i0 + k, v * lg, v * rg);
  }
};

/** Un souffle filtre : le deplacement d'un signal, sans whoosh. */
const air = (start, dur, gain, pan = 0, cut = 0.08) => {
  const i0 = Math.floor(start * SR);
  const n = Math.floor(dur * SR);
  const lg = Math.cos(((pan + 1) * Math.PI) / 4);
  const rg = Math.sin(((pan + 1) * Math.PI) / 4);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    lp += (rnd() - lp) * cut;
    const e = Math.sin(Math.PI * Math.min(1, t / dur)) ** 2;
    const v = lp * e * gain;
    add(i0 + k, v * lg, v * rg);
  }
};

/** Un point rythmique tres doux : la precision, pas la percussion. */
const tick = (start, gain, freq = 1600, pan = 0) => {
  const i0 = Math.floor(start * SR);
  const n = Math.floor(0.09 * SR);
  const lg = Math.cos(((pan + 1) * Math.PI) / 4);
  const rg = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const e = Math.exp(-t * 46);
    const v = Math.sin(2 * Math.PI * freq * t) * e * gain;
    add(i0 + k, v * lg, v * rg);
  }
};

/* ---- ACTE I : le manque de connexion (0 – 7 s) -------------------------
   Une texture legere et espacee. Rien ne se resout.                      */
tone(0, 9.5, 110, 0.1, -0.25, 2.2, 2.4); // bourdon La2
tone(0.4, 9.2, 164.81, 0.068, 0.3, 2.6, 2.6); // quinte
tone(2.0, 6.5, 220, 0.03, 0, 2.2, 2.0);
air(0.45, 1.9, 0.055, -0.4); // l'impulsion monte dans le systeme de gauche
bell(2.45, 523.25, 0.05, -0.35, 1.1); // elle arrive au bord du vide
air(2.3, 2.6, 0.03, 0.45, 0.05); // la lumiere revele l'autre structure

/* ---- ACTE II : la connexion (7 – 13 s) ---------------------------------
   L'harmonie s'ouvre : la tierce arrive, puis l'accent de connexion.     */
tone(7.0, 7.4, 110, 0.1, -0.25, 1.4, 2.0);
tone(7.0, 7.4, 164.81, 0.075, 0.25, 1.6, 2.0);
tone(7.1, 7.0, 261.63, 0.055, 0.1, 1.8, 2.2); // Do4 : l'ouverture
bell(7.1, 1046.5, 0.035, 0.2, 0.9); // la structure parait
[8.7, 9.25, 9.8].forEach((t, i) => {
  air(t, 0.7, 0.04, -0.3 + i * 0.3, 0.12); // chaque voie traverse
  bell(t + 0.52, 784 + i * 98, 0.034, -0.25 + i * 0.25, 0.8);
});
tone(10.0, 5.2, 329.63, 0.05, -0.1, 1.2, 1.8); // Mi4
bell(10.05, 659.25, 0.075, 0, 2.4); // l'accent de connexion
air(10.0, 1.5, 0.05, 0, 0.1);
bell(11.5, 987.77, 0.045, 0.3, 1.6); // la reponse du systeme de droite

/* ---- ACTE III : la circulation coordonnee (13 – 17 s) ------------------
   Un rythme discret s'installe. Trois micro-accents pour trois natures
   de signal.                                                              */
tone(13.0, 5.0, 110, 0.085, -0.2, 0.8, 1.4);
tone(13.0, 5.0, 196, 0.06, 0.2, 1.0, 1.4);
tone(13.2, 4.6, 329.63, 0.04, 0, 1.2, 1.4);
for (let k = 0; k < 16; k++) tick(13.1 + k * 0.25, 0.022 + (k % 4 === 0 ? 0.014 : 0), 1500, (k % 2 ? 0.3 : -0.3));
[13.5, 14.4, 15.3].forEach((t, i) => bell(t, 880 + i * 110, 0.04, -0.3 + i * 0.3, 1.0));

/* ---- ACTE IV : l'interface (17 – 23 s) ---------------------------------
   Plus precis encore, et plus clair : on est passe de l'infrastructure a
   sa lecture.                                                             */
tone(17.0, 6.4, 146.83, 0.08, -0.2, 0.9, 1.6); // Re3
tone(17.0, 6.4, 220, 0.06, 0.2, 1.0, 1.6);
tone(17.2, 6.0, 349.23, 0.042, 0.05, 1.2, 1.6); // Fa4
for (let k = 0; k < 24; k++) tick(17.2 + k * 0.25, 0.018, 1800, k % 2 ? 0.25 : -0.25);
[18.52, 19.2, 19.87].forEach((t, i) => bell(t, 1046.5 + i * 60, 0.038, 0.1 * i, 0.7)); // les trois etapes
bell(20.35, 1318.5, 0.055, 0, 1.4); // le rapprochement
air(20.3, 0.5, 0.025, 0.2, 0.2);

/* ---- ACTE V : la promesse et la signature (23 – 30 s) ------------------
   Tout se resout, puis se tait. Les deux dernieres secondes respirent.   */
tone(23.0, 4.2, 110, 0.095, -0.2, 1.0, 1.6);
tone(23.0, 4.2, 164.81, 0.07, 0.2, 1.1, 1.6);
tone(23.1, 4.0, 261.63, 0.05, 0, 1.3, 1.6);
bell(23.05, 659.25, 0.04, -0.2, 1.8);
// signature : un accord court et memorable, puis la decrue
tone(26.3, 3.7, 110, 0.1, 0, 0.5, 2.6);
tone(26.3, 3.7, 164.81, 0.075, -0.3, 0.6, 2.6);
tone(26.35, 3.6, 261.63, 0.06, 0.3, 0.7, 2.6);
tone(26.4, 3.5, 392, 0.04, 0.1, 0.9, 2.5); // Sol4
bell(26.35, 1318.5, 0.06, 0, 2.8);
bell(26.95, 1760, 0.03, 0.25, 2.0);

/* ---- Finition : douceur, limitation, silence propre -------------------- */
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write('WAVE', 8);
out.write('fmt ', 12);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write('data', 36);
out.writeUInt32LE(N * 4, 40);

const soft = (x) => Math.tanh(x * 1.6) / 1.6;
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const norm = peak > 0 ? 0.72 / peak : 1;
for (let i = 0; i < N; i++) {
  /* fondu d'ouverture et de fermeture : aucun clic aux extremites */
  const fade = Math.min(1, i / (SR * 0.12), (N - i) / (SR * 0.5));
  const l = soft(L[i] * norm) * fade;
  const r = soft(R[i] * norm) * fade;
  out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(l * 32767))), 44 + i * 4);
  out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(r * 32767))), 46 + i * 4);
}
mkdirSync(join(ROOT, 'public'), {recursive: true});
writeFileSync(join(ROOT, 'public', 'score.wav'), out);
console.log(`score.wav : ${DUR} s, ${SR} Hz, stereo — crete avant normalisation ${peak.toFixed(3)}`);
