/* =========================================================================
   CAMBISTE — moteur de spots
   Le langage visuel de la marque, factorise pour produire une serie.
   Un spot ne decrit que son contenu : la duree de ses plans, leur fond et
   ce qu'ils dessinent. Le moteur tient la charte, la typographie animee,
   les blocs de schema, les volets et le montage.

   Regle d'or du montage : les bornes de plans sont DERIVEES des durees,
   jamais saisies deux fois. Un plan ne peut donc pas demarrer avec son
   animation deja terminee.
   ========================================================================= */
window.CAMBISTE = (function () {

const W = 1080, H = 1080, FPS = 30;
let ctx = null;

/* ---- Palette ------------------------------------------------------------
   Les FONDS ne prennent que des valeurs blanc ou vert. Aucun aplat sombre.
   Les couleurs vives vivent dans la typographie et les details.          */
const C = {
  green : '#0AB064',   // vert Cambiste, aplat signature
  mint  : '#E8F6EF',   // vert de marque eclairci — fond des schemas
  forest: '#055731',   // vert de marque assombri — seul fond portant l'or
  leaf  : '#7FD9AE',   // teinte claire — filets et accents sur vert profond
  blue  : '#2361EA',   // bleu d'accent — la valeur en mouvement
  ink   : '#0B0B0C',
  white : '#FFFFFF'
};
const BG = { white: C.white, green: C.green, mint: C.mint, forest: C.forest };

const M = 92, MAXW = W - M * 2;

/* ---- Utilitaires -------------------------------------------------------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg   = (f, a, b) => clamp((f - a) / (b - a));
const eo    = x => 1 - Math.pow(1 - x, 3);
const eio   = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2;
const wipeE = x => x < .5 ? 2*x*x : 1 - Math.pow(-2*x + 2, 2)/2;
const back  = x => { const c1 = 1.9, c3 = c1 + 1;
                     return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2); };
const mix   = (a, b, t) => a + (b - a) * t;

function rng(seed){ return function(){
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};}

function alpha(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;
}

/* ---- Typographie -------------------------------------------------------- */
function font(size, o = {}){
  ctx.font = `${o.w || 800} ${size}px Outfit, sans-serif`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = (o.tr || 0) + 'px';
}
function fit(t, maxW, start, o = {}){
  let s = start; font(s, o);
  while (ctx.measureText(t).width > maxW && s > 12){ s -= 1; font(s, o); }
  return s;
}
function widthOf(t, size, o){ font(size, o); return ctx.measureText(t).width; }

function text(str, x, y, size, o = {}, align = 'left', a = 1){
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(a);
  ctx.textAlign = align;
  ctx.fillStyle = o.color || C.ink;
  font(size, o);
  ctx.fillText(str, x, y);
  ctx.restore();
}

/** Texte secondaire : il monte de quelques pixels en apparaissant. */
function textRise(str, x, y, size, o, align, p, rise = 16){
  if (p <= 0) return;
  text(str, x, y + (1 - eo(p)) * rise, size, o, align, clamp(p * 1.4));
}

/**
 * Titre revele MOT A MOT : chaque mot monte derriere son propre masque, avec
 * un decalage, et se pose avec un leger rebond. L'oeil suit la phrase
 * s'ecrire au lieu de la recevoir d'un bloc.
 *   l : image courante dans le plan       a    : image de depart du 1er mot
 *   step : decalage d'un mot au suivant   dur  : duree de montee d'un mot
 */
function revealWords(t, x, y, size, o, l, a, step, dur, align = 'left'){
  const words = t.split(' ');
  font(size, o);
  const sp  = ctx.measureText(' ').width;
  const wid = words.map(m => { font(size, o); return ctx.measureText(m).width; });
  const tot = wid.reduce((s, v) => s + v, 0) + sp * (words.length - 1);
  let cx = align === 'center' ? x - tot / 2 : x;
  const asc = size * 1.10, desc = size * .32;
  for (let i = 0; i < words.length; i++){
    const p = seg(l, a + i * step, a + i * step + dur);
    if (p > 0){
      const em = eo(clamp(p * 1.3));       // le masque ouvre avant le mot
      const ey = back(eo(p));              // atterrissage avec rebond
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - size * .1, y + desc - (asc + desc) * em,
               wid[i] + size * .2, (asc + desc) * em);
      ctx.clip();
      ctx.globalAlpha = clamp(p * 2.2);
      ctx.textAlign = 'left';
      ctx.fillStyle = o.color || C.ink;
      font(size, o);
      ctx.fillText(words[i], cx, y + (1 - ey) * size * .30);
      ctx.restore();
    }
    cx += wid[i] + sp;
  }
  return { end: a + (words.length - 1) * step + dur, width: tot };
}

/** Ligne posee d'un bloc derriere un masque montant (titres d'un seul mot). */
function reveal(t, x, y, size, o, p, align = 'left'){
  if (p <= 0) return;
  const e = eo(p), asc = size * 1.06, desc = size * .30;
  const w = widthOf(t, size, o) + size * .3;
  const x0 = align === 'center' ? x - w/2 : x - size * .12;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y + desc - (asc + desc) * e, w, (asc + desc) * e);
  ctx.clip();
  ctx.globalAlpha = clamp(p * 1.8);
  ctx.textAlign = align;
  ctx.fillStyle = o.color || C.ink;
  font(size, o);
  ctx.fillText(t, x, y + (1 - e) * size * .24);
  ctx.restore();
}

/**
 * Titre multi-lignes cale sur la marge, corps ajuste sur la ligne la plus
 * longue pour que toutes partagent la meme graisse optique.
 */
function headline(lines, x, y, maxSize, o, l, a, step, dur, align = 'left'){
  const longest = lines.reduce((m, t) => t.length > m.length ? t : m, '');
  const s = fit(longest, MAXW, maxSize, o);
  let end = a;
  lines.forEach((t, i) => {
    const oi = Object.assign({}, o, lines.colors ? { color: lines.colors[i] } : {});
    const r = revealWords(t, x, y + i * s * (o.lh || 1.14), s, oi,
                          l, a + i * step, o.wordStep || 5, dur, align);
    end = Math.max(end, r.end);
  });
  return { size: s, end };
}

/* ---- Formes ------------------------------------------------------------- */
function roundRect(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}
function bg(c){ ctx.fillStyle = BG[c] || c; ctx.fillRect(0, 0, W, H); }

/* ---- Logo --------------------------------------------------------------- */
const LOCK = { wm: 493/84, mk: 110/84, gap: 28/84, tag: 35/84, drop: 58/84 };
let WM = { black: null, white: null, ready: false }, markPath = null;

function tint(img, color){
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}

/** Carre de marque : superellipse ajustee sur le profil mesure du logo. */
function squircle(w, h, R, n){
  const N = 16;
  const corner = t => [R - R * Math.pow(Math.cos(t), 2/n),
                       R - R * Math.pow(Math.sin(t), 2/n)];
  ctx.beginPath();
  for (let i = 0; i <= N; i++){ const [x, y] = corner(i/N * Math.PI/2);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  for (let i = 0; i <= N; i++){ const [x, y] = corner(Math.PI/2 - i/N * Math.PI/2);
    ctx.lineTo(w - x, y); }
  for (let i = 0; i <= N; i++){ const [x, y] = corner(i/N * Math.PI/2);
    ctx.lineTo(w - x, h - y); }
  for (let i = 0; i <= N; i++){ const [x, y] = corner(Math.PI/2 - i/N * Math.PI/2);
    ctx.lineTo(x, h - y); }
  ctx.closePath();
}

function drawMark(x, y, h){
  const B = BRAND.mark, s = h / B.vbh, Rv = B.R * B.vbw / B.w;
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.green; squircle(B.vbw, B.vbh, Rv, B.n); ctx.fill();
  ctx.fillStyle = C.white; ctx.fill(markPath);
  ctx.save();                                  // second lobe = rotation 180°
  ctx.translate(B.cx, B.cy); ctx.rotate(Math.PI); ctx.translate(-B.cx, -B.cy);
  ctx.fill(markPath);
  ctx.restore(); ctx.restore();
}

/** Verrouillage logotype + marque, centre, hauteur de capitale h. */
function lockup(cx, cy, h, dark, pw = 1, pm = 1, tagP = 0){
  const wmW = LOCK.wm * h, mkW = LOCK.mk * h;
  const tot = wmW + LOCK.gap * h + mkW;
  const x0 = cx - tot / 2, y0 = cy - h / 2;
  if (pw > 0 && WM.ready){
    ctx.save();
    ctx.globalAlpha = clamp(pw * 6);           // le logotype s'ecrit, il ne fond pas
    ctx.beginPath(); ctx.rect(x0 - 4, y0 - h, wmW * eo(pw) + 4, h * 3); ctx.clip();
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(dark ? WM.white : WM.black, x0, y0, wmW, h);
    ctx.restore();
  }
  if (pm > 0){
    const e = back(eo(pm));
    ctx.save();
    ctx.globalAlpha = clamp(pm * 2);
    ctx.translate(x0 + wmW + LOCK.gap * h + mkW/2, cy);
    ctx.rotate((1 - e) * -0.45);
    ctx.scale(.4 + .6*e, .4 + .6*e);
    drawMark(-mkW/2, -h/2, h);
    ctx.restore();
  }
  if (tagP > 0)
    text(BRAND.tagline, cx, cy + h/2 + LOCK.drop * h + LOCK.tag * h,
         LOCK.tag * h * 1.34, { w: 700, tr: .5, color: dark ? C.white : C.ink },
         'center', eo(tagP));
}

/* ---- Confettis ---------------------------------------------------------- */
const CONF = (function(){
  const r = rng(20260824), out = [];
  const cols = [C.green, C.blue, C.leaf, C.green, C.blue, C.leaf, C.green];
  for (let i = 0; i < 96; i++)
    out.push({ a: r()*Math.PI*2, v: 380 + r()*880, s: 13 + r()*23,
               col: cols[(r()*cols.length)|0], sh: r() > .45 ? 0 : 1,
               rot: r()*Math.PI*2, rv: (r()-.5)*9, dl: r()*.16 });
  return out;
})();

function burst(cx, cy, tau){
  if (tau <= 0) return;
  for (const p of CONF){
    const t = tau - p.dl;
    if (t <= 0) continue;
    const s = p.v * (1 - Math.exp(-2.7 * t)) / 2.7;
    const x = cx + Math.cos(p.a) * s;
    const y = cy + Math.sin(p.a) * s + 560 * t * t;
    if (y > H + 90 || x < -90 || x > W + 90) continue;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(p.rot + p.rv * t);
    ctx.globalAlpha = clamp(t * 7);
    ctx.fillStyle = p.col;
    const sz = p.s * clamp(t * 6);
    if (p.sh === 0){ ctx.beginPath(); ctx.arc(0, 0, sz*.6, 0, 7); ctx.fill(); }
    else           { roundRect(-sz*.5, -sz*.5, sz, sz, sz*.28); ctx.fill(); }
    ctx.restore();
  }
}

/* =========================================================================
   BLOCS DE SCHEMA — le vocabulaire visuel partage par toute la serie
   ========================================================================= */

/** Carte : le bloc de base des schemas. `tone` : 'plain' | 'brand'. */
function card(cx, cy, w, h, title, sub, p, tone = 'plain', bump = 1){
  if (p <= 0) return;
  const e = back(eo(p)), brand = tone === 'brand';
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale((.82 + .18*e) * bump, (.82 + .18*e) * bump);
  ctx.globalAlpha = clamp(p * 2);
  roundRect(-w/2, -h/2, w, h, Math.min(32, h * .21));
  ctx.fillStyle = brand ? C.green : C.white;
  ctx.fill();
  // le titre s'ajuste a la LARGEUR de la carte autant qu'a sa hauteur : une
  // regle calee sur la seule hauteur laissait les cartes larges sous-remplies
  const to = { w: 800, tr: .4, color: brand ? C.white : C.ink };
  const ts = fit(title, w - 44, Math.min(36, h * .30), to);
  const ss = Math.min(23, h * .15);
  text(title, 0, sub ? -ss * .35 : ts * .36, ts, to, 'center');
  if (sub)
    text(sub, 0, ts * .62 + ss, ss, { w: 500,
         color: brand ? alpha(C.white, .85) : alpha(C.ink, .5) }, 'center');
  ctx.restore();
}

/** Rail pointille reliant deux points, trace de gauche a droite. */
function rail(x0, x1, y, p, col = C.green, a = .45){
  if (p <= 0) return;
  ctx.save();
  ctx.strokeStyle = alpha(col, a);
  ctx.lineWidth = 4; ctx.setLineDash([2, 16]); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * eo(p), y);
  ctx.stroke();
  ctx.restore();
}

/** Jeton de valeur qui parcourt un rail. A dessiner AVANT les cartes. */
function token(x0, x1, y, p, col = C.blue){
  if (p <= 0 || p >= 1) return null;
  const x = x0 + (x1 - x0) * eio(p);
  ctx.save();
  ctx.globalAlpha = .22; ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x, y, 46, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(x, y, 21, 0, 7); ctx.fill();
  ctx.restore();
  return x;
}

/** Fleche verticale entre deux etages d'une pile. */
function arrowDown(x, y0, y1, p, col = C.green){
  if (p <= 0) return;
  const y = y0 + (y1 - y0) * eo(p);
  ctx.save();
  ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y); ctx.stroke();
  if (p > .75){
    const q = seg(p, .75, 1) * 16;
    ctx.beginPath();
    ctx.moveTo(x - q, y1 - q * 1.1); ctx.lineTo(x, y1);
    ctx.lineTo(x + q, y1 - q * 1.1);
    ctx.stroke();
  }
  ctx.restore();
}

/** Ligne de controle validee : le libelle glisse, la coche tombe. */
function check(label, x, y, pr, pc, size = 40){
  if (pr <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(pr * 2);
  ctx.translate((1 - eo(pr)) * -46, 0);
  const e = Math.max(back(eo(pc)), 0);
  ctx.save();
  ctx.translate(x + 34, y - 12);
  ctx.scale(.4 + .6*e, .4 + .6*e);
  ctx.globalAlpha = clamp(pc * 3) * clamp(pr * 2);
  ctx.fillStyle = C.green;
  ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fill();
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(-3, 11); ctx.lineTo(13, -10);
  ctx.stroke();
  ctx.restore();
  if (pc > 0 && pc < 1){
    ctx.save();
    ctx.globalAlpha = (1 - pc) * .5;
    ctx.strokeStyle = C.green; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x + 34, y - 12, 30 + pc * 40, 0, 7); ctx.stroke();
    ctx.restore();
  }
  text(label, x + 88, y, size, { w: 700, color: C.ink }, 'left');
  ctx.restore();
}

/** Grand nombre qui defile puis se fige. */
function counter(value, suffix, cx, cy, size, p, o = {}){
  if (p <= 0) return;
  const e = eo(clamp(p * 1.15));
  const shown = value * e;
  const str = (e >= 1 ? value : shown).toFixed(o.dec === undefined ? 1 : o.dec)
              + (e >= 1 ? suffix : '');
  ctx.save();
  const s = back(eo(clamp(p * 1.3)));
  ctx.translate(cx, cy);
  ctx.scale(.9 + .1 * s, .9 + .1 * s);
  text(str, 0, 0, size, Object.assign({ w: 800, tr: -3, color: C.ink }, o),
       'center', clamp(p * 3));
  ctx.restore();
}

/**
 * Faisceau entre un point unique et n points repartis.
 * `out` faux : les sources convergent vers (tx, ty).
 * `out` vrai : le trait part de (tx, ty) et se deploie vers les sources.
 */
function fanIn(sources, tx, ty, p, col = C.green, out = false){
  ctx.save();
  ctx.strokeStyle = alpha(col, .5); ctx.lineWidth = 4; ctx.lineCap = 'round';
  sources.forEach((s, i) => {
    const q = seg(p, i * .12, .55 + i * .12);
    if (q <= 0) return;
    const e = eo(q);
    ctx.beginPath();
    if (out){
      ctx.moveTo(tx, ty);
      ctx.bezierCurveTo(mix(tx, s.x, .5), ty, mix(tx, s.x, .45), s.y,
                        mix(tx, s.x, e), mix(ty, s.y, e));
    } else {
      ctx.moveTo(s.x, s.y);
      ctx.bezierCurveTo(mix(s.x, tx, .55), s.y, mix(s.x, tx, .5), ty,
                        mix(s.x, tx, e), mix(s.y, ty, e));
    }
    ctx.stroke();
  });
  ctx.restore();
}

/** Reseau de noeuds relies, qui s'allume progressivement. */
function network(seed, n, box, p, col = C.green){
  const r = rng(seed), pts = [];
  for (let i = 0; i < n; i++)
    pts.push({ x: box[0] + r() * (box[2] - box[0]),
               y: box[1] + r() * (box[3] - box[1]),
               s: 6 + r() * 8, d: r() });
  ctx.save();
  ctx.strokeStyle = alpha(col, .42); ctx.lineWidth = 2.4;
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++){
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist > 210) continue;
      const q = seg(p, .15 + pts[i].d * .5, .55 + pts[i].d * .5);
      if (q <= 0) continue;
      ctx.globalAlpha = q * (1 - dist / 210) * .9;
      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(mix(pts[i].x, pts[j].x, eo(q)), mix(pts[i].y, pts[j].y, eo(q)));
      ctx.stroke();
    }
  ctx.globalAlpha = 1;
  pts.forEach(pt => {
    const q = seg(p, pt.d * .5, .2 + pt.d * .5);
    if (q <= 0) return;
    ctx.fillStyle = col;
    ctx.globalAlpha = clamp(q * 2);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.s * Math.max(back(eo(q)), 0), 0, 7);
    ctx.fill();
  });
  ctx.restore();
  return pts;
}

/* ---- Plans communs a toute la serie ------------------------------------- */

/**
 * Plan de chute : une phrase en blanc sur vert profond, soulignee d'un filet
 * vert clair. Le vert profond porte le blanc a 8,7:1 et donne au plan une
 * identite distincte du vert vif employe ailleurs.
 */
function closer(lines, sec, opts){
  opts = opts || {};
  return { name: 'chute', sec: sec, bg: 'forest',
    tin: opts.tin === undefined ? 15 : opts.tin, wipe: opts.wipe || 'left',
    draw: function(l){
      const last = lines[lines.length - 1];
      const s = fit(last, MAXW, opts.size || 104, { w: 800, tr: -3 });
      const lh = s * 1.10;
      const y0 = (opts.y || H/2 + s * .18) - (lines.length - 1) * lh / 2;
      lines.forEach(function(t, i){
        const key = i === lines.length - 1;      // la derniere ligne porte la chute
        revealWords(t, W/2, y0 + i * lh, key ? s : s * .70,
          { w: key ? 800 : 600, tr: key ? -3 : -1,
            color: key ? C.white : alpha(C.white, .62) },
          l, 12 + i * 6, 6, 16, 'center');
      });
      const pu = eo(seg(l, 12 + lines.length * 6 + 18, 12 + lines.length * 6 + 32));
      if (pu > 0){
        const wl = widthOf(last, s, { w: 800, tr: -3 });
        ctx.fillStyle = C.leaf;
        ctx.fillRect(W/2 - wl/2, y0 + (lines.length - 1) * lh + s * .26, wl * pu, 7);
      }
    } };
}

/** Plan de signature : confettis, logo, signature de marque. */
function signature(sec){
  return { name: 'signature', sec: sec || 3, bg: 'white', tin: 16, wipe: 'circle',
    draw: function(l){
      const g = ctx.createRadialGradient(W/2, 500, 40, W/2, 500, 660);
      g.addColorStop(0, alpha(C.green, .16));
      g.addColorStop(1, alpha(C.green, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      burst(W/2, 492, (l - 2) / FPS);
      lockup(W/2, 512, 92, false, seg(l, 12, 30), seg(l, 19, 35), seg(l, 28, 44));
    } };
}

/** Fleche horizontale tracee (le glyphe fleche manque au sous-ensemble). */
function arrowRight(x0, x1, y, p, col, thick){
  if (p <= 0) return;
  col = col || C.green; thick = thick || 6;
  const x = x0 + (x1 - x0) * eo(p);
  ctx.save();
  ctx.strokeStyle = col; ctx.lineWidth = thick;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x, y); ctx.stroke();
  if (p > .7){
    const q = seg(p, .7, 1) * thick * 2.8;
    ctx.beginPath();
    ctx.moveTo(x1 - q * 1.1, y - q); ctx.lineTo(x1, y);
    ctx.lineTo(x1 - q * 1.1, y + q);
    ctx.stroke();
  }
  ctx.restore();
}

/* =========================================================================
   MONTAGE
   Les bornes sont derivees des durees : elles ne peuvent pas diverger.
   ========================================================================= */
const WIPES = {
  top    : p => { ctx.beginPath(); ctx.rect(0, 0, W, H * p); },
  bottom : p => { ctx.beginPath(); ctx.rect(0, H * (1 - p), W, H * p); },
  left   : p => { ctx.beginPath(); ctx.rect(0, 0, W * p, H); },
  right  : p => { ctx.beginPath(); ctx.rect(W * (1 - p), 0, W * p, H); },
  circle : p => { ctx.beginPath(); ctx.arc(W/2, H/2 - 48, 800 * p, 0, 7); }
};

function build(spot){
  let t = 0;
  const sc = spot.scenes.map(s => {
    const dur = Math.round(s.sec * FPS);
    const o = Object.assign({}, s, { start: t, end: t + dur - 1, dur });
    t += dur;
    return o;
  });
  const total = t;

  function renderFrame(f){
    f = Math.max(0, Math.min(total - 1, f | 0));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    let i = sc.length - 1;
    while (i > 0 && f < sc[i].start) i--;
    const s = sc[i];
    const tin = s.tin || 0;
    bg(s.bg);
    if (i > 0 && tin && f < s.start + tin){
      const prev = sc[i - 1];
      bg(prev.bg);
      prev.draw(prev.dur - 1, prev);
      ctx.save();
      (typeof s.wipe === 'function' ? s.wipe : WIPES[s.wipe] || WIPES.top)
        (wipeE(seg(f, s.start, s.start + tin)));
      ctx.clip();
      bg(s.bg);
      s.draw(f - s.start, s);
      ctx.restore();
    } else {
      s.draw(f - s.start, s);
    }
  }
  return { renderFrame, total, scenes: sc };
}

/* ---- Amorcage ----------------------------------------------------------- */
function boot(canvas, spot, done){
  ctx = canvas.getContext('2d');
  markPath = new Path2D(BRAND.mark.lobe);
  const img = new Image();
  img.onload = function(){
    WM.black = tint(img, C.ink);
    WM.white = tint(img, C.white);
    WM.ready = true;
    document.fonts.load('800 100px Outfit')
      .then(() => document.fonts.load('500 38px Outfit'))
      .then(() => document.fonts.load('700 40px Outfit'))
      .then(() => document.fonts.ready)
      .then(() => {
        const b = build(spot);
        window.renderFrame = b.renderFrame;
        window.TOTAL = b.total;
        window.SCENES = b.scenes.map(s => ({ start: s.start, end: s.end,
                                             tin: s.tin || 0, name: s.name || '' }));
        b.renderFrame(0);
        window.ready = true;
        if (done) done(b);
      });
  };
  img.src = BRAND.wordmark;
}

return { W, H, FPS, C, M, MAXW, boot, build,
         clamp, seg, eo, eio, back, wipeE, mix, rng, alpha,
         font, fit, widthOf, text, textRise, reveal, revealWords, headline,
         roundRect, bg, drawMark, lockup,
         burst, card, rail, token, arrowDown, check,
         counter, fanIn, network, closer, signature, arrowRight,
         get ctx(){ return ctx; } };
})();
